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
using Microsoft.AspNetCore.Http;
using System.Diagnostics;

namespace ACRS
{

    [Route("api/[controller]")]
    [EnableCors("CORSPolicy")]
    public class AuthController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(IConfiguration configuration,
            UserManager<IdentityUser> userManager)
        {
            _configuration = configuration;
            _userManager = userManager;
        }

        [HttpPost, Route("login")]
        public async Task<ActionResult<AuthLogin>> Login([FromBody] AuthLogin model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(model.UserName);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var roles = await _userManager.GetRolesAsync(user);

                var claims = new[]
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Iat, DateTime.Now.ToString())
                };

                ClaimsIdentity claimsIdentity = new ClaimsIdentity(claims, "Token");
                claimsIdentity.AddClaims(roles.Select(role => new Claim(ClaimTypes.Role, role)));

                var signinKey = new SymmetricSecurityKey(
                  Encoding.UTF8.GetBytes(_configuration["Jwt:SigningKey"]));

                int expiryInMinutes = Convert.ToInt32(_configuration["Jwt:ExpiryInMinutes"]);

                var token = new JwtSecurityToken(
                    issuer: _configuration["Jwt:Site"],
                    audience: _configuration["Jwt:Site"],
                    claims: claimsIdentity.Claims,
                    expires: DateTime.UtcNow.AddMinutes(expiryInMinutes),
                    signingCredentials: new SigningCredentials(signinKey, SecurityAlgorithms.HmacSha256)
                );

                return Ok(
                  new
                  {
                      token = new JwtSecurityTokenHandler().WriteToken(token),
                      expiration = token.ValidTo,
                      role = await _userManager.GetRolesAsync(user)
                  });
            }

            return Unauthorized();
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpPost, Route("register")]
        public async Task<ActionResult<AuthRegister>> Register([FromBody] AuthRegister user)
        {
            if (user == null)
            {
                return BadRequest();
            }

            var passwordValidator = new PasswordValidator<IdentityUser>();
            if (!(await passwordValidator.ValidateAsync(_userManager, null, user.Password)).Succeeded)
            {
                return BadRequest("Password is too weak");
            }

            if (await _userManager.FindByNameAsync(user.UserName) != null)
            {
                return BadRequest($"User with username: {user.UserName} already exists");
            }

            IdentityUser newUser = new IdentityUser
            {
                UserName = user.UserName
            };

            var result = await _userManager.CreateAsync(newUser);

            if (result.Succeeded)
            {
                await _userManager.AddPasswordAsync(newUser, user.Password);

                // Admin is the only role!
                await _userManager.AddToRoleAsync(newUser, "Admin");
            }
            else
            {
                return BadRequest(result.Errors);
            }

            return CreatedAtAction("GetUsers", new { userName = newUser.UserName });
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpGet, Route("users")]
        public async Task<ActionResult<IEnumerable<string>>> GetUsers()
        {
            return await _userManager.Users.Select(u => u.UserName).ToListAsync();
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpDelete("users/{username}")]
        public async Task<ActionResult<object>> DeleteUser(string username)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);

            if (!result.Succeeded)
            {
                return NotFound();
            }

            return new { userName = username };
        }

        [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
        [HttpPut("users/{username}")]
        public async Task<IActionResult> UpdateUser(string username, [FromBody] AuthChangePassword request)
        {
            if (request == null || request.UserName != username)
            {
                return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return NoContent();
        }
    }
}
