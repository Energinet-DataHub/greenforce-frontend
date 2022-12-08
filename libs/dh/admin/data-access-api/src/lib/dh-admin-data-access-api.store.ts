import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

// Note: Remove the comment on the next line once the interface has properties
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DhAdminState {}

const initialState: DhAdminState = {};

@Injectable()
export class DhAdminDataAccessApiStore extends ComponentStore<DhAdminState> {
  constructor() {
    super(initialState);
  }
}
