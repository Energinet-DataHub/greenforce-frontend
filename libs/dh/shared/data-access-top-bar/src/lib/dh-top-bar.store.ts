import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComponentStore } from '@ngrx/component-store';

import { mapToTitleTranslationKey } from './map-to-title-translation-key.operator';
import { defaultTitleTranslationKey } from './default-title-translation-key';

interface DhTopBarState {
  readonly titleTranslationKey: string;
}

const initialState: DhTopBarState = {
  titleTranslationKey: defaultTitleTranslationKey,
};

@Injectable({
  providedIn: 'root',
})
export class DhTopBarStore extends ComponentStore<DhTopBarState> {
  titleTranslationKey$: Observable<string> = this.select((state) => state.titleTranslationKey);

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super(initialState);

    this.updateTitleTranslationKey(
      this.router.events.pipe(mapToTitleTranslationKey(this.activatedRoute))
    );
  }

  private updateTitleTranslationKey = this.updater<string>(
    (state, titleTranslationKey): DhTopBarState => ({
      ...state,
      titleTranslationKey,
    })
  );
}
