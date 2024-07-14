namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Dynamic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using System.Xml.Linq;

using Framework;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

public class ControllerBaseEx : ControllerBase
{
    protected readonly ILogger _logger;

    static readonly string _corpCodeKey = "corpId";
    static readonly string _facCodeKey = "facId";
    static readonly string _createUserIdKey = "insertUserid";
    static readonly string _updateUserIdKey = "updateUserid";
    static readonly Func<string, string> _keyNameFunc = x => x;

    readonly IOptions<Setting>? _setting;

    readonly IWebHostEnvironment? _environment;

    public string UploadRootPath
    {
        get
        {
            var path = _setting!.Value.UploadFilePath;
            if (path.StartsWith("./"))
                path = Path.Combine(_environment!.ContentRootPath, path.Replace('/', Path.DirectorySeparatorChar));

            return path;
        }
    }

    public string GetUploadPath(string folder)
    {
        return Path.Combine($"{UploadRootPath}{Path.DirectorySeparatorChar}{folder}");
    }

    public ControllerBaseEx(
        ILogger logger)
    {
        _logger = logger;
    }

    public ControllerBaseEx(
        ILogger logger,
        IOptions<Setting> appSettings,
        IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        _setting = appSettings;
        _environment = webHostEnvironment;
    }

    protected void RefineParam(IEnumerable<IDictionary<string, object>> list)
    {
        foreach (var dic in list)
        {
            RefineParam(dic);
        }
    }

    protected void RefineParam(IDictionary<string, object> dic, bool isRemoveNuill = true)
    {
        RefineParam(dic, x => x, isRemoveNuill);
    }

    protected void RefineParam(IDictionary<string, object> dic, Func<string, string> keyNameFunc, bool isRemoveNuill = true)
    {
        if (!dic.ContainsKey(keyNameFunc(_corpCodeKey)) ||
            dic[keyNameFunc(_corpCodeKey)] == null ||
            string.IsNullOrWhiteSpace(dic.TypeKey(keyNameFunc(_corpCodeKey), string.Empty)))
            dic[keyNameFunc(_corpCodeKey)] = UserCorpCode;

        if (!dic.ContainsKey(keyNameFunc(_facCodeKey)) ||
            dic[keyNameFunc(_corpCodeKey)] == null ||
            string.IsNullOrWhiteSpace(dic.TypeKey(keyNameFunc(_facCodeKey), string.Empty)))
            dic[keyNameFunc(_facCodeKey)] = UserFacCode;

        dic[keyNameFunc(_createUserIdKey)] = UserId;
        dic[keyNameFunc(_updateUserIdKey)] = UserId;

        if (!isRemoveNuill)
            return;

        string[] keys = new string[dic.Keys.Count];

        dic.Keys.CopyTo(keys, 0);

        for (int i = dic.Keys.Count - 1; i >= 0; i--)
        {
            string key = keys[i];
            if (dic[key] == null)
                dic.Remove(key);
        }
    }

    protected void RefineExpando(ExpandoObject entity, bool isRemoveNuill = true)
    {
        RefineExpando(entity, UtilEx.CamelToPascal, isRemoveNuill);
    }

    protected void RefineExpando(ExpandoObject entity, Func<string, string> keyNameFunc, bool isRemoveNuill = true)
    {
        var dic = (IDictionary<string, object?>)entity;

        if (!dic.ContainsKey(keyNameFunc(_corpCodeKey)) ||
            dic[keyNameFunc(_corpCodeKey)] == null ||
            string.IsNullOrWhiteSpace(dic.TypeKey(keyNameFunc(_corpCodeKey), string.Empty)))
            dic[keyNameFunc(_corpCodeKey)] = UserCorpCode;

        dic[keyNameFunc(_createUserIdKey)] = UserId;
        dic[keyNameFunc(_updateUserIdKey)] = UserId;

        if (!isRemoveNuill)
            return;

        string[] keys = new string[dic.Keys.Count];

        dic.Keys.CopyTo(keys, 0);

        for (int i = dic.Keys.Count - 1; i >= 0; i--)
        {
            string key = keys[i];
            if (dic[key] == null)
                dic.Remove(key);
        }
    }

    protected void RefineEntity(dynamic entity)
    {
        if (string.IsNullOrWhiteSpace(UtilEx.GetPropertyValue<string>(entity, _corpCodeKey)))
            UtilEx.SetPropertyValue(entity, _corpCodeKey, UserCorpCode);

        UtilEx.SetPropertyValue(entity, _createUserIdKey, UserId);
        UtilEx.SetPropertyValue(entity, _updateUserIdKey, UserId);
    }

    protected IDictionary<string, IEnumerable<IDictionary>> ToDic(DataSet ds)
    {
        var dic = new Dictionary<string, IEnumerable<IDictionary>>();

        foreach (DataTable dt in ds.Tables)
            dic.Add(dt.TableName, ToDic(dt));

        return dic;
    }

    protected IEnumerable<IDictionary> ToDic(DataTable dt)
    {
        return dt.ToDic(UtilEx.ToCamel);
    }

    protected IEnumerable<IDictionary> ToList(DataTable dt)
    {
        return dt.ToDic(UtilEx.ToCamel);
    }

    protected IEnumerable<IDictionary> ToList(DataSet ds)
    {
        return ds.Tables[0].ToDic(UtilEx.ToCamel);
    }

    protected IEnumerable<dynamic> ToDynamic(DataTable dt)
    {
        return dt.ToDynamic(UtilEx.ToCamel);
    }

    protected IEnumerable<dynamic> ToDynamic(DataSet ds)
    {
        return ds.Tables[0].ToDynamic(UtilEx.ToCamel);
    }

    protected XDocument? ToXDoc<T>(IEnumerable<T> list, string rootName = "root", string itemName = "item")
    {
        IDictionary root = new HybridDictionary() {
            { rootName, new HybridDictionary() {
                { itemName, list } }
            }
        };

        string json = JsonConvert.SerializeObject(root);

        return JsonConvert.DeserializeXNode(json);
    }

    protected XDocument? ToXDoc(IDictionary dic, string rootName = "root", string itemName = "item")
    {
        IDictionary root = new HybridDictionary() {
            { rootName, new HybridDictionary() {
                { itemName, dic } }
            }
        };

        string json = JsonConvert.SerializeObject(root);

        return JsonConvert.DeserializeXNode(json);
    }

    protected void FindLabel(DataTable dt, string valueCol, string labelCol, Func<string, string> mapper)
    {
        dt.Columns.Add(labelCol, typeof(string));

        foreach (DataRow row in dt.Rows)
        {
            var val = row.TypeCol<string>(valueCol);
            var label = mapper.Invoke(val);

            row[labelCol] = label;
        }
    }

    protected IActionResult HandleResult(
        int result,
        [CallerMemberName] string memberName = "",
        [CallerFilePath] string filePath = "",
        [CallerLineNumber] int lineNumber = 0)
    {
        if (result > 0)
            return Ok();

        _logger.LogError($"{memberName} 실패(result <= 0), {filePath}:{lineNumber}");

        return Problem(title: "작업이 실패했습니다.");
    }

    public string NewGuid()
    {
        return Regex.Replace(Convert.ToBase64String(Guid.NewGuid().ToByteArray()), "[/+=]", "");
    }

    public byte[] ToBinary(string base64)
    {
        return Convert.FromBase64String(base64);
    }

    public string Serialize(IDictionary dic)
    {
        return JsonConvert.SerializeObject(dic);
    }
    public string Serialize(IDictionary<string, object> dic)
    {
        return JsonConvert.SerializeObject(dic);
    }

    public string Serialize(DataTable dt)
    {
        return JsonConvert.SerializeObject(dt);
    }

    public string Serialize(DataSet ds)
    {
        return JsonConvert.SerializeObject(ds);
    }

    public string Serialize(params object[] parames)
    {
        return JsonConvert.SerializeObject(parames);
    }
}