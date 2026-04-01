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
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { WorkflowAction } from '@energinet-datahub/dh/shared/domain/graphql';
import {
  BasePaths,
  getPath,
  MeteringPointSubPaths,
} from '@energinet-datahub/dh/core/configuration-routing';

import type { ActionHandlerMap } from '../registry';

@Injectable({ providedIn: 'root' })
export class CustomerMoveInActions {
  private readonly router = inject(Router);

  readonly handlers: ActionHandlerMap = {
    [WorkflowAction.SendInformation]: {
      callback: (ctx) =>
        this.router.navigate([
          getPath<BasePaths>('metering-point'),
          'view',
          getPath<MeteringPointSubPaths>('update-customer-details'),
          ctx.processId,
        ]),
    },
  };
}
