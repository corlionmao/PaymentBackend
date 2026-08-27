using System.Diagnostics;
using PaymentSystem.Application.Observability;

namespace PaymentSystem.WebAPI.Middleware;

public sealed class RequestObservabilityMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestObservabilityMiddleware> _logger;

    public RequestObservabilityMiddleware(RequestDelegate next, ILogger<RequestObservabilityMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        using var activity = Telemetry.ActivitySource.StartActivity($"HTTP {context.Request.Method} {context.Request.Path}", ActivityKind.Server);
        try
        {
            activity?.SetTag("http.method", context.Request.Method);
            activity?.SetTag("http.target", context.Request.Path);
            activity?.SetTag("http.host", context.Request.Host.Host);

            await _next(context);

            activity?.SetTag("http.status_code", context.Response.StatusCode);
        }
        catch (Exception ex)
        {
            activity?.SetTag("otel.status_code", "ERROR");
            activity?.SetTag("otel.status_description", ex.Message);
            _logger.LogError(ex, "Unhandled exception processing request {Method} {Path}", context.Request.Method, context.Request.Path);
            throw;
        }
    }
}
