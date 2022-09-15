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
/**
 * Helper with compatibility functions to support different browsers
 */
var /**
 * Helper with compatibility functions to support different browsers
 */
CompatibilityHelper = /** @class */ (function () {
    function CompatibilityHelper() {
    }
    /**
     * Workaround for TouchEvent constructor sadly not being available on all browsers (e.g. Firefox, Safari)
     * @param {?} event
     * @return {?}
     */
    CompatibilityHelper.isTouchEvent = /**
     * Workaround for TouchEvent constructor sadly not being available on all browsers (e.g. Firefox, Safari)
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if ((/** @type {?} */ (window)).TouchEvent !== undefined) {
            return event instanceof TouchEvent;
        }
        return event.touches !== undefined;
    };
    /**
     * Detect presence of ResizeObserver API
     * @return {?}
     */
    CompatibilityHelper.isResizeObserverAvailable = /**
     * Detect presence of ResizeObserver API
     * @return {?}
     */
    function () {
        return (/** @type {?} */ (window)).ResizeObserver !== undefined;
    };
    return CompatibilityHelper;
}());
/**
 * Helper with compatibility functions to support different browsers
 */
export { CompatibilityHelper };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGF0aWJpbGl0eS1oZWxwZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci8iLCJzb3VyY2VzIjpbImNvbXBhdGliaWxpdHktaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFNQTs7O0FBQUE7Ozs7Ozs7O0lBRWdCLGdDQUFZOzs7OztjQUFDLEtBQVU7UUFDbkMsSUFBSSxtQkFBQyxNQUFhLEVBQUMsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQzVDLE9BQU8sS0FBSyxZQUFZLFVBQVUsQ0FBQztTQUNwQztRQUVELE9BQU8sS0FBSyxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUM7Ozs7OztJQUl2Qiw2Q0FBeUI7Ozs7O1FBQ3JDLE9BQU8sbUJBQUMsTUFBYSxFQUFDLENBQUMsY0FBYyxLQUFLLFNBQVMsQ0FBQzs7OEJBbEJ4RDtJQW9CQyxDQUFBOzs7O0FBZEQsK0JBY0MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBEZWNsYXJhdGlvbiBmb3IgUmVzaXplT2JzZXJ2ZXIgYSBuZXcgQVBJIGF2YWlsYWJsZSBpbiBzb21lIG9mIG5ld2VzdCBicm93c2VyczpcclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1Jlc2l6ZU9ic2VydmVyXHJcbmRlY2xhcmUgY2xhc3MgUmVzaXplT2JzZXJ2ZXIge1xyXG59XHJcblxyXG4vKiogSGVscGVyIHdpdGggY29tcGF0aWJpbGl0eSBmdW5jdGlvbnMgdG8gc3VwcG9ydCBkaWZmZXJlbnQgYnJvd3NlcnMgKi9cclxuZXhwb3J0IGNsYXNzIENvbXBhdGliaWxpdHlIZWxwZXIge1xyXG4gIC8qKiBXb3JrYXJvdW5kIGZvciBUb3VjaEV2ZW50IGNvbnN0cnVjdG9yIHNhZGx5IG5vdCBiZWluZyBhdmFpbGFibGUgb24gYWxsIGJyb3dzZXJzIChlLmcuIEZpcmVmb3gsIFNhZmFyaSkgKi9cclxuICBwdWJsaWMgc3RhdGljIGlzVG91Y2hFdmVudChldmVudDogYW55KTogYm9vbGVhbiB7XHJcbiAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLlRvdWNoRXZlbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBldmVudC50b3VjaGVzICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICAvKiogRGV0ZWN0IHByZXNlbmNlIG9mIFJlc2l6ZU9ic2VydmVyIEFQSSAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgaXNSZXNpemVPYnNlcnZlckF2YWlsYWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuUmVzaXplT2JzZXJ2ZXIgIT09IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuIl19