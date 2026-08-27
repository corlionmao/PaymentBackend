using NSubstitute;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.Payments.Commands;
using PaymentSystem.Domain;

namespace PaymentSystem.Application.UnitTests;

public sealed class CreatePaymentCommandHandlerTests
{
    [Fact]
    public async Task Handle_WhenCorrelationIdExists_ReturnsExistingAndDoesNotAdd()
    {
        var existing = Payment.Initialize(
            Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
            new Money(75m, "USD"),
            Guid.NewGuid());

        var repository = Substitute.For<IPaymentRepository>();
        repository
            .GetByCorrelationIdAsync(existing.CorrelationId, Arg.Any<CancellationToken>())
            .Returns(existing);

        var handler = new CreatePaymentCommandHandler(repository);
        var command = new CreatePaymentCommand(existing.CorrelationId, 999m, "EUR", Guid.NewGuid());

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.Equal(existing.Id, result.Id);
        Assert.Equal(75m, result.Amount);
        Assert.Equal("USD", result.Currency);
        await repository.DidNotReceive().AddAsync(Arg.Any<Payment>(), Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Handle_WhenCorrelationIdIsNew_InitializesAndAddsPayment()
    {
        var correlationId = Guid.NewGuid();
        var accountId = Guid.NewGuid();
        var repository = Substitute.For<IPaymentRepository>();
        repository
            .GetByCorrelationIdAsync(correlationId, Arg.Any<CancellationToken>())
            .Returns((Payment?)null);

        var handler = new CreatePaymentCommandHandler(repository);
        var command = new CreatePaymentCommand(correlationId, 120.50m, "GBP", accountId);

        var result = await handler.Handle(command, CancellationToken.None);

        Assert.Equal(correlationId, result.CorrelationId);
        Assert.Equal(120.50m, result.Amount);
        Assert.Equal("GBP", result.Currency);
        Assert.Equal(accountId, result.AccountId);
        Assert.Equal(nameof(PaymentStatus.Pending), result.Status);
        await repository.Received(1).AddAsync(
            Arg.Is<Payment>(payment =>
                payment.CorrelationId == correlationId &&
                payment.AccountId == accountId &&
                payment.Status == PaymentStatus.Pending),
            Arg.Any<CancellationToken>());
    }
}
