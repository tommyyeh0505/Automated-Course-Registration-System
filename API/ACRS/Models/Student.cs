using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace ACRS.Models
{
    public class Student
    {
        [Required]
        [Key]
        public string StudentId { get; set; }
<<<<<<< HEAD
=======

        [Required]
        public string StudentName { get; set; }

        [EmailAddress]
        public string Email { get; set; }

>>>>>>> develop
    }
}