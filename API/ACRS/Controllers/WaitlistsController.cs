using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ACRS.Data;
using ACRS.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Authorization;

namespace ACRS.Controllers
{
    [EnableCors("CORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class WaitlistsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WaitlistsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Waitlists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Waitlist>>> GetWaitlists()
        {
            return await _context.Waitlists.ToListAsync();
        }

        // GET: api/Waitlists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Waitlist>> GetWaitlist(int id)
        {
            var waitlist = await _context.Waitlists.FindAsync(id);

            if (waitlist == null)
            {
                return NotFound();
            }

            return waitlist;
        }

        // PUT: api/Waitlists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWaitlist(int id, Waitlist waitlist)
        {
            if (id != waitlist.WaitlistId)
            {
                return BadRequest();
            }

            _context.Entry(waitlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WaitlistExists(id))
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

        [HttpGet("filter/{courseId?}/{crn?}/{term?}")]
        public async Task<ActionResult<IEnumerable<Waitlist>>> GetWaitlistsByParams(string courseId = null, string term = null, string crn = null)
        {
            if (courseId != null && term == null && crn == null)
            {
                return await _context.Waitlists.Where(g => g.CourseId == courseId).ToListAsync();
            }
            else if (courseId != null && term != null && crn == null)
            {
                return await _context.Waitlists.Where(g => g.CourseId == courseId &&
                                                   g.Term == term).ToListAsync();
            }
            else if (courseId != null && term != null && crn != null)
            {
                return await _context.Waitlists.Where(g => g.CourseId == courseId &&
                                                   g.Term == term &&
                                                   g.CRN == crn).ToListAsync();
            }
            else
            {
                return await _context.Waitlists.ToListAsync();
            }
        }

        // POST: api/Waitlists
        [HttpPost]
        public async Task<ActionResult<Waitlist>> PostWaitlist(Waitlist waitlist)
        {
            _context.Waitlists.Add(waitlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWaitlist", new { id = waitlist.WaitlistId }, waitlist);
        }

        // DELETE: api/Waitlists/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Waitlist>> DeleteWaitlist(int id)
        {
            var waitlist = await _context.Waitlists.FindAsync(id);
            if (waitlist == null)
            {
                return NotFound();
            }

            _context.Waitlists.Remove(waitlist);
            await _context.SaveChangesAsync();

            return waitlist;
        }

        [HttpGet("students/{id}")]
        public async Task<IEnumerable<Waitlist>> GetWaitlistByStudent(string id)
        {
            return await _context.Waitlists.Where(w => w.StudentId == id).ToListAsync();
        }

        private bool WaitlistExists(int id)
        {
            return _context.Waitlists.Any(e => e.WaitlistId == id);
        }
    }
}
