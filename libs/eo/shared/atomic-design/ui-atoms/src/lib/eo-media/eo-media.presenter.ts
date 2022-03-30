import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

interface EoMediaState {
  mediaMaxWidthPixels: number | null;
  mediaImageMaxWidthPixels: number | null;
}

@Injectable()
export class EoMediaPresenter extends ComponentStore<EoMediaState> {
  mediaImageMaxWidthPercentage$: Observable<number | null> = this.select(
    this.select((state) => state.mediaMaxWidthPixels),
    this.select((state) => state.mediaImageMaxWidthPixels),
    (mediaMaxWidthPixels, mediaImageMaxWidthPixels) => {
      if (mediaMaxWidthPixels === null || mediaImageMaxWidthPixels === null) {
        return null;
      }

      return (mediaImageMaxWidthPixels / mediaMaxWidthPixels) * 100;
    },
    {
      debounce: true,
    }
  );

  constructor() {
    super(initialState);
  }

  updateMediaMaxWidthPixels = this.updater<number | null>(
    (state, mediaMaxWidthPixels): EoMediaState => ({
      ...state,
      mediaMaxWidthPixels,
    })
  );

  updateMediaImageMaxWidthPixels = this.updater<number | null>(
    (state, mediaImageMaxWidthPixels): EoMediaState => ({
      ...state,
      mediaImageMaxWidthPixels,
    })
  );
}

const initialState: EoMediaState = {
  mediaMaxWidthPixels: null,
  mediaImageMaxWidthPixels: null,
};
