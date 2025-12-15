namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Models;

public record ContactDetails(
    string Name,
    string Title,
    string PhoneNumber,
    string MobilePhoneNumber,
    string EmailAddress);
