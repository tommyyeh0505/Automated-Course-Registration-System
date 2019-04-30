using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ACRS.Models
{
    public class Grade

        // String start with lowercase 
        //other public variable start with Capital 
    {

        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int GradeId { get; set; }

        [Required]
        public string StudentId { get; set; }

        public string CRN { get; set; }

        public string CourseID { get; set; }

        public string Term { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        [Range(0,500, ErrorMessage ="final garde cannot be negative")]
        public double FinalGrade { get; set; }

    }
}
