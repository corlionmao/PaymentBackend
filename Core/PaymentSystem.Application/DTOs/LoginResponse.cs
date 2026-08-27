namespace PaymentSystem.Application.DTOs;

public sealed record LoginResponse(bool Succeeded, string? Token);
