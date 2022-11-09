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
    public sealed class PhoneNumberTests
    {
        [Theory]
        [InlineData("", false)]
        [InlineData(" ", false)]
        [InlineData(null, false)]
        [InlineData("01020304", true)]
        [InlineData("+45 01020304", true)]
        [InlineData("123.456.7890", true)]
        [InlineData("123-456-7890", true)]
        [InlineData("+44 7222 555 555", true)]
        [InlineData("+49 (173) 1799 806-44", true)]
        [InlineData("010101 letters 02", false)]
        public void Ctor_Email_ValidatesAddress(string value, bool isValid)
        {
            if (isValid)
            {
                Assert.Equal(value, new PhoneNumber(value).Number);
            }
            else
            {
                Assert.Throws<ValidationException>(() => new PhoneNumber(value));
            }
        }
    }
}
