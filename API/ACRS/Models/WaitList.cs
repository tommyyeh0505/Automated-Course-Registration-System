using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class Waitlist
    {
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WaitlistId { get; set; }

        [Required]
        public string StudentId { get; set; }

        [Required]
        public string CourseId { get; set; }

		public string Term { get; set; }
		
		public string CRN { get; set; }
    }
}
