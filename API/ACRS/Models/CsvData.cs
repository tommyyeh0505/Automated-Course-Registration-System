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
        public string CourseTitle { get; set; }
        public string Term { get; set; }
        public string StudentName { get; set; }
        public string StudentId { get; set; }
        public int FinalGrade { get; set; }
        public int PassingGrade { get; set; }

        public CsvData(CsvReader reader)
        {
            Term = reader[0];
            CRN = reader[1];
            CourseTitle = reader[6];
            CourseId = reader[8];
            StudentName = reader[14];
            StudentId = reader[15];
            FinalGrade = int.Parse(reader[33]);
            PassingGrade = ExtractPassingGrade(reader[40]);
        }

        private int ExtractPassingGrade(string str)
        {
            string[] numbers = Regex.Split(str, @"\D+");

            if (numbers.Length == 0)
            {
                return 65; // Default passing grade
            }

            try
            {
                return int.Parse(numbers.First());
            }
            catch (FormatException ex)
            {
                return 65;
            }
        }
    }
}
