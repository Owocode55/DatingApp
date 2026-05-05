using System;
using API.DTOs;
using API.Entities;
using API.Interface;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace API.Extensions;

public static class AppUserExtensions
{
   public async static Task<UserDTO> ToDto(this AppUser user, ITokenService tokenService)
    {
     return new UserDTO
         {
             Id = user.Id,
             Email = user.Email!,
             DisplayName = user.DisplayName,
             ImageURL = user.ImageUrl,
             Token = await tokenService.CreateToken(user)
         };
    }
}
