import { Directive, Input, NgModule, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { DhFeatureFlags } from './feature-flags';
import { DhFeatureFlagsService } from './feature-flags.service';

@Directive({ selector: '[dhFeatureFlag]' })
export class DhFeatureFlagDirective implements OnInit {
  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureFlagsService: DhFeatureFlagsService
  ) {}

  @Input() dhFeatureFlag: DhFeatureFlags;

  ngOnInit(): void {
    const isEnabled = this.featureFlagsService.isEnabled(this.dhFeatureFlag);

    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

@NgModule({
  declarations: [DhFeatureFlagDirective],
  exports: [DhFeatureFlagDirective],
})
export class DhFeatureFlagDirectiveModule {}
