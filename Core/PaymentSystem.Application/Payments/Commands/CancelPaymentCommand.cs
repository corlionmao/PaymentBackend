using MediatR;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Commands;

public sealed record CancelPaymentCommand(Guid Id, string? Reason) : IRequest<PaymentDetailsDto>;
