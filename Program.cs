using OfficeReddit.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpClient for Reddit API
builder.Services.AddHttpClient<IRedditService, RedditService>(client =>
{
    client.BaseAddress = new Uri("https://www.reddit.com/");
    // Reddit requires a descriptive User-Agent
    client.DefaultRequestHeaders.Add("User-Agent", "web:RedOutlook:v1.0.0 (by /u/RedOutlookApp)");
    client.DefaultRequestHeaders.Add("Accept", "application/json");
    client.Timeout = TimeSpan.FromSeconds(30);
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// Fallback to index.html for SPA routing
app.MapFallbackToFile("index.html");

// Use PORT environment variable for Railway/cloud hosting
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Run($"http://0.0.0.0:{port}");
