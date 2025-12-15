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
/// Enum representing known process step types.
/// These values are used as translation keys in the frontend.
/// When adding new processes, add the step identifiers here.
/// Format: {PROCESS_NAME}_V{VERSION}_STEP_{SEQUENCE}
/// </summary>
public enum ProcessStepType
{
    /// <summary>
    /// BRS-002 Request End of Supply - Step 1: Request end of supply (RSM-005)
    /// </summary>
    BRS_002_REQUESTENDOFSUPPLY_V1_STEP_1,

    /// <summary>
    /// BRS-002 Request End of Supply - Step 2: Confirm end of supply (RSM-005)
    /// </summary>
    BRS_002_REQUESTENDOFSUPPLY_V1_STEP_2,

    /// <summary>
    /// BRS-002 Request End of Supply - Step 3: Reject end of supply (RSM-005)
    /// </summary>
    BRS_002_REQUESTENDOFSUPPLY_V1_STEP_3,

    /// <summary>
    /// BRS-002 Request End of Supply - Step 4: Notify cancellation of end of supply (RSM-020)
    /// </summary>
    BRS_002_REQUESTENDOFSUPPLY_V1_STEP_4,

    /// <summary>
    /// Unknown or unmapped step type.
    /// Used when ProcessManager returns a step we haven't added to this enum yet.
    /// </summary>
    UNKNOWN,
}
