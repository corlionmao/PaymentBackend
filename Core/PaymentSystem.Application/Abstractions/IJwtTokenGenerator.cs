namespace PaymentSystem.Application.Abstractions;

public interface IJwtTokenGenerator
{
    string Generate(string username);
}
