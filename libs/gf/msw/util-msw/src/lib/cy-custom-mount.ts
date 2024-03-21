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
import { Type } from "@angular/core";
import { MountConfig, mount } from "cypress/angular";

declare const window: {
  serviceWorkerRegistration: Promise<unknown> | undefined;
} & Window;

export async function mountAfterMSW<T>(component: string | Type<T>, config?: MountConfig<T>) {
  await window.serviceWorkerRegistration?.then(() => {
    mount<T>(component, config);
  });
}
