using System.Data.Common;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using PaymentSystem.Application.Observability;

namespace PaymentSystem.Infrastructure.Persistence.Interceptors;

public sealed class DbCommandObservabilityInterceptor : DbCommandInterceptor
{
    private readonly ILogger<DbCommandObservabilityInterceptor> _logger;

    public DbCommandObservabilityInterceptor(ILogger<DbCommandObservabilityInterceptor> logger)
    {
        _logger = logger;
    }

    public override DbDataReader ReaderExecuted(DbCommand command, CommandExecutedEventData eventData, DbDataReader result)
    {
        Emit(command, eventData.Duration);
        return base.ReaderExecuted(command, eventData, result);
    }

    public override int NonQueryExecuted(DbCommand command, CommandExecutedEventData eventData, int result)
    {
        Emit(command, eventData.Duration);
        return base.NonQueryExecuted(command, eventData, result);
    }

    public override object? ScalarExecuted(DbCommand command, CommandExecutedEventData eventData, object? result)
    {
        Emit(command, eventData.Duration);
        return base.ScalarExecuted(command, eventData, result);
    }

    private void Emit(DbCommand command, TimeSpan duration)
    {
        try
        {
            using var activity = Telemetry.ActivitySource.StartActivity("db.query", ActivityKind.Client);
            activity?.SetTag("db.system", command.Connection?.GetType().Name ?? "sqlite");
            activity?.SetTag("db.statement", command.CommandText);
            activity?.SetTag("db.duration_ms", duration.TotalMilliseconds);

            _logger.LogInformation("Executed DB command in {Elapsed}ms: {CommandText}", duration.TotalMilliseconds, command.CommandText);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to emit db command telemetry");
        }
    }
}
