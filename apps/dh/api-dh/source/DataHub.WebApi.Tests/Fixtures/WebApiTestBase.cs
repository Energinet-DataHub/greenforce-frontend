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

using System;
using System.Net.Http;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace Energinet.DataHub.WebApi.Tests.Fixtures;

public abstract class WebApiTestBase
    : IClassFixture<WebApiFactory>, IDisposable
{
    public HttpClient Client { get; set; }

    public WebApiFactory Factory { get; }

    public WebApiTestBase(WebApiFactory factory)
    {
        Factory = factory;
        factory.ConfigureTestServices = ConfigureMocks;

        Client = factory.CreateClient();
        Client.DefaultRequestHeaders.Add("Authorization", $"Bearer xxx");
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            Client.Dispose();
        }
    }

    protected virtual void ConfigureMocks(IServiceCollection services)
    {
    }
}
