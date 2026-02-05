using System.Text.Json;
using System.Web;
using OfficeReddit.Models;

namespace OfficeReddit.Services;

public class RedditService : IRedditService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<RedditService> _logger;

    // Extensiones de imagen comunes
    private static readonly string[] ImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private static readonly string[] VideoExtensions = { ".mp4", ".webm", ".gifv" };
    private static readonly string[] ImageDomains = { "i.redd.it", "i.imgur.com", "imgur.com" };

    public RedditService(IHttpClientFactory httpClientFactory, ILogger<RedditService> logger)
    {
        _httpClient = httpClientFactory.CreateClient("Reddit");
        _logger = logger;
    }

    public async Task<PaginatedResponse<RedditPost>> GetPostsAsync(
        string subreddit = "all",
        int limit = 25,
        string? after = null,
        string? before = null,
        string sort = "hot",
        bool includeNsfw = false)
    {
        try
        {
            // Validar el ordenamiento
            var validSorts = new[] { "hot", "new", "top", "rising" };
            if (!validSorts.Contains(sort.ToLower()))
                sort = "hot";

            // Pedir más posts para compensar los que se filtran por NSFW
            var requestLimit = Math.Min(limit + 10, 100);
            var url = $"r/{subreddit}/{sort}.json?limit={requestLimit}&raw_json=1";

            if (!string.IsNullOrEmpty(after))
            {
                url += $"&after={after}";
            }
            if (!string.IsNullOrEmpty(before))
            {
                url += $"&before={before}";
            }

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<RedditApiResponse>(json);

            if (apiResponse?.Data?.Children == null)
            {
                return new PaginatedResponse<RedditPost>();
            }

            // Filtrar NSFW condicionalmente y mapear
            var posts = apiResponse.Data.Children
                .Where(c => c.Data != null && (includeNsfw || !c.Data.IsNsfw))
                .Take(limit)
                .Select(c => MapToRedditPost(c.Data!))
                .ToList();

            return new PaginatedResponse<RedditPost>
            {
                Items = posts,
                After = apiResponse.Data.After,
                Before = apiResponse.Data.Before
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching posts from r/{Subreddit}", subreddit);
            return new PaginatedResponse<RedditPost>();
        }
    }

    public async Task<RedditPost?> GetPostByIdAsync(string subreddit, string postId)
    {
        try
        {
            var url = $"r/{subreddit}/comments/{postId}.json?raw_json=1";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(json);

            var postData = document.RootElement[0]
                .GetProperty("data")
                .GetProperty("children")[0]
                .GetProperty("data");

            // Verificar si es NSFW
            if (postData.TryGetProperty("over_18", out var nsfw) && nsfw.GetBoolean())
            {
                _logger.LogWarning("Attempted to access NSFW post {PostId}", postId);
                return null;
            }

            var selfText = postData.GetProperty("selftext").GetString() ?? string.Empty;
            var selfTextHtml = postData.TryGetProperty("selftext_html", out var html)
                ? HttpUtility.HtmlDecode(html.GetString())
                : null;

            var postUrl = postData.GetProperty("url").GetString() ?? string.Empty;
            var isSelf = postData.TryGetProperty("is_self", out var isSelfProp) && isSelfProp.GetBoolean();
            var postHint = postData.TryGetProperty("post_hint", out var hint) ? hint.GetString() : null;
            var domain = postData.TryGetProperty("domain", out var dom) ? dom.GetString() : null;

            return new RedditPost
            {
                Id = postData.GetProperty("id").GetString() ?? string.Empty,
                Title = postData.GetProperty("title").GetString() ?? string.Empty,
                Author = postData.GetProperty("author").GetString() ?? string.Empty,
                Subreddit = postData.GetProperty("subreddit").GetString() ?? string.Empty,
                SelfText = selfText,
                SelfTextHtml = selfTextHtml,
                Url = postUrl,
                Permalink = postData.GetProperty("permalink").GetString() ?? string.Empty,
                Score = postData.GetProperty("score").GetInt32(),
                NumComments = postData.GetProperty("num_comments").GetInt32(),
                CreatedUtc = DateTimeOffset.FromUnixTimeSeconds((long)postData.GetProperty("created_utc").GetDouble()).UtcDateTime,
                Type = DeterminePostType(isSelf, postHint, postUrl, domain),
                HasAttachment = !isSelf && !string.IsNullOrEmpty(postUrl),
                Domain = domain,
                Flair = postData.TryGetProperty("link_flair_text", out var flair) ? flair.GetString() : null,
                IsImportant = (postData.TryGetProperty("stickied", out var stickied) && stickied.GetBoolean()) ||
                             (postData.TryGetProperty("distinguished", out var dist) && !string.IsNullOrEmpty(dist.GetString()))
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching post {PostId} from r/{Subreddit}", postId, subreddit);
            return null;
        }
    }

    public async Task<List<SubredditInfo>> GetPopularSubredditsAsync(int limit = 10)
    {
        try
        {
            var response = await _httpClient.GetAsync($"subreddits/popular.json?limit={limit}");
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(json);

            var children = document.RootElement
                .GetProperty("data")
                .GetProperty("children");

            var subreddits = new List<SubredditInfo>();
            foreach (var child in children.EnumerateArray())
            {
                var data = child.GetProperty("data");

                // Filtrar subreddits NSFW
                if (data.TryGetProperty("over18", out var nsfw) && nsfw.GetBoolean())
                    continue;

                subreddits.Add(new SubredditInfo
                {
                    Name = data.GetProperty("name").GetString() ?? string.Empty,
                    DisplayName = data.GetProperty("display_name").GetString() ?? string.Empty,
                    Subscribers = data.GetProperty("subscribers").GetInt32(),
                    Icon = data.TryGetProperty("icon_img", out var icon) ? icon.GetString() ?? string.Empty : string.Empty,
                    Description = data.TryGetProperty("public_description", out var desc) ? desc.GetString() : null
                });
            }

            return subreddits;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching popular subreddits");
            return new List<SubredditInfo>();
        }
    }

    public async Task<List<RedditComment>> GetCommentsAsync(string subreddit, string postId, int limit = 50, string sort = "best")
    {
        try
        {
            // Validar el ordenamiento
            var validSorts = new[] { "best", "top", "new", "controversial", "old", "qa" };
            if (!validSorts.Contains(sort.ToLower()))
                sort = "best";

            var url = $"r/{subreddit}/comments/{postId}.json?raw_json=1&limit={limit}&depth=5&sort={sort}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(json);

            // El segundo elemento del array contiene los comentarios
            if (document.RootElement.GetArrayLength() < 2)
                return new List<RedditComment>();

            var commentsData = document.RootElement[1]
                .GetProperty("data")
                .GetProperty("children");

            var comments = new List<RedditComment>();
            foreach (var child in commentsData.EnumerateArray())
            {
                // Ignorar elementos "more" (cargar más comentarios)
                if (child.GetProperty("kind").GetString() != "t1")
                    continue;

                var comment = ParseComment(child.GetProperty("data"));
                if (comment != null)
                    comments.Add(comment);
            }

            return comments;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching comments for post {PostId} in r/{Subreddit}", postId, subreddit);
            return new List<RedditComment>();
        }
    }

    private RedditComment? ParseComment(JsonElement data)
    {
        try
        {
            var author = data.GetProperty("author").GetString() ?? "[deleted]";
            var body = data.GetProperty("body").GetString() ?? string.Empty;

            // Ignorar comentarios eliminados
            if (author == "[deleted]" && body == "[deleted]")
                return null;

            var bodyHtml = data.TryGetProperty("body_html", out var html)
                ? HttpUtility.HtmlDecode(html.GetString())
                : null;

            var comment = new RedditComment
            {
                Id = data.GetProperty("id").GetString() ?? string.Empty,
                Author = author,
                Body = body,
                BodyHtml = bodyHtml,
                Score = data.TryGetProperty("score", out var score) ? score.GetInt32() : 0,
                CreatedUtc = DateTimeOffset.FromUnixTimeSeconds(
                    (long)data.GetProperty("created_utc").GetDouble()).UtcDateTime,
                Replies = new List<RedditComment>()
            };

            // Parsear respuestas anidadas
            if (data.TryGetProperty("replies", out var replies) &&
                replies.ValueKind == JsonValueKind.Object)
            {
                if (replies.TryGetProperty("data", out var repliesData) &&
                    repliesData.TryGetProperty("children", out var repliesChildren))
                {
                    foreach (var replyChild in repliesChildren.EnumerateArray())
                    {
                        if (replyChild.GetProperty("kind").GetString() != "t1")
                            continue;

                        var reply = ParseComment(replyChild.GetProperty("data"));
                        if (reply != null)
                            comment.Replies.Add(reply);
                    }
                }
            }

            return comment;
        }
        catch
        {
            return null;
        }
    }

    private RedditPost MapToRedditPost(RedditPostData data)
    {
        var selfTextHtml = !string.IsNullOrEmpty(data.SelfTextHtml)
            ? HttpUtility.HtmlDecode(data.SelfTextHtml)
            : null;

        return new RedditPost
        {
            Id = data.Id,
            Title = data.Title,
            Author = data.Author,
            Subreddit = data.Subreddit,
            SelfText = data.SelfText,
            SelfTextHtml = selfTextHtml,
            Url = data.Url,
            Permalink = data.Permalink,
            Score = data.Score,
            NumComments = data.NumComments,
            CreatedUtc = DateTimeOffset.FromUnixTimeSeconds((long)data.CreatedUtc).UtcDateTime,
            Thumbnail = data.Thumbnail ?? string.Empty,
            Type = DeterminePostType(data.IsSelf, data.PostHint, data.Url, data.Domain),
            HasAttachment = !data.IsSelf && !string.IsNullOrEmpty(data.Url),
            Domain = data.Domain,
            Flair = data.Flair,
            IsImportant = data.IsStickied || !string.IsNullOrEmpty(data.Distinguished)
        };
    }

    private static PostType DeterminePostType(bool isSelf, string? postHint, string url, string? domain)
    {
        if (isSelf || string.IsNullOrEmpty(url))
            return PostType.Text;

        // Usar post_hint si está disponible
        if (!string.IsNullOrEmpty(postHint))
        {
            return postHint switch
            {
                "image" => PostType.Image,
                "hosted:video" or "rich:video" => PostType.Video,
                "link" => PostType.Link,
                _ => PostType.Link
            };
        }

        // Detectar por extensión o dominio
        var lowerUrl = url.ToLowerInvariant();

        if (ImageExtensions.Any(ext => lowerUrl.EndsWith(ext)) ||
            ImageDomains.Any(d => domain?.Contains(d) == true))
            return PostType.Image;

        if (VideoExtensions.Any(ext => lowerUrl.EndsWith(ext)) ||
            domain?.Contains("v.redd.it") == true ||
            domain?.Contains("youtube.com") == true ||
            domain?.Contains("youtu.be") == true)
            return PostType.Video;

        if (lowerUrl.Contains("/gallery/"))
            return PostType.Gallery;

        return PostType.Link;
    }
}
