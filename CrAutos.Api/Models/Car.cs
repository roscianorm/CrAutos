namespace CrAutos.Api.Models
{
    public class Car
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        public string Maker { get; set; } = "";
        public int Year { get; set; }
        public string Model { get; set; } = "";

        public string Province { get; set; } = "";
        public string Canton { get; set; } = "";
        public string District { get; set; } = "";

        public bool IsActive { get; set; } = true;
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;

        public ICollection<CarPhoto> Photos { get; set; } = [];
    }
}
