namespace WebApp;

using System.Data;
using System.Drawing;

using OfficeOpenXml;
using OfficeOpenXml.Style;

static public class ExcelEx
{
	static public readonly string SheetName = "Default";


	static public void SetHeader(this ExcelWorksheet sheet, Dictionary<string, double> dic)
	{
		sheet.Cells[1, 1, 1, dic.Count].SetStyle("#333", true, 12, "#fff");

		for (int i = 0; i < dic.Keys.Count; i++)
			sheet.Cells[1, i + 1].Value = dic.Keys.ElementAt(i);

		for (int i = 0; i < dic.Values.Count; i++)
			sheet.Column(i + 1).Width = dic.Values.ElementAt(i);
	}

	static public void SetValue(this ExcelWorksheet sheet, int rowNo, params object[] values)
	{
		string bgColor = "#fff";

		if (rowNo % 2 == 0)
			bgColor = "#fff";
		else
			bgColor = "#f0f0f0";

		SetValue(sheet, rowNo, 1, 0, bgColor, values);
	}

	static public void SetValue(this ExcelWorksheet sheet, int rowNo, int rowSpan, int first, string bgColor, params object[] values)
	{
		int row = rowNo + 2;

		sheet.Cells["A" + row].SetStyle("#fffed4", true, 11);

		for (int i = 0; i < values.Length; i++)
		{
			int col = first + i + 1;

			if (rowSpan > 1)
			{
				string merge = string.Format("{2}{0}:{2}{1}", row, row + rowSpan - 1, col);
				sheet.Cells[merge].Merge = true;
			}

			ExcelRange cell = sheet.Cells[row, col];
			cell.SetStyle(bgColor, false, 11);
			cell.Style.WrapText = true;
			cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
			cell.Value = values[i];
			cell.Style.Border.BorderAround(ExcelBorderStyle.Thin, ColorTranslator.FromHtml("#888"));
		}
	}

	static public ExcelRange SetStyle(this ExcelRange cell, string bgColorStr, bool bold, int fontSize, string? fontColorStr = null)
	{
		cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
		cell.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(bgColorStr));
		cell.Style.Font.Bold = bold;
		cell.Style.Font.Size = fontSize;
		if (!string.IsNullOrWhiteSpace(fontColorStr))
			cell.Style.Font.Color.SetColor(ColorTranslator.FromHtml(fontColorStr));

		return cell;
	}

	static public ExcelColumn SetStyle(this ExcelColumn column, string bgColorStr, bool bold, int fontSize)
	{
		column.Style.Fill.PatternType = ExcelFillStyle.Solid;
		column.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(bgColorStr));
		column.Style.Font.Bold = bold;
		column.Style.Font.Size = fontSize;

		return column;
	}

	static public DataTable GetDataTableFromExcel(string path, bool hasHeader = true)
	{
		using (var pck = new OfficeOpenXml.ExcelPackage())
		{
			using (var stream = File.OpenRead(path))
			{
				pck.Load(stream);
			}
			var ws = pck.Workbook.Worksheets.First();
			DataTable tbl = new DataTable();
			foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
			{
				tbl.Columns.Add(hasHeader ? firstRowCell.Text : string.Format("Column {0}", firstRowCell.Start.Column));
			}
			var startRow = hasHeader ? 2 : 1;
			for (int rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
			{
				var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
				DataRow row = tbl.Rows.Add();
				foreach (var cell in wsRow)
				{
					row[cell.Start.Column - 1] = cell.Text;
				}
			}
			return tbl;
		}
	}

	static public string GetColName(int colNo)
	{
		int dividend = colNo;
		string columnName = String.Empty;
		int modulo;

		while (dividend > 0)
		{
			modulo = (dividend - 1) % 26;
			columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
			dividend = (int)((dividend - modulo) / 26);
		}

		return columnName;
	}
}