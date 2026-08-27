using Microsoft.EntityFrameworkCore;
using PaymentSystem.Domain;

namespace PaymentSystem.Infrastructure.Persistence;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, CancellationToken cancellationToken = default)
    {
        // Ensure schema compatibility for lightweight deployments where the DB file already exists.
        // Create Users table if it does not exist so we can seed users into older DBs.
        try
        {
            await context.Database.ExecuteSqlRawAsync(
                @"CREATE TABLE IF NOT EXISTS Users (
                    Id TEXT PRIMARY KEY,
                    Username TEXT NOT NULL UNIQUE,
                    PasswordHash TEXT NOT NULL
                );", cancellationToken);
        }
        catch
        {
            // If raw SQL execution fails (e.g., provider doesn't support), ignore and proceed with EF APIs.
        }

        var pending = Payment.Initialize(
            Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            new Money(150.00m, "USD"),
            Guid.Parse("11111111-1111-1111-1111-111111111111"));

        var completed = Payment.Initialize(
            Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"),
            new Money(2400.00m, "EUR"),
            Guid.Parse("22222222-2222-2222-2222-222222222222"));
        completed.Complete();

        var failed = Payment.Initialize(
            Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc"),
            new Money(89.50m, "GBP"),
            Guid.Parse("33333333-3333-3333-3333-333333333333"));
        failed.Fail("Insufficient funds");

        if (!await context.Payments.AnyAsync(cancellationToken))
        {
            await context.Payments.AddRangeAsync(new[] { pending, completed, failed }, cancellationToken);
        }

        // Seed default user if missing
        if (!await context.Users.AnyAsync(cancellationToken))
        {
            var user = PaymentSystem.Domain.User.Create("admin", "Password123!");
            await context.Users.AddAsync(user, cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);
    }
}
