/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider.component';
import { SliderElementDirective } from './slider-element.directive';
import { SliderHandleDirective } from './slider-handle.directive';
import { SliderLabelDirective } from './slider-label.directive';
import { TooltipWrapperComponent } from './tooltip-wrapper.component';
/**
 * NgxSlider module
 *
 * The module exports the slider component
 */
var NgxSliderModule = /** @class */ (function () {
    function NgxSliderModule() {
    }
    NgxSliderModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule
                    ],
                    declarations: [
                        SliderComponent,
                        SliderElementDirective,
                        SliderHandleDirective,
                        SliderLabelDirective,
                        TooltipWrapperComponent
                    ],
                    exports: [
                        SliderComponent
                    ]
                },] },
    ];
    return NgxSliderModule;
}());
export { NgxSliderModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyLyIsInNvdXJjZXMiOlsic2xpZGVyLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQ3BFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDOzs7Ozs7Ozs7O2dCQU9yRSxRQUFRLFNBQUM7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLFlBQVk7cUJBQ2I7b0JBQ0QsWUFBWSxFQUFFO3dCQUNaLGVBQWU7d0JBQ2Ysc0JBQXNCO3dCQUN0QixxQkFBcUI7d0JBQ3JCLG9CQUFvQjt3QkFDcEIsdUJBQXVCO3FCQUN4QjtvQkFDRCxPQUFPLEVBQUU7d0JBQ1AsZUFBZTtxQkFDaEI7aUJBQ0Y7OzBCQTNCRDs7U0E0QmEsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IFNsaWRlckNvbXBvbmVudCB9IGZyb20gJy4vc2xpZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNsaWRlckVsZW1lbnREaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1lbGVtZW50LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IFNsaWRlckhhbmRsZURpcmVjdGl2ZSB9IGZyb20gJy4vc2xpZGVyLWhhbmRsZS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBTbGlkZXJMYWJlbERpcmVjdGl2ZSB9IGZyb20gJy4vc2xpZGVyLWxhYmVsLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IFRvb2x0aXBXcmFwcGVyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sdGlwLXdyYXBwZXIuY29tcG9uZW50JztcclxuXHJcbi8qKlxyXG4gKiBOZ3hTbGlkZXIgbW9kdWxlXHJcbiAqXHJcbiAqIFRoZSBtb2R1bGUgZXhwb3J0cyB0aGUgc2xpZGVyIGNvbXBvbmVudFxyXG4gKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgU2xpZGVyQ29tcG9uZW50LFxyXG4gICAgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSxcclxuICAgIFNsaWRlckhhbmRsZURpcmVjdGl2ZSxcclxuICAgIFNsaWRlckxhYmVsRGlyZWN0aXZlLFxyXG4gICAgVG9vbHRpcFdyYXBwZXJDb21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFNsaWRlckNvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNsaWRlck1vZHVsZSB7IH1cclxuIl19