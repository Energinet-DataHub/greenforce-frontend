/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Directive, ElementRef, Renderer2, HostBinding, ChangeDetectorRef } from '@angular/core';
import { EventListenerHelper } from './event-listener-helper';
import { ValueHelper } from './value-helper';
var SliderElementDirective = /** @class */ (function () {
    function SliderElementDirective(elemRef, renderer, changeDetectionRef) {
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.changeDetectionRef = changeDetectionRef;
        this._position = 0;
        this._dimension = 0;
        this._alwaysHide = false;
        this._vertical = false;
        this._scale = 1;
        this._rotate = 0;
        this.opacity = 1;
        this.visibility = 'visible';
        this.left = '';
        this.bottom = '';
        this.height = '';
        this.width = '';
        this.transform = '';
        this.eventListeners = [];
        this.eventListenerHelper = new EventListenerHelper(this.renderer);
    }
    Object.defineProperty(SliderElementDirective.prototype, "position", {
        get: /**
         * @return {?}
         */
        function () {
            return this._position;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderElementDirective.prototype, "dimension", {
        get: /**
         * @return {?}
         */
        function () {
            return this._dimension;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderElementDirective.prototype, "alwaysHide", {
        get: /**
         * @return {?}
         */
        function () {
            return this._alwaysHide;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderElementDirective.prototype, "vertical", {
        get: /**
         * @return {?}
         */
        function () {
            return this._vertical;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderElementDirective.prototype, "scale", {
        get: /**
         * @return {?}
         */
        function () {
            return this._scale;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SliderElementDirective.prototype, "rotate", {
        get: /**
         * @return {?}
         */
        function () {
            return this._rotate;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} hide
     * @return {?}
     */
    SliderElementDirective.prototype.setAlwaysHide = /**
     * @param {?} hide
     * @return {?}
     */
    function (hide) {
        this._alwaysHide = hide;
        if (hide) {
            this.visibility = 'hidden';
        }
        else {
            this.visibility = 'visible';
        }
    };
    /**
     * @return {?}
     */
    SliderElementDirective.prototype.hide = /**
     * @return {?}
     */
    function () {
        this.opacity = 0;
    };
    /**
     * @return {?}
     */
    SliderElementDirective.prototype.show = /**
     * @return {?}
     */
    function () {
        if (this.alwaysHide) {
            return;
        }
        this.opacity = 1;
    };
    /**
     * @return {?}
     */
    SliderElementDirective.prototype.isVisible = /**
     * @return {?}
     */
    function () {
        if (this.alwaysHide) {
            return false;
        }
        return this.opacity !== 0;
    };
    /**
     * @param {?} vertical
     * @return {?}
     */
    SliderElementDirective.prototype.setVertical = /**
     * @param {?} vertical
     * @return {?}
     */
    function (vertical) {
        this._vertical = vertical;
        if (this._vertical) {
            this.left = '';
            this.width = '';
        }
        else {
            this.bottom = '';
            this.height = '';
        }
    };
    /**
     * @param {?} scale
     * @return {?}
     */
    SliderElementDirective.prototype.setScale = /**
     * @param {?} scale
     * @return {?}
     */
    function (scale) {
        this._scale = scale;
    };
    /**
     * @param {?} rotate
     * @return {?}
     */
    SliderElementDirective.prototype.setRotate = /**
     * @param {?} rotate
     * @return {?}
     */
    function (rotate) {
        this._rotate = rotate;
        this.transform = 'rotate(' + rotate + 'deg)';
    };
    /**
     * @return {?}
     */
    SliderElementDirective.prototype.getRotate = /**
     * @return {?}
     */
    function () {
        return this._rotate;
    };
    // Set element left/top position depending on whether slider is horizontal or vertical
    /**
     * @param {?} pos
     * @return {?}
     */
    SliderElementDirective.prototype.setPosition = /**
     * @param {?} pos
     * @return {?}
     */
    function (pos) {
        if (this._position !== pos && !this.isRefDestroyed()) {
            this.changeDetectionRef.markForCheck();
        }
        this._position = pos;
        if (this._vertical) {
            this.bottom = Math.round(pos) + 'px';
        }
        else {
            this.left = Math.round(pos) + 'px';
        }
    };
    // Calculate element's width/height depending on whether slider is horizontal or vertical
    /**
     * @return {?}
     */
    SliderElementDirective.prototype.calculateDimension = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var val = this.getBoundingClientRect();
        if (this.vertical) {
            this._dimension = (val.bottom - val.top) * this.scale;
        }
        else {
            this._dimension = (val.right - val.left) * this.scale;
        }
    };
    // Set element width/height depending on whether slider is horizontal or vertical
    /**
     * @param {?} dim
     * @return {?}
     */
    SliderElementDirective.prototype.setDimension = /**
     * @param {?} dim
     * @return {?}
     */
    function (dim) {
        if (this._dimension !== dim && !this.isRefDestroyed()) {
            this.changeDetectionRef.markForCheck();
        }
        this._dimension = dim;
        if (this._vertical) {
            this.height = Math.round(dim) + 'px';
        }
        else {
            this.width = Math.round(dim) + 'px';
        }
    };
    /**
     * @return {?}
     */
    SliderElementDirective.prototype.getBoundingClientRect = /**
     * @return {?}
     */
    function () {
        return this.elemRef.nativeElement.getBoundingClientRect();
    };
    /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    SliderElementDirective.prototype.on = /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    function (eventName, callback, debounceInterval) {
        /** @type {?} */
        var listener = this.eventListenerHelper.attachEventListener(this.elemRef.nativeElement, eventName, callback, debounceInterval);
        this.eventListeners.push(listener);
    };
    /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    SliderElementDirective.prototype.onPassive = /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    function (eventName, callback, debounceInterval) {
        /** @type {?} */
        var listener = this.eventListenerHelper.attachPassiveEventListener(this.elemRef.nativeElement, eventName, callback, debounceInterval);
        this.eventListeners.push(listener);
    };
    /**
     * @param {?=} eventName
     * @return {?}
     */
    SliderElementDirective.prototype.off = /**
     * @param {?=} eventName
     * @return {?}
     */
    function (eventName) {
        /** @type {?} */
        var listenersToKeep;
        /** @type {?} */
        var listenersToRemove;
        if (!ValueHelper.isNullOrUndefined(eventName)) {
            listenersToKeep = this.eventListeners.filter(function (event) { return event.eventName !== eventName; });
            listenersToRemove = this.eventListeners.filter(function (event) { return event.eventName === eventName; });
        }
        else {
            listenersToKeep = [];
            listenersToRemove = this.eventListeners;
        }
        try {
            for (var listenersToRemove_1 = tslib_1.__values(listenersToRemove), listenersToRemove_1_1 = listenersToRemove_1.next(); !listenersToRemove_1_1.done; listenersToRemove_1_1 = listenersToRemove_1.next()) {
                var listener = listenersToRemove_1_1.value;
                this.eventListenerHelper.detachEventListener(listener);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (listenersToRemove_1_1 && !listenersToRemove_1_1.done && (_a = listenersToRemove_1.return)) _a.call(listenersToRemove_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.eventListeners = listenersToKeep;
        var e_1, _a;
    };
    /**
     * @return {?}
     */
    SliderElementDirective.prototype.isRefDestroyed = /**
     * @return {?}
     */
    function () {
        return ValueHelper.isNullOrUndefined(this.changeDetectionRef) || this.changeDetectionRef['destroyed'];
    };
    SliderElementDirective.decorators = [
        { type: Directive, args: [{
                    selector: '[ngxSliderElement]'
                },] },
    ];
    /** @nocollapse */
    SliderElementDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 },
        { type: ChangeDetectorRef }
    ]; };
    SliderElementDirective.propDecorators = {
        opacity: [{ type: HostBinding, args: ['style.opacity',] }],
        visibility: [{ type: HostBinding, args: ['style.visibility',] }],
        left: [{ type: HostBinding, args: ['style.left',] }],
        bottom: [{ type: HostBinding, args: ['style.bottom',] }],
        height: [{ type: HostBinding, args: ['style.height',] }],
        width: [{ type: HostBinding, args: ['style.width',] }],
        transform: [{ type: HostBinding, args: ['style.transform',] }]
    };
    return SliderElementDirective;
}());
export { SliderElementDirective };
if (false) {
    /** @type {?} */
    SliderElementDirective.prototype._position;
    /** @type {?} */
    SliderElementDirective.prototype._dimension;
    /** @type {?} */
    SliderElementDirective.prototype._alwaysHide;
    /** @type {?} */
    SliderElementDirective.prototype._vertical;
    /** @type {?} */
    SliderElementDirective.prototype._scale;
    /** @type {?} */
    SliderElementDirective.prototype._rotate;
    /** @type {?} */
    SliderElementDirective.prototype.opacity;
    /** @type {?} */
    SliderElementDirective.prototype.visibility;
    /** @type {?} */
    SliderElementDirective.prototype.left;
    /** @type {?} */
    SliderElementDirective.prototype.bottom;
    /** @type {?} */
    SliderElementDirective.prototype.height;
    /** @type {?} */
    SliderElementDirective.prototype.width;
    /** @type {?} */
    SliderElementDirective.prototype.transform;
    /** @type {?} */
    SliderElementDirective.prototype.eventListenerHelper;
    /** @type {?} */
    SliderElementDirective.prototype.eventListeners;
    /** @type {?} */
    SliderElementDirective.prototype.elemRef;
    /** @type {?} */
    SliderElementDirective.prototype.renderer;
    /** @type {?} */
    SliderElementDirective.prototype.changeDetectionRef;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWVsZW1lbnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvIiwic291cmNlcyI6WyJzbGlkZXItZWxlbWVudC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTlELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7SUE0RDNDLGdDQUFzQixPQUFtQixFQUFZLFFBQW1CLEVBQVksa0JBQXFDO1FBQW5HLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBWSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVksdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjt5QkF0RDdGLENBQUM7MEJBS0EsQ0FBQzsyQkFLQyxLQUFLO3lCQUtQLEtBQUs7c0JBS1QsQ0FBQzt1QkFLQSxDQUFDO3VCQU1ULENBQUM7MEJBR0UsU0FBUztvQkFHZixFQUFFO3NCQUdBLEVBQUU7c0JBR0YsRUFBRTtxQkFHSCxFQUFFO3lCQUdFLEVBQUU7OEJBR29CLEVBQUU7UUFHMUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ25FO0lBdkRELHNCQUFJLDRDQUFROzs7O1FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDdkI7OztPQUFBO0lBR0Qsc0JBQUksNkNBQVM7Ozs7UUFBYjtZQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUN4Qjs7O09BQUE7SUFHRCxzQkFBSSw4Q0FBVTs7OztRQUFkO1lBQ0UsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQ3pCOzs7T0FBQTtJQUdELHNCQUFJLDRDQUFROzs7O1FBQVo7WUFDRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FDdkI7OztPQUFBO0lBR0Qsc0JBQUkseUNBQUs7Ozs7UUFBVDtZQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjs7O09BQUE7SUFHRCxzQkFBSSwwQ0FBTTs7OztRQUFWO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1NBQ3JCOzs7T0FBQTs7Ozs7SUE4QkQsOENBQWE7Ozs7SUFBYixVQUFjLElBQWE7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxJQUFJLEVBQUU7WUFDUixJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztTQUM1QjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7U0FDN0I7S0FDRjs7OztJQUVELHFDQUFJOzs7SUFBSjtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCOzs7O0lBRUQscUNBQUk7OztJQUFKO1FBQ0UsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0tBQ2xCOzs7O0lBRUQsMENBQVM7OztJQUFUO1FBQ0UsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLEtBQUssQ0FBQyxDQUFDO0tBQzNCOzs7OztJQUVELDRDQUFXOzs7O0lBQVgsVUFBWSxRQUFpQjtRQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztTQUNqQjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDbEI7S0FDRjs7Ozs7SUFFRCx5Q0FBUTs7OztJQUFSLFVBQVMsS0FBYTtRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztLQUNyQjs7Ozs7SUFFRCwwQ0FBUzs7OztJQUFULFVBQVUsTUFBYztRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO0tBQzlDOzs7O0lBRUQsMENBQVM7OztJQUFUO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0tBQ3JCO0lBRUEsc0ZBQXNGOzs7OztJQUN2Riw0Q0FBVzs7OztJQUFYLFVBQVksR0FBVztRQUNyQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQ3BELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3RDO2FBQU07WUFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3BDO0tBQ0Y7SUFFRCx5RkFBeUY7Ozs7SUFDekYsbURBQWtCOzs7SUFBbEI7O1FBQ0UsSUFBTSxHQUFHLEdBQWUsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDckQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3ZEO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUN2RDtLQUNGO0lBRUQsaUZBQWlGOzs7OztJQUNqRiw2Q0FBWTs7OztJQUFaLFVBQWEsR0FBVztRQUN0QixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQ3JELElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxZQUFZLEVBQUUsQ0FBQztTQUN4QztRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDO1FBQ3RCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3RDO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3JDO0tBQ0Y7Ozs7SUFFRCxzREFBcUI7OztJQUFyQjtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQztLQUMzRDs7Ozs7OztJQUVELG1DQUFFOzs7Ozs7SUFBRixVQUFHLFNBQWlCLEVBQUUsUUFBOEIsRUFBRSxnQkFBeUI7O1FBQzdFLElBQU0sUUFBUSxHQUFrQixJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQzFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQzs7Ozs7OztJQUVELDBDQUFTOzs7Ozs7SUFBVCxVQUFVLFNBQWlCLEVBQUUsUUFBOEIsRUFBRSxnQkFBeUI7O1FBQ3BGLElBQU0sUUFBUSxHQUFrQixJQUFJLENBQUMsbUJBQW1CLENBQUMsMEJBQTBCLENBQ2pGLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUNyRSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQzs7Ozs7SUFFRCxvQ0FBRzs7OztJQUFILFVBQUksU0FBa0I7O1FBQ3BCLElBQUksZUFBZSxDQUFrQjs7UUFDckMsSUFBSSxpQkFBaUIsQ0FBa0I7UUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3QyxlQUFlLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsVUFBQyxLQUFvQixJQUFLLE9BQUEsS0FBSyxDQUFDLFNBQVMsS0FBSyxTQUFTLEVBQTdCLENBQTZCLENBQUMsQ0FBQztZQUN0RyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQW9CLElBQUssT0FBQSxLQUFLLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBN0IsQ0FBNkIsQ0FBQyxDQUFDO1NBQ3pHO2FBQU07WUFDTCxlQUFlLEdBQUcsRUFBRSxDQUFDO1lBQ3JCLGlCQUFpQixHQUFHLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDekM7O1lBRUQsS0FBdUIsSUFBQSxzQkFBQSxpQkFBQSxpQkFBaUIsQ0FBQSxvREFBQTtnQkFBbkMsSUFBTSxRQUFRLDhCQUFBO2dCQUNqQixJQUFJLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDeEQ7Ozs7Ozs7OztRQUVELElBQUksQ0FBQyxjQUFjLEdBQUcsZUFBZSxDQUFDOztLQUN2Qzs7OztJQUVPLCtDQUFjOzs7O1FBQ3BCLE9BQU8sV0FBVyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7O2dCQTNMekcsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSxvQkFBb0I7aUJBQy9COzs7O2dCQVBtQixVQUFVO2dCQUFFLFNBQVM7Z0JBQWUsaUJBQWlCOzs7MEJBdUN0RSxXQUFXLFNBQUMsZUFBZTs2QkFHM0IsV0FBVyxTQUFDLGtCQUFrQjt1QkFHOUIsV0FBVyxTQUFDLFlBQVk7eUJBR3hCLFdBQVcsU0FBQyxjQUFjO3lCQUcxQixXQUFXLFNBQUMsY0FBYzt3QkFHMUIsV0FBVyxTQUFDLGFBQWE7NEJBR3pCLFdBQVcsU0FBQyxpQkFBaUI7O2lDQXpEaEM7O1NBUWEsc0JBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIEhvc3RCaW5kaW5nLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVySGVscGVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lci1oZWxwZXInO1xyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lcic7XHJcbmltcG9ydCB7IFZhbHVlSGVscGVyIH0gZnJvbSAnLi92YWx1ZS1oZWxwZXInO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbbmd4U2xpZGVyRWxlbWVudF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIHtcclxuICBwcml2YXRlIF9wb3NpdGlvbjogbnVtYmVyID0gMDtcclxuICBnZXQgcG9zaXRpb24oKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2RpbWVuc2lvbjogbnVtYmVyID0gMDtcclxuICBnZXQgZGltZW5zaW9uKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGltZW5zaW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfYWx3YXlzSGlkZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGdldCBhbHdheXNIaWRlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Fsd2F5c0hpZGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF92ZXJ0aWNhbDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3NjYWxlOiBudW1iZXIgPSAxO1xyXG4gIGdldCBzY2FsZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjYWxlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfcm90YXRlOiBudW1iZXIgPSAwO1xyXG4gIGdldCByb3RhdGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3RhdGU7XHJcbiAgfVxyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm9wYWNpdHknKVxyXG4gIG9wYWNpdHk6IG51bWJlciA9IDE7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUudmlzaWJpbGl0eScpXHJcbiAgdmlzaWJpbGl0eTogc3RyaW5nID0gJ3Zpc2libGUnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmxlZnQnKVxyXG4gIGxlZnQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJvdHRvbScpXHJcbiAgYm90dG9tOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxyXG4gIGhlaWdodDogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKVxyXG4gIHdpZHRoOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS50cmFuc2Zvcm0nKVxyXG4gIHRyYW5zZm9ybTogc3RyaW5nID0gJyc7XHJcblxyXG4gIHByaXZhdGUgZXZlbnRMaXN0ZW5lckhlbHBlcjogRXZlbnRMaXN0ZW5lckhlbHBlcjtcclxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJzOiBFdmVudExpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1SZWY6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLCBwcm90ZWN0ZWQgY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgdGhpcy5ldmVudExpc3RlbmVySGVscGVyID0gbmV3IEV2ZW50TGlzdGVuZXJIZWxwZXIodGhpcy5yZW5kZXJlcik7XHJcbiAgfVxyXG5cclxuICBzZXRBbHdheXNIaWRlKGhpZGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuX2Fsd2F5c0hpZGUgPSBoaWRlO1xyXG4gICAgaWYgKGhpZGUpIHtcclxuICAgICAgdGhpcy52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoaWRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5vcGFjaXR5ID0gMDtcclxuICB9XHJcblxyXG4gIHNob3coKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hbHdheXNIaWRlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9wYWNpdHkgPSAxO1xyXG4gIH1cclxuXHJcbiAgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuYWx3YXlzSGlkZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vcGFjaXR5ICE9PSAwO1xyXG4gIH1cclxuXHJcbiAgc2V0VmVydGljYWwodmVydGljYWw6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuX3ZlcnRpY2FsID0gdmVydGljYWw7XHJcbiAgICBpZiAodGhpcy5fdmVydGljYWwpIHtcclxuICAgICAgdGhpcy5sZWZ0ID0gJyc7XHJcbiAgICAgIHRoaXMud2lkdGggPSAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYm90dG9tID0gJyc7XHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRTY2FsZShzY2FsZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLl9zY2FsZSA9IHNjYWxlO1xyXG4gIH1cclxuXHJcbiAgc2V0Um90YXRlKHJvdGF0ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLl9yb3RhdGUgPSByb3RhdGU7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9ICdyb3RhdGUoJyArIHJvdGF0ZSArICdkZWcpJztcclxuICB9XHJcblxyXG4gIGdldFJvdGF0ZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0ZTtcclxuICB9XHJcblxyXG4gICAvLyBTZXQgZWxlbWVudCBsZWZ0L3RvcCBwb3NpdGlvbiBkZXBlbmRpbmcgb24gd2hldGhlciBzbGlkZXIgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxyXG4gIHNldFBvc2l0aW9uKHBvczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fcG9zaXRpb24gIT09IHBvcyAmJiAhdGhpcy5pc1JlZkRlc3Ryb3llZCgpKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zO1xyXG4gICAgaWYgKHRoaXMuX3ZlcnRpY2FsKSB7XHJcbiAgICAgIHRoaXMuYm90dG9tID0gTWF0aC5yb3VuZChwb3MpICsgJ3B4JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGVmdCA9IE1hdGgucm91bmQocG9zKSArICdweCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgZWxlbWVudCdzIHdpZHRoL2hlaWdodCBkZXBlbmRpbmcgb24gd2hldGhlciBzbGlkZXIgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxyXG4gIGNhbGN1bGF0ZURpbWVuc2lvbigpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZhbDogQ2xpZW50UmVjdCA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xyXG4gICAgICB0aGlzLl9kaW1lbnNpb24gPSAodmFsLmJvdHRvbSAtIHZhbC50b3ApICogdGhpcy5zY2FsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2RpbWVuc2lvbiA9ICh2YWwucmlnaHQgLSB2YWwubGVmdCkgKiB0aGlzLnNjYWxlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2V0IGVsZW1lbnQgd2lkdGgvaGVpZ2h0IGRlcGVuZGluZyBvbiB3aGV0aGVyIHNsaWRlciBpcyBob3Jpem9udGFsIG9yIHZlcnRpY2FsXHJcbiAgc2V0RGltZW5zaW9uKGRpbTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fZGltZW5zaW9uICE9PSBkaW0gJiYgIXRoaXMuaXNSZWZEZXN0cm95ZWQoKSkge1xyXG4gICAgICB0aGlzLmNoYW5nZURldGVjdGlvblJlZi5tYXJrRm9yQ2hlY2soKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9kaW1lbnNpb24gPSBkaW07XHJcbiAgICBpZiAodGhpcy5fdmVydGljYWwpIHtcclxuICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLnJvdW5kKGRpbSkgKyAncHgnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy53aWR0aCA9IE1hdGgucm91bmQoZGltKSArICdweCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogQ2xpZW50UmVjdCB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgfVxyXG5cclxuICBvbihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiB2b2lkLCBkZWJvdW5jZUludGVydmFsPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hFdmVudExpc3RlbmVyKFxyXG4gICAgICB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaywgZGVib3VuY2VJbnRlcnZhbCk7XHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgb25QYXNzaXZlKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IHZvaWQsIGRlYm91bmNlSW50ZXJ2YWw/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyOiBFdmVudExpc3RlbmVyID0gdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmF0dGFjaFBhc3NpdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaywgZGVib3VuY2VJbnRlcnZhbCk7XHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgb2ZmKGV2ZW50TmFtZT86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbGV0IGxpc3RlbmVyc1RvS2VlcDogRXZlbnRMaXN0ZW5lcltdO1xyXG4gICAgbGV0IGxpc3RlbmVyc1RvUmVtb3ZlOiBFdmVudExpc3RlbmVyW107XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50TmFtZSkpIHtcclxuICAgICAgbGlzdGVuZXJzVG9LZWVwID0gdGhpcy5ldmVudExpc3RlbmVycy5maWx0ZXIoKGV2ZW50OiBFdmVudExpc3RlbmVyKSA9PiBldmVudC5ldmVudE5hbWUgIT09IGV2ZW50TmFtZSk7XHJcbiAgICAgIGxpc3RlbmVyc1RvUmVtb3ZlID0gdGhpcy5ldmVudExpc3RlbmVycy5maWx0ZXIoKGV2ZW50OiBFdmVudExpc3RlbmVyKSA9PiBldmVudC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsaXN0ZW5lcnNUb0tlZXAgPSBbXTtcclxuICAgICAgbGlzdGVuZXJzVG9SZW1vdmUgPSB0aGlzLmV2ZW50TGlzdGVuZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzVG9SZW1vdmUpIHtcclxuICAgICAgdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmRldGFjaEV2ZW50TGlzdGVuZXIobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBsaXN0ZW5lcnNUb0tlZXA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzUmVmRGVzdHJveWVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmKSB8fCB0aGlzLmNoYW5nZURldGVjdGlvblJlZlsnZGVzdHJveWVkJ107XHJcbiAgfVxyXG59XHJcbiJdfQ==