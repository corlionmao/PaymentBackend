using System.Diagnostics;

namespace PaymentSystem.Application.Observability;

public static class Telemetry
{
    /// <summary>
    /// Shared ActivitySource name for the PaymentSystem. OpenTelemetry collectors and agents
    /// can pick up activities emitted via this source.
    /// </summary>
    public static readonly ActivitySource ActivitySource = new ActivitySource("PaymentSystem");
}
