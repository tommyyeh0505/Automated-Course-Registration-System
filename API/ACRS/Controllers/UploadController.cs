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
            List<TestModel> data = null;

            var files = Request.Form.Files;

            if (files.Count == 0)
            {
                return BadRequest("No files");
            }

            foreach (var file in files)
            {
                if (file.Length > 0 && Path.GetExtension(file.FileName).Equals(".csv"))
                {
                    Trace.WriteLine($"Parsing: {file.Name}");
                    data = ParseCsv(file);
                }
                else
                {
                    Trace.WriteLine($"File has 0 bytes or is not a .csv file - Skipping: {file.Name}");
                }
            }

            if (data == null)
            {
                return BadRequest();
            }

            return Ok(data);
        }

        private List<TestModel> ParseCsv(IFormFile file)
        {
            List<TestModel> data = new List<TestModel>();

            using (var stream = file.OpenReadStream())
            {
                using (var reader = new StreamReader(stream))
                {
                    var csv = new CsvReader(reader);
                    while (csv.Read())
                    {

                        var term = csv[0];
                        var crn = csv[1];
                        var subject = csv[3];
                        var courseNo = csv[4];
                        var courseTitle = csv[6];
                        var startDate = csv[9];

                        var name = csv[14];

                        string firstName = csv[14].Split(",").ElementAtOrDefault(0);
                        string lastName = csv[14].Split(",").ElementAtOrDefault(1);

                        var id = csv[15];
                        var grade = csv[33];
                        var passingGrade = csv[40];

                        data.Add(new TestModel
                        {
                            Term = term,
                            CRN = crn,
                            Subject = subject,
                            CourseId = courseNo,
                            CourseName = courseTitle,
                            StartDate = startDate,
                            FirstName = firstName,
                            LastName = lastName,
                            StudentId = id,
                            Grade = grade,
                            PassingGrade = passingGrade
                        });
                    }
                }
            }

            return data;
        }

        public class TestModel
        {
            public string Term { get; set; }
            public string CRN { get; set; }
            public string Subject { get; set; }
            public string CourseId { get; set; }
            public string CourseName { get; set; }
            public string StartDate { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string StudentId { get; set; }
            public string Grade { get; set; }
            public string PassingGrade { get; set; }
        }

    }
}