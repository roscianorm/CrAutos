namespace CrAutos.Api.DTOs;

public class GoogleAuthDto
{
    public string IdToken { get; set; } = "";
}

public class AuthResponseDto
{
    public string Token { get; set; } = "";
    public bool RequiresProfile { get; set; }
    public UserDto? User { get; set; }
}

public class UserDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Email { get; set; } = "";
}