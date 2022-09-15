/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, HostBinding, ChangeDetectorRef } from '@angular/core';
import { EventListenerHelper } from './event-listener-helper';
import { ValueHelper } from './value-helper';
export class SliderElementDirective {
    /**
     * @param {?} elemRef
     * @param {?} renderer
     * @param {?} changeDetectionRef
     */
    constructor(elemRef, renderer, changeDetectionRef) {
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
    /**
     * @return {?}
     */
    get position() {
        return this._position;
    }
    /**
     * @return {?}
     */
    get dimension() {
        return this._dimension;
    }
    /**
     * @return {?}
     */
    get alwaysHide() {
        return this._alwaysHide;
    }
    /**
     * @return {?}
     */
    get vertical() {
        return this._vertical;
    }
    /**
     * @return {?}
     */
    get scale() {
        return this._scale;
    }
    /**
     * @return {?}
     */
    get rotate() {
        return this._rotate;
    }
    /**
     * @param {?} hide
     * @return {?}
     */
    setAlwaysHide(hide) {
        this._alwaysHide = hide;
        if (hide) {
            this.visibility = 'hidden';
        }
        else {
            this.visibility = 'visible';
        }
    }
    /**
     * @return {?}
     */
    hide() {
        this.opacity = 0;
    }
    /**
     * @return {?}
     */
    show() {
        if (this.alwaysHide) {
            return;
        }
        this.opacity = 1;
    }
    /**
     * @return {?}
     */
    isVisible() {
        if (this.alwaysHide) {
            return false;
        }
        return this.opacity !== 0;
    }
    /**
     * @param {?} vertical
     * @return {?}
     */
    setVertical(vertical) {
        this._vertical = vertical;
        if (this._vertical) {
            this.left = '';
            this.width = '';
        }
        else {
            this.bottom = '';
            this.height = '';
        }
    }
    /**
     * @param {?} scale
     * @return {?}
     */
    setScale(scale) {
        this._scale = scale;
    }
    /**
     * @param {?} rotate
     * @return {?}
     */
    setRotate(rotate) {
        this._rotate = rotate;
        this.transform = 'rotate(' + rotate + 'deg)';
    }
    /**
     * @return {?}
     */
    getRotate() {
        return this._rotate;
    }
    /**
     * @param {?} pos
     * @return {?}
     */
    setPosition(pos) {
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
    }
    /**
     * @return {?}
     */
    calculateDimension() {
        /** @type {?} */
        const val = this.getBoundingClientRect();
        if (this.vertical) {
            this._dimension = (val.bottom - val.top) * this.scale;
        }
        else {
            this._dimension = (val.right - val.left) * this.scale;
        }
    }
    /**
     * @param {?} dim
     * @return {?}
     */
    setDimension(dim) {
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
    }
    /**
     * @return {?}
     */
    getBoundingClientRect() {
        return this.elemRef.nativeElement.getBoundingClientRect();
    }
    /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    on(eventName, callback, debounceInterval) {
        /** @type {?} */
        const listener = this.eventListenerHelper.attachEventListener(this.elemRef.nativeElement, eventName, callback, debounceInterval);
        this.eventListeners.push(listener);
    }
    /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    onPassive(eventName, callback, debounceInterval) {
        /** @type {?} */
        const listener = this.eventListenerHelper.attachPassiveEventListener(this.elemRef.nativeElement, eventName, callback, debounceInterval);
        this.eventListeners.push(listener);
    }
    /**
     * @param {?=} eventName
     * @return {?}
     */
    off(eventName) {
        /** @type {?} */
        let listenersToKeep;
        /** @type {?} */
        let listenersToRemove;
        if (!ValueHelper.isNullOrUndefined(eventName)) {
            listenersToKeep = this.eventListeners.filter((event) => event.eventName !== eventName);
            listenersToRemove = this.eventListeners.filter((event) => event.eventName === eventName);
        }
        else {
            listenersToKeep = [];
            listenersToRemove = this.eventListeners;
        }
        for (const listener of listenersToRemove) {
            this.eventListenerHelper.detachEventListener(listener);
        }
        this.eventListeners = listenersToKeep;
    }
    /**
     * @return {?}
     */
    isRefDestroyed() {
        return ValueHelper.isNullOrUndefined(this.changeDetectionRef) || this.changeDetectionRef['destroyed'];
    }
}
SliderElementDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngxSliderElement]'
            },] },
];
/** @nocollapse */
SliderElementDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: ChangeDetectorRef }
];
SliderElementDirective.propDecorators = {
    opacity: [{ type: HostBinding, args: ['style.opacity',] }],
    visibility: [{ type: HostBinding, args: ['style.visibility',] }],
    left: [{ type: HostBinding, args: ['style.left',] }],
    bottom: [{ type: HostBinding, args: ['style.bottom',] }],
    height: [{ type: HostBinding, args: ['style.height',] }],
    width: [{ type: HostBinding, args: ['style.width',] }],
    transform: [{ type: HostBinding, args: ['style.transform',] }]
};
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLWVsZW1lbnQuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvIiwic291cmNlcyI6WyJzbGlkZXItZWxlbWVudC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBSzdDLE1BQU07Ozs7OztJQXVESixZQUFzQixPQUFtQixFQUFZLFFBQW1CLEVBQVksa0JBQXFDO1FBQW5HLFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBWSxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVksdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFtQjt5QkF0RDdGLENBQUM7MEJBS0EsQ0FBQzsyQkFLQyxLQUFLO3lCQUtQLEtBQUs7c0JBS1QsQ0FBQzt1QkFLQSxDQUFDO3VCQU1ULENBQUM7MEJBR0UsU0FBUztvQkFHZixFQUFFO3NCQUdBLEVBQUU7c0JBR0YsRUFBRTtxQkFHSCxFQUFFO3lCQUdFLEVBQUU7OEJBR29CLEVBQUU7UUFHMUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ25FOzs7O0lBdkRELElBQUksUUFBUTtRQUNWLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUN2Qjs7OztJQUdELElBQUksU0FBUztRQUNYLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztLQUN4Qjs7OztJQUdELElBQUksVUFBVTtRQUNaLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUN6Qjs7OztJQUdELElBQUksUUFBUTtRQUNWLE9BQU8s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IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBIb3N0QmluZGluZywgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRXZlbnRMaXN0ZW5lckhlbHBlciB9IGZyb20gJy4vZXZlbnQtbGlzdGVuZXItaGVscGVyJztcclxuaW1wb3J0IHsgRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vZXZlbnQtbGlzdGVuZXInO1xyXG5pbXBvcnQgeyBWYWx1ZUhlbHBlciB9IGZyb20gJy4vdmFsdWUtaGVscGVyJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW25neFNsaWRlckVsZW1lbnRdJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSB7XHJcbiAgcHJpdmF0ZSBfcG9zaXRpb246IG51bWJlciA9IDA7XHJcbiAgZ2V0IHBvc2l0aW9uKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9kaW1lbnNpb246IG51bWJlciA9IDA7XHJcbiAgZ2V0IGRpbWVuc2lvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RpbWVuc2lvbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2Fsd2F5c0hpZGU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBnZXQgYWx3YXlzSGlkZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl9hbHdheXNIaWRlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfdmVydGljYWw6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBnZXQgdmVydGljYWwoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fdmVydGljYWw7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9zY2FsZTogbnVtYmVyID0gMTtcclxuICBnZXQgc2NhbGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9zY2FsZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3JvdGF0ZTogbnVtYmVyID0gMDtcclxuICBnZXQgcm90YXRlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcm90YXRlO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5vcGFjaXR5JylcclxuICBvcGFjaXR5OiBudW1iZXIgPSAxO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLnZpc2liaWxpdHknKVxyXG4gIHZpc2liaWxpdHk6IHN0cmluZyA9ICd2aXNpYmxlJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5sZWZ0JylcclxuICBsZWZ0OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5ib3R0b20nKVxyXG4gIGJvdHRvbTogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUuaGVpZ2h0JylcclxuICBoZWlnaHQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLndpZHRoJylcclxuICB3aWR0aDogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUudHJhbnNmb3JtJylcclxuICB0cmFuc2Zvcm06IHN0cmluZyA9ICcnO1xyXG5cclxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJIZWxwZXI6IEV2ZW50TGlzdGVuZXJIZWxwZXI7XHJcbiAgcHJpdmF0ZSBldmVudExpc3RlbmVyczogRXZlbnRMaXN0ZW5lcltdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtUmVmOiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJvdGVjdGVkIGNoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuICAgIHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlciA9IG5ldyBFdmVudExpc3RlbmVySGVscGVyKHRoaXMucmVuZGVyZXIpO1xyXG4gIH1cclxuXHJcbiAgc2V0QWx3YXlzSGlkZShoaWRlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLl9hbHdheXNIaWRlID0gaGlkZTtcclxuICAgIGlmIChoaWRlKSB7XHJcbiAgICAgIHRoaXMudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaGlkZSgpOiB2b2lkIHtcclxuICAgIHRoaXMub3BhY2l0eSA9IDA7XHJcbiAgfVxyXG5cclxuICBzaG93KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuYWx3YXlzSGlkZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5vcGFjaXR5ID0gMTtcclxuICB9XHJcblxyXG4gIGlzVmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmFsd2F5c0hpZGUpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMub3BhY2l0eSAhPT0gMDtcclxuICB9XHJcblxyXG4gIHNldFZlcnRpY2FsKHZlcnRpY2FsOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLl92ZXJ0aWNhbCA9IHZlcnRpY2FsO1xyXG4gICAgaWYgKHRoaXMuX3ZlcnRpY2FsKSB7XHJcbiAgICAgIHRoaXMubGVmdCA9ICcnO1xyXG4gICAgICB0aGlzLndpZHRoID0gJyc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJvdHRvbSA9ICcnO1xyXG4gICAgICB0aGlzLmhlaWdodCA9ICcnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0U2NhbGUoc2NhbGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5fc2NhbGUgPSBzY2FsZTtcclxuICB9XHJcblxyXG4gIHNldFJvdGF0ZShyb3RhdGU6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5fcm90YXRlID0gcm90YXRlO1xyXG4gICAgdGhpcy50cmFuc2Zvcm0gPSAncm90YXRlKCcgKyByb3RhdGUgKyAnZGVnKSc7XHJcbiAgfVxyXG5cclxuICBnZXRSb3RhdGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3RhdGU7XHJcbiAgfVxyXG5cclxuICAgLy8gU2V0IGVsZW1lbnQgbGVmdC90b3AgcG9zaXRpb24gZGVwZW5kaW5nIG9uIHdoZXRoZXIgc2xpZGVyIGlzIGhvcml6b250YWwgb3IgdmVydGljYWxcclxuICBzZXRQb3NpdGlvbihwb3M6IG51bWJlcik6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX3Bvc2l0aW9uICE9PSBwb3MgJiYgIXRoaXMuaXNSZWZEZXN0cm95ZWQoKSkge1xyXG4gICAgICB0aGlzLmNoYW5nZURldGVjdGlvblJlZi5tYXJrRm9yQ2hlY2soKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9wb3NpdGlvbiA9IHBvcztcclxuICAgIGlmICh0aGlzLl92ZXJ0aWNhbCkge1xyXG4gICAgICB0aGlzLmJvdHRvbSA9IE1hdGgucm91bmQocG9zKSArICdweCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmxlZnQgPSBNYXRoLnJvdW5kKHBvcykgKyAncHgnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGVsZW1lbnQncyB3aWR0aC9oZWlnaHQgZGVwZW5kaW5nIG9uIHdoZXRoZXIgc2xpZGVyIGlzIGhvcml6b250YWwgb3IgdmVydGljYWxcclxuICBjYWxjdWxhdGVEaW1lbnNpb24oKTogdm9pZCB7XHJcbiAgICBjb25zdCB2YWw6IENsaWVudFJlY3QgPSB0aGlzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgaWYgKHRoaXMudmVydGljYWwpIHtcclxuICAgICAgdGhpcy5fZGltZW5zaW9uID0gKHZhbC5ib3R0b20gLSB2YWwudG9wKSAqIHRoaXMuc2NhbGU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9kaW1lbnNpb24gPSAodmFsLnJpZ2h0IC0gdmFsLmxlZnQpICogdGhpcy5zY2FsZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFNldCBlbGVtZW50IHdpZHRoL2hlaWdodCBkZXBlbmRpbmcgb24gd2hldGhlciBzbGlkZXIgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxyXG4gIHNldERpbWVuc2lvbihkaW06IG51bWJlcik6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX2RpbWVuc2lvbiAhPT0gZGltICYmICF0aGlzLmlzUmVmRGVzdHJveWVkKCkpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3Rpb25SZWYubWFya0ZvckNoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZGltZW5zaW9uID0gZGltO1xyXG4gICAgaWYgKHRoaXMuX3ZlcnRpY2FsKSB7XHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gTWF0aC5yb3VuZChkaW0pICsgJ3B4JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMud2lkdGggPSBNYXRoLnJvdW5kKGRpbSkgKyAncHgnO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk6IENsaWVudFJlY3Qge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gIH1cclxuXHJcbiAgb24oZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gdm9pZCwgZGVib3VuY2VJbnRlcnZhbD86IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuYXR0YWNoRXZlbnRMaXN0ZW5lcihcclxuICAgICAgdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIGRlYm91bmNlSW50ZXJ2YWwpO1xyXG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4gIG9uUGFzc2l2ZShldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiB2b2lkLCBkZWJvdW5jZUludGVydmFsPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hQYXNzaXZlRXZlbnRMaXN0ZW5lcihcclxuICAgICAgdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIGRlYm91bmNlSW50ZXJ2YWwpO1xyXG4gICAgdGhpcy5ldmVudExpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcclxuICB9XHJcblxyXG4gIG9mZihldmVudE5hbWU/OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGxldCBsaXN0ZW5lcnNUb0tlZXA6IEV2ZW50TGlzdGVuZXJbXTtcclxuICAgIGxldCBsaXN0ZW5lcnNUb1JlbW92ZTogRXZlbnRMaXN0ZW5lcltdO1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChldmVudE5hbWUpKSB7XHJcbiAgICAgIGxpc3RlbmVyc1RvS2VlcCA9IHRoaXMuZXZlbnRMaXN0ZW5lcnMuZmlsdGVyKChldmVudDogRXZlbnRMaXN0ZW5lcikgPT4gZXZlbnQuZXZlbnROYW1lICE9PSBldmVudE5hbWUpO1xyXG4gICAgICBsaXN0ZW5lcnNUb1JlbW92ZSA9IHRoaXMuZXZlbnRMaXN0ZW5lcnMuZmlsdGVyKChldmVudDogRXZlbnRMaXN0ZW5lcikgPT4gZXZlbnQuZXZlbnROYW1lID09PSBldmVudE5hbWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGlzdGVuZXJzVG9LZWVwID0gW107XHJcbiAgICAgIGxpc3RlbmVyc1RvUmVtb3ZlID0gdGhpcy5ldmVudExpc3RlbmVycztcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGxpc3RlbmVyc1RvUmVtb3ZlKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5kZXRhY2hFdmVudExpc3RlbmVyKGxpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0gbGlzdGVuZXJzVG9LZWVwO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc1JlZkRlc3Ryb3llZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiBWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLmNoYW5nZURldGVjdGlvblJlZikgfHwgdGhpcy5jaGFuZ2VEZXRlY3Rpb25SZWZbJ2Rlc3Ryb3llZCddO1xyXG4gIH1cclxufVxyXG4iXX0=