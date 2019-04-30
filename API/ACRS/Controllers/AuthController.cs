using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ACRS.Data;
using ACRS.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ACRS
{

    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly ApplicationDbContext _context;
        private IConfiguration _config;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(UserManager<IdentityUser> userManager, ApplicationDbContext context, IConfiguration config)
        {
            _userManager = userManager;
            _context = context;
            _config = config;
        }

        [Authorize]
        //https://localhost:5001/api/Auth/register
        [Route("register")]
        [HttpPost]
        public async Task<ActionResult> InsertUser([FromBody] User model)
        {

            //check do they have same username for Identity User
            //if yes reject it 
            var CheckUser = await _userManager.FindByNameAsync(model.username);

            if (CheckUser != null)
            {
                return Unauthorized();
            }

            var user = new IdentityUser
            {
                UserName = model.username,
                SecurityStamp = Guid.NewGuid().ToString()
            };
            var result = await _userManager.CreateAsync(user, model.password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "ADMIN");
            }
            return Ok(new { Username = user.UserName });
        }

        //https://localhost:5001/api/Auth/login
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult> LoginAsync([FromBody] User model)
        {
            var user = await _userManager.FindByNameAsync(model.username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.password))
            {
            var claim = new[] {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserName)
      };
            var signinKey = new SymmetricSecurityKey(
              Encoding.UTF8.GetBytes(_config["Jwt:SigningKey"]));

            int expiryInMinutes = Convert.ToInt32(_config["Jwt:ExpiryInMinutes"]);
            
                //set expires time in 8 hours
            var token = new JwtSecurityToken(
              issuer: _config["Jwt:Site"],
              audience: _config["Jwt:Site"],
              expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
              signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
            );

            return Ok(
              new
              {
                  token = new JwtSecurityTokenHandler().WriteToken(token),
                  expiration = token.ValidTo
              });
            }
            return Unauthorized();
        }


        // GET: Auth
        [Route("AllAuth")]
        public async Task<IActionResult> Index()
            {
                return View(await _context.User.ToListAsync());
            }

            // GET: Auth/Details/5
            public async Task<IActionResult> Details(string id)
            {
                if (id == null)
                {
                    return NotFound();
                }

                var user = await _context.User
                    .FirstOrDefaultAsync(m => m.username == id);
                if (user == null)
                {
                    return NotFound();
                }

                return View(user);
            }
            

            // POST: Auth/Create
            // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
            // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
            [HttpPost]
            [ValidateAntiForgeryToken]
            public async Task<IActionResult> Create([Bind("username,password")] User user)
            {
                if (ModelState.IsValid)
                {
                    _context.Add(user);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                return View(user);
            }

            //// GET: Auth/Edit/5
            //public async Task<IActionResult> Edit(string id)
            //{
                //if (id == null)
                //{
                //    return NotFound();
                //}

                //var user = await _context.User.FindAsync(id);
                //if (user == null)
                //{
                //    return NotFound();
                //}
                //return View(user);
            //}

            // POST: api/Auth/Edit/5
            // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
            // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
            [HttpPost]
            [ValidateAntiForgeryToken]
            public async Task<IActionResult> Edit(string id, [Bind("username,password")] User user)
            {
                if (id != user.username)
                {
                    return NotFound();
                }

                if (ModelState.IsValid)
                {
                    try
                    {
                        _context.Update(user);
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!UserExists(user.username))
                        {
                            return NotFound();
                        }
                        else
                        {
                            throw;
                        }
                    }
                    return RedirectToAction(nameof(Index));
                }
                return View(user);
            }

            //// GET: api/Auth/Delete/5
            //public async Task<IActionResult> Delete(string id)
            //{
            //    if (id == null)
            //    {
            //        return NotFound();
            //    }

            //    var user = await _context.User
            //        .FirstOrDefaultAsync(m => m.username == id);
            //    if (user == null)
            //    {
            //        return NotFound();
            //    }

            //    return View(user);
            //}

            // POST: api/Auth/Delete/5
            [HttpPost, ActionName("Delete")]
            [ValidateAntiForgeryToken]
            public async Task<IActionResult> DeleteConfirmed(string id)
            {
                var user = await _context.User.FindAsync(id);
                _context.User.Remove(user);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            private bool UserExists(string id)
            {
                return _context.User.Any(e => e.username == id);
            }
        }
    }
