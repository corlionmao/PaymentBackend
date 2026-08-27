using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PaymentSystem.Application.DTOs;
using PaymentSystem.Application.Payments.Commands;
using PaymentSystem.Application.Payments.Queries;

namespace PaymentSystem.WebAPI.Controllers;

[ApiController]
[Authorize]
[Route("api/payments")]
public sealed class PaymentsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType(typeof(PaymentDetailsDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromBody] CreatePaymentCommand command,
        CancellationToken cancellationToken)
    {
        var payment = await mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = payment.Id }, payment);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(PaymentDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken cancellationToken)
    {
        var payment = await mediator.Send(new GetPaymentByIdQuery(id), cancellationToken);
        return payment is null ? NotFound() : Ok(payment);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<PaymentDetailsDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(CancellationToken cancellationToken)
    {
        var payments = await mediator.Send(new GetPaymentsQuery(), cancellationToken);
        return Ok(payments);
    }

    [HttpPost("{id:guid}/complete")]
    [ProducesResponseType(typeof(PaymentDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Complete(Guid id, CancellationToken cancellationToken)
    {
        var payment = await mediator.Send(new CompletePaymentCommand(id), cancellationToken);
        return Ok(payment);
    }

    [HttpPost("{id:guid}/fail")]
    [ProducesResponseType(typeof(PaymentDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Fail(
        Guid id,
        [FromBody] FailPaymentRequest request,
        CancellationToken cancellationToken)
    {
        var payment = await mediator.Send(new FailPaymentCommand(id, request.Reason), cancellationToken);
        return Ok(payment);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(PaymentDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Update(
        Guid id,
        [FromBody] UpdatePaymentRequest request,
        CancellationToken cancellationToken)
    {
        if (!Enum.TryParse<PaymentSystem.Domain.PaymentStatus>(request.Status, true, out var status))
        {
            return BadRequest($"Invalid status '{request.Status}'.");
        }

        PaymentDetailsDto payment = status switch
        {
            PaymentSystem.Domain.PaymentStatus.Completed =>
                await mediator.Send(new CompletePaymentCommand(id), cancellationToken),
            PaymentSystem.Domain.PaymentStatus.Failed =>
                await mediator.Send(new FailPaymentCommand(id, request.Reason ?? string.Empty), cancellationToken),
            PaymentSystem.Domain.PaymentStatus.Cancelled =>
                await mediator.Send(new CancelPaymentCommand(id, request.Reason), cancellationToken),
            _ => throw new ArgumentException($"Cannot transition to status '{status}'.")
        };

        return Ok(payment);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(PaymentDetailsDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken cancellationToken)
    {
        var payment = await mediator.Send(new CancelPaymentCommand(id, null), cancellationToken);
        return Ok(payment);
    }

    public sealed record UpdatePaymentRequest(string Status, string? Reason);

    public sealed record FailPaymentRequest(string Reason);
}
