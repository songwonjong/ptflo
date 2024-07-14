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

app.UseMiddleware<AuthMiddleware>(); // JWT ��ū ó��
if (app.Environment.IsProduction()) // ������������ �ڵ����� ���� ����ó��
    app.UseMiddleware<ExceptionMiddleware>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
