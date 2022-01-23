// Copyright 2021 Energinet DataHub A/S
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ENDK.DataHub.Common.Extensions;

namespace Energinet.DataHub.WebApi.Controllers.TestClient
{
#pragma warning disable

    public record SendMessageResultDTO
    {
        public string Result { get; set; }
    }

    public record PeekAndDequeueMessageResultDTO
    {
        public string Result { get; set; }
    }

    public record PeekAndDequeueMessageRequestDTO
    {
        public int DequeueMessageCount { get; set; }
    }

    public record SendMessageTemplateDTO
    {
        public SendMessageTemplateDTO()
        {
            BrsNameList = new List<string>();
            FieldList = new List<SendMessageTemplateFieldDTO>();
        }

        public Guid Id { get; set; }

        public string Code { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Format { get; set; }

        public string Domain { get; set; }

        public string EndpointPostfix { get; set; }

        public string RsmName { get; set; }

        public string MarketDocumentType { get; set; }

        public string MarketProcessType { get; set; }

        public string MarketBusinessSectorType { get; set; }

        public List<string> BrsNameList { get; set; }

        public string XmlTemplate { get; set; }

        public string XmlOriginal { get; set; }

        public List<SendMessageTemplateFieldDTO> FieldList { get; set; }

        public string Status { get; set; }

        public string StatusComment { get; set; }

        public DateTime Created { get; set; }

        public string CreatedBy { get; set; }

        public DateTime Modified { get; set; }

        public string ModifiedBy { get; set; }
    }

    public record CodeListItemDTO
    {
        public string Code { get; set; }
        public string Title { get; set; }
        public string Definition { get; set; }

        public string CodeAndTitle { get; set; }
    }

    public record CodeListDTO
    {
        public CodeListDTO()
        {
            CodeItemList = new List<CodeListItemDTO>();
        }

        

        public string CodeListName { get; set; }

        public string CodeListNameAligned { get; set; }
        
        public string CodeListUid { get; set; }

        public string CodeListDefinition { get; set; }

        public List<CodeListItemDTO> CodeItemList { get; set; }

      
    }


    public class SendMessageTemplateFieldDTO

    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public string Code { get; set; }
        public string Value { get; set; }
        public string ValueOriginal { get; set; }

        public string Comment { get; set; }

        public string DefaultValue { get; set; }

        public bool IsMandatory { get; set; }

        public string FieldType { get; set; }

        public string FieldTypeParam1 { get; set; }

        public string FieldTypeParam2 { get; set; }

        public string FieldTypeParam3 { get; set; }

        public string FieldTypeParam4 { get; set; }

        public string FieldTypeParam5 { get; set; }

        //public List<string> FieldValueList { get; set; }

        public int FieldOrder { get; set; }

        public List<CodeListItemDTO> CodeItemList { get; set; }
    }
    /*
     DefaultValue
IsMandatory
DomainCodeListName
ListValues
Comment
EmptyAction
IgnoreListValues
SelectGln
DaysOffset
     */
#pragma warning restore
}
