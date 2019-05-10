using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ACRS.Data;
using ACRS.Models;
using ACRS.Tools;
using Microsoft.AspNetCore.Mvc;

namespace ACRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DownloadController : Controller
    {
        private CoursesController _coursesController;
        private readonly ApplicationDbContext _context;

        public DownloadController(ApplicationDbContext context, CoursesController coursesController)
        {
            _context = context;
            _coursesController = coursesController;
        }

        [HttpGet, Route("waitlist")]
        public async Task<ActionResult> DownloadWaitlistAsync()
        {
            List<Course> courses = _context.Courses.ToList();
            List<List<StudentEligability>> allEligabilities = new List<List<StudentEligability>>();
            
            foreach (Course course in courses)
            {
                allEligabilities.Add(await _coursesController.GetEligableCourseByCourseIdAsync(course.CourseId));
            }

            List<string> headers = new List<string>
            {
                "Student Id",
                "Course Id",
                "CRN",
                "Term"
            };

            List<List<string>> data = new List<List<string>>();

            foreach (List<StudentEligability> eligabilities in allEligabilities)
            {
                foreach(StudentEligability eligability in eligabilities)
                {
                    string studentId = eligability.StudentId;
                    string courseId = eligability.CourseId;

                    Waitlist waitList = _context.Waitlists.Where(w => w.CourseId == courseId &&
                                                                      w.StudentId == studentId).FirstOrDefault();

                    if (waitList != null)
                    {
                        List<string> row = new List<string>();

                        string crn = waitList.CRN;
                        string term = waitList.Term;

                        row.Add(studentId);
                        row.Add(courseId);
                        row.Add(crn);
                        row.Add(term);
                    }
                }
            }

            Stream excel = ExcelWriter.CreateAsStream(headers, data);

            return new FileStreamResult(excel, "application/octet-stream")
            {
                FileDownloadName = "waitlist.xlsx"
            };
        }
    }
}