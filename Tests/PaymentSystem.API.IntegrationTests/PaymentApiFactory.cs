using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using PaymentSystem.Infrastructure.Persistence;
using PaymentSystem.Infrastructure.Persistence.Interceptors;

namespace PaymentSystem.API.IntegrationTests;

public sealed class PaymentApiFactory : WebApplicationFactory<Program>
{
    private readonly string _databasePath = Path.Combine(
        Path.GetTempPath(),
        $"payments-it-{Guid.NewGuid():N}.db");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:DefaultConnection", $"Data Source={_databasePath}");
        builder.UseSetting("Jwt:Key", "PaymentSystemJwtSigningKey32chrs");
        builder.UseSetting("Jwt:Issuer", "PaymentSystem");
        builder.UseSetting("Jwt:Audience", "PaymentSystem");
        builder.UseSetting("Jwt:ExpiryMinutes", "120");

        builder.ConfigureServices(services =>
        {
            var dbOptions = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));
            if (dbOptions is not null)
            {
                services.Remove(dbOptions);
            }

            services.AddDbContext<ApplicationDbContext>((provider, options) =>
            {
                options.UseSqlite($"Data Source={_databasePath}");
                options.AddInterceptors(provider.GetRequiredService<AuditSaveChangesInterceptor>());
            });
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        try
        {
            if (File.Exists(_databasePath))
            {
                File.Delete(_databasePath);
            }
        }
        catch (IOException)
        {
            // Best-effort cleanup of the isolated SQLite file.
        }
    }
}
