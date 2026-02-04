using OfficeReddit.Models;

namespace OfficeReddit.Services;

public interface IRedditService
{
    Task<PaginatedResponse<RedditPost>> GetPostsAsync(
        string subreddit = "all",
        int limit = 25,
        string? after = null,
        string? before = null);

    Task<RedditPost?> GetPostByIdAsync(string subreddit, string postId);
    Task<List<RedditComment>> GetCommentsAsync(string subreddit, string postId, int limit = 50);
    Task<List<SubredditInfo>> GetPopularSubredditsAsync(int limit = 10);
}
