using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Transactions;

using Microsoft.Practices.EnterpriseLibrary.Data;
using Microsoft.Practices.EnterpriseLibrary.Data.Sql;
using Microsoft.Practices.EnterpriseLibrary.Data.Oracle;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Framework
{
	public class DataContext
	{
		static IConfiguration _configuration;

		static ISqlCache _sqlCache;

		static ILogger _logger;

		public DataContext(IConfiguration configuration, ISqlCache sqlCache)
        {
			_configuration = configuration;
			_sqlCache = sqlCache;

			DatabaseFactory.SetDatabases(() => CreateDatabase(null), (name) => CreateDatabase(name));
		}

		static public void SetLogger(ILogger logger)
        {
			_logger = logger;
		}

		#region DataSet

		static public DataSet DataSetEx(string name, string sp, params object[] parames)
		{
			return Create(name).ExecuteDataSet(sp, parames);
		}

		static public DataSet DataSetEx(string name, string sp, IDictionary<string, object> parameterDic)
		{
			return Create(name).ExecuteDataSet(sp, parameterDic);
		}

		static public DataSet DataSet(string sp, params object[] parames)
		{
			return DataSetEx(null, sp, parames);
		}

		static public DataSet DataSet(string sp, IDictionary<string, object> parameterDic)
		{
			return DataSetEx(null, sp, parameterDic);
		}

        #endregion


        #region NonQuery

        static public int NonQueryEx(string name, string sp, IDictionary<string, object> parameterDic)
		{
			return Create(name).ExecuteNonQuery(sp, parameterDic);
		}

		static public int NonQueryEx(string name, string sp, dynamic entity)
		{
			if (!Database.IsDynamicOrEntity(entity))
				return NonQueryEx(name, sp, new object[] { entity });

			return Create(name).ExecuteNonQuery(sp, entity);
		}

		static public int NonQueryEx(string name, string sp, params object[] parames)
		{
			return Create(name).ExecuteNonQuery(sp, parames);
		}

		static public int NonQuery(string sp, IDictionary<string, object> parameterDic)
		{
			return NonQueryEx(null, sp, parameterDic);
		}

		static public int NonQuery(string sp, dynamic entity)
		{
			return NonQueryEx(null, sp, entity);
		}

		static public int NonQuery(string sp, params object[] parames)
		{
			return NonQueryEx(null, sp, parames);
		}

		static public int NonQueryTransEx(string name, string sp, params object[] parames)
		{
			int result = 0;

			using (TransactionScope scope = new TransactionScope())
			{
				result = NonQueryEx(name, sp, parames);

				scope.Complete();
			}

			return result;
		}

		static public int NonQueryTransEx(string name, string sp, IDictionary<string, object> parameterDic)
		{
			int result = 0;

			using (TransactionScope scope = new TransactionScope())
			{
				result = NonQueryEx(name, sp, parameterDic);

				scope.Complete();
			}

			return result;
		}

		static public int NonQueryTransEx(string name, string sp, dynamic entity)
		{
			if (!Database.IsDynamicOrEntity(entity))
				return NonQueryTransEx(name, sp, new object[] { entity });

			int result = 0;

			using (TransactionScope scope = new TransactionScope())
			{
				result = NonQueryEx(name, sp, entity);

				scope.Complete();
			}

			return result;
		}

		static public int NonQueryTrans(string sp, params object[] parames)
		{
			return NonQueryTransEx(null, sp, parames);
		}

		static public int NonQueryTrans(string sp, IDictionary<string, object> parameterDic)
		{
			return NonQueryTransEx(null, sp, parameterDic);
		}

		static public int NonQueryTrans(string sp, dynamic entity)
		{
			return NonQueryTransEx(null, sp, entity);
		}

		#endregion


		#region Value

		static public T ValueEx<T>(string name, string sp, params object[] parames)
		{
			return ConvertEx.ConvertTo<T>(Create(name).ExecuteScalar(sp, parames), default(T));
		}

		static public T ValueEx<T>(string name, string sp, IDictionary<string, object> parameterDic)
		{
			return ConvertEx.ConvertTo<T>(Create(name).ExecuteScalar(sp, parameterDic), default(T));
		}

		static public T ValueEx<T, U>(string name, string sp, dynamic entity)
		{
			if (!Database.IsDynamicOrEntity(entity))
				return ValueEx<T>(name, sp, new object[] { entity });

			return ConvertEx.ConvertTo<T>(Create(name).ExecuteScalar(sp, entity), default(T));
		}

		static public T Value<T>(string sp, params object[] parames)
		{
			return ValueEx<T>(null, sp, parames);
		}

		static public T Value<T>(string sp, IDictionary<string, object> parameterDic)
		{
			return ValueEx<T>(null, sp, parameterDic);
		}

		static public T Value<T, U>(string sp, dynamic entity)
		{
			return ValueEx<T, U>(null, sp, entity);
		}

		#endregion


		#region Entity - params

		static public List<T> EntityListEx<T>(string name, string sp, params object[] parames)
			where T : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T>(CommandType.StoredProcedure, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>> EntityListEx<T1, T2>(string name, string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2>(CommandType.StoredProcedure, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> EntityListEx<T1, T2, T3>(string name, string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3>(CommandType.StoredProcedure, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> EntityListEx<T1, T2, T3, T4>(string name, string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4>(CommandType.StoredProcedure, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> EntityListEx<T1, T2, T3, T4, T5>(string name, string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5>(CommandType.StoredProcedure, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> EntityListEx<T1, T2, T3, T4, T5, T6>(string name, string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5, T6>(CommandType.StoredProcedure, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> EntityListEx<T1, T2, T3, T4, T5, T6, T7>(string name, string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5, T6, T7>(CommandType.StoredProcedure, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> EntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(string name, string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5, T6, T7, TRest>(CommandType.StoredProcedure, sp, parames);
		}

		static public List<T> EntityList<T>(string sp, params object[] parames)
			where T : new()
		{
			return EntityListEx<T>(null, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>> EntityList<T1, T2>(string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
		{
			return EntityListEx<T1, T2>(null, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> EntityList<T1, T2, T3>(string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			return EntityListEx<T1, T2, T3>(null, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> EntityList<T1, T2, T3, T4>(string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			return EntityListEx<T1, T2, T3, T4>(null, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> EntityList<T1, T2, T3, T4, T5>(string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5>(null, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> EntityList<T1, T2, T3, T4, T5, T6>(string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5, T6>(null, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> EntityList<T1, T2, T3, T4, T5, T6, T7>(string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5, T6, T7>(null, sp, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> EntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(string sp, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(null, sp, parames);
		}

		static public T EntityBase<T>(string name, string sp, params object[] parames)
			where T : new()
		{
			Database db = Create(name);
			var rtn = db.EntityList<object[], T>(CommandType.StoredProcedure, sp, parames);

			if (rtn.Count() > 0)
				return rtn.First();
			else
				return default(T);
		}

		static public TResult EntityEx<TResult>(string name, string sp, params object[] parames)
			where TResult : new()
		{
			return EntityBase<TResult>(name, sp, parames);
		}

		static public TResult Entity<TResult>(string sp, params object[] parames)
			where TResult : new()
		{
			return EntityEx<TResult>(null, sp, parames);
		}

        #endregion


        #region Entity - dic

        static public List<T> EntityListEx<T>(string name, string sp, IDictionary<string, object> dic)
			where T : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T>(CommandType.StoredProcedure, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>> EntityListEx<T1, T2>(string name, string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2>(CommandType.StoredProcedure, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> EntityListEx<T1, T2, T3>(string name, string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3>(CommandType.StoredProcedure, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> EntityListEx<T1, T2, T3, T4>(string name, string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4>(CommandType.StoredProcedure, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> EntityListEx<T1, T2, T3, T4, T5>(string name, string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5>(CommandType.StoredProcedure, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> EntityListEx<T1, T2, T3, T4, T5, T6>(string name, string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5, T6>(CommandType.StoredProcedure, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> EntityListEx<T1, T2, T3, T4, T5, T6, T7>(string name, string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5, T6, T7>(CommandType.StoredProcedure, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> EntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(string name, string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5, T6, T7, TRest>(CommandType.StoredProcedure, sp, dic);
		}

		static public List<T> EntityList<T>(string sp, IDictionary<string, object> dic)
			where T : new()
		{
			return EntityListEx<T>(null, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>> EntityList<T1, T2>(string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
		{
			return EntityListEx<T1, T2>(null, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> EntityList<T1, T2, T3>(string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			return EntityListEx<T1, T2, T3>(null, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> EntityList<T1, T2, T3, T4>(string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			return EntityListEx<T1, T2, T3, T4>(null, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> EntityList<T1, T2, T3, T4, T5>(string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5>(null, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> EntityList<T1, T2, T3, T4, T5, T6>(string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5, T6>(null, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> EntityList<T1, T2, T3, T4, T5, T6, T7>(string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5, T6, T7>(null, sp, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> EntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(string sp, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			return EntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(null, sp, dic);
		}

		static public T EntityBase<T>(string name, string sp, IDictionary<string, object> dic)
			where T : new()
		{
			Database db = Create(name);
			var rtn = db.EntityList<IDictionary<string, object>, T>(CommandType.StoredProcedure, sp, dic);

			if (rtn.Count() > 0)
				return rtn.First();
			else
				return default(T);
		}

		static public TResult EntityEx<TResult>(string name, string sp, IDictionary<string, object> dic)
			where TResult : new()
		{
			return EntityBase<TResult>(name, sp, dic);
		}

		static public TResult Entity<TResult>(string sp, IDictionary<string, object> dic)
			where TResult : new()
		{
			return EntityEx<TResult>(null, sp, dic);
		}

		#endregion


		#region Entity - dynamic

		static public List<T> EntityListEx<T>(string name, string sp, dynamic entity)
			where T : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T>(CommandType.StoredProcedure, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>> EntityListEx<T1, T2>(string name, string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T1, T2>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2>(CommandType.StoredProcedure, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> EntityListEx<T1, T2, T3>(string name, string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T1, T2, T3>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3>(CommandType.StoredProcedure, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> EntityListEx<T1, T2, T3, T4>(string name, string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T1, T2, T3, T4>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4>(CommandType.StoredProcedure, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> EntityListEx<T1, T2, T3, T4, T5>(string name, string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T1, T2, T3, T4, T5>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5>(CommandType.StoredProcedure, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> EntityListEx<T1, T2, T3, T4, T5, T6>(string name, string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T1, T2, T3, T4, T5, T6>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5, T6>(CommandType.StoredProcedure, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> EntityListEx<T1, T2, T3, T4, T5, T6, T7>(string name, string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T1, T2, T3, T4, T5, T6, T7>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5, T6, T7>(CommandType.StoredProcedure, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> EntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(string name, string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(name, sp, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5, T6, T7, TRest>(CommandType.StoredProcedure, sp, entity);
		}

		static public List<T> EntityList<T>(string sp, dynamic entity)
			where T : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T>(sp, new object[] { entity });

			return EntityListEx<T>(null, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>> EntityList<T1, T2>(string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T1, T2>(sp, new object[] { entity });

			return EntityListEx<T1, T2>(null, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> EntityList<T1, T2, T3>(string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T1, T2, T3>(sp, new object[] { entity });

			return EntityListEx<T1, T2, T3>(null, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> EntityList<T1, T2, T3, T4>(string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T1, T2, T3, T4>(sp, new object[] { entity });

			return EntityListEx<T1, T2, T3, T4>(null, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> EntityList<T1, T2, T3, T4, T5>(string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T1, T2, T3, T4, T5>(sp, new object[] { entity });

			return EntityListEx<T1, T2, T3, T4, T5>(null, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> EntityList<T1, T2, T3, T4, T5, T6>(string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T1, T2, T3, T4, T5, T6>(sp, new object[] { entity });

			return EntityListEx<T1, T2, T3, T4, T5, T6>(null, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> EntityList<T1, T2, T3, T4, T5, T6, T7>(string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T1, T2, T3, T4, T5, T6, T7>(sp, new object[] { entity });

			return EntityListEx<T1, T2, T3, T4, T5, T6, T7>(null, sp, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> EntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(string sp, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return EntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(sp, new object[] { entity });

			return EntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(null, sp, entity);
		}

		static public T EntityBase<T>(string name, string sp, dynamic entity)
			where T : new()
		{
			Database db = Create(name);
			var rtn = db.EntityList<dynamic, T>(CommandType.StoredProcedure, sp, entity);

			if (rtn.Count() > 0)
				return rtn.First();
			else
				return default(T);
		}

		static public TResult EntityEx<TResult>(string name, string sp, dynamic entity)
			where TResult : new()
		{
			return EntityBase<TResult>(name, sp, entity);
		}

		static public TResult Entity<TResult>(string sp, dynamic entity)
			where TResult : new()
		{
			return EntityEx<TResult>(null, sp, entity);
		}

		#endregion


		#region StringDataSet

		static public DataSet StringDataSetEx(string name, string sql, params object[] parames)
		{
			return Create(name).ExecuteStringDataSet(sql, parames);
		}

		static public DataSet StringDataSetEx(string name, string sql, IDictionary<string, object> parameterDic = null)
		{
			return Create(name).ExecuteStringDataSet(sql, parameterDic);
		}

		static public DataSet StringDataSetEx(string name, string sql, dynamic entity)
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringDataSetEx(name, sql, new object[] { entity });

			return Create(name).ExecuteStringDataSet(sql, entity);
		}

		static public DataSet StringDataSet(string sql, params object[] parames)
		{
			return StringDataSetEx(null, sql, parames);
		}

		static public DataSet StringDataSet(string sql, IDictionary<string, object> parameterDic = null)
		{
			return StringDataSetEx(null, sql, parameterDic);
		}

		static public DataSet StringDataSet(string sql, dynamic entity)
		{
			return StringDataSetEx(null, sql, entity);
		}

		#endregion


		#region StringNonQuery

		static public int StringNonQueryEx(string name, string sql, params object[] parames)
		{
			return Create(name).ExecuteStringNonQuery(sql, parames);
		}

		static public int StringNonQueryEx(string name, string sql, IDictionary<string, object> parameterDic = null)
		{
			return Create(name).ExecuteStringNonQuery(sql, parameterDic);
		}

		static public int StringNonQueryEx(string name, string sql, dynamic entity)
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringNonQueryEx(name, sql, new object[] { entity });

			return Create(name).ExecuteStringNonQuery(sql, entity);
		}

		static public int StringNonQuery(string sql, params object[] parames)
		{
			return StringNonQueryEx(null, sql, parames);
		}

		static public int StringNonQuery(string sql, IDictionary<string, object> parameterDic = null)
		{
			return StringNonQueryEx(null, sql, parameterDic);
		}

		static public int StringNonQuery(string sql, dynamic entity)
		{
			return StringNonQueryEx(null, sql, entity);
		}

		#endregion


		#region StringValue

		static public T StringValueEx<T>(string name, string sql, params object[] parames)
		{
			return Create(name).ExecuteStringScalar<T>(sql, parames);
		}

		static public T StringValueEx<T>(string name, string sql, IDictionary<string, object> parameterDic = null)
		{
			return Create(name).ExecuteStringScalar<T>(sql, parameterDic);
		}

		static public T StringValueEx<T>(string name, string sql, dynamic entity)
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringValueEx<T>(name, sql, new object[] { entity });

			return Create(name).ExecuteStringScalar<T>(sql, entity);
		}

		static public T StringValue<T>(string sql, params object[] parames)
		{
			return StringValueEx<T>(null, sql, parames);
		}

		static public T StringValue<T>(string sql, IDictionary<string, object> parameterDic = null)
		{
			return StringValueEx<T>(null, sql, parameterDic);
		}

		static public T StringValue<T>(string sql, dynamic entity)
		{
			return StringValueEx<T>(null, sql, entity);
		}

		#endregion


		#region StringEntity - params

		static public List<T> StringEntityListEx<T>(string name, string sql, params object[] parames)
			where T : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T>(CommandType.Text, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>> StringEntityListEx<T1, T2>(string name, string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2>(CommandType.Text, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> StringEntityListEx<T1, T2, T3>(string name, string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3>(CommandType.Text, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> StringEntityListEx<T1, T2, T3, T4>(string name, string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4>(CommandType.Text, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> StringEntityListEx<T1, T2, T3, T4, T5>(string name, string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5>(CommandType.Text, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> StringEntityListEx<T1, T2, T3, T4, T5, T6>(string name, string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5, T6>(CommandType.Text, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> StringEntityListEx<T1, T2, T3, T4, T5, T6, T7>(string name, string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5, T6, T7>(CommandType.Text, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> StringEntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(string name, string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			Database db = Create(name);

			return db.EntityList<object[], T1, T2, T3, T4, T5, T6, T7, TRest>(CommandType.Text, sql, parames);
		}

		static public List<T> StringEntityList<T>(string sql, params object[] parames)
			where T : new()
		{
			return StringEntityListEx<T>(null, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>> StringEntityList<T1, T2>(string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
		{
			return StringEntityListEx<T1, T2>(null, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> StringEntityList<T1, T2, T3>(string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			return StringEntityListEx<T1, T2, T3>(null, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> StringEntityList<T1, T2, T3, T4>(string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4>(null, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> StringEntityList<T1, T2, T3, T4, T5>(string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5>(null, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> StringEntityList<T1, T2, T3, T4, T5, T6>(string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5, T6>(null, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> StringEntityList<T1, T2, T3, T4, T5, T6, T7>(string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7>(null, sql, parames);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> StringEntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(string sql, params object[] parames)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(null, sql, parames);
		}

		static public T StringEntityBase<T>(string name, string sql, params object[] parames)
			where T : new()
		{
			Database db = Create(name);
			var rtn = db.EntityList<object[], T>(CommandType.Text, sql, parames);

			if (rtn.Count() > 0)
				return rtn.First();
			else
				return default(T);
		}

		static public TResult StringEntityEx<TResult>(string name, string sql, params object[] parames)
			where TResult : new()
		{
			return StringEntityBase<TResult>(name, sql, parames);
		}

		static public TResult StringEntity<TResult>(string sql, params object[] parames)
			where TResult : new()
		{
			return StringEntityEx<TResult>(null, sql, parames);
		}

		#endregion


		#region StringEntity - dic

		static public List<T> StringEntityListEx<T>(string name, string sql, IDictionary<string, object> dic)
			where T : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T>(CommandType.Text, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>> StringEntityListEx<T1, T2>(string name, string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2>(CommandType.Text, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> StringEntityListEx<T1, T2, T3>(string name, string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3>(CommandType.Text, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> StringEntityListEx<T1, T2, T3, T4>(string name, string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4>(CommandType.Text, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> StringEntityListEx<T1, T2, T3, T4, T5>(string name, string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5>(CommandType.Text, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> StringEntityListEx<T1, T2, T3, T4, T5, T6>(string name, string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5, T6>(CommandType.Text, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> StringEntityListEx<T1, T2, T3, T4, T5, T6, T7>(string name, string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5, T6, T7>(CommandType.Text, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> StringEntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(string name, string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			Database db = Create(name);

			return db.EntityList<IDictionary<string, object>, T1, T2, T3, T4, T5, T6, T7, TRest>(CommandType.Text, sql, dic);
		}

		static public List<T> StringEntityList<T>(string sql, IDictionary<string, object> dic)
			where T : new()
		{
			return StringEntityListEx<T>(null, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>> StringEntityList<T1, T2>(string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
		{
			return StringEntityListEx<T1, T2>(null, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> StringEntityList<T1, T2, T3>(string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			return StringEntityListEx<T1, T2, T3>(null, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> StringEntityList<T1, T2, T3, T4>(string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4>(null, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> StringEntityList<T1, T2, T3, T4, T5>(string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5>(null, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> StringEntityList<T1, T2, T3, T4, T5, T6>(string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5, T6>(null, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> StringEntityList<T1, T2, T3, T4, T5, T6, T7>(string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7>(null, sql, dic);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> StringEntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(string sql, IDictionary<string, object> dic)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(null, sql, dic);
		}

		static public T StringEntityBase<T>(string name, string sql, IDictionary<string, object> dic)
			where T : new()
		{
			Database db = Create(name);
			var rtn = db.EntityList<IDictionary<string, object>, T>(CommandType.Text, sql, dic);

			if (rtn.Count() > 0)
				return rtn.First();
			else
				return default(T);
		}

		static public TResult StringEntityEx<TResult>(string name, string sql, IDictionary<string, object> dic)
			where TResult : new()
		{
			return StringEntityBase<TResult>(name, sql, dic);
		}

		static public TResult StringEntity<TResult>(string sql, IDictionary<string, object> dic)
			where TResult : new()
		{
			return StringEntityEx<TResult>(null, sql, dic);
		}

		#endregion


		#region StringEntity - dynamic

		static public List<T> StringEntityListEx<T>(string name, string sql, dynamic entity)
			where T : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T>(CommandType.Text, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>> StringEntityListEx<T1, T2>(string name, string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T1, T2>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2>(CommandType.Text, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> StringEntityListEx<T1, T2, T3>(string name, string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T1, T2, T3>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3>(CommandType.Text, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> StringEntityListEx<T1, T2, T3, T4>(string name, string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T1, T2, T3, T4>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4>(CommandType.Text, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> StringEntityListEx<T1, T2, T3, T4, T5>(string name, string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T1, T2, T3, T4, T5>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5>(CommandType.Text, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> StringEntityListEx<T1, T2, T3, T4, T5, T6>(string name, string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T1, T2, T3, T4, T5, T6>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5, T6>(CommandType.Text, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> StringEntityListEx<T1, T2, T3, T4, T5, T6, T7>(string name, string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5, T6, T7>(CommandType.Text, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> StringEntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(string name, string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(name, sql, new object[] { entity });

			Database db = Create(name);

			return db.EntityList<dynamic, T1, T2, T3, T4, T5, T6, T7, TRest>(CommandType.Text, sql, entity);
		}

		static public List<T> StringEntityList<T>(string sql, dynamic entity)
			where T : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T>(sql, new object[] { entity });

			return StringEntityListEx<T>(null, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>> StringEntityList<T1, T2>(string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T1, T2>(sql, new object[] { entity });

			return StringEntityListEx<T1, T2>(null, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>> StringEntityList<T1, T2, T3>(string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T1, T2, T3>(sql, new object[] { entity });

			return StringEntityListEx<T1, T2, T3>(null, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>> StringEntityList<T1, T2, T3, T4>(string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T1, T2, T3, T4>(sql, new object[] { entity });

			return StringEntityListEx<T1, T2, T3, T4>(null, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>> StringEntityList<T1, T2, T3, T4, T5>(string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T1, T2, T3, T4, T5>(sql, new object[] { entity });

			return StringEntityListEx<T1, T2, T3, T4, T5>(null, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>> StringEntityList<T1, T2, T3, T4, T5, T6>(string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T1, T2, T3, T4, T5, T6>(sql, new object[] { entity });

			return StringEntityListEx<T1, T2, T3, T4, T5, T6>(null, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>> StringEntityList<T1, T2, T3, T4, T5, T6, T7>(string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T1, T2, T3, T4, T5, T6, T7>(sql, new object[] { entity });

			return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7>(null, sql, entity);
		}

		static public Tuple<List<T1>, List<T2>, List<T3>, List<T4>, List<T5>, List<T6>, List<T7>, List<List<TRest>>> StringEntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(string sql, dynamic entity)
			where T1 : new()
			where T2 : new()
			where T3 : new()
			where T4 : new()
			where T5 : new()
			where T6 : new()
			where T7 : new()
			where TRest : new()
		{
			if (!Database.IsDynamicOrEntity(entity))
				return StringEntityList<T1, T2, T3, T4, T5, T6, T7, TRest>(sql, new object[] { entity });

			return StringEntityListEx<T1, T2, T3, T4, T5, T6, T7, TRest>(null, sql, entity);
		}

		static public T StringEntityBase<T>(string name, string sql, dynamic entity)
			where T : new()
		{
			Database db = Create(name);
			var rtn = db.EntityList<dynamic, T>(CommandType.Text, sql, entity);

			if (rtn.Count() > 0)
				return rtn.First();
			else
				return default(T);
		}

		static public TResult StringEntityEx<TResult>(string name, string sql, dynamic entity)
			where TResult : new()
		{
			return StringEntityBase<TResult>(name, sql, entity);
		}

		static public TResult StringEntity<TResult>(string sql, dynamic entity)
			where TResult : new()
		{
			return StringEntityEx<TResult>(null, sql, entity);
		}

		#endregion


		static public void ClearParameterCache()
		{
			Database.ClearParameterCache();
		}

		static public Database Create(string name = null)
		{
			return DatabaseFactory.CreateDatabase(name);
		}

		static public string GetConnection(string name)
		{
			return _configuration.GetConnectionString(name);
		}

		static public Database CreateDatabase(string name)
        {
			if (string.IsNullOrWhiteSpace(name))
				name = _configuration.GetSection(BaseStatic.DefaultDBConfigSection).GetSection(BaseStatic.DefaultDBValueSection).Value;

			string connection = GetConnection(name);

			switch (name)
			{
				case string s when s.StartsWith("Postgre.", StringComparison.InvariantCultureIgnoreCase):
					return new GenericDatabase(connection, Npgsql.NpgsqlFactory.Instance, _sqlCache, _logger);
				case string s when s.StartsWith("Oracle.", StringComparison.InvariantCultureIgnoreCase):
					return new OracleDatabase(connection, _sqlCache, _logger);
				default:
					return new SqlDatabase(connection, _sqlCache, _logger);
			}
		}
	}
}