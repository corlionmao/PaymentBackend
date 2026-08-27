using NSubstitute;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.Payments.Queries;
using PaymentSystem.Domain;

namespace PaymentSystem.Application.UnitTests;

public sealed class GetPaymentByIdQueryHandlerTests
{
    [Fact]
    public async Task Handle_WhenPaymentExists_ProjectsToDto()
    {
        var payment = Payment.Initialize(Guid.NewGuid(), new Money(10m, "USD"), Guid.NewGuid());
        var repository = Substitute.For<IPaymentRepository>();
        repository.GetByIdAsync(payment.Id, Arg.Any<CancellationToken>()).Returns(payment);

        var handler = new GetPaymentByIdQueryHandler(repository);
        var result = await handler.Handle(new GetPaymentByIdQuery(payment.Id), CancellationToken.None);

        Assert.NotNull(result);
        Assert.Equal(payment.Id, result.Id);
        Assert.Equal("Pending", result.Status);
        Assert.Equal(10m, result.Amount);
    }

    [Fact]
    public async Task Handle_WhenMissing_ReturnsNull()
    {
        var repository = Substitute.For<IPaymentRepository>();
        repository.GetByIdAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Returns((Payment?)null);

        var handler = new GetPaymentByIdQueryHandler(repository);
        var result = await handler.Handle(new GetPaymentByIdQuery(Guid.NewGuid()), CancellationToken.None);

        Assert.Null(result);
    }
}
