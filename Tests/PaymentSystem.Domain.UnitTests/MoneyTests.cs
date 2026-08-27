using PaymentSystem.Domain;

namespace PaymentSystem.Domain.UnitTests;

public sealed class MoneyTests
{
    [Theory]
    [InlineData(0.01, "USD")]
    [InlineData(100, "EUR")]
    [InlineData(2500.5, "GBP")]
    public void Constructor_WithValidAmountAndCurrency_Succeeds(decimal amount, string currency)
    {
        var money = new Money(amount, currency);

        Assert.Equal(amount, money.Amount);
        Assert.Equal(currency, money.Currency);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-0.01)]
    public void Constructor_WithNonPositiveAmount_ThrowsArgumentException(decimal amount)
    {
        var exception = Assert.Throws<ArgumentException>(() => new Money(amount, "USD"));
        Assert.Equal("Amount", exception.ParamName);
    }

    [Theory]
    [InlineData("JPY")]
    [InlineData("usd")]
    [InlineData("")]
    [InlineData("BTC")]
    public void Constructor_WithInvalidCurrency_ThrowsArgumentException(string currency)
    {
        var exception = Assert.Throws<ArgumentException>(() => new Money(10m, currency));
        Assert.Equal("Currency", exception.ParamName);
    }
}
