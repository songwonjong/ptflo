namespace WinApp;

public class Setting
{
    static public readonly string MesConn = "Postgre.Mes";
    static public readonly string ErpConn = "Oracle.Erp";
    static public readonly string GroupwareConn = "Groupware";

    public string SqlFilePath { get; set; } = default!;
    public string UploadFilePath { get; set; } = default!;
    public string AuthKey { get; set; } = default!;
}