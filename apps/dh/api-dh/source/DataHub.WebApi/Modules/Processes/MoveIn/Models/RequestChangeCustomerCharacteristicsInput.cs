using Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Enums;

namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Models;

public record RequestChangeCustomerCharacteristicsInput(
    string MeteringPointId,
    string FirstCustomerName,
    string FirstCustomerCpr,
    string? SecondCustomerName,
    string? SecondCustomerCpr,
    bool AddressProtection,
    string LegalContact,
    string LegalAddress,
    bool LegalAddressProtection,
    string TechnicalContact,
    string TechnicalAddress,
    bool TechnicalAddressProtection
    );


