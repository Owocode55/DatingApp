using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseAPIController
    {
        [HttpPost("Register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {

            var user = new AppUser
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                UserName = registerDTO.Email,
                Member = new Member
                {
                    DateOfBirth = registerDTO.DateOfBirth,
                    Gender = registerDTO.Gender,
                    City = registerDTO.City,
                    Country = registerDTO.Country,
                    DisplayName = registerDTO.DisplayName
                }
            };

            var result = await userManager.CreateAsync(user, registerDTO.Password);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("error", error.Description);
                }
                return ValidationProblem();
            }
            await userManager.AddToRoleAsync(user, "Member");
            await SetRefreshToken(user);

            return await user.ToDto(tokenService);
        }
        [HttpPost("Login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDto loginDto)
        {
            var user = await userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized("User with username and password not found");

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized("User with username and password not found");

            await SetRefreshToken(user);
            return await user.ToDto(tokenService);
        }


        [HttpPost("refresh-token")]
        public async Task<ActionResult<UserDTO>> GetRefreshToken()
        {
            var refreshToken = Request.Cookies["RefreshToken"];

            if (refreshToken == null) return NoContent();

            var user = await userManager.Users.FirstOrDefaultAsync(x => x.RefreshToken == refreshToken && x.RefreshTokenExpiry > DateTime.UtcNow);

            if (user == null) return Unauthorized();

            await SetRefreshToken(user);

            return await user.ToDto(tokenService);
        }
        private async Task SetRefreshToken(AppUser user)
        {
            user.RefreshToken = user.Id + tokenService.GenerateRefreshToken();
            user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);

            await userManager.UpdateAsync(user);

            var cookieOption = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("RefreshToken", user.RefreshToken, cookieOption);
        }


        [HttpPost("logout")]
        [Authorize]
        public async Task<ActionResult> Logout()
        {
            await userManager.Users.Where(x => x.Id == User.GetMemberId()).
            ExecuteUpdateAsync(setters => 
            setters.SetProperty(x => x.RefreshToken, _ => null)
            .SetProperty(x => x.RefreshTokenExpiry, _ => null));

            Response.Cookies.Delete("RefreshToken");

            return Ok();
        }
    }
}
