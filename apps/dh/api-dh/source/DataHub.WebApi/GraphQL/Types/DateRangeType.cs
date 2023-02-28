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
using System.Collections.Generic;
using System.Linq;
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
            if (value is GraphQLNullValue)
            {
                return null;
            }

            if (value is GraphQLObjectValue objectValue)
            {
                var entries = objectValue.Fields?.ToDictionary(
                    x => x.Name.Value,
                    x => x.Value switch
                    {
                        GraphQLStringValue s => DateTimeOffset.Parse((string)s.Value),
                        _ => throw new FormatException(),
                    });

                if (entries == null || entries.Count != 2)
                {
                    return ThrowLiteralConversionError(value);
                }

                var start = entries["start"];
                var end = entries["end"].AddMilliseconds(1);

                return Tuple.Create(start, end);
            }

            return ThrowLiteralConversionError(value);
        }

        public override object? ParseValue(object? value)
        {
            if (value == null)
            {
                return null;
            }

            if (value is IDictionary<string, object> dictionary)
            {
                var start = DateTimeOffset.Parse(dictionary["start"].ToString() ?? string.Empty);
                var end = DateTimeOffset.Parse(dictionary["end"].ToString() ?? string.Empty);

                if (dictionary.Count > 2)
                {
                    return ThrowValueConversionError(value);
                }

                return Tuple.Create(start, end.AddMilliseconds(1));
            }

            return ThrowValueConversionError(value);
        }

        public override object? Serialize(object? value)
        {
            return value == null
              ? null
              : value is Tuple<DateTimeOffset, DateTimeOffset> dateRange
              ? new { start = dateRange.Item1.ToString(JsDateFormat), end = dateRange.Item2.AddTicks(-1).ToString(JsDateFormat) }
              : ThrowSerializationError(value);
        }

        public override GraphQLValue ToAST(object? value)
        {
            if (value == null)
            {
                return new GraphQLNullValue();
            }

            if (value is Tuple<DateTimeOffset, DateTimeOffset> dateRange)
            {
                return new GraphQLObjectValue
                {
                    Fields = new List<GraphQLObjectField>
                    {
                        new GraphQLObjectField
                        {
                            Name = new GraphQLName("start"),
                            Value = new GraphQLStringValue(dateRange.Item1.ToString()),
                        },
                        new GraphQLObjectField
                        {
                            Name = new GraphQLName("end"),
                            Value = new GraphQLFloatValue(dateRange.Item2.ToString()),
                        },
                    },
                };
            }

            return ThrowASTConversionError(value);
        }
    }
}
