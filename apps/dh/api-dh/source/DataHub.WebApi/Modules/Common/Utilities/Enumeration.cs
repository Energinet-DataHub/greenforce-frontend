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

using System.Runtime.CompilerServices;
using HotChocolate.Types.Descriptors;

namespace Energinet.DataHub.WebApi.Modules.Common.Utilities;

/// <summary>
/// A base class for smart enumerations designed for use with Hot Chocolate GraphQL.
/// </summary>
public abstract record Enumeration<TEnum>
{
    /// <summary>
    /// Gets the name of this enumeration value, typically matching the static field name.
    /// This is used for case-insensitive matching when converting from other enum types.
    /// </summary>
    public string Name { get; }

    /// <summary>
    /// Gets or sets an optional custom GraphQL name for this enumeration value.
    /// When set, this value is used instead of the auto-generated name in GraphQL schemas.
    /// </summary>
    public virtual string? GraphQLName { get; init; }

    /// <summary>
    /// Returns the GraphQL representation of this enumeration value.
    /// Uses GraphQLName if set, otherwise converts Name using Hot Chocolate default naming conventions.
    /// </summary>
    public sealed override string ToString() => GraphQLName ?? NamingConvention.GetEnumValueName(Name);

    /// <summary>
    /// Converts this enumeration value to the specified enum type by matching the Name property.
    /// </summary>
    /// <returns>The matching enum value from the target type.</returns>
    /// <exception cref="ArgumentException">Thrown when no matching value is found in the target enum type.</exception>
    public object Cast(Type enumType) => Enum.Parse(enumType, Name, true);

    /// <summary>
    /// Converts this enumeration value to the specified enum type by matching the Name property.
    /// </summary>
    /// <returns>The matching enum value from the target type.</returns>
    /// <exception cref="ArgumentException">Thrown when no matching value is found in the target enum type.</exception>
    public T Cast<T>()
        where T : Enum => (T)Enum.Parse(typeof(T), Name, true);

    /// <summary>
    /// Finds and returns the enumeration value that matches the given source value by name (case-insensitive).
    /// Typically used to convert from external enum types to this enumeration type.
    /// </summary>
    /// <returns>The matching enumeration value.</returns>
    /// <exception cref="InvalidOperationException">Thrown when no matching enumeration value is found.</exception>
    public static TEnum FromName(object source) => Options
        .Where(o => o.Name.Equals(source.ToString(), StringComparison.OrdinalIgnoreCase))
        .OfType<TEnum>()
        .First();

    /// <summary>
    /// Returns a list of all defined enumeration values for this type.
    /// </summary>
    /// <returns>A list containing all enumeration values.</returns>
    public static List<TEnum> GetAll() => [.. Options.OfType<TEnum>()];

    private static readonly DefaultNamingConventions NamingConvention = new();

    private static readonly Lock Lock = new();

    private static readonly List<Enumeration<TEnum>> Options = [];

    static Enumeration()
    {
        // Ensure `_options` is populated before accessing static fields
        RuntimeHelpers.RunClassConstructor(typeof(TEnum).TypeHandle);
    }

    /// <summary>
    /// Initializes a new enumeration value with the specified name.
    /// </summary>
    protected Enumeration(string name)
    {
        Name = name;

        lock (Lock)
        {
            Options.Add(this);
        }
    }
}
