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
using Microsoft.AspNetCore.Cors;

namespace ACRS.Controllers
{
    [EnableCors("CORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class GradesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public GradesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Grades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Grade>>> GetGrades()
        {
            return await _context.Grades.ToListAsync();
        }

        // GET: api/Grades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Grade>> GetGrade(long id)
        {
            var grade = await _context.Grades.FindAsync(id);

            if (grade == null)
            {
                return NotFound();
            }

            return grade;
        }

        [HttpGet("filter/{courseId?}/{crn?}/{term?}")]
        public async Task<ActionResult<IEnumerable<Grade>>> GetGradesByParams(string courseId = null, string term = null, string crn = null)
        {
            if (courseId != null && term == null && crn == null)
            {
                return await _context.Grades.Where(g => g.CourseId == courseId).ToListAsync();
            }
            else if (courseId != null && term != null && crn == null)
            {
                return await _context.Grades.Where(g => g.CourseId == courseId &&
                                                   g.Term == term).ToListAsync();
            }
            else if (courseId != null && term != null && crn != null)
            {
                return await _context.Grades.Where(g => g.CourseId == courseId &&
                                                   g.Term == term &&
                                                   g.CRN == crn).ToListAsync();
            }
            else
            {
                return await _context.Grades.ToListAsync();
            }
        }

        // PUT: api/Grades/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGrade(long id, Grade grade)
        {
            if (id != grade.GradeId)
            {
                return BadRequest();
            }

            Course course = await _context.Courses.FindAsync(grade.CourseId);
            Grade dbGrade = await _context.Grades.FindAsync(grade.GradeId);

            // Cannot have two entities of the same primary key being tracked!
            _context.Entry(dbGrade).State = EntityState.Detached;

            if (grade.FinalGrade < course.PassingGrade && dbGrade.FinalGrade < course.PassingGrade)
            {
                grade.Attempts++;
            }

            // Raw grade no longer valid, just set it to the value the user inputted!
            grade.RawGrade = grade.FinalGrade.ToString();

            _context.Entry(grade).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GradeExists(id))
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

        // POST: api/Grades
        [HttpPost]
        public async Task<ActionResult<Grade>> PostGrade(Grade grade)
        {
            Course course = await _context.Courses.FindAsync(grade.CourseId);

            if (grade.FinalGrade < course.PassingGrade)
            {
                grade.Attempts++;
            }

            grade.RawGrade = grade.FinalGrade.ToString();

            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGrade", new { id = grade.GradeId }, grade);
        }

        // DELETE: api/Grades/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Grade>> DeleteGrade(long id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
            {
                return NotFound();
            }

            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();

            return grade;
        }

        private bool GradeExists(long id)
        {
            return _context.Grades.Any(e => e.GradeId == id);
        }
    }
}
