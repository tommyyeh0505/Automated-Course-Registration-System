using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class Course
    {
        [Required]
        [Key, Column(Order = 0)]
        public string CourseId { get; set; }

        public int PassingGrade { get; set; }

        public List<Prerequisite> Prerequisites { get; set; }


    }
}
