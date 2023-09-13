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
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace Energinet.DataHub.WebApi.GraphQL
{
    [SuppressMessage("Usage", "VSTHRD200", Justification = "Name indicates that the task is awaited")]
    [SuppressMessage("Usage", "VSTHRD003", Justification = "The await will not cause deadlocks")]
    public static class TaskExtensions
    {
        internal static async Task<T> Then<T>(this Task task, Func<T> then)
        {
            await task;
            return then();
        }

        internal static async Task<T> Then<T>(this Task task, Func<Task<T>> then)
        {
            await task;
            return await then();
        }

        internal static async Task<TV> Then<T, TV>(this Task<T> task, Func<T, TV> then)
        {
            var result = await task;
            return then(result);
        }

        internal static async Task<TV> Then<T, TV>(this Task<T> task, Func<T, Task<TV>> then)
        {
            var result = await task;
            return await then(result);
        }
    }
}
