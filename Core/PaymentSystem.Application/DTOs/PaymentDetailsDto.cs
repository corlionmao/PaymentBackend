using PaymentSystem.Domain;

namespace PaymentSystem.Application.DTOs;

public sealed record PaymentDetailsDto(
    Guid Id,
    Guid CorrelationId,
    decimal Amount,
    string Currency,
    Guid AccountId,
    string Status,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    string? FailureReason)
{
    public static PaymentDetailsDto From(Payment payment) =>
        new(
            payment.Id,
            payment.CorrelationId,
            payment.Money.Amount,
            payment.Money.Currency,
            payment.AccountId,
            payment.Status.ToString(),
            payment.CreatedAt,
            payment.UpdatedAt,
            payment.FailureReason);
}
