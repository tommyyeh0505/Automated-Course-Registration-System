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
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ACRS
{

    [Route("api/[controller]")]
    [EnableCors("CORSPolicy")]
    public class AuthController : Controller
    {
        //private readonly ApplicationDbContext _context;
        private IConfiguration _config;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(UserManager<IdentityUser> userManager, ApplicationDbContext context, IConfiguration config)
        {
            _userManager = userManager;
            //_context = context;
            _config = config;
        }



        //https://localhost:5001/api/Auth/login
        [Route("login")]
        [HttpPost]
        public async Task<ActionResult> LoginAsync([FromBody] User model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
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


        // GET: api/Auth
        [HttpGet]
        [Authorize]
        public ActionResult GetUsers()
        {
            //return await _userManager.Users.ToListAsync();
            return Ok(_userManager.Users.ToList());
        }

        // GET: api/Auth/1
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<User>> GetUser(string username)
        {

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound();
            }

            return (Microsoft.AspNetCore.Mvc.ActionResult<ACRS.Models.User>)user;
        }

        //[Authorize]
        ////POST: api/Auth/register
        //[Route("register")]
        //[HttpPost]
        //public async Task<ActionResult> InsertUser([FromBody] User model)
        //{

        //    if (UserExists(model.Username))
        //    {
        //        return BadRequest();
        //    }


        //    var user = new IdentityUser
        //    {
        //        UserName = model.Username,
        //        SecurityStamp = Guid.NewGuid().ToString()
        //    };
        //    var result = await _userManager.CreateAsync(user, model.Password);
        //    if (result.Succeeded)
        //    {
        //        await _userManager.AddToRoleAsync(user, "ADMIN");
        //    }
        //    return Ok(new { Username = user.UserName });
        //}


        //POST: api/Auth/
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [Authorize]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult<User>> PostUser([Bind("username,password")] User user)
        {
            if (user.Username == null)
            {
                return NotFound();
            }

            var result = await _userManager.CreateAsync(user);
            if (result.Succeeded)
            {
                await _userManager.AddPasswordAsync(user, user.Password);
                await _userManager.AddToRoleAsync(user, "Admin");
            }

            return Ok();

        }


        // PUT: api/Auth/1
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [Authorize]
        [HttpPut("{id}")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> PutUser(string id, [Bind("username,password")] User user)
        {
            if (id != user.Username)
            {
                return BadRequest();
            }

            if (ModelState.IsValid)
            {
                IdentityUser temp = await _userManager.FindByIdAsync(user.Id);

                user = new User
                {

                    Username = user.UserName,
                    PasswordHash = user.PasswordHash
                };

                await _userManager.UpdateAsync(user);
            }

            return NoContent();
        }

        // DELETE: api/Auth//5
        [Authorize]
        [HttpDelete("{id}")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult<User>> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            await _userManager.DeleteAsync(user);

            return Ok();
        }


        private Task<IdentityUser> UserExists(string id)
        {
            return _userManager.FindByIdAsync(id);
        }
    }
}
