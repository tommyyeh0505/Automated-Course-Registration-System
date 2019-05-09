using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ACRS.Data;
using ACRS.Models;
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
        public async Task<IActionResult> DownloadWailist()
        {
            List<List<StudentEligability>> waitlist = _coursesController.GetEligableStudentsAllCourses();

            List<string> headers = new List<string>
            {
                "Student Id",
                "Course Id",
                "CRN",
                "Term"
            };

            

            return null;
        }
    }
}