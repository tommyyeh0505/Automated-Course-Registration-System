using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ACRS.Models
{
    public class Grade
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long GradeId { get; set; }

        public string StudentId { get; set; }

        public string CRN { get; set; }

        public string CourseId { get; set; }

        public string Term { get; set; }

        public double FinalGrade { get; set; }

        public int Attempts { get; set; }
    }
}
