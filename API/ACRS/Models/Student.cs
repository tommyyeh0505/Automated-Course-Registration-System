using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ACRS.Models
{
    public class Student

    {
        [Required]
        //[DisplayName("Student Name")]
        public String stdname { get; set; }

        [Required]
        [Key]
        //[DisplayName("Student Number")]
        public String stdnumber { get; set; }

        [Required]
        [EmailAddress]
        public String email { get; set; }

    }
}
