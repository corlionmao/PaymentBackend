namespace PaymentSystem.Domain;

public sealed class Payment
{
    public Guid Id { get; private set; }
    public Guid CorrelationId { get; private set; }
    public Money Money { get; private set; } = null!;
    public Guid AccountId { get; private set; }
    public PaymentStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime? UpdatedAt { get; private set; }
    public string? FailureReason { get; private set; }

    private Payment()
    {
    }

    private Payment(Guid correlationId, Money money, Guid accountId)
    {
        Id = Guid.NewGuid();
        CorrelationId = correlationId;
        Money = money;
        AccountId = accountId;
        Status = PaymentStatus.Pending;
        CreatedAt = DateTime.UtcNow;
    }

    public static Payment Initialize(Guid correlationId, Money money, Guid accountId)
    {
        if (correlationId == Guid.Empty)
        {
            throw new ArgumentException("CorrelationId is required.", nameof(correlationId));
        }

        if (accountId == Guid.Empty)
        {
            throw new ArgumentException("AccountId is required.", nameof(accountId));
        }

        ArgumentNullException.ThrowIfNull(money);

        return new Payment(correlationId, money, accountId);
    }

    public void Complete()
    {
        EnsurePending(nameof(Complete));
        Status = PaymentStatus.Completed;
        FailureReason = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Fail(string reason)
    {
        EnsurePending(nameof(Fail));

        if (string.IsNullOrWhiteSpace(reason))
        {
            throw new ArgumentException("Failure reason is required.", nameof(reason));
        }

        Status = PaymentStatus.Failed;
        FailureReason = reason.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void Cancel(string? reason = null)
    {
        EnsurePending(nameof(Cancel));
        Status = PaymentStatus.Cancelled;
        FailureReason = string.IsNullOrWhiteSpace(reason) ? null : reason.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    private void EnsurePending(string operation)
    {
        if (Status != PaymentStatus.Pending)
        {
            throw new InvalidOperationException(
                $"Cannot {operation.ToLowerInvariant()} a payment that is {Status}.");
        }
    }
}
