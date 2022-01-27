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
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using AutoFixture;
using Energinet.DataHub.MeteringPoints.Client.Abstractions;
using Energinet.DataHub.MeteringPoints.Client.Abstractions.Models;
using Energinet.DataHub.WebApi.Controllers.TestClient;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Moq;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Integration.Controllers
{
    public class TestClientServiceTests
    {
        [Fact]
        public void GetCodeListsTest()
        {
            var service = new TestClientService();
            var codelists = service.GetCodeLists();
            Assert.Equal(2, codelists.Where(x => x.CodeListNameAligned == "AddressType").First().CodeItemList.Count());
        }

        [Fact]
        public void GetSendMessageTemplateTest()
        {
            var service = new TestClientService();
            var templ = service.GetMessageTemplate("47fd7258-bf98-4146-a04f-5014f0b1a324");
            Assert.Equal("CreateMp", templ.Code);
        }

        [Fact]
        public void GetSendMessageTemplateListsTest()
        {
            var service = new TestClientService();
            var templateList = service.GetMessageTemplateList();
            Assert.Single(templateList.TemplateList.Where(x => x.Code == "CreateMp"));
        }

        [Fact]
        public void GetSendMessageTemplateGlobalFieldsTest()
        {
            var service = new TestClientService();
            var templ = service.GetMessageTemplate("47fd7258-bf98-4146-a04f-5014f0b1a324");
            Assert.DoesNotContain("{{GlobalMessageId}}", templ.XmlTemplate);
            Assert.DoesNotContain("{{GlobalMessageId}}", templ.XmlOriginal);
            Assert.DoesNotContain("{{GlobalCreated}}", templ.XmlTemplate);
            Assert.DoesNotContain("{{GlobalCreated}}", templ.XmlOriginal);
            Assert.Equal(3, templ.GlobalFieldList.Count);
            Guid guidParseResult;
            Assert.True(Guid.TryParse(templ.GlobalFieldList.First(x => x.Code == "GlobalTransactionId").Value, out guidParseResult), "Global transaction id must be a GUID");
        }
    }
}
