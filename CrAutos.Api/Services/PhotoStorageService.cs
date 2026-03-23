namespace CrAutos.Api.Services;

public class PhotoStorageService : IPhotoStorageService
{
    private readonly string _basePath;

    public PhotoStorageService(IConfiguration configuration)
    {
        _basePath = configuration["PhotoStorage:Path"]
            ?? Path.Combine(Directory.GetCurrentDirectory(), "photos");

        Directory.CreateDirectory(_basePath);
    }

    public async Task<string> SaveAsync(int carId, IFormFile file)
    {
        // Validate file type
        var allowedTypes = new[] { "image/jpeg", "image/png" };
        if (!allowedTypes.Contains(file.ContentType))
            throw new InvalidOperationException("Only JPEG and PNG images are allowed.");

        // Create car-specific folder
        var carFolder = Path.Combine(_basePath, "cars", carId.ToString());
        Directory.CreateDirectory(carFolder);

        // Generate unique filename
        var extension = Path.GetExtension(file.FileName);
        var fileName = $"{Guid.NewGuid()}{extension}";
        var fullPath = Path.Combine(carFolder, fileName);

        // Save to disk
        using var stream = File.Create(fullPath);
        await file.CopyToAsync(stream);

        // Return relative path for storing in DB
        return Path.Combine("cars", carId.ToString(), fileName)
            .Replace("\\", "/");
    }

    public void Delete(string relativePath)
    {
        var fullPath = Path.Combine(_basePath, relativePath);
        if (File.Exists(fullPath))
            File.Delete(fullPath);
    }

    public string GetPublicUrl(HttpRequest request, string relativePath)
    {
        return $"{request.Scheme}://{request.Host}/api/photos/{relativePath}";
    }
}