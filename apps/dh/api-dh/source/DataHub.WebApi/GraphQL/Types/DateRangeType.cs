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
using GraphQL.Types;
using GraphQLParser.AST;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class DateRangeType : ScalarGraphType
    {
        private const string JsDateFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";

        public DateRangeType()
        {
            Name = "DateRange";
        }

        public override object? ParseLiteral(GraphQLValue value)
        {
            throw new NotImplementedException();
        }

        public override object? ParseValue(object? value)
        {
            throw new NotImplementedException();
        }

        public override object? Serialize(object? value)
        {
            return value == null
              ? null
              : value is Tuple<DateTimeOffset, DateTimeOffset> dateRange
              ? new { start = dateRange.Item1.ToString(JsDateFormat), end = dateRange.Item2.AddTicks(-1).ToString(JsDateFormat) }
              : ThrowSerializationError(value);
        }
    }
}
