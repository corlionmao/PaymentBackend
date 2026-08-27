using Microsoft.EntityFrameworkCore;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Domain;

namespace PaymentSystem.Infrastructure.Persistence.Repositories;

public sealed class PaymentRepository(ApplicationDbContext context) : IPaymentRepository
{
    public Task<Payment?> GetByCorrelationIdAsync(Guid correlationId, CancellationToken cancellationToken = default) =>
        context.Payments.FirstOrDefaultAsync(payment => payment.CorrelationId == correlationId, cancellationToken);

    public Task<Payment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        context.Payments.FirstOrDefaultAsync(payment => payment.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Payment>> ListAsync(CancellationToken cancellationToken = default) =>
        await context.Payments
            .AsNoTracking()
            .OrderByDescending(payment => payment.CreatedAt)
            .ToListAsync(cancellationToken);

    public async Task AddAsync(Payment payment, CancellationToken cancellationToken = default)
    {
        await context.Payments.AddAsync(payment, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        context.SaveChangesAsync(cancellationToken);
}
