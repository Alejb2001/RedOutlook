using Microsoft.AspNetCore.Mvc;
using OfficeReddit.Models;
using OfficeReddit.Services;

namespace OfficeReddit.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RedditController : ControllerBase
{
    private readonly IRedditService _redditService;

    public RedditController(IRedditService redditService)
    {
        _redditService = redditService;
    }

    [HttpGet("posts")]
    public async Task<ActionResult<List<RedditPost>>> GetPosts(
        [FromQuery] string subreddit = "all",
        [FromQuery] int limit = 25,
        [FromQuery] string? after = null)
    {
        var posts = await _redditService.GetPostsAsync(subreddit, limit, after);
        return Ok(posts);
    }

    [HttpGet("posts/{subreddit}/{postId}")]
    public async Task<ActionResult<RedditPost>> GetPost(string subreddit, string postId)
    {
        var post = await _redditService.GetPostByIdAsync(subreddit, postId);
        if (post == null)
        {
            return NotFound();
        }
        return Ok(post);
    }

    [HttpGet("subreddits/popular")]
    public async Task<ActionResult<List<SubredditInfo>>> GetPopularSubreddits([FromQuery] int limit = 10)
    {
        var subreddits = await _redditService.GetPopularSubredditsAsync(limit);
        return Ok(subreddits);
    }
}
