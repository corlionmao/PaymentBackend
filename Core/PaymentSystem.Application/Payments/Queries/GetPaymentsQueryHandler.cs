using MediatR;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Queries;

public sealed class GetPaymentsQueryHandler(IPaymentRepository repository)
    : IRequestHandler<GetPaymentsQuery, IReadOnlyList<PaymentDetailsDto>>
{
    public async Task<IReadOnlyList<PaymentDetailsDto>> Handle(
        GetPaymentsQuery request,
        CancellationToken cancellationToken)
    {
        var payments = await repository.ListAsync(cancellationToken);
        return payments.Select(PaymentDetailsDto.From).ToList();
    }
}
