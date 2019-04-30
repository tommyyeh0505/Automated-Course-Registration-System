using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ACRS.Models
{
    public class Grade

        // String start with lowercase 
        //other public variable start with Capital 
    {   [Key]
        [Column(Order = 0)]
        [Required]
        public string StdID { get; set; }

        [Key]
        [Column(Order = 1)]
        [Required]
        public string CRNs { get; set; }

        [Required]
        public string CourseID { get; set; }

        [Required]
        public string Term { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        [Range(0,500, ErrorMessage ="final garde cannot be negative")]
        public double FinalGrade { get; set; }

    }
}
