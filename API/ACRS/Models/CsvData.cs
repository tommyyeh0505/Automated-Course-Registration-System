using CsvHelper;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class CsvData
    {
        public string CRN { get; set; }
        public string CourseId { get; set; }
        public string Term { get; set; }
        public string StudentName { get; set; }
        public string StudentId { get; set; }
        public int FinalGrade { get; set; }
        public string RawGrade { get; set; }

        public CsvData(CsvReader reader, IConfiguration configuration)
        {
            CourseId = reader[configuration.GetValue<int>("CsvColumns:CourseId")];
            CRN = reader[configuration.GetValue<int>("CsvColumns:CRN")];
            Term = reader[configuration.GetValue<int>("CsvColumns:Term")];
            StudentId = reader[configuration.GetValue<int>("CsvColumns:StudentId")];
            StudentName = reader[configuration.GetValue<int>("CsvColumns:StudentName")];
            string finalGradeString = reader[configuration.GetValue<int>("CsvColumns:Grade")].Trim();
            RawGrade = finalGradeString;

            // If FinalGrade = -1, then row will be skipped
            if (finalGradeString.Equals("V", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 0;
            }
            else if (Regex.IsMatch(finalGradeString.Trim(), @"^\d{1,3}\S{1,2}")) // 40F, 10SL
            {
                string grade = new string(finalGradeString.Trim().TakeWhile(char.IsDigit).ToArray());

                FinalGrade = int.Parse(grade);
            }
            else if (finalGradeString.Equals("W", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = -1;
            }
            else if (finalGradeString.Equals("ATT", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 100;
            }
            else if (finalGradeString.Equals("AUD", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 0;
            }
            else if (finalGradeString.Equals("RTD", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = -1;
            }
            else if (finalGradeString.Equals("LW", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = -1;
            }
            else if (finalGradeString.Equals("S", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 100;
            }
            else if (finalGradeString.Equals("U", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 0;
            }
            else if (finalGradeString.Equals("INC", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 0;
            }
            else if (finalGradeString.Equals("TCR", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 100;
            }
            else
            {
                FinalGrade = int.Parse(finalGradeString);
            }
        }
    }
}
