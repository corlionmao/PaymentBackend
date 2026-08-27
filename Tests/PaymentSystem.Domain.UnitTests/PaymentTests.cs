using PaymentSystem.Domain;

namespace PaymentSystem.Domain.UnitTests;

public sealed class PaymentTests
{
    [Fact]
    public void Initialize_WithValidArguments_CreatesPendingPayment()
    {
        var correlationId = Guid.NewGuid();
        var accountId = Guid.NewGuid();
        var money = new Money(42.50m, "USD");

        var payment = Payment.Initialize(correlationId, money, accountId);

        Assert.NotEqual(Guid.Empty, payment.Id);
        Assert.Equal(correlationId, payment.CorrelationId);
        Assert.Equal(accountId, payment.AccountId);
        Assert.Equal(money, payment.Money);
        Assert.Equal(PaymentStatus.Pending, payment.Status);
        Assert.Null(payment.FailureReason);
        Assert.Null(payment.UpdatedAt);
        Assert.True(payment.CreatedAt <= DateTime.UtcNow);
    }

    [Fact]
    public void Initialize_WithEmptyCorrelationId_ThrowsArgumentException()
    {
        var exception = Assert.Throws<ArgumentException>(
            () => Payment.Initialize(Guid.Empty, new Money(10m, "USD"), Guid.NewGuid()));
        Assert.Equal("correlationId", exception.ParamName);
    }

    [Fact]
    public void Initialize_WithEmptyAccountId_ThrowsArgumentException()
    {
        var exception = Assert.Throws<ArgumentException>(
            () => Payment.Initialize(Guid.NewGuid(), new Money(10m, "USD"), Guid.Empty));
        Assert.Equal("accountId", exception.ParamName);
    }

    [Fact]
    public void Complete_FromPending_TransitionsToCompleted()
    {
        var payment = CreatePending();

        payment.Complete();

        Assert.Equal(PaymentStatus.Completed, payment.Status);
        Assert.NotNull(payment.UpdatedAt);
        Assert.Null(payment.FailureReason);
    }

    [Fact]
    public void Fail_FromPending_TransitionsToFailed()
    {
        var payment = CreatePending();

        payment.Fail("Card declined");

        Assert.Equal(PaymentStatus.Failed, payment.Status);
        Assert.Equal("Card declined", payment.FailureReason);
        Assert.NotNull(payment.UpdatedAt);
    }

    [Fact]
    public void Complete_WhenAlreadyCompleted_ThrowsInvalidOperationException()
    {
        var payment = CreatePending();
        payment.Complete();

        var exception = Assert.Throws<InvalidOperationException>(() => payment.Complete());
        Assert.Contains("Completed", exception.Message, StringComparison.Ordinal);
    }

    [Fact]
    public void Fail_WhenAlreadyCompleted_ThrowsInvalidOperationException()
    {
        var payment = CreatePending();
        payment.Complete();

        Assert.Throws<InvalidOperationException>(() => payment.Fail("too late"));
    }

    [Fact]
    public void Fail_WithBlankReason_ThrowsArgumentException()
    {
        var payment = CreatePending();
        var exception = Assert.Throws<ArgumentException>(() => payment.Fail("  "));
        Assert.Equal("reason", exception.ParamName);
    }

    private static Payment CreatePending() =>
        Payment.Initialize(Guid.NewGuid(), new Money(10m, "EUR"), Guid.NewGuid());
}
