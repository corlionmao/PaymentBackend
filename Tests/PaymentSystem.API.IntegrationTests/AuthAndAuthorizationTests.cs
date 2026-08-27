using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace PaymentSystem.API.IntegrationTests;

public sealed class AuthAndAuthorizationTests : IClassFixture<PaymentApiFactory>
{
    private readonly HttpClient _client;

    public AuthAndAuthorizationTests(PaymentApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetPayment_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.GetAsync($"/api/payments/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task PostPayment_WithoutToken_ReturnsUnauthorized()
    {
        var response = await _client.PostAsJsonAsync("/api/payments", new
        {
            correlationId = Guid.NewGuid(),
            amount = 10m,
            currency = "USD",
            accountId = Guid.NewGuid()
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithSeedCredentials_ReturnsTokenPayload()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            username = "admin",
            password = "Password123!"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.True(document.RootElement.TryGetProperty("token", out var token));
        var value = token.GetString();
        Assert.False(string.IsNullOrWhiteSpace(value));
        Assert.Contains(".", value, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login", new
        {
            username = "admin",
            password = "wrong"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
