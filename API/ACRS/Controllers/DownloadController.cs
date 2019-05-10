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

        public DownloadController(CoursesController coursesController)
        {
            _coursesController = coursesController;
        }

        [HttpGet, Route("waitlist")]
        public ActionResult DownloadWaitlist()
        {
            List<List<StudentEligibility>> waitlist = _coursesController.GetEligableStudentsAllCourses();

            List<string> headers = new List<string>
            {
                "Student Id",
                "Course Id",
                "CRN",
                "Term"
            };

            List<List<string>> data = new List<List<string>>();

            foreach (List<StudentEligibility> course in waitlist)
            {
                foreach (StudentEligibility studentChoice in course)
                {
                    List<string> row = new List<string>();

                    row.Add(studentChoice.CourseId);
                    row.Add(studentChoice.StudentId);

                    data.Add(row);
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