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

using System.Threading.Tasks;
using Energinet.DataHub.Core.TestCommon.Diagnostics;
using Microsoft.Extensions.Configuration;
using Xunit;
using Xunit.Abstractions;

namespace Energinet.DataHub.WebApi.Tests.Fixtures
{
    /// <summary>
    /// An xUnit fixture for supporting integration testing of a WebApi
    /// </summary>
    public abstract class WebApiFixture : IAsyncLifetime
    {
        protected WebApiFixture()
        {
            TestLogger = new TestDiagnosticsLogger();
        }

        public ITestDiagnosticsLogger TestLogger { get; }

        public async Task InitializeAsync()
        {
            var configuration = new ConfigurationBuilder().Build();

            await OnInitializeWebApiDependenciesAsync(configuration).ConfigureAwait(false);
        }

        public async Task DisposeAsync()
        {
            await OnDisposeWebApiDependenciesAsync().ConfigureAwait(false);
        }

        /// <summary>
        /// Use this method to attach <paramref name="testOutputHelper"/> to the host logging pipeline.
        /// While attached, any entries written to host log pipeline will also be logged to xUnit test output.
        /// It is important that it is only attached while a test i active. Hence, it should be attached in
        /// the test class constructor; and detached in the test class Dispose method (using 'null').
        /// </summary>
        /// <param name="testOutputHelper">If a xUnit test is active, this should be the instance of xUnit's
        /// <see cref="ITestOutputHelper"/>; otherwise it should be 'null'.</param>
        public void SetTestOutputHelper(ITestOutputHelper testOutputHelper)
        {
            TestLogger.TestOutputHelper = testOutputHelper;
        }

        /// <summary>
        /// Settings have been frozen, meaning loaded settings will not get updated
        /// if environment variables are changed from here on.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        protected virtual Task OnInitializeWebApiDependenciesAsync(IConfiguration configuration)
        {
            return Task.CompletedTask;
        }

        protected virtual Task OnDisposeWebApiDependenciesAsync()
        {
            return Task.CompletedTask;
        }
    }
}
