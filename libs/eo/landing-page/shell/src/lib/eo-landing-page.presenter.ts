import { Injectable } from '@angular/core';

const wattScreenMediumMinWidthPixels = 960;

@Injectable()
export class EoLandingPagePresenter {
  contentMaxWidthPixels = wattScreenMediumMinWidthPixels;
}
