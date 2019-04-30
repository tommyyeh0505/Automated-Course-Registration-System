using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ACRS.Models
{
    public class Student

    {
        [Required]
        //[DisplayName("Student Name")]
        public string Stdname { get; set; }

        [Required]
        [Key]
        //[DisplayName("Student Number")]
        public string Stdnumber { get; set; }

        [EmailAddress]
        public string Email { get; set; }

    }
}
