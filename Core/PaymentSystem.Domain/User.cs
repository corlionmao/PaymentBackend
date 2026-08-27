using System.Security.Cryptography;
using System.Text;

namespace PaymentSystem.Domain;

public sealed class User
{
    public Guid Id { get; private set; }
    public string Username { get; private set; } = null!;
    public string PasswordHash { get; private set; } = null!;

    private User()
    {
    }

    private User(string username, string passwordHash)
    {
        Id = Guid.NewGuid();
        Username = username;
        PasswordHash = passwordHash;
    }

    public static User Create(string username, string password)
    {
        if (string.IsNullOrWhiteSpace(username))
            throw new ArgumentException("Username is required.", nameof(username));

        if (string.IsNullOrEmpty(password))
            throw new ArgumentException("Password is required.", nameof(password));

        var hash = ComputeHash(password);
        return new User(username.Trim(), hash);
    }

    public bool VerifyPassword(string password)
    {
        if (password is null) return false;
        var hash = ComputeHash(password);
        return string.Equals(hash, PasswordHash, StringComparison.Ordinal);
    }

    private static string ComputeHash(string input)
    {
        using var sha = SHA256.Create();
        var bytes = Encoding.UTF8.GetBytes(input);
        var hashed = sha.ComputeHash(bytes);
        var sb = new StringBuilder(hashed.Length * 2);
        foreach (var b in hashed)
            sb.Append(b.ToString("x2"));
        return sb.ToString();
    }
}
