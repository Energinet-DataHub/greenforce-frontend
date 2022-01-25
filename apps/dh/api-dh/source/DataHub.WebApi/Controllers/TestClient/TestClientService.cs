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
using System.Reflection;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml.Serialization;
using ENDK.DataHub.Common.Extensions;

namespace Energinet.DataHub.WebApi.Controllers.TestClient
{
    public class TestClientService
    {
#pragma warning disable

        public SendMessageTemplateListDTO GetMessageTemplateList()
        {
            SendMessageTemplateListDTO dto = new SendMessageTemplateListDTO();
            dto.TemplateList = GetAllMessageTemplateListFromXml();
            dto.Result = dto.TemplateList.Count.ToString();
            return dto;
        }

        public SendMessageTemplateDTO GetMessageTemplate(string templateId)
        {
            var codelists = GetCodeLists();
            SendMessageTemplateDTO result = GetMessageTemplateFromXml(templateId);
            result.XmlTemplate = GetResourceTextFileTemp("SendMessageTemplate-" + templateId + "-XMLTemplate");

            result.XmlOriginal = result.XmlTemplate;

            foreach (var field in result.FieldList)
            {
                if (field.FieldType == "DateTime")
                {
                    DateTime tempDateTime = DateTime.Now;
                    if (field.DefaultValue == "#NOW#")
                    { }
                    if (field.DefaultValue == "#TODAY#")
                        tempDateTime = DateTime.Today;
                    field.Value = tempDateTime.ToString("yyyy-MM-ddTHH:mm:ss");

                }
                if (field.FieldType == "CodeList")
                {
                    string codeListName = field.FieldTypeParam1;
                    var codeList = codelists.FirstOrDefault(x => x.CodeListNameAligned == codeListName);
                    if (codeList != null)
                        field.CodeItemList = codeList.CodeItemList;
                }
            }
            result.FieldList.ForEach(x => x.ValueOriginal = x.Value);

            return result;
        }

        public List<CodeListDTO> GetCodeLists()
        {
            var codelists = GetCodeLists("urn-ediel-org-codelists");
            codelists.AddRange(GetCodeLists("urn-entsoe-eu-wgedi-codelists"));
            codelists.AddRange(GetCodeLists("urn-entsoe-eu-local-extension-types"));
            codelists.AddRange(GetCodeLists("testclient-codelists"));

            foreach (var codeItem in codelists)
            {
                string alignname = codeItem.CodeListName;
                if (alignname.StartsWith("Standard"))
                    alignname = alignname.RemoveLeft(8);
                if (alignname.StartsWith("Local"))
                    alignname = alignname.RemoveLeft(5);
                if (alignname.EndsWith("List"))
                    alignname = alignname.RemoveRight(4);
                codeItem.CodeListNameAligned = alignname;
                codeItem.CodeItemList.ForEach(x=>x.CodeAndTitle = $"{x.Code} - {x.Title}");
                
            }
            return codelists;
        }


        private List<SendMessageTemplateDTO> GetAllMessageTemplateListFromXml()
        {
            string currentFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            List<SendMessageTemplateDTO> mesTempList = new List<SendMessageTemplateDTO>();
            //string devPath = $@"C:\projects\DH30\greenforce-frontend\apps\dh\api-dh\source\DataHub.WebApi\Controllers\TestClient\XmlMocks";
            string curDir = Directory.GetCurrentDirectory();
            string devPath = $@"{curDir}\Controllers\TestClient\XmlMocks";
            List<string> fileList = new List<string>();
            if(Directory.Exists(devPath))
                fileList.AddRange( System.IO.Directory.GetFileSystemEntries(devPath));
            var embedResList = GetListOfTemplateResourcesEmbedded();
            fileList.AddRange(embedResList);

            foreach (var filename in fileList.Distinct())
            {
                var fileInfo = new FileInfo(filename);
                if(fileInfo.Name.StartsWith("SendMessageTemplate-") && !fileInfo.Name.Contains("XMLTemplate"))
                    mesTempList.Add(GetMessageTemplateFromXml(fileInfo.Name.Replace("SendMessageTemplate-","").Replace(".xml","")));
            }

            return mesTempList;
        }


        private SendMessageTemplateDTO GetMessageTemplateFromXml(string templateId)
        {
            var serializer = new XmlSerializer(typeof(SendMessageTemplateDTO));
            SendMessageTemplateDTO resultObj;

            using (TextReader reader = new StringReader(GetResourceTextFileTemp("SendMessageTemplate-"+templateId)))
            {
                resultObj = (SendMessageTemplateDTO)serializer.Deserialize(reader);
            }

            return resultObj;
        }

        private List<CodeListDTO> GetCodeLists(string filename)
        {
            List<CodeListDTO> codeListDtoList = new List<CodeListDTO>();


            XDocument xDoc = XDocument.Load(this.GetType().Assembly.GetManifestResourceStream($"Energinet.DataHub.WebApi.Controllers.TestClient.XmlMocks.{filename}.xsd"));
            XNamespace xs = "http://www.w3.org/2001/XMLSchema";

            var codelistList = xDoc.Descendants(xs + "simpleType");

            foreach (XElement codelistItem in codelistList)
            {
                CodeListDTO dto = new CodeListDTO();

                dto.CodeListName = codelistItem.FirstAttribute?.Value;
                dto.CodeListUid = codelistItem.Descendants("Uid").FirstOrDefault()?.Value;
                dto.CodeListDefinition = codelistItem.Descendants("Definition").FirstOrDefault()?.Value;

                var enums = codelistItem.Descendants(xs + "enumeration");

                foreach (XElement item in enums)
                {
                    CodeListItemDTO itemDto = new CodeListItemDTO();
                    itemDto.Code = item.FirstAttribute?.Value;
                    itemDto.Title = item.Descendants("Title").FirstOrDefault()?.Value;
                    itemDto.Definition = item.Descendants("Definition").FirstOrDefault()?.Value;

                    dto.CodeItemList.Add(itemDto);
                }
                codeListDtoList.Add(dto);
            }

            return codeListDtoList;

            //Console.WriteLine(enums.Count()); // Tested, outputs 3.
        }

        private List<string> GetListOfTemplateResourcesEmbedded()
        {
            return this.GetType().Assembly.GetManifestResourceNames().Select(x=> x.Replace("Energinet.DataHub.WebApi.Controllers.TestClient.XmlMocks.","")).ToList();
        }

        private string GetResourceTextFileTemp(string filename)
        {
            string result = string.Empty;
            
            //string devPath = $@"C:\projects\DH30\greenforce-frontend\apps\dh\api-dh\source\DataHub.WebApi\Controllers\TestClient\XmlMocks\{filename}.xml";
            string curDir = Directory.GetCurrentDirectory();
            string devPath = $@"{curDir}\Controllers\TestClient\XmlMocks\{filename}.xml";
            if (System.IO.File.Exists(devPath))
            {
                return System.IO.File.ReadAllText(devPath);
            }

            //otherwise use embedded xml
            using (Stream stream = this.GetType().Assembly.
                       GetManifestResourceStream("Energinet.DataHub.WebApi.Controllers.TestClient.XmlMocks." + filename + ".xml"))
            {
                using (StreamReader sr = new StreamReader(stream))
                {
                    result = sr.ReadToEnd();
                }
            }
            return result;
        }
#pragma warning restore
    }
}
