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
/* eslint-disable @angular-eslint/no-host-metadata-property */
import { AriaDescriber, FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import {
  Overlay,
  ScrollDispatcher,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  Inject,
  Input,
  NgZone,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import {
  MatTooltip,
  MatTooltipDefaultOptions,
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  TooltipPosition,
} from '@angular/material/tooltip';

export type wattTooltipPosition = TooltipPosition;

@Directive({
  selector: '[wattTooltip]',
  exportAs: 'wattTooltip',
})
export class WattTooltipDirective extends MatTooltip {
  constructor(
    overlay: Overlay,
    elementRef: ElementRef<HTMLElement>,
    scrollDispatcher: ScrollDispatcher,
    viewContainerRef: ViewContainerRef,
    ngZone: NgZone,
    platform: Platform,
    ariaDescriber: AriaDescriber,
    focusMonitor: FocusMonitor,
    @Inject(MAT_TOOLTIP_SCROLL_STRATEGY) scrollStrategy: () => ScrollStrategy,
    @Optional() dir: Directionality,
    @Optional()
    @Inject(MAT_TOOLTIP_DEFAULT_OPTIONS)
    defaultOptions: MatTooltipDefaultOptions,
    @Inject(DOCUMENT) _document: Document
  ) {
    super(
      overlay,
      elementRef,
      scrollDispatcher,
      viewContainerRef,
      ngZone,
      platform,
      ariaDescriber,
      focusMonitor,
      scrollStrategy,
      dir,
      defaultOptions,
      _document
    );

    super.position = 'above';
  }

  @Input('wattTooltip')
  get message(): string {
    return super.message;
  }
  set message(value: string) {
    super.message = value;
  }

  @Input('wattTooltipPosition')
  get position(): wattTooltipPosition {
    return super.position;
  }
  set position(value: wattTooltipPosition) {
    super.position = value;
  }
}
