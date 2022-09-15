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
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, TemplateRef } from '@angular/core';
export class TooltipWrapperComponent {
}
TooltipWrapperComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-slider-tooltip-wrapper',
                template: `<ng-container *ngIf="template">
  <ng-template *ngTemplateOutlet="template; context: {tooltip: tooltip, placement: placement, content: content}"></ng-template>
</ng-container>

<ng-container *ngIf="!template">
  <div class="ngx-slider-inner-tooltip" [attr.title]="tooltip" [attr.data-tooltip-placement]="placement">
    {{content}}
  </div>
</ng-container>`,
                styles: [`.ngx-slider-inner-tooltip{height:100%}`]
            },] },
];
TooltipWrapperComponent.propDecorators = {
    template: [{ type: Input }],
    tooltip: [{ type: Input }],
    placement: [{ type: Input }],
    content: [{ type: Input }]
};
if (false) {
    /** @type {?} */
    TooltipWrapperComponent.prototype.template;
    /** @type {?} */
    TooltipWrapperComponent.prototype.tooltip;
    /** @type {?} */
    TooltipWrapperComponent.prototype.placement;
    /** @type {?} */
    TooltipWrapperComponent.prototype.content;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC13cmFwcGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyLyIsInNvdXJjZXMiOlsidG9vbHRpcC13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBZTlELE1BQU07OztZQWJMLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QyxRQUFRLEVBQUU7Ozs7Ozs7O2dCQVFJO2dCQUNkLE1BQU0sRUFBRSxDQUFDLHdDQUF3QyxDQUFDO2FBQ25EOzs7dUJBRUUsS0FBSztzQkFHTCxLQUFLO3dCQUdMLEtBQUs7c0JBR0wsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1zbGlkZXItdG9vbHRpcC13cmFwcGVyJyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgKm5nSWY9XCJ0ZW1wbGF0ZVwiPlxyXG4gIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlOyBjb250ZXh0OiB7dG9vbHRpcDogdG9vbHRpcCwgcGxhY2VtZW50OiBwbGFjZW1lbnQsIGNvbnRlbnQ6IGNvbnRlbnR9XCI+PC9uZy10ZW1wbGF0ZT5cclxuPC9uZy1jb250YWluZXI+XHJcblxyXG48bmctY29udGFpbmVyICpuZ0lmPVwiIXRlbXBsYXRlXCI+XHJcbiAgPGRpdiBjbGFzcz1cIm5neC1zbGlkZXItaW5uZXItdG9vbHRpcFwiIFthdHRyLnRpdGxlXT1cInRvb2x0aXBcIiBbYXR0ci5kYXRhLXRvb2x0aXAtcGxhY2VtZW50XT1cInBsYWNlbWVudFwiPlxyXG4gICAge3tjb250ZW50fX1cclxuICA8L2Rpdj5cclxuPC9uZy1jb250YWluZXI+YCxcclxuICBzdHlsZXM6IFtgLm5neC1zbGlkZXItaW5uZXItdG9vbHRpcHtoZWlnaHQ6MTAwJX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcFdyYXBwZXJDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpXHJcbiAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNvbnRlbnQ6IHN0cmluZztcclxufVxyXG4iXX0=