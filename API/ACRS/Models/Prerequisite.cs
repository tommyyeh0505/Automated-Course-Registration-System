using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class Prerequisite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string PrerequisiteId { get; set; }
        public string CourseName { get; set; }
        public string PrerequisiteCourseName { get; set; }
    }
}
