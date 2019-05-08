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
                    List<CsvData> data = ParseCsv(file);
                    List<UploadError> errors = IsValidCsvFile(data, file.FileName);

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
                        csvReader.Read();
                        csvReader.ReadHeader();

                        while (csvReader.Read())
                        {
                            CsvData r = null;

                            try
                            {
                                r = new CsvData(csvReader);
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

                if (!_context.Courses.Any(c => c.CourseId == r.CourseId))
                {
                    errors.Add(new UploadError
                    {
                        FileName = fileName,
                        Reason = "Course does not exist",
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

        private void UpdateDatabase(List<CsvData> data)
        {
            foreach (CsvData r in data)
            {
                if (r.FinalGrade != -1)
                {
                    if (!_context.Students.Any(s => s.StudentId == r.StudentId))
                    {
                        _context.Students.Add(CreateStudent(r.StudentName, r.StudentId));
                    }

                    Course course = _context.Courses.Find(r.CourseId);
                    Grade uploadedGrade = CreateGrade(r.StudentId, r.CRN, r.CourseId, r.Term, r.FinalGrade);
                    Grade dbGrade = _context.Grades.Where(g => g.CourseId == r.CourseId &&
                                                               g.StudentId == r.StudentId).SingleOrDefault();

                    if (dbGrade != null)
                    {
                        double uploadedFinalGrade = uploadedGrade.FinalGrade;
                        double dbFinalGrade = dbGrade.FinalGrade;

                        if (uploadedFinalGrade > dbFinalGrade)
                        {
                            uploadedGrade.Attempts = dbGrade.Attempts;

                            if (uploadedGrade.FinalGrade < 65)
                            {
                                uploadedGrade.Attempts++;
                            }

                            _context.Remove(dbGrade);
                            _context.Add(uploadedGrade);
                        }
                        else if (uploadedFinalGrade < dbFinalGrade)
                        {
                            // Do nothing, keep the higher
                        }
                        else
                        {
                            // Same grade, what do we want to do?
                        }
                    }
                    else
                    {
                        if (uploadedGrade.FinalGrade < 65)
                        {
                            uploadedGrade.Attempts++;
                        }

                        _context.Add(uploadedGrade);
                    }

                }
            }
            _context.SaveChanges();
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