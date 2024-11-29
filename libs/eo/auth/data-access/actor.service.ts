import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  };

  actor = signal<Actor | null>(null);
  actors = signal<Actor[]>([]);
  self: Actor = {
    tin: this.authService.user()?.profile.org_cvr as string,
    org_id: this.authService.user()?.profile.org_id as string,
    org_name: this.authService.user()?.profile.org_name as string,
  };
  isSelf = computed(() => this.actor()?.org_id === this.self.org_id);

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
