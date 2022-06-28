import { Directive, Input, NgModule, TemplateRef, ViewContainerRef } from '@angular/core';

import { DhFeatureFlags } from './feature-flags';
import { DhFeatureFlagsService } from './feature-flags.service';

@Directive({ selector: '[dhFeatureFlag]' })
export class DhFeatureFlagDirective {
  private isViewCreated  = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private featureFlagsService: DhFeatureFlagsService
  ) {}

  @Input() set dhFeatureFlag(featureFlagName: DhFeatureFlags) {
    const isEnabled = this.featureFlagsService.isEnabled(featureFlagName);

    if (isEnabled && !this.isViewCreated ) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isViewCreated  = true;
    } else if (!isEnabled && this.isViewCreated ) {
      this.viewContainer.clear();
      this.isViewCreated  = false;
    }
  }
}

@NgModule({
  declarations: [DhFeatureFlagDirective],
  exports: [DhFeatureFlagDirective],
})
export class DhFeatureFlagDirectiveModule {}
