using System.Runtime.ConstrainedExecution;

namespace CrAutos.Api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string GoogleId { get; set; } = "";
        public string Email { get; set; } = "";
        public string FullName { get; set; } = "";
        public string PhoneNumber { get; set; } = "";
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Car> Cars { get; set; } = [];
    }
}
