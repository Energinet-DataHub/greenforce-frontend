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

using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    /// <summary>
    /// A factory service ensuring correct construction of a GridArea.
    /// </summary>
    public interface IGridAreaFactoryService
    {
        /// <summary>
        /// Creates an Organization.
        /// </summary>
        /// <param name="code">The code for the Grid Area</param>
        /// <param name="name">The name of the new Grid Area.</param>
        /// <param name="priceAreaCode">The PriceAreaCode <see cref="PriceAreaCode"/> of the new Grid Area.</param>
        /// <returns>The created actor.</returns>
        Task<GridArea> CreateAsync(
            GridAreaCode code,
            GridAreaName name,
            PriceAreaCode priceAreaCode);
    }
}
