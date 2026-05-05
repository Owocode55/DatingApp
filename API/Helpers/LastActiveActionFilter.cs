using System;
using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class LastActiveActionFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var requestContext = await next();
        
        if(context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var userId = requestContext.HttpContext.User.GetMemberId();

        var dbContext = requestContext.HttpContext.RequestServices.GetRequiredService<AppDbContext>();

        await dbContext.Members.Where(x => x.Id == userId).ExecuteUpdateAsync(setters => setters.SetProperty(x => x.LastActive , DateTime.UtcNow));

    }
}
