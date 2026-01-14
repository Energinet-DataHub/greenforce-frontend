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
    /// BRS-004 Create metering point - Step 1 - Request creation of metering point (RSM-021)
    /// </summary>
    BRS_004_CREATEMETERINGPOINT_V1_STEP_1,

    /// <summary>
    /// BRS-004 Create metering point - Step 2 - Confirm creation of metering point (RSM-021)
    /// </summary>
    BRS_004_CREATEMETERINGPOINT_V1_STEP_2,

    /// <summary>
    /// BRS-004 Create metering point - Step 3 - Reject creation of metering point (RSM-021)
    /// </summary>
    BRS_004_CREATEMETERINGPOINT_V1_STEP_3,

    /// <summary>
    /// BRS-004 Create metering point - Step 4 - Information about newly created metering point (RSM-022)
    /// </summary>
    BRS_004_CREATEMETERINGPOINT_V1_STEP_4,

    /// <summary>
    /// BRS-008 Connect metering point - Step 1 - Incoming RSM-021
    /// </summary>
    BRS_008_CONNECTMETERINGPOINT_V1_STEP_1,

    /// <summary>
    /// BRS-008 Connect metering point - Step 2 - Confirm RSM-021
    /// </summary>
    BRS_008_CONNECTMETERINGPOINT_V1_STEP_2,

    /// <summary>
    /// BRS-008 Connect metering point - Step 3 - Reject RSM-021
    /// </summary>
    BRS_008_CONNECTMETERINGPOINT_V1_STEP_3,

    /// <summary>
    /// BRS-009 Tilflytning - Step 1: Anmodning om tilflytning (RSM-001)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_1,

    /// <summary>
    /// BRS-009 Tilflytning - Step 2: Godkendelse af anmodning om tilflytning (RSM-001)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_2,

    /// <summary>
    /// BRS-009 Tilflytning - Step 3: Afvisning af anmodning om tilflytning (RSM-001)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_3,

    /// <summary>
    /// BRS-009 Tilflytning - Step 4: Information om målepunktsstamdata (RSM-022)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_4,

    /// <summary>
    /// BRS-009 Tilflytning - Step 5: Information om kundestamdata (RSM-028)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_5,

    /// <summary>
    /// BRS-009 Tilflytning - Step 6: Information om pristilknytninger (RSM-031)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_6,

    /// <summary>
    /// BRS-009 Tilflytning - Step 7: Anmodning om opdatering af kundestamdata (RSM-027)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_7,

    /// <summary>
    /// BRS-009 Tilflytning - Step 8: Godkendelse af opdatering af kundestamdata (RSM-027)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_8,

    /// <summary>
    /// BRS-009 Tilflytning - Step 9: Afvisning af opdatering af kundestamdata (RSM-027)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_9,

    /// <summary>
    /// BRS-009 Tilflytning - Step 10: Information om tilflytning til netvirksomhed (RSM-004/E65)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_10,

    /// <summary>
    /// BRS-009 Tilflytning - Step 11: Information om kundestamdata til netvirksomhed (RSM-028/E65)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_11,

    /// <summary>
    /// BRS-009 Tilflytning - Step 12: Information om stop af leverance (RSM-004/E01)
    /// </summary>
    BRS_009_MOVEIN_V1_STEP_12,

    /// <summary>
    /// BRS-015 Opdatering af kundestamdata - Step 1: Anmodning om opdatering af kundestamdata (RSM-027)
    /// </summary>
    BRS_015_CHANGECUSTOMERCHARACTERISTICS_V1_STEP_1,

    /// <summary>
    /// BRS-015 Opdatering af kundestamdata - Step 2: Godkendelse af opdatering af kundestamdata (RSM-027)
    /// </summary>
    BRS_015_CHANGECUSTOMERCHARACTERISTICS_V1_STEP_2,

    /// <summary>
    /// BRS-015 Opdatering af kundestamdata - Step 3: Afvisning af opdatering af kundestamdata (RSM-027)
    /// </summary>
    BRS_015_CHANGECUSTOMERCHARACTERISTICS_V1_STEP_3,

    /// <summary>
    /// BRS-015 Opdatering af kundestamdata - Step 4: Information om kundestamdata (RSM-028)
    /// </summary>
    BRS_015_CHANGECUSTOMERCHARACTERISTICS_V1_STEP_4,

    /// <summary>
    /// Unknown or unmapped step type.
    /// Used when ProcessManager returns a step we haven't added to this enum yet.
    /// </summary>
    UNKNOWN,
}
