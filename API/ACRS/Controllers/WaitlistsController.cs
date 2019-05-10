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

namespace ACRS.Controllers
{
    [EnableCors("CORSPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class WaitListsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WaitListsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/WaitLists
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WaitList>>> GetWaitLists()
        {
            return await _context.WaitLists.ToListAsync();
        }

        // GET: api/WaitLists/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WaitList>> GetWaitList(int id)
        {
            var waitlist = await _context.WaitLists.FindAsync(id);

            if (waitlist == null)
            {
                return NotFound();
            }

            return waitlist;
        }

        // PUT: api/WaitLists/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWaitList(int id, WaitList waitlist)
        {
            if (id != waitlist.WaitListId)
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
                if (!WaitListExists(id))
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

        // POST: api/WaitLists
        [HttpPost]
        public async Task<ActionResult<WaitList>> PostWaitList(WaitList waitlist)
        {
            _context.WaitLists.Add(waitlist);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWaitList", new { id = waitlist.WaitListId }, waitlist);
        }

        // DELETE: api/WaitLists/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<WaitList>> DeleteWaitList(int id)
        {
            var waitlist = await _context.WaitLists.FindAsync(id);
            if (waitlist == null)
            {
                return NotFound();
            }

            _context.WaitLists.Remove(waitlist);
            await _context.SaveChangesAsync();

            return waitlist;
        }

        [HttpGet("students/{id}")]
        public async Task<IEnumerable<WaitList>> GetWaitListByStudent(string id)
        {
            return await _context.WaitLists.Where(w => w.StudentId == id).ToListAsync();
        }

        private bool WaitListExists(int id)
        {
            return _context.WaitLists.Any(e => e.WaitListId == id);
        }
    }
}
