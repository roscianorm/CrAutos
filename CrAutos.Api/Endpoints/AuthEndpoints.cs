using CrAutos.Api.Data;
using CrAutos.Api.DTOs;
using CrAutos.Api.Models;
using CrAutos.Api.Services;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CrAutos.Api.Endpoints;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this WebApplication app)
    {
        // POST /auth/google — validate Google ID token
        app.MapPost("/auth/google", async (
            GoogleAuthDto dto,
            AppDbContext db,
            TokenService tokenService,
            IConfiguration config) =>
        {
            GoogleJsonWebSignature.Payload payload;
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [config["Google:ClientId"]]
                };
                payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);
            }
            catch
            {
                return Results.Unauthorized();
            }

            var user = await db.Users
                .FirstOrDefaultAsync(u => u.GoogleId == payload.Subject);

            if (user is null)
            {
                var newUser = new User
                {
                    GoogleId = payload.Subject,
                    Email = payload.Email,
                    CreatedAt = DateTime.UtcNow
                };
                db.Users.Add(newUser);
                await db.SaveChangesAsync();

                var pendingToken = tokenService.GenerateToken(newUser);
                return Results.Ok(new AuthResponseDto
                {
                    Token = pendingToken,
                    RequiresProfile = true
                });
            }

            var token = tokenService.GenerateToken(user);
            return Results.Ok(new AuthResponseDto
            {
                Token = token,
                RequiresProfile = false,
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email
                }
            });
        });

        // POST /auth/complete-profile
        app.MapPost("/auth/complete-profile", async (
            UserProfileDto dto,
            AppDbContext db,
            TokenService tokenService,
            ClaimsPrincipal principal) =>
        {
            var userId = int.Parse(
                principal.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await db.Users.FindAsync(userId);
            if (user is null) return Results.NotFound();

            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            await db.SaveChangesAsync();

            var token = tokenService.GenerateToken(user);
            return Results.Ok(new AuthResponseDto
            {
                Token = token,
                RequiresProfile = false,
                User = new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email
                }
            });
        }).RequireAuthorization();
    }
}