// Copyright 2021 Energinet DataHub A/S
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
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using System.Xml;
using System.Xml.Serialization;

namespace ENDK.DataHub.Common.Extensions
{
#pragma warning disable
    public static class Extensions
    {
        #region IEnummerable

        /// <summary>
        /// Break a list of items into chunks of a specific size
        /// </summary>
        public static IEnumerable<IEnumerable<T>> Chunk<T>(this IEnumerable<T> source, int chunksize)
        {
            while (source.Any())
            {
                yield return source.Take(chunksize);
                source = source.Skip(chunksize);
            }
        }





        #endregion


        private static readonly Dictionary<RuntimeTypeHandle, XmlSerializer> ms_serializers = new Dictionary<RuntimeTypeHandle, XmlSerializer>();              

        public static string ToXml<T>(this T obj)
             where T : new()
        {
            using (StringWriter stringWriter = new StringWriter(new StringBuilder()))
            {
                XmlSerializer xmlSerializer = new XmlSerializer(typeof(T));
                xmlSerializer.Serialize(stringWriter, obj);
                return stringWriter.ToString();
            }
        }


        /// <summary>
        ///   Serialize object to stream by <see cref = "XmlSerializer" />
        /// </summary>
        /// <typeparam name = "T"></typeparam>
        /// <param name = "value"></param>
        /// <param name = "stream"></param>
        public static void ToXml<T>(this T value, Stream stream, XmlAttributeOverrides overrides = null)
            where T : new()
        {
            var _serializer = GetXmlSerializer(typeof(T), overrides);
            _serializer.Serialize(stream, value);
        }

       
        /// <summary>
        ///   Deserialize object from stream
        /// </summary>
        /// <typeparam name = "T">Type of deserialized object</typeparam>
        /// <param name = "source">Xml source</param>
        /// <returns></returns>
        public static T FromXml<T>(this Stream source, XmlAttributeOverrides overrides = null)
            where T : new()
        {
            var _serializer = GetXmlSerializer(typeof(T), overrides);
            return (T)_serializer.Deserialize(source);
        }

        private static XmlSerializer GetXmlSerializer(Type type, XmlAttributeOverrides overrides = null)
        {
            XmlSerializer _serializer;
            if (!ms_serializers.TryGetValue(type.TypeHandle, out _serializer))
            {
                lock (ms_serializers)
                {
                    if (!ms_serializers.TryGetValue(type.TypeHandle, out _serializer))
                    {
                        _serializer = overrides == null ? new XmlSerializer(type) : new XmlSerializer(type, overrides);
                        ms_serializers.Add(type.TypeHandle, _serializer);
                    }
                }
            }
            return _serializer;
        }

        public static string SplitCamelCase(this string input)
        {
            return System.Text.RegularExpressions.Regex.Replace(input, "([A-Z])", " $1", System.Text.RegularExpressions.RegexOptions.Compiled).Trim();
        }

        public static string ReplaceFirst(this string text, string search, string replace)
        {
            int pos = text.IndexOf(search);
            if (pos < 0)
            {
                return text;
            }
            return text.Substring(0, pos) + replace + text.Substring(pos + search.Length);
        }

        public static string SplitAndGetSafe(this string src, char separator, int index)
        {
            string[] values = src.Split(new char[] { separator });
            if (index + 1 > values.Length)
                return "";

            return values[index];
        }

        /// <summary>
        /// Formats supported "yyyy-MM-dd" - "dd-MM-yyyy"
        /// </summary>
        /// <param name="dateStr"></param>
        /// <param name="dateTime"></param>
        /// <returns></returns>
        public static bool TryParseDateTimeFromDateString(this string dateStr, out DateTime dateTime)
        {
            if (!DateTime.TryParseExact(dateStr, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTime))
            {
                if (!DateTime.TryParseExact(dateStr, "dd-MM-yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out dateTime))
                {
                    return false;
                }
            }
            return true;
        }

        public static bool IsBase64String(this string s)
        {
            s = s.Trim();
            return (s.Length % 4 == 0) && Regex.IsMatch(s, @"^[a-zA-Z0-9\+/]*={0,3}$", RegexOptions.None);

        }


        public static string FormatAndIndentXml(this string inputXml)
        {
            try
            {
                XmlDocument document = new XmlDocument();
                document.Load(new StringReader(inputXml));

                StringBuilder builder = new StringBuilder();
                using (XmlTextWriter writer = new XmlTextWriter(new StringWriter(builder)))
                {
                    writer.Formatting = Formatting.Indented;
                    document.Save(writer);
                }
                return builder.ToString();
            }
            catch (Exception)
            {
                //by design
            }

            return inputXml;
        }

        public static bool EqualsIgnoreCase(this string sourceValue, string value)
        {
            return sourceValue.Equals(value, StringComparison.OrdinalIgnoreCase);
        }

        public static bool IsNumeric(this string theValue)
        {
            var removed = theValue.RemoveNonNumericCharacters();

            return removed == theValue;
        }

        public static string Right(this string s, int length)
        {
            length = Math.Max(length, 0);

            if (s.Length > length)
            {
                return s.Substring(s.Length - length, length);
            }
            else
            {
                return s;
            }
        }

        public static string RemoveRight(this string s, int length)
        {
            length = Math.Max(length, 0);

            if (s.Length > length)
            {
                return s.Remove(s.Length - length, length);
            }
            else
            {
                return s;
            }
        }

        public static string Left(this string s, int length)
        {
            length = Math.Max(length, 0);

            if (s.Length > length)
            {
                return s.Substring(0, length);
            }
            else
            {
                return s;
            }
        }

        public static string RemoveLeft(this string s, int length)
        {
            length = Math.Max(length, 0);

            if (s.Length > length)
            {
                return s.Remove(0, length);
            }
            else
            {
                return s;
            }
        }


        public static RegExMatch Match(this string value)
        {
            return new RegExMatch(value);
        }

        public class RegExMatch
        {
            protected string Value;
            public RegExMatch(string value)
            {
                Value = value;
            }

            public bool OneAlphaTwoDigits()
            {
                return Match(@"^[a-zA-Z][0-9][0-9]$", RegexOptions.IgnoreCase);
            }

            public bool Match(string pattern, RegexOptions ignoreCase)
            {
                Regex regex = new Regex(pattern, ignoreCase);
                return regex.IsMatch(Value);
            }
        }

        /// <summary>
        /// Removes non-numeric characters from a string.
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        /// <remarks></remarks>
        public static string RemoveNonNumericCharacters(this string value)
        {
            return System.Text.RegularExpressions.Regex.Replace(value, "[^0-9]", "");
        }

        public static string RemoveNonAlphaNumericCharacters(this string value)
        {
            return System.Text.RegularExpressions.Regex.Replace(value, "[^0-9|a-z|A-Z]", "");
        }

        public static string ReplaceDanishLettersWithAcronyms(this string value)
        {
            return value.Replace("æ", "ae").Replace("ø", "oe").Replace("å", "aa").Replace("Æ", "Ae").Replace("Ø", "Oe").Replace("å", "Aa");
        }

        public static string RemoveLineBreaks(this string value)
        {
            return value.Replace("\r", "").Replace("\n", "");
        }

        public static string RemoveTab(this string value)
        {
            return value.Replace("\t", "");
        }

        /// <summary>
        /// Removes non-numeric characters from a string.  An option is available to allow for a period in case this is used with 
        /// a money value or number that requires a decimal place.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="allowPeriod">If true, any periods will be left, if false, all periods will also be removed.</param>
        /// <returns></returns>
        /// <remarks></remarks>
        public static object RemoveNonNumericCharacters(this string value, bool allowPeriod)
        {
            if (allowPeriod == false)
            {
                return RemoveNonNumericCharacters(value);
            }
            else
            {
                return System.Text.RegularExpressions.Regex.Replace(value, "[^0-9|^.]", "");
            }
        }

        /// <summary>
        /// Removes non-numeric characters from a string.  An option is available to allow for a period and/or comma in case this is used with 
        /// a money value or number that requires a decimal place or a value that requires keeping it's formatting with commas and peroids only.
        /// </summary>
        /// <param name="value"></param>
        /// <param name="allowPeriod">If true, any periods will be left, if false, all periods will also be removed.</param>
        /// <param name="allowComma">If true, any commas will be left, if false, all commas will also be removed.</param>
        /// <returns></returns>
        /// <remarks></remarks>
        public static object RemoveNonNumericCharacters(this string value, bool allowPeriod, bool allowComma)
        {
            if (allowComma == true & allowPeriod == true)
            {
                return System.Text.RegularExpressions.Regex.Replace(value, "[^0-9|^.|^,]", "");
            }
            else if (allowPeriod == true & allowComma == false)
            {
                return RemoveNonNumericCharacters(value, true);
            }
            else if (allowComma == true & allowPeriod == false)
            {
                return System.Text.RegularExpressions.Regex.Replace(value, "[^0-9|^,]", "");
            }
            else
            {
                return RemoveNonNumericCharacters(value);
            }
        }

       
        public static string ToUpperIgnoreNull(this string value)
        {
            return value == null ? "" : value.ToUpper();
        }

        public static DateTime? ToFormattedDate(this string date, string format = "yyyy-MM-dd")
        {
            DateTime? formattedDate = null;
            if (!string.IsNullOrEmpty(date))
                formattedDate = DateTime.ParseExact(date, format, CultureInfo.InvariantCulture, DateTimeStyles.None);
            return formattedDate;
        }

    

        public static bool IsOrgId(this string src)
        {
            return src != null && src.IsNumeric() && src.Length == 13;
        }

        public static bool IsOrgIdAndRole(this string src)
        {
            if (src != null)
            {
                string[] orgAndRole = src.Split('-');
                if (orgAndRole != null && orgAndRole.Length == 2)
                    return orgAndRole[0].IsOrgId() && orgAndRole[1].Length == 3;

                return false;
            }
            return false;

        }

     
        #region DateTime

        public static string ToStringSafe(this DateTime? source)
        {
            return source.HasValue ? source.Value.ToString() : null;
        }

        public static string ToStringPresentation(this DateTime? value)
        {
            if (!value.HasValue)
                return "";
            return value.Value.ToStringPresentation();
        }

        public static string ToStringPresentation(this DateTime value)
        {
            return value.ToString("yyyy-MM-dd HH:mm:ss");
        }

     

        public static string ToStringTimeTag(this DateTime value)
        {
            return value.ToString("yyyy-MM-dd-HH-mm-ss.fff");
        }

    

        public static DateTime? ToDanishTimeFromUtc(this DateTime? value)
        {
            if (!value.HasValue)
                return value;
            return ToDanishTimeFromUtc(value.Value);
        }

        public static DateTime ToDanishTimeFromUtc(this DateTime value)
        {
            string zoneId = "Central European Standard Time";
            TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById(zoneId);
            DateTime utcDanishTime = TimeZoneInfo.ConvertTimeFromUtc(value, tzi);
            return utcDanishTime;
        }

        public static DateTime ToUtcFromDanishTime(this DateTime value)
        {
            TimeZoneInfo tzi = TimeZoneInfo.Local;
            DateTime utcTime = TimeZoneInfo.ConvertTimeToUtc(value, tzi);
            return utcTime;
        }

        public static string ToStringPresentationWithNullCheck(this DateTime? value)
        {
            return value.HasValue ? value.ToStringPresentation() : "";
        }

        public static string ToStringWithNullCheck(this DateTime? value)
        {
            return value.HasValue ? value.ToString() : "";
        }

        #endregion

     

    }
#pragma warning restore
}
