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

using Energinet.DataHub.ProcessManager.Abstractions.Api.WorkflowInstance.Model;
using Energinet.DataHub.ProcessManager.Abstractions.Core.ValueObjects;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;
using Energinet.DataHub.WebApi.Modules.MessageArchive.Types;

namespace Energinet.DataHub.WebApi.Modules.MeteringPointProcesses.Models;

/// <summary>
/// Common contract for metering point processes while concrete process types are introduced incrementally.
/// </summary>
public interface IMeteringPointProcess
{
    /// <summary>The underlying generic metering point process representation.</summary>
    MeteringPointProcess Process { get; }

    /// <summary>The process instance identifier.</summary>
    string Id => Process.Id;

    /// <summary>The transaction identifier associated with the process, when available.</summary>
    string? TransactionId => Process.TransactionId;

    /// <summary>The time when the process was created.</summary>
    DateTimeOffset CreatedAt => Process.CreatedAt;

    /// <summary>The process cutoff date, when relevant for the business reason.</summary>
    DateTimeOffset? CutoffDate => Process.CutoffDate;

    /// <summary>The process business reason.</summary>
    BusinessReason BusinessReason => Process.BusinessReason;

    /// <summary>The initiating actor number, or an empty value when masked by Process Manager.</summary>
    string ActorNumber => Process.ActorNumber;

    /// <summary>The initiating actor role.</summary>
    string ActorRole => Process.ActorRole;

    /// <summary>The mapped process state.</summary>
    MeteringPointProcessState State => Process.State;

    /// <summary>The identifier of the process that cancelled this process, when relevant.</summary>
    string? CancelledByProcessId => Process.CancelledByProcessId;

    /// <summary>The cancellation timestamp, when this process was cancelled.</summary>
    DateTimeOffset? CancellationTimestamp => Process.CancellationTimestamp;

    /// <summary>The raw Process Manager workflow actions.</summary>
    WorkflowAction[]? Actions => Process.Actions;

    /// <summary>The raw Process Manager workflow steps, when loaded for details.</summary>
    IReadOnlyCollection<WorkflowStepInstanceDto>? WorkflowSteps => Process.WorkflowSteps;

    /// <summary>The metering point identifier that scopes this process.</summary>
    string? MeteringPointId => Process.MeteringPointId;
}
