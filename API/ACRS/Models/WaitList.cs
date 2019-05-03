﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class WaitList
    {

        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WaitListID { get; set; }

        [Required]
        public string StudentID { get; set; }

        [Required]
        public string CourseID { get; set; }

    }
}