using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ACRS.Models;
using ACRS.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors;

namespace ACRS.Controllers
{
    [EnableCors("CORSPolicy")]
    [Route("api/WaitLists")]
    public class WaitListController : Controller
    {

        private readonly ApplicationDbContext _context;

        public WaitListController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WaitList>>> Get()
        {
            return await _context.WaitLists
                .ToListAsync();
        }

        // GET api/values/5
        [HttpGet("{id}")]
        public async Task<ActionResult<WaitList>> GetWaitList(string id)
        {
            var waitList = await _context.WaitLists.FindAsync(id);

            if (waitList == null)
            {
                return NotFound();
            }

            return waitList;
        }

        // POST: api/WaitLists
        [HttpPost]
        public async Task<ActionResult<WaitList>> PostWaitList(WaitList waitList)
        {
            _context.WaitLists.Add(waitList);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWaitList", new { id = waitList.WaitListId }, waitList);
        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWaitList(int id, WaitList waitList)
        {
            if (id != waitList.WaitListId)
            {
                return BadRequest();
            }

            _context.Entry(waitList).State = EntityState.Modified;

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

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<WaitList>> DeleteWaitList(string id)
        {
            var waitList = await _context.WaitLists.FindAsync(id);
            if (waitList == null)
            {
                return NotFound();
            }

            _context.WaitLists.Remove(waitList);
            await _context.SaveChangesAsync();

            return waitList;
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
