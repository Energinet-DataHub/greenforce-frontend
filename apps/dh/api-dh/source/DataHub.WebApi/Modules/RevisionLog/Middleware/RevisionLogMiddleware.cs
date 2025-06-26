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

using Energinet.DataHub.WebApi.Extensions;
using HotChocolate.Language;
using HotChocolate.Resolvers;

namespace Energinet.DataHub.WebApi.Modules.RevisionLog.Middleware;

public class RevisionLogMiddleware(FieldDelegate next, string affectedEntityType)
{
    public async Task InvokeAsync(
        IMiddlewareContext context,
        IRevisionLogClient revisionLogClient,
        IHttpContextAccessor httpContextAccessor)
    {
        var activity = context.ResponseName;
        var origin = httpContextAccessor.GetRequestUrl();
        var query = context.Operation.Document.ToString(indented: false);
        var variables = context.Variables.ToDictionary(var => var.Name, var => GetValue(var.Value));
        var payload = new { query, variables };
        var affectedEntityKey = MaybeGetAffectedEntityKey(context);

        await revisionLogClient.LogAsync(activity, origin, payload, affectedEntityType, affectedEntityKey);
        await next(context);
    }

    private object? GetValue(IValueNode valueNode)
    {
        return valueNode switch
        {
            ObjectValueNode node => node.Fields.ToDictionary(f => f.Name.Value, f => GetValue(f.Value)),
            ListValueNode node => node.Items.Select(GetValue),
            IntValueNode node => node.ToInt32(),
            FloatValueNode node => node.ToDouble(),
            BooleanValueNode node => node.Value,
            NullValueNode => null,
            _ => valueNode.Value,
        };
    }

    private Guid? MaybeGetAffectedEntityKey(IMiddlewareContext context)
    {
        try
        {
            return context.ArgumentValue<Guid>("id");
        }
        catch (Exception)
        {
            return null;
        }
    }
}
