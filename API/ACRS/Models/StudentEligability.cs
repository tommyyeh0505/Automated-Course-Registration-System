using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class StudentEligibility
    {

        public string StudentId { get; set; }
        public string CourseId { get; set; }
        public bool Eligibility { get; set; }

        public StudentEligibility(string a, string b, bool c)
        {
            StudentId = a;
            CourseId = b;
            Eligibility = c;
        }
    }
}
