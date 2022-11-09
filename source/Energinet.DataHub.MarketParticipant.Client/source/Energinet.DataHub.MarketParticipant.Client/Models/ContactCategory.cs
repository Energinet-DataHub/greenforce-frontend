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

namespace Energinet.DataHub.MarketParticipant.Client.Models
{
    public enum ContactCategory
    {
        Default = 0,
        ChargeLinks = 2,
        Charges = 1,
        ElectricalHeating = 3,
        EndOfSupply = 4,
        EnerginetInquiry = 5,
        ErrorReport = 6,
        IncorrectMove = 7,
        IncorrectSwitch = 8,
        MeteringPoint = 10,
        MeasurementData = 9,
        NetSettlement = 11,
        Notification = 12,
        Recon = 13,
        Reminder = 14
    }
}
