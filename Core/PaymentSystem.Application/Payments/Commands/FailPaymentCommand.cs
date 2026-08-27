using MediatR;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Commands;

public sealed record FailPaymentCommand(Guid Id, string Reason) : IRequest<PaymentDetailsDto>;
