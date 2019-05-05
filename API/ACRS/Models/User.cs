using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace ACRS.Models
{
    public class User : IdentityUser
    {
        // String start with lowercase 
        //other public variable start with Capital 
        public User() : base() { }


        [Key]
        [StringLength(20, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 4)]
        public string Username { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 4)]
        public string Password { get; set; }

    }
}