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
}
