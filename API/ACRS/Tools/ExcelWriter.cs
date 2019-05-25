using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;

namespace ACRS.Tools
{
    public static class ExcelWriter
    {
        public static MemoryStream CreateAsStream(List<string> header, List<List<string>> data)
        {
            return new MemoryStream(CreateExcelPackage(header, data).GetAsByteArray());
        }

        private static ExcelPackage CreateExcelPackage(List<string> header, List<List<string>> data)
        {
            ExcelPackage package = new ExcelPackage();
            package.Workbook.Worksheets.Add("A");
            ExcelWorksheet worksheet = package.Workbook.Worksheets["A"];

            AddHeader(worksheet, header);
            AddData(worksheet, data);

            // Must be called AFTER filling with data
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            return package;
        }

        private static void AddHeader(ExcelWorksheet worksheet, List<string> header)
        {
            List<string[]> row = new List<string[]>
            {
                header.ToArray()
            };

            string range = "A1:" + char.ConvertFromUtf32(row[0].Length + 64) + "1";
            worksheet.Cells[range].LoadFromArrays(row);
        }

        private static void AddData(ExcelWorksheet worksheet, List<List<string>> data)
        {
            var format = new ExcelTextFormat();
            format.Delimiter = ',';
            format.TextQualifier = '"';

            for (int i = 0; i < data.Count; i++)
            {
                for (int j = 0; j < data[i].Count; j++)
                {
                    worksheet.Cells[i + 2, j + 1].LoadFromText('"' + data[i][j] + '"', format);
                }
            }
        }
    }
}
