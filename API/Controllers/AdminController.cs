

using System.Security.Cryptography.X509Certificates;
using API.Entities;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{

    public class AdminController(UserManager<AppUser> userManager) : BaseAPIController
    {
        [Authorize(Policy ="RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUserWithRoles()
        {
            var users = await userManager.Users.ToListAsync();
            var userRole = new List<object>(); 

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                userRole.Add(new
                {
                    user.Id,
                    user.Email,
                    roles = roles
                });

            }

            return Ok(userRole);
        }

        [Authorize(Policy ="RequireAdminRole")]
        [HttpPost("edit-role/{userId}")]
        public async Task<ActionResult> EditRole(string userId , [FromQuery] string roles)
        {
            if(string.IsNullOrWhiteSpace(roles)) return BadRequest("select a role");

            var selectedRoles = roles.Split(",").ToArray();

            var user = await userManager.FindByIdAsync(userId);

            if(user== null) return NotFound("User not found"); 

            var userRoles = await userManager.GetRolesAsync(user);

            var result = await userManager.AddToRolesAsync(user , selectedRoles.Except(userRoles));

            if(!result.Succeeded) return BadRequest(result.Errors);

            result = await userManager.RemoveFromRolesAsync(user , userRoles.Except(selectedRoles));

            return Ok(await userManager.GetRolesAsync(user));
            


        }

        [Authorize(Policy ="ModeratePhotoRole")]
        [HttpGet("photo-to-moderate")]
        public ActionResult GetPhotoForModeration()
        {
            return Ok("Admin or moderator can see this");
        }
    }
}
