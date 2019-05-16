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
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.ToListAsync();
        }

        // GET: api/Student
        [HttpGet("{id}/eligible")]
        public async Task<ActionResult<IEnumerable<StudentEligibility>>> GetEligableCourseByStudentId(string id)
        {
            return await GetEligableCourseByStudentIdAsync(id);

        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(string id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        // PUT: api/Students/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(string id, Student student)
        {
            if (id != student.StudentId)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Students
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.StudentId }, student);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Student>> DeleteStudent(string id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            List<Grade> grades = _context.Grades.ToList();
            foreach(Grade g in grades)
            {
                if (g.StudentId.Equals(student.StudentId))
                {
                    _context.Grades.Remove(g);
                }
            }
            await _context.SaveChangesAsync();
            return student;
        }

        [HttpGet("{id}/grades")]
        public async Task<IEnumerable<Grade>> GetStudentGrades(string id)
        {
            return await _context.Grades.Where(g => g.StudentId == id).ToListAsync();
        }

        private bool StudentExists(string id)
        {
            return _context.Students.Any(e => e.StudentId == id);
        }


        public async Task<List<StudentEligibility>> GetEligableCourseByStudentIdAsync(string StudentId)
        {
            List<Course> courses = await _context.Courses.Include(o => o.Prerequisites).ToListAsync();
            List<Grade> grades = await _context.Grades.Where(g => g.StudentId == StudentId).ToListAsync();
            var CourseMap = new Dictionary<string, double>();
            List<StudentEligibility> eligibleStudents = new List<StudentEligibility>();
            var CoursePassingGradeMap = new Dictionary<string, int>();
            /*
            foreach (Grade g in grades)
            {
                if (CourseMap.ContainsKey(g.CourseId) ==true)
                {
                   if (g.FinalGrade > CourseMap[g.CourseId])
                    {
                        CourseMap[g.CourseId] = g.FinalGrade;
                    }
                }
                else
                {
                    CourseMap[g.CourseId] = g.FinalGrade;
                }
            }
            foreach (Course c in courses)
            {
                int prerequisites = 0;
                int count = 0;

                if (c.Prerequisites == null)
                {
                    eligibleStudents.Add(new StudentEligibility(StudentId, c.CourseId, true));
                }
                else
                {
                    prerequisites = c.Prerequisites.Count();
                    foreach (Prerequisite p in c.Prerequisites)
                    {
                        if (CourseMap.ContainsKey(p.CourseId))
                        {
                            Course temp = await _context.Courses.FindAsync(p.CourseId);

                            if (CourseMap[p.CourseId] < temp.PassingGrade){
                                eligibleStudents.Add(new StudentEligibility(StudentId, c.CourseId, false));
                                break;
                            }
                            else
                            {
                                count++;
                            }
                        }
                        else
                        {
                            eligibleStudents.Add(new StudentEligibility(StudentId, c.CourseId, false, ));
                            break;
                        }
                    }
                    if (count >= prerequisites)
                    {
                        eligibleStudents.Add(new StudentEligibility(StudentId, c.CourseId, true));
                    }
                }
            }
            */
            return eligibleStudents;

    }
}

}
