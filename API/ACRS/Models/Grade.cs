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

        [Required]
        public string CRN { get; set; }

        [Required]
        public string CourseID { get; set; }

        [Required]
        public string Term { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        [Range(0,500, ErrorMessage ="final garde cannot be negative")]
        public double FinalGrade { get; set; }

    }
}
