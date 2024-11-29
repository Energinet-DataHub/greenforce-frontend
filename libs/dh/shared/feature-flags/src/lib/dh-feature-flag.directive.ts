import { Directive, OnInit, TemplateRef, ViewContainerRef, inject, input } from '@angular/core';

import { DhFeatureFlags } from './dh-feature-flags';
import { DhFeatureFlagsService } from './dh-feature-flags.service';

@Directive({ selector: '[dhFeatureFlag]', standalone: true })
export class DhFeatureFlagDirective implements OnInit {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private featureFlagsService = inject(DhFeatureFlagsService);

  dhFeatureFlag = input<DhFeatureFlags>();

  ngOnInit(): void {
    const isEnabled = this.featureFlagsService.isEnabled(this.dhFeatureFlag());

    if (isEnabled) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}
