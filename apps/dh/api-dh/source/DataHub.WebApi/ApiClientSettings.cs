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

namespace Energinet.DataHub.WebApi
{
    public class ApiClientSettings
    {
        public string MeteringPointBaseUrl { get; set; } = "https://localhost:5001";

        public string MarketParticipantBaseUrl { get; set; } = "https://localhost:5001";

        public string WholesaleBaseUrl { get; set; } = "https://localhost:7133";

        public string ESettExchangeBaseUrl { get; set; } = "https://localhost:5001";

        public string EdiB2CWebApiBaseUrl { get; set; } = "https://localhost:5091";

        public string ImbalancePricesBaseUrl { get; set; } = "https://localhost:5091";
    }
}
