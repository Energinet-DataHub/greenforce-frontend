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

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Model.ActiveDirectory
{
    public class ActiveDirectoryB2CRoles
    {
        public bool IsLoaded { get; set; }
        public Guid DdkId { get; set; }
        public Guid DdmId { get; set; }
        public Guid DdqId { get; set; }
        public Guid DdxId { get; set; }
        public Guid DdzId { get; set; }
        public Guid DglId { get; set; }
        public Guid EzId { get; set; }
        public Guid MdrId { get; set; }
        public Guid StsId { get; set; }
        public Guid TsoId { get; set; }
    }
}
