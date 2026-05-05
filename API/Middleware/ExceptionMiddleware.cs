using System;
using System.Dynamic;
using System.Net;
using System.Text.Json;
using API.Error;
using Microsoft.Extensions.Hosting.Internal;

namespace API.Middleware;

public class ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }catch(Exception ex)
        {
            logger.LogError(ex , "{message}", ex.Message);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = env.IsDevelopment()
            ? new ApiException(context.Response.StatusCode , ex.Message , ex.StackTrace)
            : new ApiException(context.Response.StatusCode , ex.Message , "Unknown exception occured. Kindly reach out to the admin");

            var jsonOption = new JsonSerializerOptions
            {
              PropertyNamingPolicy = JsonNamingPolicy.CamelCase  
            };

            var json = JsonSerializer.Serialize(response,jsonOption);
            await context.Response.WriteAsJsonAsync(json);
        }
    }
  
}
