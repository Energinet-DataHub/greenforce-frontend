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
using System.Threading.Tasks;
using Energinet.DataHub.MarketParticipant.Domain;
using Microsoft.EntityFrameworkCore;

namespace Energinet.DataHub.MarketParticipant.Infrastructure.Persistence
{
    public sealed class UnitOfWorkProvider : IUnitOfWorkProvider
    {
        private readonly DbContext _context;

        public UnitOfWorkProvider(IMarketParticipantDbContext marketParticipantDbContext)
        {
            ArgumentNullException.ThrowIfNull(marketParticipantDbContext, nameof(marketParticipantDbContext));

            if (marketParticipantDbContext is not DbContext context)
                throw new InvalidOperationException($"{nameof(IMarketParticipantDbContext)} must inherit {nameof(DbContext)}");

            _context = context;
        }

        public async Task<IUnitOfWork> NewUnitOfWorkAsync()
        {
            var unitOfWork = new UnitOfWork(_context);
            await unitOfWork.InitializeAsync().ConfigureAwait(false);
            return unitOfWork;
        }
    }
}
