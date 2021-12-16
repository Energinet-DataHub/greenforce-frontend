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

import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { MSAL_INSTANCE } from "./msal-constants";
import { EventMessage, EventMessageUtils, IPublicClientApplication, InteractionStatus } from "@azure/msal-browser";
import { MsalService } from "./msal.service";

@Injectable()
export class MsalBroadcastService {
    private _msalSubject: Subject<EventMessage>;
    public msalSubject$: Observable<EventMessage>;
    private _inProgress: BehaviorSubject<InteractionStatus>;
    public inProgress$: Observable<InteractionStatus>;

    constructor(
        @Inject(MSAL_INSTANCE) private msalInstance: IPublicClientApplication,
        private authService: MsalService
    ) {
        this._msalSubject = new Subject<EventMessage>();
        this.msalSubject$  = this._msalSubject.asObservable();

        // InProgress as BehaviorSubject so most recent inProgress state will be available upon subscription
        this._inProgress = new BehaviorSubject<InteractionStatus>(InteractionStatus.Startup);
        this.inProgress$ = this._inProgress.asObservable();

        this.msalInstance.addEventCallback((message: EventMessage) => {
            this._msalSubject.next(message);
            const status = EventMessageUtils.getInteractionStatusFromEvent(message, this._inProgress.value);
            if (status !== null) {
                this.authService.getLogger().verbose(`BroadcastService - ${message.eventType} results in setting inProgress from ${this._inProgress.value} to ${status}`);
                this._inProgress.next(status);
            }
        });
    }
}
