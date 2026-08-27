# PaymentSystem

PaymentSystem is a payments ledger example implemented in .NET 9. It demonstrates Domain-Driven Design (DDD), Clean Architecture, and Test-Driven Development (TDD) practices for a small financial ledger API.

Key ideas
- Payments are immutable financial records for amount and currency; only their status may change via domain state transitions (Pending -> Completed | Failed | Cancelled).
- Deletions are implemented as cancellations (soft delete) so audit trails remain intact.
- The solution is split into Domain, Application, Infrastructure, and Presentation layers.

Repository layout
- Core/PaymentSystem.Domain — domain entities (Payment, Money, User) and PaymentStatus enum.
- Core/PaymentSystem.Application — application services, MediatR handlers, DTOs and repository abstractions.
- Infrastructure/PaymentSystem.Infrastructure — EF Core DbContext, repositories, interceptors, migrations and seeders.
- Presentation/PaymentSystem.WebAPI — ASP.NET Core Web API, controllers, middleware, and OpenAPI configuration.
- Tests/ — unit and integration tests.

Getting started (local)
1. Prerequisites
   - .NET 9 SDK
   - (Optional) dotnet-ef tool for migrations: dotnet tool install --global dotnet-ef

2. Restore and build
   dotnet restore
   dotnet build

3. Apply database migrations (recommended)
   dotnet ef database update -p Infrastructure/PaymentSystem.Infrastructure/PaymentSystem.Infrastructure.csproj -s Presentation/PaymentSystem.WebAPI/PaymentSystem.WebAPI.csproj

   This creates/updates the SQLite database (default: payments.db) and creates the Users table.

4. Run the API
   dotnet run --project Presentation/PaymentSystem.WebAPI/PaymentSystem.WebAPI.csproj

   Swagger UI: /swagger

5. Run tests
   dotnet test PaymentSystem.sln

Database & seed data
- Default SQLite database file: payments.db (created in the WebAPI working directory).
- DatabaseSeeder seeds sample payments and a default admin user if missing.
- Default seeded admin credentials (development only):
  - username: admin
  - password: Password123!

Security notes
- Passwords are currently hashed with SHA-256 in this sample. Replace with a secure adaptive hash (Argon2/BCrypt) before using in production.
- Sensitive logging (EnableSensitiveDataLogging) is enabled for development observability and should be disabled in production.

Observability
- The solution emits Activities using a shared ActivitySource (PaymentSystem.Application.Observability.Telemetry) and includes:
  - RequestObservabilityMiddleware in the Presentation layer to create per-request activities and tag HTTP metadata.
  - DbCommandObservabilityInterceptor in the Infrastructure layer to log SQL statements and durations.
- These Activities are compatible with OpenTelemetry collectors that listen to ActivitySource events.

Migrations
- EF Core migrations are in Infrastructure/PaymentSystem.Infrastructure/Persistence/Migrations.
- Use dotnet-ef to add or apply migrations targeting the Infrastructure project and using the WebAPI project as the startup project.

Contributing
- Fork, create a branch, add tests for behavior changes, and open a pull request. Keep changes small and focused.

License
- See LICENSE file in the repository (if present).

Questions or next steps
- I can help replace SHA-256 with Argon2/BCrypt, wire OTLP exporters for OpenTelemetry, or add CI steps to run migrations and tests. Tell me which you'd like.

