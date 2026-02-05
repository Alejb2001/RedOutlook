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
    /// Health check endpoint
    /// </summary>
    [HttpGet("health")]
    public ActionResult Health()
    {
        return Ok(new { status = "ok", timestamp = DateTime.UtcNow, controller = "reddit" });
    }

    /// <summary>
    /// Test Reddit connection
    /// </summary>
    [HttpGet("test")]
    public async Task<ActionResult> TestReddit()
    {
        try
        {
            var posts = await _redditService.GetPostsAsync("all", 1);
            return Ok(new {
                status = "ok",
                postsCount = posts.Items.Count,
                message = posts.Items.Count > 0 ? "Reddit API working" : "Reddit returned empty response"
            });
        }
        catch (Exception ex)
        {
            return Ok(new {
                status = "error",
                errorType = ex.GetType().FullName,
                message = ex.Message,
                innerError = ex.InnerException?.Message
            });
        }
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
        try
        {
            if (limit < 1 || limit > 100)
            {
                limit = 25;
            }

            var response = await _redditService.GetPostsAsync(subreddit, limit, after, before, sort, includeNsfw);
            return Ok(response);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, type = ex.GetType().Name });
        }
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
        try
        {
            if (limit < 1 || limit > 50)
            {
                limit = 10;
            }

            var subreddits = await _redditService.GetPopularSubredditsAsync(limit);
            return Ok(subreddits);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message, type = ex.GetType().Name });
        }
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
