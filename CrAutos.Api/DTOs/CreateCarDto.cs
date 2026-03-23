namespace CrAutos.Api.DTOs
{
    public class CreateCarDto
    {
        public string Maker { get; set; } = "";
        public int Year { get; set; }
        public string Model { get; set; } = "";
        public string Province { get; set; } = "";
        public string Canton { get; set; } = "";
        public string District { get; set; } = "";
    }
}
