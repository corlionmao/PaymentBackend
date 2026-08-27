Act as a Principal Software Engineer specializing in .NET Core, Domain-Driven Design (DDD), Test-Driven Development (TDD), and Clean Architecture. 

Generate a complete, fully functional, self-contained .NET Web API solution for a Payment CRUD engine. The code must be production-ready, highly idiomatic, compile without errors, and follow a strict Test-Driven Development (TDD) pattern with decoupling across clean architectural layers.

### Architectural Setup & Project Structure
Generate a solution named `PaymentSystem.sln` containing the following project layout, utilizing file-scoped namespaces throughout:
1. Core/PaymentSystem.Domain (Class library, 0 dependencies)
2. Core/PaymentSystem.Application (Class library, depends ONLY on Domain, uses MediatR)
3. Infrastructure/PaymentSystem.Infrastructure (Class library, depends on Application, manages EF Core with SQLite)
4. Presentation/PaymentSystem.WebAPI (ASP.NET Core Web API, depends on Application & Infrastructure)
5. Tests/PaymentSystem.Domain.UnitTests (xUnit project targeting Domain)
6. Tests/PaymentSystem.Application.UnitTests (xUnit project targeting Application, uses NSubstitute)
7. Tests/PaymentSystem.API.IntegrationTests (xUnit project targeting presentation endpoints using WebApplicationFactory)

### Advanced Domain CRUD Strategies & Invariants (Core.Domain)
Implement a rich domain model instead of an anemic structure that enforces financial ledger integrity:
- 'Money' Value Object: An immutable C# positional record containing 'decimal Amount' and 'string Currency'. Throw an ArgumentException if the amount is <= 0 or if the currency is not in a whitelist of ("USD", "EUR", "GBP").
- 'PaymentStatus' Enum: Contains 'Pending', 'Completed', 'Failed'.
- 'Payment' Aggregate Root/Entity: 
  * Encapsulate properties with private setters to guarantee strict Immutability: Id (Guid), CorrelationId (Guid), Money (Money), AccountId (Guid), Status (PaymentStatus), CreatedAt (DateTime), UpdatedAt (DateTime?), FailureReason (string?).
  * Keep the parameterless constructor private. Expose a static factory method 'Payment.Initialize(Guid correlationId, Money money, Guid accountId)' that validates fields and sets Status to Pending.
  * CRUD [Update] Strategy (State Transitions): Do not allow modification of a payment's amount or currency after creation. Instead, implement state transition methods: 'Complete()' and 'Fail(string reason)'. Enforce business rules so that transitions can only occur from a 'Pending' status; throw an InvalidOperationException otherwise.
  * CRUD [Delete] Strategy (Audited Cancellation / Soft Delete): Hard-deleting transaction history is a compliance violation. Implement deletion as a soft-delete cancellation by calling the 'Fail("Transaction cancelled by administrative operator.")' routine to permanently flip the status and record the cancellation reason.

### Application Logic & CQRS (Core.Application)
Implement use-cases via MediatR handlers:
- 'CreatePaymentCommand': A record taking CorrelationId, Amount, Currency, and AccountId.
- 'CreatePaymentCommandHandler': Enforces strict idempotency. It must call 'IPaymentRepository.GetByCorrelationIdAsync' first. If the payment already exists, it short-circuits and returns the existing payment's data immediately without executing repository saves. Otherwise, it initializes a new Payment domain model and calls 'IPaymentRepository.AddAsync'.
- 'GetPaymentByIdQuery' & 'GetPaymentByIdQueryHandler': Retrieves domain entries via 'IPaymentRepository.GetByIdAsync' and projects them directly to a clean data-transfer record 'PaymentDetailsDto'.
- 'CompletePaymentCommand' & 'CompletePaymentCommandHandler': Implements the CRUD [Update] requirement. Fetches the payment, invokes the domain '.Complete()' state transition, and saves changes. Returns false if not found.
- 'CancelPaymentCommand' & 'CancelPaymentCommandHandler': Implements the CRUD [Delete] requirement. Fetches the payment, invokes the domain soft-delete logic via '.Fail()', and saves changes to maintain an audit trail. Returns false if not found.
- 'LoginCommand' & 'LoginCommandHandler': Takes Username and Password. If credentials match pre-defined seed credentials ("admin" / "Password123!"), generate and return a secure JWT Token signed with a 32-character key.
- Define structural interfaces: 'IPaymentRepository' containing methods for GetByCorrelationIdAsync, GetByIdAsync, AddAsync, and SaveChangesAsync.

### Data Access, Auditing & Demo Seeding (Infrastructure)
- Configure EF Core ('ApplicationDbContext') targeting a local SQLite database ("Data Source=payments.db").
- Use Entity Configuration mapping to model the 'Money' Value Object cleanly via '.OwnsOne()' inline with the columns 'Amount' and 'Currency'. Enforce a unique database index constraint on 'CorrelationId' to guarantee database-level idempotency safety. Convert the Status enum to a string representation in the table.
- Implement an EF Core 'AuditSaveChangesInterceptor' derived from 'SaveChangesInterceptor'. It must intercept 'SavingChangesAsync' to automatically populate 'CreatedAt' for newly tracked entries and 'UpdatedAt' for existing altered models.
- Provide automated data-seeding logic during startup: if the SQLite database is empty, seed a default administrative user in a 'Users' table and seed at least 3 historical payment records across different states ('Pending', 'Completed', 'Failed') so the demo system displays immediate visual data.
- Implement 'PaymentRepository' fulfilling the Application contract.

### API Entry, JWT Security & OpenAPI/Swagger Presentation (WebAPI)
- Configure JWT Bearer Authentication and mandatory Authorization checks globally or via `[Authorize]` attributes across all payment CRUD routes. Expose an anonymous endpoint POST '/api/auth/login' that handles the 'LoginCommand' and distributes tokens.
- Configure native OpenAPI Documentation via 'Microsoft.AspNetCore.OpenApi'. Add a document transformer to support JWT Security Requirements so that endpoints show lock icons in the Swagger/OpenAPI interface and accept an input string formatting header schema: 'Bearer {token}'.
- Build an API Controller ('PaymentsController') decorated with `[Authorize]` exposing:
  * POST '/api/payments': Accepts 'CreatePaymentCommand', returns a proper '201 CreatedAtAction' linking to the query payload.
  * GET '/api/payments/{id}': Accepts a Guid, returns '200 OK' or a '404 NotFound'.
  * PUT '/api/payments/{id}/complete': Triggers 'CompletePaymentCommand', returning '204 NoContent' on success or '404 NotFound'. Handles CRUD [Update].
  * DELETE '/api/payments/{id}': Triggers 'CancelPaymentCommand', returning '204 NoContent' on success or '404 NotFound'. Handles CRUD [Delete] as an audited cancellation.
- Implement a global exception boundary by implementing the modern native 'IExceptionHandler' interface. Intercept all request stream failures globally and translate 'ArgumentException' to a '400 Bad Request', 'InvalidOperationException' to a '409 Conflict', and other exceptions to a '500 Internal Server Error'. Format the output payload strictly to standard RFC 7807 Problem Details JSON format. Register this via '.AddExceptionHandler<GlobalExceptionHandler>()' and '.UseExceptionHandler()' in 'Program.cs'.
- Ensure 'Program.cs' automatically triggers database migrations or 'context.Database.EnsureCreated()' and fires the infrastructure seeding operations during boot sequences so the API is fully portable and immediately runable for local presentations. Expose a public partial class Program at the end.

### Automated Test Infrastructure (Tests)
Generate comprehensive xUnit tests enforcing the architecture:
1. Domain Unit Tests: Test successful factory initialization, failure validations for negative amounts, invalid currencies, and verification of state-machine failures (e.g., throwing when trying to complete or fail a payment that is already Completed).
2. Application Unit Tests: Use NSubstitute to mock the repository. Write tests confirming that handling a command with a duplicate 'CorrelationId' runs idempotently (returns the existing payment and never calls repository AddAsync).
3. Integration Tests: Use 'Microsoft.AspNetCore.Mvc.Testing' and 'WebApplicationFactory<Program>' to spin up an in-memory client. Test that an unauthenticated call to the payment controller returns 401 Unauthorized. Test that authenticating against '/api/auth/login' with valid seed credentials returns a valid token payload.

Provide all files, folders, and project files fully populated with clean, well-factored code. Do not use placeholders or summaries.
