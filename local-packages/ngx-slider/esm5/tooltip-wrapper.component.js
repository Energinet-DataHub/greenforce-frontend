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
var TooltipWrapperComponent = /** @class */ (function () {
    function TooltipWrapperComponent() {
    }
    TooltipWrapperComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-slider-tooltip-wrapper',
                    template: "<ng-container *ngIf=\"template\">\n  <ng-template *ngTemplateOutlet=\"template; context: {tooltip: tooltip, placement: placement, content: content}\"></ng-template>\n</ng-container>\n\n<ng-container *ngIf=\"!template\">\n  <div class=\"ngx-slider-inner-tooltip\" [attr.title]=\"tooltip\" [attr.data-tooltip-placement]=\"placement\">\n    {{content}}\n  </div>\n</ng-container>",
                    styles: [".ngx-slider-inner-tooltip{height:100%}"]
                },] },
    ];
    TooltipWrapperComponent.propDecorators = {
        template: [{ type: Input }],
        tooltip: [{ type: Input }],
        placement: [{ type: Input }],
        content: [{ type: Input }]
    };
    return TooltipWrapperComponent;
}());
export { TooltipWrapperComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC13cmFwcGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyLyIsInNvdXJjZXMiOlsidG9vbHRpcC13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7OztnQkFFN0QsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSw0QkFBNEI7b0JBQ3RDLFFBQVEsRUFBRSwwWEFRSTtvQkFDZCxNQUFNLEVBQUUsQ0FBQyx3Q0FBd0MsQ0FBQztpQkFDbkQ7OzsyQkFFRSxLQUFLOzBCQUdMLEtBQUs7NEJBR0wsS0FBSzswQkFHTCxLQUFLOztrQ0F6QlI7O1NBZWEsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LXNsaWRlci10b29sdGlwLXdyYXBwZXInLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciAqbmdJZj1cInRlbXBsYXRlXCI+XHJcbiAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGU7IGNvbnRleHQ6IHt0b29sdGlwOiB0b29sdGlwLCBwbGFjZW1lbnQ6IHBsYWNlbWVudCwgY29udGVudDogY29udGVudH1cIj48L25nLXRlbXBsYXRlPlxyXG48L25nLWNvbnRhaW5lcj5cclxuXHJcbjxuZy1jb250YWluZXIgKm5nSWY9XCIhdGVtcGxhdGVcIj5cclxuICA8ZGl2IGNsYXNzPVwibmd4LXNsaWRlci1pbm5lci10b29sdGlwXCIgW2F0dHIudGl0bGVdPVwidG9vbHRpcFwiIFthdHRyLmRhdGEtdG9vbHRpcC1wbGFjZW1lbnRdPVwicGxhY2VtZW50XCI+XHJcbiAgICB7e2NvbnRlbnR9fVxyXG4gIDwvZGl2PlxyXG48L25nLWNvbnRhaW5lcj5gLFxyXG4gIHN0eWxlczogW2Aubmd4LXNsaWRlci1pbm5lci10b29sdGlwe2hlaWdodDoxMDAlfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUb29sdGlwV3JhcHBlckNvbXBvbmVudCB7XHJcbiAgQElucHV0KClcclxuICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGxhY2VtZW50OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29udGVudDogc3RyaW5nO1xyXG59XHJcbiJdfQ==