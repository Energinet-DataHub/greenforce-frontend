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
import { effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { dayjs } from '@energinet-datahub/watt/date';

export function persistDateFilter() {
  const router = inject(Router);
  const route = inject(ActivatedRoute);
  const filter = dayjs(route.snapshot.queryParams.filter);
  const date = signal(filter.isValid() ? filter : dayjs());

  effect(() => {
    router.navigate([], {
      replaceUrl: true,
      relativeTo: route,
      queryParams: { filter: date().format('YYYY-MM-DD') },
      queryParamsHandling: 'merge',
    });
  });

  return date;
}
