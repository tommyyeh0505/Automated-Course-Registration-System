using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ACRS.Models
{
    public class Student

    {
        [Required]
        public string SudentName { get; set; }

        [Required]
        [Key]
        public string StudentId { get; set; }
    }
}