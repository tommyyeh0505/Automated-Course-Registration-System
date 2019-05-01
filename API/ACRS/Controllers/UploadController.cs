using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using ACRS.Data;
using ACRS.Models;
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
        private ApplicationDbContext _context;

        public UploadController(ApplicationDbContext context)
        {
            _context = context;
        }

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
                    Trace.WriteLine($"Parsing: {file.Name}");
                    ParseCsv(file);
                }
                else
                {
                    Trace.WriteLine($"File has 0 bytes or is not a .csv file - Skipping: {file.Name}");
                }
            }

            return Ok();
        }

        private void ParseCsv(IFormFile file)
        {
            using (var stream = file.OpenReadStream())
            {
                using (var reader = new StreamReader(stream))
                {

                    var csv = new CsvReader(reader);

                    // Skip headers
                    csv.Read();
                    csv.ReadHeader();

                    while (csv.Read())
                    {
                        CsvData data = new CsvData(csv);

                        UpdateDatabase(data);
                    }
                }
            }
        }

        private bool UpdateDatabase(CsvData data)
        {
            if (!_context.Students.Any(s => s.StudentId == data.StudentId))
            {
                _context.Students.Add(CreateStudent(data.StudentName, data.StudentId));
            }

            // NOTE: Cannot make new course, don't have data to prerequisites
            if (!_context.Courses.Any(c => c.CRN == data.CRN && c.Term == data.Term))
            {
                return false;
            }

            Grade uploadedGrade = CreateGrade(data.StudentId, data.CRN, data.CourseId, data.Term, data.FinalGrade);

            // If exception is thrown on this line, then there is more than one entry
            // At most there should only be 1 entry in the database for the conditions below
            Grade currentGrade = _context.Grades.Where(g => g.CourseId == data.CourseId &&
                                                            g.StudentId == data.StudentId &&
                                                            g.CRN == data.CRN &&
                                                            g.Term == data.Term).SingleOrDefault();
            if (currentGrade != null)
            {
                if (currentGrade.FinalGrade < uploadedGrade.FinalGrade)
                {
                    _context.Grades.Remove(currentGrade);
                }
                else
                {
                    // Grade in database is higher, ignore the newer one
                    _context.SaveChanges();
                    return true;
                }
            }

            _context.Grades.Add(uploadedGrade);

            _context.SaveChanges();

            return true;
        }

        private Student CreateStudent(string name, string id)
        {
            return new Student()
            {
                StudentName = name,
                StudentId = id
            };
        }

        private Grade CreateGrade(string id, string crn, string courseId, string term, int grade)
        {
            return new Grade()
            {
                StudentId = id,
                CRN = crn,
                CourseId = courseId,
                Term = term,
                FinalGrade = grade
            };
        }

    }
}