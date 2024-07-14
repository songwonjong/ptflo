using Framework;
using WebApp;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews().AddNewtonsoftJson();

builder.Services.Configure<Setting>(builder.Configuration.GetSection("AppSettings"));

builder.Services.AddSingleton(
    new DataContext(
        builder.Configuration,
        new FileSqlCache(builder.Configuration.GetSection("AppSettings").GetSection("SqlFilePath").Value)));

builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

DataContext.SetLogger(app.Logger);

app.UseMiddleware<AuthMiddleware>(); // JWT 토큰 처리
if (app.Environment.IsProduction()) // 배포했을때만 자동으로 전역 예외처리
    app.UseMiddleware<ExceptionMiddleware>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
