using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ACRS.Models
{
    public class UploadError
    {
        public string FileName { get; set; }
        public string Reason { get; set; }
        public int? Row { get; set; }
    }
}
