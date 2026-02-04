using System.Text.Json.Serialization;

namespace OfficeReddit.Models;

public class RedditApiResponse
{
    [JsonPropertyName("data")]
    public RedditListingData? Data { get; set; }
}

public class RedditListingData
{
    [JsonPropertyName("children")]
    public List<RedditPostWrapper>? Children { get; set; }

    [JsonPropertyName("after")]
    public string? After { get; set; }

    [JsonPropertyName("before")]
    public string? Before { get; set; }
}

public class RedditPostWrapper
{
    [JsonPropertyName("data")]
    public RedditPostData? Data { get; set; }
}

public class RedditPostData
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("author")]
    public string Author { get; set; } = string.Empty;

    [JsonPropertyName("subreddit")]
    public string Subreddit { get; set; } = string.Empty;

    [JsonPropertyName("selftext")]
    public string SelfText { get; set; } = string.Empty;

    [JsonPropertyName("selftext_html")]
    public string? SelfTextHtml { get; set; }

    [JsonPropertyName("url")]
    public string Url { get; set; } = string.Empty;

    [JsonPropertyName("permalink")]
    public string Permalink { get; set; } = string.Empty;

    [JsonPropertyName("score")]
    public int Score { get; set; }

    [JsonPropertyName("num_comments")]
    public int NumComments { get; set; }

    [JsonPropertyName("created_utc")]
    public double CreatedUtc { get; set; }

    [JsonPropertyName("thumbnail")]
    public string? Thumbnail { get; set; }

    [JsonPropertyName("over_18")]
    public bool IsNsfw { get; set; }

    [JsonPropertyName("is_self")]
    public bool IsSelf { get; set; }

    [JsonPropertyName("post_hint")]
    public string? PostHint { get; set; }

    [JsonPropertyName("domain")]
    public string? Domain { get; set; }

    [JsonPropertyName("link_flair_text")]
    public string? Flair { get; set; }

    [JsonPropertyName("stickied")]
    public bool IsStickied { get; set; }

    [JsonPropertyName("distinguished")]
    public string? Distinguished { get; set; }
}

// Respuesta paginada para el frontend
public class PaginatedResponse<T>
{
    public List<T> Items { get; set; } = new();
    public string? After { get; set; }
    public string? Before { get; set; }
    public bool HasMore => !string.IsNullOrEmpty(After);
}
