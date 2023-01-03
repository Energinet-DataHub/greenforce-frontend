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
  Component,
  ElementRef,
  ViewChild,
  Renderer2,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LetModule, PushModule } from '@rx-angular/template';

import { DhSelectedActorStore, Actor } from './dh-selected-actor.store';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dh-selected-actor',
  styleUrls: ['./dh-selected-actor.component.scss'],
  templateUrl: './dh-selected-actor.component.html',
  standalone: true,
  imports: [
    CommonModule,
    LetModule,
    PushModule,
    MatIconModule,
  ],
})
export class DhSelectedActorComponent {
  actorGroups$ = this.store.actorGroups$;
  selectedActor$ = this.store.selectedActor$;
  isLoading$ = this.store.isLoading$;

  @ViewChild('dropup') dropupRef!: ElementRef;
  @ViewChild('dropupButton') dropupButtonRef!: ElementRef;

  constructor(
    private store: DhSelectedActorStore,
    private renderer: Renderer2
  ) {
    this.store.init();
  }

  @HostListener('document:click', ['$event']) onDocumentClick() {
    const dropup = this.dropupRef.nativeElement as HTMLElement;
    this.renderer.setStyle(dropup, 'display', 'none');
  }

  selectActor = (actor: Actor) => this.store.setSelectedActor(actor.id);

  onClick = (event: Event) => {
    // don't propagate as host listener will close the popup immediately
    event.stopImmediatePropagation();

    const dropup = this.dropupRef.nativeElement as HTMLElement;
    const dropupButton = this.dropupButtonRef.nativeElement as HTMLElement;

    const buttonBounds = dropupButton.getBoundingClientRect();

    this.renderer.setStyle(dropup, 'display', 'block');
    this.renderer.setStyle(dropup, 'left', `${buttonBounds.left}px`);

    const dropupBounds = dropup.getBoundingClientRect();
    this.renderer.setStyle(
      dropup,
      'top',
      `${buttonBounds.top - dropupBounds.height - 8}px`
    );
  };
}
