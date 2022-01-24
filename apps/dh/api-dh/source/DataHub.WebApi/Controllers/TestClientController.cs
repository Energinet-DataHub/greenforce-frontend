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
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml.Serialization;
using ENDK.DataHub.Common.Extensions;
using Energinet.DataHub.MeteringPoints.Client.Abstractions;
using Energinet.DataHub.MeteringPoints.Client.Abstractions.Models;
using Energinet.DataHub.WebApi.Controllers.TestClient;
using Microsoft.AspNetCore.Mvc;

namespace Energinet.DataHub.WebApi.Controllers
{
    [ApiController]
    [Route("v1/[controller]")]
    public class TestClientController : ControllerBase
    {
#pragma warning disable
        private static readonly HttpClient Client = new HttpClient();



            [HttpGet("GetSendMessageTemplateDTO")]
        public async Task<ActionResult<SendMessageTemplateDTO>> GetSendMessageTemplateDTO(string templateId)
        {
            //if (templateId == null)
            //templateId = "47fd7258-bf98-4146-a04f-5014f0b1a324";
            //SendMessageTemplateDTO dtt = new SendMessageTemplateDTO();
            //var cdi = new List<CodeListItemDTO>();
            //cdi.Add(new CodeListItemDTO() { Code = "Code", Definition = "Def", Title = "Ti"});
            ////dtt.FieldList.Add(new SendMessageTemplateFieldDTO() { CodeItemList = cdi });
            //writeTestFile(dtt);

            TestClientService service = new TestClientService();
            var result = service.GetMessageTemplate(templateId);


            //Now do logic like ordering and default values on fields
            //TODO: ordering of fields is done direct in xml right now
            //result.FieldList = result.FieldList

            

            return result == null ? NotFound() : Ok(result); //xmlMessage == null ? NotFound() : Ok(xmlMessage + "FROM SERVER");
        }

        [HttpPost("SendMessage")]
        public async Task<ActionResult<SendMessageResultDTO>> SendMessage(SendMessageTemplateDTO dto)
        {
            var result = new SendMessageResultDTO() { Status = "OK", XmlSentDate = DateTime.Now, XmlSent = dto.Code }; //dto.ToXml()
            return result == null ? NotFound() : Ok(result); //xmlMessage == null ? NotFound() : Ok(xmlMessage + "FROM SERVER");
        }

        [HttpGet("PeekAndDequeueMessage")]
        public async Task<ActionResult<PeekAndDequeueMessageResultDTO>> PeekAndDequeueMessage(PeekAndDequeueMessageRequestDTO dto)
        {
            var result = new PeekAndDequeueMessageResultDTO() { Result = dto.ToXml() };
            return result == null ? NotFound() : Ok(result); //xmlMessage == null ? NotFound() : Ok(xmlMessage + "FROM SERVER");
        }


        private void createTestDataTemp(SendMessageTemplateDTO dto)
        {
            SendMessageTemplateDTO result = new SendMessageTemplateDTO() { Code = "CreateMp", Name = "Create mp", Id = System.Guid.Parse("47fd7258-bf98-4146-a04f-5014f0b1a324") };
            result.FieldList.Add(new SendMessageTemplateFieldDTO() { Code = "MpId", Comment = "18 chars" });
            result.FieldList.Add(new SendMessageTemplateFieldDTO() { Code = "MpType", Comment = "like E17" });
            result.BrsNameList.Add("BRS-001");
        }
        private void writeTestFile(SendMessageTemplateDTO dto)
        {
            
            System.Xml.Serialization.XmlSerializer writer =
           new System.Xml.Serialization.XmlSerializer(typeof(SendMessageTemplateDTO));

            var path = $"c:\\tmp\\SendMessageTemplateDTO{DateTime.Now.ToString("yyyy-MM-HH-mm-ss")}.xml";
            System.IO.FileStream file = System.IO.File.Create(path);

            writer.Serialize(file, dto);
            file.Close();
        }

        /// <summary>
        /// Sends raw xml
        /// </summary>
        /// <param name="xmlMessage">raw xml</param>
        /// <returns>correlation ID.</returns>
        /// <response code="200">Returns a metering point if found.</response>
        /// <response code="404">Returned if not found.</response>
        [HttpGet("SendRawMessage")]
        public async Task<ActionResult<MeteringPointCimDto>> SendRawMessgaeAsync(string xmlMessage, string end)
        {
            var values = new Dictionary<string, string>
                        {
                            { "thing1", "hello" },
                            { "thing2", "world" },
                        };


            var content = new FormUrlEncodedContent(nameValueCollection: values);


            var response = await Client.PostAsync("http://www.example.com/recepticle.aspx", content);
            var responseString = await response.Content.ReadAsStringAsync();

            return xmlMessage == null ? NotFound() : Ok(xmlMessage + "FROM SERVER");
        }
#pragma warning restore 
    }
}
