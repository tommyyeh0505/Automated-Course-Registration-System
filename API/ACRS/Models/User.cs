using System;
using System.ComponentModel.DataAnnotations;

namespace ACRS.Models
{
    public class User

    // String start with lowercase 
    //other public variable start with Capital 

    {
        [Required]
        [Key]
        [StringLength(20, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 4)]
        public String username { get; set; }

        [Required]
        [StringLength(20, ErrorMessage = "{0} length must be between {2} and {1}.", MinimumLength = 4)]
        public String password { get; set; }

    }
}
