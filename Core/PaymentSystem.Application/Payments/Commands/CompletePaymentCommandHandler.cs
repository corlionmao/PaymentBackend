using MediatR;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Payments.Commands;

public sealed class CompletePaymentCommandHandler(IPaymentRepository repository)
    : IRequestHandler<CompletePaymentCommand, PaymentDetailsDto>
{
    public async Task<PaymentDetailsDto> Handle(
        CompletePaymentCommand request,
        CancellationToken cancellationToken)
    {
        var payment = await repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Payment '{request.Id}' was not found.");

        payment.Complete();
        await repository.SaveChangesAsync(cancellationToken);
        return PaymentDetailsDto.From(payment);
    }
}
