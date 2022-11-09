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
using Energinet.DataHub.MarketParticipant.Common.Configuration;
using Energinet.DataHub.MarketParticipant.Common.Extensions;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;
using Xunit.Categories;

namespace Energinet.DataHub.MarketParticipant.Tests.Common.Extensions;

[UnitTest]
public sealed class ConfigurationExtensionsTests
{
    [Fact]
    public void GetOptionalSetting_HasStringValue_ReturnsValue()
    {
        // Arrange
        const string expectedValue = "fake_value";

        var configurationMock = new Mock<IConfiguration>();
        var target = configurationMock.Object;

        var setting = new Setting<string>("test_setting");

        var sectionMock = new Mock<IConfigurationSection>();
        sectionMock
            .Setup(s => s.Value)
            .Returns(expectedValue);

        configurationMock
            .Setup(c => c.GetSection(setting.Key))
            .Returns(sectionMock.Object);

        // Act
        var actual = target.GetOptionalSetting(setting);

        // Assert
        Assert.Equal(expectedValue, actual);
    }

    [Fact]
    public void GetOptionalSetting_HasNoValue_ReturnsNothing()
    {
        // Arrange
        var configurationMock = new Mock<IConfiguration>();
        var target = configurationMock.Object;

        var setting = new Setting<string>("test_setting");

        var sectionMock = new Mock<IConfigurationSection>();
        configurationMock
            .Setup(c => c.GetSection(setting.Key))
            .Returns(sectionMock.Object);

        // Act
        var actual = target.GetOptionalSetting(setting);

        // Assert
        Assert.Null(actual);
    }

    [Fact]
    public void GetSetting_HasStringValue_ReturnsValue()
    {
        // Arrange
        const string expectedValue = "fake_value";

        var configurationMock = new Mock<IConfiguration>();
        var target = configurationMock.Object;

        var setting = new Setting<string>("test_setting");

        var sectionMock = new Mock<IConfigurationSection>();
        sectionMock
            .Setup(s => s.Value)
            .Returns(expectedValue);

        configurationMock
            .Setup(c => c.GetSection(setting.Key))
            .Returns(sectionMock.Object);

        // Act
        var actual = target.GetSetting(setting);

        // Assert
        Assert.Equal(expectedValue, actual);
    }

    [Fact]
    public void GetSetting_HasNoValue_ThrowsException()
    {
        // Arrange
        var configurationMock = new Mock<IConfiguration>();
        var target = configurationMock.Object;

        var setting = new Setting<string>("test_setting");

        var sectionMock = new Mock<IConfigurationSection>();
        configurationMock
            .Setup(c => c.GetSection(setting.Key))
            .Returns(sectionMock.Object);

        // Act + Assert
        Assert.Throws<InvalidOperationException>(() => target.GetSetting(setting));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("  ")]
    [InlineData("")]
    public void GetSetting_HasBrokenStringValue_ThrowsException(string value)
    {
        // Arrange
        var configurationMock = new Mock<IConfiguration>();
        var target = configurationMock.Object;

        var setting = new Setting<string>("test_setting");

        var sectionMock = new Mock<IConfigurationSection>();
        sectionMock
            .Setup(s => s.Value)
            .Returns(value);

        configurationMock
            .Setup(c => c.GetSection(setting.Key))
            .Returns(sectionMock.Object);

        // Act + Assert
        Assert.Throws<InvalidOperationException>(() => target.GetSetting(setting));
    }

    [Fact]
    public void GetSetting_HasIntegerValue_ReturnsValue()
    {
        // Arrange
        const int expectedValue = 7;

        var configurationMock = new Mock<IConfiguration>();
        var target = configurationMock.Object;

        var setting = new Setting<int>("test_setting");

        var sectionMock = new Mock<IConfigurationSection>();
        sectionMock
            .Setup(s => s.Value)
            .Returns("7");

        configurationMock
            .Setup(c => c.GetSection(setting.Key))
            .Returns(sectionMock.Object);

        // Act
        var actual = target.GetSetting(setting);

        // Assert
        Assert.Equal(expectedValue, actual);
    }
}
