using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class Course
    {
        [Required]
        [Key]
        public string CourseName { get; set; }
        public int PassingGrade { get; set; }
        public List<Prerequisite> Prerequisites { get; set; }

    }
}
