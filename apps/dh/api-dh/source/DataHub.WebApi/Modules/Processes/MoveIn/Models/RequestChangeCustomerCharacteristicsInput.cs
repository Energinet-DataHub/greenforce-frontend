namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Models;

public record RequestChangeCustomerCharacteristicsInput(
    string MeteringPointId,
    string FirstCustomerName,
    string FirstCustomerCpr,
    string? SecondCustomerName,
    string? SecondCustomerCpr,
    bool NameProtection,
    ContactDetails LegalContact,
    AddressDetails LegalAddress,
    ContactDetails TechnicalContact,
    AddressDetails TechnicalAddress);


