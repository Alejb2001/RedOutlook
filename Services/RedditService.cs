using System.Text.Json;
using OfficeReddit.Models;

namespace OfficeReddit.Services;

public class RedditService : IRedditService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<RedditService> _logger;

    public RedditService(HttpClient httpClient, ILogger<RedditService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    public async Task<List<RedditPost>> GetPostsAsync(string subreddit = "all", int limit = 25, string? after = null)
    {
        try
        {
            var url = $"r/{subreddit}.json?limit={limit}";
            if (!string.IsNullOrEmpty(after))
            {
                url += $"&after={after}";
            }

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            var apiResponse = JsonSerializer.Deserialize<RedditApiResponse>(json);

            if (apiResponse?.Data?.Children == null)
            {
                return new List<RedditPost>();
            }

            return apiResponse.Data.Children
                .Where(c => c.Data != null)
                .Select(c => MapToRedditPost(c.Data!))
                .ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching posts from r/{Subreddit}", subreddit);
            return new List<RedditPost>();
        }
    }

    public async Task<RedditPost?> GetPostByIdAsync(string subreddit, string postId)
    {
        try
        {
            var url = $"r/{subreddit}/comments/{postId}.json";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var document = JsonDocument.Parse(json);

            var postData = document.RootElement[0]
                .GetProperty("data")
                .GetProperty("children")[0]
                .GetProperty("data");

            return new RedditPost
            {
                Id = postData.GetProperty("id").GetString() ?? string.Empty,
                Title = postData.GetProperty("title").GetString() ?? string.Empty,
                Author = postData.GetProperty("author").GetString() ?? string.Empty,
                Subreddit = postData.GetProperty("subreddit").GetString() ?? string.Empty,
                SelfText = postData.GetProperty("selftext").GetString() ?? string.Empty,
                Url = postData.GetProperty("url").GetString() ?? string.Empty,
                Permalink = postData.GetProperty("permalink").GetString() ?? string.Empty,
                Score = postData.GetProperty("score").GetInt32(),
                NumComments = postData.GetProperty("num_comments").GetInt32(),
                CreatedUtc = DateTimeOffset.FromUnixTimeSeconds((long)postData.GetProperty("created_utc").GetDouble()).UtcDateTime
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
                subreddits.Add(new SubredditInfo
                {
                    Name = data.GetProperty("name").GetString() ?? string.Empty,
                    DisplayName = data.GetProperty("display_name").GetString() ?? string.Empty,
                    Subscribers = data.GetProperty("subscribers").GetInt32(),
                    Icon = data.TryGetProperty("icon_img", out var icon) ? icon.GetString() ?? string.Empty : string.Empty
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

    private static RedditPost MapToRedditPost(RedditPostData data)
    {
        return new RedditPost
        {
            Id = data.Id,
            Title = data.Title,
            Author = data.Author,
            Subreddit = data.Subreddit,
            SelfText = data.SelfText,
            Url = data.Url,
            Permalink = data.Permalink,
            Score = data.Score,
            NumComments = data.NumComments,
            CreatedUtc = DateTimeOffset.FromUnixTimeSeconds((long)data.CreatedUtc).UtcDateTime,
            Thumbnail = data.Thumbnail ?? string.Empty
        };
    }
}
