using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public static class SeedData
{
    public static async Task SeedUser(UserManager<AppUser> userManager)
    {
     if(await userManager.Users.AnyAsync()) return;
     
      var json = await File.ReadAllTextAsync("data/UserSeedData.json");
      var members =  JsonSerializer.Deserialize<List<SeedUserDTO>>(json);
      
      var hmac = new HMACSHA512();
      foreach (var member in members!)
      {
        var user = new AppUser
        {
          Id = member.Id,
          DisplayName = member.DisplayName,
          Email = member.Email,
          UserName = member.Email,
          ImageUrl = member.ImageUrl,


          Member = new Member
          {
             Id = member.Id,
             DisplayName = member.DisplayName,
             ImageUrl = member.ImageUrl,
             City = member.City,
             Country = member.Country,
             DateCreated = member.DateCreated,
             LastActive = member.LastActive,
             DateOfBirth = member.DateOfBirth,
             Description = member.Description,
             Gender = member.Gender
          }
        };

        user.Member.Photos.Add(new Photo
        {
           Url = member.ImageUrl!,
           MemberId = member.Id
            
        });

        var identityResult =  await userManager.CreateAsync(user, "Pa$$w0rd");

         if (!identityResult.Succeeded)
         {
            Console.WriteLine(identityResult.Errors.First().Description);
         }
         await userManager.AddToRoleAsync(user , "Member");
      }

      var admin = new AppUser
      {
         UserName = "admin@test.com",
         Email = "admin@test.com",
         DisplayName = "Admin"
      };

      await userManager.CreateAsync(admin , "Pa$$w0rd");
      await userManager.AddToRolesAsync(admin , ["Admin", "Moderator"]);
   
    }    
}
