using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ACRS.Data;
using ACRS.Models;
using Microsoft.AspNetCore.Authorization;

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
        public async Task<ActionResult<IEnumerable<Course>>> GetCourses()
        {
                       return await _context.Courses
                         .Include(e => e.Prerequisites)
                      .ToListAsync();

        }

        // GET: api/Courses
        [HttpGet("{id}/eligible")]
        public async Task<ActionResult<IEnumerable<StudentEligibility>>> GetEligableCourseByCourseId(string id)
        {
            return await GetEligableCourseByCourseIdAsync(id);

        }

        // GET: api/Courses
        [HttpGet("{id}/ineligible")]
        public async Task<ActionResult<IEnumerable<StudentEligibility>>> GetCourseInEligabilityByCourseId(string id)
        {
            return await GetInEligableCourseByCourseIdAsync(id);

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

            if ((await _context.Grades.Where(g => g.CourseId == course.CourseId).ToListAsync()).Count != 0)
            {
                return BadRequest("Courses with grades cannot be deleted");
            }

            var c = await _context.Courses.Include(e => e.Prerequisites).FirstOrDefaultAsync(s => s.CourseId == id);

            foreach(Prerequisite pr in c.Prerequisites)
            {
                _context.Prerequisites.Remove(pr);
            }

            await _context.SaveChangesAsync();

            _context.Courses.Remove(course);
            await _context.SaveChangesAsync();

            //delete all courses with course as prereq
            List<Course> crs = await _context.Courses.Include(e => e.Prerequisites).ToListAsync();
            if (crs != null)
            {
                foreach(Course cs in crs){
                    List<Prerequisite> prereqs = cs.Prerequisites;

                    //Delete prereq if it exisits
                    if(prereqs.Any(a => a.PrerequisiteCourseId == id)) {
                        var itemToRemove = prereqs.Single(r => r.PrerequisiteCourseId == id);
                        prereqs.Remove(itemToRemove);
                        cs.Prerequisites = prereqs;
                        _context.Entry(cs).CurrentValues.SetValues(cs);
                    }

                }

            }

            await _context.SaveChangesAsync();


            return course;
        }

        private bool CourseExists(string id)
        {
            return _context.Courses.Any(e => e.CourseId == id);
        }

        public async Task<List<StudentEligibility>> GetEligableCourseByCourseIdAsync(string courseId)
        {
            List<Course> courses = await _context.Courses.Include(o => o.Prerequisites).ToListAsync();
            List<Grade> grades = await _context.Grades.ToListAsync();
            List<Student> students = await _context.Students.ToListAsync();
            var studentMap = new Dictionary<string, List<string>>();
            var notStudentMap = new Dictionary<string, List<string>>();
            List<StudentEligibility> eligibleStudents = new List<StudentEligibility>();
            Course targetCourse = courses.FirstOrDefault(o => o.CourseId == courseId);

            List<string> prereqs = new List<string>();
            if (targetCourse.Prerequisites != null)
            {
                foreach (Prerequisite pr in targetCourse.Prerequisites)
                {
                    prereqs.Add(pr.PrerequisiteCourseId);
                }
            }
            int numPrereqs = prereqs.Count();
            //TODO move to grades loop
            foreach (Student s in students)
            {
                studentMap[s.StudentId] = new List<string>();
                notStudentMap[s.StudentId] = new List<string>();
            }
            //Loop through all grades
            foreach (Grade g in grades)
            {
                if (prereqs.Contains(g.CourseId))
                {
                    if (g.FinalGrade >= targetCourse.PassingGrade)
                    {
                        studentMap[g.StudentId].Add(g.CourseId);
                    }
                    else
                    {
                        notStudentMap[g.StudentId].Add(g.CourseId);
                    }
                }
            }

            //Loop through all students
            foreach (Student s in students)
            {
                if (studentMap[s.StudentId].Intersect(prereqs).Count() == prereqs.Count())

                {
                    eligibleStudents.Add(new StudentEligibility(s.StudentId, targetCourse.CourseId, true, null));
                }
            }
            return eligibleStudents;
        }


        public async Task<List<StudentEligibility>> GetInEligableCourseByCourseIdAsync(string courseId)
        {
            List<Course> courses = await _context.Courses.Include(o => o.Prerequisites).ToListAsync();
            List<Grade> grades = await _context.Grades.ToListAsync();
            List<Student> students = await _context.Students.ToListAsync();
            var studentMap = new Dictionary<string, List<string>>();
            var notStudentMap = new Dictionary<string, List<string>>();
            List<StudentEligibility> eligibleStudents = new List<StudentEligibility>();
            Course targetCourse = courses.FirstOrDefault(o => o.CourseId == courseId);

            List<string> prereqs = new List<string>();
            if (targetCourse.Prerequisites != null)
            {
                foreach (Prerequisite pr in targetCourse.Prerequisites)
                {
                    prereqs.Add(pr.PrerequisiteCourseId);
                }
            }
            int numPrereqs = prereqs.Count();
            //TODO move to grades loop
            foreach (Student s in students)
            {
                studentMap[s.StudentId] = new List<string>();
                notStudentMap[s.StudentId] = new List<string>();
            }
            //Loop through all grades
            foreach (Grade g in grades)
            {
                if (prereqs.Contains(g.CourseId))
                {
                    if (g.FinalGrade >= targetCourse.PassingGrade)
                    {
                        studentMap[g.StudentId].Add(g.CourseId);
                    }
                    else
                    {
                        notStudentMap[g.StudentId].Add(g.CourseId);
                    }
                }
            }

            //Loop through all students
            foreach (Student s in students)
            {
                if (studentMap[s.StudentId].Intersect(prereqs).Count() != prereqs.Count())

                {
                    List<string> temp = prereqs.Where(p => !studentMap[s.StudentId].Any(p2 => p2 == p)).ToList();
                    eligibleStudents.Add(new StudentEligibility(s.StudentId, targetCourse.CourseId, true, temp));
                }
            }
            return eligibleStudents;
        }

        public async Task<List<List<StudentEligibility>>> GetEligableStudentsAllCourses()
        {
            List<List<StudentEligibility>> lists = new List<List<StudentEligibility>>();
            List<Course> courses = await _context.Courses.Include(o => o.Prerequisites).ToListAsync();

            foreach(Course c in courses)
            {
                List<StudentEligibility> l = await GetEligableCourseByCourseIdAsync(c.CourseId);
                lists.Add(l);
            }
            return lists;
        }

    }
}
