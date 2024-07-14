using System.Data;
using Microsoft.Extensions.Logging;
using Framework;
using Microsoft.Extensions.Options;

namespace WinApp;

public partial class Main : Form
{
    private readonly ILogger _logger;
    readonly IOptions<Setting>? _setting;

    public Main(ILogger<Main> logger, IOptions<Setting> appSettings)
    {
        _logger = logger;
        _setting = appSettings;

        InitializeComponent();
    }

    private void Main_Load(object sender, EventArgs e)
    {
        _logger.LogError(Setting.ErpConn);
        _logger.LogError(_setting!.Value.UploadFilePath);
        _logger.LogInformation("Main Loaded");
    }

}