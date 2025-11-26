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

using System.Text;
using Newtonsoft.Json;

namespace Energinet.DataHub.WebApi.Modules.Common.Utilities;

public static class JsonBase64Converter
{
    public static string Serialize<T>(T obj) =>
        Convert.ToBase64String(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(obj)));

    public static T Deserialize<T>(string base64) =>
        JsonConvert.DeserializeObject<T>(Encoding.UTF8.GetString(Convert.FromBase64String(base64)))
            ?? throw new ArgumentException("Invalid base64 string", nameof(base64));
}
