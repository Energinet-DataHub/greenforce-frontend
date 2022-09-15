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
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Renderer2, HostBinding, ChangeDetectorRef } from '@angular/core';
import { SliderElementDirective } from './slider-element.directive';
var SliderHandleDirective = /** @class */ (function (_super) {
    tslib_1.__extends(SliderHandleDirective, _super);
    function SliderHandleDirective(elemRef, renderer, changeDetectionRef) {
        var _this = _super.call(this, elemRef, renderer, changeDetectionRef) || this;
        _this.active = false;
        _this.role = '';
        _this.tabindex = '';
        _this.ariaOrientation = '';
        _this.ariaLabel = '';
        _this.ariaLabelledBy = '';
        _this.ariaValueNow = '';
        _this.ariaValueText = '';
        _this.ariaValueMin = '';
        _this.ariaValueMax = '';
        return _this;
    }
    /**
     * @return {?}
     */
    SliderHandleDirective.prototype.focus = /**
     * @return {?}
     */
    function () {
        this.elemRef.nativeElement.focus();
    };
    SliderHandleDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxSliderHandle]'
                },] },
    ];
    /** @nocollapse */
    SliderHandleDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    SliderHandleDirective.propDecorators = {
        active: [{ type: HostBinding, args: ['class.ngx-slider-active',] }],
        role: [{ type: HostBinding, args: ['attr.role',] }],
        tabindex: [{ type: HostBinding, args: ['attr.tabindex',] }],
        ariaOrientation: [{ type: HostBinding, args: ['attr.aria-orientation',] }],
        ariaLabel: [{ type: HostBinding, args: ['attr.aria-label',] }],
        ariaLabelledBy: [{ type: HostBinding, args: ['attr.aria-labelledby',] }],
        ariaValueNow: [{ type: HostBinding, args: ['attr.aria-valuenow',] }],
        ariaValueText: [{ type: HostBinding, args: ['attr.aria-valuetext',] }],
        ariaValueMin: [{ type: HostBinding, args: ['attr.aria-valuemin',] }],
        ariaValueMax: [{ type: HostBinding, args: ['attr.aria-valuemax',] }]
    };
    return SliderHandleDirective;
}(SliderElementDirective));
export { SliderHandleDirective };
if (false) {
    /** @type {?} */
    SliderHandleDirective.prototype.active;
    /** @type {?} */
    SliderHandleDirective.prototype.role;
    /** @type {?} */
    SliderHandleDirective.prototype.tabindex;
    /** @type {?} */
    SliderHandleDirective.prototype.ariaOrientation;
    /** @type {?} */
    SliderHandleDirective.prototype.ariaLabel;
    /** @type {?} */
    SliderHandleDirective.prototype.ariaLabelledBy;
    /** @type {?} */
    SliderHandleDirective.prototype.ariaValueNow;
    /** @type {?} */
    SliderHandleDirective.prototype.ariaValueText;
    /** @type {?} */
    SliderHandleDirective.prototype.ariaValueMin;
    /** @type {?} */
    SliderHandleDirective.prototype.ariaValueMax;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWhhbmRsZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci8iLCJzb3VyY2VzIjpbInNsaWRlci1oYW5kbGUuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQzs7SUFLekIsaURBQXNCO0lBbUMvRCwrQkFBWSxPQUFtQixFQUFFLFFBQW1CLEVBQUUsa0JBQXFDO1FBQTNGLFlBQ0Usa0JBQU0sT0FBTyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxTQUM3Qzt1QkFuQ2lCLEtBQUs7cUJBR1IsRUFBRTt5QkFHRSxFQUFFO2dDQUdLLEVBQUU7MEJBR1IsRUFBRTsrQkFHRyxFQUFFOzZCQUdKLEVBQUU7OEJBR0QsRUFBRTs2QkFHSCxFQUFFOzZCQUdGLEVBQUU7O0tBUXhCOzs7O0lBTkQscUNBQUs7OztJQUFMO1FBQ0UsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDcEM7O2dCQXBDRixTQUFTLFNBQUM7b0JBQ1QsUUFBUSxFQUFFLG1CQUFtQjtpQkFDOUI7Ozs7Z0JBTG1CLFVBQVU7Z0JBQUUsU0FBUztnQkFBZSxpQkFBaUI7Ozt5QkFPdEUsV0FBVyxTQUFDLHlCQUF5Qjt1QkFHckMsV0FBVyxTQUFDLFdBQVc7MkJBR3ZCLFdBQVcsU0FBQyxlQUFlO2tDQUczQixXQUFXLFNBQUMsdUJBQXVCOzRCQUduQyxXQUFXLFNBQUMsaUJBQWlCO2lDQUc3QixXQUFXLFNBQUMsc0JBQXNCOytCQUdsQyxXQUFXLFNBQUMsb0JBQW9CO2dDQUdoQyxXQUFXLFNBQUMscUJBQXFCOytCQUdqQyxXQUFXLFNBQUMsb0JBQW9COytCQUdoQyxXQUFXLFNBQUMsb0JBQW9COztnQ0FsQ25DO0VBTTJDLHNCQUFzQjtTQUFwRCxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgSG9zdEJpbmRpbmcsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFNsaWRlckVsZW1lbnREaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1lbGVtZW50LmRpcmVjdGl2ZSc7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tuZ3hTbGlkZXJIYW5kbGVdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2xpZGVySGFuZGxlRGlyZWN0aXZlIGV4dGVuZHMgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSB7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5uZ3gtc2xpZGVyLWFjdGl2ZScpXHJcbiAgYWN0aXZlOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5yb2xlJylcclxuICByb2xlOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnRhYmluZGV4JylcclxuICB0YWJpbmRleDogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLW9yaWVudGF0aW9uJylcclxuICBhcmlhT3JpZW50YXRpb246IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1sYWJlbCcpXHJcbiAgYXJpYUxhYmVsOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtbGFiZWxsZWRieScpXHJcbiAgYXJpYUxhYmVsbGVkQnk6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS12YWx1ZW5vdycpXHJcbiAgYXJpYVZhbHVlTm93OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtdmFsdWV0ZXh0JylcclxuICBhcmlhVmFsdWVUZXh0OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtdmFsdWVtaW4nKVxyXG4gIGFyaWFWYWx1ZU1pbjogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLXZhbHVlbWF4JylcclxuICBhcmlhVmFsdWVNYXg6IHN0cmluZyA9ICcnO1xyXG5cclxuICBmb2N1cygpOiB2b2lkIHtcclxuICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihlbGVtUmVmOiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyLCBjaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcbiAgICBzdXBlcihlbGVtUmVmLCByZW5kZXJlciwgY2hhbmdlRGV0ZWN0aW9uUmVmKTtcclxuICB9XHJcbn1cclxuIl19