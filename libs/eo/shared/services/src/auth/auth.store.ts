import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

interface AuthState {
  loginToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class EoAuthStore extends ComponentStore<AuthState> {
  constructor() {
    super({ loginToken: '' });
  }

  readonly loginToken$ = this.select((state) => state.loginToken);
  readonly setLoginToken = this.updater(
    (state, loginToken: string): AuthState => ({ ...state, loginToken })
  );
}
