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

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Client;

/// <summary>
/// Determines whether an incorrect move-in can be initiated for a given
/// (metering point, energy supplier) pair, memoizing the underlying
/// Electricity Market lookup for the lifetime of the request so that
/// multiple CustomerMoveIn processes on the same metering point do not
/// each trigger a separate HTTP call.
/// </summary>
public interface IIncorrectMoveInEligibilityService
{
    /// <summary>
    /// Returns true if at least one move-in registered in Electricity Market exists
    /// for the given metering point and energy supplier within the 60-day lookback
    /// window. The result is memoized per (metering point, energy supplier) for the
    /// lifetime of the request.
    /// </summary>
    Task<bool> IsEligibleAsync(
        string meteringPointId,
        string energySupplierId,
        CancellationToken cancellationToken);
}
