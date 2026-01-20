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

using Energinet.DataHub.WebApi.Clients.ElectricityMarket.v1;

namespace Energinet.DataHub.WebApi.Modules.ElectricityMarket.MeteringPoint.Mappers;

public static class ProductMapper
{
    public static Product? MapToDto(this DataHub.ElectricityMarket.Abstractions.Shared.Product product)
    {
        return product switch
        {
            DataHub.ElectricityMarket.Abstractions.Shared.Product.PowerActive => Product.PowerActive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.PowerReactive => Product.PowerReactive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.EnergyActive => Product.EnergyActive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.EnergyReactive => Product.EnergyReactive,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.Tariff => Product.Tariff,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.FuelQuantity => Product.FuelQuantity,
            DataHub.ElectricityMarket.Abstractions.Shared.Product.Unknown => null,
        };
    }
}
