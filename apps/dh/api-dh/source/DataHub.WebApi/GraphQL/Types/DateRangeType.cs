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
using NodaTime;
using NodaTime.Text;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public class DateRangeType : ScalarGraphType
    {
        private const string JsDateFormat = "yyyy-MM-ddTHH:mm:ss.fff'Z'";

        private static Instant? Parse(object? value)
        {
            return value switch
            {
                string s when s == string.Empty => null,
                string s => InstantPattern.ExtendedIso.Parse(s) switch
                {
                    { Success: true } result => result.Value,
                    _ => throw new FormatException(),
                },
                _ => throw new FormatException(),
            };
        }

        private static bool ContainsStartAndEnd<T>(IDictionary<string, T> dict)
        {
            return dict.Count == 2 && dict.ContainsKey("start") && dict.ContainsKey("end");
        }

        private static Instant? GetStartInstant(object? start)
        {
            return Parse(start);
        }

        private static Instant? GetEndInstant(object? end)
        {
            return Parse(end) switch
            {
                Instant instant => instant.Plus(Duration.FromMilliseconds(1)),
                _ => null,
            };
        }

        private static string FormatStart(Instant start)
        {
            return start.ToString(JsDateFormat, null);
        }

        private static string FormatEnd(Instant end)
        {
            return end.PlusTicks(-1).ToString(JsDateFormat, null);
        }

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
                    x => (string)x.Name.Value,
                    x => x.Value switch
                    {
                        GraphQLStringValue s => (string)s.Value,
                        _ => throw new FormatException(),
                    });

                if (entries == null || !ContainsStartAndEnd(entries))
                {
                    return ThrowLiteralConversionError(value);
                }

                var start = GetStartInstant(entries["start"]);
                var end = GetEndInstant(entries["end"]);

                return new Interval(start, end);
            }

            return ThrowLiteralConversionError(value);
        }

        public override object? ParseValue(object? value)
        {
            return value switch
            {
                null => null,
                IDictionary<string, object> dict when ContainsStartAndEnd(dict) =>
                    new Interval(GetStartInstant(dict["start"]), GetEndInstant(dict["end"]?.ToString())),
                _ => ThrowValueConversionError(value),
            };
        }

        public override object? Serialize(object? value)
        {
            return value switch
            {
                null => null,
                Interval interval =>
                    new { start = FormatStart(interval.Start), end = FormatEnd(interval.End) },
                _ => ThrowSerializationError(value),
            };
        }

        public override GraphQLValue ToAST(object? value)
        {
            return value switch
            {
                null => new GraphQLNullValue(),
                Interval interval => new GraphQLObjectValue
                {
                    Fields = new List<GraphQLObjectField>
                    {
                        new GraphQLObjectField
                        {
                            Name = new GraphQLName("start"),
                            Value = new GraphQLStringValue(FormatStart(interval.Start)),
                        },
                        new GraphQLObjectField
                        {
                            Name = new GraphQLName("end"),
                            Value = new GraphQLStringValue(FormatEnd(interval.End)),
                        },
                    },
                },
                _ => ThrowASTConversionError(value),
            };
        }
    }
}
