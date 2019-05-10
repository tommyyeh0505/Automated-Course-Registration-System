using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ACRS.Data;
using ACRS.Models;

namespace ACRS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CoursesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentEligability>>> GetCourses()
        {
            //           return await _context.Courses
            //             .Include(e => e.Prerequisites)
            //           .ToListAsync();
            return GetEligableStudents("COMP1000");

        }

        // GET: api/Courses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Course>> GetCourse(string id)

        {
            var c = await _context.Courses.Include(e => e.Prerequisites).FirstOrDefaultAsync(s => s.CourseId == id);

            if (c == null)
            {
                return NotFound();
            }

            return c;

        }

        // PUT: api/Courses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourse(string id, Course course)
        {
            if (id == null)
            {
                return NotFound();
            }
            var c = await _context.Courses.Include(e => e.Prerequisites).FirstOrDefaultAsync(s => s.CourseId == id);
            if(c.Prerequisites!= null)
            {
                _context.Prerequisites.RemoveRange(c.Prerequisites);

            }

            c.Prerequisites = course.Prerequisites;
            _context.Entry(c).CurrentValues.SetValues(course);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Courses
        [HttpPost]
        public async Task<ActionResult<Course>> PostCourse(Course course)
        {
            _context.Courses.Add(course);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCourse", new { id = course.CourseId }, course);
        }

        // DELETE: api/Courses/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Course>> DeleteCourse(string id)
        {
            var course = await _context.Courses.FindAsync(id);
            if (course == null)
            {
                return NotFound();
            }
            var c = await _context.Courses.Include(e => e.Prerequisites).FirstOrDefaultAsync(s => s.CourseId == id);
            foreach(Prerequisite pr in c.Prerequisites)
            {
                _context.Prerequisites.Remove(pr);
            }
            await _context.SaveChangesAsync();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            return course;
        }

        private bool CourseExists(string id)
        {
            return _context.Courses.Any(e => e.CourseId == id);
        }

        public List<StudentEligability> GetEligableStudents(string CourseID)
        {
            List<Course> courses = _context.Courses.ToList();
            List<Grade> grades = _context.Grades.ToList();
            List<Student> students = _context.Students.ToList();
            var studentMap = new Dictionary<string, int>();
            List<StudentEligability> eligableStudents = new List<StudentEligability>();
            Course targetCourse = courses.FirstOrDefault(o => o.CourseId == CourseID);
            int prereqs = targetCourse.Prerequisites.Count();

            //TODO move to grades loop
            foreach (Student s in students)
            {
                studentMap[s.StudentId] = 0;
            }
       

            //Loop through all grades
            foreach (Grade g in grades)
            {
                if (g.FinalGrade > targetCourse.PassingGrade)
                {
                    studentMap[g.StudentId] = studentMap[g.StudentId] + 1;
                }
            }

            //Loop through all students
            foreach (Student s in students)
            {
                if (studentMap[s.StudentId] >= prereqs)
                {
                    eligableStudents.Add(new StudentEligability(s.StudentId, targetCourse.CourseId, true));
                } else
                {
                    eligableStudents.Add(new StudentEligability(s.StudentId, targetCourse.CourseId, false));

                }

            }
           
            return eligableStudents;
        }

        public List<List<StudentEligability>> GetEligableStudentsAllCourses()
        {
            List<List<StudentEligability>> lists = new List<List<StudentEligability>>();
            List<StudentEligability> students1 = new List<StudentEligability>();
            students1.Add(new StudentEligability("A00000001", "COMP1000", true));
            students1.Add(new StudentEligability("A00000002", "COMP1000", true));
            students1.Add(new StudentEligability("A00000003", "COMP2000", true));

            List<StudentEligability> students2 = new List<StudentEligability>();
            students2.Add(new StudentEligability("A00000004", "COMP5000", true));
            students2.Add(new StudentEligability("A00000005", "COMP5000", true));
            students2.Add(new StudentEligability("A00000006", "COMP5000", true));

            lists.Add(students1);
            lists.Add(students2);
            return lists;
        }

    }
}
