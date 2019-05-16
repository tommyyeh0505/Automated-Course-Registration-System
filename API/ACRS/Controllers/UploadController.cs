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
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ACRS.Controllers
{
    [EnableCors("CORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public class UploadController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public UploadController(ApplicationDbContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost, DisableRequestSizeLimit]
        public ActionResult Upload()
        {
            List<UploadError> totalErrors = new List<UploadError>();

            var files = Request.Form.Files;

            if (files.Count == 0)
            {
                return BadRequest();
            }

            foreach (var file in files)
            {
                if (file.Length > 0 && Path.GetExtension(file.FileName).Equals(".csv"))
                {
                    List<CsvData> data = null;
                    List<UploadError> errors = new List<UploadError>();

                    if (file == null) {
                        errors.Add(new UploadError() { FileName = file.FileName, Reason = "File does not exists", Row = null });
                        continue;
                    }

                    try
                    {
                        data = ParseCsv(file);
                    }
                    catch (Exception)
                    {
                        errors.Add(new UploadError() { FileName = file.Name, Reason = "File is not a csv file", Row = null });
                    }

                    if (data != null)
                    {
                        errors = IsValidCsvFile(data, file.FileName);
                    }

                    if (errors.Count == 0)
                    {
                        UpdateDatabase(data);
                    }
                    else
                    {
                        totalErrors.AddRange(errors);
                    }
                }
                else
                {
                    totalErrors.Add(new UploadError { FileName = file.FileName, Reason = "File is not a .csv or has 0 bytes", Row = null });
                }
            }

            return Accepted(totalErrors);
        }

        private List<CsvData> ParseCsv(IFormFile file)
        {
            List<CsvData> data = new List<CsvData>();

            using (var stream = file.OpenReadStream())
            {
                using (var streamReader = new StreamReader(stream))
                {
                    using (var csvReader = new CsvReader(streamReader))
                    {
                        csvReader.Configuration.IgnoreBlankLines = true;

                        csvReader.Read();
                        csvReader.ReadHeader();

                        while (csvReader.Read())
                        {
                            CsvData r = null;

                            try
                            {
                                r = new CsvData(csvReader, _configuration);
                            }
                            catch (Exception)
                            {
                                r = null;
                            }

                            data.Add(r);
                        }
                    }
                }
            }

            return data;
        }

        private List<UploadError> IsValidCsvFile(List<CsvData> data, string fileName)
        {
            List<UploadError> errors = new List<UploadError>();

            // Row adds 2 to i due to offset of header, and row indices starting at 1 not 0
            for (int i = 0; i < data.Count; i++)
            {
                CsvData r = data[i];

                if (r == null)
                {
                    errors.Add(new UploadError
                    {
                        FileName = fileName,
                        Reason = "Parsing of row failed due to incorrect data format in column",
                        Row = i + 2
                    });
                    continue;
                }

                if (AnyNullEmptyOrWhitespace(
                      r.CRN,
                      r.CourseId,
                      r.Term,
                      r.StudentName,
                      r.StudentId))
                {
                    errors.Add(new UploadError
                    {
                        FileName = fileName,
                        Reason = "Empty or invalid column",
                        Row = i + 2
                    });
                }
            }

            return errors;
        }

        private bool AnyNullEmptyOrWhitespace(params string[] strings)
        {
            return strings.Any(s => string.IsNullOrEmpty(s) || string.IsNullOrWhiteSpace(s));
        }

        // MUST save context changes after any add delete, or anything, else EntityFramework will stack all requests
        // since we don't have a composite key
        private void UpdateDatabase(List<CsvData> data)
        {
            foreach (CsvData r in data)
            {
                if (r.FinalGrade != -1)
                {
                    if (_context.Students.Find(r.StudentId) == null)
                    {
                        _context.Students.Add(CreateStudent(r.StudentName, r.StudentId));
                        _context.SaveChanges();
                    }

                    Course course = _context.Courses.Find(r.CourseId);
                    Grade uploadedGrade = CreateGrade(r.StudentId, r.CRN, r.CourseId, r.Term, r.FinalGrade, r.RawGrade);
                    Grade dbGrade = _context.Grades.Where(g => g.StudentId == r.StudentId &&
                                                                      g.CourseId == r.CourseId).SingleOrDefault();

                    if (course == null)
                    {
                        course = new Course
                        {
                            CourseId = r.CourseId,
                            PassingGrade = 65
                        };

                        _context.Add(course);
                        _context.SaveChanges();
                    }

                    if (dbGrade != null)
                    {
                        double uploadedFinalGrade = uploadedGrade.FinalGrade;
                        double dbFinalGrade = dbGrade.FinalGrade;

                        if (uploadedFinalGrade > dbFinalGrade)
                        {
                            uploadedGrade.Attempts = dbGrade.Attempts;

                            if (uploadedGrade.FinalGrade < course.PassingGrade)
                            {
                                uploadedGrade.Attempts++;
                            }

                            _context.Remove(dbGrade);

                            // Must save changes first before attempting to add, as EntityFramework will insert first!
                            _context.SaveChanges();

                            _context.Add(uploadedGrade);
                            _context.SaveChanges();
                        }
                        else if (uploadedFinalGrade < dbFinalGrade)
                        {
                            // Keep higher grade
                        }
                        else
                        {
                            // Same grade, do nothing
                        }
                    }
                    else
                    {
                        if (uploadedGrade.FinalGrade < course.PassingGrade)
                        {
                            uploadedGrade.Attempts++;
                        }

                        _context.Add(uploadedGrade);
                        _context.SaveChanges();
                    }

                }
            }
        }

        private Student CreateStudent(string name, string id)
        {
            return new Student()
            {
                StudentName = name,
                StudentId = id
            };
        }

        private Grade CreateGrade(string id, string crn, string courseId, string term, int grade, string rawGrade)
        {
            return new Grade()
            {
                StudentId = id,
                CRN = crn,
                CourseId = courseId,
                Term = term,
                FinalGrade = grade,
                RawGrade = rawGrade
            };
        }
    }
}
