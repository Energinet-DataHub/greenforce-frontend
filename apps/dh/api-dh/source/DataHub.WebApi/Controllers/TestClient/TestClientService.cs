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
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;
using System.Xml.Serialization;
using ENDK.DataHub.Common.Exceptions;
using ENDK.DataHub.Common.Extensions;

namespace Energinet.DataHub.WebApi.Controllers.TestClient
{
    public class TestClientService
    {
        public SendMessageTemplateListDTO GetMessageTemplateList()
        {
            var dto = new SendMessageTemplateListDTO();
            dto.TemplateList = GetAllMessageTemplateListFromXml();
            dto.Result = dto.TemplateList.Count.ToString();
            return dto;
        }

        public SendMessageTemplateDTO GetMessageTemplate(string templateId)
        {
            var codelists = GetCodeLists();
            SendMessageTemplateDTO mesTemplateDto = GetMessageTemplateFromXml(templateId);
            SendMessageTemplateDTO globalFieldListDto = GetMessageTemplateFromXml("GlobalFieldList");

            globalFieldListDto.FieldList.ForEach(globalField => mesTemplateDto.GlobalFieldList.Add(globalField));

            mesTemplateDto.XmlTemplate = GetResourceTextFileTemp("SendMessageTemplate-" + templateId + "-XMLTemplate");

            var fieldListGeneratedFromXml = GetFieldDtosFromXml(mesTemplateDto.XmlTemplate);
            foreach (var genFieldItem in fieldListGeneratedFromXml)
            {
                var foundInFieldList = mesTemplateDto.FieldList.SingleOrDefault(x => x.Code == genFieldItem.Code);

                if (foundInFieldList == null)
                {
                    mesTemplateDto.FieldList.Add(genFieldItem);
                }
                else
                {
                    // Found. Now use generated or overrides
                    if (string.IsNullOrEmpty(foundInFieldList.CodeShort))
                    {
                        foundInFieldList.CodeShort = genFieldItem.CodeShort;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.Comment))
                    {
                        foundInFieldList.Comment = genFieldItem.Comment;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.DefaultValue))
                    {
                        foundInFieldList.DefaultValue = genFieldItem.DefaultValue;
                    }

                    if (foundInFieldList.FieldOrder == 0)
                    {
                        foundInFieldList.FieldOrder = genFieldItem.FieldOrder;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.FieldType))
                    {
                        foundInFieldList.FieldType = genFieldItem.FieldType;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.FieldTypeParam1))
                    {
                        foundInFieldList.FieldTypeParam1 = genFieldItem.FieldTypeParam1;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.FieldTypeParam2))
                    {
                        foundInFieldList.FieldTypeParam2 = genFieldItem.FieldTypeParam2;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.FieldTypeParam3))
                    {
                        foundInFieldList.FieldTypeParam3 = genFieldItem.FieldTypeParam3;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.FieldTypeParam4))
                    {
                        foundInFieldList.FieldTypeParam4 = genFieldItem.FieldTypeParam4;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.FieldTypeParam5))
                    {
                        foundInFieldList.FieldTypeParam5 = genFieldItem.FieldTypeParam5;
                    }

                    if (!foundInFieldList.IsMandatory.HasValue)
                    {
                        foundInFieldList.IsMandatory = genFieldItem.IsMandatory;
                    }

                    if (foundInFieldList.ItemList.Count != 0)
                    {
                        foundInFieldList.ItemList = genFieldItem.ItemList;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.Name))
                    {
                        foundInFieldList.Name = genFieldItem.Name;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.UIState))
                    {
                        foundInFieldList.UIState = genFieldItem.UIState;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.Value))
                    {
                        foundInFieldList.Value = genFieldItem.Value;
                    }

                    if (string.IsNullOrEmpty(foundInFieldList.ValueOriginal))
                    {
                        foundInFieldList.ValueOriginal = genFieldItem.ValueOriginal;
                    }
                }
            }

            SetFieldListDefaults(mesTemplateDto.FieldList, codelists);
            SetFieldListDefaults(mesTemplateDto.GlobalFieldList, codelists);

            foreach (var globalField in mesTemplateDto.GlobalFieldList)
            {
                if (globalField.UIState == "Hide")
                {
                    mesTemplateDto.XmlTemplate = mesTemplateDto.XmlTemplate.Replace("{{" + globalField.Code + "}}", globalField.Value);
                }
                else
                {
                    mesTemplateDto.FieldList.Add(globalField);
                }
            }

            mesTemplateDto.FieldList = mesTemplateDto.FieldList.OrderBy(x => x.FieldOrder).ToList();
            mesTemplateDto.XmlOriginal = mesTemplateDto.XmlTemplate;

            mesTemplateDto.ValidationRuleList.ForEach(x => x.Rule = x.Rule.Replace("AND", "&&"));
            mesTemplateDto.ValidationRuleList.ForEach(x => x.Rule = x.Rule.Replace("OR", "||"));

            return mesTemplateDto;
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
                {
                    alignname = alignname.RemoveLeft(8);
                }

                if (alignname.StartsWith("Local"))
                {
                    alignname = alignname.RemoveLeft(5);
                }

                if (alignname.EndsWith("List"))
                {
                    alignname = alignname.RemoveRight(4);
                }

                codeItem.CodeListNameAligned = alignname;
                codeItem.CodeItemList.ForEach(x => x.CodeAndTitle = $"{x.Code} - {x.Title}");
            }

            return codelists;
        }

        private List<SendMessageTemplateFieldDTO> GetFieldDtosFromXml(string xmlTemplate)
        {
            MatchCollection? allMatchResults = null;
            var regexObj = new Regex("{{.*?}}");
            allMatchResults = regexObj.Matches(xmlTemplate);
            var matchResultList = allMatchResults.Cast<System.Text.RegularExpressions.Match>().Select(m => m.Value).ToList();

            var fieldDtoList = new List<SendMessageTemplateFieldDTO>();
            int fieldOrder = 100; // Make sure to start higher than global fields
            foreach (var matchWithBrackets in matchResultList)
            {
                fieldOrder++;
                fieldOrder++; // Best to have spaces between this index for easier adding a field later in the middle

                string match = matchWithBrackets.Trim('{', '}');
                if (match.StartsWith("Global"))
                {
                    continue;
                }

                string code = match;

                bool isMandatory = match.StartsWith("*");
                match = match.TrimStart('*');

                // string codeShort = match;//* removed already
                string fieldType = "String";
                string fieldTypeParam1 = string.Empty;
                string fieldTypeParam2 = string.Empty;
                string? fieldTypeParam3 = string.Empty;
                string? defaultValue = string.Empty;
                var itemList = new List<ListItemDTO>();
                if (match.StartsWith("Date_"))
                {
                    fieldType = "DateTime";
                    match = match.ReplaceFirst("Date_", string.Empty);
                    var dateTimeDefValue = match.SplitAndGetSafe('_', 1);
                    if (!string.IsNullOrEmpty(dateTimeDefValue))
                    {
                        defaultValue = dateTimeDefValue;
                    }
                    else
                    {
                        defaultValue = "NOW";
                    }

                    match = match.SplitAndGetSafe('_', 0);
                }
                else if (match.StartsWith("Bool_"))
                {
                    fieldType = "Boolean";
                    match = match.ReplaceFirst("Bool_", string.Empty);
                    defaultValue = match.SplitAndGetSafe('_', 1)?.ToLower();
                    match = match.SplitAndGetSafe('_', 0);
                }
                else if (match.StartsWith("Guid_"))
                {
                    fieldType = "Guid";
                    match = match.ReplaceFirst("Guid_", string.Empty);
                    defaultValue = match.SplitAndGetSafe('_', 1);
                    if (string.IsNullOrEmpty(defaultValue))
                    {
                        defaultValue = "NEWGUID";
                    }

                    match = match.SplitAndGetSafe('_', 0);
                }
                else if (match.StartsWith("Number_"))
                {
                    fieldType = "Number";
                    match = match.ReplaceFirst("Number_", string.Empty);
                    var isLenghtDefined = match.SplitAndGetSafe('_', 1)?.StartsWith("L");
                    var firstDigit = string.Empty;
                    var secondDigit = string.Empty;
                    if (isLenghtDefined == true)
                    {
                        fieldTypeParam3 = match.SplitAndGetSafe('_', 1)?.TrimStart('L');
                    }
                    else
                    {
                        firstDigit = match.SplitAndGetSafe('_', 1);
                        secondDigit = match.SplitAndGetSafe('_', 2);
                        if (string.IsNullOrEmpty(secondDigit))
                        {
                            // 1 digit after name means max value. 2 digits after name means min as the first and max as second
                            secondDigit = firstDigit;
                        }
                    }

                    defaultValue = match.SplitAndGetSafe('_', 3);
                    fieldTypeParam1 = firstDigit;
                    fieldTypeParam2 = secondDigit;
                    match = match.SplitAndGetSafe('_', 0);
                }
                else if (match.StartsWith("List_"))
                {
                    fieldType = "List";
                    match = match.ReplaceFirst("List_", string.Empty);
                    var listValuesCsv = match.SplitAndGetSafe('_', 1);
                    var listValues = listValuesCsv.Split('-');
                    itemList = new List<ListItemDTO>();
                    foreach (var value in listValues)
                    {
                        itemList.Add(new ListItemDTO() { Code = value, Title = value });
                    }

                    defaultValue = match.SplitAndGetSafe('_', 2);
                    match = match.SplitAndGetSafe('_', 0);
                }
                else if (match.StartsWith("Code_"))
                {
                    fieldType = "CodeList";
                    match = match.ReplaceFirst("Code_", string.Empty);
                    fieldTypeParam1 = match.SplitAndGetSafe('_', 1);
                    defaultValue = match.SplitAndGetSafe('_', 2);
                    match = match.SplitAndGetSafe('_', 0);
                }
                else
                {
                    // its just a string
                    fieldTypeParam1 = match.SplitAndGetSafe('_', 1);
                    defaultValue = match.SplitAndGetSafe('_', 2);
                    match = match.SplitAndGetSafe('_', 0);
                }

                fieldDtoList.Add(new SendMessageTemplateFieldDTO()
                {
                    Id = Guid.NewGuid(),
                    Code = code,
                    CodeShort = match,
                    FieldOrder = fieldOrder,
                    FieldType = fieldType,
                    FieldTypeParam1 = fieldTypeParam1,
                    FieldTypeParam2 = fieldTypeParam2,
                    FieldTypeParam3 = fieldTypeParam3 ?? string.Empty,
                    Name = match.SplitCamelCase(),
                    DefaultValue = defaultValue ?? string.Empty,
                    ItemList = itemList,
                    IsMandatory = isMandatory,
                    Comment = " ",
                });
            }

            return fieldDtoList;
        }

        private void SetFieldListDefaults(List<SendMessageTemplateFieldDTO> fieldList, List<CodeListDTO> codelists)
        {
            foreach (var field in fieldList)
            {
                field.Value = field.DefaultValue;
                if (field.FieldType == "DateTime")
                {
                    DateTime tempDateTime = DateTime.Now;
                    if (field.DefaultValue == "NOW")
                    { }
                    if (field.DefaultValue == "TODAY")
                    {
                        tempDateTime = DateTime.Today;
                    }

                    field.Value = tempDateTime.ToString("yyyy-MM-ddTHH:mm:ssZ");
                }

                if (field.FieldType == "Guid")
                {
                    if (string.IsNullOrEmpty(field.Value))
                    {
                        field.Value = Guid.Empty.ToString();
                    }

                    if (field.DefaultValue == "NEWGUID")
                    {
                        field.Value = Guid.NewGuid().ToString();
                    }
                }

                if (field.FieldType == "List")
                {
                    field.ItemList.ForEach(x => x.CodeAndTitle = $"{x.Code} - {x.Title}");
                    field.ItemList.Insert(0, new ListItemDTO() { Code = string.Empty, CodeAndTitle = "None", Definition = "None", Title = "None" });
                }

                if (field.FieldType == "CodeList")
                {
                    string codeListName = field.FieldTypeParam1;
                    var codeList = codelists.FirstOrDefault(x => x.CodeListNameAligned == codeListName);
                    if (codeList != null)
                    {
                        field.ItemList = codeList.CodeItemList;
                        field.ItemList.Insert(0, new ListItemDTO() { Code = string.Empty, CodeAndTitle = "None", Definition = "None", Title = "None" });
                    }
                }
            }

            fieldList.ForEach(x => x.ValueOriginal = x.Value);
        }

        private List<SendMessageTemplateDTO> GetAllMessageTemplateListFromXml()
        {
            string? currentFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
            var mesTempList = new List<SendMessageTemplateDTO>();
            // string devPath = $@"C:\projects\DH30\greenforce-frontend\apps\dh\api-dh\source\DataHub.WebApi\Controllers\TestClient\XmlMocks";
            string curDir = Directory.GetCurrentDirectory();
            string devPath = $@"{curDir}\Controllers\TestClient\XmlMocks";
            var fileList = new List<string>();
            if (Directory.Exists(devPath))
            {
                fileList.AddRange(System.IO.Directory.GetFileSystemEntries(devPath));
            }
            else
            {
                fileList.AddRange(GetListOfTemplateResourcesEmbedded());
            }

            foreach (var filename in fileList.Distinct())
            {
                var fileInfo = new FileInfo(filename);
                if (fileInfo.Name.StartsWith("SendMessageTemplate-") && !fileInfo.Name.Contains("XMLTemplate") && !fileInfo.Name.Contains("GlobalFieldList"))
                {
                    var fileNameAltered = fileInfo.Name.Replace("SendMessageTemplate-", string.Empty).Replace(".xml", string.Empty);
                    var fileDto = GetMessageTemplateFromXml(fileNameAltered);
                    if (fileDto != null)
                    {
                        mesTempList.Add(fileDto);
                    }
                }
            }

            return mesTempList;
        }

        private SendMessageTemplateDTO GetMessageTemplateFromXml(string templateId)
        {
            var serializer = new XmlSerializer(typeof(SendMessageTemplateDTO));
            SendMessageTemplateDTO? resultObj;

            using (TextReader reader = new StringReader(GetResourceTextFileTemp("SendMessageTemplate-" + templateId)))
            {
                resultObj = serializer.Deserialize(reader) as SendMessageTemplateDTO;
            }

            return resultObj ?? throw new Exception("Template id not found:" + templateId);
        }

        private List<CodeListDTO> GetCodeLists(string filename)
        {
            var codeListDtoList = new List<CodeListDTO>();
            var name = $"Energinet.DataHub.WebApi.Controllers.TestClient.XmlMocks.{filename}.xsd";
            using (Stream? stream = GetType().Assembly.GetManifestResourceStream(name))
            {
                if (stream == null)
                {
                    throw new Exception($"Codelist embedded resources non-existing: {name}");
                }

                var document = XDocument.Load(stream);
                XNamespace xs = "http://www.w3.org/2001/XMLSchema";

                var codelistList = document.Descendants(xs + "simpleType");

                foreach (XElement codelistItem in codelistList)
                {
                    var dto = new CodeListDTO();

                    dto.CodeListName = codelistItem.FirstAttribute?.Value ?? string.Empty;
                    dto.CodeListUid = codelistItem.Descendants("Uid").FirstOrDefault()?.Value ?? string.Empty;
                    dto.CodeListDefinition = codelistItem.Descendants("Definition").FirstOrDefault()?.Value ?? string.Empty;

                    var enums = codelistItem.Descendants(xs + "enumeration");

                    foreach (XElement item in enums)
                    {
                        var itemDto = new ListItemDTO();
                        itemDto.Code = item.FirstAttribute?.Value ?? string.Empty;
                        itemDto.Title = item.Descendants("Title").FirstOrDefault()?.Value ?? string.Empty;
                        itemDto.Definition = item.Descendants("Definition").FirstOrDefault()?.Value ?? string.Empty;

                        dto.CodeItemList.Add(itemDto);
                    }

                    codeListDtoList.Add(dto);
                }
            }

            return codeListDtoList;
        }

        private List<string> GetListOfTemplateResourcesEmbedded()
        {
            return GetType().Assembly.GetManifestResourceNames().Select(x => x.Replace("Energinet.DataHub.WebApi.Controllers.TestClient.XmlMocks.", string.Empty)).ToList();
        }

        private string GetResourceTextFileTemp(string filename)
        {
            string result = string.Empty;

            // string devPath = $@"C:\projects\DH30\greenforce-frontend\apps\dh\api-dh\source\DataHub.WebApi\Controllers\TestClient\XmlMocks\{filename}.xml";
            string curDir = Directory.GetCurrentDirectory();
            string devPath = $@"{curDir}\Controllers\TestClient\XmlMocks\{filename}.xml";
            if (System.IO.File.Exists(devPath))
            {
                return System.IO.File.ReadAllText(devPath);
            }

            // otherwise use embedded xml
            using (Stream? stream = GetType().Assembly.GetManifestResourceStream("Energinet.DataHub.WebApi.Controllers.TestClient.XmlMocks." + filename + ".xml"))
            {
                if (stream == null)
                {
                    throw new Exception("Stream in GetResourceTextFileTemp is null. Embedded resource not found:" + filename);
                }

                using (var sr = new StreamReader(stream))
                {
                    result = sr.ReadToEnd();
                }
            }

            return result;
        }
    }
}
