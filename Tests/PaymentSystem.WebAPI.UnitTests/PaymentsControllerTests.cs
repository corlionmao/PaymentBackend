using MediatR;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using PaymentSystem.Application.DTOs;
using PaymentSystem.Application.Payments.Commands;
using PaymentSystem.WebAPI.Controllers;
using PaymentSystem.Domain;

namespace PaymentSystem.WebAPI.UnitTests;

public sealed class PaymentsControllerTests
{
    [Fact]
    public async Task Update_WhenStatusIsCancelled_ReturnsOkWithCancelledPayment()
    {
        var id = Guid.NewGuid();
        var mediator = Substitute.For<IMediator>();

        var dto = new PaymentDetailsDto(id, Guid.NewGuid(), 10m, "USD", Guid.NewGuid(), nameof(PaymentStatus.Cancelled), DateTime.UtcNow, DateTime.UtcNow, "Customer requested");
        mediator.Send(Arg.Any<IRequest<PaymentDetailsDto>>(), Arg.Any<CancellationToken>()).Returns(dto);

        var controller = new PaymentsController(mediator);

        var request = new PaymentsController.UpdatePaymentRequest(nameof(PaymentStatus.Cancelled), "Customer requested");

        var result = await controller.Update(id, request, CancellationToken.None);

        var ok = Assert.IsType<OkObjectResult>(result);
        var returned = Assert.IsType<PaymentDetailsDto>(ok.Value!);
        Assert.Equal(nameof(PaymentStatus.Cancelled), returned.Status);
    }

    [Fact]
    public async Task Update_WhenStatusIsInvalid_ReturnsBadRequest()
    {
        var mediator = Substitute.For<IMediator>();
        var controller = new PaymentsController(mediator);

        var request = new PaymentsController.UpdatePaymentRequest("NotAStatus", null);

        var result = await controller.Update(Guid.NewGuid(), request, CancellationToken.None);

        Assert.IsType<BadRequestObjectResult>(result);
    }
}
