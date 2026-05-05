using API.Data;
using API.Interface;
using API.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using API.Middleware;
using API.Data.Repository;
using API.Helpers;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using API.SignalR;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(opt =>
{
   opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")); 
});
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});
builder.Services.AddSingleton<PressenceTracker>();
builder.Services.AddIdentityCore<AppUser>(opt =>
{
    opt.Password.RequireNonAlphanumeric = false;
    opt.User.RequireUniqueEmail = true;
}).AddRoles<IdentityRole>().
AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddCors();
builder.Services.AddScoped<ITokenService , TokenService>();
builder.Services.AddScoped<IUnitOfWork , UnitOfWork>();
builder.Services.AddScoped<IPhotoService , PhotoService>();
builder.Services.AddScoped<LastActiveActionFilter>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
   var tokenKey = builder.Configuration["TokenKey"] ?? throw new Exception("Error getting token key - program.cs");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey)),
        ValidateAudience = false,
        ValidateIssuer = false
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var token = context.Request.Query["access_token"];  
            var path = context.Request.Path;

            if(!string.IsNullOrWhiteSpace(token) && path.StartsWithSegments("/hubs"))
            {
                context.Token = token;
            }
            return Task.CompletedTask;

        }
        
    };
});

builder.Services.AddAuthorizationBuilder().
AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin")).
AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin" ,"Moderator"));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseMiddleware<ExceptionMiddleware>();
app.UseCors(x => x.AllowAnyHeader().
AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200", "https://localhost:4200"));
app.UseHttpsRedirection();


app.UseAuthentication();
app.UseAuthorization();
app.UseDefaultFiles();
app.UseStaticFiles();


app.MapControllers();
app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/messages");
app.MapFallbackToController("Index" , "Fallback");
var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetService<AppDbContext>()!;
    var userManager = services.GetService<UserManager<AppUser>>()!;
    await context.Database.MigrateAsync();
    await SeedData.SeedUser(userManager);
    await context.Connections.ExecuteDeleteAsync();
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>()!;
    logger.LogError(ex, "Error occured will seeding data");
}


app.Run();
