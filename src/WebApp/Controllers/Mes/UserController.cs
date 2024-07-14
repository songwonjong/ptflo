namespace WebApp;

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Collections;

using Framework;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBaseEx
{
    private readonly IAuthService _authService;

    public UserController(ILogger<UserController> logger, IAuthService authService) : base(logger)
    {
        _authService = authService;
    }

    [HttpGet]
    public IEnumerable<IDictionary> List()
    {
        var ds = DataContext.StringDataSetEx(
            Setting.MsSqlConn, "@User.UserList"
        );

        return ToList(ds.Tables[0]);
    }
    //public UserList List()
    //{
    //    return UserService.List();
    //}
    [HttpGet]
    [Route("menuauth")]
    public IEnumerable<IDictionary> authList(string userId)
    {

        var ds = DataContext.StringDataSetEx(Setting.MsSqlConn, "@User.UserAuthList", userId);

        return ToList(ds.Tables[0]);
    }
    [HttpPut]
    [Route("menuauth/insert")]
    public int authInsert(IDictionary<string, object> param)
    {
        RefineParam(param);

        return DataContext.StringNonQueryEx(Setting.MsSqlConn, "@User.UserAuthInsert", param);
    }

    [HttpPut]
    [Route("menuauth/update")]
    public int authUpdate(IDictionary<string, object> param)

    {
        RefineParam(param);

        return DataContext.StringNonQueryEx(Setting.MsSqlConn, "@User.UserAuthUpdate", param);
    }

    [HttpPut]
    public IActionResult Create(IDictionary<string, object> dic)
    {
        RefineParam(dic, false);

        var result = UserService.Insert(dic);

        return HandleResult(result);
    }
            
    [HttpPost]
    public IActionResult Update(IDictionary<string, object> dic)//UserEntity entity)
    {
        RefineParam(dic);
        var result = UserService.Update(dic);
        //RefineEntity(entity);
         //var result = UserService.Update(entity);

        //return HandleResult(DataContext.StringNonQueryEx(Setting.MesConn, "@User.UserUpdate", entity));
        return HandleResult(result);

    }

    [HttpPost]
    [Route("delete")]
    public int Delete(IDictionary<string, object> dic)
    {
        RefineParam(dic);

        return UserService.Delete(dic);
    }

    [HttpPost]
    [Route("login")]
    public UserEntity? UserLogin(IDictionary<string, object> dic)
    {
        return _authService.Authenticate(dic);
    }

    //[HttpGet]
    //[Route("menu")]
    //public MenuList UserMenuList()
    //{
    //    var list = MenuService.ListAllCache().DeepClone();
    //    var childList = list.Where(x => !string.IsNullOrWhiteSpace(x.ParentId)).ToList();

    //    var userPermDic = RetriveUserPermDic();

    //    for (int i = childList.Count - 1; i >= 0; i--)
    //    {
    //        var menu = childList[i];

    //        if (menu.UseYn != 'Y')
    //        {
    //            list.Remove(menu);
    //            continue;
    //        }

    //        if (!userPermDic.ContainsKey(menu.MenuId))
    //        {
    //            list.Remove(menu);
    //            continue;
    //        }

    //        var userPerm = userPermDic[menu.MenuId];

    //        if (PermissionFilter.CheckPerm(userPerm, PermMethod.Admin))
    //            continue;

    //        if (PermissionFilter.CheckPerm(userPerm, PermMethod.Read))
    //            continue;

    //        list.Remove(menu);
    //    }

    //    return list;
    //}

    public Dictionary<string, int> RetriveUserPermDic()
    {
        return HttpContext.Items.SafeTypeKey("MenuAuth", new Dictionary<string, int>());
    }


}