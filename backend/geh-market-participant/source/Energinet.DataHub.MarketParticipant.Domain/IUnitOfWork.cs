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

namespace Energinet.DataHub.MarketParticipant.Domain
{
    /// <summary>
    /// A <see cref="IUnitOfWork"/> used to run several DB commands as one atomic operation. Inject <see cref="IUnitOfWorkProvider"/> and use <see cref="IUnitOfWorkProvider.NewUnitOfWorkAsync"/> to create and initilize a new <see cref="IUnitOfWork"/>
    /// </summary>
    public interface IUnitOfWork : IAsyncDisposable
    {
        /// <summary>
        /// Commits changes made from when the <see cref="IUnitOfWork"/> was initilized.
        /// </summary>
        Task CommitAsync();
    }
}
