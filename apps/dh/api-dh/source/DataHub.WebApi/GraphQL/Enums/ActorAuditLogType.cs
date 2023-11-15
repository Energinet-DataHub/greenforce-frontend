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

namespace Energinet.DataHub.WebApi.Controllers.MarketParticipant.Dto
{
    public enum ActorAuditLogType
    {
        Name = 1,
        Created = 2,
        Status = 3,
        ContactName = 4,
        ContactEmail = 5,
        ContactPhone = 6,
        ContactCreated = 7,
        ContactDeleted = 8,
        CertificateCredentials = 9,
        ClientSecretCredentials = 10,
    }
}
