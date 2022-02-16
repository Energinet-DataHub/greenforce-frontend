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
import {
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  Type,
} from '@angular/core';

import { environment } from '@energinet-datahub/dh/shared/environments';
import { RestHandler } from 'msw';
import { MSWService } from './msw.service';

export const INITIAL_MOCKS = new InjectionToken('MSW Initial Mocks');
export const FEATURE_MOCKS = new InjectionToken('MSW Feature Mocks');

@NgModule({
  providers: [MSWService],
})
export class MSWRootModule {
  constructor(
    private _MSWService: MSWService, // This instantiates the service
    @Optional()
    @SkipSelf()
    maybeNgModuleFromParentInjector?: MSWRootModule
  ) {
    if (maybeNgModuleFromParentInjector) {
      throw new Error(
        'DhApiRootModule.forRoot registered in multiple injectors. Only call it from the core shell module or in the Angular testing module.'
      );
    }
  }
}

@NgModule({})
export class MSWFeatureModule {
  constructor(
    @Inject(FEATURE_MOCKS) featureMocks: () => Promise<RestHandler[]>,
    msw: MSWService
  ) {
    console.log('FEATURE MODULE');
    msw.addMocks(featureMocks);
  }
}

@NgModule({})
export class MSWModule {
  static forRoot(
    mocks?: () => Promise<RestHandler[]>
  ): ModuleWithProviders<MSWRootModule> {
    return {
      ngModule: !environment.production
        ? MSWRootModule
        : ([] as unknown as Type<MSWRootModule>),
      providers: [
        {
          provide: INITIAL_MOCKS,
          useValue: mocks,
        },
      ],
    };
  }

  static forFeature(
    mocks: () => Promise<RestHandler[]>
  ): ModuleWithProviders<MSWFeatureModule> {
    console.log('FOR FEATURE');
    return {
      ngModule: !environment.production
        ? MSWFeatureModule
        : ([] as unknown as Type<MSWFeatureModule>),
      providers: [
        {
          provide: FEATURE_MOCKS,
          useValue: mocks,
        },
      ],
    };
  }
}
