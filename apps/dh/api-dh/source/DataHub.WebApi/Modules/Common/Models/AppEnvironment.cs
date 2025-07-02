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

namespace Energinet.DataHub.WebApi.Modules.Common.Models;

public static class AppEnvironment
{
    public const string Local = "localhost";
    public const string Dev001 = "d-001";
    public const string Dev002 = "d-002";
    public const string Test001 = "t-001";
    public const string Test002 = "t-002";
    public const string PreProd = "b-001";
    public const string Prod = "p-001";
}
