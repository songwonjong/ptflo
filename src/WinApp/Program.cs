using System.Runtime.InteropServices;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

using Framework;

namespace WinApp;

internal static class Program
{
    /// <summary>
    ///  The main entry point for the application.
    /// </summary>
    [STAThread]
    static void Main()
    {
#if DEBUG
        AllocConsole();
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Development");
#else
        Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Production");
#endif
        ApplicationConfiguration.Initialize();

        var host = CreateHostBuilder().Build();

        ILogger<Main> logger = host.Services.GetRequiredService<ILogger<Main>>();
        DataContext.SetLogger(logger);

        Application.Run(host.Services.GetRequiredService<Main>());
    }

    static IHostBuilder CreateHostBuilder()
    {
        return Host.CreateDefaultBuilder()
            .ConfigureServices((context, services) => {
                var app = context.Configuration.GetSection("AppSettings");

                services.Configure<Setting>(app);
                services.AddLogging();
                services.AddTransient<Main>();
                services.AddSingleton(
                   new DataContext(
                    context.Configuration,
                    new FileSqlCache(app.GetSection("SqlFilePath").Value)));
            });
    }

#if DEBUG
    [DllImport("kernel32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    static extern bool AllocConsole();
#endif
}