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
    public record SendMessageResultDTO
    {
        public SendMessageResultDTO()
        {
            XmlSent = string.Empty;
            Status = string.Empty;
        }

        public string XmlSent { get; set; }

        public string Status { get; set; }

        public DateTime XmlSentDate { get; set; }
    }

    public record PeekAndDequeueMessageResultDTO
    {
        public PeekAndDequeueMessageResultDTO()
        {
            Result = string.Empty;
        }

        public string Result { get; set; }
    }

    public record PeekAndDequeueMessageRequestDTO
    {
        public int DequeueMessageCount { get; set; }
    }

    public record SendMessageTemplateListDTO
    {
        public SendMessageTemplateListDTO()
        {
            TemplateList = new List<SendMessageTemplateDTO>();
            Result = string.Empty;
        }

        public string Result { get; set; }

        public List<SendMessageTemplateDTO> TemplateList { get; set; }
    }

    public record SendMessageTemplateDTO
    {
        public Guid Id { get; set; } = Guid.Empty;

        public string Code { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string Format { get; set; } = string.Empty;

        public string Domain { get; set; } = string.Empty;

        public string EndpointPostfix { get; set; } = string.Empty;

        public string RsmName { get; set; } = string.Empty;

        public string MarketDocumentType { get; set; } = string.Empty;

        public string MarketProcessType { get; set; } = string.Empty;

        public string MarketBusinessSectorType { get; set; } = string.Empty;

        public List<string> BrsNameList { get; set; } = new List<string>();

        public string XmlTemplate { get; set; } = string.Empty;

        public string XmlOriginal { get; set; } = string.Empty;

        public List<SendMessageTemplateFieldDTO> FieldList { get; set; } = new List<SendMessageTemplateFieldDTO>();

        public List<SendMessageTemplateFieldDTO> GlobalFieldList { get; set; } = new List<SendMessageTemplateFieldDTO>();

        public List<SendMessageTemplateValidationRuleDTO> ValidationRuleList { get; set; } = new List<SendMessageTemplateValidationRuleDTO>();

        public string Status { get; set; } = string.Empty;

        public string StatusComment { get; set; } = string.Empty;

        public DateTime Created { get; set; } = DateTime.Now;

        public string CreatedBy { get; set; } = string.Empty;

        public DateTime Modified { get; set; } = DateTime.Now;

        public string ModifiedBy { get; set; } = string.Empty;
    }

    public record ListItemDTO
    {
        public string Code { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;

        public string Definition { get; set; } = string.Empty;

        public string CodeAndTitle { get; set; } = string.Empty;
    }

    public record CodeListDTO
    {
        public string CodeListName { get; set; } = string.Empty;

        public string CodeListNameAligned { get; set; } = string.Empty;

        public string CodeListUid { get; set; } = string.Empty;

        public string CodeListDefinition { get; set; } = string.Empty;

        public List<ListItemDTO> CodeItemList { get; set; } = new List<ListItemDTO>();
    }

    public record SendMessageTemplateValidationRuleDTO
    {
        public string Rule { get; set; } = string.Empty;

        public string Action { get; set; } = string.Empty;

        public string Text { get; set; } = string.Empty;
    }

    public record SendMessageTemplateFieldDTO
    {
        public Guid Id { get; set; } = Guid.Empty;

        public string Name { get; set; } = string.Empty;

        public string Code { get; set; } = string.Empty;

        public string Value { get; set; } = string.Empty;

        public string ValueOriginal { get; set; } = string.Empty;

        public string Comment { get; set; } = string.Empty;

        public string DefaultValue { get; set; } = string.Empty;

        public bool IsMandatory { get; set; } = false;

        /// <summary>
        /// Empty=normal. Hide=dont show. Disable=show but disable
        /// </summary>
        public string UIState { get; set; } = string.Empty;

        public string FieldType { get; set; } = string.Empty;

        public string FieldTypeParam1 { get; set; } = string.Empty;

        public string FieldTypeParam2 { get; set; } = string.Empty;

        public string FieldTypeParam3 { get; set; } = string.Empty;

        public string FieldTypeParam4 { get; set; } = string.Empty;

        public string FieldTypeParam5 { get; set; } = string.Empty;

        public int FieldOrder { get; set; } = 0;

        public List<ListItemDTO> ItemList { get; set; } = new List<ListItemDTO>();
    }
}
