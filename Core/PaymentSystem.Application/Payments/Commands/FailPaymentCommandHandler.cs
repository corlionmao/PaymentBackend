using MediatR;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Commands;

public sealed class FailPaymentCommandHandler(IPaymentRepository repository)
    : IRequestHandler<FailPaymentCommand, PaymentDetailsDto>
{
    public async Task<PaymentDetailsDto> Handle(
        FailPaymentCommand request,
        CancellationToken cancellationToken)
    {
        var payment = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Payment '{request.Id}' was not found.");

        payment.Fail(request.Reason);
        await repository.SaveChangesAsync(cancellationToken);
        return PaymentDetailsDto.From(payment);
    }
}
