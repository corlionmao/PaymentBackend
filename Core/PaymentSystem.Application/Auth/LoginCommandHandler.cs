using MediatR;
using PaymentSystem.Application.Abstractions;
using PaymentSystem.Application.DTOs;

namespace PaymentSystem.Application.Auth;

public sealed class LoginCommandHandler(IUserRepository userRepository, IJwtTokenGenerator tokenGenerator)
    : IRequestHandler<LoginCommand, LoginResponse>
{
    public async Task<LoginResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetByUsernameAsync(request.Username, cancellationToken);
        if (user is null || !user.VerifyPassword(request.Password))
        {
            return new LoginResponse(false, null);
        }

        var token = tokenGenerator.Generate(request.Username);
        return new LoginResponse(true, token);
    }
}
