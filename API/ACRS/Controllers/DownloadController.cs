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
            List<Waitlist> waitlists = _context.Waitlists.ToList();
            List<List<StudentEligibility>> allEligabilities = new List<List<StudentEligibility>>();

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

            foreach (Waitlist entry in waitlists)
            {
                bool isEligable = false;

                foreach (List<StudentEligibility> eligibilities in allEligabilities)
                {
                    isEligable = eligibilities.Any(s => s.CourseId == entry.CourseId && s.StudentId == entry.StudentId);

                    if (isEligable)
                    {
                        break;
                    }
                }

                data.Add(new List<string>
                {
                    entry.StudentId,
                    entry.CourseId,
                    entry.CRN,
                    entry.Term
                });
            }

            // Sort by courseId then by studentid
            data = data.OrderBy(a => a[1]).ThenBy(a => a[0]).ToList();

            Stream excel = ExcelWriter.CreateAsStream(headers, data);

            return new FileStreamResult(excel, "application/octet-stream")
            {
                FileDownloadName = "waitlist.xlsx"
            };
        }
    }
}