using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Infrastructure.Auth;
using PaymentSystem.Infrastructure.Persistence;
using PaymentSystem.Infrastructure.Persistence.Interceptors;
using PaymentSystem.Infrastructure.Persistence.Repositories;

namespace PaymentSystem.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSingleton<AuditSaveChangesInterceptor>();
        services.AddSingleton<DbCommandObservabilityInterceptor>();
        services.AddDbContext<ApplicationDbContext>((provider, options) =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? "Data Source=payments.db";
            options.UseSqlite(connectionString);
            // Enable sensitive data logging so EF Core diagnostics (and OpenTelemetry EF instrumentation)
            // include parameter values in captured SQL statements. Remove or guard this in production.
            options.EnableSensitiveDataLogging();
            options.AddInterceptors(
                provider.GetRequiredService<AuditSaveChangesInterceptor>(),
                provider.GetRequiredService<DbCommandObservabilityInterceptor>());
        });
        services.AddScoped<IPaymentRepository, PaymentRepository>();
        services.AddScoped<IUserRepository, PaymentSystem.Infrastructure.Persistence.Repositories.UserRepository>();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        return services;
    }
}
