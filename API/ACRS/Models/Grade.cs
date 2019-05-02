using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ACRS.Models
{
    public class Grade
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GradeId { get; set; }

        public string StudentId { get; set; }

        public string CRN { get; set; }

        public string CourseId { get; set; }

        public string Term { get; set; }

        [Range(0, 100, ErrorMessage = "Value must be between 0 and 100")]
        public double FinalGrade { get; set; }

    }
}
