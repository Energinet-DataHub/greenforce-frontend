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

using System.Collections;
using System.Collections.Generic;
using Energinet.DataHub.MarketParticipant.Application.Commands.Organization;

namespace Energinet.DataHub.MarketParticipant.Tests.Validation
{
    public class CreateOrganizationTestData
        : IEnumerable<object[]>
    {
        public IEnumerator<object[]> GetEnumerator()
        {
            yield return new object[]
            {
                string.Empty, string.Empty, new AddressDto(string.Empty, string.Empty, string.Empty, string.Empty, string.Empty), false
            };
        }

        IEnumerator IEnumerable.GetEnumerator() => GetEnumerator();
    }
}
