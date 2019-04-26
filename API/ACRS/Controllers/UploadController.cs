using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CsvHelper;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace ACRS.Controllers
{
    [EnableCors("CORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        [HttpPost, DisableRequestSizeLimit]
        public ActionResult Upload()
        {
            var files = Request.Form.Files;

            if (files.Count == 0)
            {
                return BadRequest("No files");
            }

            foreach (var file in files)
            {
                if (file.Length > 0 && Path.GetExtension(file.FileName).Equals(".csv"))
                {
                    ParseCsv(file);
                }
            }

            return Ok();
        }

        private bool ParseCsv(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                using (var reader = new StreamReader(stream))
                {
                    var csv = new CsvReader(reader);
                    while (csv.Read())
                    {
                        var crn = csv[1];
                        var courseNo = csv[4];
                        var name = csv[14];
                        var id = csv[15];
                        var grade = csv[33];

                        Debug.WriteLine($"CRN: {crn} Course No: {courseNo} Name: {name} ID: {id} Grade: {grade}");
                    }
                }
            }

            return true;
        }
    }
}