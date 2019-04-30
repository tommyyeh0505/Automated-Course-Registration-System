using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ACRS.Models
{
    public class Grade

    {   [Key]
        [Column(Order = 0)]
        [Required]
        public String stdID { get; set; }

        [Key]
        [Column(Order = 1)]
        [Required]
        public String CRNs { get; set; }

        [Required]
        public String courseID { get; set; }

        [Required]
        public String term { get; set; }

        [Required]
        public DateTime date { get; set; }

        [Required]
        [Range(0,500, ErrorMessage ="final garde cannot be negative")]
        public double finalGrade { get; set; }

    }
}
