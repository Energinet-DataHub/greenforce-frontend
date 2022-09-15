/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
const LabelType = {
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
export class Options {
    constructor() {
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
}
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyLyIsInNvdXJjZXMiOlsib3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0lBS0UsTUFBRzs7SUFFSCxPQUFJOztJQUVKLFFBQUs7O0lBRUwsT0FBSTs7SUFFSixZQUFTOzs7b0JBUlQsR0FBRztvQkFFSCxJQUFJO29CQUVKLEtBQUs7b0JBRUwsSUFBSTtvQkFFSixTQUFTOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4QlgsTUFBTTs7Ozs7O3FCQUdhLENBQUM7Ozs7O29CQUlGLElBQUk7Ozs7O29CQUlKLENBQUM7Ozs7Ozt3QkFLRyxJQUFJOzs7Ozs7d0JBS0osSUFBSTs7Ozs7Ozt5QkFNRixLQUFLOzs7Ozt3QkFJUCxJQUFJOzs7Ozt3QkFJSixJQUFJOzs7Ozt5QkFJUSxJQUFJOzs7Ozs7Ozs2QkFPSSxJQUFJOzs7Ozs7Ozs7eUJBUVosSUFBSTs7Ozs7NkJBSUksSUFBSTs7Ozs7Ozs7OzswQkFTTixJQUFJOzs7O3NDQUdQLEtBQUs7Ozs7OzhCQUliLEtBQUs7Ozs7O2tDQUlELEtBQUs7Ozs7Z0NBR1AsS0FBSzs7OzttQ0FHRixLQUFLOzs7Ozt5Q0FJQSxJQUFJOzs7OztzQ0FJTixLQUFLOzs7O2lDQUdWLEtBQUs7Ozs7K0JBR1AsS0FBSzs7OzttQ0FHRCxJQUFJOzs7O3dCQUdmLEtBQUs7Ozs7d0JBR0wsS0FBSzs7Ozt5QkFHSixLQUFLOzs7OytCQUdDLEtBQUs7Ozt3QkFJYixJQUFJOzs7NkJBSUMsSUFBSTs7Ozs7OzBCQUtMLElBQUk7Ozs7OzRCQUllLElBQUk7Ozs7a0NBR0UsSUFBSTs7Ozs7O3dCQUtoQyxLQUFLOzs7Ozs7Ozs7b0NBUStDLElBQUk7Ozs7NEJBR2xDLElBQUk7Ozs7Ozs7Ozs7K0JBU3lCLElBQUk7Ozs7Ozs7Ozs7K0JBVWhELElBQUk7Ozs7O3FCQUlmLENBQUM7Ozs7O3NCQUlBLENBQUM7Ozs7OzsyQkFLSyxJQUFJOzs7Ozs7NEJBS0gsSUFBSTs7Ozs7O2lDQUtDLElBQUk7Ozs7MkJBR1YsS0FBSzs7OzsrQkFHRCxLQUFLOzs7OzsyQkFJVCxLQUFLOzs7Ozs7Ozs7O2dDQVVBLEtBQUs7Ozs7a0NBR0gsSUFBSTs7Ozt3QkFHZCxLQUFLOzs7Ozs7cUNBS3dCLElBQUk7Ozs7OztxQ0FLSixJQUFJOzs7Ozs7OEJBSzVCLEVBQUU7Ozs7O29DQUl3QixJQUFJOzs7O3lCQUduQyxZQUFZOzs7Ozs4QkFJUCxJQUFJOzs7OzZCQUdMLGdCQUFnQjs7Ozs7a0NBSVgsSUFBSTs7OzsrQkFHUCxJQUFJOzs7OzRCQUdQLElBQUk7Ozs7dUJBR1IsSUFBSTs7Ozs2QkFHRSxLQUFLOztDQUNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBvaW50ZXJUeXBlIH0gZnJvbSAnLi9wb2ludGVyLXR5cGUnO1xyXG5cclxuLyoqIExhYmVsIHR5cGUgKi9cclxuZXhwb3J0IGVudW0gTGFiZWxUeXBlIHtcclxuICAvKiogTGFiZWwgYWJvdmUgbG93IHBvaW50ZXIgKi9cclxuICBMb3csXHJcbiAgLyoqIExhYmVsIGFib3ZlIGhpZ2ggcG9pbnRlciAqL1xyXG4gIEhpZ2gsXHJcbiAgLyoqIExhYmVsIGZvciBtaW5pbXVtIHNsaWRlciB2YWx1ZSAqL1xyXG4gIEZsb29yLFxyXG4gIC8qKiBMYWJlbCBmb3IgbWF4aW11bSBzbGlkZXIgdmFsdWUgKi9cclxuICBDZWlsLFxyXG4gIC8qKiBMYWJlbCBiZWxvdyBsZWdlbmQgdGljayAqL1xyXG4gIFRpY2tWYWx1ZVxyXG59XHJcblxyXG4vKiogRnVuY3Rpb24gdG8gdHJhbnNsYXRlIGxhYmVsIHZhbHVlIGludG8gdGV4dCAqL1xyXG5leHBvcnQgdHlwZSBUcmFuc2xhdGVGdW5jdGlvbiA9ICh2YWx1ZTogbnVtYmVyLCBsYWJlbDogTGFiZWxUeXBlKSA9PiBzdHJpbmc7XHJcbi8qKiBGdW5jdGlvbiB0byBjb21iaW5kICovXHJcbmV4cG9ydCB0eXBlIENvbWJpbmVMYWJlbHNGdW5jdGlvbiA9IChtaW5MYWJlbDogc3RyaW5nLCBtYXhMYWJlbDogc3RyaW5nKSA9PiBzdHJpbmc7XHJcbi8qKiBGdW5jdGlvbiB0byBwcm92aWRlIGxlZ2VuZCAgKi9cclxuZXhwb3J0IHR5cGUgR2V0TGVnZW5kRnVuY3Rpb24gPSAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xyXG5leHBvcnQgdHlwZSBHZXRTdGVwTGVnZW5kRnVuY3Rpb24gPSAoc3RlcDogQ3VzdG9tU3RlcERlZmluaXRpb24pID0+IHN0cmluZztcclxuXHJcbi8qKiBGdW5jdGlvbiBjb252ZXJ0aW5nIHNsaWRlciB2YWx1ZSB0byBzbGlkZXIgcG9zaXRpb24gKi9cclxuZXhwb3J0IHR5cGUgVmFsdWVUb1Bvc2l0aW9uRnVuY3Rpb24gPSAodmFsOiBudW1iZXIsIG1pblZhbDogbnVtYmVyLCBtYXhWYWw6IG51bWJlcikgPT4gbnVtYmVyO1xyXG5cclxuLyoqIEZ1bmN0aW9uIGNvbnZlcnRpbmcgc2xpZGVyIHBvc2l0aW9uIHRvIHNsaWRlciB2YWx1ZSAqL1xyXG5leHBvcnQgdHlwZSBQb3NpdGlvblRvVmFsdWVGdW5jdGlvbiA9IChwZXJjZW50OiBudW1iZXIsIG1pblZhbDogbnVtYmVyLCBtYXhWYWw6IG51bWJlcikgPT4gbnVtYmVyO1xyXG5cclxuLyoqXHJcbiAqIEN1c3RvbSBzdGVwIGRlZmluaXRpb25cclxuICpcclxuICogVGhpcyBjYW4gYmUgdXNlZCB0byBzcGVjaWZ5IGN1c3RvbSB2YWx1ZXMgYW5kIGxlZ2VuZCB2YWx1ZXMgZm9yIHNsaWRlciB0aWNrc1xyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBDdXN0b21TdGVwRGVmaW5pdGlvbiB7XHJcbiAgLyoqIFZhbHVlICovXHJcbiAgdmFsdWU6IG51bWJlcjtcclxuICAvKiogTGVnZW5kIChsYWJlbCBmb3IgdGhlIHZhbHVlKSAqL1xyXG4gIGxlZ2VuZD86IHN0cmluZztcclxufVxyXG5cclxuLyoqIFNsaWRlciBvcHRpb25zICovXHJcbmV4cG9ydCBjbGFzcyBPcHRpb25zIHtcclxuICAvKiogTWluaW11bSB2YWx1ZSBmb3IgYSBzbGlkZXIuXHJcbiAgICBOb3QgYXBwbGljYWJsZSB3aGVuIHVzaW5nIHN0ZXBzQXJyYXkuICovXHJcbiAgZmxvb3I/OiBudW1iZXIgPSAwO1xyXG5cclxuICAvKiogTWF4aW11bSB2YWx1ZSBmb3IgYSBzbGlkZXIuXHJcbiAgICBOb3QgYXBwbGljYWJsZSB3aGVuIHVzaW5nIHN0ZXBzQXJyYXkuICovXHJcbiAgY2VpbD86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBTdGVwIGJldHdlZW4gZWFjaCB2YWx1ZS5cclxuICAgIE5vdCBhcHBsaWNhYmxlIHdoZW4gdXNpbmcgc3RlcHNBcnJheS4gKi9cclxuICBzdGVwPzogbnVtYmVyID0gMTtcclxuXHJcbiAgLyoqIFRoZSBtaW5pbXVtIHJhbmdlIGF1dGhvcml6ZWQgb24gdGhlIHNsaWRlci5cclxuICAgIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuXHJcbiAgICBXaGVuIHVzaW5nIHN0ZXBzQXJyYXksIGV4cHJlc3NlZCBhcyBpbmRleCBpbnRvIHN0ZXBzQXJyYXkuICovXHJcbiAgbWluUmFuZ2U/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogVGhlIG1heGltdW0gcmFuZ2UgYXV0aG9yaXplZCBvbiB0aGUgc2xpZGVyLlxyXG4gICAgQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS5cclxuICAgIFdoZW4gdXNpbmcgc3RlcHNBcnJheSwgZXhwcmVzc2VkIGFzIGluZGV4IGludG8gc3RlcHNBcnJheS4gKi9cclxuICBtYXhSYW5nZT86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBoYXZlIGEgcHVzaCBiZWhhdmlvci4gV2hlbiB0aGUgbWluIGhhbmRsZSBnb2VzIGFib3ZlIHRoZSBtYXgsXHJcbiAgICB0aGUgbWF4IGlzIG1vdmVkIGFzIHdlbGwgKGFuZCB2aWNlLXZlcnNhKS4gVGhlIHJhbmdlIGJldHdlZW4gbWluIGFuZCBtYXggaXNcclxuICAgIGRlZmluZWQgYnkgdGhlIHN0ZXAgb3B0aW9uIChkZWZhdWx0cyB0byAxKSBhbmQgY2FuIGFsc28gYmUgb3ZlcnJpZGVuIGJ5XHJcbiAgICB0aGUgbWluUmFuZ2Ugb3B0aW9uLiBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LiAqL1xyXG4gIHB1c2hSYW5nZT86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFRoZSBtaW5pbXVtIHZhbHVlIGF1dGhvcml6ZWQgb24gdGhlIHNsaWRlci5cclxuICAgIFdoZW4gdXNpbmcgc3RlcHNBcnJheSwgZXhwcmVzc2VkIGFzIGluZGV4IGludG8gc3RlcHNBcnJheS4gKi9cclxuICBtaW5MaW1pdD86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBUaGUgbWF4aW11bSB2YWx1ZSBhdXRob3JpemVkIG9uIHRoZSBzbGlkZXIuXHJcbiAgICBXaGVuIHVzaW5nIHN0ZXBzQXJyYXksIGV4cHJlc3NlZCBhcyBpbmRleCBpbnRvIHN0ZXBzQXJyYXkuICovXHJcbiAgbWF4TGltaXQ/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogQ3VzdG9tIHRyYW5zbGF0ZSBmdW5jdGlvbi4gVXNlIHRoaXMgaWYgeW91IHdhbnQgdG8gdHJhbnNsYXRlIHZhbHVlcyBkaXNwbGF5ZWRcclxuICAgICAgb24gdGhlIHNsaWRlci4gKi9cclxuICB0cmFuc2xhdGU/OiBUcmFuc2xhdGVGdW5jdGlvbiA9IG51bGw7XHJcblxyXG4gIC8qKiBDdXN0b20gZnVuY3Rpb24gZm9yIGNvbWJpbmluZyBvdmVybGFwcGluZyBsYWJlbHMgaW4gcmFuZ2Ugc2xpZGVyLlxyXG4gICAgICBJdCB0YWtlcyB0aGUgbWluIGFuZCBtYXggdmFsdWVzIChhbHJlYWR5IHRyYW5zbGF0ZWQgd2l0aCB0cmFuc2xhdGUgZnVjdGlvbilcclxuICAgICAgYW5kIHNob3VsZCByZXR1cm4gaG93IHRoZXNlIHR3byB2YWx1ZXMgc2hvdWxkIGJlIGNvbWJpbmVkLlxyXG4gICAgICBJZiBub3QgcHJvdmlkZWQsIHRoZSBkZWZhdWx0IGZ1bmN0aW9uIHdpbGwgam9pbiB0aGUgdHdvIHZhbHVlcyB3aXRoXHJcbiAgICAgICcgLSAnIGFzIHNlcGFyYXRvci4gKi9cclxuICBjb21iaW5lTGFiZWxzPzogQ29tYmluZUxhYmVsc0Z1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBkaXNwbGF5IGxlZ2VuZCB1bmRlciB0aWNrcyAodGh1cywgaXQgbmVlZHMgdG8gYmUgdXNlZCBhbG9uZyB3aXRoXHJcbiAgICAgc2hvd1RpY2tzIG9yIHNob3dUaWNrc1ZhbHVlcykuIFRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCB3aXRoIGVhY2ggdGlja1xyXG4gICAgIHZhbHVlIGFuZCByZXR1cm5lZCBjb250ZW50IHdpbGwgYmUgZGlzcGxheWVkIHVuZGVyIHRoZSB0aWNrIGFzIGEgbGVnZW5kLlxyXG4gICAgIElmIHRoZSByZXR1cm5lZCB2YWx1ZSBpcyBudWxsLCB0aGVuIG5vIGxlZ2VuZCBpcyBkaXNwbGF5ZWQgdW5kZXJcclxuICAgICB0aGUgY29ycmVzcG9uZGluZyB0aWNrLllvdSBjYW4gYWxzbyBkaXJlY3RseSBwcm92aWRlIHRoZSBsZWdlbmQgdmFsdWVzXHJcbiAgICAgaW4gdGhlIHN0ZXBzQXJyYXkgb3B0aW9uLiAqL1xyXG4gIGdldExlZ2VuZD86IEdldExlZ2VuZEZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgIC8qKiBVc2UgdG8gZGlzcGxheSBhIGN1c3RvbSBsZWdlbmQgb2YgYSBzdGVwSXRlbSBmcm9tIHN0ZXBzQXJyYXkuXHJcbiAgICBJdCB3aWxsIGJlIHRoZSBzYW1lIGFzIGdldExlZ2VuZCBidXQgZm9yIHN0ZXBzQXJyYXkuICovXHJcbiAgZ2V0U3RlcExlZ2VuZD86IEdldFN0ZXBMZWdlbmRGdW5jdGlvbiA9IG51bGw7XHJcblxyXG4gIC8qKiBJZiB5b3Ugd2FudCB0byBkaXNwbGF5IGEgc2xpZGVyIHdpdGggbm9uIGxpbmVhci9udW1iZXIgc3RlcHMuXHJcbiAgICAgSnVzdCBwYXNzIGFuIGFycmF5IHdpdGggZWFjaCBzbGlkZXIgdmFsdWUgYW5kIHRoYXQncyBpdDsgdGhlIGZsb29yLCBjZWlsIGFuZCBzdGVwIHNldHRpbmdzXHJcbiAgICAgb2YgdGhlIHNsaWRlciB3aWxsIGJlIGNvbXB1dGVkIGF1dG9tYXRpY2FsbHkuXHJcbiAgICAgQnkgZGVmYXVsdCwgdGhlIHZhbHVlIG1vZGVsIGFuZCB2YWx1ZUhpZ2ggbW9kZWwgdmFsdWVzIHdpbGwgYmUgdGhlIHZhbHVlIG9mIHRoZSBzZWxlY3RlZCBpdGVtXHJcbiAgICAgaW4gdGhlIHN0ZXBzQXJyYXkuXHJcbiAgICAgVGhleSBjYW4gYWxzbyBiZSBib3VuZCB0byB0aGUgaW5kZXggb2YgdGhlIHNlbGVjdGVkIGl0ZW0gYnkgc2V0dGluZyB0aGUgYmluZEluZGV4Rm9yU3RlcHNBcnJheVxyXG4gICAgIG9wdGlvbiB0byB0cnVlLiAqL1xyXG4gIHN0ZXBzQXJyYXk/OiBDdXN0b21TdGVwRGVmaW5pdGlvbltdID0gbnVsbDtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGJpbmQgdGhlIGluZGV4IG9mIHRoZSBzZWxlY3RlZCBpdGVtIHRvIHZhbHVlIG1vZGVsIGFuZCB2YWx1ZUhpZ2ggbW9kZWwuICovXHJcbiAgYmluZEluZGV4Rm9yU3RlcHNBcnJheT86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFdoZW4gc2V0IHRvIHRydWUgYW5kIHVzaW5nIGEgcmFuZ2Ugc2xpZGVyLCB0aGUgcmFuZ2UgY2FuIGJlIGRyYWdnZWQgYnkgdGhlIHNlbGVjdGlvbiBiYXIuXHJcbiAgICBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LiAqL1xyXG4gIGRyYWdnYWJsZVJhbmdlPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2FtZSBhcyBkcmFnZ2FibGVSYW5nZSBidXQgdGhlIHNsaWRlciByYW5nZSBjYW4ndCBiZSBjaGFuZ2VkLlxyXG4gICAgQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS4gKi9cclxuICBkcmFnZ2FibGVSYW5nZU9ubHk/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBhbHdheXMgc2hvdyB0aGUgc2VsZWN0aW9uIGJhciBiZWZvcmUgdGhlIHNsaWRlciBoYW5kbGUuICovXHJcbiAgc2hvd1NlbGVjdGlvbkJhcj86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGFsd2F5cyBzaG93IHRoZSBzZWxlY3Rpb24gYmFyIGFmdGVyIHRoZSBzbGlkZXIgaGFuZGxlLiAqL1xyXG4gIHNob3dTZWxlY3Rpb25CYXJFbmQ/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiAgU2V0IGEgbnVtYmVyIHRvIGRyYXcgdGhlIHNlbGVjdGlvbiBiYXIgYmV0d2VlbiB0aGlzIHZhbHVlIGFuZCB0aGUgc2xpZGVyIGhhbmRsZS5cclxuICAgIFdoZW4gdXNpbmcgc3RlcHNBcnJheSwgZXhwcmVzc2VkIGFzIGluZGV4IGludG8gc3RlcHNBcnJheS4gKi9cclxuICBzaG93U2VsZWN0aW9uQmFyRnJvbVZhbHVlPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqICBPbmx5IGZvciByYW5nZSBzbGlkZXIuIFNldCB0byB0cnVlIHRvIHZpc3VhbGl6ZSBpbiBkaWZmZXJlbnQgY29sb3VyIHRoZSBhcmVhc1xyXG4gICAgb24gdGhlIGxlZnQvcmlnaHQgKHRvcC9ib3R0b20gZm9yIHZlcnRpY2FsIHJhbmdlIHNsaWRlcikgb2Ygc2VsZWN0aW9uIGJhciBiZXR3ZWVuIHRoZSBoYW5kbGVzLiAqL1xyXG4gIHNob3dPdXRlclNlbGVjdGlvbkJhcnM/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBoaWRlIHBvaW50ZXIgbGFiZWxzICovXHJcbiAgaGlkZVBvaW50ZXJMYWJlbHM/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBoaWRlIG1pbiAvIG1heCBsYWJlbHMgICovXHJcbiAgaGlkZUxpbWl0TGFiZWxzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIGZhbHNlIHRvIGRpc2FibGUgdGhlIGF1dG8taGlkaW5nIGJlaGF2aW9yIG9mIHRoZSBsaW1pdCBsYWJlbHMuICovXHJcbiAgYXV0b0hpZGVMaW1pdExhYmVscz86IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gbWFrZSB0aGUgc2xpZGVyIHJlYWQtb25seS4gKi9cclxuICByZWFkT25seT86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGRpc2FibGUgdGhlIHNsaWRlci4gKi9cclxuICBkaXNhYmxlZD86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGRpc3BsYXkgYSB0aWNrIGZvciBlYWNoIHN0ZXAgb2YgdGhlIHNsaWRlci4gKi9cclxuICBzaG93VGlja3M/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBkaXNwbGF5IGEgdGljayBhbmQgdGhlIHN0ZXAgdmFsdWUgZm9yIGVhY2ggc3RlcCBvZiB0aGUgc2xpZGVyLi4gKi9cclxuICBzaG93VGlja3NWYWx1ZXM/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qIFRoZSBzdGVwIGJldHdlZW4gZWFjaCB0aWNrIHRvIGRpc3BsYXkuIElmIG5vdCBzZXQsIHRoZSBzdGVwIHZhbHVlIGlzIHVzZWQuXHJcbiAgICBOb3QgdXNlZCB3aGVuIHRpY2tzQXJyYXkgaXMgc3BlY2lmaWVkLiAqL1xyXG4gIHRpY2tTdGVwPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyogVGhlIHN0ZXAgYmV0d2VlbiBkaXNwbGF5aW5nIGVhY2ggdGljayBzdGVwIHZhbHVlLlxyXG4gICAgSWYgbm90IHNldCwgdGhlbiB0aWNrU3RlcCBvciBzdGVwIGlzIHVzZWQsIGRlcGVuZGluZyBvbiB3aGljaCBvbmUgaXMgc2V0LiAqL1xyXG4gIHRpY2tWYWx1ZVN0ZXA/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGRpc3BsYXkgdGlja3MgYXQgc3BlY2lmaWMgcG9zaXRpb25zLlxyXG4gICAgVGhlIGFycmF5IGNvbnRhaW5zIHRoZSBpbmRleCBvZiB0aGUgdGlja3MgdGhhdCBzaG91bGQgYmUgZGlzcGxheWVkLlxyXG4gICAgRm9yIGV4YW1wbGUsIFswLCAxLCA1XSB3aWxsIGRpc3BsYXkgYSB0aWNrIGZvciB0aGUgZmlyc3QsIHNlY29uZCBhbmQgc2l4dGggdmFsdWVzLiAqL1xyXG4gIHRpY2tzQXJyYXk/OiBudW1iZXJbXSA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2VkIHRvIGRpc3BsYXkgYSB0b29sdGlwIHdoZW4gYSB0aWNrIGlzIGhvdmVyZWQuXHJcbiAgICBTZXQgdG8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHRvb2x0aXAgY29udGVudCBmb3IgYSBnaXZlbiB2YWx1ZS4gKi9cclxuICB0aWNrc1Rvb2x0aXA/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIFNhbWUgYXMgdGlja3NUb29sdGlwIGJ1dCBmb3IgdGlja3MgdmFsdWVzLiAqL1xyXG4gIHRpY2tzVmFsdWVzVG9vbHRpcD86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZGlzcGxheSB0aGUgc2xpZGVyIHZlcnRpY2FsbHkuXHJcbiAgICBUaGUgc2xpZGVyIHdpbGwgdGFrZSB0aGUgZnVsbCBoZWlnaHQgb2YgaXRzIHBhcmVudC5cclxuICAgIENoYW5naW5nIHRoaXMgdmFsdWUgYXQgcnVudGltZSBpcyBub3QgY3VycmVudGx5IHN1cHBvcnRlZC4gKi9cclxuICB2ZXJ0aWNhbD86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3VycmVudCBjb2xvciBvZiB0aGUgc2VsZWN0aW9uIGJhci5cclxuICAgIElmIHlvdXIgY29sb3Igd29uJ3QgY2hhbmdlLCBkb24ndCB1c2UgdGhpcyBvcHRpb24gYnV0IHNldCBpdCB0aHJvdWdoIENTUy5cclxuICAgIElmIHRoZSByZXR1cm5lZCBjb2xvciBkZXBlbmRzIG9uIGEgbW9kZWwgdmFsdWUgKGVpdGhlciB2YWx1ZSBvciB2YWx1ZUhpZ2gpLFxyXG4gICAgeW91IHNob3VsZCB1c2UgdGhlIGFyZ3VtZW50IHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uXHJcbiAgICBJbmRlZWQsIHdoZW4gdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlcmUgaXMgbm8gY2VydGFpbnR5IHRoYXQgdGhlIG1vZGVsXHJcbiAgICBoYXMgYWxyZWFkeSBiZWVuIHVwZGF0ZWQuKi9cclxuICBnZXRTZWxlY3Rpb25CYXJDb2xvcj86IChtaW5WYWx1ZTogbnVtYmVyLCBtYXhWYWx1ZT86IG51bWJlcikgPT4gc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY29sb3Igb2YgYSB0aWNrLiBzaG93VGlja3MgbXVzdCBiZSBlbmFibGVkLiAqL1xyXG4gIGdldFRpY2tDb2xvcj86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjdXJyZW50IGNvbG9yIG9mIGEgcG9pbnRlci5cclxuICAgIElmIHlvdXIgY29sb3Igd29uJ3QgY2hhbmdlLCBkb24ndCB1c2UgdGhpcyBvcHRpb24gYnV0IHNldCBpdCB0aHJvdWdoIENTUy5cclxuICAgIElmIHRoZSByZXR1cm5lZCBjb2xvciBkZXBlbmRzIG9uIGEgbW9kZWwgdmFsdWUgKGVpdGhlciB2YWx1ZSBvciB2YWx1ZUhpZ2gpLFxyXG4gICAgeW91IHNob3VsZCB1c2UgdGhlIGFyZ3VtZW50IHBhc3NlZCB0byB0aGUgZnVuY3Rpb24uXHJcbiAgICBJbmRlZWQsIHdoZW4gdGhlIGZ1bmN0aW9uIGlzIGNhbGxlZCwgdGhlcmUgaXMgbm8gY2VydGFpbnR5IHRoYXQgdGhlIG1vZGVsIGhhcyBhbHJlYWR5IGJlZW4gdXBkYXRlZC5cclxuICAgIFRvIGhhbmRsZSByYW5nZSBzbGlkZXIgcG9pbnRlcnMgaW5kZXBlbmRlbnRseSwgeW91IHNob3VsZCBldmFsdWF0ZSBwb2ludGVyVHlwZSB3aXRoaW4gdGhlIGdpdmVuXHJcbiAgICBmdW5jdGlvbiB3aGVyZSBcIm1pblwiIHN0YW5kcyBmb3IgdmFsdWUgbW9kZWwgYW5kIFwibWF4XCIgZm9yIHZhbHVlSGlnaCBtb2RlbCB2YWx1ZXMuICovXHJcbiAgZ2V0UG9pbnRlckNvbG9yPzogKHZhbHVlOiBudW1iZXIsIHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSkgPT4gc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIEhhbmRsZXMgYXJlIGZvY3VzYWJsZSAob24gY2xpY2sgb3Igd2l0aCB0YWIpIGFuZCBjYW4gYmUgbW9kaWZpZWQgdXNpbmcgdGhlIGZvbGxvd2luZyBrZXlib2FyZCBjb250cm9sczpcclxuICAgIExlZnQvYm90dG9tIGFycm93czogLTFcclxuICAgIFJpZ2h0L3RvcCBhcnJvd3M6ICsxXHJcbiAgICBQYWdlLWRvd246IC0xMCVcclxuICAgIFBhZ2UtdXA6ICsxMCVcclxuICAgIEhvbWU6IG1pbmltdW0gdmFsdWVcclxuICAgIEVuZDogbWF4aW11bSB2YWx1ZVxyXG4gICAqL1xyXG4gIGtleWJvYXJkU3VwcG9ydD86IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAvKiogSWYgeW91IGRpc3BsYXkgdGhlIHNsaWRlciBpbiBhbiBlbGVtZW50IHRoYXQgdXNlcyB0cmFuc2Zvcm06IHNjYWxlKDAuNSksIHNldCB0aGUgc2NhbGUgdmFsdWUgdG8gMlxyXG4gICAgc28gdGhhdCB0aGUgc2xpZGVyIGlzIHJlbmRlcmVkIHByb3Blcmx5IGFuZCB0aGUgZXZlbnRzIGFyZSBoYW5kbGVkIGNvcnJlY3RseS4gKi9cclxuICBzY2FsZT86IG51bWJlciA9IDE7XHJcblxyXG4gIC8qKiBJZiB5b3UgZGlzcGxheSB0aGUgc2xpZGVyIGluIGFuIGVsZW1lbnQgdGhhdCB1c2VzIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKSwgc2V0IHRoZSByb3RhdGUgdmFsdWUgdG8gOTBcclxuICAgc28gdGhhdCB0aGUgc2xpZGVyIGlzIHJlbmRlcmVkIHByb3Blcmx5IGFuZCB0aGUgZXZlbnRzIGFyZSBoYW5kbGVkIGNvcnJlY3RseS4gVmFsdWUgaXMgaW4gZGVncmVlcy4gKi9cclxuICByb3RhdGU/OiBudW1iZXIgPSAwO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZm9yY2UgdGhlIHZhbHVlKHMpIHRvIGJlIHJvdW5kZWQgdG8gdGhlIHN0ZXAsIGV2ZW4gd2hlbiBtb2RpZmllZCBmcm9tIHRoZSBvdXRzaWRlLlxyXG4gICAgV2hlbiBzZXQgdG8gZmFsc2UsIGlmIHRoZSBtb2RlbCB2YWx1ZXMgYXJlIG1vZGlmaWVkIGZyb20gb3V0c2lkZSB0aGUgc2xpZGVyLCB0aGV5IGFyZSBub3Qgcm91bmRlZFxyXG4gICAgYW5kIGNhbiBiZSBiZXR3ZWVuIHR3byBzdGVwcy4gKi9cclxuICBlbmZvcmNlU3RlcD86IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZm9yY2UgdGhlIHZhbHVlKHMpIHRvIGJlIG5vcm1hbGlzZWQgdG8gYWxsb3dlZCByYW5nZSAoZmxvb3IgdG8gY2VpbCksIGV2ZW4gd2hlbiBtb2RpZmllZCBmcm9tIHRoZSBvdXRzaWRlLlxyXG4gICAgV2hlbiBzZXQgdG8gZmFsc2UsIGlmIHRoZSBtb2RlbCB2YWx1ZXMgYXJlIG1vZGlmaWVkIGZyb20gb3V0c2lkZSB0aGUgc2xpZGVyLCBhbmQgdGhleSBhcmUgb3V0c2lkZSBhbGxvd2VkIHJhbmdlLFxyXG4gICAgdGhlIHNsaWRlciBtYXkgYmUgcmVuZGVyZWQgaW5jb3JyZWN0bHkuIEhvd2V2ZXIsIHNldHRpbmcgdGhpcyB0byBmYWxzZSBtYXkgYmUgdXNlZnVsIGlmIHlvdSB3YW50IHRvIHBlcmZvcm0gY3VzdG9tIG5vcm1hbGlzYXRpb24uICovXHJcbiAgZW5mb3JjZVJhbmdlPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBmb3JjZSB0aGUgdmFsdWUocykgdG8gYmUgcm91bmRlZCB0byB0aGUgbmVhcmVzdCBzdGVwIHZhbHVlLCBldmVuIHdoZW4gbW9kaWZpZWQgZnJvbSB0aGUgb3V0c2lkZS5cclxuICAgIFdoZW4gc2V0IHRvIGZhbHNlLCBpZiB0aGUgbW9kZWwgdmFsdWVzIGFyZSBtb2RpZmllZCBmcm9tIG91dHNpZGUgdGhlIHNsaWRlciwgYW5kIHRoZXkgYXJlIG91dHNpZGUgYWxsb3dlZCByYW5nZSxcclxuICAgIHRoZSBzbGlkZXIgbWF5IGJlIHJlbmRlcmVkIGluY29ycmVjdGx5LiBIb3dldmVyLCBzZXR0aW5nIHRoaXMgdG8gZmFsc2UgbWF5IGJlIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byBwZXJmb3JtIGN1c3RvbSBub3JtYWxpc2F0aW9uLiAqL1xyXG4gIGVuZm9yY2VTdGVwc0FycmF5PzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBwcmV2ZW50IHRvIHVzZXIgZnJvbSBzd2l0Y2hpbmcgdGhlIG1pbiBhbmQgbWF4IGhhbmRsZXMuIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuICovXHJcbiAgbm9Td2l0Y2hpbmc/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBvbmx5IGJpbmQgZXZlbnRzIG9uIHNsaWRlciBoYW5kbGVzLiAqL1xyXG4gIG9ubHlCaW5kSGFuZGxlcz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIHNob3cgZ3JhcGhzIHJpZ2h0IHRvIGxlZnQuXHJcbiAgICBJZiB2ZXJ0aWNhbCBpcyB0cnVlIGl0IHdpbGwgYmUgZnJvbSB0b3AgdG8gYm90dG9tIGFuZCBsZWZ0IC8gcmlnaHQgYXJyb3cgZnVuY3Rpb25zIHJldmVyc2VkLiAqL1xyXG4gIHJpZ2h0VG9MZWZ0PzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gcmV2ZXJzZSBrZXlib2FyZCBuYXZpZ2F0aW9uOlxyXG4gICAgUmlnaHQvdG9wIGFycm93czogLTFcclxuICAgIExlZnQvYm90dG9tIGFycm93czogKzFcclxuICAgIFBhZ2UtdXA6IC0xMCVcclxuICAgIFBhZ2UtZG93bjogKzEwJVxyXG4gICAgRW5kOiBtaW5pbXVtIHZhbHVlXHJcbiAgICBIb21lOiBtYXhpbXVtIHZhbHVlXHJcbiAgICovXHJcbiAgcmV2ZXJzZWRDb250cm9scz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGtlZXAgdGhlIHNsaWRlciBsYWJlbHMgaW5zaWRlIHRoZSBzbGlkZXIgYm91bmRzLiAqL1xyXG4gIGJvdW5kUG9pbnRlckxhYmVscz86IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gdXNlIGEgbG9nYXJpdGhtaWMgc2NhbGUgdG8gZGlzcGxheSB0aGUgc2xpZGVyLiAgKi9cclxuICBsb2dTY2FsZT86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgcG9zaXRpb24gb24gdGhlIHNsaWRlciBmb3IgYSBnaXZlbiB2YWx1ZS5cclxuICAgIFRoZSBwb3NpdGlvbiBtdXN0IGJlIGEgcGVyY2VudGFnZSBiZXR3ZWVuIDAgYW5kIDEuXHJcbiAgICBUaGUgZnVuY3Rpb24gc2hvdWxkIGJlIG1vbm90b25pY2FsbHkgaW5jcmVhc2luZyBvciBkZWNyZWFzaW5nOyBvdGhlcndpc2UgdGhlIHNsaWRlciBtYXkgYmVoYXZlIGluY29ycmVjdGx5LiAqL1xyXG4gIGN1c3RvbVZhbHVlVG9Qb3NpdGlvbj86IFZhbHVlVG9Qb3NpdGlvbkZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdmFsdWUgZm9yIGEgZ2l2ZW4gcG9zaXRpb24gb24gdGhlIHNsaWRlci5cclxuICAgIFRoZSBwb3NpdGlvbiBpcyBhIHBlcmNlbnRhZ2UgYmV0d2VlbiAwIGFuZCAxLlxyXG4gICAgVGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBtb25vdG9uaWNhbGx5IGluY3JlYXNpbmcgb3IgZGVjcmVhc2luZzsgb3RoZXJ3aXNlIHRoZSBzbGlkZXIgbWF5IGJlaGF2ZSBpbmNvcnJlY3RseS4gKi9cclxuICBjdXN0b21Qb3NpdGlvblRvVmFsdWU/OiBQb3NpdGlvblRvVmFsdWVGdW5jdGlvbiA9IG51bGw7XHJcblxyXG4gIC8qKiBQcmVjaXNpb24gbGltaXQgZm9yIGNhbGN1bGF0ZWQgdmFsdWVzLlxyXG4gICAgVmFsdWVzIHVzZWQgaW4gY2FsY3VsYXRpb25zIHdpbGwgYmUgcm91bmRlZCB0byB0aGlzIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHNcclxuICAgIHRvIHByZXZlbnQgYWNjdW11bGF0aW5nIHNtYWxsIGZsb2F0aW5nLXBvaW50IGVycm9ycy4gKi9cclxuICBwcmVjaXNpb25MaW1pdD86IG51bWJlciA9IDEyO1xyXG5cclxuICAvKiogVXNlIHRvIGRpc3BsYXkgdGhlIHNlbGVjdGlvbiBiYXIgYXMgYSBncmFkaWVudC5cclxuICAgIFRoZSBnaXZlbiBvYmplY3QgbXVzdCBjb250YWluIGZyb20gYW5kIHRvIHByb3BlcnRpZXMgd2hpY2ggYXJlIGNvbG9ycy4gKi9cclxuICBzZWxlY3Rpb25CYXJHcmFkaWVudD86IHtmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmd9ID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBhZGQgYSBsYWJlbCBkaXJlY3RseSB0byB0aGUgc2xpZGVyIGZvciBhY2Nlc3NpYmlsaXR5LiBBZGRzIHRoZSBhcmlhLWxhYmVsIGF0dHJpYnV0ZS4gKi9cclxuICBhcmlhTGFiZWw/OiBzdHJpbmcgPSAnbmd4LXNsaWRlcic7XHJcblxyXG4gIC8qKiBVc2UgaW5zdGVhZCBvZiBhcmlhTGFiZWwgdG8gcmVmZXJlbmNlIHRoZSBpZCBvZiBhbiBlbGVtZW50IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBsYWJlbCB0aGUgc2xpZGVyLlxyXG4gICAgQWRkcyB0aGUgYXJpYS1sYWJlbGxlZGJ5IGF0dHJpYnV0ZS4gKi9cclxuICBhcmlhTGFiZWxsZWRCeT86IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2UgdG8gYWRkIGEgbGFiZWwgZGlyZWN0bHkgdG8gdGhlIHNsaWRlciByYW5nZSBmb3IgYWNjZXNzaWJpbGl0eS4gQWRkcyB0aGUgYXJpYS1sYWJlbCBhdHRyaWJ1dGUuICovXHJcbiAgYXJpYUxhYmVsSGlnaD86IHN0cmluZyA9ICduZ3gtc2xpZGVyLW1heCc7XHJcblxyXG4gIC8qKiBVc2UgaW5zdGVhZCBvZiBhcmlhTGFiZWxIaWdoIHRvIHJlZmVyZW5jZSB0aGUgaWQgb2YgYW4gZWxlbWVudCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gbGFiZWwgdGhlIHNsaWRlciByYW5nZS5cclxuICAgIEFkZHMgdGhlIGFyaWEtbGFiZWxsZWRieSBhdHRyaWJ1dGUuICovXHJcbiAgYXJpYUxhYmVsbGVkQnlIaWdoPzogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBpbmNyZWFzZSByZW5kZXJpbmcgcGVyZm9ybWFuY2UuIElmIHRoZSB2YWx1ZSBpcyBub3QgcHJvdmlkZWQsIHRoZSBzbGlkZXIgY2FsY3VsYXRlcyB0aGUgd2l0aC9oZWlnaHQgb2YgdGhlIGhhbmRsZSAqL1xyXG4gIGhhbmRsZURpbWVuc2lvbj86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2UgdG8gaW5jcmVhc2UgcmVuZGVyaW5nIHBlcmZvcm1hbmNlLiBJZiB0aGUgdmFsdWUgaXMgbm90IHByb3ZpZGVkLCB0aGUgc2xpZGVyIGNhbGN1bGF0ZXMgdGhlIHdpdGgvaGVpZ2h0IG9mIHRoZSBiYXIgKi9cclxuICBiYXJEaW1lbnNpb24/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogRW5hYmxlL2Rpc2FibGUgQ1NTIGFuaW1hdGlvbnMgKi9cclxuICBhbmltYXRlPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBFbmFibGUvZGlzYWJsZSBDU1MgYW5pbWF0aW9ucyB3aGlsZSBtb3ZpbmcgdGhlIHNsaWRlciAqL1xyXG4gIGFuaW1hdGVPbk1vdmU/OiBib29sZWFuID0gZmFsc2U7XHJcbn1cclxuIl19