using CrAutos.Api.Data;
using CrAutos.Api.DTOs;
using CrAutos.Api.Models;
using CrAutos.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CrAutos.Api.Endpoints;

public static class CarEndpoints
{
    public static void MapCarEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/api/cars");

        // GET /api/cars — list with optional filters
        group.MapGet("/", async (
            AppDbContext db,
            HttpRequest request,
            IPhotoStorageService photoService,
            string? maker,
            int? year,
            string? model) =>
        {
            var query = db.Cars
                .Include(c => c.Photos)
                .Include(c => c.User)
                .Where(c => c.IsActive)
                .AsQueryable();

            if (!string.IsNullOrEmpty(maker))
                query = query.Where(c => c.Maker.ToLower() == maker.ToLower());

            if (year.HasValue)
                query = query.Where(c => c.Year == year.Value);

            if (!string.IsNullOrEmpty(model))
                query = query.Where(c => c.Model.ToLower() == model.ToLower());

            var cars = await query.ToListAsync();

            return cars.Select(c => MapToDto(c, request, photoService));
        });

        // GET /api/cars/{id} — single car
        group.MapGet("/{id}", async (
            int id,
            AppDbContext db,
            HttpRequest request,
            IPhotoStorageService photoService) =>
        {
            var car = await db.Cars
                .Include(c => c.Photos)
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == id && c.IsActive);

            if (car is null) return Results.NotFound();

            return Results.Ok(MapToDto(car, request, photoService));
        });

        // POST /api/cars — create listing with photos
        group.MapPost("/", async (
            HttpRequest request,
            AppDbContext db,
            IPhotoStorageService photoService,
    ClaimsPrincipal principal) =>
        {

            // Get userId from JWT token
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim is null) return Results.Unauthorized();
            var userId = int.Parse(userIdClaim);

            // For now use a hardcoded userId — we'll wire up auth later
            //int userId = 1;

            // Parse form data
            var form = await request.ReadFormAsync();

            var maker = form["maker"].ToString();
            var model = form["model"].ToString();
            var province = form["province"].ToString();
            var canton = form["canton"].ToString();
            var district = form["district"].ToString();
            var photos = form.Files.GetFiles("photos");

            if (!int.TryParse(form["year"], out var year))
                return Results.BadRequest("Invalid year.");

            if (string.IsNullOrEmpty(maker) || string.IsNullOrEmpty(model))
                return Results.BadRequest("Maker and model are required.");

            if (photos.Count < 3)
                return Results.BadRequest("A minimum of 3 photos is required.");

            var car = new Car
            {
                UserId = userId,
                Maker = maker,
                Year = year,
                Model = model,
                Province = province,
                Canton = canton,
                District = district,
                PublishedAt = DateTime.UtcNow
            };

            db.Cars.Add(car);
            await db.SaveChangesAsync();

            // Save photos
            int order = 0;
            foreach (var photo in photos)
            {
                var relativePath = await photoService.SaveAsync(car.Id, photo);
                db.CarPhotos.Add(new CarPhoto
                {
                    CarId = car.Id,
                    FileName = relativePath,
                    SortOrder = order++,
                    UploadedAt = DateTime.UtcNow
                });
            }

            await db.SaveChangesAsync();

            return Results.Created($"/api/cars/{car.Id}", car.Id);
        }).RequireAuthorization();

        // DELETE /api/cars/{id} — soft delete
        group.MapDelete("/{id}", async (int id, AppDbContext db) =>
        {
            var car = await db.Cars.FindAsync(id);
            if (car is null) return Results.NotFound();

            car.IsActive = false;
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }

    private static CarDto MapToDto(Car car, HttpRequest request, IPhotoStorageService photoService)
    {
        var phone = car.User?.PhoneNumber ?? "";
        var e164 = new string(phone.Where(char.IsDigit).ToArray());
        var whatsAppUrl = $"https://wa.me/{e164}";

        return new CarDto
        {
            Id = car.Id,
            Maker = car.Maker,
            Year = car.Year,
            Model = car.Model,
            Province = car.Province,
            Canton = car.Canton,
            District = car.District,
            PublishedAt = car.PublishedAt,
            PhotoUrls = car.Photos
                .OrderBy(p => p.SortOrder)
                .Select(p => photoService.GetPublicUrl(request, p.FileName))
                .ToList(),
            WhatsAppUrl = whatsAppUrl
        };
    }
}