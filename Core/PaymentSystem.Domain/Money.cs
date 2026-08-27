namespace PaymentSystem.Domain;

public sealed record Money
{
    private static readonly HashSet<string> AllowedCurrencies = new(StringComparer.Ordinal)
    {
        "USD", "EUR", "GBP"
    };

    public decimal Amount { get; init; }
    public string Currency { get; init; }

    public Money(decimal Amount, string Currency)
    {
        if (Amount <= 0m)
        {
            throw new ArgumentException("Amount must be greater than zero.", nameof(Amount));
        }

        if (string.IsNullOrWhiteSpace(Currency) || !AllowedCurrencies.Contains(Currency))
        {
            throw new ArgumentException("Currency must be one of: USD, EUR, GBP.", nameof(Currency));
        }

        this.Amount = Amount;
        this.Currency = Currency;
    }

    public void Deconstruct(out decimal Amount, out string Currency)
    {
        Amount = this.Amount;
        Currency = this.Currency;
    }
}
