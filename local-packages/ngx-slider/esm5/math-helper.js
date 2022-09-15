/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Helper with mathematical functions
 */
var /**
 * Helper with mathematical functions
 */
MathHelper = /** @class */ (function () {
    function MathHelper() {
    }
    /* Round numbers to a given number of significant digits */
    /**
     * @param {?} value
     * @param {?} precisionLimit
     * @return {?}
     */
    MathHelper.roundToPrecisionLimit = /**
     * @param {?} value
     * @param {?} precisionLimit
     * @return {?}
     */
    function (value, precisionLimit) {
        return +(value.toPrecision(precisionLimit));
    };
    /**
     * @param {?} value
     * @param {?} modulo
     * @param {?} precisionLimit
     * @return {?}
     */
    MathHelper.isModuloWithinPrecisionLimit = /**
     * @param {?} value
     * @param {?} modulo
     * @param {?} precisionLimit
     * @return {?}
     */
    function (value, modulo, precisionLimit) {
        /** @type {?} */
        var limit = Math.pow(10, -precisionLimit);
        return Math.abs(value % modulo) <= limit || Math.abs(Math.abs(value % modulo) - modulo) <= limit;
    };
    /**
     * @param {?} value
     * @param {?} floor
     * @param {?} ceil
     * @return {?}
     */
    MathHelper.clampToRange = /**
     * @param {?} value
     * @param {?} floor
     * @param {?} ceil
     * @return {?}
     */
    function (value, floor, ceil) {
        return Math.min(Math.max(value, floor), ceil);
    };
    return MathHelper;
}());
/**
 * Helper with mathematical functions
 */
export { MathHelper };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0aC1oZWxwZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci8iLCJzb3VyY2VzIjpbIm1hdGgtaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7O0FBQUE7OztJQUNFLDJEQUEyRDs7Ozs7O0lBQ3BELGdDQUFxQjs7Ozs7SUFBNUIsVUFBNkIsS0FBYSxFQUFFLGNBQXNCO1FBQ2hFLE9BQU8sQ0FBQyxDQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUUsQ0FBQztLQUMvQzs7Ozs7OztJQUVNLHVDQUE0Qjs7Ozs7O0lBQW5DLFVBQW9DLEtBQWEsRUFBRSxNQUFjLEVBQUUsY0FBc0I7O1FBQ3ZGLElBQU0sS0FBSyxHQUFXLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEQsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUM7S0FDbEc7Ozs7Ozs7SUFFTSx1QkFBWTs7Ozs7O0lBQW5CLFVBQW9CLEtBQWEsRUFBRSxLQUFhLEVBQUUsSUFBWTtRQUM1RCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDL0M7cUJBZEg7SUFlQyxDQUFBOzs7O0FBZEQsc0JBY0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogSGVscGVyIHdpdGggbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucyAqL1xyXG5leHBvcnQgY2xhc3MgTWF0aEhlbHBlciB7XHJcbiAgLyogUm91bmQgbnVtYmVycyB0byBhIGdpdmVuIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgKi9cclxuICBzdGF0aWMgcm91bmRUb1ByZWNpc2lvbkxpbWl0KHZhbHVlOiBudW1iZXIsIHByZWNpc2lvbkxpbWl0OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuICsoIHZhbHVlLnRvUHJlY2lzaW9uKHByZWNpc2lvbkxpbWl0KSApO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGlzTW9kdWxvV2l0aGluUHJlY2lzaW9uTGltaXQodmFsdWU6IG51bWJlciwgbW9kdWxvOiBudW1iZXIsIHByZWNpc2lvbkxpbWl0OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGxpbWl0OiBudW1iZXIgPSBNYXRoLnBvdygxMCwgLXByZWNpc2lvbkxpbWl0KTtcclxuICAgIHJldHVybiBNYXRoLmFicyh2YWx1ZSAlIG1vZHVsbykgPD0gbGltaXQgfHwgTWF0aC5hYnMoTWF0aC5hYnModmFsdWUgJSBtb2R1bG8pIC0gbW9kdWxvKSA8PSBsaW1pdDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjbGFtcFRvUmFuZ2UodmFsdWU6IG51bWJlciwgZmxvb3I6IG51bWJlciwgY2VpbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgZmxvb3IpLCBjZWlsKTtcclxuICB9XHJcbn1cclxuIl19