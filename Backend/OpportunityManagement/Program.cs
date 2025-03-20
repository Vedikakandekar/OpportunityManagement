using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpportunityManagement.Data;
using OpportunityManagement.Data.Repository;
using OpportunityManagement.Data.Repository.Contracts;
using OpportunityManagement.Data.Services;
using OpportunityManagement.Data.Services.Contracts;
using OpportunityManagement.Models;
using OpportunityManagement.Utility;
using System.Resources;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(option =>
option.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityApiEndpoints<AppUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddScoped<IAuthService,AuthService>();

builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

builder.Services.AddScoped<ICustomerService, CustomerService>();


builder.Services.AddScoped<IOpportunityRepository, OpportunityRepository>();

builder.Services.AddScoped<IOpportunityService, OpportunityService>();

builder.Services.AddScoped<IContactsRepository, ContactsRepository>();

builder.Services.AddScoped<IContactService, ContactService>();

builder.Services.AddScoped<IStageRepository, StageRepository>();


builder.Services.AddScoped<IStageService, StageService>();

builder.Services.AddScoped<ISubstageRepository, SubstageRepository>();

builder.Services.AddScoped<ISubstageService, SubstageService>();

builder.Services.AddScoped<IStatusRepository, StatusRepository>();

builder.Services.AddScoped<IOpportunityConfidenceRepository, OpportunityConfidenceRepository>();

builder.Services.AddScoped<IOpportunityLocationRepository, OpportunityLocationRepository>();

builder.Services.AddScoped<IOpportunityPriorityRepository, OpportunityPriorityRepository>();

builder.Services.AddScoped<IOpportunityTypeRepository, OpportunityTypeRepository>();

builder.Services.AddScoped<IUserRepository, UserRepository>();

builder.Services.AddScoped<IUserService, UserService>();


builder.Services.AddScoped<IProjectsRepository, ProjectRepository>();

builder.Services.AddScoped<IProjectService, ProjectService>();

builder.Services.AddScoped<IProjectStatusRepository, ProjectStatusRepository>();

builder.Services.AddScoped<IResourceRepository, ResourceRepository>();

builder.Services.AddScoped<ISkillsRepository, SkillsRepository>();

builder.Services.AddScoped<IResourceService, ResourceService>();

builder.Services.AddScoped<ISkillsService, SkillsService>();


builder.Services.AddScoped<IOpportunitySkillsRepository, OpportunitySkillsRepository>();

builder.Services.AddScoped<IReportsService, ReportsService>();



builder.Services.Configure<IdentityOptions>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.User.RequireUniqueEmail = true;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

builder.Services.AddAuthentication(x =>
{
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(y =>
{
    y.SaveToken = false;
    y.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["AppSettings:JWTSecret"]!)),
        ValidateIssuer = false,
        ValidateAudience = false,
    };
});

builder.Services.AddAuthorization(options =>
{
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
    .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
    .RequireAuthenticatedUser()
    .Build();
});

builder.Services.Configure<AppSettings>(builder.Configuration.GetSection("AppSettings"));

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseStaticFiles();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();

