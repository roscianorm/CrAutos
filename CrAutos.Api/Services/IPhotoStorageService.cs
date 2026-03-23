namespace CrAutos.Api.Services;

public interface IPhotoStorageService
{
    Task<string> SaveAsync(int carId, IFormFile file);
    void Delete(string relativePath);
    string GetPublicUrl(HttpRequest request, string relativePath);
}