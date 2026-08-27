using MediatR;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Auth;

public sealed record LoginCommand(string Username, string Password) : IRequest<LoginResponse>;
