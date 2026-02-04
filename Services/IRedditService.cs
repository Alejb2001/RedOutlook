using OfficeReddit.Models;

namespace OfficeReddit.Services;

public interface IRedditService
{
    Task<List<RedditPost>> GetPostsAsync(string subreddit = "all", int limit = 25, string? after = null);
    Task<RedditPost?> GetPostByIdAsync(string subreddit, string postId);
    Task<List<SubredditInfo>> GetPopularSubredditsAsync(int limit = 10);
}
