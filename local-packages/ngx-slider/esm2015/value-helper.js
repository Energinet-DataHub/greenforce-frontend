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
 *  Collection of functions to handle conversions/lookups of values
 */
export class ValueHelper {
    /**
     * @param {?} value
     * @return {?}
     */
    static isNullOrUndefined(value) {
        return value === undefined || value === null;
    }
    /**
     * @param {?} array1
     * @param {?} array2
     * @return {?}
     */
    static areArraysEqual(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (let i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
        return true;
    }
    /**
     * @param {?} val
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    static linearValueToPosition(val, minVal, maxVal) {
        /** @type {?} */
        const range = maxVal - minVal;
        return (val - minVal) / range;
    }
    /**
     * @param {?} val
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    static logValueToPosition(val, minVal, maxVal) {
        val = Math.log(val);
        minVal = Math.log(minVal);
        maxVal = Math.log(maxVal);
        /** @type {?} */
        const range = maxVal - minVal;
        return (val - minVal) / range;
    }
    /**
     * @param {?} percent
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    static linearPositionToValue(percent, minVal, maxVal) {
        return percent * (maxVal - minVal) + minVal;
    }
    /**
     * @param {?} percent
     * @param {?} minVal
     * @param {?} maxVal
     * @return {?}
     */
    static logPositionToValue(percent, minVal, maxVal) {
        minVal = Math.log(minVal);
        maxVal = Math.log(maxVal);
        /** @type {?} */
        const value = percent * (maxVal - minVal) + minVal;
        return Math.exp(value);
    }
    /**
     * @param {?} modelValue
     * @param {?} stepsArray
     * @return {?}
     */
    static findStepIndex(modelValue, stepsArray) {
        /** @type {?} */
        const differences = stepsArray.map((step) => Math.abs(modelValue - step.value));
        /** @type {?} */
        let minDifferenceIndex = 0;
        for (let index = 0; index < stepsArray.length; index++) {
            if (differences[index] !== differences[minDifferenceIndex] && differences[index] < differences[minDifferenceIndex]) {
                minDifferenceIndex = index;
            }
        }
        return minDifferenceIndex;
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWUtaGVscGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvIiwic291cmNlcyI6WyJ2YWx1ZS1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUtBLE1BQU07Ozs7O0lBQ0osTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQVU7UUFDakMsT0FBTyxLQUFLLEtBQUssU0FBUyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUM7S0FDOUM7Ozs7OztJQUVELE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBYSxFQUFFLE1BQWE7UUFDaEQsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDbkMsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUVELEtBQUssSUFBSSxDQUFDLEdBQVcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQzlDLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDM0IsT0FBTyxLQUFLLENBQUM7YUFDZDtTQUNGO1FBRUQsT0FBTyxJQUFJLENBQUM7S0FDYjs7Ozs7OztJQUVELE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxHQUFXLEVBQUUsTUFBYyxFQUFFLE1BQWM7O1FBQ3RFLE1BQU0sS0FBSyxHQUFXLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDdEMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDL0I7Ozs7Ozs7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBVyxFQUFFLE1BQWMsRUFBRSxNQUFjO1FBQ25FLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUMxQixNQUFNLEtBQUssR0FBVyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQy9COzs7Ozs7O0lBRUQsTUFBTSxDQUFDLHFCQUFxQixDQUFDLE9BQWUsRUFBRSxNQUFjLEVBQUUsTUFBYztRQUMxRSxPQUFPLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7S0FDN0M7Ozs7Ozs7SUFFRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBZSxFQUFFLE1BQWMsRUFBRSxNQUFjO1FBQ3ZFLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzFCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztRQUMxQixNQUFNLEtBQUssR0FBVyxPQUFPLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO1FBQzNELE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4Qjs7Ozs7O0lBRUQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFrQixFQUFFLFVBQWtDOztRQUN6RSxNQUFNLFdBQVcsR0FBYSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBMEIsRUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7O1FBRXhILElBQUksa0JBQWtCLEdBQVcsQ0FBQyxDQUFDO1FBQ25DLEtBQUssSUFBSSxLQUFLLEdBQVcsQ0FBQyxFQUFFLEtBQUssR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzlELElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxXQUFXLENBQUMsa0JBQWtCLENBQUMsRUFBRTtnQkFDbEgsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO2FBQzVCO1NBQ0Y7UUFFRCxPQUFPLGtCQUFrQixDQUFDO0tBQzNCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDdXN0b21TdGVwRGVmaW5pdGlvbiB9IGZyb20gJy4vb3B0aW9ucyc7XHJcblxyXG4vKipcclxuICogIENvbGxlY3Rpb24gb2YgZnVuY3Rpb25zIHRvIGhhbmRsZSBjb252ZXJzaW9ucy9sb29rdXBzIG9mIHZhbHVlc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFZhbHVlSGVscGVyIHtcclxuICBzdGF0aWMgaXNOdWxsT3JVbmRlZmluZWQodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYXJlQXJyYXlzRXF1YWwoYXJyYXkxOiBhbnlbXSwgYXJyYXkyOiBhbnlbXSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKGFycmF5MS5sZW5ndGggIT09IGFycmF5Mi5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhcnJheTEubGVuZ3RoOyArK2kpIHtcclxuICAgICAgaWYgKGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbGluZWFyVmFsdWVUb1Bvc2l0aW9uKHZhbDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3QgcmFuZ2U6IG51bWJlciA9IG1heFZhbCAtIG1pblZhbDtcclxuICAgIHJldHVybiAodmFsIC0gbWluVmFsKSAvIHJhbmdlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvZ1ZhbHVlVG9Qb3NpdGlvbih2YWw6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHZhbCA9IE1hdGgubG9nKHZhbCk7XHJcbiAgICBtaW5WYWwgPSBNYXRoLmxvZyhtaW5WYWwpO1xyXG4gICAgbWF4VmFsID0gTWF0aC5sb2cobWF4VmFsKTtcclxuICAgIGNvbnN0IHJhbmdlOiBudW1iZXIgPSBtYXhWYWwgLSBtaW5WYWw7XHJcbiAgICByZXR1cm4gKHZhbCAtIG1pblZhbCkgLyByYW5nZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsaW5lYXJQb3NpdGlvblRvVmFsdWUocGVyY2VudDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHBlcmNlbnQgKiAobWF4VmFsIC0gbWluVmFsKSArIG1pblZhbDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2dQb3NpdGlvblRvVmFsdWUocGVyY2VudDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgbWluVmFsID0gTWF0aC5sb2cobWluVmFsKTtcclxuICAgIG1heFZhbCA9IE1hdGgubG9nKG1heFZhbCk7XHJcbiAgICBjb25zdCB2YWx1ZTogbnVtYmVyID0gcGVyY2VudCAqIChtYXhWYWwgLSBtaW5WYWwpICsgbWluVmFsO1xyXG4gICAgcmV0dXJuIE1hdGguZXhwKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmaW5kU3RlcEluZGV4KG1vZGVsVmFsdWU6IG51bWJlciwgc3RlcHNBcnJheTogQ3VzdG9tU3RlcERlZmluaXRpb25bXSk6IG51bWJlciB7XHJcbiAgICBjb25zdCBkaWZmZXJlbmNlczogbnVtYmVyW10gPSBzdGVwc0FycmF5Lm1hcCgoc3RlcDogQ3VzdG9tU3RlcERlZmluaXRpb24pOiBudW1iZXIgPT4gTWF0aC5hYnMobW9kZWxWYWx1ZSAtIHN0ZXAudmFsdWUpKTtcclxuXHJcbiAgICBsZXQgbWluRGlmZmVyZW5jZUluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgc3RlcHNBcnJheS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgaWYgKGRpZmZlcmVuY2VzW2luZGV4XSAhPT0gZGlmZmVyZW5jZXNbbWluRGlmZmVyZW5jZUluZGV4XSAmJiBkaWZmZXJlbmNlc1tpbmRleF0gPCBkaWZmZXJlbmNlc1ttaW5EaWZmZXJlbmNlSW5kZXhdKSB7XHJcbiAgICAgICAgbWluRGlmZmVyZW5jZUluZGV4ID0gaW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWluRGlmZmVyZW5jZUluZGV4O1xyXG4gIH1cclxufVxyXG4iXX0=