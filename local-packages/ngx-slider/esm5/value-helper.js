/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 *  Collection of functions to handle conversions/lookups of values
 */
var /**
 *  Collection of functions to handle conversions/lookups of values
 */
ValueHelper = /** @class */ (function () {
    function ValueHelper() {
    }
    /**
     * @param {?} value
     * @return {?}
     */
    ValueHelper.isNullOrUndefined = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        return value === undefined || value === null;
    };
    /**
     * @param {?} array1
     * @param {?} array2
     * @return {?}
     */
    ValueHelper.areArraysEqual = /**
     * @param {?} array1
     * @param {?} array2
     * @return {?}
     */
    function (array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    };
    /**
     * @param {?} val
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    ValueHelper.linearValueToPosition = /**
     * @param {?} val
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    function (val, minVal, maxVal) {
        /** @type {?} */
        var range = maxVal - minVal;
        return (val - minVal) / range;
    };
    /**
     * @param {?} val
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    ValueHelper.logValueToPosition = /**
     * @param {?} val
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    function (val, minVal, maxVal) {
        val = Math.log(val);
        minVal = Math.log(minVal);
        maxVal = Math.log(maxVal);
        /** @type {?} */
        var range = maxVal - minVal;
        return (val - minVal) / range;
    };
    /**
     * @param {?} percent
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    ValueHelper.linearPositionToValue = /**
     * @param {?} percent
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    function (percent, minVal, maxVal) {
        return percent * (maxVal - minVal) + minVal;
    };
    /**
     * @param {?} percent
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    ValueHelper.logPositionToValue = /**
     * @param {?} percent
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    function (percent, minVal, maxVal) {
        minVal = Math.log(minVal);
        maxVal = Math.log(maxVal);
        /** @type {?} */
        var value = percent * (maxVal - minVal) + minVal;
        return Math.exp(value);
    };
    /**
     * @param {?} modelValue
     * @param {?} stepsArray
     * @return {?}
     */
    ValueHelper.findStepIndex = /**
     * @param {?} modelValue
     * @param {?} stepsArray
     * @return {?}
     */
    function (modelValue, stepsArray) {
        /** @type {?} */
        var differences = stepsArray.map(function (step) { return Math.abs(modelValue - step.value); });
        /** @type {?} */
        var minDifferenceIndex = 0;
        for (var index = 0; index < stepsArray.length; index++) {
            if (differences[index] !== differences[minDifferenceIndex] && differences[index] < differences[minDifferenceIndex]) {
                minDifferenceIndex = index;
            }
        }
        return minDifferenceIndex;
    };
    return ValueHelper;
}());
/**
 *  Collection of functions to handle conversions/lookups of values
 */
export { ValueHelper };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtaGVscGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvIiwic291cmNlcyI6WyJ2YWx1ZS1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBOzs7QUFBQTs7Ozs7OztJQUNTLDZCQUFpQjs7OztJQUF4QixVQUF5QixLQUFVO1FBQ2pDLE9BQU8sS0FBSyxLQUFLLFNBQVMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDO0tBQzlDOzs7Ozs7SUFFTSwwQkFBYzs7Ozs7SUFBckIsVUFBc0IsTUFBYSxFQUFFLE1BQWE7UUFDaEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDbkMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzlDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDM0IsT0FBTyxLQUFLLENBQUM7YUFDZDtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUM7S0FDYjs7Ozs7OztJQUVNLGlDQUFxQjs7Ozs7O0lBQTVCLFVBQTZCLEdBQVcsRUFBRSxNQUFjLEVBQUUsTUFBYzs7UUFDdEUsSUFBTSxLQUFLLEdBQVcsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN0QyxPQUFPLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUMvQjs7Ozs7OztJQUVNLDhCQUFrQjs7Ozs7O0lBQXpCLFVBQTBCLEdBQVcsRUFBRSxNQUFjLEVBQUUsTUFBYztRQUNuRSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQixNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7UUFDMUIsSUFBTSxLQUFLLEdBQVcsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN0QyxPQUFPLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQztLQUMvQjs7Ozs7OztJQUVNLGlDQUFxQjs7Ozs7O0lBQTVCLFVBQTZCLE9BQWUsRUFBRSxNQUFjLEVBQUUsTUFBYztRQUMxRSxPQUFPLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7S0FDN0M7Ozs7Ozs7SUFFTSw4QkFBa0I7Ozs7OztJQUF6QixVQUEwQixPQUFlLEVBQUUsTUFBYyxFQUFFLE1BQWM7UUFDdkUsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUIsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O1FBQzFCLElBQU0sS0FBSyxHQUFXLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDM0QsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3hCOzs7Ozs7SUFFTSx5QkFBYTs7Ozs7SUFBcEIsVUFBcUIsVUFBa0IsRUFBRSxVQUFrQzs7UUFDekUsSUFBTSxXQUFXLEdBQWEsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQTBCLElBQWEsT0FBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQWpDLENBQWlDLENBQUMsQ0FBQzs7UUFFeEgsSUFBSSxrQkFBa0IsR0FBVyxDQUFDLENBQUM7UUFDbkMsS0FBSyxJQUFJLEtBQUssR0FBVyxDQUFDLEVBQUUsS0FBSyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDOUQsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssV0FBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFO2dCQUNsSCxrQkFBa0IsR0FBRyxLQUFLLENBQUM7YUFDNUI7U0FDRjtRQUVELE9BQU8sa0JBQWtCLENBQUM7S0FDM0I7c0JBM0RIO0lBNERDLENBQUE7Ozs7QUF2REQsdUJBdURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ3VzdG9tU3RlcERlZmluaXRpb24gfSBmcm9tICcuL29wdGlvbnMnO1xyXG5cclxuLyoqXHJcbiAqICBDb2xsZWN0aW9uIG9mIGZ1bmN0aW9ucyB0byBoYW5kbGUgY29udmVyc2lvbnMvbG9va3VwcyBvZiB2YWx1ZXNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBWYWx1ZUhlbHBlciB7XHJcbiAgc3RhdGljIGlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBudWxsO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGFyZUFycmF5c0VxdWFsKGFycmF5MTogYW55W10sIGFycmF5MjogYW55W10pOiBib29sZWFuIHtcclxuICAgIGlmIChhcnJheTEubGVuZ3RoICE9PSBhcnJheTIubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgYXJyYXkxLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgIGlmIChhcnJheTFbaV0gIT09IGFycmF5MltpXSkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxpbmVhclZhbHVlVG9Qb3NpdGlvbih2YWw6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHJhbmdlOiBudW1iZXIgPSBtYXhWYWwgLSBtaW5WYWw7XHJcbiAgICByZXR1cm4gKHZhbCAtIG1pblZhbCkgLyByYW5nZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2dWYWx1ZVRvUG9zaXRpb24odmFsOiBudW1iZXIsIG1pblZhbDogbnVtYmVyLCBtYXhWYWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICB2YWwgPSBNYXRoLmxvZyh2YWwpO1xyXG4gICAgbWluVmFsID0gTWF0aC5sb2cobWluVmFsKTtcclxuICAgIG1heFZhbCA9IE1hdGgubG9nKG1heFZhbCk7XHJcbiAgICBjb25zdCByYW5nZTogbnVtYmVyID0gbWF4VmFsIC0gbWluVmFsO1xyXG4gICAgcmV0dXJuICh2YWwgLSBtaW5WYWwpIC8gcmFuZ2U7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbGluZWFyUG9zaXRpb25Ub1ZhbHVlKHBlcmNlbnQ6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBwZXJjZW50ICogKG1heFZhbCAtIG1pblZhbCkgKyBtaW5WYWw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbG9nUG9zaXRpb25Ub1ZhbHVlKHBlcmNlbnQ6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIG1pblZhbCA9IE1hdGgubG9nKG1pblZhbCk7XHJcbiAgICBtYXhWYWwgPSBNYXRoLmxvZyhtYXhWYWwpO1xyXG4gICAgY29uc3QgdmFsdWU6IG51bWJlciA9IHBlcmNlbnQgKiAobWF4VmFsIC0gbWluVmFsKSArIG1pblZhbDtcclxuICAgIHJldHVybiBNYXRoLmV4cCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZmluZFN0ZXBJbmRleChtb2RlbFZhbHVlOiBudW1iZXIsIHN0ZXBzQXJyYXk6IEN1c3RvbVN0ZXBEZWZpbml0aW9uW10pOiBudW1iZXIge1xyXG4gICAgY29uc3QgZGlmZmVyZW5jZXM6IG51bWJlcltdID0gc3RlcHNBcnJheS5tYXAoKHN0ZXA6IEN1c3RvbVN0ZXBEZWZpbml0aW9uKTogbnVtYmVyID0+IE1hdGguYWJzKG1vZGVsVmFsdWUgLSBzdGVwLnZhbHVlKSk7XHJcblxyXG4gICAgbGV0IG1pbkRpZmZlcmVuY2VJbmRleDogbnVtYmVyID0gMDtcclxuICAgIGZvciAobGV0IGluZGV4OiBudW1iZXIgPSAwOyBpbmRleCA8IHN0ZXBzQXJyYXkubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgIGlmIChkaWZmZXJlbmNlc1tpbmRleF0gIT09IGRpZmZlcmVuY2VzW21pbkRpZmZlcmVuY2VJbmRleF0gJiYgZGlmZmVyZW5jZXNbaW5kZXhdIDwgZGlmZmVyZW5jZXNbbWluRGlmZmVyZW5jZUluZGV4XSkge1xyXG4gICAgICAgIG1pbkRpZmZlcmVuY2VJbmRleCA9IGluZGV4O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1pbkRpZmZlcmVuY2VJbmRleDtcclxuICB9XHJcbn1cclxuIl19