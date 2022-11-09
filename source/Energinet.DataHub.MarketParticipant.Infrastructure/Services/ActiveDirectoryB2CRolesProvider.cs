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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Infrastructure.Model.ActiveDirectory;
using Microsoft.Graph;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Services
{
    public class ActiveDirectoryB2CRolesProvider : IActiveDirectoryB2CRolesProvider
    {
        private readonly GraphServiceClient _graphClient;
        private readonly string _appObjectId;
        private readonly ActiveDirectoryB2CRoles _activeDirectoryB2CRoles;

        public ActiveDirectoryB2CRolesProvider(
            GraphServiceClient graphClient,
            string appObjectId)
        {
            _graphClient = graphClient;
            _appObjectId = appObjectId;
            _activeDirectoryB2CRoles = new ActiveDirectoryB2CRoles();
        }

        public async Task<ActiveDirectoryB2CRoles> GetB2CRolesAsync()
        {
            if (_activeDirectoryB2CRoles.IsLoaded)
            {
                return _activeDirectoryB2CRoles;
            }

            var application = await _graphClient.Applications[_appObjectId]
                .Request()
                .Select(a => new { a.DisplayName, a.AppRoles })
                .GetAsync()
                .ConfigureAwait(false);

            if (application is null)
            {
                throw new InvalidOperationException(
                    $"No application, '{nameof(application)}', was found in Active Directory.");
            }

            foreach (var appRole in application.AppRoles)
            {
                switch (appRole.Value)
                {
                    case "balanceresponsibleparty":
                        _activeDirectoryB2CRoles.DdkId = appRole.Id!.Value;
                        break;
                    case "gridoperator":
                        _activeDirectoryB2CRoles.DdmId = appRole.Id!.Value;
                        break;
                    case "electricalsupplier":
                        _activeDirectoryB2CRoles.DdqId = appRole.Id!.Value;
                        break;
                    case "imbalancesettlementresponsible":
                        _activeDirectoryB2CRoles.DdxId = appRole.Id!.Value;
                        break;
                    case "meteringpointadministrator":
                        _activeDirectoryB2CRoles.DdzId = appRole.Id!.Value;
                        break;
                    case "metereddataadministrator":
                        _activeDirectoryB2CRoles.DglId = appRole.Id!.Value;
                        break;
                    case "systemoperator":
                        _activeDirectoryB2CRoles.EzId = appRole.Id!.Value;
                        break;
                    case "meterdataresponsible":
                        _activeDirectoryB2CRoles.MdrId = appRole.Id!.Value;
                        break;
                    case "danishenergyagency":
                        _activeDirectoryB2CRoles.StsId = appRole.Id!.Value;
                        break;
                    case "transmissionsystemoperator":
                        _activeDirectoryB2CRoles.TsoId = appRole.Id!.Value;
                        break;
                    default:
                        throw new InvalidOperationException(
                            $"Could not find an id associated with the provided role name '{appRole.DisplayName}'.");
                }
            }

            return _activeDirectoryB2CRoles;
        }
    }
}
