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
/** @enum {number} */
var LabelType = {
    /** Label above low pointer */
    Low: 0,
    /** Label above high pointer */
    High: 1,
    /** Label for minimum slider value */
    Floor: 2,
    /** Label for maximum slider value */
    Ceil: 3,
    /** Label below legend tick */
    TickValue: 4,
};
export { LabelType };
LabelType[LabelType.Low] = 'Low';
LabelType[LabelType.High] = 'High';
LabelType[LabelType.Floor] = 'Floor';
LabelType[LabelType.Ceil] = 'Ceil';
LabelType[LabelType.TickValue] = 'TickValue';
/** @typedef {?} */
var TranslateFunction;
export { TranslateFunction };
/** @typedef {?} */
var CombineLabelsFunction;
export { CombineLabelsFunction };
/** @typedef {?} */
var GetLegendFunction;
export { GetLegendFunction };
/** @typedef {?} */
var GetStepLegendFunction;
export { GetStepLegendFunction };
/** @typedef {?} */
var ValueToPositionFunction;
export { ValueToPositionFunction };
/** @typedef {?} */
var PositionToValueFunction;
export { PositionToValueFunction };
/**
 * Custom step definition
 *
 * This can be used to specify custom values and legend values for slider ticks
 * @record
 */
export function CustomStepDefinition() { }
/**
 * Value
 * @type {?}
 */
CustomStepDefinition.prototype.value;
/**
 * Legend (label for the value)
 * @type {?|undefined}
 */
CustomStepDefinition.prototype.legend;
/**
 * Slider options
 */
var /**
 * Slider options
 */
Options = /** @class */ (function () {
    function Options() {
        /**
         * Minimum value for a slider.
         * Not applicable when using stepsArray.
         */
        this.floor = 0;
        /**
         * Maximum value for a slider.
         * Not applicable when using stepsArray.
         */
        this.ceil = null;
        /**
         * Step between each value.
         * Not applicable when using stepsArray.
         */
        this.step = 1;
        /**
         * The minimum range authorized on the slider.
         * Applies to range slider only.
         * When using stepsArray, expressed as index into stepsArray.
         */
        this.minRange = null;
        /**
         * The maximum range authorized on the slider.
         * Applies to range slider only.
         * When using stepsArray, expressed as index into stepsArray.
         */
        this.maxRange = null;
        /**
         * Set to true to have a push behavior. When the min handle goes above the max,
         * the max is moved as well (and vice-versa). The range between min and max is
         * defined by the step option (defaults to 1) and can also be overriden by
         * the minRange option. Applies to range slider only.
         */
        this.pushRange = false;
        /**
         * The minimum value authorized on the slider.
         * When using stepsArray, expressed as index into stepsArray.
         */
        this.minLimit = null;
        /**
         * The maximum value authorized on the slider.
         * When using stepsArray, expressed as index into stepsArray.
         */
        this.maxLimit = null;
        /**
         * Custom translate function. Use this if you want to translate values displayed
         * on the slider.
         */
        this.translate = null;
        /**
         * Custom function for combining overlapping labels in range slider.
         * It takes the min and max values (already translated with translate fuction)
         * and should return how these two values should be combined.
         * If not provided, the default function will join the two values with
         * ' - ' as separator.
         */
        this.combineLabels = null;
        /**
         * Use to display legend under ticks (thus, it needs to be used along with
         * showTicks or showTicksValues). The function will be called with each tick
         * value and returned content will be displayed under the tick as a legend.
         * If the returned value is null, then no legend is displayed under
         * the corresponding tick.You can also directly provide the legend values
         * in the stepsArray option.
         */
        this.getLegend = null;
        /**
         * Use to display a custom legend of a stepItem from stepsArray.
         * It will be the same as getLegend but for stepsArray.
         */
        this.getStepLegend = null;
        /**
         * If you want to display a slider with non linear/number steps.
         * Just pass an array with each slider value and that's it; the floor, ceil and step settings
         * of the slider will be computed automatically.
         * By default, the value model and valueHigh model values will be the value of the selected item
         * in the stepsArray.
         * They can also be bound to the index of the selected item by setting the bindIndexForStepsArray
         * option to true.
         */
        this.stepsArray = null;
        /**
         * Set to true to bind the index of the selected item to value model and valueHigh model.
         */
        this.bindIndexForStepsArray = false;
        /**
         * When set to true and using a range slider, the range can be dragged by the selection bar.
         * Applies to range slider only.
         */
        this.draggableRange = false;
        /**
         * Same as draggableRange but the slider range can't be changed.
         * Applies to range slider only.
         */
        this.draggableRangeOnly = false;
        /**
         * Set to true to always show the selection bar before the slider handle.
         */
        this.showSelectionBar = false;
        /**
         * Set to true to always show the selection bar after the slider handle.
         */
        this.showSelectionBarEnd = false;
        /**
         * Set a number to draw the selection bar between this value and the slider handle.
         * When using stepsArray, expressed as index into stepsArray.
         */
        this.showSelectionBarFromValue = null;
        /**
         * Only for range slider. Set to true to visualize in different colour the areas
         * on the left/right (top/bottom for vertical range slider) of selection bar between the handles.
         */
        this.showOuterSelectionBars = false;
        /**
         * Set to true to hide pointer labels
         */
        this.hidePointerLabels = false;
        /**
         * Set to true to hide min / max labels
         */
        this.hideLimitLabels = false;
        /**
         * Set to false to disable the auto-hiding behavior of the limit labels.
         */
        this.autoHideLimitLabels = true;
        /**
         * Set to true to make the slider read-only.
         */
        this.readOnly = false;
        /**
         * Set to true to disable the slider.
         */
        this.disabled = false;
        /**
         * Set to true to display a tick for each step of the slider.
         */
        this.showTicks = false;
        /**
         * Set to true to display a tick and the step value for each step of the slider..
         */
        this.showTicksValues = false;
        /* The step between each tick to display. If not set, the step value is used.
            Not used when ticksArray is specified. */
        this.tickStep = null;
        /* The step between displaying each tick step value.
            If not set, then tickStep or step is used, depending on which one is set. */
        this.tickValueStep = null;
        /**
         * Use to display ticks at specific positions.
         * The array contains the index of the ticks that should be displayed.
         * For example, [0, 1, 5] will display a tick for the first, second and sixth values.
         */
        this.ticksArray = null;
        /**
         * Used to display a tooltip when a tick is hovered.
         * Set to a function that returns the tooltip content for a given value.
         */
        this.ticksTooltip = null;
        /**
         * Same as ticksTooltip but for ticks values.
         */
        this.ticksValuesTooltip = null;
        /**
         * Set to true to display the slider vertically.
         * The slider will take the full height of its parent.
         * Changing this value at runtime is not currently supported.
         */
        this.vertical = false;
        /**
         * Function that returns the current color of the selection bar.
         * If your color won't change, don't use this option but set it through CSS.
         * If the returned color depends on a model value (either value or valueHigh),
         * you should use the argument passed to the function.
         * Indeed, when the function is called, there is no certainty that the model
         * has already been updated.
         */
        this.getSelectionBarColor = null;
        /**
         * Function that returns the color of a tick. showTicks must be enabled.
         */
        this.getTickColor = null;
        /**
         * Function that returns the current color of a pointer.
         * If your color won't change, don't use this option but set it through CSS.
         * If the returned color depends on a model value (either value or valueHigh),
         * you should use the argument passed to the function.
         * Indeed, when the function is called, there is no certainty that the model has already been updated.
         * To handle range slider pointers independently, you should evaluate pointerType within the given
         * function where "min" stands for value model and "max" for valueHigh model values.
         */
        this.getPointerColor = null;
        /**
         * Handles are focusable (on click or with tab) and can be modified using the following keyboard controls:
         * Left/bottom arrows: -1
         * Right/top arrows: +1
         * Page-down: -10%
         * Page-up: +10%
         * Home: minimum value
         * End: maximum value
         */
        this.keyboardSupport = true;
        /**
         * If you display the slider in an element that uses transform: scale(0.5), set the scale value to 2
         * so that the slider is rendered properly and the events are handled correctly.
         */
        this.scale = 1;
        /**
         * If you display the slider in an element that uses transform: rotate(90deg), set the rotate value to 90
         * so that the slider is rendered properly and the events are handled correctly. Value is in degrees.
         */
        this.rotate = 0;
        /**
         * Set to true to force the value(s) to be rounded to the step, even when modified from the outside.
         * When set to false, if the model values are modified from outside the slider, they are not rounded
         * and can be between two steps.
         */
        this.enforceStep = true;
        /**
         * Set to true to force the value(s) to be normalised to allowed range (floor to ceil), even when modified from the outside.
         * When set to false, if the model values are modified from outside the slider, and they are outside allowed range,
         * the slider may be rendered incorrectly. However, setting this to false may be useful if you want to perform custom normalisation.
         */
        this.enforceRange = true;
        /**
         * Set to true to force the value(s) to be rounded to the nearest step value, even when modified from the outside.
         * When set to false, if the model values are modified from outside the slider, and they are outside allowed range,
         * the slider may be rendered incorrectly. However, setting this to false may be useful if you want to perform custom normalisation.
         */
        this.enforceStepsArray = true;
        /**
         * Set to true to prevent to user from switching the min and max handles. Applies to range slider only.
         */
        this.noSwitching = false;
        /**
         * Set to true to only bind events on slider handles.
         */
        this.onlyBindHandles = false;
        /**
         * Set to true to show graphs right to left.
         * If vertical is true it will be from top to bottom and left / right arrow functions reversed.
         */
        this.rightToLeft = false;
        /**
         * Set to true to reverse keyboard navigation:
         * Right/top arrows: -1
         * Left/bottom arrows: +1
         * Page-up: -10%
         * Page-down: +10%
         * End: minimum value
         * Home: maximum value
         */
        this.reversedControls = false;
        /**
         * Set to true to keep the slider labels inside the slider bounds.
         */
        this.boundPointerLabels = true;
        /**
         * Set to true to use a logarithmic scale to display the slider.
         */
        this.logScale = false;
        /**
         * Function that returns the position on the slider for a given value.
         * The position must be a percentage between 0 and 1.
         * The function should be monotonically increasing or decreasing; otherwise the slider may behave incorrectly.
         */
        this.customValueToPosition = null;
        /**
         * Function that returns the value for a given position on the slider.
         * The position is a percentage between 0 and 1.
         * The function should be monotonically increasing or decreasing; otherwise the slider may behave incorrectly.
         */
        this.customPositionToValue = null;
        /**
         * Precision limit for calculated values.
         * Values used in calculations will be rounded to this number of significant digits
         * to prevent accumulating small floating-point errors.
         */
        this.precisionLimit = 12;
        /**
         * Use to display the selection bar as a gradient.
         * The given object must contain from and to properties which are colors.
         */
        this.selectionBarGradient = null;
        /**
         * Use to add a label directly to the slider for accessibility. Adds the aria-label attribute.
         */
        this.ariaLabel = 'ngx-slider';
        /**
         * Use instead of ariaLabel to reference the id of an element which will be used to label the slider.
         * Adds the aria-labelledby attribute.
         */
        this.ariaLabelledBy = null;
        /**
         * Use to add a label directly to the slider range for accessibility. Adds the aria-label attribute.
         */
        this.ariaLabelHigh = 'ngx-slider-max';
        /**
         * Use instead of ariaLabelHigh to reference the id of an element which will be used to label the slider range.
         * Adds the aria-labelledby attribute.
         */
        this.ariaLabelledByHigh = null;
        /**
         * Use to increase rendering performance. If the value is not provided, the slider calculates the with/height of the handle
         */
        this.handleDimension = null;
        /**
         * Use to increase rendering performance. If the value is not provided, the slider calculates the with/height of the bar
         */
        this.barDimension = null;
        /**
         * Enable/disable CSS animations
         */
        this.animate = true;
        /**
         * Enable/disable CSS animations while moving the slider
         */
        this.animateOnMove = false;
    }
    return Options;
}());
/**
 * Slider options
 */
export { Options };
if (false) {
    /**
     * Minimum value for a slider.
     * Not applicable when using stepsArray.
     * @type {?}
     */
    Options.prototype.floor;
    /**
     * Maximum value for a slider.
     * Not applicable when using stepsArray.
     * @type {?}
     */
    Options.prototype.ceil;
    /**
     * Step between each value.
     * Not applicable when using stepsArray.
     * @type {?}
     */
    Options.prototype.step;
    /**
     * The minimum range authorized on the slider.
     * Applies to range slider only.
     * When using stepsArray, expressed as index into stepsArray.
     * @type {?}
     */
    Options.prototype.minRange;
    /**
     * The maximum range authorized on the slider.
     * Applies to range slider only.
     * When using stepsArray, expressed as index into stepsArray.
     * @type {?}
     */
    Options.prototype.maxRange;
    /**
     * Set to true to have a push behavior. When the min handle goes above the max,
     * the max is moved as well (and vice-versa). The range between min and max is
     * defined by the step option (defaults to 1) and can also be overriden by
     * the minRange option. Applies to range slider only.
     * @type {?}
     */
    Options.prototype.pushRange;
    /**
     * The minimum value authorized on the slider.
     * When using stepsArray, expressed as index into stepsArray.
     * @type {?}
     */
    Options.prototype.minLimit;
    /**
     * The maximum value authorized on the slider.
     * When using stepsArray, expressed as index into stepsArray.
     * @type {?}
     */
    Options.prototype.maxLimit;
    /**
     * Custom translate function. Use this if you want to translate values displayed
     * on the slider.
     * @type {?}
     */
    Options.prototype.translate;
    /**
     * Custom function for combining overlapping labels in range slider.
     * It takes the min and max values (already translated with translate fuction)
     * and should return how these two values should be combined.
     * If not provided, the default function will join the two values with
     * ' - ' as separator.
     * @type {?}
     */
    Options.prototype.combineLabels;
    /**
     * Use to display legend under ticks (thus, it needs to be used along with
     * showTicks or showTicksValues). The function will be called with each tick
     * value and returned content will be displayed under the tick as a legend.
     * If the returned value is null, then no legend is displayed under
     * the corresponding tick.You can also directly provide the legend values
     * in the stepsArray option.
     * @type {?}
     */
    Options.prototype.getLegend;
    /**
     * Use to display a custom legend of a stepItem from stepsArray.
     * It will be the same as getLegend but for stepsArray.
     * @type {?}
     */
    Options.prototype.getStepLegend;
    /**
     * If you want to display a slider with non linear/number steps.
     * Just pass an array with each slider value and that's it; the floor, ceil and step settings
     * of the slider will be computed automatically.
     * By default, the value model and valueHigh model values will be the value of the selected item
     * in the stepsArray.
     * They can also be bound to the index of the selected item by setting the bindIndexForStepsArray
     * option to true.
     * @type {?}
     */
    Options.prototype.stepsArray;
    /**
     * Set to true to bind the index of the selected item to value model and valueHigh model.
     * @type {?}
     */
    Options.prototype.bindIndexForStepsArray;
    /**
     * When set to true and using a range slider, the range can be dragged by the selection bar.
     * Applies to range slider only.
     * @type {?}
     */
    Options.prototype.draggableRange;
    /**
     * Same as draggableRange but the slider range can't be changed.
     * Applies to range slider only.
     * @type {?}
     */
    Options.prototype.draggableRangeOnly;
    /**
     * Set to true to always show the selection bar before the slider handle.
     * @type {?}
     */
    Options.prototype.showSelectionBar;
    /**
     * Set to true to always show the selection bar after the slider handle.
     * @type {?}
     */
    Options.prototype.showSelectionBarEnd;
    /**
     * Set a number to draw the selection bar between this value and the slider handle.
     * When using stepsArray, expressed as index into stepsArray.
     * @type {?}
     */
    Options.prototype.showSelectionBarFromValue;
    /**
     * Only for range slider. Set to true to visualize in different colour the areas
     * on the left/right (top/bottom for vertical range slider) of selection bar between the handles.
     * @type {?}
     */
    Options.prototype.showOuterSelectionBars;
    /**
     * Set to true to hide pointer labels
     * @type {?}
     */
    Options.prototype.hidePointerLabels;
    /**
     * Set to true to hide min / max labels
     * @type {?}
     */
    Options.prototype.hideLimitLabels;
    /**
     * Set to false to disable the auto-hiding behavior of the limit labels.
     * @type {?}
     */
    Options.prototype.autoHideLimitLabels;
    /**
     * Set to true to make the slider read-only.
     * @type {?}
     */
    Options.prototype.readOnly;
    /**
     * Set to true to disable the slider.
     * @type {?}
     */
    Options.prototype.disabled;
    /**
     * Set to true to display a tick for each step of the slider.
     * @type {?}
     */
    Options.prototype.showTicks;
    /**
     * Set to true to display a tick and the step value for each step of the slider..
     * @type {?}
     */
    Options.prototype.showTicksValues;
    /** @type {?} */
    Options.prototype.tickStep;
    /** @type {?} */
    Options.prototype.tickValueStep;
    /**
     * Use to display ticks at specific positions.
     * The array contains the index of the ticks that should be displayed.
     * For example, [0, 1, 5] will display a tick for the first, second and sixth values.
     * @type {?}
     */
    Options.prototype.ticksArray;
    /**
     * Used to display a tooltip when a tick is hovered.
     * Set to a function that returns the tooltip content for a given value.
     * @type {?}
     */
    Options.prototype.ticksTooltip;
    /**
     * Same as ticksTooltip but for ticks values.
     * @type {?}
     */
    Options.prototype.ticksValuesTooltip;
    /**
     * Set to true to display the slider vertically.
     * The slider will take the full height of its parent.
     * Changing this value at runtime is not currently supported.
     * @type {?}
     */
    Options.prototype.vertical;
    /**
     * Function that returns the current color of the selection bar.
     * If your color won't change, don't use this option but set it through CSS.
     * If the returned color depends on a model value (either value or valueHigh),
     * you should use the argument passed to the function.
     * Indeed, when the function is called, there is no certainty that the model
     * has already been updated.
     * @type {?}
     */
    Options.prototype.getSelectionBarColor;
    /**
     * Function that returns the color of a tick. showTicks must be enabled.
     * @type {?}
     */
    Options.prototype.getTickColor;
    /**
     * Function that returns the current color of a pointer.
     * If your color won't change, don't use this option but set it through CSS.
     * If the returned color depends on a model value (either value or valueHigh),
     * you should use the argument passed to the function.
     * Indeed, when the function is called, there is no certainty that the model has already been updated.
     * To handle range slider pointers independently, you should evaluate pointerType within the given
     * function where "min" stands for value model and "max" for valueHigh model values.
     * @type {?}
     */
    Options.prototype.getPointerColor;
    /**
     * Handles are focusable (on click or with tab) and can be modified using the following keyboard controls:
     * Left/bottom arrows: -1
     * Right/top arrows: +1
     * Page-down: -10%
     * Page-up: +10%
     * Home: minimum value
     * End: maximum value
     * @type {?}
     */
    Options.prototype.keyboardSupport;
    /**
     * If you display the slider in an element that uses transform: scale(0.5), set the scale value to 2
     * so that the slider is rendered properly and the events are handled correctly.
     * @type {?}
     */
    Options.prototype.scale;
    /**
     * If you display the slider in an element that uses transform: rotate(90deg), set the rotate value to 90
     * so that the slider is rendered properly and the events are handled correctly. Value is in degrees.
     * @type {?}
     */
    Options.prototype.rotate;
    /**
     * Set to true to force the value(s) to be rounded to the step, even when modified from the outside.
     * When set to false, if the model values are modified from outside the slider, they are not rounded
     * and can be between two steps.
     * @type {?}
     */
    Options.prototype.enforceStep;
    /**
     * Set to true to force the value(s) to be normalised to allowed range (floor to ceil), even when modified from the outside.
     * When set to false, if the model values are modified from outside the slider, and they are outside allowed range,
     * the slider may be rendered incorrectly. However, setting this to false may be useful if you want to perform custom normalisation.
     * @type {?}
     */
    Options.prototype.enforceRange;
    /**
     * Set to true to force the value(s) to be rounded to the nearest step value, even when modified from the outside.
     * When set to false, if the model values are modified from outside the slider, and they are outside allowed range,
     * the slider may be rendered incorrectly. However, setting this to false may be useful if you want to perform custom normalisation.
     * @type {?}
     */
    Options.prototype.enforceStepsArray;
    /**
     * Set to true to prevent to user from switching the min and max handles. Applies to range slider only.
     * @type {?}
     */
    Options.prototype.noSwitching;
    /**
     * Set to true to only bind events on slider handles.
     * @type {?}
     */
    Options.prototype.onlyBindHandles;
    /**
     * Set to true to show graphs right to left.
     * If vertical is true it will be from top to bottom and left / right arrow functions reversed.
     * @type {?}
     */
    Options.prototype.rightToLeft;
    /**
     * Set to true to reverse keyboard navigation:
     * Right/top arrows: -1
     * Left/bottom arrows: +1
     * Page-up: -10%
     * Page-down: +10%
     * End: minimum value
     * Home: maximum value
     * @type {?}
     */
    Options.prototype.reversedControls;
    /**
     * Set to true to keep the slider labels inside the slider bounds.
     * @type {?}
     */
    Options.prototype.boundPointerLabels;
    /**
     * Set to true to use a logarithmic scale to display the slider.
     * @type {?}
     */
    Options.prototype.logScale;
    /**
     * Function that returns the position on the slider for a given value.
     * The position must be a percentage between 0 and 1.
     * The function should be monotonically increasing or decreasing; otherwise the slider may behave incorrectly.
     * @type {?}
     */
    Options.prototype.customValueToPosition;
    /**
     * Function that returns the value for a given position on the slider.
     * The position is a percentage between 0 and 1.
     * The function should be monotonically increasing or decreasing; otherwise the slider may behave incorrectly.
     * @type {?}
     */
    Options.prototype.customPositionToValue;
    /**
     * Precision limit for calculated values.
     * Values used in calculations will be rounded to this number of significant digits
     * to prevent accumulating small floating-point errors.
     * @type {?}
     */
    Options.prototype.precisionLimit;
    /**
     * Use to display the selection bar as a gradient.
     * The given object must contain from and to properties which are colors.
     * @type {?}
     */
    Options.prototype.selectionBarGradient;
    /**
     * Use to add a label directly to the slider for accessibility. Adds the aria-label attribute.
     * @type {?}
     */
    Options.prototype.ariaLabel;
    /**
     * Use instead of ariaLabel to reference the id of an element which will be used to label the slider.
     * Adds the aria-labelledby attribute.
     * @type {?}
     */
    Options.prototype.ariaLabelledBy;
    /**
     * Use to add a label directly to the slider range for accessibility. Adds the aria-label attribute.
     * @type {?}
     */
    Options.prototype.ariaLabelHigh;
    /**
     * Use instead of ariaLabelHigh to reference the id of an element which will be used to label the slider range.
     * Adds the aria-labelledby attribute.
     * @type {?}
     */
    Options.prototype.ariaLabelledByHigh;
    /**
     * Use to increase rendering performance. If the value is not provided, the slider calculates the with/height of the handle
     * @type {?}
     */
    Options.prototype.handleDimension;
    /**
     * Use to increase rendering performance. If the value is not provided, the slider calculates the with/height of the bar
     * @type {?}
     */
    Options.prototype.barDimension;
    /**
     * Enable/disable CSS animations
     * @type {?}
     */
    Options.prototype.animate;
    /**
     * Enable/disable CSS animations while moving the slider
     * @type {?}
     */
    Options.prototype.animateOnMove;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyLyIsInNvdXJjZXMiOlsib3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0lBS0UsTUFBRzs7SUFFSCxPQUFJOztJQUVKLFFBQUs7O0lBRUwsT0FBSTs7SUFFSixZQUFTOzs7b0JBUlQsR0FBRztvQkFFSCxJQUFJO29CQUVKLEtBQUs7b0JBRUwsSUFBSTtvQkFFSixTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Qlg7OztBQUFBOzs7Ozs7cUJBR21CLENBQUM7Ozs7O29CQUlGLElBQUk7Ozs7O29CQUlKLENBQUM7Ozs7Ozt3QkFLRyxJQUFJOzs7Ozs7d0JBS0osSUFBSTs7Ozs7Ozt5QkFNRixLQUFLOzs7Ozt3QkFJUCxJQUFJOzs7Ozt3QkFJSixJQUFJOzs7Ozt5QkFJUSxJQUFJOzs7Ozs7Ozs2QkFPSSxJQUFJOzs7Ozs7Ozs7eUJBUVosSUFBSTs7Ozs7NkJBSUksSUFBSTs7Ozs7Ozs7OzswQkFTTixJQUFJOzs7O3NDQUdQLEtBQUs7Ozs7OzhCQUliLEtBQUs7Ozs7O2tDQUlELEtBQUs7Ozs7Z0NBR1AsS0FBSzs7OzttQ0FHRixLQUFLOzs7Ozt5Q0FJQSxJQUFJOzs7OztzQ0FJTixLQUFLOzs7O2lDQUdWLEtBQUs7Ozs7K0JBR1AsS0FBSzs7OzttQ0FHRCxJQUFJOzs7O3dCQUdmLEtBQUs7Ozs7d0JBR0wsS0FBSzs7Ozt5QkFHSixLQUFLOzs7OytCQUdDLEtBQUs7Ozt3QkFJYixJQUFJOzs7NkJBSUMsSUFBSTs7Ozs7OzBCQUtMLElBQUk7Ozs7OzRCQUllLElBQUk7Ozs7a0NBR0UsSUFBSTs7Ozs7O3dCQUtoQyxLQUFLOzs7Ozs7Ozs7b0NBUStDLElBQUk7Ozs7NEJBR2xDLElBQUk7Ozs7Ozs7Ozs7K0JBU3lCLElBQUk7Ozs7Ozs7Ozs7K0JBVWhELElBQUk7Ozs7O3FCQUlmLENBQUM7Ozs7O3NCQUlBLENBQUM7Ozs7OzsyQkFLSyxJQUFJOzs7Ozs7NEJBS0gsSUFBSTs7Ozs7O2lDQUtDLElBQUk7Ozs7MkJBR1YsS0FBSzs7OzsrQkFHRCxLQUFLOzs7OzsyQkFJVCxLQUFLOzs7Ozs7Ozs7O2dDQVVBLEtBQUs7Ozs7a0NBR0gsSUFBSTs7Ozt3QkFHZCxLQUFLOzs7Ozs7cUNBS3dCLElBQUk7Ozs7OztxQ0FLSixJQUFJOzs7Ozs7OEJBSzVCLEVBQUU7Ozs7O29DQUl3QixJQUFJOzs7O3lCQUduQyxZQUFZOzs7Ozs4QkFJUCxJQUFJOzs7OzZCQUdMLGdCQUFnQjs7Ozs7a0NBSVgsSUFBSTs7OzsrQkFHUCxJQUFJOzs7OzRCQUdQLElBQUk7Ozs7dUJBR1IsSUFBSTs7Ozs2QkFHRSxLQUFLOztrQkFqVGpDO0lBa1RDLENBQUE7Ozs7QUF2UUQsbUJBdVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9pbnRlclR5cGUgfSBmcm9tICcuL3BvaW50ZXItdHlwZSc7XHJcblxyXG4vKiogTGFiZWwgdHlwZSAqL1xyXG5leHBvcnQgZW51bSBMYWJlbFR5cGUge1xyXG4gIC8qKiBMYWJlbCBhYm92ZSBsb3cgcG9pbnRlciAqL1xyXG4gIExvdyxcclxuICAvKiogTGFiZWwgYWJvdmUgaGlnaCBwb2ludGVyICovXHJcbiAgSGlnaCxcclxuICAvKiogTGFiZWwgZm9yIG1pbmltdW0gc2xpZGVyIHZhbHVlICovXHJcbiAgRmxvb3IsXHJcbiAgLyoqIExhYmVsIGZvciBtYXhpbXVtIHNsaWRlciB2YWx1ZSAqL1xyXG4gIENlaWwsXHJcbiAgLyoqIExhYmVsIGJlbG93IGxlZ2VuZCB0aWNrICovXHJcbiAgVGlja1ZhbHVlXHJcbn1cclxuXHJcbi8qKiBGdW5jdGlvbiB0byB0cmFuc2xhdGUgbGFiZWwgdmFsdWUgaW50byB0ZXh0ICovXHJcbmV4cG9ydCB0eXBlIFRyYW5zbGF0ZUZ1bmN0aW9uID0gKHZhbHVlOiBudW1iZXIsIGxhYmVsOiBMYWJlbFR5cGUpID0+IHN0cmluZztcclxuLyoqIEZ1bmN0aW9uIHRvIGNvbWJpbmQgKi9cclxuZXhwb3J0IHR5cGUgQ29tYmluZUxhYmVsc0Z1bmN0aW9uID0gKG1pbkxhYmVsOiBzdHJpbmcsIG1heExhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcclxuLyoqIEZ1bmN0aW9uIHRvIHByb3ZpZGUgbGVnZW5kICAqL1xyXG5leHBvcnQgdHlwZSBHZXRMZWdlbmRGdW5jdGlvbiA9ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmc7XHJcbmV4cG9ydCB0eXBlIEdldFN0ZXBMZWdlbmRGdW5jdGlvbiA9IChzdGVwOiBDdXN0b21TdGVwRGVmaW5pdGlvbikgPT4gc3RyaW5nO1xyXG5cclxuLyoqIEZ1bmN0aW9uIGNvbnZlcnRpbmcgc2xpZGVyIHZhbHVlIHRvIHNsaWRlciBwb3NpdGlvbiAqL1xyXG5leHBvcnQgdHlwZSBWYWx1ZVRvUG9zaXRpb25GdW5jdGlvbiA9ICh2YWw6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKSA9PiBudW1iZXI7XHJcblxyXG4vKiogRnVuY3Rpb24gY29udmVydGluZyBzbGlkZXIgcG9zaXRpb24gdG8gc2xpZGVyIHZhbHVlICovXHJcbmV4cG9ydCB0eXBlIFBvc2l0aW9uVG9WYWx1ZUZ1bmN0aW9uID0gKHBlcmNlbnQ6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKSA9PiBudW1iZXI7XHJcblxyXG4vKipcclxuICogQ3VzdG9tIHN0ZXAgZGVmaW5pdGlvblxyXG4gKlxyXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgY3VzdG9tIHZhbHVlcyBhbmQgbGVnZW5kIHZhbHVlcyBmb3Igc2xpZGVyIHRpY2tzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbVN0ZXBEZWZpbml0aW9uIHtcclxuICAvKiogVmFsdWUgKi9cclxuICB2YWx1ZTogbnVtYmVyO1xyXG4gIC8qKiBMZWdlbmQgKGxhYmVsIGZvciB0aGUgdmFsdWUpICovXHJcbiAgbGVnZW5kPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKiogU2xpZGVyIG9wdGlvbnMgKi9cclxuZXhwb3J0IGNsYXNzIE9wdGlvbnMge1xyXG4gIC8qKiBNaW5pbXVtIHZhbHVlIGZvciBhIHNsaWRlci5cclxuICAgIE5vdCBhcHBsaWNhYmxlIHdoZW4gdXNpbmcgc3RlcHNBcnJheS4gKi9cclxuICBmbG9vcj86IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKiBNYXhpbXVtIHZhbHVlIGZvciBhIHNsaWRlci5cclxuICAgIE5vdCBhcHBsaWNhYmxlIHdoZW4gdXNpbmcgc3RlcHNBcnJheS4gKi9cclxuICBjZWlsPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFN0ZXAgYmV0d2VlbiBlYWNoIHZhbHVlLlxyXG4gICAgTm90IGFwcGxpY2FibGUgd2hlbiB1c2luZyBzdGVwc0FycmF5LiAqL1xyXG4gIHN0ZXA/OiBudW1iZXIgPSAxO1xyXG5cclxuICAvKiogVGhlIG1pbmltdW0gcmFuZ2UgYXV0aG9yaXplZCBvbiB0aGUgc2xpZGVyLlxyXG4gICAgQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS5cclxuICAgIFdoZW4gdXNpbmcgc3RlcHNBcnJheSwgZXhwcmVzc2VkIGFzIGluZGV4IGludG8gc3RlcHNBcnJheS4gKi9cclxuICBtaW5SYW5nZT86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBUaGUgbWF4aW11bSByYW5nZSBhdXRob3JpemVkIG9uIHRoZSBzbGlkZXIuXHJcbiAgICBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIG1heFJhbmdlPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGhhdmUgYSBwdXNoIGJlaGF2aW9yLiBXaGVuIHRoZSBtaW4gaGFuZGxlIGdvZXMgYWJvdmUgdGhlIG1heCxcclxuICAgIHRoZSBtYXggaXMgbW92ZWQgYXMgd2VsbCAoYW5kIHZpY2UtdmVyc2EpLiBUaGUgcmFuZ2UgYmV0d2VlbiBtaW4gYW5kIG1heCBpc1xyXG4gICAgZGVmaW5lZCBieSB0aGUgc3RlcCBvcHRpb24gKGRlZmF1bHRzIHRvIDEpIGFuZCBjYW4gYWxzbyBiZSBvdmVycmlkZW4gYnlcclxuICAgIHRoZSBtaW5SYW5nZSBvcHRpb24uIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuICovXHJcbiAgcHVzaFJhbmdlPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogVGhlIG1pbmltdW0gdmFsdWUgYXV0aG9yaXplZCBvbiB0aGUgc2xpZGVyLlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIG1pbkxpbWl0PzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFRoZSBtYXhpbXVtIHZhbHVlIGF1dGhvcml6ZWQgb24gdGhlIHNsaWRlci5cclxuICAgIFdoZW4gdXNpbmcgc3RlcHNBcnJheSwgZXhwcmVzc2VkIGFzIGluZGV4IGludG8gc3RlcHNBcnJheS4gKi9cclxuICBtYXhMaW1pdD86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBDdXN0b20gdHJhbnNsYXRlIGZ1bmN0aW9uLiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byB0cmFuc2xhdGUgdmFsdWVzIGRpc3BsYXllZFxyXG4gICAgICBvbiB0aGUgc2xpZGVyLiAqL1xyXG4gIHRyYW5zbGF0ZT86IFRyYW5zbGF0ZUZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIEN1c3RvbSBmdW5jdGlvbiBmb3IgY29tYmluaW5nIG92ZXJsYXBwaW5nIGxhYmVscyBpbiByYW5nZSBzbGlkZXIuXHJcbiAgICAgIEl0IHRha2VzIHRoZSBtaW4gYW5kIG1heCB2YWx1ZXMgKGFscmVhZHkgdHJhbnNsYXRlZCB3aXRoIHRyYW5zbGF0ZSBmdWN0aW9uKVxyXG4gICAgICBhbmQgc2hvdWxkIHJldHVybiBob3cgdGhlc2UgdHdvIHZhbHVlcyBzaG91bGQgYmUgY29tYmluZWQuXHJcbiAgICAgIElmIG5vdCBwcm92aWRlZCwgdGhlIGRlZmF1bHQgZnVuY3Rpb24gd2lsbCBqb2luIHRoZSB0d28gdmFsdWVzIHdpdGhcclxuICAgICAgJyAtICcgYXMgc2VwYXJhdG9yLiAqL1xyXG4gIGNvbWJpbmVMYWJlbHM/OiBDb21iaW5lTGFiZWxzRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGRpc3BsYXkgbGVnZW5kIHVuZGVyIHRpY2tzICh0aHVzLCBpdCBuZWVkcyB0byBiZSB1c2VkIGFsb25nIHdpdGhcclxuICAgICBzaG93VGlja3Mgb3Igc2hvd1RpY2tzVmFsdWVzKS4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggZWFjaCB0aWNrXHJcbiAgICAgdmFsdWUgYW5kIHJldHVybmVkIGNvbnRlbnQgd2lsbCBiZSBkaXNwbGF5ZWQgdW5kZXIgdGhlIHRpY2sgYXMgYSBsZWdlbmQuXHJcbiAgICAgSWYgdGhlIHJldHVybmVkIHZhbHVlIGlzIG51bGwsIHRoZW4gbm8gbGVnZW5kIGlzIGRpc3BsYXllZCB1bmRlclxyXG4gICAgIHRoZSBjb3JyZXNwb25kaW5nIHRpY2suWW91IGNhbiBhbHNvIGRpcmVjdGx5IHByb3ZpZGUgdGhlIGxlZ2VuZCB2YWx1ZXNcclxuICAgICBpbiB0aGUgc3RlcHNBcnJheSBvcHRpb24uICovXHJcbiAgZ2V0TGVnZW5kPzogR2V0TGVnZW5kRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAgLyoqIFVzZSB0byBkaXNwbGF5IGEgY3VzdG9tIGxlZ2VuZCBvZiBhIHN0ZXBJdGVtIGZyb20gc3RlcHNBcnJheS5cclxuICAgIEl0IHdpbGwgYmUgdGhlIHNhbWUgYXMgZ2V0TGVnZW5kIGJ1dCBmb3Igc3RlcHNBcnJheS4gKi9cclxuICBnZXRTdGVwTGVnZW5kPzogR2V0U3RlcExlZ2VuZEZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIElmIHlvdSB3YW50IHRvIGRpc3BsYXkgYSBzbGlkZXIgd2l0aCBub24gbGluZWFyL251bWJlciBzdGVwcy5cclxuICAgICBKdXN0IHBhc3MgYW4gYXJyYXkgd2l0aCBlYWNoIHNsaWRlciB2YWx1ZSBhbmQgdGhhdCdzIGl0OyB0aGUgZmxvb3IsIGNlaWwgYW5kIHN0ZXAgc2V0dGluZ3NcclxuICAgICBvZiB0aGUgc2xpZGVyIHdpbGwgYmUgY29tcHV0ZWQgYXV0b21hdGljYWxseS5cclxuICAgICBCeSBkZWZhdWx0LCB0aGUgdmFsdWUgbW9kZWwgYW5kIHZhbHVlSGlnaCBtb2RlbCB2YWx1ZXMgd2lsbCBiZSB0aGUgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIGl0ZW1cclxuICAgICBpbiB0aGUgc3RlcHNBcnJheS5cclxuICAgICBUaGV5IGNhbiBhbHNvIGJlIGJvdW5kIHRvIHRoZSBpbmRleCBvZiB0aGUgc2VsZWN0ZWQgaXRlbSBieSBzZXR0aW5nIHRoZSBiaW5kSW5kZXhGb3JTdGVwc0FycmF5XHJcbiAgICAgb3B0aW9uIHRvIHRydWUuICovXHJcbiAgc3RlcHNBcnJheT86IEN1c3RvbVN0ZXBEZWZpbml0aW9uW10gPSBudWxsO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gYmluZCB0aGUgaW5kZXggb2YgdGhlIHNlbGVjdGVkIGl0ZW0gdG8gdmFsdWUgbW9kZWwgYW5kIHZhbHVlSGlnaCBtb2RlbC4gKi9cclxuICBiaW5kSW5kZXhGb3JTdGVwc0FycmF5PzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogV2hlbiBzZXQgdG8gdHJ1ZSBhbmQgdXNpbmcgYSByYW5nZSBzbGlkZXIsIHRoZSByYW5nZSBjYW4gYmUgZHJhZ2dlZCBieSB0aGUgc2VsZWN0aW9uIGJhci5cclxuICAgIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuICovXHJcbiAgZHJhZ2dhYmxlUmFuZ2U/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTYW1lIGFzIGRyYWdnYWJsZVJhbmdlIGJ1dCB0aGUgc2xpZGVyIHJhbmdlIGNhbid0IGJlIGNoYW5nZWQuXHJcbiAgICBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LiAqL1xyXG4gIGRyYWdnYWJsZVJhbmdlT25seT86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGFsd2F5cyBzaG93IHRoZSBzZWxlY3Rpb24gYmFyIGJlZm9yZSB0aGUgc2xpZGVyIGhhbmRsZS4gKi9cclxuICBzaG93U2VsZWN0aW9uQmFyPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gYWx3YXlzIHNob3cgdGhlIHNlbGVjdGlvbiBiYXIgYWZ0ZXIgdGhlIHNsaWRlciBoYW5kbGUuICovXHJcbiAgc2hvd1NlbGVjdGlvbkJhckVuZD86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqICBTZXQgYSBudW1iZXIgdG8gZHJhdyB0aGUgc2VsZWN0aW9uIGJhciBiZXR3ZWVuIHRoaXMgdmFsdWUgYW5kIHRoZSBzbGlkZXIgaGFuZGxlLlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIHNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWU/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogIE9ubHkgZm9yIHJhbmdlIHNsaWRlci4gU2V0IHRvIHRydWUgdG8gdmlzdWFsaXplIGluIGRpZmZlcmVudCBjb2xvdXIgdGhlIGFyZWFzXHJcbiAgICBvbiB0aGUgbGVmdC9yaWdodCAodG9wL2JvdHRvbSBmb3IgdmVydGljYWwgcmFuZ2Ugc2xpZGVyKSBvZiBzZWxlY3Rpb24gYmFyIGJldHdlZW4gdGhlIGhhbmRsZXMuICovXHJcbiAgc2hvd091dGVyU2VsZWN0aW9uQmFycz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGhpZGUgcG9pbnRlciBsYWJlbHMgKi9cclxuICBoaWRlUG9pbnRlckxhYmVscz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGhpZGUgbWluIC8gbWF4IGxhYmVscyAgKi9cclxuICBoaWRlTGltaXRMYWJlbHM/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGUgYXV0by1oaWRpbmcgYmVoYXZpb3Igb2YgdGhlIGxpbWl0IGxhYmVscy4gKi9cclxuICBhdXRvSGlkZUxpbWl0TGFiZWxzPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBtYWtlIHRoZSBzbGlkZXIgcmVhZC1vbmx5LiAqL1xyXG4gIHJlYWRPbmx5PzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB0aGUgc2xpZGVyLiAqL1xyXG4gIGRpc2FibGVkPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZGlzcGxheSBhIHRpY2sgZm9yIGVhY2ggc3RlcCBvZiB0aGUgc2xpZGVyLiAqL1xyXG4gIHNob3dUaWNrcz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGRpc3BsYXkgYSB0aWNrIGFuZCB0aGUgc3RlcCB2YWx1ZSBmb3IgZWFjaCBzdGVwIG9mIHRoZSBzbGlkZXIuLiAqL1xyXG4gIHNob3dUaWNrc1ZhbHVlcz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyogVGhlIHN0ZXAgYmV0d2VlbiBlYWNoIHRpY2sgdG8gZGlzcGxheS4gSWYgbm90IHNldCwgdGhlIHN0ZXAgdmFsdWUgaXMgdXNlZC5cclxuICAgIE5vdCB1c2VkIHdoZW4gdGlja3NBcnJheSBpcyBzcGVjaWZpZWQuICovXHJcbiAgdGlja1N0ZXA/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiBUaGUgc3RlcCBiZXR3ZWVuIGRpc3BsYXlpbmcgZWFjaCB0aWNrIHN0ZXAgdmFsdWUuXHJcbiAgICBJZiBub3Qgc2V0LCB0aGVuIHRpY2tTdGVwIG9yIHN0ZXAgaXMgdXNlZCwgZGVwZW5kaW5nIG9uIHdoaWNoIG9uZSBpcyBzZXQuICovXHJcbiAgdGlja1ZhbHVlU3RlcD86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2UgdG8gZGlzcGxheSB0aWNrcyBhdCBzcGVjaWZpYyBwb3NpdGlvbnMuXHJcbiAgICBUaGUgYXJyYXkgY29udGFpbnMgdGhlIGluZGV4IG9mIHRoZSB0aWNrcyB0aGF0IHNob3VsZCBiZSBkaXNwbGF5ZWQuXHJcbiAgICBGb3IgZXhhbXBsZSwgWzAsIDEsIDVdIHdpbGwgZGlzcGxheSBhIHRpY2sgZm9yIHRoZSBmaXJzdCwgc2Vjb25kIGFuZCBzaXh0aCB2YWx1ZXMuICovXHJcbiAgdGlja3NBcnJheT86IG51bWJlcltdID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZWQgdG8gZGlzcGxheSBhIHRvb2x0aXAgd2hlbiBhIHRpY2sgaXMgaG92ZXJlZC5cclxuICAgIFNldCB0byBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdG9vbHRpcCBjb250ZW50IGZvciBhIGdpdmVuIHZhbHVlLiAqL1xyXG4gIHRpY2tzVG9vbHRpcD86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogU2FtZSBhcyB0aWNrc1Rvb2x0aXAgYnV0IGZvciB0aWNrcyB2YWx1ZXMuICovXHJcbiAgdGlja3NWYWx1ZXNUb29sdGlwPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBkaXNwbGF5IHRoZSBzbGlkZXIgdmVydGljYWxseS5cclxuICAgIFRoZSBzbGlkZXIgd2lsbCB0YWtlIHRoZSBmdWxsIGhlaWdodCBvZiBpdHMgcGFyZW50LlxyXG4gICAgQ2hhbmdpbmcgdGhpcyB2YWx1ZSBhdCBydW50aW1lIGlzIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkLiAqL1xyXG4gIHZlcnRpY2FsPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjdXJyZW50IGNvbG9yIG9mIHRoZSBzZWxlY3Rpb24gYmFyLlxyXG4gICAgSWYgeW91ciBjb2xvciB3b24ndCBjaGFuZ2UsIGRvbid0IHVzZSB0aGlzIG9wdGlvbiBidXQgc2V0IGl0IHRocm91Z2ggQ1NTLlxyXG4gICAgSWYgdGhlIHJldHVybmVkIGNvbG9yIGRlcGVuZHMgb24gYSBtb2RlbCB2YWx1ZSAoZWl0aGVyIHZhbHVlIG9yIHZhbHVlSGlnaCksXHJcbiAgICB5b3Ugc2hvdWxkIHVzZSB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbi5cclxuICAgIEluZGVlZCwgd2hlbiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGVyZSBpcyBubyBjZXJ0YWludHkgdGhhdCB0aGUgbW9kZWxcclxuICAgIGhhcyBhbHJlYWR5IGJlZW4gdXBkYXRlZC4qL1xyXG4gIGdldFNlbGVjdGlvbkJhckNvbG9yPzogKG1pblZhbHVlOiBudW1iZXIsIG1heFZhbHVlPzogbnVtYmVyKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjb2xvciBvZiBhIHRpY2suIHNob3dUaWNrcyBtdXN0IGJlIGVuYWJsZWQuICovXHJcbiAgZ2V0VGlja0NvbG9yPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGN1cnJlbnQgY29sb3Igb2YgYSBwb2ludGVyLlxyXG4gICAgSWYgeW91ciBjb2xvciB3b24ndCBjaGFuZ2UsIGRvbid0IHVzZSB0aGlzIG9wdGlvbiBidXQgc2V0IGl0IHRocm91Z2ggQ1NTLlxyXG4gICAgSWYgdGhlIHJldHVybmVkIGNvbG9yIGRlcGVuZHMgb24gYSBtb2RlbCB2YWx1ZSAoZWl0aGVyIHZhbHVlIG9yIHZhbHVlSGlnaCksXHJcbiAgICB5b3Ugc2hvdWxkIHVzZSB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbi5cclxuICAgIEluZGVlZCwgd2hlbiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGVyZSBpcyBubyBjZXJ0YWludHkgdGhhdCB0aGUgbW9kZWwgaGFzIGFscmVhZHkgYmVlbiB1cGRhdGVkLlxyXG4gICAgVG8gaGFuZGxlIHJhbmdlIHNsaWRlciBwb2ludGVycyBpbmRlcGVuZGVudGx5LCB5b3Ugc2hvdWxkIGV2YWx1YXRlIHBvaW50ZXJUeXBlIHdpdGhpbiB0aGUgZ2l2ZW5cclxuICAgIGZ1bmN0aW9uIHdoZXJlIFwibWluXCIgc3RhbmRzIGZvciB2YWx1ZSBtb2RlbCBhbmQgXCJtYXhcIiBmb3IgdmFsdWVIaWdoIG1vZGVsIHZhbHVlcy4gKi9cclxuICBnZXRQb2ludGVyQ29sb3I/OiAodmFsdWU6IG51bWJlciwgcG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogSGFuZGxlcyBhcmUgZm9jdXNhYmxlIChvbiBjbGljayBvciB3aXRoIHRhYikgYW5kIGNhbiBiZSBtb2RpZmllZCB1c2luZyB0aGUgZm9sbG93aW5nIGtleWJvYXJkIGNvbnRyb2xzOlxyXG4gICAgTGVmdC9ib3R0b20gYXJyb3dzOiAtMVxyXG4gICAgUmlnaHQvdG9wIGFycm93czogKzFcclxuICAgIFBhZ2UtZG93bjogLTEwJVxyXG4gICAgUGFnZS11cDogKzEwJVxyXG4gICAgSG9tZTogbWluaW11bSB2YWx1ZVxyXG4gICAgRW5kOiBtYXhpbXVtIHZhbHVlXHJcbiAgICovXHJcbiAga2V5Ym9hcmRTdXBwb3J0PzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBJZiB5b3UgZGlzcGxheSB0aGUgc2xpZGVyIGluIGFuIGVsZW1lbnQgdGhhdCB1c2VzIHRyYW5zZm9ybTogc2NhbGUoMC41KSwgc2V0IHRoZSBzY2FsZSB2YWx1ZSB0byAyXHJcbiAgICBzbyB0aGF0IHRoZSBzbGlkZXIgaXMgcmVuZGVyZWQgcHJvcGVybHkgYW5kIHRoZSBldmVudHMgYXJlIGhhbmRsZWQgY29ycmVjdGx5LiAqL1xyXG4gIHNjYWxlPzogbnVtYmVyID0gMTtcclxuXHJcbiAgLyoqIElmIHlvdSBkaXNwbGF5IHRoZSBzbGlkZXIgaW4gYW4gZWxlbWVudCB0aGF0IHVzZXMgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpLCBzZXQgdGhlIHJvdGF0ZSB2YWx1ZSB0byA5MFxyXG4gICBzbyB0aGF0IHRoZSBzbGlkZXIgaXMgcmVuZGVyZWQgcHJvcGVybHkgYW5kIHRoZSBldmVudHMgYXJlIGhhbmRsZWQgY29ycmVjdGx5LiBWYWx1ZSBpcyBpbiBkZWdyZWVzLiAqL1xyXG4gIHJvdGF0ZT86IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBmb3JjZSB0aGUgdmFsdWUocykgdG8gYmUgcm91bmRlZCB0byB0aGUgc3RlcCwgZXZlbiB3aGVuIG1vZGlmaWVkIGZyb20gdGhlIG91dHNpZGUuXHJcbiAgICBXaGVuIHNldCB0byBmYWxzZSwgaWYgdGhlIG1vZGVsIHZhbHVlcyBhcmUgbW9kaWZpZWQgZnJvbSBvdXRzaWRlIHRoZSBzbGlkZXIsIHRoZXkgYXJlIG5vdCByb3VuZGVkXHJcbiAgICBhbmQgY2FuIGJlIGJldHdlZW4gdHdvIHN0ZXBzLiAqL1xyXG4gIGVuZm9yY2VTdGVwPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBmb3JjZSB0aGUgdmFsdWUocykgdG8gYmUgbm9ybWFsaXNlZCB0byBhbGxvd2VkIHJhbmdlIChmbG9vciB0byBjZWlsKSwgZXZlbiB3aGVuIG1vZGlmaWVkIGZyb20gdGhlIG91dHNpZGUuXHJcbiAgICBXaGVuIHNldCB0byBmYWxzZSwgaWYgdGhlIG1vZGVsIHZhbHVlcyBhcmUgbW9kaWZpZWQgZnJvbSBvdXRzaWRlIHRoZSBzbGlkZXIsIGFuZCB0aGV5IGFyZSBvdXRzaWRlIGFsbG93ZWQgcmFuZ2UsXHJcbiAgICB0aGUgc2xpZGVyIG1heSBiZSByZW5kZXJlZCBpbmNvcnJlY3RseS4gSG93ZXZlciwgc2V0dGluZyB0aGlzIHRvIGZhbHNlIG1heSBiZSB1c2VmdWwgaWYgeW91IHdhbnQgdG8gcGVyZm9ybSBjdXN0b20gbm9ybWFsaXNhdGlvbi4gKi9cclxuICBlbmZvcmNlUmFuZ2U/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGZvcmNlIHRoZSB2YWx1ZShzKSB0byBiZSByb3VuZGVkIHRvIHRoZSBuZWFyZXN0IHN0ZXAgdmFsdWUsIGV2ZW4gd2hlbiBtb2RpZmllZCBmcm9tIHRoZSBvdXRzaWRlLlxyXG4gICAgV2hlbiBzZXQgdG8gZmFsc2UsIGlmIHRoZSBtb2RlbCB2YWx1ZXMgYXJlIG1vZGlmaWVkIGZyb20gb3V0c2lkZSB0aGUgc2xpZGVyLCBhbmQgdGhleSBhcmUgb3V0c2lkZSBhbGxvd2VkIHJhbmdlLFxyXG4gICAgdGhlIHNsaWRlciBtYXkgYmUgcmVuZGVyZWQgaW5jb3JyZWN0bHkuIEhvd2V2ZXIsIHNldHRpbmcgdGhpcyB0byBmYWxzZSBtYXkgYmUgdXNlZnVsIGlmIHlvdSB3YW50IHRvIHBlcmZvcm0gY3VzdG9tIG5vcm1hbGlzYXRpb24uICovXHJcbiAgZW5mb3JjZVN0ZXBzQXJyYXk/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIHByZXZlbnQgdG8gdXNlciBmcm9tIHN3aXRjaGluZyB0aGUgbWluIGFuZCBtYXggaGFuZGxlcy4gQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS4gKi9cclxuICBub1N3aXRjaGluZz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIG9ubHkgYmluZCBldmVudHMgb24gc2xpZGVyIGhhbmRsZXMuICovXHJcbiAgb25seUJpbmRIYW5kbGVzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gc2hvdyBncmFwaHMgcmlnaHQgdG8gbGVmdC5cclxuICAgIElmIHZlcnRpY2FsIGlzIHRydWUgaXQgd2lsbCBiZSBmcm9tIHRvcCB0byBib3R0b20gYW5kIGxlZnQgLyByaWdodCBhcnJvdyBmdW5jdGlvbnMgcmV2ZXJzZWQuICovXHJcbiAgcmlnaHRUb0xlZnQ/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byByZXZlcnNlIGtleWJvYXJkIG5hdmlnYXRpb246XHJcbiAgICBSaWdodC90b3AgYXJyb3dzOiAtMVxyXG4gICAgTGVmdC9ib3R0b20gYXJyb3dzOiArMVxyXG4gICAgUGFnZS11cDogLTEwJVxyXG4gICAgUGFnZS1kb3duOiArMTAlXHJcbiAgICBFbmQ6IG1pbmltdW0gdmFsdWVcclxuICAgIEhvbWU6IG1heGltdW0gdmFsdWVcclxuICAgKi9cclxuICByZXZlcnNlZENvbnRyb2xzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8ga2VlcCB0aGUgc2xpZGVyIGxhYmVscyBpbnNpZGUgdGhlIHNsaWRlciBib3VuZHMuICovXHJcbiAgYm91bmRQb2ludGVyTGFiZWxzPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byB1c2UgYSBsb2dhcml0aG1pYyBzY2FsZSB0byBkaXNwbGF5IHRoZSBzbGlkZXIuICAqL1xyXG4gIGxvZ1NjYWxlPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBwb3NpdGlvbiBvbiB0aGUgc2xpZGVyIGZvciBhIGdpdmVuIHZhbHVlLlxyXG4gICAgVGhlIHBvc2l0aW9uIG11c3QgYmUgYSBwZXJjZW50YWdlIGJldHdlZW4gMCBhbmQgMS5cclxuICAgIFRoZSBmdW5jdGlvbiBzaG91bGQgYmUgbW9ub3RvbmljYWxseSBpbmNyZWFzaW5nIG9yIGRlY3JlYXNpbmc7IG90aGVyd2lzZSB0aGUgc2xpZGVyIG1heSBiZWhhdmUgaW5jb3JyZWN0bHkuICovXHJcbiAgY3VzdG9tVmFsdWVUb1Bvc2l0aW9uPzogVmFsdWVUb1Bvc2l0aW9uRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBwb3NpdGlvbiBvbiB0aGUgc2xpZGVyLlxyXG4gICAgVGhlIHBvc2l0aW9uIGlzIGEgcGVyY2VudGFnZSBiZXR3ZWVuIDAgYW5kIDEuXHJcbiAgICBUaGUgZnVuY3Rpb24gc2hvdWxkIGJlIG1vbm90b25pY2FsbHkgaW5jcmVhc2luZyBvciBkZWNyZWFzaW5nOyBvdGhlcndpc2UgdGhlIHNsaWRlciBtYXkgYmVoYXZlIGluY29ycmVjdGx5LiAqL1xyXG4gIGN1c3RvbVBvc2l0aW9uVG9WYWx1ZT86IFBvc2l0aW9uVG9WYWx1ZUZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIFByZWNpc2lvbiBsaW1pdCBmb3IgY2FsY3VsYXRlZCB2YWx1ZXMuXHJcbiAgICBWYWx1ZXMgdXNlZCBpbiBjYWxjdWxhdGlvbnMgd2lsbCBiZSByb3VuZGVkIHRvIHRoaXMgbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAgdG8gcHJldmVudCBhY2N1bXVsYXRpbmcgc21hbGwgZmxvYXRpbmctcG9pbnQgZXJyb3JzLiAqL1xyXG4gIHByZWNpc2lvbkxpbWl0PzogbnVtYmVyID0gMTI7XHJcblxyXG4gIC8qKiBVc2UgdG8gZGlzcGxheSB0aGUgc2VsZWN0aW9uIGJhciBhcyBhIGdyYWRpZW50LlxyXG4gICAgVGhlIGdpdmVuIG9iamVjdCBtdXN0IGNvbnRhaW4gZnJvbSBhbmQgdG8gcHJvcGVydGllcyB3aGljaCBhcmUgY29sb3JzLiAqL1xyXG4gIHNlbGVjdGlvbkJhckdyYWRpZW50Pzoge2Zyb206IHN0cmluZywgdG86IHN0cmluZ30gPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGFkZCBhIGxhYmVsIGRpcmVjdGx5IHRvIHRoZSBzbGlkZXIgZm9yIGFjY2Vzc2liaWxpdHkuIEFkZHMgdGhlIGFyaWEtbGFiZWwgYXR0cmlidXRlLiAqL1xyXG4gIGFyaWFMYWJlbD86IHN0cmluZyA9ICduZ3gtc2xpZGVyJztcclxuXHJcbiAgLyoqIFVzZSBpbnN0ZWFkIG9mIGFyaWFMYWJlbCB0byByZWZlcmVuY2UgdGhlIGlkIG9mIGFuIGVsZW1lbnQgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGxhYmVsIHRoZSBzbGlkZXIuXHJcbiAgICBBZGRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgYXR0cmlidXRlLiAqL1xyXG4gIGFyaWFMYWJlbGxlZEJ5Pzogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBhZGQgYSBsYWJlbCBkaXJlY3RseSB0byB0aGUgc2xpZGVyIHJhbmdlIGZvciBhY2Nlc3NpYmlsaXR5LiBBZGRzIHRoZSBhcmlhLWxhYmVsIGF0dHJpYnV0ZS4gKi9cclxuICBhcmlhTGFiZWxIaWdoPzogc3RyaW5nID0gJ25neC1zbGlkZXItbWF4JztcclxuXHJcbiAgLyoqIFVzZSBpbnN0ZWFkIG9mIGFyaWFMYWJlbEhpZ2ggdG8gcmVmZXJlbmNlIHRoZSBpZCBvZiBhbiBlbGVtZW50IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBsYWJlbCB0aGUgc2xpZGVyIHJhbmdlLlxyXG4gICAgQWRkcyB0aGUgYXJpYS1sYWJlbGxlZGJ5IGF0dHJpYnV0ZS4gKi9cclxuICBhcmlhTGFiZWxsZWRCeUhpZ2g/OiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGluY3JlYXNlIHJlbmRlcmluZyBwZXJmb3JtYW5jZS4gSWYgdGhlIHZhbHVlIGlzIG5vdCBwcm92aWRlZCwgdGhlIHNsaWRlciBjYWxjdWxhdGVzIHRoZSB3aXRoL2hlaWdodCBvZiB0aGUgaGFuZGxlICovXHJcbiAgaGFuZGxlRGltZW5zaW9uPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBpbmNyZWFzZSByZW5kZXJpbmcgcGVyZm9ybWFuY2UuIElmIHRoZSB2YWx1ZSBpcyBub3QgcHJvdmlkZWQsIHRoZSBzbGlkZXIgY2FsY3VsYXRlcyB0aGUgd2l0aC9oZWlnaHQgb2YgdGhlIGJhciAqL1xyXG4gIGJhckRpbWVuc2lvbj86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBFbmFibGUvZGlzYWJsZSBDU1MgYW5pbWF0aW9ucyAqL1xyXG4gIGFuaW1hdGU/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIEVuYWJsZS9kaXNhYmxlIENTUyBhbmltYXRpb25zIHdoaWxlIG1vdmluZyB0aGUgc2xpZGVyICovXHJcbiAgYW5pbWF0ZU9uTW92ZT86IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG4iXX0=