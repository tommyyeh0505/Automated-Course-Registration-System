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
        private readonly ApplicationDbContext _context;

        public UploadController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost, DisableRequestSizeLimit]
        public ActionResult Upload()
        {
            List<UploadError> failed = new List<UploadError>();

            var files = Request.Form.Files;

            if (files.Count == 0)
            {
                return BadRequest();
            }

            foreach (var file in files)
            {
                if (file.Length > 0 && Path.GetExtension(file.FileName).Equals(".csv"))
                {
                    if (!ParseCsv(file))
                    {
                        failed.Add(new UploadError { FileName = file.Name, Reason = "Invalid record or course may not have been created yet" });
                    }
                }
                else
                {
                    failed.Add(new UploadError { FileName = file.Name, Reason = "File has 0 bytes or is not a .csv file" });
                }
            }

            return Accepted(failed);
        }

        private bool ParseCsv(IFormFile file)
        {
            bool status = false;

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
                        try
                        {
                            CsvData data = new CsvData(csv);
                            status = UpdateDatabase(data);
                        }
                        catch (Exception)
                        {
                            return false;
                        }
                    }

                    if (!status)
                    {
                        return false;
                    }
                    else
                    {
                        _context.SaveChanges();
                    }
                }
            }

            return true;
        }

        private bool UpdateDatabase(CsvData data)
        {
            if (!_context.Students.Any(s => s.StudentId == data.StudentId))
            {
                _context.Students.Add(CreateStudent(data.StudentName, data.StudentId));
            }

            if (!_context.Courses.Any(c => c.CRN == data.CRN && c.Term == data.Term))
            {
                return false;
            }

            Grade uploadedGrade = CreateGrade(data.StudentId, data.CRN, data.CourseId, data.Term, data.FinalGrade);

            // If exception is thrown on this line, then there is more than one entry
            // At most there should only be 1 entry in the database for the conditions below
            Grade currentGrade = _context.Grades.Where(g => g.CourseId == data.CourseId &&
                                                            g.StudentId == data.StudentId).SingleOrDefault();
            if (currentGrade != null)
            {
                if (currentGrade.FinalGrade < uploadedGrade.FinalGrade)
                {
                    _context.Grades.Remove(currentGrade);
                }
                else
                {
                    return true;
                }
            }

            _context.Grades.Add(uploadedGrade);

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