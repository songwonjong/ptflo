namespace WebApp;

using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Transactions;
using Framework;
using Microsoft.Extensions.Options;

public class UserService : BaseService
{
    public static UserList List()
   {
        return new (DataContext.StringEntityList<UserEntity>("@User.UserList"));
    }


    public static UserEntity LoginSelect(IDictionary<string, object> dic)
    {
        return DataContext.StringEntity<UserEntity>("@User.UserLoginSelect", dic);
    }

    public static int Insert(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@User.UserInsert", param);
    }

    public static int Update(IDictionary<string, object> dic)
    {
        return DataContext.StringNonQuery("@User.UserUpdate", dic);
    }

    public static int Delete(IDictionary<string, object> param)
    {
        return DataContext.StringNonQuery("@User.UserDelete", param);
    }

    public static void RefreshMap(string corpCode)
    {
    }

}
