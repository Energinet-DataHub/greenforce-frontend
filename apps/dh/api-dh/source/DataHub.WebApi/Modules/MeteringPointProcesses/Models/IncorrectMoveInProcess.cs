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

using Energinet.DataHub.WebApi.Modules.MessageArchive.Models;

namespace Energinet.DataHub.WebApi.Modules.MeteringPointProcesses.Models;

/// <summary>
/// BRS-011 process model used to move incorrect move-in specific behavior out of the generic process abstraction.
/// </summary>
/// <param name="Process">The underlying generic metering point process representation.</param>
public sealed record IncorrectMoveInProcess(MeteringPointProcess Process) : IMeteringPointProcess;
