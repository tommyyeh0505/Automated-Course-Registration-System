using CsvHelper;
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

        public CsvData(CsvReader reader)
        {
            Term = reader[0];
            CRN = reader[1];
            CourseId = reader[8];
            StudentName = reader[14];
            StudentId = reader[15];

            string finalGradeString = reader[33].Trim();

            if (finalGradeString.Equals("V", StringComparison.OrdinalIgnoreCase))
            {
                FinalGrade = 0;
            }
            else
            {
                FinalGrade = int.Parse(finalGradeString);
            }

        }
    }
}
