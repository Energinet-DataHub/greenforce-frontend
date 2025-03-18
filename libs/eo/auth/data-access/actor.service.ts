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
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Actor } from '@energinet-datahub/eo/auth/domain';
import { EoAuthService } from './auth.service';
import { WindowService } from '@energinet-datahub/gf/util-browser';

@Injectable({
  providedIn: 'root',
})
export class EoActorService {
  actor = signal<Actor | null>(null);
  actors = signal<Actor[]>([]);
  isSelf = computed(() => this.actor()?.org_id === this.self.org_id);
  private authService = inject(EoAuthService);
  self: Actor = {
    tin: this.authService.user()?.profile.org_cvr as string,
    org_id: this.authService.user()?.profile.org_id as string,
    org_name: this.authService.user()?.profile.org_name as string,
  };
  private window = inject(WindowService).nativeWindow;
  private config = {
    key: 'actor',
  };

  constructor() {
    // If user is loaded, remove saved actor (new login)
    this.authService.addUserLoaded$.pipe(takeUntilDestroyed()).subscribe((user) => {
      if (!user) return;
      this.remoevSavedActor();
    });

    // If user is unloaded, remove saved actor (logout)
    this.authService.addUserUnloaded$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.remoevSavedActor();
    });

    // If any saved actor, set it as current actor
    this.setCurrentActor(this.getSavedActor());
  }

  setActors(actors: Actor[]) {
    this.actors.set(actors);
  }

  setCurrentActor(actor: Actor | null) {
    const currentActor = actor ?? this.self;
    this.actor.set(currentActor);
    this.saveActor(currentActor);
  }

  HasPOAOverCompany(tin: string): boolean {
    if (tin === this.self.tin) return false;
    return this.actors().find((actor) => actor.tin === tin) !== undefined;
  }

  private remoevSavedActor() {
    this.window?.sessionStorage.removeItem(this.config.key);
  }

  private getSavedActor(): Actor | null {
    const actor = this.window?.sessionStorage.getItem(this.config.key);
    return actor ? (JSON.parse(actor) as Actor) : null;
  }

  private saveActor(actor: Actor) {
    if (!actor) return;
    if (actor.org_id === this.getSavedActor()?.org_id) return;

    this.window?.sessionStorage.setItem(this.config.key, JSON.stringify(actor));
  }
}
