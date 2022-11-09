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
using Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence.EntityConfiguration
{
    public sealed class MarketRoleGridAreaEntityConfiguration : IEntityTypeConfiguration<MarketRoleGridAreaEntity>
    {
        public void Configure(EntityTypeBuilder<MarketRoleGridAreaEntity> builder)
        {
            ArgumentNullException.ThrowIfNull(builder, nameof(builder));
            builder.ToTable("MarketRoleGridArea");
            builder.HasKey(rg => rg.Id);
            builder.Property(rg => rg.Id).ValueGeneratedOnAdd();
            builder.Property(p => p.GridAreaId);
            builder.OwnsMany(role => role.MeteringPointTypes, ConfigureMeteringTypes);
        }

        private static void ConfigureMeteringTypes(
            OwnedNavigationBuilder<MarketRoleGridAreaEntity, MeteringPointTypeEntity> meteringPointTypeBuilder)
        {
            meteringPointTypeBuilder.WithOwner().HasForeignKey("MarketRoleGridAreaId");
            meteringPointTypeBuilder.ToTable("GridAreaMeteringPointType");
            meteringPointTypeBuilder.Property<Guid>("Id").ValueGeneratedOnAdd();
            meteringPointTypeBuilder.Property(p => p.MarketRoleGridAreaId).HasColumnName("MarketRoleGridAreaId");
            meteringPointTypeBuilder.Property(p => p.MeteringTypeId).HasColumnName("MeteringPointTypeId");
        }
    }
}
