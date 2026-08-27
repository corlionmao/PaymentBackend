using MediatR;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Commands;

public sealed record CompletePaymentCommand(Guid Id) : IRequest<PaymentDetailsDto>;
