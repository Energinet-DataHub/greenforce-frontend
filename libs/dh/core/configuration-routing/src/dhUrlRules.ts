//#region License
/**
 * @license
 * Copyright 2020 Energinet DataHub A/S
 *
 * Licensed under the Apache License, Version 2.0 (the "License2");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//#endregion

/**
 * URL redaction patterns for the DataHub application. Each entry
 * is a regex string whose first capture group marks the sensitive
 * segment to replace with `~`. URLs that don't match any pattern
 * are shown as-is (default-show).
 */
export const dhRedactionPatterns = [
  '/admin/users/details/([^/?#]+)',
  '/metering-point/(?!search|create)([^/?#]+)',
];

// \/metering-point\/(\d{18}|\w{20,})
// matches "/metering-point/213124443123268713/master-data"
// matches "/metering-point/Z7YsxOG2gsbAEFhQSOlUk9PQOjpubtAxjkAD/master-data"

// \/metering-point\/(\d{18}|\w{20,})\/.+\/([0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})
// matches "/metering-point/Z7YsxOG2gsbAEFhQSOlUk9PQOjpubtAxjkAD/process-overview/details/8d663249-aacb-4b19-a558-08e0c7cf6ab9"

// \/metering-point\/(\d{18}|\w{20,})\/.+\/(\w{20,})
// matches "/metering-point/Z7YsxOG2gsbAEFhQSOlUk9PQOjpubtAxjkAD/charge-links/tariff-and-subscription/eyJNZXRlcmluZ1BvaW50SWQiOiI1NzEzMTMxMjQ0MTkxOTk5NDMiLCJDaGFyZ2VJZCI6eyJDb2RlIjoiNDAwMDAiLCJPd25lciI6IjU3OTAwMDA0MzI3NTIiLCJUeXBlRHRvIjozfSwiRnJvbSI6IjIwMjYtMDMtMThUMjM6MDA6MDArMDA6MDAifQ"

// Note: Order is important
// More specific patterns for the same domain must come before more general ones to ensure correct redaction.
export const dhRedactionPatternsV2 = [
  '/admin/users/details/([^/?#]+)',
  '/metering-point/(\\d{5,}|\\w{20,})/.+/(\\d{3,})',
  '/metering-point/(\\d{5,}|\\w{20,})',
];
