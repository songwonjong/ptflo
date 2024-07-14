using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Practices.EnterpriseLibrary.Data.Extensions
{
    public static class Extensions
    {
		static public PropertyInfo GetPublic(this Type type, string name)
		{
			return type.GetProperty(name, BindingFlags.Instance | BindingFlags.Public);
		}

		static public PropertyInfo[] GetPublic(this Type type)
		{
			return type.GetProperties(BindingFlags.Instance | BindingFlags.Public);
		}
	}
}
