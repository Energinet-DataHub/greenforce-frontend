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
  Input,
  TemplateRef,
  ViewContainerRef,
  inject,
  effect,
  OnDestroy,
  computed,
  signal,
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
 * ```
 */
@Directive({
  selector: '[dhReleaseToggle]',
  standalone: true,
})
export class DhReleaseToggleDirective implements OnDestroy {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly releaseToggleService = inject(DhReleaseToggleService);

  private readonly toggleExpression = signal<ToggleExpression>('');
  private embeddedViewRef: EmbeddedViewRef<unknown> | null = null;

  /**
   * Sets the toggle expression to evaluate.
   * @param expression - Single toggle name, array of toggle names, or inverse toggle (prefixed with '!')
   */
  @Input()
  set dhReleaseToggle(expression: ToggleExpression) {
    this.toggleExpression.set(expression);
  }

  /**
   * Computed signal that evaluates the toggle expression.
   */
  private readonly shouldShowContent = computed((): boolean => {
    const expression = this.toggleExpression();
    return this.evaluateToggleExpression(expression);
  });

  /**
   * Effect that updates the view when shouldShowContent changes.
   */
  private readonly viewUpdateEffect = effect(() => {
    const shouldShow = this.shouldShowContent();
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
      return this.releaseToggleService.hasAllEnabled(expression);
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
    if (shouldShow && !this.embeddedViewRef) {
      this.showView();
    } else if (!shouldShow && this.embeddedViewRef) {
      this.hideView();
    }
  }

  /**
   * Creates and shows the embedded view.
   */
  private showView(): void {
    this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
  }

  /**
   * Clears and hides the embedded view.
   */
  private hideView(): void {
    this.viewContainer.clear();
    this.embeddedViewRef = null;
  }

  /**
   * Cleanup when directive is destroyed.
   */
  ngOnDestroy(): void {
    this.viewUpdateEffect.destroy();
  }
}
