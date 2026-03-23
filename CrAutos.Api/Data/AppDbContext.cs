using CrAutos.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CrAutos.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Car> Cars => Set<Car>();
    public DbSet<CarPhoto> CarPhotos => Set<CarPhoto>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.GoogleId)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Car
        modelBuilder.Entity<Car>()
            .HasOne(c => c.User)
            .WithMany(u => u.Cars)
            .HasForeignKey(c => c.UserId);

        // CarPhoto
        modelBuilder.Entity<CarPhoto>()
            .HasOne(p => p.Car)
            .WithMany(c => c.Photos)
            .HasForeignKey(p => p.CarId);
    }
}
