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

namespace Energinet.DataHub.MarketParticipant.Domain.Model
{
    /// <summary>
    /// Important: Don't change assigned values e.g. Mdr = 8 may never change.
    /// </summary>
#pragma warning disable CA1027
    public enum BusinessRoleCode
#pragma warning restore CA1027
    {
        Ddk = 1,
        Ddm = 2,
        Ddq = 3,
        Ddx = 4,
        Ddz = 5,
        Dgl = 7,
        Mdr = 8,
        Sts = 9,
        Ez = 10,
        Tso = 11,
    }
}
