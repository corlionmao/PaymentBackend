using MediatR;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Commands;

public sealed record CreatePaymentCommand(
    Guid CorrelationId,
    decimal Amount,
    string Currency,
    Guid AccountId) : IRequest<PaymentDetailsDto>;
