namespace CrAutos.Api.Models
{
    public class CarPhoto
    {
        public int Id { get; set; }
        public int CarId { get; set; }
        public Car Car { get; set; } = null!;

        public string FileName { get; set; } = "";
        public int SortOrder { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
