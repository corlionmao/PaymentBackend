using MediatR;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Commands;

public sealed class CancelPaymentCommandHandler(IPaymentRepository repository)
    : IRequestHandler<CancelPaymentCommand, PaymentDetailsDto>
{
    public async Task<PaymentDetailsDto> Handle(
        CancelPaymentCommand request,
        CancellationToken cancellationToken)
    {
        var payment = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Payment '{request.Id}' was not found.");

        payment.Cancel(request.Reason);
        await repository.SaveChangesAsync(cancellationToken);
        return PaymentDetailsDto.From(payment);
    }
}
