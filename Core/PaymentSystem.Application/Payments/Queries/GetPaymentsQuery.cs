using MediatR;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Queries;

public sealed record GetPaymentsQuery : IRequest<IReadOnlyList<PaymentDetailsDto>>;
