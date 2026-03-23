namespace CrAutos.Api.DTOs
{
    public class CarDto
    {
        public int Id { get; set; }
        public string Maker { get; set; } = "";
        public int Year { get; set; }
        public string Model { get; set; } = "";
        public string Province { get; set; } = "";
        public string Canton { get; set; } = "";
        public string District { get; set; } = "";
        public DateTime PublishedAt { get; set; }
        public List<string> PhotoUrls { get; set; } = [];
        public string WhatsAppUrl { get; set; } = "";
    }
}
