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

namespace Energinet.DataHub.WebApi.Clients.ElectricityMarket.Import;

/// <summary>
/// Provides an interface for importing capacity settlement data.
/// </summary>
public interface IElectricityMarketImportClient
{
    /// <summary>
    /// Asynchronously imports transactions to Electricity Market.
    /// </summary>
    /// <param name="content">The stream containing capacity settlement data to be imported.</param>
    /// <param name="cancellationToken">A token used to cancel the import operation.</param>
    /// <returns>The number of transactions imported.</returns>
    Task<long> ImportTransactionsAsync(Stream content, CancellationToken cancellationToken);
}
