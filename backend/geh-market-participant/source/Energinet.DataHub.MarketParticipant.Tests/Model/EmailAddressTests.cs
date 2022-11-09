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

using System.ComponentModel.DataAnnotations;
using Energinet.DataHub.MarketParticipant.Domain.Model;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Model
{
    [UnitTest]
    public sealed class EmailAddressTests
    {
        [Theory]
        [InlineData("", false)]
        [InlineData(" ", false)]
        [InlineData(null, false)]
        [InlineData("johndoe.com", false)]
        [InlineData("john.@doe.com", true)]
        [InlineData("john@doe.com", true)]
        [InlineData("john@doe.com.", true)]
        [InlineData("john@doe", true)]
        [InlineData("john+other@doe", true)]
        public void Ctor_Email_ValidatesAddress(string value, bool isValid)
        {
            if (isValid)
            {
                Assert.Equal(value, new EmailAddress(value).Address);
            }
            else
            {
                Assert.Throws<ValidationException>(() => new EmailAddress(value));
            }
        }
    }
}
