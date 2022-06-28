import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  NgModule,
} from '@angular/core';
import {
  allowedFeatureFlags,
  FeatureFlagService,
} from './feature-flag.service';

@Directive({
  selector: '[onFeatureFlag]',
})
/**
 * This directive can be used to show/hide a component based on the feature flags that are currently enabled.
 * @example
 * <div [onFeatureFlag]="'winter'">Test</div>
 */
export class EoFeatureFlagDirective implements AfterViewInit {
  /**
   * This directive can be used to show/hide a component based on the feature flags that are currently enabled.
   * Look in Feature-flag service for list of currently supported flags.
   */
  @Input() onFeatureFlag: allowedFeatureFlags | undefined;

  constructor(
    private elementRef: ElementRef,
    private featureFlagService: FeatureFlagService
  ) {
    this.elementRef.nativeElement.style.display = 'none';
  }

  ngAfterViewInit() {
    if (
      this.onFeatureFlag &&
      this.featureFlagService.isFlagEnabled(this.onFeatureFlag)
    ) {
      this.elementRef.nativeElement.style.display = 'block';
    }
  }
}

@NgModule({
  declarations: [EoFeatureFlagDirective],
  exports: [EoFeatureFlagDirective],
})
export class EoFeatureFlagScam {}
