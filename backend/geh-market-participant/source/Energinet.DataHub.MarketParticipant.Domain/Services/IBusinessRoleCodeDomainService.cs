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

using System.Collections.Generic;
using Energinet.DataHub.MarketParticipant.Domain.Model;

namespace Energinet.DataHub.MarketParticipant.Domain.Services
{
    /// <summary>
    /// Provides services for mapping between market roles and business role codes.
    /// </summary>
    public interface IBusinessRoleCodeDomainService
    {
        /// <summary>
        /// Gets the business role codes derived from the market roles.
        /// </summary>
        /// <param name="marketRoles">The market roles to get business role codes for.</param>
        /// <returns>A list of business role codes derived from the market roles.</returns>
        IEnumerable<BusinessRoleCode> GetBusinessRoleCodes(IEnumerable<EicFunction> marketRoles);
    }
}
