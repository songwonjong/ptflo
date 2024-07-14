namespace WebApp;

using Microsoft.Extensions.Primitives;

using Framework;

static public class AppExtension
{
	static public Dictionary<string, object> ToDic(this IQueryCollection query, Func<string, string>? columnNameFunc = null)
	{
		if (columnNameFunc == null)
			columnNameFunc = x => x;

		var rtn = new Dictionary<string, object>();

		foreach (KeyValuePair<string, StringValues> kvp in query)
		{
			rtn.Add(columnNameFunc(kvp.Key), kvp.Value.ToString());
		}

		return rtn;
	}
}
