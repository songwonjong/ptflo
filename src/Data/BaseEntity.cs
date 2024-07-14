using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using System.Xml.Serialization;

namespace Microsoft.Practices.EnterpriseLibrary.Data
{
	public static class BaseListEx
	{
		public static int TotalCnt<T>(this IEnumerable<T> list)
		{
			if (list.Count() <= 0)
				return 0;

			if (typeof(T).BaseType == typeof(BaseEntity))
				return (list.First<T>() as BaseEntity).TotalCount;

			return 0;
		}
	}

	[Serializable]
	public class BaseEntity
	{
		public BaseEntity()
		{
		}

		[XmlIgnore]
		public int TotalCount { get; set; }

		public string ToDate8(DateTime dt)
		{
			return dt.ToString("yy.MM.dd");
		}

		public string ToDate10(DateTime dt)
		{
			return dt.ToString("yyyy-MM-dd");
		}

		public string ToDate10(DateTime? dt)
		{
			if (dt == null)
				return string.Empty;

			return dt.Value.ToString("yyyy-MM-dd");
		}

		public string ToDate16(DateTime dt)
		{
			return dt.ToString("yyyy-MM-dd HH:mm");
		}

		public string ToDate16(DateTime? dt)
		{
			if (dt == null)
				return string.Empty;

			return dt.Value.ToString("yyyy-MM-dd HH:mm");
		}

		public string ToDate19(DateTime dt)
		{
			return dt.ToString("yyyy-MM-dd HH:mm:ss");
		}

		public string ToDate19(DateTime? dt)
		{
			if (dt == null)
				return string.Empty;

			return dt.Value.ToString("yyyy-MM-dd HH:mm:ss");
		}

		protected string Len(string s, int l)
		{
			if (string.IsNullOrWhiteSpace(s)) return string.Empty;

			return Length(RemoveHtml(s), l);
		}

		protected string ToText(string value)
		{
			if (string.IsNullOrWhiteSpace(value))
				return value;

			return RemoveHtml(value.Replace("\0", string.Empty));
		}

		protected string ToHtml(string value)
		{
			if (string.IsNullOrWhiteSpace(value))
				return value;

			return value.Replace("\r\n", "<br />").Replace("\n", "<br />");
		}

		protected XDocument ToXml(string xml)
		{
			if (string.IsNullOrWhiteSpace(xml))
				return null;

			return XDocument.Parse(xml);
		}

		protected string FromXml(XDocument xDoc)
		{
			if(IsEmpty(xDoc))
				return null;

			return xDoc.ToString();
		}

		[XmlIgnore]
		public object ReturnValue { get; set; }

		static public string RemoveHtml(string s)
		{
			Regex regHtml = new Regex("<[^>]*>");

			return regHtml.Replace(s, string.Empty)
				.Replace("<!--", string.Empty)
				.Replace("-->", string.Empty)
				.Replace("&nbsp;", string.Empty)
				.Replace("&nbsp", string.Empty);

		}

		public static string Length(string v, int l, string postfix = "")
		{
			if (string.IsNullOrWhiteSpace(v))
				return string.Empty;

			int n = 0;
			string s = string.Empty;

			foreach (char ch in v)
			{
				if (IsUnicode(ch))
					n += 2;
				else
					n++;
				s += ch;
				if (n >= l)
					return (s + postfix);
			}

			return s;
		}

		public static bool IsUnicode(char c)
		{
			return (char.GetUnicodeCategory(c) == UnicodeCategory.OtherLetter);
		}

		public static bool IsEmpty(XDocument xDoc)
		{
			return xDoc == null || xDoc.Root == null || xDoc.Root.IsEmpty;
		}
	}

	[Serializable()]
	public class SearchEntity : BaseEntity
	{
		public SearchEntity()
		{
			this.Page       = 1;
			this.PageSize   = 10;
			this.SearchKey  = string.Empty;
			this.SearchVal  = string.Empty;
			this.SortKey    = string.Empty;
			this.IsDesc     = true;
			this.CacheMin   = 5;
		}

		public SearchEntity(int page, int pageSize)
		{
			this.Page      = page;
			this.PageSize  = pageSize;
			this.SearchKey  = string.Empty;
			this.SearchVal  = string.Empty;
			this.SortKey    = string.Empty;
			this.IsDesc     = true;
			this.CacheMin   = 5;
		}

		public SearchEntity(int page, int pageSize, string searchKey, string searchVal)
		{
			this.Page       = page;
			this.PageSize   = pageSize;
			this.SearchKey  = searchKey;
			this.SearchVal  = searchVal;
			this.SortKey    = string.Empty;
			this.IsDesc     = true;
			this.CacheMin   = 5;
		}

		public int Page { get; set; }

		public int PageSize { get; set; }

		public string SearchKey { get; set; }

		public string SearchVal { get; set; }

		public string SortKey { get; set; }

		public bool IsDesc { get; set; }

		public int CacheMin { get; set; }
	}

	[Serializable()]
	public class PermissionEntity : BaseEntity
	{
		public char Type { get; set; }

		[XmlIgnore]
		public string TypeName
		{
			get
			{
				switch (Type)
				{
					case 'G':
						return "Group";
					case 'D':
						return "Dept";
				}

				return "User";					
			}
		}

		public string Item { get; set; }

		public string Name { get; set; }
	}
}