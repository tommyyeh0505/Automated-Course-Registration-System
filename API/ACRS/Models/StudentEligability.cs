using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class StudentEligability
    {

        public string StudentId { get; set; }
        public string CourseId { get; set; }
        public bool Eligability { get; set; }

        public StudentEligability(string a, string b, bool c)
        {
            StudentId = a;
            CourseId = b;
            Eligability = c;
        }
    }
}
