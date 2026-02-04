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

    /// <summary>
    /// Obtiene posts de un subreddit con paginación
    /// </summary>
    [HttpGet("posts")]
    public async Task<ActionResult<PaginatedResponse<RedditPost>>> GetPosts(
        [FromQuery] string subreddit = "all",
        [FromQuery] int limit = 25,
        [FromQuery] string? after = null,
        [FromQuery] string? before = null,
        [FromQuery] string sort = "hot",
        [FromQuery] bool includeNsfw = false)
    {
        if (limit < 1 || limit > 100)
        {
            limit = 25;
        }

        var response = await _redditService.GetPostsAsync(subreddit, limit, after, before, sort, includeNsfw);
        return Ok(response);
    }

    /// <summary>
    /// Obtiene un post específico por ID
    /// </summary>
    [HttpGet("posts/{subreddit}/{postId}")]
    public async Task<ActionResult<RedditPost>> GetPost(string subreddit, string postId)
    {
        var post = await _redditService.GetPostByIdAsync(subreddit, postId);
        if (post == null)
        {
            return NotFound(new { message = "Post not found or not available" });
        }
        return Ok(post);
    }

    /// <summary>
    /// Obtiene subreddits populares
    /// </summary>
    [HttpGet("subreddits/popular")]
    public async Task<ActionResult<List<SubredditInfo>>> GetPopularSubreddits([FromQuery] int limit = 10)
    {
        if (limit < 1 || limit > 50)
        {
            limit = 10;
        }

        var subreddits = await _redditService.GetPopularSubredditsAsync(limit);
        return Ok(subreddits);
    }

    /// <summary>
    /// Obtiene los comentarios de un post
    /// </summary>
    [HttpGet("posts/{subreddit}/{postId}/comments")]
    public async Task<ActionResult<List<RedditComment>>> GetComments(
        string subreddit,
        string postId,
        [FromQuery] int limit = 50,
        [FromQuery] string sort = "best")
    {
        if (limit < 1 || limit > 100)
        {
            limit = 50;
        }

        var comments = await _redditService.GetCommentsAsync(subreddit, postId, limit, sort);
        return Ok(comments);
    }
}
