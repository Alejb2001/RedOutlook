namespace OfficeReddit.Models;

public class RedditPost
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Subreddit { get; set; } = string.Empty;
    public string SelfText { get; set; } = string.Empty;
    public string? SelfTextHtml { get; set; }
    public string Url { get; set; } = string.Empty;
    public string Permalink { get; set; } = string.Empty;
    public int Score { get; set; }
    public int NumComments { get; set; }
    public DateTime CreatedUtc { get; set; }
    public string Thumbnail { get; set; } = string.Empty;
    public bool IsRead { get; set; } = false;

    // Nuevos campos para UI estilo Outlook
    public PostType Type { get; set; } = PostType.Text;
    public bool HasAttachment { get; set; } = false;
    public string? Domain { get; set; }
    public string? Flair { get; set; }
    public bool IsImportant { get; set; } = false; // Para posts stickied o distinguished
}

public enum PostType
{
    Text,
    Link,
    Image,
    Video,
    Gallery
}

public class RedditComment
{
    public string Id { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public string? BodyHtml { get; set; }
    public int Score { get; set; }
    public DateTime CreatedUtc { get; set; }
    public List<RedditComment> Replies { get; set; } = new();
}

public class SubredditInfo
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public int Subscribers { get; set; }
    public string? Description { get; set; }
}
