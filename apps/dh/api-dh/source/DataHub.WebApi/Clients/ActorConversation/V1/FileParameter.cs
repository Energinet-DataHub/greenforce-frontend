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
namespace Energinet.DataHub.WebApi.Clients.ActorConversation.v1;

public partial class FileParameter
{
    public FileParameter(System.IO.Stream data)
        : this(data, null, null)
    {
    }

    public FileParameter(System.IO.Stream data, string? fileName)
        : this(data, fileName, null)
    {
    }

    public FileParameter(System.IO.Stream data, string? fileName, string? contentType)
    {
        Data = data;
        FileName = fileName;
        ContentType = contentType;
    }

    public System.IO.Stream Data { get; private set; }

    public string? FileName { get; private set; }

    public string? ContentType { get; private set; }
}
