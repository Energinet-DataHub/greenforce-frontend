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

using Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier.Models;
using HotChocolate.Authorization;

namespace Energinet.DataHub.WebApi.Modules.Processes.ChangeOfSupplier;

public static class ChangeOfSupplierOperations
{
    [Mutation]
    [Authorize(Roles = new[] { "change-of-supplier:manage" })]
    public static async Task<bool> RequestChangeOfSupplierAsync(
        RequestChangeOfSupplierInput input,
        IChangeOfSupplierClient client)
    {
        return await client.RequestChangeOfSupplierAsync(input);
    }

    [Mutation]
    [Authorize(Roles = new[] { "change-of-supplier:manage" })]
    public static async Task<bool> InitiateChangeOfSupplierAsync(
        InitiateChangeOfSupplierInput input,
        IChangeOfSupplierClient client)
    {
        return await client.InitiateChangeOfSupplierAsync(input);
    }

    [Mutation]
    [Authorize(Roles = new[] { "change-of-supplier:manage" })]
    public static async Task<bool> UpdateCustomerMasterDataAsync(
        UpdateCustomerMasterDataInput input,
        IChangeOfSupplierClient client)
    {
        return await client.UpdateCustomerMasterDataAsync(input);
    }
}
