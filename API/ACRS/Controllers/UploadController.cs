using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
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
        ApplicationDbContext _context;

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
                    while (csv.Read())
                    {
                        var term = csv[0];
                        var crn = csv[1];
                        var subject = csv[3];
                        var courseNo = csv[4];
                        var courseId = subject + courseNo;
                        var courseTitle = csv[6];
                        var startDate = DateTime.ParseExact(csv[9], "MM/dd/yyyy HH::mm", null);
                        var endDate = DateTime.ParseExact(csv[10], "MM/dd/yyyy HH::mm", null);

                        var name = csv[14];

                        var id = csv[15];
                        var finalGrade = int.Parse(csv[33]);
                        var passingGrade = csv[40];

                        Student student = CreateStudent(name, id, null);
                        Grade grade = CreateGrade(id, crn, courseId, term, startDate, endDate, finalGrade);

                        UpdateStudents(student);
                        UpdateGrades(grade);
                    }
                }
            }
        }

        private void UpdateStudents(Student student)
        {
            if (_context.Student.Any(s => s.StudentId == student.StudentId))
            {
                return;
            }

            _context.Student.Add(student);
            _context.SaveChanges();
        }

        private void UpdateGrades(Grade grade)
        {
            // courseid
            // studentid
            //Grade g = _context.Grade.Select(g => g.CourseID == grade.CourseID && g.StudentId == grade.StudentId).SingleOrDefault();
        }

        private Student CreateStudent(string name, string id, string email)
        {
            return new Student()
            {
                SudentName = name,
                StudentId = id,
                Email = email
            };
        }

        private Grade CreateGrade(string id, string crn, string courseId, string term, DateTime startDate, DateTime endDate, int grade)
        {
            return new Grade()
            {
                StudentId = id,
                CRN = crn,
                CourseID = courseId,
                Term = term,
                StartDate = startDate,
                EndDate = endDate,
                FinalGrade = grade
            };
        }
    }
}