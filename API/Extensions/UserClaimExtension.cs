using System;
using System.Security.Claims;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace API.Extensions;

public static class ClimsPrincipalExtension
{
    public static string GetMemberId(this ClaimsPrincipal user)
    {
        return user.FindFirstValue(ClaimTypes.NameIdentifier) ?? throw new Exception("Error getting member id from token");
    }
}
