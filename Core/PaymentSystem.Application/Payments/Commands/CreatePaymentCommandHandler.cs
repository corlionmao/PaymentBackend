using MediatR;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.DTOs;
using PaymentSystem.Domain;

namespace PaymentSystem.Application.Payments.Commands;

public sealed class CreatePaymentCommandHandler(IPaymentRepository repository)
    : IRequestHandler<CreatePaymentCommand, PaymentDetailsDto>
{
    public async Task<PaymentDetailsDto> Handle(
        CreatePaymentCommand request,
        CancellationToken cancellationToken)
    {
        var existing = await repository.GetByCorrelationIdAsync(request.CorrelationId, cancellationToken);
        if (existing is not null)
        {
            return PaymentDetailsDto.From(existing);
        }

        var money = new Money(request.Amount, request.Currency);
        var payment = Payment.Initialize(request.CorrelationId, money, request.AccountId);
        await repository.AddAsync(payment, cancellationToken);
        return PaymentDetailsDto.From(payment);
    }
}
