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

                        var name = csv[14];

                        var id = csv[15];

                        //int.Parse(csv[33].Trim());
                        var finalGrade = 60;
                        var passingGrade = csv[40];

                        Student student = CreateStudent(name, id, "AA@AA.AA");
                        Grade grade = CreateGrade(id, crn, courseId, term, finalGrade);

                        UpdateStudents(student);
                        UpdateGrades(grade);
                    }
                }
            }
        }

        private void UpdateStudents(Student student)
        {
            if (_context.Students.Any(s => s.StudentId == student.StudentId))
            {
                return;
            }

            _context.Students.Add(student);
            _context.SaveChanges();
        }

        private void UpdateGrades(Grade grade)
        {
            if (!_context.Courses.Any(c => c.CRN == grade.CRN && c.Term == grade.Term))
            {
                return;
            }

            _context.Grades.Add(grade);
            _context.SaveChanges();
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