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
import { ActivationEnd, Event } from '@angular/router';
import { filter, map, pipe } from 'rxjs';

const filterActivationEnd = pipe(
  filter((event: Event) => event instanceof ActivationEnd),
  map((event) => event as ActivationEnd)
);

const mapToRouteData = pipe(map((event: ActivationEnd) => event.snapshot.data));

export const mapToRouteTitle = pipe(
  filterActivationEnd,
  mapToRouteData,
  map((data) => data.title as string | undefined),
  filter((title) => title !== undefined),
  map((title) => title as string)
);
