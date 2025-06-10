//#region License
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
//#endregion
import {
  Directive,
  input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  OnDestroy,
  EmbeddedViewRef,
} from '@angular/core';
import { DhReleaseToggleService } from './dh-release-toggle.service';

export type ToggleExpression = string | string[];

/**
 * Structural directive that conditionally displays content based on release toggle states.
 *
 * @example
 * ```html
 * <!-- Single toggle -->
 * <div *dhReleaseToggle="'feature-name'">Content</div>
 *
 * <!-- Multiple toggles (AND logic) -->
 * <div *dhReleaseToggle="['feature-a', 'feature-b']">Content</div>
 *
 * <!-- Inverse toggle -->
 * <div *dhReleaseToggle="'!feature-name'">Content</div>
 *
 * <!-- With else template -->
 * <div *dhReleaseToggle="'feature-name'; else fallback">New content</div>
 * <ng-template #fallback>Fallback content</ng-template>
 * ```
 */
@Directive({
  selector: '[dhReleaseToggle]',
})
export class DhReleaseToggleDirective implements OnDestroy {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly releaseToggleService = inject(DhReleaseToggleService);

  /**
   * The toggle expression to evaluate.
   * Single toggle name, array of toggle names, or inverse toggle (prefixed with '!')
   */
  dhReleaseToggle = input<ToggleExpression>('');

  /**
   * The template to show when the toggle condition is false.
   */
  dhReleaseToggleElse = input<TemplateRef<unknown> | null>(null);

  /**
   * Effect that evaluates the toggle expression and updates the view accordingly.
   */
  private readonly viewUpdateEffect = effect(() => {
    // Explicitly track changes to toggles to ensure reactivity
    this.releaseToggleService.toggles();

    const expression = this.dhReleaseToggle();
    const shouldShow = this.evaluateToggleExpression(expression);
    this.updateViewVisibility(shouldShow);
  });

  /**
   * Evaluates the toggle expression to determine if content should be shown.
   */
  private evaluateToggleExpression(expression: ToggleExpression): boolean {
    if (!expression) {
      return false;
    }

    if (Array.isArray(expression)) {
      return this.releaseToggleService.areAllEnabled(expression);
    }

    return this.evaluateSingleToggle(expression);
  }

  /**
   * Evaluates a single toggle expression, handling inverse toggles.
   */
  private evaluateSingleToggle(toggleName: string): boolean {
    if (toggleName.startsWith('!')) {
      const actualToggleName = toggleName.substring(1);
      return !this.releaseToggleService.isEnabled(actualToggleName);
    }

    return this.releaseToggleService.isEnabled(toggleName);
  }

  /**
   * Updates the view visibility based on the shouldShow flag.
   */
  private updateViewVisibility(shouldShow: boolean): void {
    if (shouldShow) {
      this.showMainView();
    } else {
      this.showFallbackView();
    }
  }

  /**
   * Shows the main template and hides the else template.
   */
  private showMainView(): void {
    // Clear any existing views
    this.clearViews();

    // Show main template
    this.viewContainer.createEmbeddedView(this.templateRef);
  }

  /**
   * Shows the else template (if provided) and hides the main template.
   */
  private showFallbackView(): void {
    // Clear any existing views
    this.clearViews();

    // Show else template if provided
    const fallbackTemplate = this.dhReleaseToggleElse();
    if (fallbackTemplate) {
      this.viewContainer.createEmbeddedView(fallbackTemplate);
    }
  }

  /**
   * Clears all embedded views.
   */
  private clearViews(): void {
    this.viewContainer.clear();
  }

  /**
   * Cleanup when directive is destroyed.
   */
  ngOnDestroy(): void {
    this.clearViews();
  }
}
