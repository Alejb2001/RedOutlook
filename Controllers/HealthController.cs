using Microsoft.AspNetCore.Mvc;

namespace OfficeReddit.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public ActionResult Get()
    {
        return Ok(new { status = "ok", timestamp = DateTime.UtcNow, version = "1.0" });
    }
}
