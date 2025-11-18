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

namespace Energinet.DataHub.WebApi.Modules.MessageArchive.Models;

/// <summary>
/// Enum representing different process step types.
/// These values are used as translation keys in the frontend.
/// </summary>
public enum ProcessStepType
{
    /// <summary>
    /// RSM-005: Request end of supply
    /// </summary>
    Rsm005Request,

    /// <summary>
    /// RSM-005: Confirm end of supply
    /// </summary>
    Rsm005Confirm,

    /// <summary>
    /// RSM-005: Reject end of supply
    /// </summary>
    Rsm005Reject,

    /// <summary>
    /// RSM-020: Notify cancellation of end of supply
    /// </summary>
    Rsm020Request,

    /// <summary>
    /// Unknown or unmapped step type
    /// </summary>
    Unknown,
}
