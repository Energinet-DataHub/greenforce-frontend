// Copyright 2020 Energinet DataHub A/S
//
// Licensed under the Apache License, Version 2.0 (the "License2");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;

namespace Energinet.DataHub.WebApi.Tests.Modules.ElectricityMarket.Mappers;

public static class MeteringPointConstants
{
    public const string CompanyName = "Test Company A/S";
    public const string CompanyCvr = "12345678";
    public const string SecondaryCompanyName = "Secondary Contact Ltd";
    public const string SecondaryCompanyCvr = "87654321";
    public const string EnergySupplierGln = "5790001234567";

    public const string GridAreaCode = "543";
    public const string MeterNumber = "12345678";
    public const string FromGridAreaCode = "111";
    public const string ToGridAreaCode = "222";
    public const string QuarterHourlyResolution = "PT15M";
    public const int SettlementDateMonth = 3;
    public const int SettlementDateDay = 15;
    public const int SettlementGroupNumber = 6;
    public const decimal AssetCapacity = 100;
    public const decimal PowerLimitKw = 50.5m;
    public const int PowerLimitAmperes = 25;

    public const string InstallationStreetCode = "1234";
    public const string InstallationStreetName = "Main Street";
    public const string InstallationBuildingNumber = "42";
    public const string InstallationCityName = "Copenhagen";
    public const string InstallationAdditionalCityName = "Nørrebro";
    public const string InstallationFloor = "2";
    public const string InstallationRoom = "th";
    public const string InstallationPostalCode = "2100";
    public const string InstallationMunicipalityCode = "101";
    public const string InstallationCountryCode = "DK";
    public const string InstallationRemarks = "Near the park";

    public const string LegalContactName = "John Doe";
    public const string LegalContactEmail = "john.doe@example.com";
    public const string LegalContactPhone = "+4512345678";
    public const string LegalContactMobile = "+4587654321";
    public const string LegalContactAttention = "Finance Dept";
    public const string LegalContactStreetCode = "5678";
    public const string LegalContactStreetName = "Oak Avenue";
    public const string LegalContactBuildingNumber = "123";
    public const string LegalContactPostalCode = "1000";
    public const string LegalContactCityName = "Aarhus";
    public const string LegalContactAdditionalCityName = "Aarhus C";
    public const string LegalContactCountryCode = "DK";
    public const string LegalContactFloor = "3";
    public const string LegalContactRoom = "201";
    public const string LegalContactPoBox = "PO Box 100";
    public const string LegalContactMunicipalityCode = "751";

    public const string TechnicalContactName = "Jane Smith";
    public const string TechnicalContactEmail = "jane.smith@example.com";
    public const string TechnicalContactPhone = "+4523456789";
    public const string TechnicalContactMobile = "+4598765432";
    public const string TechnicalContactAttention = "Technical Dept";
    public const string TechnicalContactStreetCode = "9012";
    public const string TechnicalContactStreetName = "Pine Street";
    public const string TechnicalContactBuildingNumber = "456";
    public const string TechnicalContactPostalCode = "2000";
    public const string TechnicalContactCityName = "Odense";
    public const string TechnicalContactAdditionalCityName = "Odense M";
    public const string TechnicalContactCountryCode = "DK";
    public const string TechnicalContactFloor = "1";
    public const string TechnicalContactRoom = "101";
    public const string TechnicalContactMunicipalityCode = "461";

    public static readonly DateTimeOffset _validFrom = DateTimeOffset.Parse("2024-01-01T00:00:00Z");
    public static readonly DateTimeOffset _validTo = DateTimeOffset.Parse("2024-12-31T23:59:59Z");
    public static readonly DateTimeOffset _energySupplierValidFrom = DateTimeOffset.Parse("2024-06-01T00:00:00Z");
    public static readonly DateTimeOffset _energySupplierValidTo = DateTimeOffset.Parse("2024-12-31T23:59:59Z");
    public static readonly DateTimeOffset _heatingValidFrom = DateTimeOffset.Parse("2024-11-01T00:00:00Z");
    public static readonly DateTimeOffset _heatingValidTo = DateTimeOffset.Parse("2025-03-31T23:59:59Z");

    public static readonly Guid _parentId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid _installationDarReference = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid _powerPlantGsrn = Guid.Parse("33333333-3333-3333-3333-333333333333");
    public static readonly Guid _orchestrationInstanceId = Guid.Parse("44444444-4444-4444-4444-444444444444");
    public static readonly Guid _legalDarReference = Guid.Parse("55555555-5555-5555-5555-555555555555");
    public static readonly Guid _technicalDarReference = Guid.Parse("66666666-6666-6666-6666-666666666666");
}
