using MediatR;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Queries;

public sealed class GetPaymentByIdQueryHandler(IPaymentRepository repository)
    : IRequestHandler<GetPaymentByIdQuery, PaymentDetailsDto?>
{
    public async Task<PaymentDetailsDto?> Handle(
        GetPaymentByIdQuery request,
        CancellationToken cancellationToken)
    {
        var payment = await repository.GetByIdAsync(request.Id, cancellationToken);
        return payment is null ? null : PaymentDetailsDto.From(payment);
    }
}
