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
using HotChocolate.Language;
using HotChocolate.Types;
using NodaTime;
using NodaTime.Text;

namespace Energinet.DataHub.WebApi.GraphQL
{
    public sealed class DateRangeType : ScalarType<Interval, ObjectValueNode>
    {
        public DateRangeType()
            : base("DateRange")
        {
            Description = "Represents a date range";
        }

        public override IValueNode ParseResult(object? resultValue) =>
            resultValue switch {
                null => NullValueNode.Default,
                Interval interval => ParseValue(interval),
                _ => throw new FormatException(),
            };

        protected override Interval ParseLiteral(ObjectValueNode valueSyntax)
        {
            var entries = valueSyntax.Fields?.ToDictionary(
                x => x.Name.Value,
                x => x.Value switch
                {
                    StringValueNode s => s.Value,
                    _ => throw new FormatException(),
                });

            if (entries == null || !ContainsStartAndEnd(entries))
            {
                throw new FormatException();
            }

            var start = GetStartInstant(entries["start"]);
            var end = GetEndInstant(entries["end"]);

            return new Interval(start, end);
        }

        protected override ObjectValueNode ParseValue(Interval runtimeValue) =>
            new(new List<ObjectFieldNode>
            {
                new ObjectFieldNode("start", new StringValueNode(FormatStart(runtimeValue.Start))),
                new ObjectFieldNode("end", new StringValueNode(FormatEnd(runtimeValue.End))),
            });

        private const string JsDateFormat = "yyyy-MM-ddTHH:mm:ss.fff'Z'";

        private static Instant? Parse(object? value) =>
            value switch
            {
                string s when s == string.Empty => null,
                string s => InstantPattern.ExtendedIso.Parse(s) switch
                {
                    { Success: true } result => result.Value,
                    _ => throw new FormatException(),
                },
                _ => throw new FormatException(),
            };

        private static bool ContainsStartAndEnd<T>(IDictionary<string, T> dict) =>
            dict.Count == 2 && dict.ContainsKey("start") && dict.ContainsKey("end");

        private static Instant? GetStartInstant(object? start) =>
            Parse(start);

        private static Instant? GetEndInstant(object? end) =>
            Parse(end) switch
            {
                Instant instant => instant.Plus(Duration.FromMilliseconds(1)),
                _ => null,
            };

        private static string FormatStart(Instant start) =>
            start.ToString(JsDateFormat, null);

        private static string FormatEnd(Instant end) =>
            end.PlusTicks(-1).ToString(JsDateFormat, null);
    }
}
