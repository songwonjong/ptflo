using System;
using System.Collections;
using System.Collections.Generic;
using System.Dynamic;

namespace Microsoft.Practices.EnterpriseLibrary.Data
{
    public interface ISqlCache
    {
        string GetSingleSql(string sqlId);

        IDictionary<string, string> GetAllSql();

        void RefreshSingleSql(string sqlId);

        void RefreshAllSql();

        string BuildSql(string sql, IDictionary<string, object> parameterDic);

        string BuildSql(string sql, dynamic entity);
    }
}
