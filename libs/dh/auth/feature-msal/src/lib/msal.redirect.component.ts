/**
 * @license
 * Copyright 2021 Energinet DataHub A/S
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
/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * This is a dedicated redirect component to be added to Angular apps to
 * handle redirects when using @azure/msal-angular.
 * Import this component to use redirects in your app.
 */

import { Component, OnInit } from '@angular/core';
import { MsalService } from './msal.service';

@Component({
  selector: 'dh-app-redirect',
  template: '',
})
export class MsalRedirectComponent implements OnInit {
  constructor(private authService: MsalService) {}

  ngOnInit(): void {
    this.authService.getLogger().verbose('MsalRedirectComponent activated');
    this.authService.handleRedirectObservable().subscribe();
  }
}
