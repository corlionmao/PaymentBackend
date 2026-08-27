using NSubstitute;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.Payments.Commands;
using PaymentSystem.Domain;

namespace PaymentSystem.Application.UnitTests;

public sealed class CancelPaymentCommandHandlerTests
{
    [Fact]
    public async Task Handle_WhenPaymentExists_CancelsAndSaves()
    {
        var payment = Payment.Initialize(Guid.NewGuid(), new Money(10m, "USD"), Guid.NewGuid());

        var repository = Substitute.For<IPaymentRepository>();
        repository.GetByIdAsync(payment.Id, Arg.Any<CancellationToken>()).Returns(payment);

        var handler = new CancelPaymentCommandHandler(repository);
        var command = new CancelPaymentCommand(payment.Id, "Customer request");

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.Equal(payment.Id, result.Id);
        Assert.Equal(nameof(PaymentStatus.Cancelled), result.Status);
        await repository.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenPaymentNotFound_ThrowsKeyNotFoundException()
    {
        var repository = Substitute.For<IPaymentRepository>();
        repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Payment?)null);

        var handler = new CancelPaymentCommandHandler(repository);
        var command = new CancelPaymentCommand(Guid.NewGuid(), null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => handler.Handle(command, CancellationToken.None));
    }
}
