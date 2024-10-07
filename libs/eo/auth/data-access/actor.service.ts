import { computed, inject, Injectable, signal } from '@angular/core';

import { Actor } from '@energinet-datahub/eo/auth/domain';
import { EoAuthService } from './auth.service';
import { WindowService } from '@energinet-datahub/gf/util-browser';

@Injectable({
  providedIn: 'root',
})
export class EoActorService {
  private authService = inject(EoAuthService);
  private window = inject(WindowService).nativeWindow;
  private config = {
    key: 'actor',
  }

  actor = signal<Actor | null>(null);
  actors = signal<Actor[]>([]);
  self: Actor = {
    tin: this.authService.user()?.profile.org_cvr as string,
    org_id: this.authService.user()?.profile.org_ids as string,
    org_name: this.authService.user()?.profile.org_name as string,
  };
  isSelf = computed(() => this.actor()?.org_id === this.self.org_id);

  constructor() {
    this.setCurrentActor(
      this.getSavedActor()
    );
  }

  setActors(actors: Actor[]) {
    this.actors.set([this.self, ...actors]);
  }

  setCurrentActor(actor: Actor | null) {
    const currentActor = actor ?? this.self;
    this.actor.set(currentActor);
    this.saveActor(currentActor);
  }

  private getSavedActor(): Actor | null {
    const actor = this.window?.sessionStorage.getItem(this.config.key);
    return actor ? JSON.parse(actor) as Actor : null;
  }

  private saveActor(actor: Actor) {
    if(!actor) return;
    if(actor.org_id === this.getSavedActor()?.org_id) return;

    this.window?.sessionStorage.setItem(this.config.key, JSON.stringify(actor));
  }
}
