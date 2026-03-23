using CrAutos.Api.Data;
using CrAutos.Api.Services;
using Microsoft.EntityFrameworkCore;

namespace CrAutos.Api.Endpoints;

public static class PhotoEndpoints
{
    public static void MapPhotoEndpoints(this WebApplication app)
    {
        // Serve photo files from disk
        app.MapGet("/api/photos/{**filePath}", async (
            string filePath,
            IConfiguration config) =>
        {
            var basePath = config["PhotoStorage:Path"]
                ?? Path.Combine(Directory.GetCurrentDirectory(), "photos");

            var fullPath = Path.Combine(basePath, filePath);

            if (!File.Exists(fullPath))
                return Results.NotFound();

            var contentType = fullPath.EndsWith(".png") ? "image/png" : "image/jpeg";
            var stream = File.OpenRead(fullPath);
            return Results.Stream(stream, contentType);
        });

        // POST /api/cars/{id}/photos — upload extra photos
        app.MapPost("/api/cars/{id}/photos", async (
            int id,
            HttpRequest request,
            AppDbContext db,
            IPhotoStorageService photoService) =>
        {
            var car = await db.Cars
                .Include(c => c.Photos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (car is null) return Results.NotFound();

            var form = await request.ReadFormAsync();
            var photos = form.Files.GetFiles("photos");

            if (!photos.Any())
                return Results.BadRequest("No photos provided.");

            int order = car.Photos.Any() ? car.Photos.Max(p => p.SortOrder) + 1 : 0;

            foreach (var photo in photos)
            {
                var relativePath = await photoService.SaveAsync(car.Id, photo);
                db.CarPhotos.Add(new Models.CarPhoto
                {
                    CarId = car.Id,
                    FileName = relativePath,
                    SortOrder = order++,
                    UploadedAt = DateTime.UtcNow
                });
            }

            await db.SaveChangesAsync();
            return Results.Ok();
        });

        // DELETE /api/cars/{id}/photos/{photoId}
        app.MapDelete("/api/cars/{id}/photos/{photoId}", async (
            int id,
            int photoId,
            AppDbContext db,
            IPhotoStorageService photoService) =>
        {
            var car = await db.Cars
                .Include(c => c.Photos)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (car is null) return Results.NotFound();

            if (car.Photos.Count <= 3)
                return Results.BadRequest("Cannot delete photo — minimum 3 photos required.");

            var photo = car.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo is null) return Results.NotFound();

            photoService.Delete(photo.FileName);
            db.CarPhotos.Remove(photo);
            await db.SaveChangesAsync();

            return Results.NoContent();
        });
    }
}