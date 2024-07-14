namespace WebApp;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

using Framework;
using Newtonsoft.Json;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class UserEntity : BaseEntity
{    public string UserId { get; set; } = default!;
    public string UserNm { get; set; } = default!;
    public string Userpwd { get; set; } = default!;
    public string? Inserttime { get; set; }
    public string? Insertuserid { get; set; }
    public string? Updatetime { get; set; }
    public string? Updateuserid { get; set; }
    public string? UserAuth { get; set; }
    public int Passwordchk { get; set; }
    public string? Token { get; set; }  

    public override string ToString()
    {
        return $"{UserId}, {UserNm}, {Token}";
    }
}
public class UserList : List<UserEntity>
{
    public UserList(IEnumerable<UserEntity> list) : base(list) { }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}