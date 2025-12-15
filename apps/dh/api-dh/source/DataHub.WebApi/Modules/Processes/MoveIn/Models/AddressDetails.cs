namespace Energinet.DataHub.WebApi.Modules.Processes.MoveIn.Models;

public record AddressDetails(
    string CountryCode,
    string StreetName,
    string BuildingNumber,
    string Floor,
    string Room,
    string PostCode,
    string CityName,
    string CitySubdivisionName,
    string StreetCode,
    string MunicipalityCode,
    string PostalDistrict,
    string PostBox,
    string DarReference,
    bool AddressProtection);
