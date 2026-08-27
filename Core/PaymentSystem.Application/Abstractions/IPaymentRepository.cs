using PaymentSystem.Domain;

namespace PaymentSystem.Application.Abstractions;

public interface IPaymentRepository
{
    Task<Payment?> GetByCorrelationIdAsync(Guid correlationId, CancellationToken cancellationToken = default);
    Task<Payment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Payment>> ListAsync(CancellationToken cancellationToken = default);
    Task AddAsync(Payment payment, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
