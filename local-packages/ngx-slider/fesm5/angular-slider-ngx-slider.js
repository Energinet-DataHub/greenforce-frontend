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
import { Subject } from 'rxjs';
import {
  throttleTime,
  tap,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
import { supportsPassiveEvents } from 'detect-passive-events';
import { __values, __extends } from 'tslib';
import {
  Directive,
  ElementRef,
  Renderer2,
  HostBinding,
  ChangeDetectorRef,
  Component,
  ViewChild,
  HostListener,
  Input,
  EventEmitter,
  Output,
  ContentChild,
  forwardRef,
  NgZone,
  NgModule,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
LabelType[LabelType.Low] = 'Low';
LabelType[LabelType.High] = 'High';
LabelType[LabelType.Floor] = 'Floor';
LabelType[LabelType.Ceil] = 'Ceil';
LabelType[LabelType.TickValue] = 'TickValue';
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
  })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
var PointerType = {
  /** Low pointer */
  Min: 0,
  /** High pointer */
  Max: 1,
};
PointerType[PointerType.Min] = 'Min';
PointerType[PointerType.Max] = 'Max';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var ChangeContext = /** @class */ (function () {
  function ChangeContext() {}
  return ChangeContext;
})();

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
    function ValueHelper() {}
    /**
     * @param {?} value
     * @return {?}
     */
    ValueHelper.isNullOrUndefined =
      /**
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
    ValueHelper.areArraysEqual =
      /**
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
    ValueHelper.linearValueToPosition =
      /**
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
    ValueHelper.logValueToPosition =
      /**
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
    ValueHelper.linearPositionToValue =
      /**
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
    ValueHelper.logPositionToValue =
      /**
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
    ValueHelper.findStepIndex =
      /**
       * @param {?} modelValue
       * @param {?} stepsArray
       * @return {?}
       */
      function (modelValue, stepsArray) {
        /** @type {?} */
        var differences = stepsArray.map(function (step) {
          return Math.abs(modelValue - step.value);
        });
        /** @type {?} */
        var minDifferenceIndex = 0;
        for (var index = 0; index < stepsArray.length; index++) {
          if (
            differences[index] !== differences[minDifferenceIndex] &&
            differences[index] < differences[minDifferenceIndex]
          ) {
            minDifferenceIndex = index;
          }
        }
        return minDifferenceIndex;
      };
    return ValueHelper;
  })();

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
    function CompatibilityHelper() {}
    /**
     * Workaround for TouchEvent constructor sadly not being available on all browsers (e.g. Firefox, Safari)
     * @param {?} event
     * @return {?}
     */
    CompatibilityHelper.isTouchEvent =
      /**
       * Workaround for TouchEvent constructor sadly not being available on all browsers (e.g. Firefox, Safari)
       * @param {?} event
       * @return {?}
       */
      function (event) {
        if (/** @type {?} */ (window).TouchEvent !== undefined) {
          return event instanceof TouchEvent;
        }
        return event.touches !== undefined;
      };
    /**
     * Detect presence of ResizeObserver API
     * @return {?}
     */
    CompatibilityHelper.isResizeObserverAvailable =
      /**
       * Detect presence of ResizeObserver API
       * @return {?}
       */
      function () {
        return /** @type {?} */ (window).ResizeObserver !== undefined;
      };
    return CompatibilityHelper;
  })();

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
    function MathHelper() {}
    /* Round numbers to a given number of significant digits */
    /**
     * @param {?} value
     * @param {?} precisionLimit
     * @return {?}
     */
    MathHelper.roundToPrecisionLimit =
      /**
       * @param {?} value
       * @param {?} precisionLimit
       * @return {?}
       */
      function (value, precisionLimit) {
        return +value.toPrecision(precisionLimit);
      };
    /**
     * @param {?} value
     * @param {?} modulo
     * @param {?} precisionLimit
     * @return {?}
     */
    MathHelper.isModuloWithinPrecisionLimit =
      /**
       * @param {?} value
       * @param {?} modulo
       * @param {?} precisionLimit
       * @return {?}
       */
      function (value, modulo, precisionLimit) {
        /** @type {?} */
        var limit = Math.pow(10, -precisionLimit);
        return (
          Math.abs(value % modulo) <= limit ||
          Math.abs(Math.abs(value % modulo) - modulo) <= limit
        );
      };
    /**
     * @param {?} value
     * @param {?} floor
     * @param {?} ceil
     * @return {?}
     */
    MathHelper.clampToRange =
      /**
       * @param {?} value
       * @param {?} floor
       * @param {?} ceil
       * @return {?}
       */
      function (value, floor, ceil) {
        return Math.min(Math.max(value, floor), ceil);
      };
    return MathHelper;
  })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var EventListener = /** @class */ (function () {
  function EventListener() {
    this.eventName = null;
    this.events = null;
    this.eventsSubscription = null;
    this.teardownCallback = null;
  }
  return EventListener;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * Helper class to attach event listeners to DOM elements with debounce support using rxjs
 */
var /**
   * Helper class to attach event listeners to DOM elements with debounce support using rxjs
   */
  EventListenerHelper = /** @class */ (function () {
    function EventListenerHelper(renderer) {
      this.renderer = renderer;
    }
    /**
     * @param {?} nativeElement
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} throttleInterval
     * @return {?}
     */
    EventListenerHelper.prototype.attachPassiveEventListener =
      /**
       * @param {?} nativeElement
       * @param {?} eventName
       * @param {?} callback
       * @param {?=} throttleInterval
       * @return {?}
       */
      function (nativeElement, eventName, callback, throttleInterval) {
        // Only use passive event listeners if the browser supports it
        if (supportsPassiveEvents !== true) {
          return this.attachEventListener(
            nativeElement,
            eventName,
            callback,
            throttleInterval
          );
        }
        /** @type {?} */
        var listener = new EventListener();
        listener.eventName = eventName;
        listener.events = new Subject();
        /** @type {?} */
        var observerCallback = function (event) {
          listener.events.next(event);
        };
        nativeElement.addEventListener(eventName, observerCallback, {
          passive: true,
          capture: false,
        });
        listener.teardownCallback = function () {
          nativeElement.removeEventListener(eventName, observerCallback, {
            passive: true,
            capture: false,
          });
        };
        listener.eventsSubscription = listener.events
          .pipe(
            !ValueHelper.isNullOrUndefined(throttleInterval)
              ? throttleTime(throttleInterval, undefined, {
                  leading: true,
                  trailing: true,
                })
              : tap(function () {}) // no-op
          )
          .subscribe(function (event) {
            callback(event);
          });
        return listener;
      };
    /**
     * @param {?} eventListener
     * @return {?}
     */
    EventListenerHelper.prototype.detachEventListener =
      /**
       * @param {?} eventListener
       * @return {?}
       */
      function (eventListener) {
        if (!ValueHelper.isNullOrUndefined(eventListener.eventsSubscription)) {
          eventListener.eventsSubscription.unsubscribe();
          eventListener.eventsSubscription = null;
        }
        if (!ValueHelper.isNullOrUndefined(eventListener.events)) {
          eventListener.events.complete();
          eventListener.events = null;
        }
        if (!ValueHelper.isNullOrUndefined(eventListener.teardownCallback)) {
          eventListener.teardownCallback();
          eventListener.teardownCallback = null;
        }
      };
    /**
     * @param {?} nativeElement
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} throttleInterval
     * @return {?}
     */
    EventListenerHelper.prototype.attachEventListener =
      /**
       * @param {?} nativeElement
       * @param {?} eventName
       * @param {?} callback
       * @param {?=} throttleInterval
       * @return {?}
       */
      function (nativeElement, eventName, callback, throttleInterval) {
        /** @type {?} */
        var listener = new EventListener();
        listener.eventName = eventName;
        listener.events = new Subject();
        /** @type {?} */
        var observerCallback = function (event) {
          listener.events.next(event);
        };
        listener.teardownCallback = this.renderer.listen(
          nativeElement,
          eventName,
          observerCallback
        );
        listener.eventsSubscription = listener.events
          .pipe(
            !ValueHelper.isNullOrUndefined(throttleInterval)
              ? throttleTime(throttleInterval, undefined, {
                  leading: true,
                  trailing: true,
                })
              : tap(function () {}) // no-op
          )
          .subscribe(function (event) {
            callback(event);
          });
        return listener;
      };
    return EventListenerHelper;
  })();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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
  Object.defineProperty(SliderElementDirective.prototype, 'position', {
    /**
     * @return {?}
     */
    get: function () {
      return this._position;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderElementDirective.prototype, 'dimension', {
    /**
     * @return {?}
     */
    get: function () {
      return this._dimension;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderElementDirective.prototype, 'alwaysHide', {
    /**
     * @return {?}
     */
    get: function () {
      return this._alwaysHide;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderElementDirective.prototype, 'vertical', {
    /**
     * @return {?}
     */
    get: function () {
      return this._vertical;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderElementDirective.prototype, 'scale', {
    /**
     * @return {?}
     */
    get: function () {
      return this._scale;
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderElementDirective.prototype, 'rotate', {
    /**
     * @return {?}
     */
    get: function () {
      return this._rotate;
    },
    enumerable: true,
    configurable: true,
  });
  /**
   * @param {?} hide
   * @return {?}
   */
  SliderElementDirective.prototype.setAlwaysHide =
    /**
     * @param {?} hide
     * @return {?}
     */
    function (hide) {
      this._alwaysHide = hide;
      if (hide) {
        this.visibility = 'hidden';
      } else {
        this.visibility = 'visible';
      }
    };
  /**
   * @return {?}
   */
  SliderElementDirective.prototype.hide =
    /**
     * @return {?}
     */
    function () {
      this.opacity = 0;
    };
  /**
   * @return {?}
   */
  SliderElementDirective.prototype.show =
    /**
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
  SliderElementDirective.prototype.isVisible =
    /**
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
  SliderElementDirective.prototype.setVertical =
    /**
     * @param {?} vertical
     * @return {?}
     */
    function (vertical) {
      this._vertical = vertical;
      if (this._vertical) {
        this.left = '';
        this.width = '';
      } else {
        this.bottom = '';
        this.height = '';
      }
    };
  /**
   * @param {?} scale
   * @return {?}
   */
  SliderElementDirective.prototype.setScale =
    /**
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
  SliderElementDirective.prototype.setRotate =
    /**
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
  SliderElementDirective.prototype.getRotate =
    /**
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
  SliderElementDirective.prototype.setPosition =
    /**
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
      } else {
        this.left = Math.round(pos) + 'px';
      }
    };
  // Calculate element's width/height depending on whether slider is horizontal or vertical
  /**
   * @return {?}
   */
  SliderElementDirective.prototype.calculateDimension =
    /**
     * @return {?}
     */
    function () {
      /** @type {?} */
      var val = this.getBoundingClientRect();
      if (this.vertical) {
        this._dimension = (val.bottom - val.top) * this.scale;
      } else {
        this._dimension = (val.right - val.left) * this.scale;
      }
    };
  // Set element width/height depending on whether slider is horizontal or vertical
  /**
   * @param {?} dim
   * @return {?}
   */
  SliderElementDirective.prototype.setDimension =
    /**
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
      } else {
        this.width = Math.round(dim) + 'px';
      }
    };
  /**
   * @return {?}
   */
  SliderElementDirective.prototype.getBoundingClientRect =
    /**
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
  SliderElementDirective.prototype.on =
    /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    function (eventName, callback, debounceInterval) {
      /** @type {?} */
      var listener = this.eventListenerHelper.attachEventListener(
        this.elemRef.nativeElement,
        eventName,
        callback,
        debounceInterval
      );
      this.eventListeners.push(listener);
    };
  /**
   * @param {?} eventName
   * @param {?} callback
   * @param {?=} debounceInterval
   * @return {?}
   */
  SliderElementDirective.prototype.onPassive =
    /**
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} debounceInterval
     * @return {?}
     */
    function (eventName, callback, debounceInterval) {
      /** @type {?} */
      var listener = this.eventListenerHelper.attachPassiveEventListener(
        this.elemRef.nativeElement,
        eventName,
        callback,
        debounceInterval
      );
      this.eventListeners.push(listener);
    };
  /**
   * @param {?=} eventName
   * @return {?}
   */
  SliderElementDirective.prototype.off =
    /**
     * @param {?=} eventName
     * @return {?}
     */
    function (eventName) {
      /** @type {?} */
      var listenersToKeep;
      /** @type {?} */
      var listenersToRemove;
      if (!ValueHelper.isNullOrUndefined(eventName)) {
        listenersToKeep = this.eventListeners.filter(function (event) {
          return event.eventName !== eventName;
        });
        listenersToRemove = this.eventListeners.filter(function (event) {
          return event.eventName === eventName;
        });
      } else {
        listenersToKeep = [];
        listenersToRemove = this.eventListeners;
      }
      try {
        for (
          var listenersToRemove_1 = __values(listenersToRemove),
            listenersToRemove_1_1 = listenersToRemove_1.next();
          !listenersToRemove_1_1.done;
          listenersToRemove_1_1 = listenersToRemove_1.next()
        ) {
          var listener = listenersToRemove_1_1.value;
          this.eventListenerHelper.detachEventListener(listener);
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (
            listenersToRemove_1_1 &&
            !listenersToRemove_1_1.done &&
            (_a = listenersToRemove_1.return)
          )
            _a.call(listenersToRemove_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      this.eventListeners = listenersToKeep;
      var e_1, _a;
    };
  /**
   * @return {?}
   */
  SliderElementDirective.prototype.isRefDestroyed =
    /**
     * @return {?}
     */
    function () {
      return (
        ValueHelper.isNullOrUndefined(this.changeDetectionRef) ||
        this.changeDetectionRef['destroyed']
      );
    };
  SliderElementDirective.decorators = [
    {
      type: Directive,
      args: [
        {
          selector: '[ngxSliderElement]',
        },
      ],
    },
  ];
  /** @nocollapse */
  SliderElementDirective.ctorParameters = function () {
    return [
      { type: ElementRef },
      { type: Renderer2 },
      { type: ChangeDetectorRef },
    ];
  };
  SliderElementDirective.propDecorators = {
    opacity: [{ type: HostBinding, args: ['style.opacity'] }],
    visibility: [{ type: HostBinding, args: ['style.visibility'] }],
    left: [{ type: HostBinding, args: ['style.left'] }],
    bottom: [{ type: HostBinding, args: ['style.bottom'] }],
    height: [{ type: HostBinding, args: ['style.height'] }],
    width: [{ type: HostBinding, args: ['style.width'] }],
    transform: [{ type: HostBinding, args: ['style.transform'] }],
  };
  return SliderElementDirective;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SliderHandleDirective = /** @class */ (function (_super) {
  __extends(SliderHandleDirective, _super);
  function SliderHandleDirective(elemRef, renderer, changeDetectionRef) {
    var _this =
      _super.call(this, elemRef, renderer, changeDetectionRef) || this;
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
  SliderHandleDirective.prototype.focus =
    /**
     * @return {?}
     */
    function () {
      this.elemRef.nativeElement.focus();
    };
  SliderHandleDirective.decorators = [
    {
      type: Directive,
      args: [
        {
          selector: '[ngxSliderHandle]',
        },
      ],
    },
  ];
  /** @nocollapse */
  SliderHandleDirective.ctorParameters = function () {
    return [
      { type: ElementRef },
      { type: Renderer2 },
      { type: ChangeDetectorRef },
    ];
  };
  SliderHandleDirective.propDecorators = {
    active: [{ type: HostBinding, args: ['class.ngx-slider-active'] }],
    role: [{ type: HostBinding, args: ['attr.role'] }],
    tabindex: [{ type: HostBinding, args: ['attr.tabindex'] }],
    ariaOrientation: [{ type: HostBinding, args: ['attr.aria-orientation'] }],
    ariaLabel: [{ type: HostBinding, args: ['attr.aria-label'] }],
    ariaLabelledBy: [{ type: HostBinding, args: ['attr.aria-labelledby'] }],
    ariaValueNow: [{ type: HostBinding, args: ['attr.aria-valuenow'] }],
    ariaValueText: [{ type: HostBinding, args: ['attr.aria-valuetext'] }],
    ariaValueMin: [{ type: HostBinding, args: ['attr.aria-valuemin'] }],
    ariaValueMax: [{ type: HostBinding, args: ['attr.aria-valuemax'] }],
  };
  return SliderHandleDirective;
})(SliderElementDirective);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var SliderLabelDirective = /** @class */ (function (_super) {
  __extends(SliderLabelDirective, _super);
  function SliderLabelDirective(elemRef, renderer, changeDetectionRef) {
    var _this =
      _super.call(this, elemRef, renderer, changeDetectionRef) || this;
    _this._value = null;
    return _this;
  }
  Object.defineProperty(SliderLabelDirective.prototype, 'value', {
    /**
     * @return {?}
     */
    get: function () {
      return this._value;
    },
    enumerable: true,
    configurable: true,
  });
  /**
   * @param {?} value
   * @return {?}
   */
  SliderLabelDirective.prototype.setValue =
    /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
      /** @type {?} */
      var recalculateDimension = false;
      if (
        !this.alwaysHide &&
        (ValueHelper.isNullOrUndefined(this.value) ||
          this.value.length !== value.length ||
          (this.value.length > 0 && this.dimension === 0))
      ) {
        recalculateDimension = true;
      }
      this._value = value;
      this.elemRef.nativeElement.innerHTML = value;
      // Update dimension only when length of the label have changed
      if (recalculateDimension) {
        this.calculateDimension();
      }
    };
  SliderLabelDirective.decorators = [
    {
      type: Directive,
      args: [
        {
          selector: '[ngxSliderLabel]',
        },
      ],
    },
  ];
  /** @nocollapse */
  SliderLabelDirective.ctorParameters = function () {
    return [
      { type: ElementRef },
      { type: Renderer2 },
      { type: ChangeDetectorRef },
    ];
  };
  return SliderLabelDirective;
})(SliderElementDirective);

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var Tick = /** @class */ (function () {
  function Tick() {
    this.selected = false;
    this.style = {};
    this.tooltip = null;
    this.tooltipPlacement = null;
    this.value = null;
    this.valueTooltip = null;
    this.valueTooltipPlacement = null;
    this.legend = null;
  }
  return Tick;
})();
var Dragging = /** @class */ (function () {
  function Dragging() {
    this.active = false;
    this.value = 0;
    this.difference = 0;
    this.position = 0;
    this.lowLimit = 0;
    this.highLimit = 0;
  }
  return Dragging;
})();
var ModelValues = /** @class */ (function () {
  function ModelValues() {}
  /**
   * @param {?=} x
   * @param {?=} y
   * @return {?}
   */
  ModelValues.compare =
    /**
     * @param {?=} x
     * @param {?=} y
     * @return {?}
     */
    function (x, y) {
      if (
        ValueHelper.isNullOrUndefined(x) &&
        ValueHelper.isNullOrUndefined(y)
      ) {
        return false;
      }
      if (
        ValueHelper.isNullOrUndefined(x) !== ValueHelper.isNullOrUndefined(y)
      ) {
        return false;
      }
      return x.value === y.value && x.highValue === y.highValue;
    };
  return ModelValues;
})();
var ModelChange = /** @class */ (function (_super) {
  __extends(ModelChange, _super);
  function ModelChange() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  /**
   * @param {?=} x
   * @param {?=} y
   * @return {?}
   */
  ModelChange.compare =
    /**
     * @param {?=} x
     * @param {?=} y
     * @return {?}
     */
    function (x, y) {
      if (
        ValueHelper.isNullOrUndefined(x) &&
        ValueHelper.isNullOrUndefined(y)
      ) {
        return false;
      }
      if (
        ValueHelper.isNullOrUndefined(x) !== ValueHelper.isNullOrUndefined(y)
      ) {
        return false;
      }
      return (
        x.value === y.value &&
        x.highValue === y.highValue &&
        x.forceChange === y.forceChange
      );
    };
  return ModelChange;
})(ModelValues);
var InputModelChange = /** @class */ (function (_super) {
  __extends(InputModelChange, _super);
  function InputModelChange() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return InputModelChange;
})(ModelChange);
var OutputModelChange = /** @class */ (function (_super) {
  __extends(OutputModelChange, _super);
  function OutputModelChange() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return OutputModelChange;
})(ModelChange);
/** @type {?} */
var NGX_SLIDER_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  /* tslint:disable-next-line: no-use-before-declare */
  useExisting: forwardRef(function () {
    return SliderComponent;
  }),
  multi: true,
};
var SliderComponent = /** @class */ (function () {
  function SliderComponent(renderer, elementRef, changeDetectionRef, zone) {
    this.renderer = renderer;
    this.elementRef = elementRef;
    this.changeDetectionRef = changeDetectionRef;
    this.zone = zone;
    // Model for low value of slider. For simple slider, this is the only input. For range slider, this is the low value.
    this.value = null;
    // Output for low value slider to support two-way bindings
    this.valueChange = new EventEmitter();
    // Model for high value of slider. Not used in simple slider. For range slider, this is the high value.
    this.highValue = null;
    // Output for high value slider to support two-way bindings
    this.highValueChange = new EventEmitter();
    // An object with all the other options of the slider.
    // Each option can be updated at runtime and the slider will automatically be re-rendered.
    this.options = new Options();
    // Event emitted when user starts interaction with the slider
    this.userChangeStart = new EventEmitter();
    // Event emitted on each change coming from user interaction
    this.userChange = new EventEmitter();
    // Event emitted when user finishes interaction with the slider
    this.userChangeEnd = new EventEmitter();
    this.initHasRun = false;
    this.inputModelChangeSubject = new Subject();
    this.inputModelChangeSubscription = null;
    this.outputModelChangeSubject = new Subject();
    this.outputModelChangeSubscription = null;
    this.viewLowValue = null;
    this.viewHighValue = null;
    this.viewOptions = new Options();
    this.handleHalfDimension = 0;
    this.maxHandlePosition = 0;
    this.currentTrackingPointer = null;
    this.currentFocusPointer = null;
    this.firstKeyDown = false;
    this.touchId = null;
    this.dragging = new Dragging();
    // Host element class bindings
    this.sliderElementVerticalClass = false;
    this.sliderElementAnimateClass = false;
    this.sliderElementWithLegendClass = false;
    this.sliderElementDisabledAttr = null;
    this.sliderElementAriaLabel = 'ngx-slider';
    this.barStyle = {};
    this.minPointerStyle = {};
    this.maxPointerStyle = {};
    this.fullBarTransparentClass = false;
    this.selectionBarDraggableClass = false;
    this.ticksUnderValuesClass = false;
    this.intermediateTicks = false;
    this.ticks = [];
    this.eventListenerHelper = null;
    this.onMoveEventListener = null;
    this.onEndEventListener = null;
    this.moving = false;
    this.resizeObserver = null;
    this.onTouchedCallback = null;
    this.onChangeCallback = null;
    this.eventListenerHelper = new EventListenerHelper(this.renderer);
  }
  Object.defineProperty(SliderComponent.prototype, 'manualRefresh', {
    // Input event that triggers slider refresh (re-positioning of slider elements)
    /**
     * @param {?} manualRefresh
     * @return {?}
     */
    set: function (manualRefresh) {
      var _this = this;
      this.unsubscribeManualRefresh();
      this.manualRefreshSubscription = manualRefresh.subscribe(function () {
        setTimeout(function () {
          return _this.calculateViewDimensionsAndDetectChanges();
        });
      });
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderComponent.prototype, 'triggerFocus', {
    // Input event that triggers setting focus on given slider handle
    /**
     * @param {?} triggerFocus
     * @return {?}
     */
    set: function (triggerFocus) {
      var _this = this;
      this.unsubscribeTriggerFocus();
      this.triggerFocusSubscription = triggerFocus.subscribe(function (
        pointerType
      ) {
        _this.focusPointer(pointerType);
      });
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderComponent.prototype, 'range', {
    /**
     * @return {?}
     */
    get: function () {
      return (
        !ValueHelper.isNullOrUndefined(this.value) &&
        !ValueHelper.isNullOrUndefined(this.highValue)
      );
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(SliderComponent.prototype, 'showTicks', {
    /**
     * @return {?}
     */
    get: function () {
      return this.viewOptions.showTicks;
    },
    enumerable: true,
    configurable: true,
  });
  /**
   * @return {?}
   */
  SliderComponent.prototype.ngOnInit =
    /**
     * @return {?}
     */
    function () {
      this.viewOptions = new Options();
      Object.assign(this.viewOptions, this.options);
      // We need to run these two things first, before the rest of the init in ngAfterViewInit(),
      // because these two settings are set through @HostBinding and Angular change detection
      // mechanism doesn't like them changing in ngAfterViewInit()
      this.updateDisabledState();
      this.updateVerticalState();
      this.updateAriaLabel();
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.ngAfterViewInit =
    /**
     * @return {?}
     */
    function () {
      console.log('ngAfterViewInit angular-slider-ngx-slider.js');

      this.applyOptions();
      this.subscribeInputModelChangeSubject();
      this.subscribeOutputModelChangeSubject();
      // Once we apply options, we need to normalise model values for the first time
      this.renormaliseModelValues();
      this.viewLowValue = this.modelValueToViewValue(this.value);
      if (this.range) {
        this.viewHighValue = this.modelValueToViewValue(this.highValue);
      } else {
        this.viewHighValue = null;
      }
      this.updateVerticalState(); // need to run this again to cover changes to slider elements
      this.manageElementsStyle();
      this.updateDisabledState();
      this.calculateViewDimensions();
      this.addAccessibility();
      this.updateCeilLabel();
      this.updateFloorLabel();
      this.initHandles();
      this.manageEventsBindings();
      this.updateAriaLabel();
      this.subscribeResizeObserver();
      this.initHasRun = true;
      // Run change detection manually to resolve some issues when init procedure changes values used in the view
      if (!this.isRefDestroyed()) {
        this.changeDetectionRef.detectChanges();
      }
    };
  /**
   * @param {?} changes
   * @return {?}
   */
  SliderComponent.prototype.ngOnChanges =
    /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
      // Always apply options first
      if (
        !ValueHelper.isNullOrUndefined(changes['options']) &&
        JSON.stringify(changes['options'].previousValue) !==
          JSON.stringify(changes['options'].currentValue)
      ) {
        this.onChangeOptions();
      }
      // Then value changes
      if (
        !ValueHelper.isNullOrUndefined(changes['value']) ||
        !ValueHelper.isNullOrUndefined(changes['highValue'])
      ) {
        this.inputModelChangeSubject.next({
          value: this.value,
          highValue: this.highValue,
          forceChange: false,
          internalChange: false,
        });
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.ngOnDestroy =
    /**
     * @return {?}
     */
    function () {
      this.unbindEvents();
      this.unsubscribeResizeObserver();
      this.unsubscribeInputModelChangeSubject();
      this.unsubscribeOutputModelChangeSubject();
      this.unsubscribeManualRefresh();
      this.unsubscribeTriggerFocus();
    };
  /**
   * @param {?} obj
   * @return {?}
   */
  SliderComponent.prototype.writeValue =
    /**
     * @param {?} obj
     * @return {?}
     */
    function (obj) {
      if (obj instanceof Array) {
        this.value = obj[0];
        this.highValue = obj[1];
      } else {
        this.value = obj;
      }
      // ngOnChanges() is not called in this instance, so we need to communicate the change manually
      this.inputModelChangeSubject.next({
        value: this.value,
        highValue: this.highValue,
        forceChange: false,
        internalChange: false,
      });
    };
  /**
   * @param {?} onChangeCallback
   * @return {?}
   */
  SliderComponent.prototype.registerOnChange =
    /**
     * @param {?} onChangeCallback
     * @return {?}
     */
    function (onChangeCallback) {
      this.onChangeCallback = onChangeCallback;
    };
  /**
   * @param {?} onTouchedCallback
   * @return {?}
   */
  SliderComponent.prototype.registerOnTouched =
    /**
     * @param {?} onTouchedCallback
     * @return {?}
     */
    function (onTouchedCallback) {
      this.onTouchedCallback = onTouchedCallback;
    };
  /**
   * @param {?} isDisabled
   * @return {?}
   */
  SliderComponent.prototype.setDisabledState =
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    function (isDisabled) {
      this.viewOptions.disabled = isDisabled;
      this.updateDisabledState();
    };
  /**
   * @param {?} ariaLabel
   * @return {?}
   */
  SliderComponent.prototype.setAriaLabel =
    /**
     * @param {?} ariaLabel
     * @return {?}
     */
    function (ariaLabel) {
      this.viewOptions.ariaLabel = ariaLabel;
      this.updateAriaLabel();
    };
  /**
   * @param {?} event
   * @return {?}
   */
  SliderComponent.prototype.onResize =
    /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
      this.calculateViewDimensionsAndDetectChanges();
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.subscribeInputModelChangeSubject =
    /**
     * @return {?}
     */
    function () {
      var _this = this;
      this.inputModelChangeSubscription = this.inputModelChangeSubject
        .pipe(
          distinctUntilChanged(ModelChange.compare),
          // Hack to reset the status of the distinctUntilChanged() - if a "fake" event comes through with forceChange=true,
          // we forcefully by-pass distinctUntilChanged(), but otherwise drop the event
          filter(function (modelChange) {
            return !modelChange.forceChange && !modelChange.internalChange;
          })
        )
        .subscribe(function (modelChange) {
          return _this.applyInputModelChange(modelChange);
        });
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.subscribeOutputModelChangeSubject =
    /**
     * @return {?}
     */
    function () {
      var _this = this;
      this.outputModelChangeSubscription = this.outputModelChangeSubject
        .pipe(distinctUntilChanged(ModelChange.compare))
        .subscribe(function (modelChange) {
          return _this.publishOutputModelChange(modelChange);
        });
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.subscribeResizeObserver =
    /**
     * @return {?}
     */
    function () {
      var _this = this;
      if (CompatibilityHelper.isResizeObserverAvailable()) {
        this.resizeObserver = new ResizeObserver(function () {
          return _this.calculateViewDimensionsAndDetectChanges();
        });
        this.resizeObserver.observe(this.elementRef.nativeElement);
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unsubscribeResizeObserver =
    /**
     * @return {?}
     */
    function () {
      if (
        CompatibilityHelper.isResizeObserverAvailable() &&
        this.resizeObserver !== null
      ) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unsubscribeOnMove =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.onMoveEventListener)) {
        this.eventListenerHelper.detachEventListener(this.onMoveEventListener);
        this.onMoveEventListener = null;
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unsubscribeOnEnd =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.onEndEventListener)) {
        this.eventListenerHelper.detachEventListener(this.onEndEventListener);
        this.onEndEventListener = null;
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unsubscribeInputModelChangeSubject =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.inputModelChangeSubscription)) {
        this.inputModelChangeSubscription.unsubscribe();
        this.inputModelChangeSubscription = null;
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unsubscribeOutputModelChangeSubject =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.outputModelChangeSubscription)) {
        this.outputModelChangeSubscription.unsubscribe();
        this.outputModelChangeSubscription = null;
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unsubscribeManualRefresh =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.manualRefreshSubscription)) {
        this.manualRefreshSubscription.unsubscribe();
        this.manualRefreshSubscription = null;
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unsubscribeTriggerFocus =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.triggerFocusSubscription)) {
        this.triggerFocusSubscription.unsubscribe();
        this.triggerFocusSubscription = null;
      }
    };
  /**
   * @param {?} pointerType
   * @return {?}
   */
  SliderComponent.prototype.getPointerElement =
    /**
     * @param {?} pointerType
     * @return {?}
     */
    function (pointerType) {
      if (pointerType === PointerType.Min) {
        return this.minHandleElement;
      } else if (pointerType === PointerType.Max) {
        return this.maxHandleElement;
      }
      return null;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.getCurrentTrackingValue =
    /**
     * @return {?}
     */
    function () {
      if (this.currentTrackingPointer === PointerType.Min) {
        return this.viewLowValue;
      } else if (this.currentTrackingPointer === PointerType.Max) {
        return this.viewHighValue;
      }
      return null;
    };
  /**
   * @param {?} modelValue
   * @return {?}
   */
  SliderComponent.prototype.modelValueToViewValue =
    /**
     * @param {?} modelValue
     * @return {?}
     */
    function (modelValue) {
      if (ValueHelper.isNullOrUndefined(modelValue)) {
        return NaN;
      }
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.stepsArray) &&
        !this.viewOptions.bindIndexForStepsArray
      ) {
        return ValueHelper.findStepIndex(
          +modelValue,
          this.viewOptions.stepsArray
        );
      }
      return +modelValue;
    };
  /**
   * @param {?} viewValue
   * @return {?}
   */
  SliderComponent.prototype.viewValueToModelValue =
    /**
     * @param {?} viewValue
     * @return {?}
     */
    function (viewValue) {
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.stepsArray) &&
        !this.viewOptions.bindIndexForStepsArray
      ) {
        return this.getStepValue(viewValue);
      }
      return viewValue;
    };
  /**
   * @param {?} sliderValue
   * @return {?}
   */
  SliderComponent.prototype.getStepValue =
    /**
     * @param {?} sliderValue
     * @return {?}
     */
    function (sliderValue) {
      /** @type {?} */
      var step = this.viewOptions.stepsArray[sliderValue];
      return !ValueHelper.isNullOrUndefined(step) ? step.value : NaN;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.applyViewChange =
    /**
     * @return {?}
     */
    function () {
      this.value = this.viewValueToModelValue(this.viewLowValue);
      if (this.range) {
        this.highValue = this.viewValueToModelValue(this.viewHighValue);
      }
      this.outputModelChangeSubject.next({
        value: this.value,
        highValue: this.highValue,
        userEventInitiated: true,
        forceChange: false,
      });
      // At this point all changes are applied and outputs are emitted, so we should be done.
      // However, input changes are communicated in different stream and we need to be ready to
      // act on the next input change even if it is exactly the same as last input change.
      // Therefore, we send a special event to reset the stream.
      this.inputModelChangeSubject.next({
        value: this.value,
        highValue: this.highValue,
        forceChange: false,
        internalChange: true,
      });
    };
  /**
   * @param {?} modelChange
   * @return {?}
   */
  SliderComponent.prototype.applyInputModelChange =
    /**
     * @param {?} modelChange
     * @return {?}
     */
    function (modelChange) {
      /** @type {?} */
      var normalisedModelChange = this.normaliseModelValues(modelChange);
      /** @type {?} */
      var normalisationChange = !ModelValues.compare(
        modelChange,
        normalisedModelChange
      );
      if (normalisationChange) {
        this.value = normalisedModelChange.value;
        this.highValue = normalisedModelChange.highValue;
      }
      this.viewLowValue = this.modelValueToViewValue(
        normalisedModelChange.value
      );
      if (this.range) {
        this.viewHighValue = this.modelValueToViewValue(
          normalisedModelChange.highValue
        );
      } else {
        this.viewHighValue = null;
      }
      this.updateLowHandle(this.valueToPosition(this.viewLowValue));
      if (this.range) {
        this.updateHighHandle(this.valueToPosition(this.viewHighValue));
      }
      this.updateSelectionBar();
      this.updateTicksScale();
      this.updateAriaAttributes();
      if (this.range) {
        this.updateCombinedLabel();
      }
      // At the end, we need to communicate the model change to the outputs as well
      // Normalisation changes are also always forced out to ensure that subscribers always end up in correct state
      this.outputModelChangeSubject.next({
        value: normalisedModelChange.value,
        highValue: normalisedModelChange.highValue,
        forceChange: normalisationChange,
        userEventInitiated: false,
      });
    };
  /**
   * @param {?} modelChange
   * @return {?}
   */
  SliderComponent.prototype.publishOutputModelChange =
    /**
     * @param {?} modelChange
     * @return {?}
     */
    function (modelChange) {
      var _this = this;
      /** @type {?} */
      var emitOutputs = function () {
        _this.valueChange.emit(modelChange.value);
        if (_this.range) {
          _this.highValueChange.emit(modelChange.highValue);
        }
        if (!ValueHelper.isNullOrUndefined(_this.onChangeCallback)) {
          if (_this.range) {
            _this.onChangeCallback([modelChange.value, modelChange.highValue]);
          } else {
            _this.onChangeCallback(modelChange.value);
          }
        }
        if (!ValueHelper.isNullOrUndefined(_this.onTouchedCallback)) {
          if (_this.range) {
            _this.onTouchedCallback([modelChange.value, modelChange.highValue]);
          } else {
            _this.onTouchedCallback(modelChange.value);
          }
        }
      };
      if (modelChange.userEventInitiated) {
        // If this change was initiated by a user event, we can emit outputs in the same tick
        emitOutputs();
        this.userChange.emit(this.getChangeContext());
      } else {
        // But, if the change was initated by something else like a change in input bindings,
        // we need to wait until next tick to emit the outputs to keep Angular change detection happy
        setTimeout(function () {
          emitOutputs();
        });
      }
    };
  /**
   * @param {?} input
   * @return {?}
   */
  SliderComponent.prototype.normaliseModelValues =
    /**
     * @param {?} input
     * @return {?}
     */
    function (input) {
      /** @type {?} */
      var normalisedInput = new ModelValues();
      normalisedInput.value = input.value;
      normalisedInput.highValue = input.highValue;
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.stepsArray)) {
        // When using steps array, only round to nearest step in the array
        // No other enforcement can be done, as the step array may be out of order, and that is perfectly fine
        if (this.viewOptions.enforceStepsArray) {
          /** @type {?} */
          var valueIndex = ValueHelper.findStepIndex(
            normalisedInput.value,
            this.viewOptions.stepsArray
          );
          normalisedInput.value = this.viewOptions.stepsArray[valueIndex].value;
          if (this.range) {
            /** @type {?} */
            var highValueIndex = ValueHelper.findStepIndex(
              normalisedInput.highValue,
              this.viewOptions.stepsArray
            );
            normalisedInput.highValue =
              this.viewOptions.stepsArray[highValueIndex].value;
          }
        }
        return normalisedInput;
      }
      if (this.viewOptions.enforceStep) {
        normalisedInput.value = this.roundStep(normalisedInput.value);
        if (this.range) {
          normalisedInput.highValue = this.roundStep(normalisedInput.highValue);
        }
      }
      if (this.viewOptions.enforceRange) {
        normalisedInput.value = MathHelper.clampToRange(
          normalisedInput.value,
          this.viewOptions.floor,
          this.viewOptions.ceil
        );
        if (this.range) {
          normalisedInput.highValue = MathHelper.clampToRange(
            normalisedInput.highValue,
            this.viewOptions.floor,
            this.viewOptions.ceil
          );
        }
        // Make sure that range slider invariant (value <= highValue) is always satisfied
        if (this.range && input.value > input.highValue) {
          // We know that both values are now clamped correctly, they may just be in the wrong order
          // So the easy solution is to swap them... except swapping is sometimes disabled in options, so we make the two values the same
          if (this.viewOptions.noSwitching) {
            normalisedInput.value = normalisedInput.highValue;
          } else {
            /** @type {?} */
            var tempValue = input.value;
            normalisedInput.value = input.highValue;
            normalisedInput.highValue = tempValue;
          }
        }
      }
      return normalisedInput;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.renormaliseModelValues =
    /**
     * @return {?}
     */
    function () {
      /** @type {?} */
      var previousModelValues = {
        value: this.value,
        highValue: this.highValue,
      };
      /** @type {?} */
      var normalisedModelValues =
        this.normaliseModelValues(previousModelValues);
      if (!ModelValues.compare(normalisedModelValues, previousModelValues)) {
        this.value = normalisedModelValues.value;
        this.highValue = normalisedModelValues.highValue;
        this.outputModelChangeSubject.next({
          value: this.value,
          highValue: this.highValue,
          forceChange: true,
          userEventInitiated: false,
        });
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.onChangeOptions =
    /**
     * @return {?}
     */
    function () {
      if (!this.initHasRun) {
        return;
      }
      /** @type {?} */
      var previousOptionsInfluencingEventBindings =
        this.getOptionsInfluencingEventBindings(this.viewOptions);
      this.applyOptions();
      /** @type {?} */
      var newOptionsInfluencingEventBindings =
        this.getOptionsInfluencingEventBindings(this.viewOptions);
      /** @type {?} */
      var rebindEvents = !ValueHelper.areArraysEqual(
        previousOptionsInfluencingEventBindings,
        newOptionsInfluencingEventBindings
      );
      // With new options, we need to re-normalise model values if necessary
      this.renormaliseModelValues();
      this.viewLowValue = this.modelValueToViewValue(this.value);
      if (this.range) {
        this.viewHighValue = this.modelValueToViewValue(this.highValue);
      } else {
        this.viewHighValue = null;
      }
      this.resetSlider(rebindEvents);
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.applyOptions =
    /**
     * @return {?}
     */
    function () {
      this.viewOptions = new Options();
      Object.assign(this.viewOptions, this.options);
      this.viewOptions.draggableRange =
        this.range && this.viewOptions.draggableRange;
      this.viewOptions.draggableRangeOnly =
        this.range && this.viewOptions.draggableRangeOnly;
      if (this.viewOptions.draggableRangeOnly) {
        this.viewOptions.draggableRange = true;
      }
      this.viewOptions.showTicks =
        this.viewOptions.showTicks ||
        this.viewOptions.showTicksValues ||
        !ValueHelper.isNullOrUndefined(this.viewOptions.ticksArray);
      if (
        this.viewOptions.showTicks &&
        (!ValueHelper.isNullOrUndefined(this.viewOptions.tickStep) ||
          !ValueHelper.isNullOrUndefined(this.viewOptions.ticksArray))
      ) {
        this.intermediateTicks = true;
      }
      this.viewOptions.showSelectionBar =
        this.viewOptions.showSelectionBar ||
        this.viewOptions.showSelectionBarEnd ||
        !ValueHelper.isNullOrUndefined(
          this.viewOptions.showSelectionBarFromValue
        );
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.stepsArray)) {
        this.applyStepsArrayOptions();
      } else {
        this.applyFloorCeilOptions();
      }
      if (ValueHelper.isNullOrUndefined(this.viewOptions.combineLabels)) {
        this.viewOptions.combineLabels = function (minValue, maxValue) {
          return minValue + ' - ' + maxValue;
        };
      }
      if (this.viewOptions.logScale && this.viewOptions.floor === 0) {
        throw Error("Can't use floor=0 with logarithmic scale");
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.applyStepsArrayOptions =
    /**
     * @return {?}
     */
    function () {
      var _this = this;
      this.viewOptions.floor = 0;
      this.viewOptions.ceil = this.viewOptions.stepsArray.length - 1;
      this.viewOptions.step = 1;
      if (ValueHelper.isNullOrUndefined(this.viewOptions.translate)) {
        this.viewOptions.translate = function (modelValue) {
          if (_this.viewOptions.bindIndexForStepsArray) {
            return String(_this.getStepValue(modelValue));
          }
          return String(modelValue);
        };
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.applyFloorCeilOptions =
    /**
     * @return {?}
     */
    function () {
      if (ValueHelper.isNullOrUndefined(this.viewOptions.step)) {
        this.viewOptions.step = 1;
      } else {
        this.viewOptions.step = +this.viewOptions.step;
        if (this.viewOptions.step <= 0) {
          this.viewOptions.step = 1;
        }
      }
      if (
        ValueHelper.isNullOrUndefined(this.viewOptions.ceil) ||
        ValueHelper.isNullOrUndefined(this.viewOptions.floor)
      ) {
        throw Error('floor and ceil options must be supplied');
      }
      this.viewOptions.ceil = +this.viewOptions.ceil;
      this.viewOptions.floor = +this.viewOptions.floor;
      if (ValueHelper.isNullOrUndefined(this.viewOptions.translate)) {
        this.viewOptions.translate = function (value) {
          return String(value);
        };
      }
    };
  /**
   * @param {?=} rebindEvents
   * @return {?}
   */
  SliderComponent.prototype.resetSlider =
    /**
     * @param {?=} rebindEvents
     * @return {?}
     */
    function (rebindEvents) {
      if (rebindEvents === void 0) {
        rebindEvents = true;
      }
      this.manageElementsStyle();
      this.addAccessibility();
      this.updateCeilLabel();
      this.updateFloorLabel();
      if (rebindEvents) {
        this.unbindEvents();
        this.manageEventsBindings();
      }
      this.updateDisabledState();
      this.updateAriaLabel();
      this.calculateViewDimensions();
      this.refocusPointerIfNeeded();
    };
  /**
   * @param {?} pointerType
   * @return {?}
   */
  SliderComponent.prototype.focusPointer =
    /**
     * @param {?} pointerType
     * @return {?}
     */
    function (pointerType) {
      // If not supplied, use min pointer as default
      if (pointerType !== PointerType.Min && pointerType !== PointerType.Max) {
        pointerType = PointerType.Min;
      }
      if (pointerType === PointerType.Min) {
        this.minHandleElement.focus();
      } else if (this.range && pointerType === PointerType.Max) {
        this.maxHandleElement.focus();
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.refocusPointerIfNeeded =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.currentFocusPointer)) {
        this.onPointerFocus(this.currentFocusPointer);
        /** @type {?} */
        var element = this.getPointerElement(this.currentFocusPointer);
        element.focus();
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.manageElementsStyle =
    /**
     * @return {?}
     */
    function () {
      var _this = this;
      this.updateScale();
      this.floorLabelElement.setAlwaysHide(
        this.viewOptions.showTicksValues || this.viewOptions.hideLimitLabels
      );
      this.ceilLabelElement.setAlwaysHide(
        this.viewOptions.showTicksValues || this.viewOptions.hideLimitLabels
      );
      /** @type {?} */
      var hideLabelsForTicks =
        this.viewOptions.showTicksValues && !this.intermediateTicks;
      this.minHandleLabelElement.setAlwaysHide(
        hideLabelsForTicks || this.viewOptions.hidePointerLabels
      );
      this.maxHandleLabelElement.setAlwaysHide(
        hideLabelsForTicks || !this.range || this.viewOptions.hidePointerLabels
      );
      this.combinedLabelElement.setAlwaysHide(
        hideLabelsForTicks || !this.range || this.viewOptions.hidePointerLabels
      );
      this.selectionBarElement.setAlwaysHide(
        !this.range && !this.viewOptions.showSelectionBar
      );
      this.leftOuterSelectionBarElement.setAlwaysHide(
        !this.range || !this.viewOptions.showOuterSelectionBars
      );
      this.rightOuterSelectionBarElement.setAlwaysHide(
        !this.range || !this.viewOptions.showOuterSelectionBars
      );
      this.fullBarTransparentClass =
        this.range && this.viewOptions.showOuterSelectionBars;
      this.selectionBarDraggableClass =
        this.viewOptions.draggableRange && !this.viewOptions.onlyBindHandles;
      this.ticksUnderValuesClass =
        this.intermediateTicks && this.options.showTicksValues;
      if (this.sliderElementVerticalClass !== this.viewOptions.vertical) {
        this.updateVerticalState();
        // The above change in host component class will not be applied until the end of this cycle
        // However, functions calculating the slider position expect the slider to be already styled as vertical
        // So as a workaround, we need to reset the slider once again to compute the correct values
        setTimeout(function () {
          _this.resetSlider();
        });
      }
      // Changing animate class may interfere with slider reset/initialisation, so we should set it separately,
      // after all is properly set up
      if (this.sliderElementAnimateClass !== this.viewOptions.animate) {
        setTimeout(function () {
          _this.sliderElementAnimateClass = _this.viewOptions.animate;
        });
      }
      this.updateRotate();
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.manageEventsBindings =
    /**
     * @return {?}
     */
    function () {
      if (this.viewOptions.disabled || this.viewOptions.readOnly) {
        this.unbindEvents();
      } else {
        this.bindEvents();
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateDisabledState =
    /**
     * @return {?}
     */
    function () {
      this.sliderElementDisabledAttr = this.viewOptions.disabled
        ? 'disabled'
        : null;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateAriaLabel =
    /**
     * @return {?}
     */
    function () {
      this.sliderElementAriaLabel = this.viewOptions.ariaLabel || 'nxg-slider';
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateVerticalState =
    /**
     * @return {?}
     */
    function () {
      this.sliderElementVerticalClass = this.viewOptions.vertical;
      try {
        for (
          var _a = __values(this.getAllSliderElements()), _b = _a.next();
          !_b.done;
          _b = _a.next()
        ) {
          var element = _b.value;
          // This is also called before ngAfterInit, so need to check that view child bindings work
          if (!ValueHelper.isNullOrUndefined(element)) {
            element.setVertical(this.viewOptions.vertical);
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      var e_1, _c;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateScale =
    /**
     * @return {?}
     */
    function () {
      try {
        for (
          var _a = __values(this.getAllSliderElements()), _b = _a.next();
          !_b.done;
          _b = _a.next()
        ) {
          var element = _b.value;
          element.setScale(this.viewOptions.scale);
        }
      } catch (e_2_1) {
        e_2 = { error: e_2_1 };
      } finally {
        try {
          if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
      var e_2, _c;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateRotate =
    /**
     * @return {?}
     */
    function () {
      try {
        for (
          var _a = __values(this.getAllSliderElements()), _b = _a.next();
          !_b.done;
          _b = _a.next()
        ) {
          var element = _b.value;
          element.setRotate(this.viewOptions.rotate);
        }
      } catch (e_3_1) {
        e_3 = { error: e_3_1 };
      } finally {
        try {
          if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
      var e_3, _c;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.getAllSliderElements =
    /**
     * @return {?}
     */
    function () {
      return [
        this.leftOuterSelectionBarElement,
        this.rightOuterSelectionBarElement,
        this.fullBarElement,
        this.selectionBarElement,
        this.minHandleElement,
        this.maxHandleElement,
        this.floorLabelElement,
        this.ceilLabelElement,
        this.minHandleLabelElement,
        this.maxHandleLabelElement,
        this.combinedLabelElement,
        this.ticksElement,
      ];
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.initHandles =
    /**
     * @return {?}
     */
    function () {
      this.updateLowHandle(this.valueToPosition(this.viewLowValue));
      /*
           the order here is important since the selection bar should be
           updated after the high handle but before the combined label
           */
      if (this.range) {
        this.updateHighHandle(this.valueToPosition(this.viewHighValue));
      }
      this.updateSelectionBar();
      if (this.range) {
        this.updateCombinedLabel();
      }
      this.updateTicksScale();
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.addAccessibility =
    /**
     * @return {?}
     */
    function () {
      this.updateAriaAttributes();
      this.minHandleElement.role = 'slider';
      if (
        this.viewOptions.keyboardSupport &&
        !(this.viewOptions.readOnly || this.viewOptions.disabled)
      ) {
        this.minHandleElement.tabindex = '0';
      } else {
        this.minHandleElement.tabindex = '';
      }
      this.minHandleElement.ariaOrientation =
        this.viewOptions.vertical || this.viewOptions.rotate !== 0
          ? 'vertical'
          : 'horizontal';
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.ariaLabel)) {
        this.minHandleElement.ariaLabel = this.viewOptions.ariaLabel;
      } else if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.ariaLabelledBy)
      ) {
        this.minHandleElement.ariaLabelledBy = this.viewOptions.ariaLabelledBy;
      }
      if (this.range) {
        this.maxHandleElement.role = 'slider';
        if (
          this.viewOptions.keyboardSupport &&
          !(this.viewOptions.readOnly || this.viewOptions.disabled)
        ) {
          this.maxHandleElement.tabindex = '0';
        } else {
          this.maxHandleElement.tabindex = '';
        }
        this.maxHandleElement.ariaOrientation =
          this.viewOptions.vertical || this.viewOptions.rotate !== 0
            ? 'vertical'
            : 'horizontal';
        if (!ValueHelper.isNullOrUndefined(this.viewOptions.ariaLabelHigh)) {
          this.maxHandleElement.ariaLabel = this.viewOptions.ariaLabelHigh;
        } else if (
          !ValueHelper.isNullOrUndefined(this.viewOptions.ariaLabelledByHigh)
        ) {
          this.maxHandleElement.ariaLabelledBy =
            this.viewOptions.ariaLabelledByHigh;
        }
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateAriaAttributes =
    /**
     * @return {?}
     */
    function () {
      this.minHandleElement.ariaValueNow = (+this.value).toString();
      this.minHandleElement.ariaValueText = this.viewOptions.translate(
        +this.value,
        LabelType.Low
      );
      this.minHandleElement.ariaValueMin = this.viewOptions.floor.toString();
      this.minHandleElement.ariaValueMax = this.viewOptions.ceil.toString();
      if (this.range) {
        this.maxHandleElement.ariaValueNow = (+this.highValue).toString();
        this.maxHandleElement.ariaValueText = this.viewOptions.translate(
          +this.highValue,
          LabelType.High
        );
        this.maxHandleElement.ariaValueMin = this.viewOptions.floor.toString();
        this.maxHandleElement.ariaValueMax = this.viewOptions.ceil.toString();
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.calculateViewDimensions =
    /**
     * @return {?}
     */
    function () {
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.handleDimension)) {
        this.minHandleElement.setDimension(this.viewOptions.handleDimension);
      } else {
        this.minHandleElement.calculateDimension();
      }
      /** @type {?} */
      var handleWidth = this.minHandleElement.dimension;
      this.handleHalfDimension = handleWidth / 2;
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.barDimension)) {
        this.fullBarElement.setDimension(this.viewOptions.barDimension);
      } else {
        this.fullBarElement.calculateDimension();
      }
      this.maxHandlePosition = this.fullBarElement.dimension - handleWidth;
      if (this.initHasRun) {
        this.updateFloorLabel();
        this.updateCeilLabel();
        this.initHandles();
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.calculateViewDimensionsAndDetectChanges =
    /**
     * @return {?}
     */
    function () {
      this.calculateViewDimensions();
      if (!this.isRefDestroyed()) {
        this.changeDetectionRef.detectChanges();
      }
    };
  /**
   * If the slider reference is already destroyed
   * @return {?} boolean - true if ref is destroyed
   */
  SliderComponent.prototype.isRefDestroyed =
    /**
     * If the slider reference is already destroyed
     * @return {?} boolean - true if ref is destroyed
     */
    function () {
      return this.changeDetectionRef['destroyed'];
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateTicksScale =
    /**
     * @return {?}
     */
    function () {
      var _this = this;
      if (!this.viewOptions.showTicks) {
        setTimeout(function () {
          _this.sliderElementWithLegendClass = false;
        });
        return;
      }
      /** @type {?} */
      var ticksArray = !ValueHelper.isNullOrUndefined(
        this.viewOptions.ticksArray
      )
        ? this.viewOptions.ticksArray
        : this.getTicksArray();
      /** @type {?} */
      var translate = this.viewOptions.vertical ? 'translateY' : 'translateX';
      if (this.viewOptions.rightToLeft) {
        ticksArray.reverse();
      }
      /** @type {?} */
      var tickValueStep = !ValueHelper.isNullOrUndefined(
        this.viewOptions.tickValueStep
      )
        ? this.viewOptions.tickValueStep
        : !ValueHelper.isNullOrUndefined(this.viewOptions.tickStep)
        ? this.viewOptions.tickStep
        : this.viewOptions.step;
      /** @type {?} */
      var hasAtLeastOneLegend = false;
      /** @type {?} */
      var newTicks = ticksArray.map(function (value) {
        /** @type {?} */
        var position = _this.valueToPosition(value);
        if (_this.viewOptions.vertical) {
          position = _this.maxHandlePosition - position;
        }
        /** @type {?} */
        var translation = translate + '(' + Math.round(position) + 'px)';
        /** @type {?} */
        var tick = new Tick();
        tick.selected = _this.isTickSelected(value);
        tick.style = {
          '-webkit-transform': translation,
          '-moz-transform': translation,
          '-o-transform': translation,
          '-ms-transform': translation,
          transform: translation,
        };
        if (
          tick.selected &&
          !ValueHelper.isNullOrUndefined(_this.viewOptions.getSelectionBarColor)
        ) {
          tick.style['background-color'] = _this.getSelectionBarColor();
        }
        if (
          !tick.selected &&
          !ValueHelper.isNullOrUndefined(_this.viewOptions.getTickColor)
        ) {
          tick.style['background-color'] = _this.getTickColor(value);
        }
        if (!ValueHelper.isNullOrUndefined(_this.viewOptions.ticksTooltip)) {
          tick.tooltip = _this.viewOptions.ticksTooltip(value);
          tick.tooltipPlacement = _this.viewOptions.vertical ? 'right' : 'top';
        }
        if (
          _this.viewOptions.showTicksValues &&
          !ValueHelper.isNullOrUndefined(tickValueStep) &&
          MathHelper.isModuloWithinPrecisionLimit(
            value,
            tickValueStep,
            _this.viewOptions.precisionLimit
          )
        ) {
          tick.value = _this.getDisplayValue(value, LabelType.TickValue);
          if (
            !ValueHelper.isNullOrUndefined(_this.viewOptions.ticksValuesTooltip)
          ) {
            tick.valueTooltip = _this.viewOptions.ticksValuesTooltip(value);
            tick.valueTooltipPlacement = _this.viewOptions.vertical
              ? 'right'
              : 'top';
          }
        }
        /** @type {?} */
        var legend = null;
        if (!ValueHelper.isNullOrUndefined(_this.viewOptions.stepsArray)) {
          /** @type {?} */
          var step = _this.viewOptions.stepsArray[value];
          if (!ValueHelper.isNullOrUndefined(_this.viewOptions.getStepLegend)) {
            legend = _this.viewOptions.getStepLegend(step);
          } else if (!ValueHelper.isNullOrUndefined(step)) {
            legend = step.legend;
          }
        } else if (
          !ValueHelper.isNullOrUndefined(_this.viewOptions.getLegend)
        ) {
          legend = _this.viewOptions.getLegend(value);
        }
        if (!ValueHelper.isNullOrUndefined(legend)) {
          tick.legend = legend;
          hasAtLeastOneLegend = true;
        }
        return tick;
      });
      setTimeout(function () {
        _this.sliderElementWithLegendClass = hasAtLeastOneLegend;
      });
      // We should avoid re-creating the ticks array if possible
      // This both improves performance and makes CSS animations work correctly
      if (
        !ValueHelper.isNullOrUndefined(this.ticks) &&
        this.ticks.length === newTicks.length
      ) {
        for (var i = 0; i < newTicks.length; ++i) {
          Object.assign(this.ticks[i], newTicks[i]);
        }
      } else {
        this.ticks = newTicks;
      }
      if (!this.isRefDestroyed()) {
        this.changeDetectionRef.detectChanges();
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.getTicksArray =
    /**
     * @return {?}
     */
    function () {
      /** @type {?} */
      var step = !ValueHelper.isNullOrUndefined(this.viewOptions.tickStep)
        ? this.viewOptions.tickStep
        : this.viewOptions.step;
      /** @type {?} */
      var ticksArray = [];
      /** @type {?} */
      var numberOfValues =
        1 +
        Math.floor(
          MathHelper.roundToPrecisionLimit(
            Math.abs(this.viewOptions.ceil - this.viewOptions.floor) / step,
            this.viewOptions.precisionLimit
          )
        );
      for (var index = 0; index < numberOfValues; ++index) {
        ticksArray.push(
          MathHelper.roundToPrecisionLimit(
            this.viewOptions.floor + step * index,
            this.viewOptions.precisionLimit
          )
        );
      }
      return ticksArray;
    };
  /**
   * @param {?} value
   * @return {?}
   */
  SliderComponent.prototype.isTickSelected =
    /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
      if (!this.range) {
        if (
          !ValueHelper.isNullOrUndefined(
            this.viewOptions.showSelectionBarFromValue
          )
        ) {
          /** @type {?} */
          var center = this.viewOptions.showSelectionBarFromValue;
          if (
            this.viewLowValue > center &&
            value >= center &&
            value <= this.viewLowValue
          ) {
            return true;
          } else if (
            this.viewLowValue < center &&
            value <= center &&
            value >= this.viewLowValue
          ) {
            return true;
          }
        } else if (this.viewOptions.showSelectionBarEnd) {
          if (value >= this.viewLowValue) {
            return true;
          }
        } else if (
          this.viewOptions.showSelectionBar &&
          value <= this.viewLowValue
        ) {
          return true;
        }
      }
      if (
        this.range &&
        value >= this.viewLowValue &&
        value <= this.viewHighValue
      ) {
        return true;
      }
      return false;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateFloorLabel =
    /**
     * @return {?}
     */
    function () {
      if (!this.floorLabelElement.alwaysHide) {
        this.floorLabelElement.setValue(
          this.getDisplayValue(this.viewOptions.floor, LabelType.Floor)
        );
        this.floorLabelElement.calculateDimension();
        /** @type {?} */
        var position = this.viewOptions.rightToLeft
          ? this.fullBarElement.dimension - this.floorLabelElement.dimension
          : 0;
        this.floorLabelElement.setPosition(position);
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateCeilLabel =
    /**
     * @return {?}
     */
    function () {
      if (!this.ceilLabelElement.alwaysHide) {
        this.ceilLabelElement.setValue(
          this.getDisplayValue(this.viewOptions.ceil, LabelType.Ceil)
        );
        this.ceilLabelElement.calculateDimension();
        /** @type {?} */
        var position = this.viewOptions.rightToLeft
          ? 0
          : this.fullBarElement.dimension - this.ceilLabelElement.dimension;
        this.ceilLabelElement.setPosition(position);
      }
    };
  /**
   * @param {?} which
   * @param {?} newPos
   * @return {?}
   */
  SliderComponent.prototype.updateHandles =
    /**
     * @param {?} which
     * @param {?} newPos
     * @return {?}
     */
    function (which, newPos) {
      if (which === PointerType.Min) {
        this.updateLowHandle(newPos);
      } else if (which === PointerType.Max) {
        this.updateHighHandle(newPos);
      }
      this.updateSelectionBar();
      this.updateTicksScale();
      if (this.range) {
        this.updateCombinedLabel();
      }
    };
  /**
   * @param {?} labelType
   * @param {?} newPos
   * @return {?}
   */
  SliderComponent.prototype.getHandleLabelPos =
    /**
     * @param {?} labelType
     * @param {?} newPos
     * @return {?}
     */
    function (labelType, newPos) {
      /** @type {?} */
      var labelDimension =
        labelType === PointerType.Min
          ? this.minHandleLabelElement.dimension
          : this.maxHandleLabelElement.dimension;
      /** @type {?} */
      var nearHandlePos =
        newPos - labelDimension / 2 + this.handleHalfDimension;
      /** @type {?} */
      var endOfBarPos = this.fullBarElement.dimension - labelDimension;
      if (!this.viewOptions.boundPointerLabels) {
        return nearHandlePos;
      }
      if (
        (this.viewOptions.rightToLeft && labelType === PointerType.Min) ||
        (!this.viewOptions.rightToLeft && labelType === PointerType.Max)
      ) {
        return Math.min(nearHandlePos, endOfBarPos);
      } else {
        return Math.min(Math.max(nearHandlePos, 0), endOfBarPos);
      }
    };
  /**
   * @param {?} newPos
   * @return {?}
   */
  SliderComponent.prototype.updateLowHandle =
    /**
     * @param {?} newPos
     * @return {?}
     */
    function (newPos) {
      this.minHandleElement.setPosition(newPos);
      this.minHandleLabelElement.setValue(
        this.getDisplayValue(this.viewLowValue, LabelType.Low)
      );
      this.minHandleLabelElement.setPosition(
        this.getHandleLabelPos(PointerType.Min, newPos)
      );
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.getPointerColor)) {
        this.minPointerStyle = {
          backgroundColor: this.getPointerColor(PointerType.Min),
        };
      }
      if (this.viewOptions.autoHideLimitLabels) {
        this.updateFloorAndCeilLabelsVisibility();
      }
    };
  /**
   * @param {?} newPos
   * @return {?}
   */
  SliderComponent.prototype.updateHighHandle =
    /**
     * @param {?} newPos
     * @return {?}
     */
    function (newPos) {
      this.maxHandleElement.setPosition(newPos);
      this.maxHandleLabelElement.setValue(
        this.getDisplayValue(this.viewHighValue, LabelType.High)
      );
      this.maxHandleLabelElement.setPosition(
        this.getHandleLabelPos(PointerType.Max, newPos)
      );
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.getPointerColor)) {
        this.maxPointerStyle = {
          backgroundColor: this.getPointerColor(PointerType.Max),
        };
      }
      if (this.viewOptions.autoHideLimitLabels) {
        this.updateFloorAndCeilLabelsVisibility();
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateFloorAndCeilLabelsVisibility =
    /**
     * @return {?}
     */
    function () {
      // Show based only on hideLimitLabels if pointer labels are hidden
      if (this.viewOptions.hidePointerLabels) {
        return;
      }
      /** @type {?} */
      var floorLabelHidden = false;
      /** @type {?} */
      var ceilLabelHidden = false;
      /** @type {?} */
      var isMinLabelAtFloor = this.isLabelBelowFloorLabel(
        this.minHandleLabelElement
      );
      /** @type {?} */
      var isMinLabelAtCeil = this.isLabelAboveCeilLabel(
        this.minHandleLabelElement
      );
      /** @type {?} */
      var isMaxLabelAtCeil = this.isLabelAboveCeilLabel(
        this.maxHandleLabelElement
      );
      /** @type {?} */
      var isCombinedLabelAtFloor = this.isLabelBelowFloorLabel(
        this.combinedLabelElement
      );
      /** @type {?} */
      var isCombinedLabelAtCeil = this.isLabelAboveCeilLabel(
        this.combinedLabelElement
      );
      if (isMinLabelAtFloor) {
        floorLabelHidden = true;
        this.floorLabelElement.hide();
      } else {
        floorLabelHidden = false;
        this.floorLabelElement.show();
      }
      if (isMinLabelAtCeil) {
        ceilLabelHidden = true;
        this.ceilLabelElement.hide();
      } else {
        ceilLabelHidden = false;
        this.ceilLabelElement.show();
      }
      if (this.range) {
        /** @type {?} */
        var hideCeil = this.combinedLabelElement.isVisible()
          ? isCombinedLabelAtCeil
          : isMaxLabelAtCeil;
        /** @type {?} */
        var hideFloor = this.combinedLabelElement.isVisible()
          ? isCombinedLabelAtFloor
          : isMinLabelAtFloor;
        if (hideCeil) {
          this.ceilLabelElement.hide();
        } else if (!ceilLabelHidden) {
          this.ceilLabelElement.show();
        }
        // Hide or show floor label
        if (hideFloor) {
          this.floorLabelElement.hide();
        } else if (!floorLabelHidden) {
          this.floorLabelElement.show();
        }
      }
    };
  /**
   * @param {?} label
   * @return {?}
   */
  SliderComponent.prototype.isLabelBelowFloorLabel =
    /**
     * @param {?} label
     * @return {?}
     */
    function (label) {
      /** @type {?} */
      var pos = label.position;
      /** @type {?} */
      var dim = label.dimension;
      /** @type {?} */
      var floorPos = this.floorLabelElement.position;
      /** @type {?} */
      var floorDim = this.floorLabelElement.dimension;
      return this.viewOptions.rightToLeft
        ? pos + dim >= floorPos - 2
        : pos <= floorPos + floorDim + 2;
    };
  /**
   * @param {?} label
   * @return {?}
   */
  SliderComponent.prototype.isLabelAboveCeilLabel =
    /**
     * @param {?} label
     * @return {?}
     */
    function (label) {
      /** @type {?} */
      var pos = label.position;
      /** @type {?} */
      var dim = label.dimension;
      /** @type {?} */
      var ceilPos = this.ceilLabelElement.position;
      /** @type {?} */
      var ceilDim = this.ceilLabelElement.dimension;
      return this.viewOptions.rightToLeft
        ? pos <= ceilPos + ceilDim + 2
        : pos + dim >= ceilPos - 2;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateSelectionBar =
    /**
     * @return {?}
     */
    function () {
      /** @type {?} */
      var position = 0;
      /** @type {?} */
      var dimension = 0;
      /** @type {?} */
      var isSelectionBarFromRight = this.viewOptions.rightToLeft
        ? !this.viewOptions.showSelectionBarEnd
        : this.viewOptions.showSelectionBarEnd;
      /** @type {?} */
      var positionForRange = this.viewOptions.rightToLeft
        ? this.maxHandleElement.position + this.handleHalfDimension
        : this.minHandleElement.position + this.handleHalfDimension;
      if (this.range) {
        dimension = Math.abs(
          this.maxHandleElement.position - this.minHandleElement.position
        );
        position = positionForRange;
      } else {
        if (
          !ValueHelper.isNullOrUndefined(
            this.viewOptions.showSelectionBarFromValue
          )
        ) {
          /** @type {?} */
          var center = this.viewOptions.showSelectionBarFromValue;
          /** @type {?} */
          var centerPosition = this.valueToPosition(center);
          /** @type {?} */
          var isModelGreaterThanCenter = this.viewOptions.rightToLeft
            ? this.viewLowValue <= center
            : this.viewLowValue > center;
          if (isModelGreaterThanCenter) {
            dimension = this.minHandleElement.position - centerPosition;
            position = centerPosition + this.handleHalfDimension;
          } else {
            dimension = centerPosition - this.minHandleElement.position;
            position =
              this.minHandleElement.position + this.handleHalfDimension;
          }
        } else if (isSelectionBarFromRight) {
          dimension = Math.ceil(
            Math.abs(this.maxHandlePosition - this.minHandleElement.position) +
              this.handleHalfDimension
          );
          position = Math.floor(
            this.minHandleElement.position + this.handleHalfDimension
          );
        } else {
          dimension = this.minHandleElement.position + this.handleHalfDimension;
          position = 0;
        }
      }
      this.selectionBarElement.setDimension(dimension);
      this.selectionBarElement.setPosition(position);
      if (this.range && this.viewOptions.showOuterSelectionBars) {
        if (this.viewOptions.rightToLeft) {
          this.rightOuterSelectionBarElement.setDimension(position);
          this.rightOuterSelectionBarElement.setPosition(0);
          this.fullBarElement.calculateDimension();
          this.leftOuterSelectionBarElement.setDimension(
            this.fullBarElement.dimension - (position + dimension)
          );
          this.leftOuterSelectionBarElement.setPosition(position + dimension);
        } else {
          this.leftOuterSelectionBarElement.setDimension(position);
          this.leftOuterSelectionBarElement.setPosition(0);
          this.fullBarElement.calculateDimension();
          this.rightOuterSelectionBarElement.setDimension(
            this.fullBarElement.dimension - (position + dimension)
          );
          this.rightOuterSelectionBarElement.setPosition(position + dimension);
        }
      }
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.getSelectionBarColor)
      ) {
        /** @type {?} */
        var color = this.getSelectionBarColor();
        this.barStyle = {
          backgroundColor: color,
        };
      } else if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.selectionBarGradient)
      ) {
        /** @type {?} */
        var offset = !ValueHelper.isNullOrUndefined(
          this.viewOptions.showSelectionBarFromValue
        )
          ? this.valueToPosition(this.viewOptions.showSelectionBarFromValue)
          : 0;
        /** @type {?} */
        var reversed =
          (offset - position > 0 && !isSelectionBarFromRight) ||
          (offset - position <= 0 && isSelectionBarFromRight);
        /** @type {?} */
        var direction = this.viewOptions.vertical
          ? reversed
            ? 'bottom'
            : 'top'
          : reversed
          ? 'left'
          : 'right';
        this.barStyle = {
          backgroundImage:
            'linear-gradient(to ' +
            direction +
            ', ' +
            this.viewOptions.selectionBarGradient.from +
            ' 0%,' +
            this.viewOptions.selectionBarGradient.to +
            ' 100%)',
        };
        if (this.viewOptions.vertical) {
          this.barStyle.backgroundPosition =
            'center ' +
            (offset +
              dimension +
              position +
              (reversed ? -this.handleHalfDimension : 0)) +
            'px';
          this.barStyle.backgroundSize =
            '100% ' +
            (this.fullBarElement.dimension - this.handleHalfDimension) +
            'px';
        } else {
          this.barStyle.backgroundPosition =
            offset -
            position +
            (reversed ? this.handleHalfDimension : 0) +
            'px center';
          this.barStyle.backgroundSize =
            this.fullBarElement.dimension -
            this.handleHalfDimension +
            'px 100%';
        }
      }
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.getSelectionBarColor =
    /**
     * @return {?}
     */
    function () {
      if (this.range) {
        return this.viewOptions.getSelectionBarColor(
          this.value,
          this.highValue
        );
      }
      return this.viewOptions.getSelectionBarColor(this.value);
    };
  /**
   * @param {?} pointerType
   * @return {?}
   */
  SliderComponent.prototype.getPointerColor =
    /**
     * @param {?} pointerType
     * @return {?}
     */
    function (pointerType) {
      if (pointerType === PointerType.Max) {
        return this.viewOptions.getPointerColor(this.highValue, pointerType);
      }
      return this.viewOptions.getPointerColor(this.value, pointerType);
    };
  /**
   * @param {?} value
   * @return {?}
   */
  SliderComponent.prototype.getTickColor =
    /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
      return this.viewOptions.getTickColor(value);
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.updateCombinedLabel =
    /**
     * @return {?}
     */
    function () {
      /** @type {?} */
      var isLabelOverlap = null;
      if (this.viewOptions.rightToLeft) {
        isLabelOverlap =
          this.minHandleLabelElement.position -
            this.minHandleLabelElement.dimension -
            10 <=
          this.maxHandleLabelElement.position;
      } else {
        isLabelOverlap =
          this.minHandleLabelElement.position +
            this.minHandleLabelElement.dimension +
            10 >=
          this.maxHandleLabelElement.position;
      }
      if (isLabelOverlap) {
        /** @type {?} */
        var lowDisplayValue = this.getDisplayValue(
          this.viewLowValue,
          LabelType.Low
        );
        /** @type {?} */
        var highDisplayValue = this.getDisplayValue(
          this.viewHighValue,
          LabelType.High
        );
        /** @type {?} */
        var combinedLabelValue = this.viewOptions.rightToLeft
          ? this.viewOptions.combineLabels(highDisplayValue, lowDisplayValue)
          : this.viewOptions.combineLabels(lowDisplayValue, highDisplayValue);
        this.combinedLabelElement.setValue(combinedLabelValue);
        /** @type {?} */
        var pos = this.viewOptions.boundPointerLabels
          ? Math.min(
              Math.max(
                this.selectionBarElement.position +
                  this.selectionBarElement.dimension / 2 -
                  this.combinedLabelElement.dimension / 2,
                0
              ),
              this.fullBarElement.dimension -
                this.combinedLabelElement.dimension
            )
          : this.selectionBarElement.position +
            this.selectionBarElement.dimension / 2 -
            this.combinedLabelElement.dimension / 2;
        this.combinedLabelElement.setPosition(pos);
        this.minHandleLabelElement.hide();
        this.maxHandleLabelElement.hide();
        this.combinedLabelElement.show();
      } else {
        this.updateHighHandle(this.valueToPosition(this.viewHighValue));
        this.updateLowHandle(this.valueToPosition(this.viewLowValue));
        this.maxHandleLabelElement.show();
        this.minHandleLabelElement.show();
        this.combinedLabelElement.hide();
      }
      if (this.viewOptions.autoHideLimitLabels) {
        this.updateFloorAndCeilLabelsVisibility();
      }
    };
  /**
   * @param {?} value
   * @param {?} which
   * @return {?}
   */
  SliderComponent.prototype.getDisplayValue =
    /**
     * @param {?} value
     * @param {?} which
     * @return {?}
     */
    function (value, which) {
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.stepsArray) &&
        !this.viewOptions.bindIndexForStepsArray
      ) {
        value = this.getStepValue(value);
      }
      return this.viewOptions.translate(value, which);
    };
  /**
   * @param {?} value
   * @param {?=} customStep
   * @return {?}
   */
  SliderComponent.prototype.roundStep =
    /**
     * @param {?} value
     * @param {?=} customStep
     * @return {?}
     */
    function (value, customStep) {
      /** @type {?} */
      var step = !ValueHelper.isNullOrUndefined(customStep)
        ? customStep
        : this.viewOptions.step;
      /** @type {?} */
      var steppedDifference = MathHelper.roundToPrecisionLimit(
        (value - this.viewOptions.floor) / step,
        this.viewOptions.precisionLimit
      );
      steppedDifference = Math.round(steppedDifference) * step;
      return MathHelper.roundToPrecisionLimit(
        this.viewOptions.floor + steppedDifference,
        this.viewOptions.precisionLimit
      );
    };
  /**
   * @param {?} val
   * @return {?}
   */
  SliderComponent.prototype.valueToPosition =
    /**
     * @param {?} val
     * @return {?}
     */
    function (val) {
      /** @type {?} */
      var fn = ValueHelper.linearValueToPosition;
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.customValueToPosition)
      ) {
        fn = this.viewOptions.customValueToPosition;
      } else if (this.viewOptions.logScale) {
        fn = ValueHelper.logValueToPosition;
      }
      val = MathHelper.clampToRange(
        val,
        this.viewOptions.floor,
        this.viewOptions.ceil
      );
      /** @type {?} */
      var percent = fn(val, this.viewOptions.floor, this.viewOptions.ceil);
      if (ValueHelper.isNullOrUndefined(percent)) {
        percent = 0;
      }
      if (this.viewOptions.rightToLeft) {
        percent = 1 - percent;
      }
      return percent * this.maxHandlePosition;
    };
  /**
   * @param {?} position
   * @return {?}
   */
  SliderComponent.prototype.positionToValue =
    /**
     * @param {?} position
     * @return {?}
     */
    function (position) {
      /** @type {?} */
      var percent = position / this.maxHandlePosition;
      if (this.viewOptions.rightToLeft) {
        percent = 1 - percent;
      }
      /** @type {?} */
      var fn = ValueHelper.linearPositionToValue;
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.customPositionToValue)
      ) {
        fn = this.viewOptions.customPositionToValue;
      } else if (this.viewOptions.logScale) {
        fn = ValueHelper.logPositionToValue;
      }
      /** @type {?} */
      var value = fn(percent, this.viewOptions.floor, this.viewOptions.ceil);
      return !ValueHelper.isNullOrUndefined(value) ? value : 0;
    };
  /**
   * @param {?} event
   * @param {?=} targetTouchId
   * @return {?}
   */
  SliderComponent.prototype.getEventXY =
    /**
     * @param {?} event
     * @param {?=} targetTouchId
     * @return {?}
     */
    function (event, targetTouchId) {
      if (event instanceof MouseEvent) {
        return this.viewOptions.vertical || this.viewOptions.rotate !== 0
          ? event.clientY
          : event.clientX;
      }
      /** @type {?} */
      var touchIndex = 0;
      /** @type {?} */
      var touches = event.touches;
      if (!ValueHelper.isNullOrUndefined(targetTouchId)) {
        for (var i = 0; i < touches.length; i++) {
          if (touches[i].identifier === targetTouchId) {
            touchIndex = i;
            break;
          }
        }
      }
      // Return the target touch or if the target touch was not found in the event
      // returns the coordinates of the first touch
      return this.viewOptions.vertical || this.viewOptions.rotate !== 0
        ? touches[touchIndex].clientY
        : touches[touchIndex].clientX;
    };
  /**
   * @param {?} event
   * @param {?=} targetTouchId
   * @return {?}
   */
  SliderComponent.prototype.getEventPosition =
    /**
     * @param {?} event
     * @param {?=} targetTouchId
     * @return {?}
     */
    function (event, targetTouchId) {
      /** @type {?} */
      var sliderElementBoundingRect =
        this.elementRef.nativeElement.getBoundingClientRect();
      /** @type {?} */
      var sliderPos =
        this.viewOptions.vertical || this.viewOptions.rotate !== 0
          ? sliderElementBoundingRect.bottom
          : sliderElementBoundingRect.left;
      /** @type {?} */
      var eventPos = 0;
      if (this.viewOptions.vertical || this.viewOptions.rotate !== 0) {
        eventPos = -this.getEventXY(event, targetTouchId) + sliderPos;
      } else {
        eventPos = this.getEventXY(event, targetTouchId) - sliderPos;
      }
      return eventPos * this.viewOptions.scale - this.handleHalfDimension;
    };
  /**
   * @param {?} event
   * @return {?}
   */
  SliderComponent.prototype.getNearestHandle =
    /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
      if (!this.range) {
        return PointerType.Min;
      }
      /** @type {?} */
      var position = this.getEventPosition(event);
      /** @type {?} */
      var distanceMin = Math.abs(position - this.minHandleElement.position);
      /** @type {?} */
      var distanceMax = Math.abs(position - this.maxHandleElement.position);
      if (distanceMin < distanceMax) {
        return PointerType.Min;
      } else if (distanceMin > distanceMax) {
        return PointerType.Max;
      } else if (!this.viewOptions.rightToLeft) {
        // if event is at the same distance from min/max then if it's at left of minH, we return minH else maxH
        return position < this.minHandleElement.position
          ? PointerType.Min
          : PointerType.Max;
      }
      // reverse in rtl
      return position > this.minHandleElement.position
        ? PointerType.Min
        : PointerType.Max;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.bindEvents =
    /**
     * @return {?}
     */
    function () {
      var _this = this;
      /** @type {?} */
      var draggableRange = this.viewOptions.draggableRange;
      if (!this.viewOptions.onlyBindHandles) {
        this.selectionBarElement.on('mousedown', function (event) {
          return _this.onBarStart(
            null,
            draggableRange,
            event,
            true,
            true,
            true
          );
        });
      }
      if (this.viewOptions.draggableRangeOnly) {
        this.minHandleElement.on('mousedown', function (event) {
          return _this.onBarStart(
            PointerType.Min,
            draggableRange,
            event,
            true,
            true
          );
        });
        this.maxHandleElement.on('mousedown', function (event) {
          return _this.onBarStart(
            PointerType.Max,
            draggableRange,
            event,
            true,
            true
          );
        });
      } else {
        this.minHandleElement.on('mousedown', function (event) {
          return _this.onStart(PointerType.Min, event, true, true);
        });
        if (this.range) {
          this.maxHandleElement.on('mousedown', function (event) {
            return _this.onStart(PointerType.Max, event, true, true);
          });
        }
        if (!this.viewOptions.onlyBindHandles) {
          this.fullBarElement.on('mousedown', function (event) {
            return _this.onStart(null, event, true, true, true);
          });
          this.ticksElement.on('mousedown', function (event) {
            return _this.onStart(null, event, true, true, true, true);
          });
        }
      }
      if (!this.viewOptions.onlyBindHandles) {
        this.selectionBarElement.onPassive('touchstart', function (event) {
          return _this.onBarStart(
            null,
            draggableRange,
            event,
            true,
            true,
            true
          );
        });
      }
      if (this.viewOptions.draggableRangeOnly) {
        this.minHandleElement.onPassive('touchstart', function (event) {
          return _this.onBarStart(
            PointerType.Min,
            draggableRange,
            event,
            true,
            true
          );
        });
        this.maxHandleElement.onPassive('touchstart', function (event) {
          return _this.onBarStart(
            PointerType.Max,
            draggableRange,
            event,
            true,
            true
          );
        });
      } else {
        this.minHandleElement.onPassive('touchstart', function (event) {
          return _this.onStart(PointerType.Min, event, true, true);
        });
        if (this.range) {
          this.maxHandleElement.onPassive('touchstart', function (event) {
            return _this.onStart(PointerType.Max, event, true, true);
          });
        }
        if (!this.viewOptions.onlyBindHandles) {
          this.fullBarElement.onPassive('touchstart', function (event) {
            return _this.onStart(null, event, true, true, true);
          });
          this.ticksElement.onPassive('touchstart', function (event) {
            return _this.onStart(null, event, false, false, true, true);
          });
        }
      }
      if (this.viewOptions.keyboardSupport) {
        this.minHandleElement.on('focus', function () {
          return _this.onPointerFocus(PointerType.Min);
        });
        if (this.range) {
          this.maxHandleElement.on('focus', function () {
            return _this.onPointerFocus(PointerType.Max);
          });
        }
      }
    };
  /**
   * @param {?} options
   * @return {?}
   */
  SliderComponent.prototype.getOptionsInfluencingEventBindings =
    /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
      return [
        options.disabled,
        options.readOnly,
        options.draggableRange,
        options.draggableRangeOnly,
        options.onlyBindHandles,
        options.keyboardSupport,
      ];
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.unbindEvents =
    /**
     * @return {?}
     */
    function () {
      this.unsubscribeOnMove();
      this.unsubscribeOnEnd();
      try {
        for (
          var _a = __values(this.getAllSliderElements()), _b = _a.next();
          !_b.done;
          _b = _a.next()
        ) {
          var element = _b.value;
          if (!ValueHelper.isNullOrUndefined(element)) {
            element.off();
          }
        }
      } catch (e_4_1) {
        e_4 = { error: e_4_1 };
      } finally {
        try {
          if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
        } finally {
          if (e_4) throw e_4.error;
        }
      }
      var e_4, _c;
    };
  /**
   * @param {?} pointerType
   * @param {?} draggableRange
   * @param {?} event
   * @param {?} bindMove
   * @param {?} bindEnd
   * @param {?=} simulateImmediateMove
   * @param {?=} simulateImmediateEnd
   * @return {?}
   */
  SliderComponent.prototype.onBarStart =
    /**
     * @param {?} pointerType
     * @param {?} draggableRange
     * @param {?} event
     * @param {?} bindMove
     * @param {?} bindEnd
     * @param {?=} simulateImmediateMove
     * @param {?=} simulateImmediateEnd
     * @return {?}
     */
    function (
      pointerType,
      draggableRange,
      event,
      bindMove,
      bindEnd,
      simulateImmediateMove,
      simulateImmediateEnd
    ) {
      if (draggableRange) {
        this.onDragStart(pointerType, event, bindMove, bindEnd);
      } else {
        this.onStart(
          pointerType,
          event,
          bindMove,
          bindEnd,
          simulateImmediateMove,
          simulateImmediateEnd
        );
      }
    };
  /**
   * @param {?} pointerType
   * @param {?} event
   * @param {?} bindMove
   * @param {?} bindEnd
   * @param {?=} simulateImmediateMove
   * @param {?=} simulateImmediateEnd
   * @return {?}
   */
  SliderComponent.prototype.onStart =
    /**
     * @param {?} pointerType
     * @param {?} event
     * @param {?} bindMove
     * @param {?} bindEnd
     * @param {?=} simulateImmediateMove
     * @param {?=} simulateImmediateEnd
     * @return {?}
     */
    function (
      pointerType,
      event,
      bindMove,
      bindEnd,
      simulateImmediateMove,
      simulateImmediateEnd
    ) {
      var _this = this;
      event.stopPropagation();
      // Only call preventDefault() when handling non-passive events (passive events don't need it)
      if (!CompatibilityHelper.isTouchEvent(event) && !supportsPassiveEvents) {
        event.preventDefault();
      }
      this.moving = false;
      // We have to do this in case the HTML where the sliders are on
      // have been animated into view.
      this.calculateViewDimensions();
      if (ValueHelper.isNullOrUndefined(pointerType)) {
        pointerType = this.getNearestHandle(event);
      }
      this.currentTrackingPointer = pointerType;
      /** @type {?} */
      var pointerElement = this.getPointerElement(pointerType);
      pointerElement.active = true;
      if (this.viewOptions.keyboardSupport) {
        pointerElement.focus();
      }
      if (bindMove) {
        this.unsubscribeOnMove();
        /** @type {?} */
        var onMoveCallback = function (e) {
          return _this.dragging.active ? _this.onDragMove(e) : _this.onMove(e);
        };
        if (CompatibilityHelper.isTouchEvent(event)) {
          this.onMoveEventListener =
            this.eventListenerHelper.attachPassiveEventListener(
              document,
              'touchmove',
              onMoveCallback
            );
        } else {
          this.onMoveEventListener =
            this.eventListenerHelper.attachEventListener(
              document,
              'mousemove',
              onMoveCallback
            );
        }
      }
      if (bindEnd) {
        this.unsubscribeOnEnd();
        /** @type {?} */
        var onEndCallback = function (e) {
          return _this.onEnd(e);
        };
        if (CompatibilityHelper.isTouchEvent(event)) {
          this.onEndEventListener =
            this.eventListenerHelper.attachPassiveEventListener(
              document,
              'touchend',
              onEndCallback
            );
        } else {
          this.onEndEventListener =
            this.eventListenerHelper.attachEventListener(
              document,
              'mouseup',
              onEndCallback
            );
        }
      }
      this.userChangeStart.emit(this.getChangeContext());
      if (
        CompatibilityHelper.isTouchEvent(event) &&
        !ValueHelper.isNullOrUndefined(/** @type {?} */ (event).changedTouches)
      ) {
        // Store the touch identifier
        if (ValueHelper.isNullOrUndefined(this.touchId)) {
          this.touchId = /** @type {?} */ (event).changedTouches[0].identifier;
        }
      }
      // Click events, either with mouse or touch gesture are weird. Sometimes they result in full
      // start, move, end sequence, and sometimes, they don't - they only invoke mousedown
      // As a workaround, we simulate the first move event and the end event if it's necessary
      if (simulateImmediateMove) {
        this.onMove(event, true);
      }
      if (simulateImmediateEnd) {
        this.onEnd(event);
      }
    };
  /**
   * @param {?} event
   * @param {?=} fromTick
   * @return {?}
   */
  SliderComponent.prototype.onMove =
    /**
     * @param {?} event
     * @param {?=} fromTick
     * @return {?}
     */
    function (event, fromTick) {
      /** @type {?} */
      var touchForThisSlider = null;
      if (CompatibilityHelper.isTouchEvent(event)) {
        /** @type {?} */
        var changedTouches = /** @type {?} */ (event).changedTouches;
        for (var i = 0; i < changedTouches.length; i++) {
          if (changedTouches[i].identifier === this.touchId) {
            touchForThisSlider = changedTouches[i];
            break;
          }
        }
        if (ValueHelper.isNullOrUndefined(touchForThisSlider)) {
          return;
        }
      }
      if (this.viewOptions.animate && !this.viewOptions.animateOnMove) {
        if (this.moving) {
          this.sliderElementAnimateClass = false;
        }
      }
      this.moving = true;
      /** @type {?} */
      var newPos = !ValueHelper.isNullOrUndefined(touchForThisSlider)
        ? this.getEventPosition(event, touchForThisSlider.identifier)
        : this.getEventPosition(event);
      /** @type {?} */
      var newValue;
      /** @type {?} */
      var ceilValue = this.viewOptions.rightToLeft
        ? this.viewOptions.floor
        : this.viewOptions.ceil;
      /** @type {?} */
      var floorValue = this.viewOptions.rightToLeft
        ? this.viewOptions.ceil
        : this.viewOptions.floor;
      if (newPos <= 0) {
        newValue = floorValue;
      } else if (newPos >= this.maxHandlePosition) {
        newValue = ceilValue;
      } else {
        newValue = this.positionToValue(newPos);
        if (
          fromTick &&
          !ValueHelper.isNullOrUndefined(this.viewOptions.tickStep)
        ) {
          newValue = this.roundStep(newValue, this.viewOptions.tickStep);
        } else {
          newValue = this.roundStep(newValue);
        }
      }
      this.positionTrackingHandle(newValue);
    };
  /**
   * @param {?} event
   * @return {?}
   */
  SliderComponent.prototype.onEnd =
    /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
      if (CompatibilityHelper.isTouchEvent(event)) {
        /** @type {?} */
        var changedTouches = /** @type {?} */ (event).changedTouches;
        if (changedTouches[0].identifier !== this.touchId) {
          return;
        }
      }
      this.moving = false;
      if (this.viewOptions.animate) {
        this.sliderElementAnimateClass = true;
      }
      this.touchId = null;
      if (!this.viewOptions.keyboardSupport) {
        this.minHandleElement.active = false;
        this.maxHandleElement.active = false;
        this.currentTrackingPointer = null;
      }
      this.dragging.active = false;
      this.unsubscribeOnMove();
      this.unsubscribeOnEnd();
      this.userChangeEnd.emit(this.getChangeContext());
    };
  /**
   * @param {?} pointerType
   * @return {?}
   */
  SliderComponent.prototype.onPointerFocus =
    /**
     * @param {?} pointerType
     * @return {?}
     */
    function (pointerType) {
      var _this = this;
      /** @type {?} */
      var pointerElement = this.getPointerElement(pointerType);
      pointerElement.on('blur', function () {
        return _this.onPointerBlur(pointerElement);
      });
      pointerElement.on('keydown', function (event) {
        return _this.onKeyboardEvent(event);
      });
      pointerElement.on('keyup', function () {
        return _this.onKeyUp();
      });
      pointerElement.active = true;
      this.currentTrackingPointer = pointerType;
      this.currentFocusPointer = pointerType;
      this.firstKeyDown = true;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.onKeyUp =
    /**
     * @return {?}
     */
    function () {
      this.firstKeyDown = true;
      this.userChangeEnd.emit(this.getChangeContext());
    };
  /**
   * @param {?} pointer
   * @return {?}
   */
  SliderComponent.prototype.onPointerBlur =
    /**
     * @param {?} pointer
     * @return {?}
     */
    function (pointer) {
      pointer.off('blur');
      pointer.off('keydown');
      pointer.off('keyup');
      pointer.active = false;
      if (ValueHelper.isNullOrUndefined(this.touchId)) {
        this.currentTrackingPointer = null;
        this.currentFocusPointer = null;
      }
    };
  /**
   * @param {?} currentValue
   * @return {?}
   */
  SliderComponent.prototype.getKeyActions =
    /**
     * @param {?} currentValue
     * @return {?}
     */
    function (currentValue) {
      /** @type {?} */
      var valueRange = this.viewOptions.ceil - this.viewOptions.floor;
      /** @type {?} */
      var increaseStep = currentValue + this.viewOptions.step;
      /** @type {?} */
      var decreaseStep = currentValue - this.viewOptions.step;
      /** @type {?} */
      var increasePage = currentValue + valueRange / 10;
      /** @type {?} */
      var decreasePage = currentValue - valueRange / 10;
      if (this.viewOptions.reversedControls) {
        increaseStep = currentValue - this.viewOptions.step;
        decreaseStep = currentValue + this.viewOptions.step;
        increasePage = currentValue - valueRange / 10;
        decreasePage = currentValue + valueRange / 10;
      }
      /** @type {?} */
      var actions = {
        UP: increaseStep,
        DOWN: decreaseStep,
        LEFT: decreaseStep,
        RIGHT: increaseStep,
        PAGEUP: increasePage,
        PAGEDOWN: decreasePage,
        HOME: this.viewOptions.reversedControls
          ? this.viewOptions.ceil
          : this.viewOptions.floor,
        END: this.viewOptions.reversedControls
          ? this.viewOptions.floor
          : this.viewOptions.ceil,
      };
      // right to left means swapping right and left arrows
      if (this.viewOptions.rightToLeft) {
        actions['LEFT'] = increaseStep;
        actions['RIGHT'] = decreaseStep;
        // right to left and vertical means we also swap up and down
        if (this.viewOptions.vertical || this.viewOptions.rotate !== 0) {
          actions['UP'] = decreaseStep;
          actions['DOWN'] = increaseStep;
        }
      }
      return actions;
    };
  /**
   * @param {?} event
   * @return {?}
   */
  SliderComponent.prototype.onKeyboardEvent =
    /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
      /** @type {?} */
      var currentValue = this.getCurrentTrackingValue();
      /** @type {?} */
      var keyCode = !ValueHelper.isNullOrUndefined(event.keyCode)
        ? event.keyCode
        : event.which;
      /** @type {?} */
      var keys = {
        38: 'UP',
        40: 'DOWN',
        37: 'LEFT',
        39: 'RIGHT',
        33: 'PAGEUP',
        34: 'PAGEDOWN',
        36: 'HOME',
        35: 'END',
      };
      /** @type {?} */
      var actions = this.getKeyActions(currentValue);
      /** @type {?} */
      var key = keys[keyCode];
      /** @type {?} */
      var action = actions[key];
      if (
        ValueHelper.isNullOrUndefined(action) ||
        ValueHelper.isNullOrUndefined(this.currentTrackingPointer)
      ) {
        return;
      }
      event.preventDefault();
      if (this.firstKeyDown) {
        this.firstKeyDown = false;
        this.userChangeStart.emit(this.getChangeContext());
      }
      /** @type {?} */
      var actionValue = MathHelper.clampToRange(
        action,
        this.viewOptions.floor,
        this.viewOptions.ceil
      );
      /** @type {?} */
      var newValue = this.roundStep(actionValue);
      if (!this.viewOptions.draggableRangeOnly) {
        this.positionTrackingHandle(newValue);
      } else {
        /** @type {?} */
        var difference = this.viewHighValue - this.viewLowValue;
        /** @type {?} */
        var newMinValue = void 0;
        /** @type {?} */
        var newMaxValue = void 0;
        if (this.currentTrackingPointer === PointerType.Min) {
          newMinValue = newValue;
          newMaxValue = newValue + difference;
          if (newMaxValue > this.viewOptions.ceil) {
            newMaxValue = this.viewOptions.ceil;
            newMinValue = newMaxValue - difference;
          }
        } else if (this.currentTrackingPointer === PointerType.Max) {
          newMaxValue = newValue;
          newMinValue = newValue - difference;
          if (newMinValue < this.viewOptions.floor) {
            newMinValue = this.viewOptions.floor;
            newMaxValue = newMinValue + difference;
          }
        }
        this.positionTrackingBar(newMinValue, newMaxValue);
      }
    };
  /**
   * @param {?} pointerType
   * @param {?} event
   * @param {?} bindMove
   * @param {?} bindEnd
   * @return {?}
   */
  SliderComponent.prototype.onDragStart =
    /**
     * @param {?} pointerType
     * @param {?} event
     * @param {?} bindMove
     * @param {?} bindEnd
     * @return {?}
     */
    function (pointerType, event, bindMove, bindEnd) {
      /** @type {?} */
      var position = this.getEventPosition(event);
      this.dragging = new Dragging();
      this.dragging.active = true;
      this.dragging.value = this.positionToValue(position);
      this.dragging.difference = this.viewHighValue - this.viewLowValue;
      this.dragging.lowLimit = this.viewOptions.rightToLeft
        ? this.minHandleElement.position - position
        : position - this.minHandleElement.position;
      this.dragging.highLimit = this.viewOptions.rightToLeft
        ? position - this.maxHandleElement.position
        : this.maxHandleElement.position - position;
      this.onStart(pointerType, event, bindMove, bindEnd);
    };
  /**
   * Get min value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft
   * @param {?} newPos
   * @param {?} outOfBounds
   * @param {?} isAbove
   * @return {?}
   */
  SliderComponent.prototype.getMinValue =
    /**
     * Get min value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft
     * @param {?} newPos
     * @param {?} outOfBounds
     * @param {?} isAbove
     * @return {?}
     */
    function (newPos, outOfBounds, isAbove) {
      /** @type {?} */
      var isRTL = this.viewOptions.rightToLeft;
      /** @type {?} */
      var value = null;
      if (outOfBounds) {
        if (isAbove) {
          value = isRTL
            ? this.viewOptions.floor
            : this.viewOptions.ceil - this.dragging.difference;
        } else {
          value = isRTL
            ? this.viewOptions.ceil - this.dragging.difference
            : this.viewOptions.floor;
        }
      } else {
        value = isRTL
          ? this.positionToValue(newPos + this.dragging.lowLimit)
          : this.positionToValue(newPos - this.dragging.lowLimit);
      }
      return this.roundStep(value);
    };
  /**
   * Get max value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft
   * @param {?} newPos
   * @param {?} outOfBounds
   * @param {?} isAbove
   * @return {?}
   */
  SliderComponent.prototype.getMaxValue =
    /**
     * Get max value depending on whether the newPos is outOfBounds above or below the bar and rightToLeft
     * @param {?} newPos
     * @param {?} outOfBounds
     * @param {?} isAbove
     * @return {?}
     */
    function (newPos, outOfBounds, isAbove) {
      /** @type {?} */
      var isRTL = this.viewOptions.rightToLeft;
      /** @type {?} */
      var value = null;
      if (outOfBounds) {
        if (isAbove) {
          value = isRTL
            ? this.viewOptions.floor + this.dragging.difference
            : this.viewOptions.ceil;
        } else {
          value = isRTL
            ? this.viewOptions.ceil
            : this.viewOptions.floor + this.dragging.difference;
        }
      } else {
        if (isRTL) {
          value =
            this.positionToValue(newPos + this.dragging.lowLimit) +
            this.dragging.difference;
        } else {
          value =
            this.positionToValue(newPos - this.dragging.lowLimit) +
            this.dragging.difference;
        }
      }
      return this.roundStep(value);
    };
  /**
   * @param {?=} event
   * @return {?}
   */
  SliderComponent.prototype.onDragMove =
    /**
     * @param {?=} event
     * @return {?}
     */
    function (event) {
      /** @type {?} */
      var newPos = this.getEventPosition(event);
      if (this.viewOptions.animate && !this.viewOptions.animateOnMove) {
        if (this.moving) {
          this.sliderElementAnimateClass = false;
        }
      }
      this.moving = true;
      /** @type {?} */
      var ceilLimit;
      /** @type {?} */
      var floorLimit;
      /** @type {?} */
      var floorHandleElement;
      /** @type {?} */
      var ceilHandleElement;
      if (this.viewOptions.rightToLeft) {
        ceilLimit = this.dragging.lowLimit;
        floorLimit = this.dragging.highLimit;
        floorHandleElement = this.maxHandleElement;
        ceilHandleElement = this.minHandleElement;
      } else {
        ceilLimit = this.dragging.highLimit;
        floorLimit = this.dragging.lowLimit;
        floorHandleElement = this.minHandleElement;
        ceilHandleElement = this.maxHandleElement;
      }
      /** @type {?} */
      var isUnderFloorLimit = newPos <= floorLimit;
      /** @type {?} */
      var isOverCeilLimit = newPos >= this.maxHandlePosition - ceilLimit;
      /** @type {?} */
      var newMinValue;
      /** @type {?} */
      var newMaxValue;
      if (isUnderFloorLimit) {
        if (floorHandleElement.position === 0) {
          return;
        }
        newMinValue = this.getMinValue(newPos, true, false);
        newMaxValue = this.getMaxValue(newPos, true, false);
      } else if (isOverCeilLimit) {
        if (ceilHandleElement.position === this.maxHandlePosition) {
          return;
        }
        newMaxValue = this.getMaxValue(newPos, true, true);
        newMinValue = this.getMinValue(newPos, true, true);
      } else {
        newMinValue = this.getMinValue(newPos, false, false);
        newMaxValue = this.getMaxValue(newPos, false, false);
      }
      this.positionTrackingBar(newMinValue, newMaxValue);
    };
  /**
   * @param {?} newMinValue
   * @param {?} newMaxValue
   * @return {?}
   */
  SliderComponent.prototype.positionTrackingBar =
    /**
     * @param {?} newMinValue
     * @param {?} newMaxValue
     * @return {?}
     */
    function (newMinValue, newMaxValue) {
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.minLimit) &&
        newMinValue < this.viewOptions.minLimit
      ) {
        newMinValue = this.viewOptions.minLimit;
        newMaxValue = MathHelper.roundToPrecisionLimit(
          newMinValue + this.dragging.difference,
          this.viewOptions.precisionLimit
        );
      }
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.maxLimit) &&
        newMaxValue > this.viewOptions.maxLimit
      ) {
        newMaxValue = this.viewOptions.maxLimit;
        newMinValue = MathHelper.roundToPrecisionLimit(
          newMaxValue - this.dragging.difference,
          this.viewOptions.precisionLimit
        );
      }
      this.viewLowValue = newMinValue;
      this.viewHighValue = newMaxValue;
      this.applyViewChange();
      this.updateHandles(PointerType.Min, this.valueToPosition(newMinValue));
      this.updateHandles(PointerType.Max, this.valueToPosition(newMaxValue));
    };
  /**
   * @param {?} newValue
   * @return {?}
   */
  SliderComponent.prototype.positionTrackingHandle =
    /**
     * @param {?} newValue
     * @return {?}
     */
    function (newValue) {
      newValue = this.applyMinMaxLimit(newValue);
      if (this.range) {
        if (this.viewOptions.pushRange) {
          newValue = this.applyPushRange(newValue);
        } else {
          if (this.viewOptions.noSwitching) {
            if (
              this.currentTrackingPointer === PointerType.Min &&
              newValue > this.viewHighValue
            ) {
              newValue = this.applyMinMaxRange(this.viewHighValue);
            } else if (
              this.currentTrackingPointer === PointerType.Max &&
              newValue < this.viewLowValue
            ) {
              newValue = this.applyMinMaxRange(this.viewLowValue);
            }
          }
          newValue = this.applyMinMaxRange(newValue);
          /* This is to check if we need to switch the min and max handles */
          if (
            this.currentTrackingPointer === PointerType.Min &&
            newValue > this.viewHighValue
          ) {
            this.viewLowValue = this.viewHighValue;
            this.applyViewChange();
            this.updateHandles(PointerType.Min, this.maxHandleElement.position);
            this.updateAriaAttributes();
            this.currentTrackingPointer = PointerType.Max;
            this.minHandleElement.active = false;
            this.maxHandleElement.active = true;
            if (this.viewOptions.keyboardSupport) {
              this.maxHandleElement.focus();
            }
          } else if (
            this.currentTrackingPointer === PointerType.Max &&
            newValue < this.viewLowValue
          ) {
            this.viewHighValue = this.viewLowValue;
            this.applyViewChange();
            this.updateHandles(PointerType.Max, this.minHandleElement.position);
            this.updateAriaAttributes();
            this.currentTrackingPointer = PointerType.Min;
            this.maxHandleElement.active = false;
            this.minHandleElement.active = true;
            if (this.viewOptions.keyboardSupport) {
              this.minHandleElement.focus();
            }
          }
        }
      }
      if (this.getCurrentTrackingValue() !== newValue) {
        if (this.currentTrackingPointer === PointerType.Min) {
          this.viewLowValue = newValue;
          this.applyViewChange();
        } else if (this.currentTrackingPointer === PointerType.Max) {
          this.viewHighValue = newValue;
          this.applyViewChange();
        }
        this.updateHandles(
          this.currentTrackingPointer,
          this.valueToPosition(newValue)
        );
        this.updateAriaAttributes();
      }
    };
  /**
   * @param {?} newValue
   * @return {?}
   */
  SliderComponent.prototype.applyMinMaxLimit =
    /**
     * @param {?} newValue
     * @return {?}
     */
    function (newValue) {
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.minLimit) &&
        newValue < this.viewOptions.minLimit
      ) {
        return this.viewOptions.minLimit;
      }
      if (
        !ValueHelper.isNullOrUndefined(this.viewOptions.maxLimit) &&
        newValue > this.viewOptions.maxLimit
      ) {
        return this.viewOptions.maxLimit;
      }
      return newValue;
    };
  /**
   * @param {?} newValue
   * @return {?}
   */
  SliderComponent.prototype.applyMinMaxRange =
    /**
     * @param {?} newValue
     * @return {?}
     */
    function (newValue) {
      /** @type {?} */
      var oppositeValue =
        this.currentTrackingPointer === PointerType.Min
          ? this.viewHighValue
          : this.viewLowValue;
      /** @type {?} */
      var difference = Math.abs(newValue - oppositeValue);
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.minRange)) {
        if (difference < this.viewOptions.minRange) {
          if (this.currentTrackingPointer === PointerType.Min) {
            return MathHelper.roundToPrecisionLimit(
              this.viewHighValue - this.viewOptions.minRange,
              this.viewOptions.precisionLimit
            );
          } else if (this.currentTrackingPointer === PointerType.Max) {
            return MathHelper.roundToPrecisionLimit(
              this.viewLowValue + this.viewOptions.minRange,
              this.viewOptions.precisionLimit
            );
          }
        }
      }
      if (!ValueHelper.isNullOrUndefined(this.viewOptions.maxRange)) {
        if (difference > this.viewOptions.maxRange) {
          if (this.currentTrackingPointer === PointerType.Min) {
            return MathHelper.roundToPrecisionLimit(
              this.viewHighValue - this.viewOptions.maxRange,
              this.viewOptions.precisionLimit
            );
          } else if (this.currentTrackingPointer === PointerType.Max) {
            return MathHelper.roundToPrecisionLimit(
              this.viewLowValue + this.viewOptions.maxRange,
              this.viewOptions.precisionLimit
            );
          }
        }
      }
      return newValue;
    };
  /**
   * @param {?} newValue
   * @return {?}
   */
  SliderComponent.prototype.applyPushRange =
    /**
     * @param {?} newValue
     * @return {?}
     */
    function (newValue) {
      /** @type {?} */
      var difference =
        this.currentTrackingPointer === PointerType.Min
          ? this.viewHighValue - newValue
          : newValue - this.viewLowValue;
      /** @type {?} */
      var minRange = !ValueHelper.isNullOrUndefined(this.viewOptions.minRange)
        ? this.viewOptions.minRange
        : this.viewOptions.step;
      /** @type {?} */
      var maxRange = this.viewOptions.maxRange;
      // if smaller than minRange
      if (difference < minRange) {
        if (this.currentTrackingPointer === PointerType.Min) {
          this.viewHighValue = MathHelper.roundToPrecisionLimit(
            Math.min(newValue + minRange, this.viewOptions.ceil),
            this.viewOptions.precisionLimit
          );
          newValue = MathHelper.roundToPrecisionLimit(
            this.viewHighValue - minRange,
            this.viewOptions.precisionLimit
          );
          this.applyViewChange();
          this.updateHandles(
            PointerType.Max,
            this.valueToPosition(this.viewHighValue)
          );
        } else if (this.currentTrackingPointer === PointerType.Max) {
          this.viewLowValue = MathHelper.roundToPrecisionLimit(
            Math.max(newValue - minRange, this.viewOptions.floor),
            this.viewOptions.precisionLimit
          );
          newValue = MathHelper.roundToPrecisionLimit(
            this.viewLowValue + minRange,
            this.viewOptions.precisionLimit
          );
          this.applyViewChange();
          this.updateHandles(
            PointerType.Min,
            this.valueToPosition(this.viewLowValue)
          );
        }
        this.updateAriaAttributes();
      } else if (
        !ValueHelper.isNullOrUndefined(maxRange) &&
        difference > maxRange
      ) {
        // if greater than maxRange
        if (this.currentTrackingPointer === PointerType.Min) {
          this.viewHighValue = MathHelper.roundToPrecisionLimit(
            newValue + maxRange,
            this.viewOptions.precisionLimit
          );
          this.applyViewChange();
          this.updateHandles(
            PointerType.Max,
            this.valueToPosition(this.viewHighValue)
          );
        } else if (this.currentTrackingPointer === PointerType.Max) {
          this.viewLowValue = MathHelper.roundToPrecisionLimit(
            newValue - maxRange,
            this.viewOptions.precisionLimit
          );
          this.applyViewChange();
          this.updateHandles(
            PointerType.Min,
            this.valueToPosition(this.viewLowValue)
          );
        }
        this.updateAriaAttributes();
      }
      return newValue;
    };
  /**
   * @return {?}
   */
  SliderComponent.prototype.getChangeContext =
    /**
     * @return {?}
     */
    function () {
      /** @type {?} */
      var changeContext = new ChangeContext();
      changeContext.pointerType = this.currentTrackingPointer;
      changeContext.value = +this.value;
      if (this.range) {
        changeContext.highValue = +this.highValue;
      }
      return changeContext;
    };
  SliderComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'ngx-slider',
          template:
            '<!-- // 0 Left selection bar outside two handles -->\n<span ngxSliderElement #leftOuterSelectionBar class="ngx-slider-span ngx-slider-bar-wrapper ngx-slider-left-out-selection">\n  <span class="ngx-slider-span ngx-slider-bar"></span>\n</span>\n<!-- // 1 Right selection bar outside two handles -->\n<span ngxSliderElement #rightOuterSelectionBar class="ngx-slider-span ngx-slider-bar-wrapper ngx-slider-right-out-selection">\n  <span class="ngx-slider-span ngx-slider-bar"></span>\n</span>\n<!-- // 2 The whole slider bar -->\n<span ngxSliderElement #fullBar [class.ngx-slider-transparent]="fullBarTransparentClass" class="ngx-slider-span ngx-slider-bar-wrapper ngx-slider-full-bar">\n  <span class="ngx-slider-span ngx-slider-bar"></span>\n</span>\n<!-- // 3 Selection bar between two handles -->\n<span ngxSliderElement #selectionBar [class.ngx-slider-draggable]="selectionBarDraggableClass" class="ngx-slider-span ngx-slider-bar-wrapper ngx-slider-selection-bar">\n  <span class="ngx-slider-span ngx-slider-bar ngx-slider-selection" [ngStyle]="barStyle"></span>\n</span>\n<!-- // 4 Low slider handle -->\n<span ngxSliderHandle #minHandle class="ngx-slider-span ngx-slider-pointer ngx-slider-pointer-min" [ngStyle]=minPointerStyle></span>\n<!-- // 5 High slider handle -->\n<span ngxSliderHandle #maxHandle [style.display]="range ? \'inherit\' : \'none\'" class="ngx-slider-span ngx-slider-pointer ngx-slider-pointer-max" [ngStyle]=maxPointerStyle></span>\n<!-- // 6 Floor label -->\n<span ngxSliderLabel #floorLabel class="ngx-slider-span ngx-slider-bubble ngx-slider-limit ngx-slider-floor"></span>\n<!-- // 7 Ceiling label -->\n<span ngxSliderLabel #ceilLabel class="ngx-slider-span ngx-slider-bubble ngx-slider-limit ngx-slider-ceil"></span>\n<!-- // 8 Label above the low slider handle -->\n<span ngxSliderLabel #minHandleLabel class="ngx-slider-span ngx-slider-bubble ngx-slider-model-value"></span>\n<!-- // 9 Label above the high slider handle -->\n<span ngxSliderLabel #maxHandleLabel class="ngx-slider-span ngx-slider-bubble ngx-slider-model-high"></span>\n<!-- // 10 Combined range label when the slider handles are close ex. 15 - 17 -->\n<span ngxSliderLabel #combinedLabel class="ngx-slider-span ngx-slider-bubble ngx-slider-combined"></span>\n<!-- // 11 The ticks -->\n<span ngxSliderElement #ticksElement [hidden]="!showTicks" [class.ngx-slider-ticks-values-under]="ticksUnderValuesClass" class="ngx-slider-ticks">\n  <span *ngFor="let t of ticks" class="ngx-slider-tick" [ngClass]="{\'ngx-slider-selected\': t.selected}" [ngStyle]="t.style">\n    <ngx-slider-tooltip-wrapper [template]="tooltipTemplate" [tooltip]="t.tooltip" [placement]="t.tooltipPlacement"></ngx-slider-tooltip-wrapper>\n    <ngx-slider-tooltip-wrapper *ngIf="t.value != null" class="ngx-slider-span ngx-slider-tick-value"\n        [template]="tooltipTemplate" [tooltip]="t.valueTooltip" [placement]="t.valueTooltipPlacement" [content]="t.value"></ngx-slider-tooltip-wrapper>\n    <span *ngIf="t.legend != null" class="ngx-slider-span ngx-slider-tick-legend" [innerHTML]="t.legend"></span>\n  </span>\n</span>',
          styles: [
            "::ng-deep .ngx-slider{display:inline-block;position:relative;height:4px;width:100%;margin:35px 0 15px;vertical-align:middle;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;touch-action:pan-y}::ng-deep .ngx-slider.with-legend{margin-bottom:40px}::ng-deep .ngx-slider[disabled]{cursor:not-allowed}::ng-deep .ngx-slider[disabled] .ngx-slider-pointer{cursor:not-allowed;background-color:#d8e0f3}::ng-deep .ngx-slider[disabled] .ngx-slider-draggable{cursor:not-allowed}::ng-deep .ngx-slider[disabled] .ngx-slider-selection{background:#8b91a2}::ng-deep .ngx-slider[disabled] .ngx-slider-tick{cursor:not-allowed}::ng-deep .ngx-slider[disabled] .ngx-slider-tick.ngx-slider-selected{background:#8b91a2}::ng-deep .ngx-slider .ngx-slider-span{white-space:nowrap;position:absolute;display:inline-block}::ng-deep .ngx-slider .ngx-slider-base{width:100%;height:100%;padding:0}::ng-deep .ngx-slider .ngx-slider-bar-wrapper{left:0;box-sizing:border-box;margin-top:-16px;padding-top:16px;width:100%;height:32px;z-index:1}::ng-deep .ngx-slider .ngx-slider-draggable{cursor:move}::ng-deep .ngx-slider .ngx-slider-bar{left:0;width:100%;height:4px;z-index:1;background:#d8e0f3;border-radius:2px}::ng-deep .ngx-slider .ngx-slider-bar-wrapper.ngx-slider-transparent .ngx-slider-bar{background:0 0}::ng-deep .ngx-slider .ngx-slider-bar-wrapper.ngx-slider-left-out-selection .ngx-slider-bar{background:#df002d}::ng-deep .ngx-slider .ngx-slider-bar-wrapper.ngx-slider-right-out-selection .ngx-slider-bar{background:#03a688}::ng-deep .ngx-slider .ngx-slider-selection{z-index:2;background:#0db9f0;border-radius:2px}::ng-deep .ngx-slider .ngx-slider-pointer{cursor:pointer;width:32px;height:32px;top:-14px;background-color:#0db9f0;z-index:3;border-radius:16px}::ng-deep .ngx-slider .ngx-slider-pointer:after{content:'';width:8px;height:8px;position:absolute;top:12px;left:12px;border-radius:4px;background:#fff}::ng-deep .ngx-slider .ngx-slider-pointer:hover:after{background-color:#fff}::ng-deep .ngx-slider .ngx-slider-pointer.ngx-slider-active{z-index:4}::ng-deep .ngx-slider .ngx-slider-pointer.ngx-slider-active:after{background-color:#451aff}::ng-deep .ngx-slider .ngx-slider-bubble{cursor:default;bottom:16px;padding:1px 3px;color:#55637d;font-size:16px}::ng-deep .ngx-slider .ngx-slider-bubble.ngx-slider-limit{color:#55637d}::ng-deep .ngx-slider .ngx-slider-ticks{box-sizing:border-box;width:100%;height:0;position:absolute;left:0;top:-3px;margin:0;z-index:1;list-style:none}::ng-deep .ngx-slider .ngx-slider-ticks-values-under .ngx-slider-tick-value{top:auto;bottom:-36px}::ng-deep .ngx-slider .ngx-slider-tick{text-align:center;cursor:pointer;width:10px;height:10px;background:#d8e0f3;border-radius:50%;position:absolute;top:0;left:0;margin-left:11px}::ng-deep .ngx-slider .ngx-slider-tick.ngx-slider-selected{background:#0db9f0}::ng-deep .ngx-slider .ngx-slider-tick-value{position:absolute;top:-34px;-webkit-transform:translate(-50%,0);transform:translate(-50%,0)}::ng-deep .ngx-slider .ngx-slider-tick-legend{position:absolute;top:24px;-webkit-transform:translate(-50%,0);transform:translate(-50%,0);max-width:50px;white-space:normal}::ng-deep .ngx-slider.vertical{position:relative;width:4px;height:100%;margin:0 20px;padding:0;vertical-align:baseline;touch-action:pan-x}::ng-deep .ngx-slider.vertical .ngx-slider-base{width:100%;height:100%;padding:0}::ng-deep .ngx-slider.vertical .ngx-slider-bar-wrapper{top:auto;left:0;margin:0 0 0 -16px;padding:0 0 0 16px;height:100%;width:32px}::ng-deep .ngx-slider.vertical .ngx-slider-bar{bottom:0;left:auto;width:4px;height:100%}::ng-deep .ngx-slider.vertical .ngx-slider-pointer{left:-14px!important;top:auto;bottom:0}::ng-deep .ngx-slider.vertical .ngx-slider-bubble{left:16px!important;bottom:0}::ng-deep .ngx-slider.vertical .ngx-slider-ticks{height:100%;width:0;left:-3px;top:0;z-index:1}::ng-deep .ngx-slider.vertical .ngx-slider-tick{vertical-align:middle;margin-left:auto;margin-top:11px}::ng-deep .ngx-slider.vertical .ngx-slider-tick-value{left:24px;top:auto;-webkit-transform:translate(0,-28%);transform:translate(0,-28%)}::ng-deep .ngx-slider.vertical .ngx-slider-tick-legend{top:auto;right:24px;-webkit-transform:translate(0,-28%);transform:translate(0,-28%);max-width:none;white-space:nowrap}::ng-deep .ngx-slider.vertical .ngx-slider-ticks-values-under .ngx-slider-tick-value{bottom:auto;left:auto;right:24px}::ng-deep .ngx-slider *{transition:none}::ng-deep .ngx-slider.animate .ngx-slider-bar-wrapper{transition:.3s linear}::ng-deep .ngx-slider.animate .ngx-slider-selection{transition:background-color .3s linear}::ng-deep .ngx-slider.animate .ngx-slider-pointer{transition:.3s linear}::ng-deep .ngx-slider.animate .ngx-slider-pointer:after{transition:.3s linear}::ng-deep .ngx-slider.animate .ngx-slider-bubble{transition:.3s linear}::ng-deep .ngx-slider.animate .ngx-slider-bubble.ngx-slider-limit{transition:opacity .3s linear}::ng-deep .ngx-slider.animate .ngx-slider-bubble.ngx-slider-combined{transition:opacity .3s linear}::ng-deep .ngx-slider.animate .ngx-slider-tick{transition:background-color .3s linear}",
          ],
          host: { class: 'ngx-slider' },
          providers: [NGX_SLIDER_CONTROL_VALUE_ACCESSOR],
        },
      ],
    },
  ];
  /** @nocollapse */
  SliderComponent.ctorParameters = function () {
    return [
      { type: Renderer2 },
      { type: ElementRef },
      { type: ChangeDetectorRef },
      { type: NgZone },
    ];
  };
  SliderComponent.propDecorators = {
    value: [{ type: Input }],
    valueChange: [{ type: Output }],
    highValue: [{ type: Input }],
    highValueChange: [{ type: Output }],
    options: [{ type: Input }],
    userChangeStart: [{ type: Output }],
    userChange: [{ type: Output }],
    userChangeEnd: [{ type: Output }],
    manualRefresh: [{ type: Input }],
    triggerFocus: [{ type: Input }],
    leftOuterSelectionBarElement: [
      {
        type: ViewChild,
        args: ['leftOuterSelectionBar', { read: SliderElementDirective }],
      },
    ],
    rightOuterSelectionBarElement: [
      {
        type: ViewChild,
        args: ['rightOuterSelectionBar', { read: SliderElementDirective }],
      },
    ],
    fullBarElement: [
      { type: ViewChild, args: ['fullBar', { read: SliderElementDirective }] },
    ],
    selectionBarElement: [
      {
        type: ViewChild,
        args: ['selectionBar', { read: SliderElementDirective }],
      },
    ],
    minHandleElement: [
      { type: ViewChild, args: ['minHandle', { read: SliderHandleDirective }] },
    ],
    maxHandleElement: [
      { type: ViewChild, args: ['maxHandle', { read: SliderHandleDirective }] },
    ],
    floorLabelElement: [
      { type: ViewChild, args: ['floorLabel', { read: SliderLabelDirective }] },
    ],
    ceilLabelElement: [
      { type: ViewChild, args: ['ceilLabel', { read: SliderLabelDirective }] },
    ],
    minHandleLabelElement: [
      {
        type: ViewChild,
        args: ['minHandleLabel', { read: SliderLabelDirective }],
      },
    ],
    maxHandleLabelElement: [
      {
        type: ViewChild,
        args: ['maxHandleLabel', { read: SliderLabelDirective }],
      },
    ],
    combinedLabelElement: [
      {
        type: ViewChild,
        args: ['combinedLabel', { read: SliderLabelDirective }],
      },
    ],
    ticksElement: [
      {
        type: ViewChild,
        args: ['ticksElement', { read: SliderElementDirective }],
      },
    ],
    tooltipTemplate: [{ type: ContentChild, args: ['tooltipTemplate'] }],
    sliderElementVerticalClass: [
      { type: HostBinding, args: ['class.vertical'] },
    ],
    sliderElementAnimateClass: [{ type: HostBinding, args: ['class.animate'] }],
    sliderElementWithLegendClass: [
      { type: HostBinding, args: ['class.with-legend'] },
    ],
    sliderElementDisabledAttr: [{ type: HostBinding, args: ['attr.disabled'] }],
    sliderElementAriaLabel: [{ type: HostBinding, args: ['attr.aria-label'] }],
    onResize: [{ type: HostListener, args: ['window:resize', ['$event']] }],
  };
  return SliderComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TooltipWrapperComponent = /** @class */ (function () {
  function TooltipWrapperComponent() {}
  TooltipWrapperComponent.decorators = [
    {
      type: Component,
      args: [
        {
          selector: 'ngx-slider-tooltip-wrapper',
          template:
            '<ng-container *ngIf="template">\n  <ng-template *ngTemplateOutlet="template; context: {tooltip: tooltip, placement: placement, content: content}"></ng-template>\n</ng-container>\n\n<ng-container *ngIf="!template">\n  <div class="ngx-slider-inner-tooltip" [attr.title]="tooltip" [attr.data-tooltip-placement]="placement">\n    {{content}}\n  </div>\n</ng-container>',
          styles: ['.ngx-slider-inner-tooltip{height:100%}'],
        },
      ],
    },
  ];
  TooltipWrapperComponent.propDecorators = {
    template: [{ type: Input }],
    tooltip: [{ type: Input }],
    placement: [{ type: Input }],
    content: [{ type: Input }],
  };
  return TooltipWrapperComponent;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * NgxSlider module
 *
 * The module exports the slider component
 */
var NgxSliderModule = /** @class */ (function () {
  function NgxSliderModule() {}
  NgxSliderModule.decorators = [
    {
      type: NgModule,
      args: [
        {
          imports: [CommonModule],
          declarations: [
            SliderComponent,
            SliderElementDirective,
            SliderHandleDirective,
            SliderLabelDirective,
            TooltipWrapperComponent,
          ],
          exports: [SliderComponent],
        },
      ],
    },
  ];
  return NgxSliderModule;
})();

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export {
  NgxSliderModule,
  ChangeContext,
  PointerType,
  LabelType,
  Options,
  SliderElementDirective as ɵb,
  SliderHandleDirective as ɵc,
  SliderLabelDirective as ɵd,
  SliderComponent as ɵa,
  TooltipWrapperComponent as ɵe,
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1zbGlkZXItbmd4LXNsaWRlci5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvb3B0aW9ucy50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvcG9pbnRlci10eXBlLnRzIiwibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci9jaGFuZ2UtY29udGV4dC50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvdmFsdWUtaGVscGVyLnRzIiwibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci9jb21wYXRpYmlsaXR5LWhlbHBlci50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvbWF0aC1oZWxwZXIudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL2V2ZW50LWxpc3RlbmVyLnRzIiwibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci9ldmVudC1saXN0ZW5lci1oZWxwZXIudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci1lbGVtZW50LmRpcmVjdGl2ZS50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvc2xpZGVyLWhhbmRsZS5kaXJlY3RpdmUudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci1sYWJlbC5kaXJlY3RpdmUudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci5jb21wb25lbnQudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3Rvb2x0aXAtd3JhcHBlci5jb21wb25lbnQudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUG9pbnRlclR5cGUgfSBmcm9tICcuL3BvaW50ZXItdHlwZSc7XHJcblxyXG4vKiogTGFiZWwgdHlwZSAqL1xyXG5leHBvcnQgZW51bSBMYWJlbFR5cGUge1xyXG4gIC8qKiBMYWJlbCBhYm92ZSBsb3cgcG9pbnRlciAqL1xyXG4gIExvdyxcclxuICAvKiogTGFiZWwgYWJvdmUgaGlnaCBwb2ludGVyICovXHJcbiAgSGlnaCxcclxuICAvKiogTGFiZWwgZm9yIG1pbmltdW0gc2xpZGVyIHZhbHVlICovXHJcbiAgRmxvb3IsXHJcbiAgLyoqIExhYmVsIGZvciBtYXhpbXVtIHNsaWRlciB2YWx1ZSAqL1xyXG4gIENlaWwsXHJcbiAgLyoqIExhYmVsIGJlbG93IGxlZ2VuZCB0aWNrICovXHJcbiAgVGlja1ZhbHVlXHJcbn1cclxuXHJcbi8qKiBGdW5jdGlvbiB0byB0cmFuc2xhdGUgbGFiZWwgdmFsdWUgaW50byB0ZXh0ICovXHJcbmV4cG9ydCB0eXBlIFRyYW5zbGF0ZUZ1bmN0aW9uID0gKHZhbHVlOiBudW1iZXIsIGxhYmVsOiBMYWJlbFR5cGUpID0+IHN0cmluZztcclxuLyoqIEZ1bmN0aW9uIHRvIGNvbWJpbmQgKi9cclxuZXhwb3J0IHR5cGUgQ29tYmluZUxhYmVsc0Z1bmN0aW9uID0gKG1pbkxhYmVsOiBzdHJpbmcsIG1heExhYmVsOiBzdHJpbmcpID0+IHN0cmluZztcclxuLyoqIEZ1bmN0aW9uIHRvIHByb3ZpZGUgbGVnZW5kICAqL1xyXG5leHBvcnQgdHlwZSBHZXRMZWdlbmRGdW5jdGlvbiA9ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmc7XHJcbmV4cG9ydCB0eXBlIEdldFN0ZXBMZWdlbmRGdW5jdGlvbiA9IChzdGVwOiBDdXN0b21TdGVwRGVmaW5pdGlvbikgPT4gc3RyaW5nO1xyXG5cclxuLyoqIEZ1bmN0aW9uIGNvbnZlcnRpbmcgc2xpZGVyIHZhbHVlIHRvIHNsaWRlciBwb3NpdGlvbiAqL1xyXG5leHBvcnQgdHlwZSBWYWx1ZVRvUG9zaXRpb25GdW5jdGlvbiA9ICh2YWw6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKSA9PiBudW1iZXI7XHJcblxyXG4vKiogRnVuY3Rpb24gY29udmVydGluZyBzbGlkZXIgcG9zaXRpb24gdG8gc2xpZGVyIHZhbHVlICovXHJcbmV4cG9ydCB0eXBlIFBvc2l0aW9uVG9WYWx1ZUZ1bmN0aW9uID0gKHBlcmNlbnQ6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKSA9PiBudW1iZXI7XHJcblxyXG4vKipcclxuICogQ3VzdG9tIHN0ZXAgZGVmaW5pdGlvblxyXG4gKlxyXG4gKiBUaGlzIGNhbiBiZSB1c2VkIHRvIHNwZWNpZnkgY3VzdG9tIHZhbHVlcyBhbmQgbGVnZW5kIHZhbHVlcyBmb3Igc2xpZGVyIHRpY2tzXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIEN1c3RvbVN0ZXBEZWZpbml0aW9uIHtcclxuICAvKiogVmFsdWUgKi9cclxuICB2YWx1ZTogbnVtYmVyO1xyXG4gIC8qKiBMZWdlbmQgKGxhYmVsIGZvciB0aGUgdmFsdWUpICovXHJcbiAgbGVnZW5kPzogc3RyaW5nO1xyXG59XHJcblxyXG4vKiogU2xpZGVyIG9wdGlvbnMgKi9cclxuZXhwb3J0IGNsYXNzIE9wdGlvbnMge1xyXG4gIC8qKiBNaW5pbXVtIHZhbHVlIGZvciBhIHNsaWRlci5cclxuICAgIE5vdCBhcHBsaWNhYmxlIHdoZW4gdXNpbmcgc3RlcHNBcnJheS4gKi9cclxuICBmbG9vcj86IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKiBNYXhpbXVtIHZhbHVlIGZvciBhIHNsaWRlci5cclxuICAgIE5vdCBhcHBsaWNhYmxlIHdoZW4gdXNpbmcgc3RlcHNBcnJheS4gKi9cclxuICBjZWlsPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFN0ZXAgYmV0d2VlbiBlYWNoIHZhbHVlLlxyXG4gICAgTm90IGFwcGxpY2FibGUgd2hlbiB1c2luZyBzdGVwc0FycmF5LiAqL1xyXG4gIHN0ZXA/OiBudW1iZXIgPSAxO1xyXG5cclxuICAvKiogVGhlIG1pbmltdW0gcmFuZ2UgYXV0aG9yaXplZCBvbiB0aGUgc2xpZGVyLlxyXG4gICAgQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS5cclxuICAgIFdoZW4gdXNpbmcgc3RlcHNBcnJheSwgZXhwcmVzc2VkIGFzIGluZGV4IGludG8gc3RlcHNBcnJheS4gKi9cclxuICBtaW5SYW5nZT86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBUaGUgbWF4aW11bSByYW5nZSBhdXRob3JpemVkIG9uIHRoZSBzbGlkZXIuXHJcbiAgICBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIG1heFJhbmdlPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGhhdmUgYSBwdXNoIGJlaGF2aW9yLiBXaGVuIHRoZSBtaW4gaGFuZGxlIGdvZXMgYWJvdmUgdGhlIG1heCxcclxuICAgIHRoZSBtYXggaXMgbW92ZWQgYXMgd2VsbCAoYW5kIHZpY2UtdmVyc2EpLiBUaGUgcmFuZ2UgYmV0d2VlbiBtaW4gYW5kIG1heCBpc1xyXG4gICAgZGVmaW5lZCBieSB0aGUgc3RlcCBvcHRpb24gKGRlZmF1bHRzIHRvIDEpIGFuZCBjYW4gYWxzbyBiZSBvdmVycmlkZW4gYnlcclxuICAgIHRoZSBtaW5SYW5nZSBvcHRpb24uIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuICovXHJcbiAgcHVzaFJhbmdlPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogVGhlIG1pbmltdW0gdmFsdWUgYXV0aG9yaXplZCBvbiB0aGUgc2xpZGVyLlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIG1pbkxpbWl0PzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFRoZSBtYXhpbXVtIHZhbHVlIGF1dGhvcml6ZWQgb24gdGhlIHNsaWRlci5cclxuICAgIFdoZW4gdXNpbmcgc3RlcHNBcnJheSwgZXhwcmVzc2VkIGFzIGluZGV4IGludG8gc3RlcHNBcnJheS4gKi9cclxuICBtYXhMaW1pdD86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBDdXN0b20gdHJhbnNsYXRlIGZ1bmN0aW9uLiBVc2UgdGhpcyBpZiB5b3Ugd2FudCB0byB0cmFuc2xhdGUgdmFsdWVzIGRpc3BsYXllZFxyXG4gICAgICBvbiB0aGUgc2xpZGVyLiAqL1xyXG4gIHRyYW5zbGF0ZT86IFRyYW5zbGF0ZUZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIEN1c3RvbSBmdW5jdGlvbiBmb3IgY29tYmluaW5nIG92ZXJsYXBwaW5nIGxhYmVscyBpbiByYW5nZSBzbGlkZXIuXHJcbiAgICAgIEl0IHRha2VzIHRoZSBtaW4gYW5kIG1heCB2YWx1ZXMgKGFscmVhZHkgdHJhbnNsYXRlZCB3aXRoIHRyYW5zbGF0ZSBmdWN0aW9uKVxyXG4gICAgICBhbmQgc2hvdWxkIHJldHVybiBob3cgdGhlc2UgdHdvIHZhbHVlcyBzaG91bGQgYmUgY29tYmluZWQuXHJcbiAgICAgIElmIG5vdCBwcm92aWRlZCwgdGhlIGRlZmF1bHQgZnVuY3Rpb24gd2lsbCBqb2luIHRoZSB0d28gdmFsdWVzIHdpdGhcclxuICAgICAgJyAtICcgYXMgc2VwYXJhdG9yLiAqL1xyXG4gIGNvbWJpbmVMYWJlbHM/OiBDb21iaW5lTGFiZWxzRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGRpc3BsYXkgbGVnZW5kIHVuZGVyIHRpY2tzICh0aHVzLCBpdCBuZWVkcyB0byBiZSB1c2VkIGFsb25nIHdpdGhcclxuICAgICBzaG93VGlja3Mgb3Igc2hvd1RpY2tzVmFsdWVzKS4gVGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIHdpdGggZWFjaCB0aWNrXHJcbiAgICAgdmFsdWUgYW5kIHJldHVybmVkIGNvbnRlbnQgd2lsbCBiZSBkaXNwbGF5ZWQgdW5kZXIgdGhlIHRpY2sgYXMgYSBsZWdlbmQuXHJcbiAgICAgSWYgdGhlIHJldHVybmVkIHZhbHVlIGlzIG51bGwsIHRoZW4gbm8gbGVnZW5kIGlzIGRpc3BsYXllZCB1bmRlclxyXG4gICAgIHRoZSBjb3JyZXNwb25kaW5nIHRpY2suWW91IGNhbiBhbHNvIGRpcmVjdGx5IHByb3ZpZGUgdGhlIGxlZ2VuZCB2YWx1ZXNcclxuICAgICBpbiB0aGUgc3RlcHNBcnJheSBvcHRpb24uICovXHJcbiAgZ2V0TGVnZW5kPzogR2V0TGVnZW5kRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAgLyoqIFVzZSB0byBkaXNwbGF5IGEgY3VzdG9tIGxlZ2VuZCBvZiBhIHN0ZXBJdGVtIGZyb20gc3RlcHNBcnJheS5cclxuICAgIEl0IHdpbGwgYmUgdGhlIHNhbWUgYXMgZ2V0TGVnZW5kIGJ1dCBmb3Igc3RlcHNBcnJheS4gKi9cclxuICBnZXRTdGVwTGVnZW5kPzogR2V0U3RlcExlZ2VuZEZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIElmIHlvdSB3YW50IHRvIGRpc3BsYXkgYSBzbGlkZXIgd2l0aCBub24gbGluZWFyL251bWJlciBzdGVwcy5cclxuICAgICBKdXN0IHBhc3MgYW4gYXJyYXkgd2l0aCBlYWNoIHNsaWRlciB2YWx1ZSBhbmQgdGhhdCdzIGl0OyB0aGUgZmxvb3IsIGNlaWwgYW5kIHN0ZXAgc2V0dGluZ3NcclxuICAgICBvZiB0aGUgc2xpZGVyIHdpbGwgYmUgY29tcHV0ZWQgYXV0b21hdGljYWxseS5cclxuICAgICBCeSBkZWZhdWx0LCB0aGUgdmFsdWUgbW9kZWwgYW5kIHZhbHVlSGlnaCBtb2RlbCB2YWx1ZXMgd2lsbCBiZSB0aGUgdmFsdWUgb2YgdGhlIHNlbGVjdGVkIGl0ZW1cclxuICAgICBpbiB0aGUgc3RlcHNBcnJheS5cclxuICAgICBUaGV5IGNhbiBhbHNvIGJlIGJvdW5kIHRvIHRoZSBpbmRleCBvZiB0aGUgc2VsZWN0ZWQgaXRlbSBieSBzZXR0aW5nIHRoZSBiaW5kSW5kZXhGb3JTdGVwc0FycmF5XHJcbiAgICAgb3B0aW9uIHRvIHRydWUuICovXHJcbiAgc3RlcHNBcnJheT86IEN1c3RvbVN0ZXBEZWZpbml0aW9uW10gPSBudWxsO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gYmluZCB0aGUgaW5kZXggb2YgdGhlIHNlbGVjdGVkIGl0ZW0gdG8gdmFsdWUgbW9kZWwgYW5kIHZhbHVlSGlnaCBtb2RlbC4gKi9cclxuICBiaW5kSW5kZXhGb3JTdGVwc0FycmF5PzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogV2hlbiBzZXQgdG8gdHJ1ZSBhbmQgdXNpbmcgYSByYW5nZSBzbGlkZXIsIHRoZSByYW5nZSBjYW4gYmUgZHJhZ2dlZCBieSB0aGUgc2VsZWN0aW9uIGJhci5cclxuICAgIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuICovXHJcbiAgZHJhZ2dhYmxlUmFuZ2U/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTYW1lIGFzIGRyYWdnYWJsZVJhbmdlIGJ1dCB0aGUgc2xpZGVyIHJhbmdlIGNhbid0IGJlIGNoYW5nZWQuXHJcbiAgICBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LiAqL1xyXG4gIGRyYWdnYWJsZVJhbmdlT25seT86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGFsd2F5cyBzaG93IHRoZSBzZWxlY3Rpb24gYmFyIGJlZm9yZSB0aGUgc2xpZGVyIGhhbmRsZS4gKi9cclxuICBzaG93U2VsZWN0aW9uQmFyPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gYWx3YXlzIHNob3cgdGhlIHNlbGVjdGlvbiBiYXIgYWZ0ZXIgdGhlIHNsaWRlciBoYW5kbGUuICovXHJcbiAgc2hvd1NlbGVjdGlvbkJhckVuZD86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqICBTZXQgYSBudW1iZXIgdG8gZHJhdyB0aGUgc2VsZWN0aW9uIGJhciBiZXR3ZWVuIHRoaXMgdmFsdWUgYW5kIHRoZSBzbGlkZXIgaGFuZGxlLlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIHNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWU/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogIE9ubHkgZm9yIHJhbmdlIHNsaWRlci4gU2V0IHRvIHRydWUgdG8gdmlzdWFsaXplIGluIGRpZmZlcmVudCBjb2xvdXIgdGhlIGFyZWFzXHJcbiAgICBvbiB0aGUgbGVmdC9yaWdodCAodG9wL2JvdHRvbSBmb3IgdmVydGljYWwgcmFuZ2Ugc2xpZGVyKSBvZiBzZWxlY3Rpb24gYmFyIGJldHdlZW4gdGhlIGhhbmRsZXMuICovXHJcbiAgc2hvd091dGVyU2VsZWN0aW9uQmFycz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGhpZGUgcG9pbnRlciBsYWJlbHMgKi9cclxuICBoaWRlUG9pbnRlckxhYmVscz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGhpZGUgbWluIC8gbWF4IGxhYmVscyAgKi9cclxuICBoaWRlTGltaXRMYWJlbHM/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGUgYXV0by1oaWRpbmcgYmVoYXZpb3Igb2YgdGhlIGxpbWl0IGxhYmVscy4gKi9cclxuICBhdXRvSGlkZUxpbWl0TGFiZWxzPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBtYWtlIHRoZSBzbGlkZXIgcmVhZC1vbmx5LiAqL1xyXG4gIHJlYWRPbmx5PzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZGlzYWJsZSB0aGUgc2xpZGVyLiAqL1xyXG4gIGRpc2FibGVkPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZGlzcGxheSBhIHRpY2sgZm9yIGVhY2ggc3RlcCBvZiB0aGUgc2xpZGVyLiAqL1xyXG4gIHNob3dUaWNrcz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGRpc3BsYXkgYSB0aWNrIGFuZCB0aGUgc3RlcCB2YWx1ZSBmb3IgZWFjaCBzdGVwIG9mIHRoZSBzbGlkZXIuLiAqL1xyXG4gIHNob3dUaWNrc1ZhbHVlcz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyogVGhlIHN0ZXAgYmV0d2VlbiBlYWNoIHRpY2sgdG8gZGlzcGxheS4gSWYgbm90IHNldCwgdGhlIHN0ZXAgdmFsdWUgaXMgdXNlZC5cclxuICAgIE5vdCB1c2VkIHdoZW4gdGlja3NBcnJheSBpcyBzcGVjaWZpZWQuICovXHJcbiAgdGlja1N0ZXA/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiBUaGUgc3RlcCBiZXR3ZWVuIGRpc3BsYXlpbmcgZWFjaCB0aWNrIHN0ZXAgdmFsdWUuXHJcbiAgICBJZiBub3Qgc2V0LCB0aGVuIHRpY2tTdGVwIG9yIHN0ZXAgaXMgdXNlZCwgZGVwZW5kaW5nIG9uIHdoaWNoIG9uZSBpcyBzZXQuICovXHJcbiAgdGlja1ZhbHVlU3RlcD86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2UgdG8gZGlzcGxheSB0aWNrcyBhdCBzcGVjaWZpYyBwb3NpdGlvbnMuXHJcbiAgICBUaGUgYXJyYXkgY29udGFpbnMgdGhlIGluZGV4IG9mIHRoZSB0aWNrcyB0aGF0IHNob3VsZCBiZSBkaXNwbGF5ZWQuXHJcbiAgICBGb3IgZXhhbXBsZSwgWzAsIDEsIDVdIHdpbGwgZGlzcGxheSBhIHRpY2sgZm9yIHRoZSBmaXJzdCwgc2Vjb25kIGFuZCBzaXh0aCB2YWx1ZXMuICovXHJcbiAgdGlja3NBcnJheT86IG51bWJlcltdID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZWQgdG8gZGlzcGxheSBhIHRvb2x0aXAgd2hlbiBhIHRpY2sgaXMgaG92ZXJlZC5cclxuICAgIFNldCB0byBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgdG9vbHRpcCBjb250ZW50IGZvciBhIGdpdmVuIHZhbHVlLiAqL1xyXG4gIHRpY2tzVG9vbHRpcD86ICh2YWx1ZTogbnVtYmVyKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogU2FtZSBhcyB0aWNrc1Rvb2x0aXAgYnV0IGZvciB0aWNrcyB2YWx1ZXMuICovXHJcbiAgdGlja3NWYWx1ZXNUb29sdGlwPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBkaXNwbGF5IHRoZSBzbGlkZXIgdmVydGljYWxseS5cclxuICAgIFRoZSBzbGlkZXIgd2lsbCB0YWtlIHRoZSBmdWxsIGhlaWdodCBvZiBpdHMgcGFyZW50LlxyXG4gICAgQ2hhbmdpbmcgdGhpcyB2YWx1ZSBhdCBydW50aW1lIGlzIG5vdCBjdXJyZW50bHkgc3VwcG9ydGVkLiAqL1xyXG4gIHZlcnRpY2FsPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjdXJyZW50IGNvbG9yIG9mIHRoZSBzZWxlY3Rpb24gYmFyLlxyXG4gICAgSWYgeW91ciBjb2xvciB3b24ndCBjaGFuZ2UsIGRvbid0IHVzZSB0aGlzIG9wdGlvbiBidXQgc2V0IGl0IHRocm91Z2ggQ1NTLlxyXG4gICAgSWYgdGhlIHJldHVybmVkIGNvbG9yIGRlcGVuZHMgb24gYSBtb2RlbCB2YWx1ZSAoZWl0aGVyIHZhbHVlIG9yIHZhbHVlSGlnaCksXHJcbiAgICB5b3Ugc2hvdWxkIHVzZSB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbi5cclxuICAgIEluZGVlZCwgd2hlbiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGVyZSBpcyBubyBjZXJ0YWludHkgdGhhdCB0aGUgbW9kZWxcclxuICAgIGhhcyBhbHJlYWR5IGJlZW4gdXBkYXRlZC4qL1xyXG4gIGdldFNlbGVjdGlvbkJhckNvbG9yPzogKG1pblZhbHVlOiBudW1iZXIsIG1heFZhbHVlPzogbnVtYmVyKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBjb2xvciBvZiBhIHRpY2suIHNob3dUaWNrcyBtdXN0IGJlIGVuYWJsZWQuICovXHJcbiAgZ2V0VGlja0NvbG9yPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGN1cnJlbnQgY29sb3Igb2YgYSBwb2ludGVyLlxyXG4gICAgSWYgeW91ciBjb2xvciB3b24ndCBjaGFuZ2UsIGRvbid0IHVzZSB0aGlzIG9wdGlvbiBidXQgc2V0IGl0IHRocm91Z2ggQ1NTLlxyXG4gICAgSWYgdGhlIHJldHVybmVkIGNvbG9yIGRlcGVuZHMgb24gYSBtb2RlbCB2YWx1ZSAoZWl0aGVyIHZhbHVlIG9yIHZhbHVlSGlnaCksXHJcbiAgICB5b3Ugc2hvdWxkIHVzZSB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIHRoZSBmdW5jdGlvbi5cclxuICAgIEluZGVlZCwgd2hlbiB0aGUgZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGVyZSBpcyBubyBjZXJ0YWludHkgdGhhdCB0aGUgbW9kZWwgaGFzIGFscmVhZHkgYmVlbiB1cGRhdGVkLlxyXG4gICAgVG8gaGFuZGxlIHJhbmdlIHNsaWRlciBwb2ludGVycyBpbmRlcGVuZGVudGx5LCB5b3Ugc2hvdWxkIGV2YWx1YXRlIHBvaW50ZXJUeXBlIHdpdGhpbiB0aGUgZ2l2ZW5cclxuICAgIGZ1bmN0aW9uIHdoZXJlIFwibWluXCIgc3RhbmRzIGZvciB2YWx1ZSBtb2RlbCBhbmQgXCJtYXhcIiBmb3IgdmFsdWVIaWdoIG1vZGVsIHZhbHVlcy4gKi9cclxuICBnZXRQb2ludGVyQ29sb3I/OiAodmFsdWU6IG51bWJlciwgcG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlKSA9PiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogSGFuZGxlcyBhcmUgZm9jdXNhYmxlIChvbiBjbGljayBvciB3aXRoIHRhYikgYW5kIGNhbiBiZSBtb2RpZmllZCB1c2luZyB0aGUgZm9sbG93aW5nIGtleWJvYXJkIGNvbnRyb2xzOlxyXG4gICAgTGVmdC9ib3R0b20gYXJyb3dzOiAtMVxyXG4gICAgUmlnaHQvdG9wIGFycm93czogKzFcclxuICAgIFBhZ2UtZG93bjogLTEwJVxyXG4gICAgUGFnZS11cDogKzEwJVxyXG4gICAgSG9tZTogbWluaW11bSB2YWx1ZVxyXG4gICAgRW5kOiBtYXhpbXVtIHZhbHVlXHJcbiAgICovXHJcbiAga2V5Ym9hcmRTdXBwb3J0PzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBJZiB5b3UgZGlzcGxheSB0aGUgc2xpZGVyIGluIGFuIGVsZW1lbnQgdGhhdCB1c2VzIHRyYW5zZm9ybTogc2NhbGUoMC41KSwgc2V0IHRoZSBzY2FsZSB2YWx1ZSB0byAyXHJcbiAgICBzbyB0aGF0IHRoZSBzbGlkZXIgaXMgcmVuZGVyZWQgcHJvcGVybHkgYW5kIHRoZSBldmVudHMgYXJlIGhhbmRsZWQgY29ycmVjdGx5LiAqL1xyXG4gIHNjYWxlPzogbnVtYmVyID0gMTtcclxuXHJcbiAgLyoqIElmIHlvdSBkaXNwbGF5IHRoZSBzbGlkZXIgaW4gYW4gZWxlbWVudCB0aGF0IHVzZXMgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpLCBzZXQgdGhlIHJvdGF0ZSB2YWx1ZSB0byA5MFxyXG4gICBzbyB0aGF0IHRoZSBzbGlkZXIgaXMgcmVuZGVyZWQgcHJvcGVybHkgYW5kIHRoZSBldmVudHMgYXJlIGhhbmRsZWQgY29ycmVjdGx5LiBWYWx1ZSBpcyBpbiBkZWdyZWVzLiAqL1xyXG4gIHJvdGF0ZT86IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBmb3JjZSB0aGUgdmFsdWUocykgdG8gYmUgcm91bmRlZCB0byB0aGUgc3RlcCwgZXZlbiB3aGVuIG1vZGlmaWVkIGZyb20gdGhlIG91dHNpZGUuXHJcbiAgICBXaGVuIHNldCB0byBmYWxzZSwgaWYgdGhlIG1vZGVsIHZhbHVlcyBhcmUgbW9kaWZpZWQgZnJvbSBvdXRzaWRlIHRoZSBzbGlkZXIsIHRoZXkgYXJlIG5vdCByb3VuZGVkXHJcbiAgICBhbmQgY2FuIGJlIGJldHdlZW4gdHdvIHN0ZXBzLiAqL1xyXG4gIGVuZm9yY2VTdGVwPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBmb3JjZSB0aGUgdmFsdWUocykgdG8gYmUgbm9ybWFsaXNlZCB0byBhbGxvd2VkIHJhbmdlIChmbG9vciB0byBjZWlsKSwgZXZlbiB3aGVuIG1vZGlmaWVkIGZyb20gdGhlIG91dHNpZGUuXHJcbiAgICBXaGVuIHNldCB0byBmYWxzZSwgaWYgdGhlIG1vZGVsIHZhbHVlcyBhcmUgbW9kaWZpZWQgZnJvbSBvdXRzaWRlIHRoZSBzbGlkZXIsIGFuZCB0aGV5IGFyZSBvdXRzaWRlIGFsbG93ZWQgcmFuZ2UsXHJcbiAgICB0aGUgc2xpZGVyIG1heSBiZSByZW5kZXJlZCBpbmNvcnJlY3RseS4gSG93ZXZlciwgc2V0dGluZyB0aGlzIHRvIGZhbHNlIG1heSBiZSB1c2VmdWwgaWYgeW91IHdhbnQgdG8gcGVyZm9ybSBjdXN0b20gbm9ybWFsaXNhdGlvbi4gKi9cclxuICBlbmZvcmNlUmFuZ2U/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGZvcmNlIHRoZSB2YWx1ZShzKSB0byBiZSByb3VuZGVkIHRvIHRoZSBuZWFyZXN0IHN0ZXAgdmFsdWUsIGV2ZW4gd2hlbiBtb2RpZmllZCBmcm9tIHRoZSBvdXRzaWRlLlxyXG4gICAgV2hlbiBzZXQgdG8gZmFsc2UsIGlmIHRoZSBtb2RlbCB2YWx1ZXMgYXJlIG1vZGlmaWVkIGZyb20gb3V0c2lkZSB0aGUgc2xpZGVyLCBhbmQgdGhleSBhcmUgb3V0c2lkZSBhbGxvd2VkIHJhbmdlLFxyXG4gICAgdGhlIHNsaWRlciBtYXkgYmUgcmVuZGVyZWQgaW5jb3JyZWN0bHkuIEhvd2V2ZXIsIHNldHRpbmcgdGhpcyB0byBmYWxzZSBtYXkgYmUgdXNlZnVsIGlmIHlvdSB3YW50IHRvIHBlcmZvcm0gY3VzdG9tIG5vcm1hbGlzYXRpb24uICovXHJcbiAgZW5mb3JjZVN0ZXBzQXJyYXk/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIHByZXZlbnQgdG8gdXNlciBmcm9tIHN3aXRjaGluZyB0aGUgbWluIGFuZCBtYXggaGFuZGxlcy4gQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS4gKi9cclxuICBub1N3aXRjaGluZz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIG9ubHkgYmluZCBldmVudHMgb24gc2xpZGVyIGhhbmRsZXMuICovXHJcbiAgb25seUJpbmRIYW5kbGVzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gc2hvdyBncmFwaHMgcmlnaHQgdG8gbGVmdC5cclxuICAgIElmIHZlcnRpY2FsIGlzIHRydWUgaXQgd2lsbCBiZSBmcm9tIHRvcCB0byBib3R0b20gYW5kIGxlZnQgLyByaWdodCBhcnJvdyBmdW5jdGlvbnMgcmV2ZXJzZWQuICovXHJcbiAgcmlnaHRUb0xlZnQ/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byByZXZlcnNlIGtleWJvYXJkIG5hdmlnYXRpb246XHJcbiAgICBSaWdodC90b3AgYXJyb3dzOiAtMVxyXG4gICAgTGVmdC9ib3R0b20gYXJyb3dzOiArMVxyXG4gICAgUGFnZS11cDogLTEwJVxyXG4gICAgUGFnZS1kb3duOiArMTAlXHJcbiAgICBFbmQ6IG1pbmltdW0gdmFsdWVcclxuICAgIEhvbWU6IG1heGltdW0gdmFsdWVcclxuICAgKi9cclxuICByZXZlcnNlZENvbnRyb2xzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8ga2VlcCB0aGUgc2xpZGVyIGxhYmVscyBpbnNpZGUgdGhlIHNsaWRlciBib3VuZHMuICovXHJcbiAgYm91bmRQb2ludGVyTGFiZWxzPzogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byB1c2UgYSBsb2dhcml0aG1pYyBzY2FsZSB0byBkaXNwbGF5IHRoZSBzbGlkZXIuICAqL1xyXG4gIGxvZ1NjYWxlPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBwb3NpdGlvbiBvbiB0aGUgc2xpZGVyIGZvciBhIGdpdmVuIHZhbHVlLlxyXG4gICAgVGhlIHBvc2l0aW9uIG11c3QgYmUgYSBwZXJjZW50YWdlIGJldHdlZW4gMCBhbmQgMS5cclxuICAgIFRoZSBmdW5jdGlvbiBzaG91bGQgYmUgbW9ub3RvbmljYWxseSBpbmNyZWFzaW5nIG9yIGRlY3JlYXNpbmc7IG90aGVyd2lzZSB0aGUgc2xpZGVyIG1heSBiZWhhdmUgaW5jb3JyZWN0bHkuICovXHJcbiAgY3VzdG9tVmFsdWVUb1Bvc2l0aW9uPzogVmFsdWVUb1Bvc2l0aW9uRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAvKiogRnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBwb3NpdGlvbiBvbiB0aGUgc2xpZGVyLlxyXG4gICAgVGhlIHBvc2l0aW9uIGlzIGEgcGVyY2VudGFnZSBiZXR3ZWVuIDAgYW5kIDEuXHJcbiAgICBUaGUgZnVuY3Rpb24gc2hvdWxkIGJlIG1vbm90b25pY2FsbHkgaW5jcmVhc2luZyBvciBkZWNyZWFzaW5nOyBvdGhlcndpc2UgdGhlIHNsaWRlciBtYXkgYmVoYXZlIGluY29ycmVjdGx5LiAqL1xyXG4gIGN1c3RvbVBvc2l0aW9uVG9WYWx1ZT86IFBvc2l0aW9uVG9WYWx1ZUZ1bmN0aW9uID0gbnVsbDtcclxuXHJcbiAgLyoqIFByZWNpc2lvbiBsaW1pdCBmb3IgY2FsY3VsYXRlZCB2YWx1ZXMuXHJcbiAgICBWYWx1ZXMgdXNlZCBpbiBjYWxjdWxhdGlvbnMgd2lsbCBiZSByb3VuZGVkIHRvIHRoaXMgbnVtYmVyIG9mIHNpZ25pZmljYW50IGRpZ2l0c1xyXG4gICAgdG8gcHJldmVudCBhY2N1bXVsYXRpbmcgc21hbGwgZmxvYXRpbmctcG9pbnQgZXJyb3JzLiAqL1xyXG4gIHByZWNpc2lvbkxpbWl0PzogbnVtYmVyID0gMTI7XHJcblxyXG4gIC8qKiBVc2UgdG8gZGlzcGxheSB0aGUgc2VsZWN0aW9uIGJhciBhcyBhIGdyYWRpZW50LlxyXG4gICAgVGhlIGdpdmVuIG9iamVjdCBtdXN0IGNvbnRhaW4gZnJvbSBhbmQgdG8gcHJvcGVydGllcyB3aGljaCBhcmUgY29sb3JzLiAqL1xyXG4gIHNlbGVjdGlvbkJhckdyYWRpZW50Pzoge2Zyb206IHN0cmluZywgdG86IHN0cmluZ30gPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGFkZCBhIGxhYmVsIGRpcmVjdGx5IHRvIHRoZSBzbGlkZXIgZm9yIGFjY2Vzc2liaWxpdHkuIEFkZHMgdGhlIGFyaWEtbGFiZWwgYXR0cmlidXRlLiAqL1xyXG4gIGFyaWFMYWJlbD86IHN0cmluZyA9ICduZ3gtc2xpZGVyJztcclxuXHJcbiAgLyoqIFVzZSBpbnN0ZWFkIG9mIGFyaWFMYWJlbCB0byByZWZlcmVuY2UgdGhlIGlkIG9mIGFuIGVsZW1lbnQgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGxhYmVsIHRoZSBzbGlkZXIuXHJcbiAgICBBZGRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgYXR0cmlidXRlLiAqL1xyXG4gIGFyaWFMYWJlbGxlZEJ5Pzogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBhZGQgYSBsYWJlbCBkaXJlY3RseSB0byB0aGUgc2xpZGVyIHJhbmdlIGZvciBhY2Nlc3NpYmlsaXR5LiBBZGRzIHRoZSBhcmlhLWxhYmVsIGF0dHJpYnV0ZS4gKi9cclxuICBhcmlhTGFiZWxIaWdoPzogc3RyaW5nID0gJ25neC1zbGlkZXItbWF4JztcclxuXHJcbiAgLyoqIFVzZSBpbnN0ZWFkIG9mIGFyaWFMYWJlbEhpZ2ggdG8gcmVmZXJlbmNlIHRoZSBpZCBvZiBhbiBlbGVtZW50IHdoaWNoIHdpbGwgYmUgdXNlZCB0byBsYWJlbCB0aGUgc2xpZGVyIHJhbmdlLlxyXG4gICAgQWRkcyB0aGUgYXJpYS1sYWJlbGxlZGJ5IGF0dHJpYnV0ZS4gKi9cclxuICBhcmlhTGFiZWxsZWRCeUhpZ2g/OiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGluY3JlYXNlIHJlbmRlcmluZyBwZXJmb3JtYW5jZS4gSWYgdGhlIHZhbHVlIGlzIG5vdCBwcm92aWRlZCwgdGhlIHNsaWRlciBjYWxjdWxhdGVzIHRoZSB3aXRoL2hlaWdodCBvZiB0aGUgaGFuZGxlICovXHJcbiAgaGFuZGxlRGltZW5zaW9uPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBpbmNyZWFzZSByZW5kZXJpbmcgcGVyZm9ybWFuY2UuIElmIHRoZSB2YWx1ZSBpcyBub3QgcHJvdmlkZWQsIHRoZSBzbGlkZXIgY2FsY3VsYXRlcyB0aGUgd2l0aC9oZWlnaHQgb2YgdGhlIGJhciAqL1xyXG4gIGJhckRpbWVuc2lvbj86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiBFbmFibGUvZGlzYWJsZSBDU1MgYW5pbWF0aW9ucyAqL1xyXG4gIGFuaW1hdGU/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIEVuYWJsZS9kaXNhYmxlIENTUyBhbmltYXRpb25zIHdoaWxlIG1vdmluZyB0aGUgc2xpZGVyICovXHJcbiAgYW5pbWF0ZU9uTW92ZT86IGJvb2xlYW4gPSBmYWxzZTtcclxufVxyXG4iLCIvKiogUG9pbnRlciB0eXBlICovXHJcbmV4cG9ydCBlbnVtIFBvaW50ZXJUeXBlIHtcclxuICAvKiogTG93IHBvaW50ZXIgKi9cclxuICBNaW4sXHJcbiAgLyoqIEhpZ2ggcG9pbnRlciAqL1xyXG4gIE1heFxyXG59XHJcbiIsImltcG9ydCB7IFBvaW50ZXJUeXBlIH0gZnJvbSAnLi9wb2ludGVyLXR5cGUnO1xyXG5cclxuZXhwb3J0IGNsYXNzIENoYW5nZUNvbnRleHQge1xyXG4gIHZhbHVlOiBudW1iZXI7XHJcbiAgaGlnaFZhbHVlPzogbnVtYmVyO1xyXG4gIHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZTtcclxufVxyXG4iLCJpbXBvcnQgeyBDdXN0b21TdGVwRGVmaW5pdGlvbiB9IGZyb20gJy4vb3B0aW9ucyc7XHJcblxyXG4vKipcclxuICogIENvbGxlY3Rpb24gb2YgZnVuY3Rpb25zIHRvIGhhbmRsZSBjb252ZXJzaW9ucy9sb29rdXBzIG9mIHZhbHVlc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFZhbHVlSGVscGVyIHtcclxuICBzdGF0aWMgaXNOdWxsT3JVbmRlZmluZWQodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09IG51bGw7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgYXJlQXJyYXlzRXF1YWwoYXJyYXkxOiBhbnlbXSwgYXJyYXkyOiBhbnlbXSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKGFycmF5MS5sZW5ndGggIT09IGFycmF5Mi5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhcnJheTEubGVuZ3RoOyArK2kpIHtcclxuICAgICAgaWYgKGFycmF5MVtpXSAhPT0gYXJyYXkyW2ldKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbGluZWFyVmFsdWVUb1Bvc2l0aW9uKHZhbDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3QgcmFuZ2U6IG51bWJlciA9IG1heFZhbCAtIG1pblZhbDtcclxuICAgIHJldHVybiAodmFsIC0gbWluVmFsKSAvIHJhbmdlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvZ1ZhbHVlVG9Qb3NpdGlvbih2YWw6IG51bWJlciwgbWluVmFsOiBudW1iZXIsIG1heFZhbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHZhbCA9IE1hdGgubG9nKHZhbCk7XHJcbiAgICBtaW5WYWwgPSBNYXRoLmxvZyhtaW5WYWwpO1xyXG4gICAgbWF4VmFsID0gTWF0aC5sb2cobWF4VmFsKTtcclxuICAgIGNvbnN0IHJhbmdlOiBudW1iZXIgPSBtYXhWYWwgLSBtaW5WYWw7XHJcbiAgICByZXR1cm4gKHZhbCAtIG1pblZhbCkgLyByYW5nZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsaW5lYXJQb3NpdGlvblRvVmFsdWUocGVyY2VudDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHBlcmNlbnQgKiAobWF4VmFsIC0gbWluVmFsKSArIG1pblZhbDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2dQb3NpdGlvblRvVmFsdWUocGVyY2VudDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgbWluVmFsID0gTWF0aC5sb2cobWluVmFsKTtcclxuICAgIG1heFZhbCA9IE1hdGgubG9nKG1heFZhbCk7XHJcbiAgICBjb25zdCB2YWx1ZTogbnVtYmVyID0gcGVyY2VudCAqIChtYXhWYWwgLSBtaW5WYWwpICsgbWluVmFsO1xyXG4gICAgcmV0dXJuIE1hdGguZXhwKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmaW5kU3RlcEluZGV4KG1vZGVsVmFsdWU6IG51bWJlciwgc3RlcHNBcnJheTogQ3VzdG9tU3RlcERlZmluaXRpb25bXSk6IG51bWJlciB7XHJcbiAgICBjb25zdCBkaWZmZXJlbmNlczogbnVtYmVyW10gPSBzdGVwc0FycmF5Lm1hcCgoc3RlcDogQ3VzdG9tU3RlcERlZmluaXRpb24pOiBudW1iZXIgPT4gTWF0aC5hYnMobW9kZWxWYWx1ZSAtIHN0ZXAudmFsdWUpKTtcclxuXHJcbiAgICBsZXQgbWluRGlmZmVyZW5jZUluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgc3RlcHNBcnJheS5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgaWYgKGRpZmZlcmVuY2VzW2luZGV4XSAhPT0gZGlmZmVyZW5jZXNbbWluRGlmZmVyZW5jZUluZGV4XSAmJiBkaWZmZXJlbmNlc1tpbmRleF0gPCBkaWZmZXJlbmNlc1ttaW5EaWZmZXJlbmNlSW5kZXhdKSB7XHJcbiAgICAgICAgbWluRGlmZmVyZW5jZUluZGV4ID0gaW5kZXg7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWluRGlmZmVyZW5jZUluZGV4O1xyXG4gIH1cclxufVxyXG4iLCIvLyBEZWNsYXJhdGlvbiBmb3IgUmVzaXplT2JzZXJ2ZXIgYSBuZXcgQVBJIGF2YWlsYWJsZSBpbiBzb21lIG9mIG5ld2VzdCBicm93c2VyczpcclxuLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL1Jlc2l6ZU9ic2VydmVyXHJcbmRlY2xhcmUgY2xhc3MgUmVzaXplT2JzZXJ2ZXIge1xyXG59XHJcblxyXG4vKiogSGVscGVyIHdpdGggY29tcGF0aWJpbGl0eSBmdW5jdGlvbnMgdG8gc3VwcG9ydCBkaWZmZXJlbnQgYnJvd3NlcnMgKi9cclxuZXhwb3J0IGNsYXNzIENvbXBhdGliaWxpdHlIZWxwZXIge1xyXG4gIC8qKiBXb3JrYXJvdW5kIGZvciBUb3VjaEV2ZW50IGNvbnN0cnVjdG9yIHNhZGx5IG5vdCBiZWluZyBhdmFpbGFibGUgb24gYWxsIGJyb3dzZXJzIChlLmcuIEZpcmVmb3gsIFNhZmFyaSkgKi9cclxuICBwdWJsaWMgc3RhdGljIGlzVG91Y2hFdmVudChldmVudDogYW55KTogYm9vbGVhbiB7XHJcbiAgICBpZiAoKHdpbmRvdyBhcyBhbnkpLlRvdWNoRXZlbnQgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICByZXR1cm4gZXZlbnQgaW5zdGFuY2VvZiBUb3VjaEV2ZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBldmVudC50b3VjaGVzICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICAvKiogRGV0ZWN0IHByZXNlbmNlIG9mIFJlc2l6ZU9ic2VydmVyIEFQSSAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgaXNSZXNpemVPYnNlcnZlckF2YWlsYWJsZSgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiAod2luZG93IGFzIGFueSkuUmVzaXplT2JzZXJ2ZXIgIT09IHVuZGVmaW5lZDtcclxuICB9XHJcbn1cclxuIiwiLyoqIEhlbHBlciB3aXRoIG1hdGhlbWF0aWNhbCBmdW5jdGlvbnMgKi9cclxuZXhwb3J0IGNsYXNzIE1hdGhIZWxwZXIge1xyXG4gIC8qIFJvdW5kIG51bWJlcnMgdG8gYSBnaXZlbiBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzICovXHJcbiAgc3RhdGljIHJvdW5kVG9QcmVjaXNpb25MaW1pdCh2YWx1ZTogbnVtYmVyLCBwcmVjaXNpb25MaW1pdDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiArKCB2YWx1ZS50b1ByZWNpc2lvbihwcmVjaXNpb25MaW1pdCkgKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpc01vZHVsb1dpdGhpblByZWNpc2lvbkxpbWl0KHZhbHVlOiBudW1iZXIsIG1vZHVsbzogbnVtYmVyLCBwcmVjaXNpb25MaW1pdDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBsaW1pdDogbnVtYmVyID0gTWF0aC5wb3coMTAsIC1wcmVjaXNpb25MaW1pdCk7XHJcbiAgICByZXR1cm4gTWF0aC5hYnModmFsdWUgJSBtb2R1bG8pIDw9IGxpbWl0IHx8IE1hdGguYWJzKE1hdGguYWJzKHZhbHVlICUgbW9kdWxvKSAtIG1vZHVsbykgPD0gbGltaXQ7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY2xhbXBUb1JhbmdlKHZhbHVlOiBudW1iZXIsIGZsb29yOiBudW1iZXIsIGNlaWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIGZsb29yKSwgY2VpbCk7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV2ZW50TGlzdGVuZXIge1xyXG4gIGV2ZW50TmFtZTogc3RyaW5nID0gbnVsbDtcclxuICBldmVudHM6IFN1YmplY3Q8RXZlbnQ+ID0gbnVsbDtcclxuICBldmVudHNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcbiAgdGVhcmRvd25DYWxsYmFjazogKCkgPT4gdm9pZCA9IG51bGw7XHJcbn1cclxuIiwiaW1wb3J0IHsgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgdGhyb3R0bGVUaW1lLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcbmltcG9ydCB7IHN1cHBvcnRzUGFzc2l2ZUV2ZW50cyB9IGZyb20gJ2RldGVjdC1wYXNzaXZlLWV2ZW50cyc7XHJcblxyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lcic7XHJcbmltcG9ydCB7IFZhbHVlSGVscGVyIH0gZnJvbSAnLi92YWx1ZS1oZWxwZXInO1xyXG5cclxuLyoqXHJcbiAqIEhlbHBlciBjbGFzcyB0byBhdHRhY2ggZXZlbnQgbGlzdGVuZXJzIHRvIERPTSBlbGVtZW50cyB3aXRoIGRlYm91bmNlIHN1cHBvcnQgdXNpbmcgcnhqc1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEV2ZW50TGlzdGVuZXJIZWxwZXIge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGF0dGFjaFBhc3NpdmVFdmVudExpc3RlbmVyKG5hdGl2ZUVsZW1lbnQ6IGFueSwgZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gdm9pZCxcclxuICAgICAgdGhyb3R0bGVJbnRlcnZhbD86IG51bWJlcik6IEV2ZW50TGlzdGVuZXIge1xyXG4gICAgLy8gT25seSB1c2UgcGFzc2l2ZSBldmVudCBsaXN0ZW5lcnMgaWYgdGhlIGJyb3dzZXIgc3VwcG9ydHMgaXRcclxuICAgIGlmIChzdXBwb3J0c1Bhc3NpdmVFdmVudHMgIT09IHRydWUpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuYXR0YWNoRXZlbnRMaXN0ZW5lcihuYXRpdmVFbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrLCB0aHJvdHRsZUludGVydmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBbmd1bGFyIGRvZXNuJ3Qgc3VwcG9ydCBwYXNzaXZlIGV2ZW50IGhhbmRsZXJzICh5ZXQpLCBzbyB3ZSBuZWVkIHRvIHJvbGwgb3VyIG93biBjb2RlIHVzaW5nIG5hdGl2ZSBmdW5jdGlvbnNcclxuICAgIGNvbnN0IGxpc3RlbmVyOiBFdmVudExpc3RlbmVyID0gbmV3IEV2ZW50TGlzdGVuZXIoKTtcclxuICAgIGxpc3RlbmVyLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcclxuICAgIGxpc3RlbmVyLmV2ZW50cyA9IG5ldyBTdWJqZWN0PEV2ZW50PigpO1xyXG5cclxuICAgIGNvbnN0IG9ic2VydmVyQ2FsbGJhY2s6IChldmVudDogRXZlbnQpID0+IHZvaWQgPSAoZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxpc3RlbmVyLmV2ZW50cy5uZXh0KGV2ZW50KTtcclxuICAgIH07XHJcbiAgICBuYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvYnNlcnZlckNhbGxiYWNrLCB7cGFzc2l2ZTogdHJ1ZSwgY2FwdHVyZTogZmFsc2V9KTtcclxuXHJcbiAgICBsaXN0ZW5lci50ZWFyZG93bkNhbGxiYWNrID0gKCk6IHZvaWQgPT4ge1xyXG4gICAgICBuYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBvYnNlcnZlckNhbGxiYWNrLCB7cGFzc2l2ZTogdHJ1ZSwgY2FwdHVyZTogZmFsc2V9KTtcclxuICAgIH07XHJcblxyXG4gICAgbGlzdGVuZXIuZXZlbnRzU3Vic2NyaXB0aW9uID0gbGlzdGVuZXIuZXZlbnRzXHJcbiAgICAgIC5waXBlKCghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhyb3R0bGVJbnRlcnZhbCkpXHJcbiAgICAgICAgPyB0aHJvdHRsZVRpbWUodGhyb3R0bGVJbnRlcnZhbCwgdW5kZWZpbmVkLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlfSlcclxuICAgICAgICA6IHRhcCgoKSA9PiB7fSkgLy8gbm8tb3BcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICBjYWxsYmFjayhldmVudCk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBsaXN0ZW5lcjtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkZXRhY2hFdmVudExpc3RlbmVyKGV2ZW50TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZXZlbnRMaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIuZXZlbnRzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIuZXZlbnRzU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50TGlzdGVuZXIuZXZlbnRzKSkge1xyXG4gICAgICBldmVudExpc3RlbmVyLmV2ZW50cy5jb21wbGV0ZSgpO1xyXG4gICAgICBldmVudExpc3RlbmVyLmV2ZW50cyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChldmVudExpc3RlbmVyLnRlYXJkb3duQ2FsbGJhY2spKSB7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIudGVhcmRvd25DYWxsYmFjaygpO1xyXG4gICAgICBldmVudExpc3RlbmVyLnRlYXJkb3duQ2FsbGJhY2sgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHVibGljIGF0dGFjaEV2ZW50TGlzdGVuZXIobmF0aXZlRWxlbWVudDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiB2b2lkLFxyXG4gICAgICB0aHJvdHRsZUludGVydmFsPzogbnVtYmVyKTogRXZlbnRMaXN0ZW5lciB7XHJcbiAgICBjb25zdCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IG5ldyBFdmVudExpc3RlbmVyKCk7XHJcbiAgICBsaXN0ZW5lci5ldmVudE5hbWUgPSBldmVudE5hbWU7XHJcbiAgICBsaXN0ZW5lci5ldmVudHMgPSBuZXcgU3ViamVjdDxFdmVudD4oKTtcclxuXHJcbiAgICBjb25zdCBvYnNlcnZlckNhbGxiYWNrOiAoZXZlbnQ6IEV2ZW50KSA9PiB2b2lkID0gKGV2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsaXN0ZW5lci5ldmVudHMubmV4dChldmVudCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxpc3RlbmVyLnRlYXJkb3duQ2FsbGJhY2sgPSB0aGlzLnJlbmRlcmVyLmxpc3RlbihuYXRpdmVFbGVtZW50LCBldmVudE5hbWUsIG9ic2VydmVyQ2FsbGJhY2spO1xyXG5cclxuICAgIGxpc3RlbmVyLmV2ZW50c1N1YnNjcmlwdGlvbiA9IGxpc3RlbmVyLmV2ZW50c1xyXG4gICAgICAucGlwZSgoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRocm90dGxlSW50ZXJ2YWwpKVxyXG4gICAgICAgICAgPyB0aHJvdHRsZVRpbWUodGhyb3R0bGVJbnRlcnZhbCwgdW5kZWZpbmVkLCB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiB0cnVlfSlcclxuICAgICAgICAgIDogdGFwKCgpID0+IHt9KSAvLyBuby1vcFxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBFdmVudCkgPT4geyBjYWxsYmFjayhldmVudCk7IH0pO1xyXG5cclxuICAgIHJldHVybiBsaXN0ZW5lcjtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIEhvc3RCaW5kaW5nLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVySGVscGVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lci1oZWxwZXInO1xyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lcic7XHJcbmltcG9ydCB7IFZhbHVlSGVscGVyIH0gZnJvbSAnLi92YWx1ZS1oZWxwZXInO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbbmd4U2xpZGVyRWxlbWVudF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIHtcclxuICBwcml2YXRlIF9wb3NpdGlvbjogbnVtYmVyID0gMDtcclxuICBnZXQgcG9zaXRpb24oKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9wb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2RpbWVuc2lvbjogbnVtYmVyID0gMDtcclxuICBnZXQgZGltZW5zaW9uKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGltZW5zaW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfYWx3YXlzSGlkZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGdldCBhbHdheXNIaWRlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Fsd2F5c0hpZGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF92ZXJ0aWNhbDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIGdldCB2ZXJ0aWNhbCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLl92ZXJ0aWNhbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3NjYWxlOiBudW1iZXIgPSAxO1xyXG4gIGdldCBzY2FsZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NjYWxlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfcm90YXRlOiBudW1iZXIgPSAwO1xyXG4gIGdldCByb3RhdGUoKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9yb3RhdGU7XHJcbiAgfVxyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLm9wYWNpdHknKVxyXG4gIG9wYWNpdHk6IG51bWJlciA9IDE7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUudmlzaWJpbGl0eScpXHJcbiAgdmlzaWJpbGl0eTogc3RyaW5nID0gJ3Zpc2libGUnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmxlZnQnKVxyXG4gIGxlZnQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmJvdHRvbScpXHJcbiAgYm90dG9tOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS5oZWlnaHQnKVxyXG4gIGhlaWdodDogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUud2lkdGgnKVxyXG4gIHdpZHRoOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS50cmFuc2Zvcm0nKVxyXG4gIHRyYW5zZm9ybTogc3RyaW5nID0gJyc7XHJcblxyXG4gIHByaXZhdGUgZXZlbnRMaXN0ZW5lckhlbHBlcjogRXZlbnRMaXN0ZW5lckhlbHBlcjtcclxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJzOiBFdmVudExpc3RlbmVyW10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGVsZW1SZWY6IEVsZW1lbnRSZWYsIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLCBwcm90ZWN0ZWQgY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgdGhpcy5ldmVudExpc3RlbmVySGVscGVyID0gbmV3IEV2ZW50TGlzdGVuZXJIZWxwZXIodGhpcy5yZW5kZXJlcik7XHJcbiAgfVxyXG5cclxuICBzZXRBbHdheXNIaWRlKGhpZGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuX2Fsd2F5c0hpZGUgPSBoaWRlO1xyXG4gICAgaWYgKGhpZGUpIHtcclxuICAgICAgdGhpcy52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoaWRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5vcGFjaXR5ID0gMDtcclxuICB9XHJcblxyXG4gIHNob3coKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5hbHdheXNIaWRlKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm9wYWNpdHkgPSAxO1xyXG4gIH1cclxuXHJcbiAgaXNWaXNpYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHRoaXMuYWx3YXlzSGlkZSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5vcGFjaXR5ICE9PSAwO1xyXG4gIH1cclxuXHJcbiAgc2V0VmVydGljYWwodmVydGljYWw6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuX3ZlcnRpY2FsID0gdmVydGljYWw7XHJcbiAgICBpZiAodGhpcy5fdmVydGljYWwpIHtcclxuICAgICAgdGhpcy5sZWZ0ID0gJyc7XHJcbiAgICAgIHRoaXMud2lkdGggPSAnJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYm90dG9tID0gJyc7XHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gJyc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRTY2FsZShzY2FsZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLl9zY2FsZSA9IHNjYWxlO1xyXG4gIH1cclxuXHJcbiAgc2V0Um90YXRlKHJvdGF0ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLl9yb3RhdGUgPSByb3RhdGU7XHJcbiAgICB0aGlzLnRyYW5zZm9ybSA9ICdyb3RhdGUoJyArIHJvdGF0ZSArICdkZWcpJztcclxuICB9XHJcblxyXG4gIGdldFJvdGF0ZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0ZTtcclxuICB9XHJcblxyXG4gICAvLyBTZXQgZWxlbWVudCBsZWZ0L3RvcCBwb3NpdGlvbiBkZXBlbmRpbmcgb24gd2hldGhlciBzbGlkZXIgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxyXG4gIHNldFBvc2l0aW9uKHBvczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fcG9zaXRpb24gIT09IHBvcyAmJiAhdGhpcy5pc1JlZkRlc3Ryb3llZCgpKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3Bvc2l0aW9uID0gcG9zO1xyXG4gICAgaWYgKHRoaXMuX3ZlcnRpY2FsKSB7XHJcbiAgICAgIHRoaXMuYm90dG9tID0gTWF0aC5yb3VuZChwb3MpICsgJ3B4JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubGVmdCA9IE1hdGgucm91bmQocG9zKSArICdweCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBDYWxjdWxhdGUgZWxlbWVudCdzIHdpZHRoL2hlaWdodCBkZXBlbmRpbmcgb24gd2hldGhlciBzbGlkZXIgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxyXG4gIGNhbGN1bGF0ZURpbWVuc2lvbigpOiB2b2lkIHtcclxuICAgIGNvbnN0IHZhbDogQ2xpZW50UmVjdCA9IHRoaXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBpZiAodGhpcy52ZXJ0aWNhbCkge1xyXG4gICAgICB0aGlzLl9kaW1lbnNpb24gPSAodmFsLmJvdHRvbSAtIHZhbC50b3ApICogdGhpcy5zY2FsZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2RpbWVuc2lvbiA9ICh2YWwucmlnaHQgLSB2YWwubGVmdCkgKiB0aGlzLnNjYWxlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2V0IGVsZW1lbnQgd2lkdGgvaGVpZ2h0IGRlcGVuZGluZyBvbiB3aGV0aGVyIHNsaWRlciBpcyBob3Jpem9udGFsIG9yIHZlcnRpY2FsXHJcbiAgc2V0RGltZW5zaW9uKGRpbTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5fZGltZW5zaW9uICE9PSBkaW0gJiYgIXRoaXMuaXNSZWZEZXN0cm95ZWQoKSkge1xyXG4gICAgICB0aGlzLmNoYW5nZURldGVjdGlvblJlZi5tYXJrRm9yQ2hlY2soKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9kaW1lbnNpb24gPSBkaW07XHJcbiAgICBpZiAodGhpcy5fdmVydGljYWwpIHtcclxuICAgICAgdGhpcy5oZWlnaHQgPSBNYXRoLnJvdW5kKGRpbSkgKyAncHgnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy53aWR0aCA9IE1hdGgucm91bmQoZGltKSArICdweCc7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRCb3VuZGluZ0NsaWVudFJlY3QoKTogQ2xpZW50UmVjdCB7XHJcbiAgICByZXR1cm4gdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgfVxyXG5cclxuICBvbihldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiB2b2lkLCBkZWJvdW5jZUludGVydmFsPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBjb25zdCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hFdmVudExpc3RlbmVyKFxyXG4gICAgICB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaywgZGVib3VuY2VJbnRlcnZhbCk7XHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgb25QYXNzaXZlKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IHZvaWQsIGRlYm91bmNlSW50ZXJ2YWw/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyOiBFdmVudExpc3RlbmVyID0gdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmF0dGFjaFBhc3NpdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaywgZGVib3VuY2VJbnRlcnZhbCk7XHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gIH1cclxuXHJcbiAgb2ZmKGV2ZW50TmFtZT86IHN0cmluZyk6IHZvaWQge1xyXG4gICAgbGV0IGxpc3RlbmVyc1RvS2VlcDogRXZlbnRMaXN0ZW5lcltdO1xyXG4gICAgbGV0IGxpc3RlbmVyc1RvUmVtb3ZlOiBFdmVudExpc3RlbmVyW107XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50TmFtZSkpIHtcclxuICAgICAgbGlzdGVuZXJzVG9LZWVwID0gdGhpcy5ldmVudExpc3RlbmVycy5maWx0ZXIoKGV2ZW50OiBFdmVudExpc3RlbmVyKSA9PiBldmVudC5ldmVudE5hbWUgIT09IGV2ZW50TmFtZSk7XHJcbiAgICAgIGxpc3RlbmVyc1RvUmVtb3ZlID0gdGhpcy5ldmVudExpc3RlbmVycy5maWx0ZXIoKGV2ZW50OiBFdmVudExpc3RlbmVyKSA9PiBldmVudC5ldmVudE5hbWUgPT09IGV2ZW50TmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsaXN0ZW5lcnNUb0tlZXAgPSBbXTtcclxuICAgICAgbGlzdGVuZXJzVG9SZW1vdmUgPSB0aGlzLmV2ZW50TGlzdGVuZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgbGlzdGVuZXJzVG9SZW1vdmUpIHtcclxuICAgICAgdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmRldGFjaEV2ZW50TGlzdGVuZXIobGlzdGVuZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMgPSBsaXN0ZW5lcnNUb0tlZXA7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzUmVmRGVzdHJveWVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmKSB8fCB0aGlzLmNoYW5nZURldGVjdGlvblJlZlsnZGVzdHJveWVkJ107XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBIb3N0QmluZGluZywgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSB9IGZyb20gJy4vc2xpZGVyLWVsZW1lbnQuZGlyZWN0aXZlJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW25neFNsaWRlckhhbmRsZV0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTbGlkZXJIYW5kbGVEaXJlY3RpdmUgZXh0ZW5kcyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIHtcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLm5neC1zbGlkZXItYWN0aXZlJylcclxuICBhY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLnJvbGUnKVxyXG4gIHJvbGU6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIudGFiaW5kZXgnKVxyXG4gIHRhYmluZGV4OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtb3JpZW50YXRpb24nKVxyXG4gIGFyaWFPcmllbnRhdGlvbjogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWxhYmVsJylcclxuICBhcmlhTGFiZWw6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1sYWJlbGxlZGJ5JylcclxuICBhcmlhTGFiZWxsZWRCeTogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLXZhbHVlbm93JylcclxuICBhcmlhVmFsdWVOb3c6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS12YWx1ZXRleHQnKVxyXG4gIGFyaWFWYWx1ZVRleHQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS12YWx1ZW1pbicpXHJcbiAgYXJpYVZhbHVlTWluOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtdmFsdWVtYXgnKVxyXG4gIGFyaWFWYWx1ZU1heDogc3RyaW5nID0gJyc7XHJcblxyXG4gIGZvY3VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGVsZW1SZWY6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIsIGNoYW5nZURldGVjdGlvblJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcclxuICAgIHN1cGVyKGVsZW1SZWYsIHJlbmRlcmVyLCBjaGFuZ2VEZXRlY3Rpb25SZWYpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSB9IGZyb20gJy4vc2xpZGVyLWVsZW1lbnQuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgVmFsdWVIZWxwZXIgfSBmcm9tICcuL3ZhbHVlLWhlbHBlcic7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tuZ3hTbGlkZXJMYWJlbF0nXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTbGlkZXJMYWJlbERpcmVjdGl2ZSBleHRlbmRzIFNsaWRlckVsZW1lbnREaXJlY3RpdmUge1xyXG4gIHByaXZhdGUgX3ZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoZWxlbVJlZjogRWxlbWVudFJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMiwgY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgc3VwZXIoZWxlbVJlZiwgcmVuZGVyZXIsIGNoYW5nZURldGVjdGlvblJlZik7XHJcbiAgfVxyXG5cclxuICBzZXRWYWx1ZSh2YWx1ZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBsZXQgcmVjYWxjdWxhdGVEaW1lbnNpb246IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoIXRoaXMuYWx3YXlzSGlkZSAmJlxyXG4gICAgICAgIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZhbHVlKSB8fFxyXG4gICAgICAgICB0aGlzLnZhbHVlLmxlbmd0aCAhPT0gdmFsdWUubGVuZ3RoIHx8XHJcbiAgICAgICAgICh0aGlzLnZhbHVlLmxlbmd0aCA+IDAgJiYgdGhpcy5kaW1lbnNpb24gPT09IDApKSkge1xyXG4gICAgICByZWNhbGN1bGF0ZURpbWVuc2lvbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcclxuICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LmlubmVySFRNTCA9IHZhbHVlO1xyXG5cclxuICAgIC8vIFVwZGF0ZSBkaW1lbnNpb24gb25seSB3aGVuIGxlbmd0aCBvZiB0aGUgbGFiZWwgaGF2ZSBjaGFuZ2VkXHJcbiAgICBpZiAocmVjYWxjdWxhdGVEaW1lbnNpb24pIHtcclxuICAgICAgdGhpcy5jYWxjdWxhdGVEaW1lbnNpb24oKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIFZpZXdDaGlsZCxcclxuICBBZnRlclZpZXdJbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPbkRlc3Ryb3ksXHJcbiAgSG9zdEJpbmRpbmcsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIElucHV0LFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXIyLFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBPdXRwdXQsXHJcbiAgQ29udGVudENoaWxkLFxyXG4gIFRlbXBsYXRlUmVmLFxyXG4gIENoYW5nZURldGVjdG9yUmVmLFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgZm9yd2FyZFJlZixcclxuICBOZ1pvbmVcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcclxuXHJcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5cclxuaW1wb3J0IHsgc3VwcG9ydHNQYXNzaXZlRXZlbnRzIH0gZnJvbSAnZGV0ZWN0LXBhc3NpdmUtZXZlbnRzJztcclxuXHJcbmltcG9ydCB7XHJcbiAgT3B0aW9ucyxcclxuICBMYWJlbFR5cGUsXHJcbiAgVmFsdWVUb1Bvc2l0aW9uRnVuY3Rpb24sXHJcbiAgUG9zaXRpb25Ub1ZhbHVlRnVuY3Rpb24sXHJcbiAgQ3VzdG9tU3RlcERlZmluaXRpb25cclxufSBmcm9tICcuL29wdGlvbnMnO1xyXG5pbXBvcnQgeyBQb2ludGVyVHlwZSB9IGZyb20gJy4vcG9pbnRlci10eXBlJztcclxuaW1wb3J0IHsgQ2hhbmdlQ29udGV4dCB9IGZyb20gJy4vY2hhbmdlLWNvbnRleHQnO1xyXG5pbXBvcnQgeyBWYWx1ZUhlbHBlciB9IGZyb20gJy4vdmFsdWUtaGVscGVyJztcclxuaW1wb3J0IHsgQ29tcGF0aWJpbGl0eUhlbHBlciB9IGZyb20gJy4vY29tcGF0aWJpbGl0eS1oZWxwZXInO1xyXG5pbXBvcnQgeyBNYXRoSGVscGVyIH0gZnJvbSAnLi9tYXRoLWhlbHBlcic7XHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL2V2ZW50LWxpc3RlbmVyJztcclxuaW1wb3J0IHsgRXZlbnRMaXN0ZW5lckhlbHBlciB9IGZyb20gJy4vZXZlbnQtbGlzdGVuZXItaGVscGVyJztcclxuaW1wb3J0IHsgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSB9IGZyb20gJy4vc2xpZGVyLWVsZW1lbnQuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgU2xpZGVySGFuZGxlRGlyZWN0aXZlIH0gZnJvbSAnLi9zbGlkZXItaGFuZGxlLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IFNsaWRlckxhYmVsRGlyZWN0aXZlIH0gZnJvbSAnLi9zbGlkZXItbGFiZWwuZGlyZWN0aXZlJztcclxuXHJcbi8vIERlY2xhcmF0aW9uIGZvciBSZXNpemVPYnNlcnZlciBhIG5ldyBBUEkgYXZhaWxhYmxlIGluIHNvbWUgb2YgbmV3ZXN0IGJyb3dzZXJzOlxyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUmVzaXplT2JzZXJ2ZXJcclxuZGVjbGFyZSBjbGFzcyBSZXNpemVPYnNlcnZlciB7XHJcbiAgY29uc3RydWN0b3IoY2FsbGJhY2s6ICgpID0+IHZvaWQpO1xyXG4gIG9ic2VydmUodGFyZ2V0OiBhbnkpOiB2b2lkO1xyXG4gIHVub2JzZXJ2ZSh0YXJnZXQ6IGFueSk6IHZvaWQ7XHJcbiAgZGlzY29ubmVjdCgpOiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVGljayB7XHJcbiAgc2VsZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBzdHlsZTogYW55ID0ge307XHJcbiAgdG9vbHRpcDogc3RyaW5nID0gbnVsbDtcclxuICB0b29sdGlwUGxhY2VtZW50OiBzdHJpbmcgPSBudWxsO1xyXG4gIHZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gIHZhbHVlVG9vbHRpcDogc3RyaW5nID0gbnVsbDtcclxuICB2YWx1ZVRvb2x0aXBQbGFjZW1lbnQ6IHN0cmluZyA9IG51bGw7XHJcbiAgbGVnZW5kOiBzdHJpbmcgPSBudWxsO1xyXG59XHJcblxyXG5jbGFzcyBEcmFnZ2luZyB7XHJcbiAgYWN0aXZlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgdmFsdWU6IG51bWJlciA9IDA7XHJcbiAgZGlmZmVyZW5jZTogbnVtYmVyID0gMDtcclxuICBwb3NpdGlvbjogbnVtYmVyID0gMDtcclxuICBsb3dMaW1pdDogbnVtYmVyID0gMDtcclxuICBoaWdoTGltaXQ6IG51bWJlciA9IDA7XHJcbn1cclxuXHJcbmNsYXNzIE1vZGVsVmFsdWVzIHtcclxuICB2YWx1ZTogbnVtYmVyO1xyXG4gIGhpZ2hWYWx1ZTogbnVtYmVyO1xyXG5cclxuICBwdWJsaWMgc3RhdGljIGNvbXBhcmUoeD86IE1vZGVsVmFsdWVzLCB5PzogTW9kZWxWYWx1ZXMpOiBib29sZWFuIHtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh4KSAmJiBWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh5KSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoeCkgIT09IFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHkpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB4LnZhbHVlID09PSB5LnZhbHVlICYmIHguaGlnaFZhbHVlID09PSB5LmhpZ2hWYWx1ZTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIE1vZGVsQ2hhbmdlIGV4dGVuZHMgTW9kZWxWYWx1ZXMge1xyXG4gIC8vIEZsYWcgdXNlZCB0byBieS1wYXNzIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkgZmlsdGVyIG9uIGlucHV0IHZhbHVlc1xyXG4gIC8vIChzb21ldGltZXMgdGhlcmUgaXMgYSBuZWVkIHRvIHBhc3MgdmFsdWVzIHRocm91Z2ggZXZlbiB0aG91Z2ggdGhlIG1vZGVsIHZhbHVlcyBoYXZlIG5vdCBjaGFuZ2VkKVxyXG4gIGZvcmNlQ2hhbmdlOiBib29sZWFuO1xyXG5cclxuICBwdWJsaWMgc3RhdGljIGNvbXBhcmUoeD86IE1vZGVsQ2hhbmdlLCB5PzogTW9kZWxDaGFuZ2UpOiBib29sZWFuIHtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh4KSAmJiBWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh5KSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoeCkgIT09IFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHkpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB4LnZhbHVlID09PSB5LnZhbHVlICYmXHJcbiAgICAgICAgICAgeC5oaWdoVmFsdWUgPT09IHkuaGlnaFZhbHVlICYmXHJcbiAgICAgICAgICAgeC5mb3JjZUNoYW5nZSA9PT0geS5mb3JjZUNoYW5nZTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIElucHV0TW9kZWxDaGFuZ2UgZXh0ZW5kcyBNb2RlbENoYW5nZSB7XHJcbiAgaW50ZXJuYWxDaGFuZ2U6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNsYXNzIE91dHB1dE1vZGVsQ2hhbmdlIGV4dGVuZHMgTW9kZWxDaGFuZ2Uge1xyXG4gIHVzZXJFdmVudEluaXRpYXRlZDogYm9vbGVhbjtcclxufVxyXG5cclxuY29uc3QgTkdYX1NMSURFUl9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XHJcbiAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXHJcbiAgLyogdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBuby11c2UtYmVmb3JlLWRlY2xhcmUgKi9cclxuICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBTbGlkZXJDb21wb25lbnQpLFxyXG4gIG11bHRpOiB0cnVlLFxyXG59O1xyXG5cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LXNsaWRlcicsXHJcbiAgdGVtcGxhdGU6IGA8IS0tIC8vIDAgTGVmdCBzZWxlY3Rpb24gYmFyIG91dHNpZGUgdHdvIGhhbmRsZXMgLS0+XHJcbjxzcGFuIG5neFNsaWRlckVsZW1lbnQgI2xlZnRPdXRlclNlbGVjdGlvbkJhciBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJhci13cmFwcGVyIG5neC1zbGlkZXItbGVmdC1vdXQtc2VsZWN0aW9uXCI+XHJcbiAgPHNwYW4gY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXJcIj48L3NwYW4+XHJcbjwvc3Bhbj5cclxuPCEtLSAvLyAxIFJpZ2h0IHNlbGVjdGlvbiBiYXIgb3V0c2lkZSB0d28gaGFuZGxlcyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjcmlnaHRPdXRlclNlbGVjdGlvbkJhciBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJhci13cmFwcGVyIG5neC1zbGlkZXItcmlnaHQtb3V0LXNlbGVjdGlvblwiPlxyXG4gIDxzcGFuIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyXCI+PC9zcGFuPlxyXG48L3NwYW4+XHJcbjwhLS0gLy8gMiBUaGUgd2hvbGUgc2xpZGVyIGJhciAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjZnVsbEJhciBbY2xhc3Mubmd4LXNsaWRlci10cmFuc3BhcmVudF09XCJmdWxsQmFyVHJhbnNwYXJlbnRDbGFzc1wiIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyLXdyYXBwZXIgbmd4LXNsaWRlci1mdWxsLWJhclwiPlxyXG4gIDxzcGFuIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyXCI+PC9zcGFuPlxyXG48L3NwYW4+XHJcbjwhLS0gLy8gMyBTZWxlY3Rpb24gYmFyIGJldHdlZW4gdHdvIGhhbmRsZXMgLS0+XHJcbjxzcGFuIG5neFNsaWRlckVsZW1lbnQgI3NlbGVjdGlvbkJhciBbY2xhc3Mubmd4LXNsaWRlci1kcmFnZ2FibGVdPVwic2VsZWN0aW9uQmFyRHJhZ2dhYmxlQ2xhc3NcIiBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJhci13cmFwcGVyIG5neC1zbGlkZXItc2VsZWN0aW9uLWJhclwiPlxyXG4gIDxzcGFuIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyIG5neC1zbGlkZXItc2VsZWN0aW9uXCIgW25nU3R5bGVdPVwiYmFyU3R5bGVcIj48L3NwYW4+XHJcbjwvc3Bhbj5cclxuPCEtLSAvLyA0IExvdyBzbGlkZXIgaGFuZGxlIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJIYW5kbGUgI21pbkhhbmRsZSBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLXBvaW50ZXIgbmd4LXNsaWRlci1wb2ludGVyLW1pblwiIFtuZ1N0eWxlXT1taW5Qb2ludGVyU3R5bGU+PC9zcGFuPlxyXG48IS0tIC8vIDUgSGlnaCBzbGlkZXIgaGFuZGxlIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJIYW5kbGUgI21heEhhbmRsZSBbc3R5bGUuZGlzcGxheV09XCJyYW5nZSA/ICdpbmhlcml0JyA6ICdub25lJ1wiIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItcG9pbnRlciBuZ3gtc2xpZGVyLXBvaW50ZXItbWF4XCIgW25nU3R5bGVdPW1heFBvaW50ZXJTdHlsZT48L3NwYW4+XHJcbjwhLS0gLy8gNiBGbG9vciBsYWJlbCAtLT5cclxuPHNwYW4gbmd4U2xpZGVyTGFiZWwgI2Zsb29yTGFiZWwgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1idWJibGUgbmd4LXNsaWRlci1saW1pdCBuZ3gtc2xpZGVyLWZsb29yXCI+PC9zcGFuPlxyXG48IS0tIC8vIDcgQ2VpbGluZyBsYWJlbCAtLT5cclxuPHNwYW4gbmd4U2xpZGVyTGFiZWwgI2NlaWxMYWJlbCBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJ1YmJsZSBuZ3gtc2xpZGVyLWxpbWl0IG5neC1zbGlkZXItY2VpbFwiPjwvc3Bhbj5cclxuPCEtLSAvLyA4IExhYmVsIGFib3ZlIHRoZSBsb3cgc2xpZGVyIGhhbmRsZSAtLT5cclxuPHNwYW4gbmd4U2xpZGVyTGFiZWwgI21pbkhhbmRsZUxhYmVsIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYnViYmxlIG5neC1zbGlkZXItbW9kZWwtdmFsdWVcIj48L3NwYW4+XHJcbjwhLS0gLy8gOSBMYWJlbCBhYm92ZSB0aGUgaGlnaCBzbGlkZXIgaGFuZGxlIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjbWF4SGFuZGxlTGFiZWwgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1idWJibGUgbmd4LXNsaWRlci1tb2RlbC1oaWdoXCI+PC9zcGFuPlxyXG48IS0tIC8vIDEwIENvbWJpbmVkIHJhbmdlIGxhYmVsIHdoZW4gdGhlIHNsaWRlciBoYW5kbGVzIGFyZSBjbG9zZSBleC4gMTUgLSAxNyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyTGFiZWwgI2NvbWJpbmVkTGFiZWwgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1idWJibGUgbmd4LXNsaWRlci1jb21iaW5lZFwiPjwvc3Bhbj5cclxuPCEtLSAvLyAxMSBUaGUgdGlja3MgLS0+XHJcbjxzcGFuIG5neFNsaWRlckVsZW1lbnQgI3RpY2tzRWxlbWVudCBbaGlkZGVuXT1cIiFzaG93VGlja3NcIiBbY2xhc3Mubmd4LXNsaWRlci10aWNrcy12YWx1ZXMtdW5kZXJdPVwidGlja3NVbmRlclZhbHVlc0NsYXNzXCIgY2xhc3M9XCJuZ3gtc2xpZGVyLXRpY2tzXCI+XHJcbiAgPHNwYW4gKm5nRm9yPVwibGV0IHQgb2YgdGlja3NcIiBjbGFzcz1cIm5neC1zbGlkZXItdGlja1wiIFtuZ0NsYXNzXT1cInsnbmd4LXNsaWRlci1zZWxlY3RlZCc6IHQuc2VsZWN0ZWR9XCIgW25nU3R5bGVdPVwidC5zdHlsZVwiPlxyXG4gICAgPG5neC1zbGlkZXItdG9vbHRpcC13cmFwcGVyIFt0ZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIiBbdG9vbHRpcF09XCJ0LnRvb2x0aXBcIiBbcGxhY2VtZW50XT1cInQudG9vbHRpcFBsYWNlbWVudFwiPjwvbmd4LXNsaWRlci10b29sdGlwLXdyYXBwZXI+XHJcbiAgICA8bmd4LXNsaWRlci10b29sdGlwLXdyYXBwZXIgKm5nSWY9XCJ0LnZhbHVlICE9IG51bGxcIiBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLXRpY2stdmFsdWVcIlxyXG4gICAgICAgIFt0ZW1wbGF0ZV09XCJ0b29sdGlwVGVtcGxhdGVcIiBbdG9vbHRpcF09XCJ0LnZhbHVlVG9vbHRpcFwiIFtwbGFjZW1lbnRdPVwidC52YWx1ZVRvb2x0aXBQbGFjZW1lbnRcIiBbY29udGVudF09XCJ0LnZhbHVlXCI+PC9uZ3gtc2xpZGVyLXRvb2x0aXAtd3JhcHBlcj5cclxuICAgIDxzcGFuICpuZ0lmPVwidC5sZWdlbmQgIT0gbnVsbFwiIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItdGljay1sZWdlbmRcIiBbaW5uZXJIVE1MXT1cInQubGVnZW5kXCI+PC9zcGFuPlxyXG4gIDwvc3Bhbj5cclxuPC9zcGFuPmAsXHJcbiAgc3R5bGVzOiBbYDo6bmctZGVlcCAubmd4LXNsaWRlcntkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjpyZWxhdGl2ZTtoZWlnaHQ6NHB4O3dpZHRoOjEwMCU7bWFyZ2luOjM1cHggMCAxNXB4O3ZlcnRpY2FsLWFsaWduOm1pZGRsZTstd2Via2l0LXVzZXItc2VsZWN0Om5vbmU7LW1vei11c2VyLXNlbGVjdDpub25lOy1tcy11c2VyLXNlbGVjdDpub25lO3VzZXItc2VsZWN0Om5vbmU7dG91Y2gtYWN0aW9uOnBhbi15fTo6bmctZGVlcCAubmd4LXNsaWRlci53aXRoLWxlZ2VuZHttYXJnaW4tYm90dG9tOjQwcHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyW2Rpc2FibGVkXXtjdXJzb3I6bm90LWFsbG93ZWR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyW2Rpc2FibGVkXSAubmd4LXNsaWRlci1wb2ludGVye2N1cnNvcjpub3QtYWxsb3dlZDtiYWNrZ3JvdW5kLWNvbG9yOiNkOGUwZjN9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyW2Rpc2FibGVkXSAubmd4LXNsaWRlci1kcmFnZ2FibGV7Y3Vyc29yOm5vdC1hbGxvd2VkfTo6bmctZGVlcCAubmd4LXNsaWRlcltkaXNhYmxlZF0gLm5neC1zbGlkZXItc2VsZWN0aW9ue2JhY2tncm91bmQ6IzhiOTFhMn06Om5nLWRlZXAgLm5neC1zbGlkZXJbZGlzYWJsZWRdIC5uZ3gtc2xpZGVyLXRpY2t7Y3Vyc29yOm5vdC1hbGxvd2VkfTo6bmctZGVlcCAubmd4LXNsaWRlcltkaXNhYmxlZF0gLm5neC1zbGlkZXItdGljay5uZ3gtc2xpZGVyLXNlbGVjdGVke2JhY2tncm91bmQ6IzhiOTFhMn06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItc3Bhbnt3aGl0ZS1zcGFjZTpub3dyYXA7cG9zaXRpb246YWJzb2x1dGU7ZGlzcGxheTppbmxpbmUtYmxvY2t9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhc2V7d2lkdGg6MTAwJTtoZWlnaHQ6MTAwJTtwYWRkaW5nOjB9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhci13cmFwcGVye2xlZnQ6MDtib3gtc2l6aW5nOmJvcmRlci1ib3g7bWFyZ2luLXRvcDotMTZweDtwYWRkaW5nLXRvcDoxNnB4O3dpZHRoOjEwMCU7aGVpZ2h0OjMycHg7ei1pbmRleDoxfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1kcmFnZ2FibGV7Y3Vyc29yOm1vdmV9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhcntsZWZ0OjA7d2lkdGg6MTAwJTtoZWlnaHQ6NHB4O3otaW5kZXg6MTtiYWNrZ3JvdW5kOiNkOGUwZjM7Ym9yZGVyLXJhZGl1czoycHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhci13cmFwcGVyLm5neC1zbGlkZXItdHJhbnNwYXJlbnQgLm5neC1zbGlkZXItYmFye2JhY2tncm91bmQ6MCAwfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1iYXItd3JhcHBlci5uZ3gtc2xpZGVyLWxlZnQtb3V0LXNlbGVjdGlvbiAubmd4LXNsaWRlci1iYXJ7YmFja2dyb3VuZDojZGYwMDJkfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1iYXItd3JhcHBlci5uZ3gtc2xpZGVyLXJpZ2h0LW91dC1zZWxlY3Rpb24gLm5neC1zbGlkZXItYmFye2JhY2tncm91bmQ6IzAzYTY4OH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItc2VsZWN0aW9ue3otaW5kZXg6MjtiYWNrZ3JvdW5kOiMwZGI5ZjA7Ym9yZGVyLXJhZGl1czoycHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXBvaW50ZXJ7Y3Vyc29yOnBvaW50ZXI7d2lkdGg6MzJweDtoZWlnaHQ6MzJweDt0b3A6LTE0cHg7YmFja2dyb3VuZC1jb2xvcjojMGRiOWYwO3otaW5kZXg6Mztib3JkZXItcmFkaXVzOjE2cHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXBvaW50ZXI6YWZ0ZXJ7Y29udGVudDonJzt3aWR0aDo4cHg7aGVpZ2h0OjhweDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MTJweDtsZWZ0OjEycHg7Ym9yZGVyLXJhZGl1czo0cHg7YmFja2dyb3VuZDojZmZmfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1wb2ludGVyOmhvdmVyOmFmdGVye2JhY2tncm91bmQtY29sb3I6I2ZmZn06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItcG9pbnRlci5uZ3gtc2xpZGVyLWFjdGl2ZXt6LWluZGV4OjR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXBvaW50ZXIubmd4LXNsaWRlci1hY3RpdmU6YWZ0ZXJ7YmFja2dyb3VuZC1jb2xvcjojNDUxYWZmfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1idWJibGV7Y3Vyc29yOmRlZmF1bHQ7Ym90dG9tOjE2cHg7cGFkZGluZzoxcHggM3B4O2NvbG9yOiM1NTYzN2Q7Zm9udC1zaXplOjE2cHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJ1YmJsZS5uZ3gtc2xpZGVyLWxpbWl0e2NvbG9yOiM1NTYzN2R9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXRpY2tze2JveC1zaXppbmc6Ym9yZGVyLWJveDt3aWR0aDoxMDAlO2hlaWdodDowO3Bvc2l0aW9uOmFic29sdXRlO2xlZnQ6MDt0b3A6LTNweDttYXJnaW46MDt6LWluZGV4OjE7bGlzdC1zdHlsZTpub25lfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci10aWNrcy12YWx1ZXMtdW5kZXIgLm5neC1zbGlkZXItdGljay12YWx1ZXt0b3A6YXV0bztib3R0b206LTM2cHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXRpY2t7dGV4dC1hbGlnbjpjZW50ZXI7Y3Vyc29yOnBvaW50ZXI7d2lkdGg6MTBweDtoZWlnaHQ6MTBweDtiYWNrZ3JvdW5kOiNkOGUwZjM7Ym9yZGVyLXJhZGl1czo1MCU7cG9zaXRpb246YWJzb2x1dGU7dG9wOjA7bGVmdDowO21hcmdpbi1sZWZ0OjExcHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXRpY2submd4LXNsaWRlci1zZWxlY3RlZHtiYWNrZ3JvdW5kOiMwZGI5ZjB9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXRpY2stdmFsdWV7cG9zaXRpb246YWJzb2x1dGU7dG9wOi0zNHB4Oy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLDApO3RyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwwKX06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGljay1sZWdlbmR7cG9zaXRpb246YWJzb2x1dGU7dG9wOjI0cHg7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsMCk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLDApO21heC13aWR0aDo1MHB4O3doaXRlLXNwYWNlOm5vcm1hbH06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWx7cG9zaXRpb246cmVsYXRpdmU7d2lkdGg6NHB4O2hlaWdodDoxMDAlO21hcmdpbjowIDIwcHg7cGFkZGluZzowO3ZlcnRpY2FsLWFsaWduOmJhc2VsaW5lO3RvdWNoLWFjdGlvbjpwYW4teH06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItYmFzZXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3BhZGRpbmc6MH06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItYmFyLXdyYXBwZXJ7dG9wOmF1dG87bGVmdDowO21hcmdpbjowIDAgMCAtMTZweDtwYWRkaW5nOjAgMCAwIDE2cHg7aGVpZ2h0OjEwMCU7d2lkdGg6MzJweH06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItYmFye2JvdHRvbTowO2xlZnQ6YXV0bzt3aWR0aDo0cHg7aGVpZ2h0OjEwMCV9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLXBvaW50ZXJ7bGVmdDotMTRweCFpbXBvcnRhbnQ7dG9wOmF1dG87Ym90dG9tOjB9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLWJ1YmJsZXtsZWZ0OjE2cHghaW1wb3J0YW50O2JvdHRvbTowfTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci10aWNrc3toZWlnaHQ6MTAwJTt3aWR0aDowO2xlZnQ6LTNweDt0b3A6MDt6LWluZGV4OjF9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLXRpY2t7dmVydGljYWwtYWxpZ246bWlkZGxlO21hcmdpbi1sZWZ0OmF1dG87bWFyZ2luLXRvcDoxMXB4fTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci10aWNrLXZhbHVle2xlZnQ6MjRweDt0b3A6YXV0bzstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoMCwtMjglKTt0cmFuc2Zvcm06dHJhbnNsYXRlKDAsLTI4JSl9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLXRpY2stbGVnZW5ke3RvcDphdXRvO3JpZ2h0OjI0cHg7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKDAsLTI4JSk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgwLC0yOCUpO21heC13aWR0aDpub25lO3doaXRlLXNwYWNlOm5vd3JhcH06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItdGlja3MtdmFsdWVzLXVuZGVyIC5uZ3gtc2xpZGVyLXRpY2stdmFsdWV7Ym90dG9tOmF1dG87bGVmdDphdXRvO3JpZ2h0OjI0cHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyICp7dHJhbnNpdGlvbjpub25lfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLWJhci13cmFwcGVye3RyYW5zaXRpb246LjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1zZWxlY3Rpb257dHJhbnNpdGlvbjpiYWNrZ3JvdW5kLWNvbG9yIC4zcyBsaW5lYXJ9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLmFuaW1hdGUgLm5neC1zbGlkZXItcG9pbnRlcnt0cmFuc2l0aW9uOi4zcyBsaW5lYXJ9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLmFuaW1hdGUgLm5neC1zbGlkZXItcG9pbnRlcjphZnRlcnt0cmFuc2l0aW9uOi4zcyBsaW5lYXJ9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLmFuaW1hdGUgLm5neC1zbGlkZXItYnViYmxle3RyYW5zaXRpb246LjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1idWJibGUubmd4LXNsaWRlci1saW1pdHt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1idWJibGUubmd4LXNsaWRlci1jb21iaW5lZHt0cmFuc2l0aW9uOm9wYWNpdHkgLjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci10aWNre3RyYW5zaXRpb246YmFja2dyb3VuZC1jb2xvciAuM3MgbGluZWFyfWBdLFxyXG4gIGhvc3Q6IHsgY2xhc3M6ICduZ3gtc2xpZGVyJyB9LFxyXG4gIHByb3ZpZGVyczogW05HWF9TTElERVJfQ09OVFJPTF9WQUxVRV9BQ0NFU1NPUl1cclxufSlcclxuZXhwb3J0IGNsYXNzIFNsaWRlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcclxuICAvLyBNb2RlbCBmb3IgbG93IHZhbHVlIG9mIHNsaWRlci4gRm9yIHNpbXBsZSBzbGlkZXIsIHRoaXMgaXMgdGhlIG9ubHkgaW5wdXQuIEZvciByYW5nZSBzbGlkZXIsIHRoaXMgaXMgdGhlIGxvdyB2YWx1ZS5cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyB2YWx1ZTogbnVtYmVyID0gbnVsbDtcclxuICAvLyBPdXRwdXQgZm9yIGxvdyB2YWx1ZSBzbGlkZXIgdG8gc3VwcG9ydCB0d28td2F5IGJpbmRpbmdzXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIHZhbHVlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8bnVtYmVyPiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgLy8gTW9kZWwgZm9yIGhpZ2ggdmFsdWUgb2Ygc2xpZGVyLiBOb3QgdXNlZCBpbiBzaW1wbGUgc2xpZGVyLiBGb3IgcmFuZ2Ugc2xpZGVyLCB0aGlzIGlzIHRoZSBoaWdoIHZhbHVlLlxyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIGhpZ2hWYWx1ZTogbnVtYmVyID0gbnVsbDtcclxuICAvLyBPdXRwdXQgZm9yIGhpZ2ggdmFsdWUgc2xpZGVyIHRvIHN1cHBvcnQgdHdvLXdheSBiaW5kaW5nc1xyXG4gIEBPdXRwdXQoKVxyXG4gIHB1YmxpYyBoaWdoVmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBBbiBvYmplY3Qgd2l0aCBhbGwgdGhlIG90aGVyIG9wdGlvbnMgb2YgdGhlIHNsaWRlci5cclxuICAvLyBFYWNoIG9wdGlvbiBjYW4gYmUgdXBkYXRlZCBhdCBydW50aW1lIGFuZCB0aGUgc2xpZGVyIHdpbGwgYXV0b21hdGljYWxseSBiZSByZS1yZW5kZXJlZC5cclxuICBASW5wdXQoKVxyXG4gIHB1YmxpYyBvcHRpb25zOiBPcHRpb25zID0gbmV3IE9wdGlvbnMoKTtcclxuXHJcbiAgLy8gRXZlbnQgZW1pdHRlZCB3aGVuIHVzZXIgc3RhcnRzIGludGVyYWN0aW9uIHdpdGggdGhlIHNsaWRlclxyXG4gIEBPdXRwdXQoKVxyXG4gIHB1YmxpYyB1c2VyQ2hhbmdlU3RhcnQ6IEV2ZW50RW1pdHRlcjxDaGFuZ2VDb250ZXh0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgLy8gRXZlbnQgZW1pdHRlZCBvbiBlYWNoIGNoYW5nZSBjb21pbmcgZnJvbSB1c2VyIGludGVyYWN0aW9uXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIHVzZXJDaGFuZ2U6IEV2ZW50RW1pdHRlcjxDaGFuZ2VDb250ZXh0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgLy8gRXZlbnQgZW1pdHRlZCB3aGVuIHVzZXIgZmluaXNoZXMgaW50ZXJhY3Rpb24gd2l0aCB0aGUgc2xpZGVyXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIHVzZXJDaGFuZ2VFbmQ6IEV2ZW50RW1pdHRlcjxDaGFuZ2VDb250ZXh0PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgcHJpdmF0ZSBtYW51YWxSZWZyZXNoU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgLy8gSW5wdXQgZXZlbnQgdGhhdCB0cmlnZ2VycyBzbGlkZXIgcmVmcmVzaCAocmUtcG9zaXRpb25pbmcgb2Ygc2xpZGVyIGVsZW1lbnRzKVxyXG4gIEBJbnB1dCgpIHNldCBtYW51YWxSZWZyZXNoKG1hbnVhbFJlZnJlc2g6IEV2ZW50RW1pdHRlcjx2b2lkPikge1xyXG4gICAgdGhpcy51bnN1YnNjcmliZU1hbnVhbFJlZnJlc2goKTtcclxuXHJcbiAgICB0aGlzLm1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb24gPSBtYW51YWxSZWZyZXNoLnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5jYWxjdWxhdGVWaWV3RGltZW5zaW9uc0FuZERldGVjdENoYW5nZXMoKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdHJpZ2dlckZvY3VzU3Vic2NyaXB0aW9uOiBhbnk7XHJcbiAgLy8gSW5wdXQgZXZlbnQgdGhhdCB0cmlnZ2VycyBzZXR0aW5nIGZvY3VzIG9uIGdpdmVuIHNsaWRlciBoYW5kbGVcclxuICBASW5wdXQoKSBzZXQgdHJpZ2dlckZvY3VzKHRyaWdnZXJGb2N1czogRXZlbnRFbWl0dGVyPHZvaWQ+KSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlVHJpZ2dlckZvY3VzKCk7XHJcblxyXG4gICAgdGhpcy50cmlnZ2VyRm9jdXNTdWJzY3JpcHRpb24gPSB0cmlnZ2VyRm9jdXMuc3Vic2NyaWJlKChwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpID0+IHtcclxuICAgICAgdGhpcy5mb2N1c1BvaW50ZXIocG9pbnRlclR5cGUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBTbGlkZXIgdHlwZSwgdHJ1ZSBtZWFucyByYW5nZSBzbGlkZXJcclxuICBwdWJsaWMgZ2V0IHJhbmdlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZhbHVlKSAmJiAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5oaWdoVmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHRvIHRydWUgaWYgaW5pdCBtZXRob2QgYWxyZWFkeSBleGVjdXRlZFxyXG4gIHByaXZhdGUgaW5pdEhhc1J1bjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvLyBDaGFuZ2VzIGluIG1vZGVsIGlucHV0cyBhcmUgcGFzc2VkIHRocm91Z2ggdGhpcyBzdWJqZWN0XHJcbiAgLy8gVGhlc2UgYXJlIGFsbCBjaGFuZ2VzIGNvbWluZyBpbiBmcm9tIG91dHNpZGUgdGhlIGNvbXBvbmVudCB0aHJvdWdoIGlucHV0IGJpbmRpbmdzIG9yIHJlYWN0aXZlIGZvcm0gaW5wdXRzXHJcbiAgcHJpdmF0ZSBpbnB1dE1vZGVsQ2hhbmdlU3ViamVjdDogU3ViamVjdDxJbnB1dE1vZGVsQ2hhbmdlPiA9IG5ldyBTdWJqZWN0PElucHV0TW9kZWxDaGFuZ2U+KCk7XHJcbiAgcHJpdmF0ZSBpbnB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBudWxsO1xyXG5cclxuICAvLyBDaGFuZ2VzIHRvIG1vZGVsIG91dHB1dHMgYXJlIHBhc3NlZCB0aHJvdWdoIHRoaXMgc3ViamVjdFxyXG4gIC8vIFRoZXNlIGFyZSBhbGwgY2hhbmdlcyB0aGF0IG5lZWQgdG8gYmUgY29tbXVuaWNhdGVkIHRvIG91dHB1dCBlbWl0dGVycyBhbmQgcmVnaXN0ZXJlZCBjYWxsYmFja3NcclxuICBwcml2YXRlIG91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdDogU3ViamVjdDxPdXRwdXRNb2RlbENoYW5nZT4gPSBuZXcgU3ViamVjdDxPdXRwdXRNb2RlbENoYW5nZT4oKTtcclxuICBwcml2YXRlIG91dHB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBudWxsO1xyXG5cclxuICAvLyBMb3cgdmFsdWUgc3luY2VkIHRvIG1vZGVsIGxvdyB2YWx1ZVxyXG4gIHByaXZhdGUgdmlld0xvd1ZhbHVlOiBudW1iZXIgPSBudWxsO1xyXG4gIC8vIEhpZ2ggdmFsdWUgc3luY2VkIHRvIG1vZGVsIGhpZ2ggdmFsdWVcclxuICBwcml2YXRlIHZpZXdIaWdoVmFsdWU6IG51bWJlciA9IG51bGw7XHJcbiAgLy8gT3B0aW9ucyBzeW5jZWQgdG8gbW9kZWwgb3B0aW9ucywgYmFzZWQgb24gZGVmYXVsdHNcclxuICBwcml2YXRlIHZpZXdPcHRpb25zOiBPcHRpb25zID0gbmV3IE9wdGlvbnMoKTtcclxuXHJcbiAgLy8gSGFsZiBvZiB0aGUgd2lkdGggb3IgaGVpZ2h0IG9mIHRoZSBzbGlkZXIgaGFuZGxlc1xyXG4gIHByaXZhdGUgaGFuZGxlSGFsZkRpbWVuc2lvbjogbnVtYmVyID0gMDtcclxuICAvLyBNYXhpbXVtIHBvc2l0aW9uIHRoZSBzbGlkZXIgaGFuZGxlIGNhbiBoYXZlXHJcbiAgcHJpdmF0ZSBtYXhIYW5kbGVQb3NpdGlvbjogbnVtYmVyID0gMDtcclxuXHJcbiAgLy8gV2hpY2ggaGFuZGxlIGlzIGN1cnJlbnRseSB0cmFja2VkIGZvciBtb3ZlIGV2ZW50c1xyXG4gIHByaXZhdGUgY3VycmVudFRyYWNraW5nUG9pbnRlcjogUG9pbnRlclR5cGUgPSBudWxsO1xyXG4gIC8vIEludGVybmFsIHZhcmlhYmxlIHRvIGtlZXAgdHJhY2sgb2YgdGhlIGZvY3VzIGVsZW1lbnRcclxuICBwcml2YXRlIGN1cnJlbnRGb2N1c1BvaW50ZXI6IFBvaW50ZXJUeXBlID0gbnVsbDtcclxuICAvLyBVc2VkIHRvIGNhbGwgb25TdGFydCBvbiB0aGUgZmlyc3Qga2V5ZG93biBldmVudFxyXG4gIHByaXZhdGUgZmlyc3RLZXlEb3duOiBib29sZWFuID0gZmFsc2U7XHJcbiAgLy8gQ3VycmVudCB0b3VjaCBpZCBvZiB0b3VjaCBldmVudCBiZWluZyBoYW5kbGVkXHJcbiAgcHJpdmF0ZSB0b3VjaElkOiBudW1iZXIgPSBudWxsO1xyXG4gIC8vIFZhbHVlcyByZWNvcmRlZCB3aGVuIGZpcnN0IGRyYWdnaW5nIHRoZSBiYXJcclxuICBwcml2YXRlIGRyYWdnaW5nOiBEcmFnZ2luZyA9IG5ldyBEcmFnZ2luZygpO1xyXG5cclxuICAvKiBTbGlkZXIgRE9NIGVsZW1lbnRzICovXHJcblxyXG4gIC8vIExlZnQgc2VsZWN0aW9uIGJhciBvdXRzaWRlIHR3byBoYW5kbGVzXHJcbiAgQFZpZXdDaGlsZCgnbGVmdE91dGVyU2VsZWN0aW9uQmFyJywge3JlYWQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgbGVmdE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZTtcclxuXHJcbiAgLy8gUmlnaHQgc2VsZWN0aW9uIGJhciBvdXRzaWRlIHR3byBoYW5kbGVzXHJcbiAgQFZpZXdDaGlsZCgncmlnaHRPdXRlclNlbGVjdGlvbkJhcicsIHtyZWFkOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlfSlcclxuICBwcml2YXRlIHJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50OiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlO1xyXG5cclxuICAvLyBUaGUgd2hvbGUgc2xpZGVyIGJhclxyXG4gIEBWaWV3Q2hpbGQoJ2Z1bGxCYXInLCB7cmVhZDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBmdWxsQmFyRWxlbWVudDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZTtcclxuXHJcbiAgLy8gSGlnaGxpZ2h0IGJldHdlZW4gdHdvIGhhbmRsZXNcclxuICBAVmlld0NoaWxkKCdzZWxlY3Rpb25CYXInLCB7cmVhZDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBzZWxlY3Rpb25CYXJFbGVtZW50OiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlO1xyXG5cclxuICAvLyBMZWZ0IHNsaWRlciBoYW5kbGVcclxuICBAVmlld0NoaWxkKCdtaW5IYW5kbGUnLCB7cmVhZDogU2xpZGVySGFuZGxlRGlyZWN0aXZlfSlcclxuICBwcml2YXRlIG1pbkhhbmRsZUVsZW1lbnQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZTtcclxuXHJcbiAgLy8gUmlnaHQgc2xpZGVyIGhhbmRsZVxyXG4gIEBWaWV3Q2hpbGQoJ21heEhhbmRsZScsIHtyZWFkOiBTbGlkZXJIYW5kbGVEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgbWF4SGFuZGxlRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlO1xyXG5cclxuICAvLyBGbG9vciBsYWJlbFxyXG4gIEBWaWV3Q2hpbGQoJ2Zsb29yTGFiZWwnLCB7cmVhZDogU2xpZGVyTGFiZWxEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgZmxvb3JMYWJlbEVsZW1lbnQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlO1xyXG5cclxuICAvLyBDZWlsaW5nIGxhYmVsXHJcbiAgQFZpZXdDaGlsZCgnY2VpbExhYmVsJywge3JlYWQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlfSlcclxuICBwcml2YXRlIGNlaWxMYWJlbEVsZW1lbnQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlO1xyXG5cclxuICAvLyBMYWJlbCBhYm92ZSB0aGUgbG93IHZhbHVlXHJcbiAgQFZpZXdDaGlsZCgnbWluSGFuZGxlTGFiZWwnLCB7cmVhZDogU2xpZGVyTGFiZWxEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgbWluSGFuZGxlTGFiZWxFbGVtZW50OiBTbGlkZXJMYWJlbERpcmVjdGl2ZTtcclxuXHJcbiAgLy8gTGFiZWwgYWJvdmUgdGhlIGhpZ2ggdmFsdWVcclxuICBAVmlld0NoaWxkKCdtYXhIYW5kbGVMYWJlbCcsIHtyZWFkOiBTbGlkZXJMYWJlbERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBtYXhIYW5kbGVMYWJlbEVsZW1lbnQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlO1xyXG5cclxuICAvLyBDb21iaW5lZCBsYWJlbFxyXG4gIEBWaWV3Q2hpbGQoJ2NvbWJpbmVkTGFiZWwnLCB7cmVhZDogU2xpZGVyTGFiZWxEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgY29tYmluZWRMYWJlbEVsZW1lbnQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlO1xyXG5cclxuICAvLyBUaGUgdGlja3NcclxuICBAVmlld0NoaWxkKCd0aWNrc0VsZW1lbnQnLCB7cmVhZDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSB0aWNrc0VsZW1lbnQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmU7XHJcblxyXG4gIC8vIE9wdGlvbmFsIGN1c3RvbSB0ZW1wbGF0ZSBmb3IgZGlzcGxheWluZyB0b29sdGlwc1xyXG4gIEBDb250ZW50Q2hpbGQoJ3Rvb2x0aXBUZW1wbGF0ZScpXHJcbiAgcHVibGljIHRvb2x0aXBUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgLy8gSG9zdCBlbGVtZW50IGNsYXNzIGJpbmRpbmdzXHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy52ZXJ0aWNhbCcpXHJcbiAgcHVibGljIHNsaWRlckVsZW1lbnRWZXJ0aWNhbENsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy5hbmltYXRlJylcclxuICBwdWJsaWMgc2xpZGVyRWxlbWVudEFuaW1hdGVDbGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIEBIb3N0QmluZGluZygnY2xhc3Mud2l0aC1sZWdlbmQnKVxyXG4gIHB1YmxpYyBzbGlkZXJFbGVtZW50V2l0aExlZ2VuZENsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmRpc2FibGVkJylcclxuICBwdWJsaWMgc2xpZGVyRWxlbWVudERpc2FibGVkQXR0cjogc3RyaW5nID0gbnVsbDtcclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1sYWJlbCcpXHJcbiAgcHVibGljIHNsaWRlckVsZW1lbnRBcmlhTGFiZWw6IHN0cmluZyA9ICduZ3gtc2xpZGVyJztcclxuXHJcbiAgLy8gQ1NTIHN0eWxlcyBhbmQgY2xhc3MgZmxhZ3NcclxuICBwdWJsaWMgYmFyU3R5bGU6IGFueSA9IHt9O1xyXG4gIHB1YmxpYyBtaW5Qb2ludGVyU3R5bGU6IGFueSA9IHt9O1xyXG4gIHB1YmxpYyBtYXhQb2ludGVyU3R5bGU6IGFueSA9IHt9O1xyXG4gIHB1YmxpYyBmdWxsQmFyVHJhbnNwYXJlbnRDbGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBzZWxlY3Rpb25CYXJEcmFnZ2FibGVDbGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyB0aWNrc1VuZGVyVmFsdWVzQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLy8gV2hldGhlciB0byBzaG93L2hpZGUgdGlja3NcclxuICBwdWJsaWMgZ2V0IHNob3dUaWNrcygpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrcztcclxuICB9XHJcblxyXG4gIC8qIElmIHRpY2tTdGVwIGlzIHNldCBvciB0aWNrc0FycmF5IGlzIHNwZWNpZmllZC5cclxuICAgICBJbiB0aGlzIGNhc2UsIHRpY2tzIHZhbHVlcyBzaG91bGQgYmUgZGlzcGxheWVkIGJlbG93IHRoZSBzbGlkZXIuICovXHJcbiAgcHJpdmF0ZSBpbnRlcm1lZGlhdGVUaWNrczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIC8vIFRpY2tzIGFycmF5IGFzIGRpc3BsYXllZCBpbiB2aWV3XHJcbiAgcHVibGljIHRpY2tzOiBUaWNrW10gPSBbXTtcclxuXHJcbiAgLy8gRXZlbnQgbGlzdGVuZXJzXHJcbiAgcHJpdmF0ZSBldmVudExpc3RlbmVySGVscGVyOiBFdmVudExpc3RlbmVySGVscGVyID0gbnVsbDtcclxuICBwcml2YXRlIG9uTW92ZUV2ZW50TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSBudWxsO1xyXG4gIHByaXZhdGUgb25FbmRFdmVudExpc3RlbmVyOiBFdmVudExpc3RlbmVyID0gbnVsbDtcclxuICAvLyBXaGV0aGVyIGN1cnJlbnRseSBtb3ZpbmcgdGhlIHNsaWRlciAoYmV0d2VlbiBvblN0YXJ0KCkgYW5kIG9uRW5kKCkpXHJcbiAgcHJpdmF0ZSBtb3Zpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLy8gT2JzZXJ2ZXIgZm9yIHNsaWRlciBlbGVtZW50IHJlc2l6ZSBldmVudHNcclxuICBwcml2YXRlIHJlc2l6ZU9ic2VydmVyOiBSZXNpemVPYnNlcnZlciA9IG51bGw7XHJcblxyXG4gIC8vIENhbGxiYWNrcyBmb3IgcmVhY3RpdmUgZm9ybXMgc3VwcG9ydFxyXG4gIHByaXZhdGUgb25Ub3VjaGVkQ2FsbGJhY2s6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gbnVsbDtcclxuICBwcml2YXRlIG9uQ2hhbmdlQ2FsbGJhY2s6ICh2YWx1ZTogYW55KSA9PiB2b2lkID0gbnVsbDtcclxuXHJcblxyXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcclxuICAgICAgICAgICAgICBwcml2YXRlIHpvbmU6IE5nWm9uZSkge1xyXG4gICAgdGhpcy5ldmVudExpc3RlbmVySGVscGVyID0gbmV3IEV2ZW50TGlzdGVuZXJIZWxwZXIodGhpcy5yZW5kZXJlcik7XHJcbiAgfVxyXG5cclxuICAvLyBPbkluaXQgaW50ZXJmYWNlXHJcbiAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucyA9IG5ldyBPcHRpb25zKCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMudmlld09wdGlvbnMsIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgLy8gV2UgbmVlZCB0byBydW4gdGhlc2UgdHdvIHRoaW5ncyBmaXJzdCwgYmVmb3JlIHRoZSByZXN0IG9mIHRoZSBpbml0IGluIG5nQWZ0ZXJWaWV3SW5pdCgpLFxyXG4gICAgLy8gYmVjYXVzZSB0aGVzZSB0d28gc2V0dGluZ3MgYXJlIHNldCB0aHJvdWdoIEBIb3N0QmluZGluZyBhbmQgQW5ndWxhciBjaGFuZ2UgZGV0ZWN0aW9uXHJcbiAgICAvLyBtZWNoYW5pc20gZG9lc24ndCBsaWtlIHRoZW0gY2hhbmdpbmcgaW4gbmdBZnRlclZpZXdJbml0KClcclxuXHJcbiAgICB0aGlzLnVwZGF0ZURpc2FibGVkU3RhdGUoKTtcclxuICAgIHRoaXMudXBkYXRlVmVydGljYWxTdGF0ZSgpO1xyXG4gICAgdGhpcy51cGRhdGVBcmlhTGFiZWwoKTtcclxuICB9XHJcblxyXG4gIC8vIEFmdGVyVmlld0luaXQgaW50ZXJmYWNlXHJcbiAgcHVibGljIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuYXBwbHlPcHRpb25zKCk7XHJcblxyXG4gICAgdGhpcy5zdWJzY3JpYmVJbnB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpO1xyXG4gICAgdGhpcy5zdWJzY3JpYmVPdXRwdXRNb2RlbENoYW5nZVN1YmplY3QoKTtcclxuXHJcbiAgICAvLyBPbmNlIHdlIGFwcGx5IG9wdGlvbnMsIHdlIG5lZWQgdG8gbm9ybWFsaXNlIG1vZGVsIHZhbHVlcyBmb3IgdGhlIGZpcnN0IHRpbWVcclxuICAgIHRoaXMucmVub3JtYWxpc2VNb2RlbFZhbHVlcygpO1xyXG5cclxuICAgIHRoaXMudmlld0xvd1ZhbHVlID0gdGhpcy5tb2RlbFZhbHVlVG9WaWV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZSh0aGlzLmhpZ2hWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlVmVydGljYWxTdGF0ZSgpOyAvLyBuZWVkIHRvIHJ1biB0aGlzIGFnYWluIHRvIGNvdmVyIGNoYW5nZXMgdG8gc2xpZGVyIGVsZW1lbnRzXHJcbiAgICB0aGlzLm1hbmFnZUVsZW1lbnRzU3R5bGUoKTtcclxuICAgIHRoaXMudXBkYXRlRGlzYWJsZWRTdGF0ZSgpO1xyXG4gICAgdGhpcy5jYWxjdWxhdGVWaWV3RGltZW5zaW9ucygpO1xyXG4gICAgdGhpcy5hZGRBY2Nlc3NpYmlsaXR5KCk7XHJcbiAgICB0aGlzLnVwZGF0ZUNlaWxMYWJlbCgpO1xyXG4gICAgdGhpcy51cGRhdGVGbG9vckxhYmVsKCk7XHJcbiAgICB0aGlzLmluaXRIYW5kbGVzKCk7XHJcbiAgICB0aGlzLm1hbmFnZUV2ZW50c0JpbmRpbmdzKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUFyaWFMYWJlbCgpO1xyXG5cclxuICAgIHRoaXMuc3Vic2NyaWJlUmVzaXplT2JzZXJ2ZXIoKTtcclxuXHJcbiAgICB0aGlzLmluaXRIYXNSdW4gPSB0cnVlO1xyXG5cclxuICAgIC8vIFJ1biBjaGFuZ2UgZGV0ZWN0aW9uIG1hbnVhbGx5IHRvIHJlc29sdmUgc29tZSBpc3N1ZXMgd2hlbiBpbml0IHByb2NlZHVyZSBjaGFuZ2VzIHZhbHVlcyB1c2VkIGluIHRoZSB2aWV3XHJcbiAgICBpZiAoIXRoaXMuaXNSZWZEZXN0cm95ZWQoKSkge1xyXG4gICAgICB0aGlzLmNoYW5nZURldGVjdGlvblJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBPbkNoYW5nZXMgaW50ZXJmYWNlXHJcbiAgcHVibGljIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIC8vIEFsd2F5cyBhcHBseSBvcHRpb25zIGZpcnN0XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGNoYW5nZXMub3B0aW9ucykgJiZcclxuICAgICBKU09OLnN0cmluZ2lmeShjaGFuZ2VzLm9wdGlvbnMucHJldmlvdXNWYWx1ZSkgIT09IEpTT04uc3RyaW5naWZ5KGNoYW5nZXMub3B0aW9ucy5jdXJyZW50VmFsdWUpKSB7XHJcbiAgICAgIHRoaXMub25DaGFuZ2VPcHRpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhlbiB2YWx1ZSBjaGFuZ2VzXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGNoYW5nZXMudmFsdWUpIHx8XHJcbiAgICAgICAgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGNoYW5nZXMuaGlnaFZhbHVlKSkge1xyXG4gICAgICB0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxyXG4gICAgICAgIGhpZ2hWYWx1ZTogdGhpcy5oaWdoVmFsdWUsXHJcbiAgICAgICAgZm9yY2VDaGFuZ2U6IGZhbHNlLFxyXG4gICAgICAgIGludGVybmFsQ2hhbmdlOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE9uRGVzdHJveSBpbnRlcmZhY2VcclxuICBwdWJsaWMgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnVuYmluZEV2ZW50cygpO1xyXG5cclxuICAgIHRoaXMudW5zdWJzY3JpYmVSZXNpemVPYnNlcnZlcigpO1xyXG4gICAgdGhpcy51bnN1YnNjcmliZUlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlT3V0cHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlTWFudWFsUmVmcmVzaCgpO1xyXG4gICAgdGhpcy51bnN1YnNjcmliZVRyaWdnZXJGb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXHJcbiAgcHVibGljIHdyaXRlVmFsdWUob2JqOiBhbnkpOiB2b2lkIHtcclxuICAgIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICB0aGlzLnZhbHVlID0gb2JqWzBdO1xyXG4gICAgICB0aGlzLmhpZ2hWYWx1ZSA9IG9ialsxXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSBvYmo7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbmdPbkNoYW5nZXMoKSBpcyBub3QgY2FsbGVkIGluIHRoaXMgaW5zdGFuY2UsIHNvIHdlIG5lZWQgdG8gY29tbXVuaWNhdGUgdGhlIGNoYW5nZSBtYW51YWxseVxyXG4gICAgdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3ViamVjdC5uZXh0KHtcclxuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgIGhpZ2hWYWx1ZTogdGhpcy5oaWdoVmFsdWUsXHJcbiAgICAgIGZvcmNlQ2hhbmdlOiBmYWxzZSxcclxuICAgICAgaW50ZXJuYWxDaGFuZ2U6IGZhbHNlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gIHB1YmxpYyByZWdpc3Rlck9uQ2hhbmdlKG9uQ2hhbmdlQ2FsbGJhY2s6IGFueSk6IHZvaWQge1xyXG4gICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrID0gb25DaGFuZ2VDYWxsYmFjaztcclxuICB9XHJcblxyXG4gIC8vIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gIHB1YmxpYyByZWdpc3Rlck9uVG91Y2hlZChvblRvdWNoZWRDYWxsYmFjazogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrID0gb25Ub3VjaGVkQ2FsbGJhY2s7XHJcbiAgfVxyXG5cclxuICAvLyBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcclxuICBwdWJsaWMgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLmRpc2FibGVkID0gaXNEaXNhYmxlZDtcclxuICAgIHRoaXMudXBkYXRlRGlzYWJsZWRTdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIHNldEFyaWFMYWJlbChhcmlhTGFiZWw6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWwgPSBhcmlhTGFiZWw7XHJcbiAgICB0aGlzLnVwZGF0ZUFyaWFMYWJlbCgpO1xyXG4gIH1cclxuXHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzpyZXNpemUnLCBbJyRldmVudCddKVxyXG4gIHB1YmxpYyBvblJlc2l6ZShldmVudDogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zQW5kRGV0ZWN0Q2hhbmdlcygpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdWJzY3JpYmVJbnB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpOiB2b2lkIHtcclxuICAgIHRoaXMuaW5wdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbiA9IHRoaXMuaW5wdXRNb2RlbENoYW5nZVN1YmplY3RcclxuICAgIC5waXBlKFxyXG4gICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZChNb2RlbENoYW5nZS5jb21wYXJlKSxcclxuICAgICAgLy8gSGFjayB0byByZXNldCB0aGUgc3RhdHVzIG9mIHRoZSBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpIC0gaWYgYSBcImZha2VcIiBldmVudCBjb21lcyB0aHJvdWdoIHdpdGggZm9yY2VDaGFuZ2U9dHJ1ZSxcclxuICAgICAgLy8gd2UgZm9yY2VmdWxseSBieS1wYXNzIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIGJ1dCBvdGhlcndpc2UgZHJvcCB0aGUgZXZlbnRcclxuICAgICAgZmlsdGVyKChtb2RlbENoYW5nZTogSW5wdXRNb2RlbENoYW5nZSkgPT4gIW1vZGVsQ2hhbmdlLmZvcmNlQ2hhbmdlICYmICFtb2RlbENoYW5nZS5pbnRlcm5hbENoYW5nZSlcclxuICAgIClcclxuICAgIC5zdWJzY3JpYmUoKG1vZGVsQ2hhbmdlOiBJbnB1dE1vZGVsQ2hhbmdlKSA9PiB0aGlzLmFwcGx5SW5wdXRNb2RlbENoYW5nZShtb2RlbENoYW5nZSkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBzdWJzY3JpYmVPdXRwdXRNb2RlbENoYW5nZVN1YmplY3QoKTogdm9pZCB7XHJcbiAgICB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YmplY3RcclxuICAgICAgLnBpcGUoXHJcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoTW9kZWxDaGFuZ2UuY29tcGFyZSlcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKChtb2RlbENoYW5nZTogT3V0cHV0TW9kZWxDaGFuZ2UpID0+IHRoaXMucHVibGlzaE91dHB1dE1vZGVsQ2hhbmdlKG1vZGVsQ2hhbmdlKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1YnNjcmliZVJlc2l6ZU9ic2VydmVyKCk6IHZvaWQge1xyXG4gICAgaWYgKENvbXBhdGliaWxpdHlIZWxwZXIuaXNSZXNpemVPYnNlcnZlckF2YWlsYWJsZSgpKSB7XHJcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKCk6IHZvaWQgPT4gdGhpcy5jYWxjdWxhdGVWaWV3RGltZW5zaW9uc0FuZERldGVjdENoYW5nZXMoKSk7XHJcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVuc3Vic2NyaWJlUmVzaXplT2JzZXJ2ZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoQ29tcGF0aWJpbGl0eUhlbHBlci5pc1Jlc2l6ZU9ic2VydmVyQXZhaWxhYmxlKCkgJiYgdGhpcy5yZXNpemVPYnNlcnZlciAhPT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcclxuICAgICAgdGhpcy5yZXNpemVPYnNlcnZlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVuc3Vic2NyaWJlT25Nb3ZlKCk6IHZvaWQge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLm9uTW92ZUV2ZW50TGlzdGVuZXIpKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5kZXRhY2hFdmVudExpc3RlbmVyKHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lcik7XHJcbiAgICAgIHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVuc3Vic2NyaWJlT25FbmQoKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMub25FbmRFdmVudExpc3RlbmVyKSkge1xyXG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuZGV0YWNoRXZlbnRMaXN0ZW5lcih0aGlzLm9uRW5kRXZlbnRMaXN0ZW5lcik7XHJcbiAgICAgIHRoaXMub25FbmRFdmVudExpc3RlbmVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVJbnB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uKSkge1xyXG4gICAgICB0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVPdXRwdXRNb2RlbENoYW5nZVN1YmplY3QoKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMub3V0cHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIHRoaXMub3V0cHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgdGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVuc3Vic2NyaWJlTWFudWFsUmVmcmVzaCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5tYW51YWxSZWZyZXNoU3Vic2NyaXB0aW9uKSkge1xyXG4gICAgICB0aGlzLm1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgdGhpcy5tYW51YWxSZWZyZXNoU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVUcmlnZ2VyRm9jdXMoKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudHJpZ2dlckZvY3VzU3Vic2NyaXB0aW9uKSkge1xyXG4gICAgICB0aGlzLnRyaWdnZXJGb2N1c1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLnRyaWdnZXJGb2N1c1N1YnNjcmlwdGlvbiA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFBvaW50ZXJFbGVtZW50KHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSk6IFNsaWRlckhhbmRsZURpcmVjdGl2ZSB7XHJcbiAgICBpZiAocG9pbnRlclR5cGUgPT09IFBvaW50ZXJUeXBlLk1pbikge1xyXG4gICAgICByZXR1cm4gdGhpcy5taW5IYW5kbGVFbGVtZW50O1xyXG4gICAgfSBlbHNlIGlmIChwb2ludGVyVHlwZSA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1heEhhbmRsZUVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Q3VycmVudFRyYWNraW5nVmFsdWUoKTogbnVtYmVyIHtcclxuICAgIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbikge1xyXG4gICAgICByZXR1cm4gdGhpcy52aWV3TG93VmFsdWU7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdIaWdoVmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbW9kZWxWYWx1ZVRvVmlld1ZhbHVlKG1vZGVsVmFsdWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQobW9kZWxWYWx1ZSkpIHtcclxuICAgICAgcmV0dXJuIE5hTjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheSkgJiYgIXRoaXMudmlld09wdGlvbnMuYmluZEluZGV4Rm9yU3RlcHNBcnJheSkge1xyXG4gICAgICByZXR1cm4gVmFsdWVIZWxwZXIuZmluZFN0ZXBJbmRleCgrbW9kZWxWYWx1ZSwgdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KTtcclxuICAgIH1cclxuICAgIHJldHVybiArbW9kZWxWYWx1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgdmlld1ZhbHVlVG9Nb2RlbFZhbHVlKHZpZXdWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KSAmJiAhdGhpcy52aWV3T3B0aW9ucy5iaW5kSW5kZXhGb3JTdGVwc0FycmF5KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmdldFN0ZXBWYWx1ZSh2aWV3VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZpZXdWYWx1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0U3RlcFZhbHVlKHNsaWRlclZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3Qgc3RlcDogQ3VzdG9tU3RlcERlZmluaXRpb24gPSB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXlbc2xpZGVyVmFsdWVdO1xyXG4gICAgcmV0dXJuICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoc3RlcCkpID8gc3RlcC52YWx1ZSA6IE5hTjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlWaWV3Q2hhbmdlKCk6IHZvaWQge1xyXG4gICAgdGhpcy52YWx1ZSA9IHRoaXMudmlld1ZhbHVlVG9Nb2RlbFZhbHVlKHRoaXMudmlld0xvd1ZhbHVlKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMuaGlnaFZhbHVlID0gdGhpcy52aWV3VmFsdWVUb01vZGVsVmFsdWUodGhpcy52aWV3SGlnaFZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdC5uZXh0KHtcclxuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgIGhpZ2hWYWx1ZTogdGhpcy5oaWdoVmFsdWUsXHJcbiAgICAgIHVzZXJFdmVudEluaXRpYXRlZDogdHJ1ZSxcclxuICAgICAgZm9yY2VDaGFuZ2U6IGZhbHNlXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBdCB0aGlzIHBvaW50IGFsbCBjaGFuZ2VzIGFyZSBhcHBsaWVkIGFuZCBvdXRwdXRzIGFyZSBlbWl0dGVkLCBzbyB3ZSBzaG91bGQgYmUgZG9uZS5cclxuICAgIC8vIEhvd2V2ZXIsIGlucHV0IGNoYW5nZXMgYXJlIGNvbW11bmljYXRlZCBpbiBkaWZmZXJlbnQgc3RyZWFtIGFuZCB3ZSBuZWVkIHRvIGJlIHJlYWR5IHRvXHJcbiAgICAvLyBhY3Qgb24gdGhlIG5leHQgaW5wdXQgY2hhbmdlIGV2ZW4gaWYgaXQgaXMgZXhhY3RseSB0aGUgc2FtZSBhcyBsYXN0IGlucHV0IGNoYW5nZS5cclxuICAgIC8vIFRoZXJlZm9yZSwgd2Ugc2VuZCBhIHNwZWNpYWwgZXZlbnQgdG8gcmVzZXQgdGhlIHN0cmVhbS5cclxuICAgIHRoaXMuaW5wdXRNb2RlbENoYW5nZVN1YmplY3QubmV4dCh7XHJcbiAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxyXG4gICAgICBoaWdoVmFsdWU6IHRoaXMuaGlnaFZhbHVlLFxyXG4gICAgICBmb3JjZUNoYW5nZTogZmFsc2UsXHJcbiAgICAgIGludGVybmFsQ2hhbmdlOiB0cnVlXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIEFwcGx5IG1vZGVsIGNoYW5nZSB0byB0aGUgc2xpZGVyIHZpZXdcclxuICBwcml2YXRlIGFwcGx5SW5wdXRNb2RlbENoYW5nZShtb2RlbENoYW5nZTogSW5wdXRNb2RlbENoYW5nZSk6IHZvaWQge1xyXG4gICAgY29uc3Qgbm9ybWFsaXNlZE1vZGVsQ2hhbmdlOiBNb2RlbFZhbHVlcyA9IHRoaXMubm9ybWFsaXNlTW9kZWxWYWx1ZXMobW9kZWxDaGFuZ2UpO1xyXG5cclxuICAgIC8vIElmIG5vcm1hbGlzZWQgbW9kZWwgY2hhbmdlIGlzIGRpZmZlcmVudCwgYXBwbHkgdGhlIGNoYW5nZSB0byB0aGUgbW9kZWwgdmFsdWVzXHJcbiAgICBjb25zdCBub3JtYWxpc2F0aW9uQ2hhbmdlOiBib29sZWFuID0gIU1vZGVsVmFsdWVzLmNvbXBhcmUobW9kZWxDaGFuZ2UsIG5vcm1hbGlzZWRNb2RlbENoYW5nZSk7XHJcbiAgICBpZiAobm9ybWFsaXNhdGlvbkNoYW5nZSkge1xyXG4gICAgICB0aGlzLnZhbHVlID0gbm9ybWFsaXNlZE1vZGVsQ2hhbmdlLnZhbHVlO1xyXG4gICAgICB0aGlzLmhpZ2hWYWx1ZSA9IG5vcm1hbGlzZWRNb2RlbENoYW5nZS5oaWdoVmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52aWV3TG93VmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZShub3JtYWxpc2VkTW9kZWxDaGFuZ2UudmFsdWUpO1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy52aWV3SGlnaFZhbHVlID0gdGhpcy5tb2RlbFZhbHVlVG9WaWV3VmFsdWUobm9ybWFsaXNlZE1vZGVsQ2hhbmdlLmhpZ2hWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlTG93SGFuZGxlKHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0xvd1ZhbHVlKSk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUhpZ2hIYW5kbGUodGhpcy52YWx1ZVRvUG9zaXRpb24odGhpcy52aWV3SGlnaFZhbHVlKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbkJhcigpO1xyXG4gICAgdGhpcy51cGRhdGVUaWNrc1NjYWxlKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbWJpbmVkTGFiZWwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBBdCB0aGUgZW5kLCB3ZSBuZWVkIHRvIGNvbW11bmljYXRlIHRoZSBtb2RlbCBjaGFuZ2UgdG8gdGhlIG91dHB1dHMgYXMgd2VsbFxyXG4gICAgLy8gTm9ybWFsaXNhdGlvbiBjaGFuZ2VzIGFyZSBhbHNvIGFsd2F5cyBmb3JjZWQgb3V0IHRvIGVuc3VyZSB0aGF0IHN1YnNjcmliZXJzIGFsd2F5cyBlbmQgdXAgaW4gY29ycmVjdCBzdGF0ZVxyXG4gICAgdGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YmplY3QubmV4dCh7XHJcbiAgICAgIHZhbHVlOiBub3JtYWxpc2VkTW9kZWxDaGFuZ2UudmFsdWUsXHJcbiAgICAgIGhpZ2hWYWx1ZTogbm9ybWFsaXNlZE1vZGVsQ2hhbmdlLmhpZ2hWYWx1ZSxcclxuICAgICAgZm9yY2VDaGFuZ2U6IG5vcm1hbGlzYXRpb25DaGFuZ2UsXHJcbiAgICAgIHVzZXJFdmVudEluaXRpYXRlZDogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gUHVibGlzaCBtb2RlbCBjaGFuZ2UgdG8gb3V0cHV0IGV2ZW50IGVtaXR0ZXJzIGFuZCByZWdpc3RlcmVkIGNhbGxiYWNrc1xyXG4gIHByaXZhdGUgcHVibGlzaE91dHB1dE1vZGVsQ2hhbmdlKG1vZGVsQ2hhbmdlOiBPdXRwdXRNb2RlbENoYW5nZSk6IHZvaWQge1xyXG4gICAgY29uc3QgZW1pdE91dHB1dHM6ICgpID0+IHZvaWQgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIHRoaXMudmFsdWVDaGFuZ2UuZW1pdChtb2RlbENoYW5nZS52YWx1ZSk7XHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgdGhpcy5oaWdoVmFsdWVDaGFuZ2UuZW1pdChtb2RlbENoYW5nZS5oaWdoVmFsdWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMub25DaGFuZ2VDYWxsYmFjaykpIHtcclxuICAgICAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKFttb2RlbENoYW5nZS52YWx1ZSwgbW9kZWxDaGFuZ2UuaGlnaFZhbHVlXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMub25DaGFuZ2VDYWxsYmFjayhtb2RlbENoYW5nZS52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5vblRvdWNoZWRDYWxsYmFjaykpIHtcclxuICAgICAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICAgICAgdGhpcy5vblRvdWNoZWRDYWxsYmFjayhbbW9kZWxDaGFuZ2UudmFsdWUsIG1vZGVsQ2hhbmdlLmhpZ2hWYWx1ZV0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKG1vZGVsQ2hhbmdlLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKG1vZGVsQ2hhbmdlLnVzZXJFdmVudEluaXRpYXRlZCkge1xyXG4gICAgICAvLyBJZiB0aGlzIGNoYW5nZSB3YXMgaW5pdGlhdGVkIGJ5IGEgdXNlciBldmVudCwgd2UgY2FuIGVtaXQgb3V0cHV0cyBpbiB0aGUgc2FtZSB0aWNrXHJcbiAgICAgIGVtaXRPdXRwdXRzKCk7XHJcbiAgICAgIHRoaXMudXNlckNoYW5nZS5lbWl0KHRoaXMuZ2V0Q2hhbmdlQ29udGV4dCgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIEJ1dCwgaWYgdGhlIGNoYW5nZSB3YXMgaW5pdGF0ZWQgYnkgc29tZXRoaW5nIGVsc2UgbGlrZSBhIGNoYW5nZSBpbiBpbnB1dCBiaW5kaW5ncyxcclxuICAgICAgLy8gd2UgbmVlZCB0byB3YWl0IHVudGlsIG5leHQgdGljayB0byBlbWl0IHRoZSBvdXRwdXRzIHRvIGtlZXAgQW5ndWxhciBjaGFuZ2UgZGV0ZWN0aW9uIGhhcHB5XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBlbWl0T3V0cHV0cygpOyB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgbm9ybWFsaXNlTW9kZWxWYWx1ZXMoaW5wdXQ6IE1vZGVsVmFsdWVzKTogTW9kZWxWYWx1ZXMge1xyXG4gICAgY29uc3Qgbm9ybWFsaXNlZElucHV0OiBNb2RlbFZhbHVlcyA9IG5ldyBNb2RlbFZhbHVlcygpO1xyXG4gICAgbm9ybWFsaXNlZElucHV0LnZhbHVlID0gaW5wdXQudmFsdWU7XHJcbiAgICBub3JtYWxpc2VkSW5wdXQuaGlnaFZhbHVlID0gaW5wdXQuaGlnaFZhbHVlO1xyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KSkge1xyXG4gICAgICAvLyBXaGVuIHVzaW5nIHN0ZXBzIGFycmF5LCBvbmx5IHJvdW5kIHRvIG5lYXJlc3Qgc3RlcCBpbiB0aGUgYXJyYXlcclxuICAgICAgLy8gTm8gb3RoZXIgZW5mb3JjZW1lbnQgY2FuIGJlIGRvbmUsIGFzIHRoZSBzdGVwIGFycmF5IG1heSBiZSBvdXQgb2Ygb3JkZXIsIGFuZCB0aGF0IGlzIHBlcmZlY3RseSBmaW5lXHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmVuZm9yY2VTdGVwc0FycmF5KSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVJbmRleDogbnVtYmVyID0gVmFsdWVIZWxwZXIuZmluZFN0ZXBJbmRleChub3JtYWxpc2VkSW5wdXQudmFsdWUsIHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheSk7XHJcbiAgICAgICAgbm9ybWFsaXNlZElucHV0LnZhbHVlID0gdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5W3ZhbHVlSW5kZXhdLnZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICAgICAgY29uc3QgaGlnaFZhbHVlSW5kZXg6IG51bWJlciA9IFZhbHVlSGVscGVyLmZpbmRTdGVwSW5kZXgobm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZSwgdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KTtcclxuICAgICAgICAgIG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXlbaGlnaFZhbHVlSW5kZXhdLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIG5vcm1hbGlzZWRJbnB1dDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5lbmZvcmNlU3RlcCkge1xyXG4gICAgICBub3JtYWxpc2VkSW5wdXQudmFsdWUgPSB0aGlzLnJvdW5kU3RlcChub3JtYWxpc2VkSW5wdXQudmFsdWUpO1xyXG4gICAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICAgIG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUgPSB0aGlzLnJvdW5kU3RlcChub3JtYWxpc2VkSW5wdXQuaGlnaFZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmVuZm9yY2VSYW5nZSkge1xyXG4gICAgICBub3JtYWxpc2VkSW5wdXQudmFsdWUgPSBNYXRoSGVscGVyLmNsYW1wVG9SYW5nZShub3JtYWxpc2VkSW5wdXQudmFsdWUsIHRoaXMudmlld09wdGlvbnMuZmxvb3IsIHRoaXMudmlld09wdGlvbnMuY2VpbCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICAgIG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUgPSBNYXRoSGVscGVyLmNsYW1wVG9SYW5nZShub3JtYWxpc2VkSW5wdXQuaGlnaFZhbHVlLCB0aGlzLnZpZXdPcHRpb25zLmZsb29yLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBNYWtlIHN1cmUgdGhhdCByYW5nZSBzbGlkZXIgaW52YXJpYW50ICh2YWx1ZSA8PSBoaWdoVmFsdWUpIGlzIGFsd2F5cyBzYXRpc2ZpZWRcclxuICAgICAgaWYgKHRoaXMucmFuZ2UgJiYgaW5wdXQudmFsdWUgPiBpbnB1dC5oaWdoVmFsdWUpIHtcclxuICAgICAgICAvLyBXZSBrbm93IHRoYXQgYm90aCB2YWx1ZXMgYXJlIG5vdyBjbGFtcGVkIGNvcnJlY3RseSwgdGhleSBtYXkganVzdCBiZSBpbiB0aGUgd3Jvbmcgb3JkZXJcclxuICAgICAgICAvLyBTbyB0aGUgZWFzeSBzb2x1dGlvbiBpcyB0byBzd2FwIHRoZW0uLi4gZXhjZXB0IHN3YXBwaW5nIGlzIHNvbWV0aW1lcyBkaXNhYmxlZCBpbiBvcHRpb25zLCBzbyB3ZSBtYWtlIHRoZSB0d28gdmFsdWVzIHRoZSBzYW1lXHJcbiAgICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMubm9Td2l0Y2hpbmcpIHtcclxuICAgICAgICAgIG5vcm1hbGlzZWRJbnB1dC52YWx1ZSA9IG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IHRlbXBWYWx1ZTogbnVtYmVyID0gaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICBub3JtYWxpc2VkSW5wdXQudmFsdWUgPSBpbnB1dC5oaWdoVmFsdWU7XHJcbiAgICAgICAgICBub3JtYWxpc2VkSW5wdXQuaGlnaFZhbHVlID0gdGVtcFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBub3JtYWxpc2VkSW5wdXQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlbm9ybWFsaXNlTW9kZWxWYWx1ZXMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBwcmV2aW91c01vZGVsVmFsdWVzOiBNb2RlbFZhbHVlcyA9IHtcclxuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgIGhpZ2hWYWx1ZTogdGhpcy5oaWdoVmFsdWVcclxuICAgIH07XHJcbiAgICBjb25zdCBub3JtYWxpc2VkTW9kZWxWYWx1ZXM6IE1vZGVsVmFsdWVzID0gdGhpcy5ub3JtYWxpc2VNb2RlbFZhbHVlcyhwcmV2aW91c01vZGVsVmFsdWVzKTtcclxuICAgIGlmICghTW9kZWxWYWx1ZXMuY29tcGFyZShub3JtYWxpc2VkTW9kZWxWYWx1ZXMsIHByZXZpb3VzTW9kZWxWYWx1ZXMpKSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSBub3JtYWxpc2VkTW9kZWxWYWx1ZXMudmFsdWU7XHJcbiAgICAgIHRoaXMuaGlnaFZhbHVlID0gbm9ybWFsaXNlZE1vZGVsVmFsdWVzLmhpZ2hWYWx1ZTtcclxuXHJcbiAgICAgIHRoaXMub3V0cHV0TW9kZWxDaGFuZ2VTdWJqZWN0Lm5leHQoe1xyXG4gICAgICAgIHZhbHVlOiB0aGlzLnZhbHVlLFxyXG4gICAgICAgIGhpZ2hWYWx1ZTogdGhpcy5oaWdoVmFsdWUsXHJcbiAgICAgICAgZm9yY2VDaGFuZ2U6IHRydWUsXHJcbiAgICAgICAgdXNlckV2ZW50SW5pdGlhdGVkOiBmYWxzZVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25DaGFuZ2VPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmluaXRIYXNSdW4pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHByZXZpb3VzT3B0aW9uc0luZmx1ZW5jaW5nRXZlbnRCaW5kaW5nczogYm9vbGVhbltdID0gdGhpcy5nZXRPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzKHRoaXMudmlld09wdGlvbnMpO1xyXG5cclxuICAgIHRoaXMuYXBwbHlPcHRpb25zKCk7XHJcblxyXG4gICAgY29uc3QgbmV3T3B0aW9uc0luZmx1ZW5jaW5nRXZlbnRCaW5kaW5nczogYm9vbGVhbltdID0gdGhpcy5nZXRPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzKHRoaXMudmlld09wdGlvbnMpO1xyXG4gICAgLy8gQXZvaWQgcmUtYmluZGluZyBldmVudHMgaW4gY2FzZSBub3RoaW5nIGNoYW5nZXMgdGhhdCBjYW4gaW5mbHVlbmNlIGl0XHJcbiAgICAvLyBJdCBtYWtlcyBpdCBwb3NzaWJsZSB0byBjaGFuZ2Ugb3B0aW9ucyB3aGlsZSBkcmFnZ2luZyB0aGUgc2xpZGVyXHJcbiAgICBjb25zdCByZWJpbmRFdmVudHM6IGJvb2xlYW4gPSAhVmFsdWVIZWxwZXIuYXJlQXJyYXlzRXF1YWwocHJldmlvdXNPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzLCBuZXdPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzKTtcclxuXHJcbiAgICAvLyBXaXRoIG5ldyBvcHRpb25zLCB3ZSBuZWVkIHRvIHJlLW5vcm1hbGlzZSBtb2RlbCB2YWx1ZXMgaWYgbmVjZXNzYXJ5XHJcbiAgICB0aGlzLnJlbm9ybWFsaXNlTW9kZWxWYWx1ZXMoKTtcclxuXHJcbiAgICB0aGlzLnZpZXdMb3dWYWx1ZSA9IHRoaXMubW9kZWxWYWx1ZVRvVmlld1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy52aWV3SGlnaFZhbHVlID0gdGhpcy5tb2RlbFZhbHVlVG9WaWV3VmFsdWUodGhpcy5oaWdoVmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52aWV3SGlnaFZhbHVlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlc2V0U2xpZGVyKHJlYmluZEV2ZW50cyk7XHJcbiAgfVxyXG5cclxuICAvLyBSZWFkIHRoZSB1c2VyIG9wdGlvbnMgYW5kIGFwcGx5IHRoZW0gdG8gdGhlIHNsaWRlciBtb2RlbFxyXG4gIHByaXZhdGUgYXBwbHlPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucyA9IG5ldyBPcHRpb25zKCk7XHJcbiAgICBPYmplY3QuYXNzaWduKHRoaXMudmlld09wdGlvbnMsIHRoaXMub3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5kcmFnZ2FibGVSYW5nZSA9IHRoaXMucmFuZ2UgJiYgdGhpcy52aWV3T3B0aW9ucy5kcmFnZ2FibGVSYW5nZTtcclxuICAgIHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5ID0gdGhpcy5yYW5nZSAmJiB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlT25seTtcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlT25seSkge1xyXG4gICAgICB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrcyA9IHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzIHx8XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzVmFsdWVzIHx8XHJcbiAgICAgICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tzQXJyYXkpO1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzICYmXHJcbiAgICAgICAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja1N0ZXApIHx8ICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tzQXJyYXkpKSkge1xyXG4gICAgICB0aGlzLmludGVybWVkaWF0ZVRpY2tzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXIgPSB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXIgfHxcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRW5kIHx8XHJcbiAgICAgICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWUpO1xyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KSkge1xyXG4gICAgICB0aGlzLmFwcGx5U3RlcHNBcnJheU9wdGlvbnMoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuYXBwbHlGbG9vckNlaWxPcHRpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuY29tYmluZUxhYmVscykpIHtcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5jb21iaW5lTGFiZWxzID0gKG1pblZhbHVlOiBzdHJpbmcsIG1heFZhbHVlOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgIHJldHVybiBtaW5WYWx1ZSArICcgLSAnICsgbWF4VmFsdWU7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMubG9nU2NhbGUgJiYgdGhpcy52aWV3T3B0aW9ucy5mbG9vciA9PT0gMCkge1xyXG4gICAgICB0aHJvdyBFcnJvcignQ2FuXFwndCB1c2UgZmxvb3I9MCB3aXRoIGxvZ2FyaXRobWljIHNjYWxlJyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5U3RlcHNBcnJheU9wdGlvbnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLmZsb29yID0gMDtcclxuICAgIHRoaXMudmlld09wdGlvbnMuY2VpbCA9IHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheS5sZW5ndGggLSAxO1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5zdGVwID0gMTtcclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUpKSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMudHJhbnNsYXRlID0gKG1vZGVsVmFsdWU6IG51bWJlcik6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMuYmluZEluZGV4Rm9yU3RlcHNBcnJheSkge1xyXG4gICAgICAgICAgcmV0dXJuIFN0cmluZyh0aGlzLmdldFN0ZXBWYWx1ZShtb2RlbFZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBTdHJpbmcobW9kZWxWYWx1ZSk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5Rmxvb3JDZWlsT3B0aW9ucygpOiB2b2lkIHtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXApKSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMuc3RlcCA9IDE7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpZXdPcHRpb25zLnN0ZXAgPSArdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5zdGVwIDw9IDApIHtcclxuICAgICAgICB0aGlzLnZpZXdPcHRpb25zLnN0ZXAgPSAxO1xyXG4gICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5jZWlsKSB8fFxyXG4gICAgICAgIFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuZmxvb3IpKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdmbG9vciBhbmQgY2VpbCBvcHRpb25zIG11c3QgYmUgc3VwcGxpZWQnKTtcclxuICAgIH1cclxuICAgIHRoaXMudmlld09wdGlvbnMuY2VpbCA9ICt0aGlzLnZpZXdPcHRpb25zLmNlaWw7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLmZsb29yID0gK3RoaXMudmlld09wdGlvbnMuZmxvb3I7XHJcblxyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudHJhbnNsYXRlKSkge1xyXG4gICAgICB0aGlzLnZpZXdPcHRpb25zLnRyYW5zbGF0ZSA9ICh2YWx1ZTogbnVtYmVyKTogc3RyaW5nID0+IFN0cmluZyh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBSZXNldHMgc2xpZGVyXHJcbiAgcHJpdmF0ZSByZXNldFNsaWRlcihyZWJpbmRFdmVudHM6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XHJcbiAgICB0aGlzLm1hbmFnZUVsZW1lbnRzU3R5bGUoKTtcclxuICAgIHRoaXMuYWRkQWNjZXNzaWJpbGl0eSgpO1xyXG4gICAgdGhpcy51cGRhdGVDZWlsTGFiZWwoKTtcclxuICAgIHRoaXMudXBkYXRlRmxvb3JMYWJlbCgpO1xyXG4gICAgaWYgKHJlYmluZEV2ZW50cykge1xyXG4gICAgICB0aGlzLnVuYmluZEV2ZW50cygpO1xyXG4gICAgICB0aGlzLm1hbmFnZUV2ZW50c0JpbmRpbmdzKCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZURpc2FibGVkU3RhdGUoKTtcclxuICAgIHRoaXMudXBkYXRlQXJpYUxhYmVsKCk7XHJcbiAgICB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKCk7XHJcbiAgICB0aGlzLnJlZm9jdXNQb2ludGVySWZOZWVkZWQoKTtcclxuICB9XHJcblxyXG4gIC8vIFNldHMgZm9jdXMgb24gdGhlIHNwZWNpZmllZCBwb2ludGVyXHJcbiAgcHJpdmF0ZSBmb2N1c1BvaW50ZXIocG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlKTogdm9pZCB7XHJcbiAgICAvLyBJZiBub3Qgc3VwcGxpZWQsIHVzZSBtaW4gcG9pbnRlciBhcyBkZWZhdWx0XHJcbiAgICBpZiAocG9pbnRlclR5cGUgIT09IFBvaW50ZXJUeXBlLk1pbiAmJiBwb2ludGVyVHlwZSAhPT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgIHBvaW50ZXJUeXBlID0gUG9pbnRlclR5cGUuTWluO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChwb2ludGVyVHlwZSA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnJhbmdlICYmIHBvaW50ZXJUeXBlID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHJlZm9jdXNQb2ludGVySWZOZWVkZWQoKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuY3VycmVudEZvY3VzUG9pbnRlcikpIHtcclxuICAgICAgdGhpcy5vblBvaW50ZXJGb2N1cyh0aGlzLmN1cnJlbnRGb2N1c1BvaW50ZXIpO1xyXG4gICAgICBjb25zdCBlbGVtZW50OiBTbGlkZXJIYW5kbGVEaXJlY3RpdmUgPSB0aGlzLmdldFBvaW50ZXJFbGVtZW50KHRoaXMuY3VycmVudEZvY3VzUG9pbnRlcik7XHJcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBlYWNoIGVsZW1lbnRzIHN0eWxlIGJhc2VkIG9uIG9wdGlvbnNcclxuICBwcml2YXRlIG1hbmFnZUVsZW1lbnRzU3R5bGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZVNjYWxlKCk7XHJcbiAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LnNldEFsd2F5c0hpZGUodGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3NWYWx1ZXMgfHwgdGhpcy52aWV3T3B0aW9ucy5oaWRlTGltaXRMYWJlbHMpO1xyXG4gICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNldEFsd2F5c0hpZGUodGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3NWYWx1ZXMgfHwgdGhpcy52aWV3T3B0aW9ucy5oaWRlTGltaXRMYWJlbHMpO1xyXG5cclxuICAgIGNvbnN0IGhpZGVMYWJlbHNGb3JUaWNrczogYm9vbGVhbiA9IHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzVmFsdWVzICYmICF0aGlzLmludGVybWVkaWF0ZVRpY2tzO1xyXG4gICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuc2V0QWx3YXlzSGlkZShoaWRlTGFiZWxzRm9yVGlja3MgfHwgdGhpcy52aWV3T3B0aW9ucy5oaWRlUG9pbnRlckxhYmVscyk7XHJcbiAgICB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudC5zZXRBbHdheXNIaWRlKGhpZGVMYWJlbHNGb3JUaWNrcyB8fCAhdGhpcy5yYW5nZSB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVQb2ludGVyTGFiZWxzKTtcclxuICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuc2V0QWx3YXlzSGlkZShoaWRlTGFiZWxzRm9yVGlja3MgfHwgIXRoaXMucmFuZ2UgfHwgdGhpcy52aWV3T3B0aW9ucy5oaWRlUG9pbnRlckxhYmVscyk7XHJcbiAgICB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQuc2V0QWx3YXlzSGlkZSghdGhpcy5yYW5nZSAmJiAhdGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyKTtcclxuICAgIHRoaXMubGVmdE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXRBbHdheXNIaWRlKCF0aGlzLnJhbmdlIHx8ICF0aGlzLnZpZXdPcHRpb25zLnNob3dPdXRlclNlbGVjdGlvbkJhcnMpO1xyXG4gICAgdGhpcy5yaWdodE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXRBbHdheXNIaWRlKCF0aGlzLnJhbmdlIHx8ICF0aGlzLnZpZXdPcHRpb25zLnNob3dPdXRlclNlbGVjdGlvbkJhcnMpO1xyXG5cclxuICAgIHRoaXMuZnVsbEJhclRyYW5zcGFyZW50Q2xhc3MgPSB0aGlzLnJhbmdlICYmIHRoaXMudmlld09wdGlvbnMuc2hvd091dGVyU2VsZWN0aW9uQmFycztcclxuICAgIHRoaXMuc2VsZWN0aW9uQmFyRHJhZ2dhYmxlQ2xhc3MgPSB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlICYmICF0aGlzLnZpZXdPcHRpb25zLm9ubHlCaW5kSGFuZGxlcztcclxuICAgIHRoaXMudGlja3NVbmRlclZhbHVlc0NsYXNzID0gdGhpcy5pbnRlcm1lZGlhdGVUaWNrcyAmJiB0aGlzLm9wdGlvbnMuc2hvd1RpY2tzVmFsdWVzO1xyXG5cclxuICAgIGlmICh0aGlzLnNsaWRlckVsZW1lbnRWZXJ0aWNhbENsYXNzICE9PSB0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlVmVydGljYWxTdGF0ZSgpO1xyXG4gICAgICAvLyBUaGUgYWJvdmUgY2hhbmdlIGluIGhvc3QgY29tcG9uZW50IGNsYXNzIHdpbGwgbm90IGJlIGFwcGxpZWQgdW50aWwgdGhlIGVuZCBvZiB0aGlzIGN5Y2xlXHJcbiAgICAgIC8vIEhvd2V2ZXIsIGZ1bmN0aW9ucyBjYWxjdWxhdGluZyB0aGUgc2xpZGVyIHBvc2l0aW9uIGV4cGVjdCB0aGUgc2xpZGVyIHRvIGJlIGFscmVhZHkgc3R5bGVkIGFzIHZlcnRpY2FsXHJcbiAgICAgIC8vIFNvIGFzIGEgd29ya2Fyb3VuZCwgd2UgbmVlZCB0byByZXNldCB0aGUgc2xpZGVyIG9uY2UgYWdhaW4gdG8gY29tcHV0ZSB0aGUgY29ycmVjdCB2YWx1ZXNcclxuICAgICAgc2V0VGltZW91dCgoKTogdm9pZCA9PiB7IHRoaXMucmVzZXRTbGlkZXIoKTsgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hhbmdpbmcgYW5pbWF0ZSBjbGFzcyBtYXkgaW50ZXJmZXJlIHdpdGggc2xpZGVyIHJlc2V0L2luaXRpYWxpc2F0aW9uLCBzbyB3ZSBzaG91bGQgc2V0IGl0IHNlcGFyYXRlbHksXHJcbiAgICAvLyBhZnRlciBhbGwgaXMgcHJvcGVybHkgc2V0IHVwXHJcbiAgICBpZiAodGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzICE9PSB0aGlzLnZpZXdPcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgc2V0VGltZW91dCgoKTogdm9pZCA9PiB7IHRoaXMuc2xpZGVyRWxlbWVudEFuaW1hdGVDbGFzcyA9IHRoaXMudmlld09wdGlvbnMuYW5pbWF0ZTsgfSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVJvdGF0ZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gTWFuYWdlIHRoZSBldmVudHMgYmluZGluZ3MgYmFzZWQgb24gcmVhZE9ubHkgYW5kIGRpc2FibGVkIG9wdGlvbnNcclxuICBwcml2YXRlIG1hbmFnZUV2ZW50c0JpbmRpbmdzKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuZGlzYWJsZWQgfHwgdGhpcy52aWV3T3B0aW9ucy5yZWFkT25seSkge1xyXG4gICAgICB0aGlzLnVuYmluZEV2ZW50cygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5iaW5kRXZlbnRzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdGhlIGRpc2FibGVkIHN0YXRlIGJhc2VkIG9uIGRpc2FibGVkIG9wdGlvblxyXG4gIHByaXZhdGUgdXBkYXRlRGlzYWJsZWRTdGF0ZSgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2xpZGVyRWxlbWVudERpc2FibGVkQXR0ciA9IHRoaXMudmlld09wdGlvbnMuZGlzYWJsZWQgPyAnZGlzYWJsZWQnIDogbnVsbDtcclxuICB9XHJcblxyXG4gIC8vIFNldCB0aGUgYXJpYS1sYWJlbCBzdGF0ZSBiYXNlZCBvbiBhcmlhTGFiZWwgb3B0aW9uXHJcbiAgcHJpdmF0ZSB1cGRhdGVBcmlhTGFiZWwoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNsaWRlckVsZW1lbnRBcmlhTGFiZWwgPSB0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbCB8fCAnbnhnLXNsaWRlcic7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdmVydGljYWwgc3RhdGUgYmFzZWQgb24gdmVydGljYWwgb3B0aW9uXHJcbiAgcHJpdmF0ZSB1cGRhdGVWZXJ0aWNhbFN0YXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zbGlkZXJFbGVtZW50VmVydGljYWxDbGFzcyA9IHRoaXMudmlld09wdGlvbnMudmVydGljYWw7XHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5nZXRBbGxTbGlkZXJFbGVtZW50cygpKSB7XHJcbiAgICAgIC8vIFRoaXMgaXMgYWxzbyBjYWxsZWQgYmVmb3JlIG5nQWZ0ZXJJbml0LCBzbyBuZWVkIHRvIGNoZWNrIHRoYXQgdmlldyBjaGlsZCBiaW5kaW5ncyB3b3JrXHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudCkpIHtcclxuICAgICAgICBlbGVtZW50LnNldFZlcnRpY2FsKHRoaXMudmlld09wdGlvbnMudmVydGljYWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVNjYWxlKCk6IHZvaWQge1xyXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRoaXMuZ2V0QWxsU2xpZGVyRWxlbWVudHMoKSkge1xyXG4gICAgICBlbGVtZW50LnNldFNjYWxlKHRoaXMudmlld09wdGlvbnMuc2NhbGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1cGRhdGVSb3RhdGUoKTogdm9pZCB7XHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5nZXRBbGxTbGlkZXJFbGVtZW50cygpKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0Um90YXRlKHRoaXMudmlld09wdGlvbnMucm90YXRlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0QWxsU2xpZGVyRWxlbWVudHMoKTogU2xpZGVyRWxlbWVudERpcmVjdGl2ZVtdIHtcclxuICAgIHJldHVybiBbdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LFxyXG4gICAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LFxyXG4gICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LFxyXG4gICAgICB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQsXHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudCxcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LFxyXG4gICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LFxyXG4gICAgICB0aGlzLmNlaWxMYWJlbEVsZW1lbnQsXHJcbiAgICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LFxyXG4gICAgICB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudCxcclxuICAgICAgdGhpcy5jb21iaW5lZExhYmVsRWxlbWVudCxcclxuICAgICAgdGhpcy50aWNrc0VsZW1lbnRcclxuICAgIF07XHJcbiAgfVxyXG5cclxuICAvLyBJbml0aWFsaXplIHNsaWRlciBoYW5kbGVzIHBvc2l0aW9ucyBhbmQgbGFiZWxzXHJcbiAgLy8gUnVuIG9ubHkgb25jZSBkdXJpbmcgaW5pdGlhbGl6YXRpb24gYW5kIGV2ZXJ5IHRpbWUgdmlldyBwb3J0IGNoYW5nZXMgc2l6ZVxyXG4gIHByaXZhdGUgaW5pdEhhbmRsZXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZUxvd0hhbmRsZSh0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdMb3dWYWx1ZSkpO1xyXG5cclxuICAgIC8qXHJcbiAgIHRoZSBvcmRlciBoZXJlIGlzIGltcG9ydGFudCBzaW5jZSB0aGUgc2VsZWN0aW9uIGJhciBzaG91bGQgYmVcclxuICAgdXBkYXRlZCBhZnRlciB0aGUgaGlnaCBoYW5kbGUgYnV0IGJlZm9yZSB0aGUgY29tYmluZWQgbGFiZWxcclxuICAgKi9cclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlSGlnaEhhbmRsZSh0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdIaWdoVmFsdWUpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbkJhcigpO1xyXG5cclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29tYmluZWRMYWJlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlVGlja3NTY2FsZSgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQWRkcyBhY2Nlc3NpYmlsaXR5IGF0dHJpYnV0ZXMsIHJ1biBvbmx5IG9uY2UgZHVyaW5nIGluaXRpYWxpemF0aW9uXHJcbiAgcHJpdmF0ZSBhZGRBY2Nlc3NpYmlsaXR5KCk6IHZvaWQge1xyXG4gICAgdGhpcy51cGRhdGVBcmlhQXR0cmlidXRlcygpO1xyXG5cclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5yb2xlID0gJ3NsaWRlcic7XHJcblxyXG4gICAgaWYgKCB0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCAmJlxyXG4gICAgICAhKHRoaXMudmlld09wdGlvbnMucmVhZE9ubHkgfHwgdGhpcy52aWV3T3B0aW9ucy5kaXNhYmxlZCkgKSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC50YWJpbmRleCA9ICcwJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC50YWJpbmRleCA9ICcnO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhT3JpZW50YXRpb24gPSAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCB8fCB0aGlzLnZpZXdPcHRpb25zLnJvdGF0ZSAhPT0gMCkgPyAndmVydGljYWwnIDogJ2hvcml6b250YWwnO1xyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWwpKSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhTGFiZWwgPSB0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbDtcclxuICAgIH0gZWxzZSBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsbGVkQnkpKSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhTGFiZWxsZWRCeSA9IHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsbGVkQnk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LnJvbGUgPSAnc2xpZGVyJztcclxuXHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCAmJlxyXG4gICAgICAgICEodGhpcy52aWV3T3B0aW9ucy5yZWFkT25seSB8fCB0aGlzLnZpZXdPcHRpb25zLmRpc2FibGVkKSkge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC50YWJpbmRleCA9ICcwJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQudGFiaW5kZXggPSAnJztcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFPcmllbnRhdGlvbiA9ICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcblxyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsSGlnaCkpIHtcclxuICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYXJpYUxhYmVsID0gdGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWxIaWdoO1xyXG4gICAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbGxlZEJ5SGlnaCkpIHtcclxuICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYXJpYUxhYmVsbGVkQnkgPSB0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbGxlZEJ5SGlnaDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlcyBhcmlhIGF0dHJpYnV0ZXMgYWNjb3JkaW5nIHRvIGN1cnJlbnQgdmFsdWVzXHJcbiAgcHJpdmF0ZSB1cGRhdGVBcmlhQXR0cmlidXRlcygpOiB2b2lkIHtcclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhVmFsdWVOb3cgPSAoK3RoaXMudmFsdWUpLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuYXJpYVZhbHVlVGV4dCA9IHRoaXMudmlld09wdGlvbnMudHJhbnNsYXRlKCt0aGlzLnZhbHVlLCBMYWJlbFR5cGUuTG93KTtcclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhVmFsdWVNaW4gPSB0aGlzLnZpZXdPcHRpb25zLmZsb29yLnRvU3RyaW5nKCk7XHJcbiAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuYXJpYVZhbHVlTWF4ID0gdGhpcy52aWV3T3B0aW9ucy5jZWlsLnRvU3RyaW5nKCk7XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU5vdyA9ICgrdGhpcy5oaWdoVmFsdWUpLnRvU3RyaW5nKCk7XHJcbiAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hcmlhVmFsdWVUZXh0ID0gdGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUoK3RoaXMuaGlnaFZhbHVlLCBMYWJlbFR5cGUuSGlnaCk7XHJcbiAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hcmlhVmFsdWVNaW4gPSB0aGlzLnZpZXdPcHRpb25zLmZsb29yLnRvU3RyaW5nKCk7XHJcbiAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hcmlhVmFsdWVNYXggPSB0aGlzLnZpZXdPcHRpb25zLmNlaWwudG9TdHJpbmcoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSBkaW1lbnNpb25zIHRoYXQgYXJlIGRlcGVuZGVudCBvbiB2aWV3IHBvcnQgc2l6ZVxyXG4gIC8vIFJ1biBvbmNlIGR1cmluZyBpbml0aWFsaXphdGlvbiBhbmQgZXZlcnkgdGltZSB2aWV3IHBvcnQgY2hhbmdlcyBzaXplLlxyXG4gIHByaXZhdGUgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuaGFuZGxlRGltZW5zaW9uKSkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuc2V0RGltZW5zaW9uKHRoaXMudmlld09wdGlvbnMuaGFuZGxlRGltZW5zaW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5jYWxjdWxhdGVEaW1lbnNpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBoYW5kbGVXaWR0aDogbnVtYmVyID0gdGhpcy5taW5IYW5kbGVFbGVtZW50LmRpbWVuc2lvbjtcclxuXHJcbiAgICB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb24gPSBoYW5kbGVXaWR0aCAvIDI7XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmJhckRpbWVuc2lvbikpIHtcclxuICAgICAgdGhpcy5mdWxsQmFyRWxlbWVudC5zZXREaW1lbnNpb24odGhpcy52aWV3T3B0aW9ucy5iYXJEaW1lbnNpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5mdWxsQmFyRWxlbWVudC5jYWxjdWxhdGVEaW1lbnNpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1heEhhbmRsZVBvc2l0aW9uID0gdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSBoYW5kbGVXaWR0aDtcclxuXHJcbiAgICBpZiAodGhpcy5pbml0SGFzUnVuKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRmxvb3JMYWJlbCgpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNlaWxMYWJlbCgpO1xyXG4gICAgICB0aGlzLmluaXRIYW5kbGVzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zQW5kRGV0ZWN0Q2hhbmdlcygpOiB2b2lkIHtcclxuICAgIHRoaXMuY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoKTtcclxuICAgIGlmICghdGhpcy5pc1JlZkRlc3Ryb3llZCgpKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSWYgdGhlIHNsaWRlciByZWZlcmVuY2UgaXMgYWxyZWFkeSBkZXN0cm95ZWRcclxuICAgKiBAcmV0dXJucyBib29sZWFuIC0gdHJ1ZSBpZiByZWYgaXMgZGVzdHJveWVkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBpc1JlZkRlc3Ryb3llZCgpOiBib29sZWFuIHtcclxuICAgIHJldHVybiB0aGlzLmNoYW5nZURldGVjdGlvblJlZlsnZGVzdHJveWVkJ107XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgdGhlIHRpY2tzIHBvc2l0aW9uXHJcbiAgcHJpdmF0ZSB1cGRhdGVUaWNrc1NjYWxlKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrcykge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5zbGlkZXJFbGVtZW50V2l0aExlZ2VuZENsYXNzID0gZmFsc2U7IH0pO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGlja3NBcnJheTogbnVtYmVyW10gPSAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrc0FycmF5KVxyXG4gICAgICA/IHRoaXMudmlld09wdGlvbnMudGlja3NBcnJheVxyXG4gICAgICA6IHRoaXMuZ2V0VGlja3NBcnJheSgpO1xyXG4gICAgY29uc3QgdHJhbnNsYXRlOiBzdHJpbmcgPSB0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsID8gJ3RyYW5zbGF0ZVknIDogJ3RyYW5zbGF0ZVgnO1xyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIHRpY2tzQXJyYXkucmV2ZXJzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHRpY2tWYWx1ZVN0ZXA6IG51bWJlciA9ICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tWYWx1ZVN0ZXApID8gdGhpcy52aWV3T3B0aW9ucy50aWNrVmFsdWVTdGVwIDpcclxuICAgICAgICAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja1N0ZXApID8gdGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCA6IHRoaXMudmlld09wdGlvbnMuc3RlcCk7XHJcblxyXG4gICAgbGV0IGhhc0F0TGVhc3RPbmVMZWdlbmQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBjb25zdCBuZXdUaWNrczogVGlja1tdID0gdGlja3NBcnJheS5tYXAoKHZhbHVlOiBudW1iZXIpOiBUaWNrID0+IHtcclxuICAgICAgbGV0IHBvc2l0aW9uOiBudW1iZXIgPSB0aGlzLnZhbHVlVG9Qb3NpdGlvbih2YWx1ZSk7XHJcblxyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCkge1xyXG4gICAgICAgIHBvc2l0aW9uID0gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbiAtIHBvc2l0aW9uO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB0cmFuc2xhdGlvbjogc3RyaW5nID0gdHJhbnNsYXRlICsgJygnICsgTWF0aC5yb3VuZChwb3NpdGlvbikgKyAncHgpJztcclxuICAgICAgY29uc3QgdGljazogVGljayA9IG5ldyBUaWNrKCk7XHJcbiAgICAgIHRpY2suc2VsZWN0ZWQgPSB0aGlzLmlzVGlja1NlbGVjdGVkKHZhbHVlKTtcclxuICAgICAgdGljay5zdHlsZSA9IHtcclxuICAgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nOiB0cmFuc2xhdGlvbixcclxuICAgICAgICAnLW1vei10cmFuc2Zvcm0nOiB0cmFuc2xhdGlvbixcclxuICAgICAgICAnLW8tdHJhbnNmb3JtJzogdHJhbnNsYXRpb24sXHJcbiAgICAgICAgJy1tcy10cmFuc2Zvcm0nOiB0cmFuc2xhdGlvbixcclxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0aW9uLFxyXG4gICAgICB9O1xyXG4gICAgICBpZiAodGljay5zZWxlY3RlZCAmJiAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5nZXRTZWxlY3Rpb25CYXJDb2xvcikpIHtcclxuICAgICAgICB0aWNrLnN0eWxlWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSB0aGlzLmdldFNlbGVjdGlvbkJhckNvbG9yKCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aWNrLnNlbGVjdGVkICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldFRpY2tDb2xvcikpIHtcclxuICAgICAgICB0aWNrLnN0eWxlWydiYWNrZ3JvdW5kLWNvbG9yJ10gPSB0aGlzLmdldFRpY2tDb2xvcih2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tzVG9vbHRpcCkpIHtcclxuICAgICAgICB0aWNrLnRvb2x0aXAgPSB0aGlzLnZpZXdPcHRpb25zLnRpY2tzVG9vbHRpcCh2YWx1ZSk7XHJcbiAgICAgICAgdGljay50b29sdGlwUGxhY2VtZW50ID0gdGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCA/ICdyaWdodCcgOiAndG9wJztcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3NWYWx1ZXMgJiYgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRpY2tWYWx1ZVN0ZXApICYmXHJcbiAgICAgICAgICBNYXRoSGVscGVyLmlzTW9kdWxvV2l0aGluUHJlY2lzaW9uTGltaXQodmFsdWUsIHRpY2tWYWx1ZVN0ZXAsIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXQpKSB7XHJcbiAgICAgICAgdGljay52YWx1ZSA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlKHZhbHVlLCBMYWJlbFR5cGUuVGlja1ZhbHVlKTtcclxuICAgICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja3NWYWx1ZXNUb29sdGlwKSkge1xyXG4gICAgICAgICAgdGljay52YWx1ZVRvb2x0aXAgPSB0aGlzLnZpZXdPcHRpb25zLnRpY2tzVmFsdWVzVG9vbHRpcCh2YWx1ZSk7XHJcbiAgICAgICAgICB0aWNrLnZhbHVlVG9vbHRpcFBsYWNlbWVudCA9IHRoaXMudmlld09wdGlvbnMudmVydGljYWxcclxuICAgICAgICAgICAgPyAncmlnaHQnXHJcbiAgICAgICAgICAgIDogJ3RvcCc7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgbGVnZW5kOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheSkpIHtcclxuICAgICAgICBjb25zdCBzdGVwOiBDdXN0b21TdGVwRGVmaW5pdGlvbiA9IHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheVt2YWx1ZV07XHJcbiAgICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldFN0ZXBMZWdlbmQpKSB7XHJcbiAgICAgICAgICBsZWdlbmQgPSB0aGlzLnZpZXdPcHRpb25zLmdldFN0ZXBMZWdlbmQoc3RlcCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoc3RlcCkpIHtcclxuICAgICAgICAgIGxlZ2VuZCA9IHN0ZXAubGVnZW5kO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5nZXRMZWdlbmQpKSB7XHJcbiAgICAgICAgbGVnZW5kID0gdGhpcy52aWV3T3B0aW9ucy5nZXRMZWdlbmQodmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQobGVnZW5kKSkge1xyXG4gICAgICAgIHRpY2subGVnZW5kID0gbGVnZW5kO1xyXG4gICAgICAgIGhhc0F0TGVhc3RPbmVMZWdlbmQgPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGljaztcclxuICAgIH0pO1xyXG5cclxuICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNsaWRlckVsZW1lbnRXaXRoTGVnZW5kQ2xhc3MgPSBoYXNBdExlYXN0T25lTGVnZW5kOyB9KTtcclxuXHJcbiAgICAvLyBXZSBzaG91bGQgYXZvaWQgcmUtY3JlYXRpbmcgdGhlIHRpY2tzIGFycmF5IGlmIHBvc3NpYmxlXHJcbiAgICAvLyBUaGlzIGJvdGggaW1wcm92ZXMgcGVyZm9ybWFuY2UgYW5kIG1ha2VzIENTUyBhbmltYXRpb25zIHdvcmsgY29ycmVjdGx5XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudGlja3MpICYmIHRoaXMudGlja3MubGVuZ3RoID09PSBuZXdUaWNrcy5sZW5ndGgpIHtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSAgPCBuZXdUaWNrcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy50aWNrc1tpXSwgbmV3VGlja3NbaV0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnRpY2tzID0gbmV3VGlja3M7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLmlzUmVmRGVzdHJveWVkKCkpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3Rpb25SZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRUaWNrc0FycmF5KCk6IG51bWJlcltdIHtcclxuICAgIGNvbnN0IHN0ZXA6IG51bWJlciA9ICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCkpID8gdGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCA6IHRoaXMudmlld09wdGlvbnMuc3RlcDtcclxuICAgIGNvbnN0IHRpY2tzQXJyYXk6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgY29uc3QgbnVtYmVyT2ZWYWx1ZXM6IG51bWJlciA9IDEgKyBNYXRoLmZsb29yKE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KFxyXG4gICAgICBNYXRoLmFicyh0aGlzLnZpZXdPcHRpb25zLmNlaWwgLSB0aGlzLnZpZXdPcHRpb25zLmZsb29yKSAvIHN0ZXAsXHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXRcclxuICAgICkpO1xyXG4gICAgZm9yIChsZXQgaW5kZXg6IG51bWJlciA9IDA7IGluZGV4IDwgbnVtYmVyT2ZWYWx1ZXM7ICsraW5kZXgpIHtcclxuICAgICAgdGlja3NBcnJheS5wdXNoKE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld09wdGlvbnMuZmxvb3IgKyBzdGVwICogaW5kZXgsIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXQpKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGlja3NBcnJheTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNUaWNrU2VsZWN0ZWQodmFsdWU6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgaWYgKCF0aGlzLnJhbmdlKSB7XHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRnJvbVZhbHVlKSkge1xyXG4gICAgICAgIGNvbnN0IGNlbnRlcjogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRnJvbVZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLnZpZXdMb3dWYWx1ZSA+IGNlbnRlciAmJlxyXG4gICAgICAgICAgICB2YWx1ZSA+PSBjZW50ZXIgJiZcclxuICAgICAgICAgICAgdmFsdWUgPD0gdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy52aWV3TG93VmFsdWUgPCBjZW50ZXIgJiZcclxuICAgICAgICAgICAgICAgICAgIHZhbHVlIDw9IGNlbnRlciAmJlxyXG4gICAgICAgICAgICAgICAgICAgdmFsdWUgPj0gdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJFbmQpIHtcclxuICAgICAgICBpZiAodmFsdWUgPj0gdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXIgJiYgdmFsdWUgPD0gdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJhbmdlICYmIHZhbHVlID49IHRoaXMudmlld0xvd1ZhbHVlICYmIHZhbHVlIDw9IHRoaXMudmlld0hpZ2hWYWx1ZSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgcG9zaXRpb24gb2YgdGhlIGZsb29yIGxhYmVsXHJcbiAgcHJpdmF0ZSB1cGRhdGVGbG9vckxhYmVsKCk6IHZvaWQge1xyXG4gICAgaWYgKCF0aGlzLmZsb29yTGFiZWxFbGVtZW50LmFsd2F5c0hpZGUpIHtcclxuICAgICAgdGhpcy5mbG9vckxhYmVsRWxlbWVudC5zZXRWYWx1ZSh0aGlzLmdldERpc3BsYXlWYWx1ZSh0aGlzLnZpZXdPcHRpb25zLmZsb29yLCBMYWJlbFR5cGUuRmxvb3IpKTtcclxuICAgICAgdGhpcy5mbG9vckxhYmVsRWxlbWVudC5jYWxjdWxhdGVEaW1lbnNpb24oKTtcclxuICAgICAgY29uc3QgcG9zaXRpb246IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnRcclxuICAgICAgICA/IHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gdGhpcy5mbG9vckxhYmVsRWxlbWVudC5kaW1lbnNpb25cclxuICAgICAgICA6IDA7XHJcbiAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIHBvc2l0aW9uIG9mIHRoZSBjZWlsaW5nIGxhYmVsXHJcbiAgcHJpdmF0ZSB1cGRhdGVDZWlsTGFiZWwoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuY2VpbExhYmVsRWxlbWVudC5hbHdheXNIaWRlKSB7XHJcbiAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudC5zZXRWYWx1ZSh0aGlzLmdldERpc3BsYXlWYWx1ZSh0aGlzLnZpZXdPcHRpb25zLmNlaWwsIExhYmVsVHlwZS5DZWlsKSk7XHJcbiAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudC5jYWxjdWxhdGVEaW1lbnNpb24oKTtcclxuICAgICAgY29uc3QgcG9zaXRpb246IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnRcclxuICAgICAgICA/IDBcclxuICAgICAgICA6IHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gdGhpcy5jZWlsTGFiZWxFbGVtZW50LmRpbWVuc2lvbjtcclxuICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBzbGlkZXIgaGFuZGxlcyBhbmQgbGFiZWwgcG9zaXRpb25zXHJcbiAgcHJpdmF0ZSB1cGRhdGVIYW5kbGVzKHdoaWNoOiBQb2ludGVyVHlwZSwgbmV3UG9zOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICh3aGljaCA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlTG93SGFuZGxlKG5ld1Bvcyk7XHJcbiAgICB9IGVsc2UgaWYgKHdoaWNoID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgdGhpcy51cGRhdGVIaWdoSGFuZGxlKG5ld1Bvcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVTZWxlY3Rpb25CYXIoKTtcclxuICAgIHRoaXMudXBkYXRlVGlja3NTY2FsZSgpO1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy51cGRhdGVDb21iaW5lZExhYmVsKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gd29yayBvdXQgdGhlIHBvc2l0aW9uIGZvciBoYW5kbGUgbGFiZWxzIGRlcGVuZGluZyBvbiBSVEwgb3Igbm90XHJcbiAgcHJpdmF0ZSBnZXRIYW5kbGVMYWJlbFBvcyhsYWJlbFR5cGU6IFBvaW50ZXJUeXBlLCBuZXdQb3M6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBsYWJlbERpbWVuc2lvbjogbnVtYmVyID0gKGxhYmVsVHlwZSA9PT0gUG9pbnRlclR5cGUuTWluKVxyXG4gICAgICA/IHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LmRpbWVuc2lvblxyXG4gICAgICA6IHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LmRpbWVuc2lvbjtcclxuICAgIGNvbnN0IG5lYXJIYW5kbGVQb3M6IG51bWJlciA9IG5ld1BvcyAtIGxhYmVsRGltZW5zaW9uIC8gMiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuICAgIGNvbnN0IGVuZE9mQmFyUG9zOiBudW1iZXIgPSB0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIGxhYmVsRGltZW5zaW9uO1xyXG5cclxuICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5ib3VuZFBvaW50ZXJMYWJlbHMpIHtcclxuICAgICAgcmV0dXJuIG5lYXJIYW5kbGVQb3M7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0ICYmIGxhYmVsVHlwZSA9PT0gUG9pbnRlclR5cGUuTWluKSB8fFxyXG4gICAgICAgKCF0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0ICYmIGxhYmVsVHlwZSA9PT0gUG9pbnRlclR5cGUuTWF4KSkge1xyXG4gICAgICByZXR1cm4gTWF0aC5taW4obmVhckhhbmRsZVBvcywgZW5kT2ZCYXJQb3MpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG5lYXJIYW5kbGVQb3MsIDApLCBlbmRPZkJhclBvcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgbG93IHNsaWRlciBoYW5kbGUgcG9zaXRpb24gYW5kIGxhYmVsXHJcbiAgcHJpdmF0ZSB1cGRhdGVMb3dIYW5kbGUobmV3UG9zOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5zZXRQb3NpdGlvbihuZXdQb3MpO1xyXG4gICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuc2V0VmFsdWUodGhpcy5nZXREaXNwbGF5VmFsdWUodGhpcy52aWV3TG93VmFsdWUsIExhYmVsVHlwZS5Mb3cpKTtcclxuICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LnNldFBvc2l0aW9uKHRoaXMuZ2V0SGFuZGxlTGFiZWxQb3MoUG9pbnRlclR5cGUuTWluLCBuZXdQb3MpKTtcclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuZ2V0UG9pbnRlckNvbG9yKSkge1xyXG4gICAgICB0aGlzLm1pblBvaW50ZXJTdHlsZSA9IHtcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuZ2V0UG9pbnRlckNvbG9yKFBvaW50ZXJUeXBlLk1pbiksXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuYXV0b0hpZGVMaW1pdExhYmVscykge1xyXG4gICAgICB0aGlzLnVwZGF0ZUZsb29yQW5kQ2VpbExhYmVsc1Zpc2liaWxpdHkoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBoaWdoIHNsaWRlciBoYW5kbGUgcG9zaXRpb24gYW5kIGxhYmVsXHJcbiAgcHJpdmF0ZSB1cGRhdGVIaWdoSGFuZGxlKG5ld1BvczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuc2V0UG9zaXRpb24obmV3UG9zKTtcclxuICAgIHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LnNldFZhbHVlKHRoaXMuZ2V0RGlzcGxheVZhbHVlKHRoaXMudmlld0hpZ2hWYWx1ZSwgTGFiZWxUeXBlLkhpZ2gpKTtcclxuICAgIHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LnNldFBvc2l0aW9uKHRoaXMuZ2V0SGFuZGxlTGFiZWxQb3MoUG9pbnRlclR5cGUuTWF4LCBuZXdQb3MpKTtcclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuZ2V0UG9pbnRlckNvbG9yKSkge1xyXG4gICAgICB0aGlzLm1heFBvaW50ZXJTdHlsZSA9IHtcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuZ2V0UG9pbnRlckNvbG9yKFBvaW50ZXJUeXBlLk1heCksXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hdXRvSGlkZUxpbWl0TGFiZWxzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRmxvb3JBbmRDZWlsTGFiZWxzVmlzaWJpbGl0eSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gU2hvdy9oaWRlIGZsb29yL2NlaWxpbmcgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUZsb29yQW5kQ2VpbExhYmVsc1Zpc2liaWxpdHkoKTogdm9pZCB7XHJcbiAgICAvLyBTaG93IGJhc2VkIG9ubHkgb24gaGlkZUxpbWl0TGFiZWxzIGlmIHBvaW50ZXIgbGFiZWxzIGFyZSBoaWRkZW5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmhpZGVQb2ludGVyTGFiZWxzKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGxldCBmbG9vckxhYmVsSGlkZGVuOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBsZXQgY2VpbExhYmVsSGlkZGVuOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBjb25zdCBpc01pbkxhYmVsQXRGbG9vcjogYm9vbGVhbiA9IHRoaXMuaXNMYWJlbEJlbG93Rmxvb3JMYWJlbCh0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudCk7XHJcbiAgICBjb25zdCBpc01pbkxhYmVsQXRDZWlsOiBib29sZWFuID0gdGhpcy5pc0xhYmVsQWJvdmVDZWlsTGFiZWwodGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQpO1xyXG4gICAgY29uc3QgaXNNYXhMYWJlbEF0Q2VpbDogYm9vbGVhbiA9IHRoaXMuaXNMYWJlbEFib3ZlQ2VpbExhYmVsKHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50KTtcclxuICAgIGNvbnN0IGlzQ29tYmluZWRMYWJlbEF0Rmxvb3I6IGJvb2xlYW4gPSB0aGlzLmlzTGFiZWxCZWxvd0Zsb29yTGFiZWwodGhpcy5jb21iaW5lZExhYmVsRWxlbWVudCk7XHJcbiAgICBjb25zdCBpc0NvbWJpbmVkTGFiZWxBdENlaWw6IGJvb2xlYW4gPSB0aGlzLmlzTGFiZWxBYm92ZUNlaWxMYWJlbCh0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50KTtcclxuXHJcbiAgICBpZiAoaXNNaW5MYWJlbEF0Rmxvb3IpIHtcclxuICAgICAgZmxvb3JMYWJlbEhpZGRlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuaGlkZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZmxvb3JMYWJlbEhpZGRlbiA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNNaW5MYWJlbEF0Q2VpbCkge1xyXG4gICAgICBjZWlsTGFiZWxIaWRkZW4gPSB0cnVlO1xyXG4gICAgICB0aGlzLmNlaWxMYWJlbEVsZW1lbnQuaGlkZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2VpbExhYmVsSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudC5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgY29uc3QgaGlkZUNlaWw6IGJvb2xlYW4gPSB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LmlzVmlzaWJsZSgpID8gaXNDb21iaW5lZExhYmVsQXRDZWlsIDogaXNNYXhMYWJlbEF0Q2VpbDtcclxuICAgICAgY29uc3QgaGlkZUZsb29yOiBib29sZWFuID0gdGhpcy5jb21iaW5lZExhYmVsRWxlbWVudC5pc1Zpc2libGUoKSA/IGlzQ29tYmluZWRMYWJlbEF0Rmxvb3IgOiBpc01pbkxhYmVsQXRGbG9vcjtcclxuXHJcbiAgICAgIGlmIChoaWRlQ2VpbCkge1xyXG4gICAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWNlaWxMYWJlbEhpZGRlbikge1xyXG4gICAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudC5zaG93KCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIEhpZGUgb3Igc2hvdyBmbG9vciBsYWJlbFxyXG4gICAgICBpZiAoaGlkZUZsb29yKSB7XHJcbiAgICAgICAgdGhpcy5mbG9vckxhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoIWZsb29yTGFiZWxIaWRkZW4pIHtcclxuICAgICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0xhYmVsQmVsb3dGbG9vckxhYmVsKGxhYmVsOiBTbGlkZXJMYWJlbERpcmVjdGl2ZSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgcG9zOiBudW1iZXIgPSBsYWJlbC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGRpbTogbnVtYmVyID0gbGFiZWwuZGltZW5zaW9uO1xyXG4gICAgY29uc3QgZmxvb3JQb3M6IG51bWJlciA9IHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQucG9zaXRpb247XHJcbiAgICBjb25zdCBmbG9vckRpbTogbnVtYmVyID0gdGhpcy5mbG9vckxhYmVsRWxlbWVudC5kaW1lbnNpb247XHJcbiAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICA/IHBvcyArIGRpbSA+PSBmbG9vclBvcyAtIDJcclxuICAgICAgOiBwb3MgPD0gZmxvb3JQb3MgKyBmbG9vckRpbSArIDI7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzTGFiZWxBYm92ZUNlaWxMYWJlbChsYWJlbDogU2xpZGVyTGFiZWxEaXJlY3RpdmUpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHBvczogbnVtYmVyID0gbGFiZWwucG9zaXRpb247XHJcbiAgICBjb25zdCBkaW06IG51bWJlciA9IGxhYmVsLmRpbWVuc2lvbjtcclxuICAgIGNvbnN0IGNlaWxQb3M6IG51bWJlciA9IHRoaXMuY2VpbExhYmVsRWxlbWVudC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGNlaWxEaW06IG51bWJlciA9IHRoaXMuY2VpbExhYmVsRWxlbWVudC5kaW1lbnNpb247XHJcbiAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICA/IHBvcyA8PSBjZWlsUG9zICsgY2VpbERpbSArIDJcclxuICAgICAgOiBwb3MgKyBkaW0gPj0gY2VpbFBvcyAtIDI7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgc2xpZGVyIHNlbGVjdGlvbiBiYXIsIGNvbWJpbmVkIGxhYmVsIGFuZCByYW5nZSBsYWJlbFxyXG4gIHByaXZhdGUgdXBkYXRlU2VsZWN0aW9uQmFyKCk6IHZvaWQge1xyXG4gICAgbGV0IHBvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG4gICAgbGV0IGRpbWVuc2lvbjogbnVtYmVyID0gMDtcclxuICAgIGNvbnN0IGlzU2VsZWN0aW9uQmFyRnJvbVJpZ2h0OiBib29sZWFuID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gIXRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckVuZFxyXG4gICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRW5kO1xyXG4gICAgY29uc3QgcG9zaXRpb25Gb3JSYW5nZTogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gdGhpcy5tYXhIYW5kbGVFbGVtZW50LnBvc2l0aW9uICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uXHJcbiAgICAgICAgOiB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24gKyB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb247XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgZGltZW5zaW9uID0gTWF0aC5hYnModGhpcy5tYXhIYW5kbGVFbGVtZW50LnBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uKTtcclxuICAgICAgcG9zaXRpb24gPSBwb3NpdGlvbkZvclJhbmdlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWUpKSB7XHJcbiAgICAgICAgY29uc3QgY2VudGVyOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWU7XHJcbiAgICAgICAgY29uc3QgY2VudGVyUG9zaXRpb246IG51bWJlciA9IHRoaXMudmFsdWVUb1Bvc2l0aW9uKGNlbnRlcik7XHJcbiAgICAgICAgY29uc3QgaXNNb2RlbEdyZWF0ZXJUaGFuQ2VudGVyOiBib29sZWFuID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgICAgICA/IHRoaXMudmlld0xvd1ZhbHVlIDw9IGNlbnRlclxyXG4gICAgICAgICAgICA6IHRoaXMudmlld0xvd1ZhbHVlID4gY2VudGVyO1xyXG4gICAgICAgIGlmIChpc01vZGVsR3JlYXRlclRoYW5DZW50ZXIpIHtcclxuICAgICAgICAgIGRpbWVuc2lvbiA9IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiAtIGNlbnRlclBvc2l0aW9uO1xyXG4gICAgICAgICAgcG9zaXRpb24gPSBjZW50ZXJQb3NpdGlvbiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGltZW5zaW9uID0gY2VudGVyUG9zaXRpb24gLSB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb247XHJcbiAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNTZWxlY3Rpb25CYXJGcm9tUmlnaHQpIHtcclxuICAgICAgICBkaW1lbnNpb24gPSBNYXRoLmNlaWwoTWF0aC5hYnModGhpcy5tYXhIYW5kbGVQb3NpdGlvbiAtIHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbikgKyB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb24pO1xyXG4gICAgICAgIHBvc2l0aW9uID0gTWF0aC5mbG9vcih0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24gKyB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb24pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRpbWVuc2lvbiA9IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuICAgICAgICBwb3NpdGlvbiA9IDA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudC5zZXREaW1lbnNpb24oZGltZW5zaW9uKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XHJcbiAgICBpZiAodGhpcy5yYW5nZSAmJiB0aGlzLnZpZXdPcHRpb25zLnNob3dPdXRlclNlbGVjdGlvbkJhcnMpIHtcclxuICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldERpbWVuc2lvbihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5yaWdodE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXRQb3NpdGlvbigwKTtcclxuICAgICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgICAgIHRoaXMubGVmdE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXREaW1lbnNpb24odGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSAocG9zaXRpb24gKyBkaW1lbnNpb24pKTtcclxuICAgICAgICB0aGlzLmxlZnRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQuc2V0UG9zaXRpb24ocG9zaXRpb24gKyBkaW1lbnNpb24pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubGVmdE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXREaW1lbnNpb24ocG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMubGVmdE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXRQb3NpdGlvbigwKTtcclxuICAgICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgICAgIHRoaXMucmlnaHRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQuc2V0RGltZW5zaW9uKHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gKHBvc2l0aW9uICsgZGltZW5zaW9uKSk7XHJcbiAgICAgICAgdGhpcy5yaWdodE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXRQb3NpdGlvbihwb3NpdGlvbiArIGRpbWVuc2lvbik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5nZXRTZWxlY3Rpb25CYXJDb2xvcikpIHtcclxuICAgICAgY29uc3QgY29sb3I6IHN0cmluZyA9IHRoaXMuZ2V0U2VsZWN0aW9uQmFyQ29sb3IoKTtcclxuICAgICAgdGhpcy5iYXJTdHlsZSA9IHtcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGNvbG9yLFxyXG4gICAgICB9O1xyXG4gICAgfSBlbHNlIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zZWxlY3Rpb25CYXJHcmFkaWVudCkpIHtcclxuICAgICAgY29uc3Qgb2Zmc2V0OiBudW1iZXIgPSAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZSkpXHJcbiAgICAgICAgICAgID8gdGhpcy52YWx1ZVRvUG9zaXRpb24odGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRnJvbVZhbHVlKVxyXG4gICAgICAgICAgICA6IDA7XHJcbiAgICAgIGNvbnN0IHJldmVyc2VkOiBib29sZWFuID0gKG9mZnNldCAtIHBvc2l0aW9uID4gMCAmJiAhaXNTZWxlY3Rpb25CYXJGcm9tUmlnaHQpIHx8IChvZmZzZXQgLSBwb3NpdGlvbiA8PSAwICYmIGlzU2VsZWN0aW9uQmFyRnJvbVJpZ2h0KTtcclxuICAgICAgY29uc3QgZGlyZWN0aW9uOiBzdHJpbmcgPSB0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsXHJcbiAgICAgICAgICA/IHJldmVyc2VkID8gJ2JvdHRvbScgOiAndG9wJ1xyXG4gICAgICAgICAgOiByZXZlcnNlZCA/ICdsZWZ0JyA6ICdyaWdodCc7XHJcbiAgICAgIHRoaXMuYmFyU3R5bGUgPSB7XHJcbiAgICAgICAgYmFja2dyb3VuZEltYWdlOlxyXG4gICAgICAgICAgJ2xpbmVhci1ncmFkaWVudCh0byAnICtcclxuICAgICAgICAgIGRpcmVjdGlvbiArXHJcbiAgICAgICAgICAnLCAnICtcclxuICAgICAgICAgIHRoaXMudmlld09wdGlvbnMuc2VsZWN0aW9uQmFyR3JhZGllbnQuZnJvbSArXHJcbiAgICAgICAgICAnIDAlLCcgK1xyXG4gICAgICAgICAgdGhpcy52aWV3T3B0aW9ucy5zZWxlY3Rpb25CYXJHcmFkaWVudC50byArXHJcbiAgICAgICAgICAnIDEwMCUpJyxcclxuICAgICAgfTtcclxuICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMudmVydGljYWwpIHtcclxuICAgICAgICB0aGlzLmJhclN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9XHJcbiAgICAgICAgICAnY2VudGVyICcgK1xyXG4gICAgICAgICAgKG9mZnNldCArXHJcbiAgICAgICAgICAgIGRpbWVuc2lvbiArXHJcbiAgICAgICAgICAgIHBvc2l0aW9uICtcclxuICAgICAgICAgICAgKHJldmVyc2VkID8gLXRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbiA6IDApKSArXHJcbiAgICAgICAgICAncHgnO1xyXG4gICAgICAgIHRoaXMuYmFyU3R5bGUuYmFja2dyb3VuZFNpemUgPVxyXG4gICAgICAgICAgJzEwMCUgJyArICh0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbikgKyAncHgnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuYmFyU3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID1cclxuICAgICAgICAgIG9mZnNldCAtXHJcbiAgICAgICAgICBwb3NpdGlvbiArXHJcbiAgICAgICAgICAocmV2ZXJzZWQgPyB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb24gOiAwKSArXHJcbiAgICAgICAgICAncHggY2VudGVyJztcclxuICAgICAgICB0aGlzLmJhclN0eWxlLmJhY2tncm91bmRTaXplID1cclxuICAgICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uICsgJ3B4IDEwMCUnO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBXcmFwcGVyIGFyb3VuZCB0aGUgZ2V0U2VsZWN0aW9uQmFyQ29sb3Igb2YgdGhlIHVzZXIgdG8gcGFzcyB0byBjb3JyZWN0IHBhcmFtZXRlcnNcclxuICBwcml2YXRlIGdldFNlbGVjdGlvbkJhckNvbG9yKCk6IHN0cmluZyB7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy5nZXRTZWxlY3Rpb25CYXJDb2xvcihcclxuICAgICAgICB0aGlzLnZhbHVlLFxyXG4gICAgICAgIHRoaXMuaGlnaFZhbHVlXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy5nZXRTZWxlY3Rpb25CYXJDb2xvcih0aGlzLnZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8vIFdyYXBwZXIgYXJvdW5kIHRoZSBnZXRQb2ludGVyQ29sb3Igb2YgdGhlIHVzZXIgdG8gcGFzcyB0byAgY29ycmVjdCBwYXJhbWV0ZXJzXHJcbiAgcHJpdmF0ZSBnZXRQb2ludGVyQ29sb3IocG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlKTogc3RyaW5nIHtcclxuICAgIGlmIChwb2ludGVyVHlwZSA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLmdldFBvaW50ZXJDb2xvcihcclxuICAgICAgICB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgICBwb2ludGVyVHlwZVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMuZ2V0UG9pbnRlckNvbG9yKFxyXG4gICAgICB0aGlzLnZhbHVlLFxyXG4gICAgICBwb2ludGVyVHlwZVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIC8vIFdyYXBwZXIgYXJvdW5kIHRoZSBnZXRUaWNrQ29sb3Igb2YgdGhlIHVzZXIgdG8gcGFzcyB0byBjb3JyZWN0IHBhcmFtZXRlcnNcclxuICBwcml2YXRlIGdldFRpY2tDb2xvcih2YWx1ZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLmdldFRpY2tDb2xvcih2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgY29tYmluZWQgbGFiZWwgcG9zaXRpb24gYW5kIHZhbHVlXHJcbiAgcHJpdmF0ZSB1cGRhdGVDb21iaW5lZExhYmVsKCk6IHZvaWQge1xyXG4gICAgbGV0IGlzTGFiZWxPdmVybGFwOiBib29sZWFuID0gbnVsbDtcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIGlzTGFiZWxPdmVybGFwID1cclxuICAgICAgICB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5wb3NpdGlvbiAtIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LmRpbWVuc2lvbiAtIDEwIDw9IHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LnBvc2l0aW9uO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXNMYWJlbE92ZXJsYXAgPVxyXG4gICAgICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LnBvc2l0aW9uICsgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuZGltZW5zaW9uICsgMTAgPj0gdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQucG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGlzTGFiZWxPdmVybGFwKSB7XHJcbiAgICAgIGNvbnN0IGxvd0Rpc3BsYXlWYWx1ZTogc3RyaW5nID0gdGhpcy5nZXREaXNwbGF5VmFsdWUodGhpcy52aWV3TG93VmFsdWUsIExhYmVsVHlwZS5Mb3cpO1xyXG4gICAgICBjb25zdCBoaWdoRGlzcGxheVZhbHVlOiBzdHJpbmcgPSB0aGlzLmdldERpc3BsYXlWYWx1ZSh0aGlzLnZpZXdIaWdoVmFsdWUsIExhYmVsVHlwZS5IaWdoKTtcclxuICAgICAgY29uc3QgY29tYmluZWRMYWJlbFZhbHVlOiBzdHJpbmcgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyB0aGlzLnZpZXdPcHRpb25zLmNvbWJpbmVMYWJlbHMoaGlnaERpc3BsYXlWYWx1ZSwgbG93RGlzcGxheVZhbHVlKVxyXG4gICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5jb21iaW5lTGFiZWxzKGxvd0Rpc3BsYXlWYWx1ZSwgaGlnaERpc3BsYXlWYWx1ZSk7XHJcblxyXG4gICAgICB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LnNldFZhbHVlKGNvbWJpbmVkTGFiZWxWYWx1ZSk7XHJcbiAgICAgIGNvbnN0IHBvczogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5ib3VuZFBvaW50ZXJMYWJlbHNcclxuICAgICAgICA/IE1hdGgubWluKFxyXG4gICAgICAgICAgICBNYXRoLm1heChcclxuICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQucG9zaXRpb24gK1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50LmRpbWVuc2lvbiAvIDIgLVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb21iaW5lZExhYmVsRWxlbWVudC5kaW1lbnNpb24gLyAyLFxyXG4gICAgICAgICAgICAgIDBcclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LmRpbWVuc2lvblxyXG4gICAgICAgICAgKVxyXG4gICAgICAgIDogdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50LnBvc2l0aW9uICsgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50LmRpbWVuc2lvbiAvIDIgLSB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LmRpbWVuc2lvbiAvIDI7XHJcblxyXG4gICAgICB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LnNldFBvc2l0aW9uKHBvcyk7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LmhpZGUoKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuaGlkZSgpO1xyXG4gICAgICB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBkYXRlSGlnaEhhbmRsZSh0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdIaWdoVmFsdWUpKTtcclxuICAgICAgdGhpcy51cGRhdGVMb3dIYW5kbGUodGhpcy52YWx1ZVRvUG9zaXRpb24odGhpcy52aWV3TG93VmFsdWUpKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuc2hvdygpO1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5zaG93KCk7XHJcbiAgICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuaGlkZSgpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuYXV0b0hpZGVMaW1pdExhYmVscykge1xyXG4gICAgICB0aGlzLnVwZGF0ZUZsb29yQW5kQ2VpbExhYmVsc1Zpc2liaWxpdHkoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFJldHVybiB0aGUgdHJhbnNsYXRlZCB2YWx1ZSBpZiBhIHRyYW5zbGF0ZSBmdW5jdGlvbiBpcyBwcm92aWRlZCBlbHNlIHRoZSBvcmlnaW5hbCB2YWx1ZVxyXG4gIHByaXZhdGUgZ2V0RGlzcGxheVZhbHVlKHZhbHVlOiBudW1iZXIsIHdoaWNoOiBMYWJlbFR5cGUpOiBzdHJpbmcge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpICYmICF0aGlzLnZpZXdPcHRpb25zLmJpbmRJbmRleEZvclN0ZXBzQXJyYXkpIHtcclxuICAgICAgdmFsdWUgPSB0aGlzLmdldFN0ZXBWYWx1ZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUodmFsdWUsIHdoaWNoKTtcclxuICB9XHJcblxyXG4gIC8vIFJvdW5kIHZhbHVlIHRvIHN0ZXAgYW5kIHByZWNpc2lvbiBiYXNlZCBvbiBtaW5WYWx1ZVxyXG4gIHByaXZhdGUgcm91bmRTdGVwKHZhbHVlOiBudW1iZXIsIGN1c3RvbVN0ZXA/OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3Qgc3RlcDogbnVtYmVyID0gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGN1c3RvbVN0ZXApID8gY3VzdG9tU3RlcCA6IHRoaXMudmlld09wdGlvbnMuc3RlcDtcclxuICAgIGxldCBzdGVwcGVkRGlmZmVyZW5jZTogbnVtYmVyID0gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQoXHJcbiAgICAgICh2YWx1ZSAtIHRoaXMudmlld09wdGlvbnMuZmxvb3IpIC8gc3RlcCwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICBzdGVwcGVkRGlmZmVyZW5jZSA9IE1hdGgucm91bmQoc3RlcHBlZERpZmZlcmVuY2UpICogc3RlcDtcclxuICAgIHJldHVybiBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdCh0aGlzLnZpZXdPcHRpb25zLmZsb29yICsgc3RlcHBlZERpZmZlcmVuY2UsIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXQpO1xyXG4gIH1cclxuXHJcbiAgLy8gVHJhbnNsYXRlIHZhbHVlIHRvIHBpeGVsIHBvc2l0aW9uXHJcbiAgcHJpdmF0ZSB2YWx1ZVRvUG9zaXRpb24odmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgbGV0IGZuOiBWYWx1ZVRvUG9zaXRpb25GdW5jdGlvbiAgPSBWYWx1ZUhlbHBlci5saW5lYXJWYWx1ZVRvUG9zaXRpb247XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuY3VzdG9tVmFsdWVUb1Bvc2l0aW9uKSkge1xyXG4gICAgICBmbiA9IHRoaXMudmlld09wdGlvbnMuY3VzdG9tVmFsdWVUb1Bvc2l0aW9uO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnZpZXdPcHRpb25zLmxvZ1NjYWxlKSB7XHJcbiAgICAgIGZuID0gVmFsdWVIZWxwZXIubG9nVmFsdWVUb1Bvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHZhbCA9IE1hdGhIZWxwZXIuY2xhbXBUb1JhbmdlKHZhbCwgdGhpcy52aWV3T3B0aW9ucy5mbG9vciwgdGhpcy52aWV3T3B0aW9ucy5jZWlsKTtcclxuICAgIGxldCBwZXJjZW50OiBudW1iZXIgPSBmbih2YWwsIHRoaXMudmlld09wdGlvbnMuZmxvb3IsIHRoaXMudmlld09wdGlvbnMuY2VpbCk7XHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQocGVyY2VudCkpIHtcclxuICAgICAgcGVyY2VudCA9IDA7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCkge1xyXG4gICAgICBwZXJjZW50ID0gMSAtIHBlcmNlbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcGVyY2VudCAqIHRoaXMubWF4SGFuZGxlUG9zaXRpb247XHJcbiAgfVxyXG5cclxuICAvLyBUcmFuc2xhdGUgcG9zaXRpb24gdG8gbW9kZWwgdmFsdWVcclxuICBwcml2YXRlIHBvc2l0aW9uVG9WYWx1ZShwb3NpdGlvbjogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGxldCBwZXJjZW50OiBudW1iZXIgPSBwb3NpdGlvbiAvIHRoaXMubWF4SGFuZGxlUG9zaXRpb247XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCkge1xyXG4gICAgICBwZXJjZW50ID0gMSAtIHBlcmNlbnQ7XHJcbiAgICB9XHJcbiAgICBsZXQgZm46IFBvc2l0aW9uVG9WYWx1ZUZ1bmN0aW9uID0gVmFsdWVIZWxwZXIubGluZWFyUG9zaXRpb25Ub1ZhbHVlO1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmN1c3RvbVBvc2l0aW9uVG9WYWx1ZSkpIHtcclxuICAgICAgZm4gPSB0aGlzLnZpZXdPcHRpb25zLmN1c3RvbVBvc2l0aW9uVG9WYWx1ZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy52aWV3T3B0aW9ucy5sb2dTY2FsZSkge1xyXG4gICAgICBmbiA9IFZhbHVlSGVscGVyLmxvZ1Bvc2l0aW9uVG9WYWx1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IHZhbHVlOiBudW1iZXIgPSBmbihwZXJjZW50LCB0aGlzLnZpZXdPcHRpb25zLmZsb29yLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpO1xyXG4gICAgcmV0dXJuICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh2YWx1ZSkgPyB2YWx1ZSA6IDA7XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgdGhlIFgtY29vcmRpbmF0ZSBvciBZLWNvb3JkaW5hdGUgb2YgYW4gZXZlbnRcclxuICBwcml2YXRlIGdldEV2ZW50WFkoZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCwgdGFyZ2V0VG91Y2hJZD86IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50KSB7XHJcbiAgICAgIHJldHVybiAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCB8fCB0aGlzLnZpZXdPcHRpb25zLnJvdGF0ZSAhPT0gMCkgPyBldmVudC5jbGllbnRZIDogZXZlbnQuY2xpZW50WDtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgdG91Y2hJbmRleDogbnVtYmVyID0gMDtcclxuICAgIGNvbnN0IHRvdWNoZXM6IFRvdWNoTGlzdCA9IGV2ZW50LnRvdWNoZXM7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRhcmdldFRvdWNoSWQpKSB7XHJcbiAgICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKHRvdWNoZXNbaV0uaWRlbnRpZmllciA9PT0gdGFyZ2V0VG91Y2hJZCkge1xyXG4gICAgICAgICAgdG91Y2hJbmRleCA9IGk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSZXR1cm4gdGhlIHRhcmdldCB0b3VjaCBvciBpZiB0aGUgdGFyZ2V0IHRvdWNoIHdhcyBub3QgZm91bmQgaW4gdGhlIGV2ZW50XHJcbiAgICAvLyByZXR1cm5zIHRoZSBjb29yZGluYXRlcyBvZiB0aGUgZmlyc3QgdG91Y2hcclxuICAgIHJldHVybiAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCB8fCB0aGlzLnZpZXdPcHRpb25zLnJvdGF0ZSAhPT0gMCkgPyB0b3VjaGVzW3RvdWNoSW5kZXhdLmNsaWVudFkgOiB0b3VjaGVzW3RvdWNoSW5kZXhdLmNsaWVudFg7XHJcbiAgfVxyXG5cclxuICAvLyBDb21wdXRlIHRoZSBldmVudCBwb3NpdGlvbiBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgc2xpZGVyIGlzIGhvcml6b250YWwgb3IgdmVydGljYWxcclxuICBwcml2YXRlIGdldEV2ZW50UG9zaXRpb24oZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCwgdGFyZ2V0VG91Y2hJZD86IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBzbGlkZXJFbGVtZW50Qm91bmRpbmdSZWN0OiBDbGllbnRSZWN0ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcblxyXG4gICAgY29uc3Qgc2xpZGVyUG9zOiBudW1iZXIgPSAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCB8fCB0aGlzLnZpZXdPcHRpb25zLnJvdGF0ZSAhPT0gMCkgP1xyXG4gICAgICBzbGlkZXJFbGVtZW50Qm91bmRpbmdSZWN0LmJvdHRvbSA6IHNsaWRlckVsZW1lbnRCb3VuZGluZ1JlY3QubGVmdDtcclxuICAgIGxldCBldmVudFBvczogbnVtYmVyID0gMDtcclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCB8fCB0aGlzLnZpZXdPcHRpb25zLnJvdGF0ZSAhPT0gMCkge1xyXG4gICAgICBldmVudFBvcyA9IC10aGlzLmdldEV2ZW50WFkoZXZlbnQsIHRhcmdldFRvdWNoSWQpICsgc2xpZGVyUG9zO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnRQb3MgPSB0aGlzLmdldEV2ZW50WFkoZXZlbnQsIHRhcmdldFRvdWNoSWQpIC0gc2xpZGVyUG9zO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBldmVudFBvcyAqIHRoaXMudmlld09wdGlvbnMuc2NhbGUgLSB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb247XHJcbiAgfVxyXG5cclxuICAvLyBHZXQgdGhlIGhhbmRsZSBjbG9zZXN0IHRvIGFuIGV2ZW50XHJcbiAgcHJpdmF0ZSBnZXROZWFyZXN0SGFuZGxlKGV2ZW50OiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQpOiBQb2ludGVyVHlwZSB7XHJcbiAgICBpZiAoIXRoaXMucmFuZ2UpIHtcclxuICAgICAgcmV0dXJuIFBvaW50ZXJUeXBlLk1pbjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID0gdGhpcy5nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcclxuICAgIGNvbnN0IGRpc3RhbmNlTWluOiBudW1iZXIgPSBNYXRoLmFicyhwb3NpdGlvbiAtIHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbik7XHJcbiAgICBjb25zdCBkaXN0YW5jZU1heDogbnVtYmVyID0gTWF0aC5hYnMocG9zaXRpb24gLSB0aGlzLm1heEhhbmRsZUVsZW1lbnQucG9zaXRpb24pO1xyXG5cclxuICAgIGlmIChkaXN0YW5jZU1pbiA8IGRpc3RhbmNlTWF4KSB7XHJcbiAgICAgIHJldHVybiBQb2ludGVyVHlwZS5NaW47XHJcbiAgICB9IGVsc2UgaWYgKGRpc3RhbmNlTWluID4gZGlzdGFuY2VNYXgpIHtcclxuICAgICAgcmV0dXJuIFBvaW50ZXJUeXBlLk1heDtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgLy8gaWYgZXZlbnQgaXMgYXQgdGhlIHNhbWUgZGlzdGFuY2UgZnJvbSBtaW4vbWF4IHRoZW4gaWYgaXQncyBhdCBsZWZ0IG9mIG1pbkgsIHdlIHJldHVybiBtaW5IIGVsc2UgbWF4SFxyXG4gICAgICByZXR1cm4gcG9zaXRpb24gPCB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24gPyBQb2ludGVyVHlwZS5NaW4gOiBQb2ludGVyVHlwZS5NYXg7XHJcbiAgICB9XHJcbiAgICAvLyByZXZlcnNlIGluIHJ0bFxyXG4gICAgcmV0dXJuIHBvc2l0aW9uID4gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uID8gUG9pbnRlclR5cGUuTWluIDogUG9pbnRlclR5cGUuTWF4O1xyXG4gIH1cclxuXHJcbiAgLy8gQmluZCBtb3VzZSBhbmQgdG91Y2ggZXZlbnRzIHRvIHNsaWRlciBoYW5kbGVzXHJcbiAgcHJpdmF0ZSBiaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgY29uc3QgZHJhZ2dhYmxlUmFuZ2U6IGJvb2xlYW4gPSB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlO1xyXG5cclxuICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5vbmx5QmluZEhhbmRsZXMpIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50Lm9uKCdtb3VzZWRvd24nLFxyXG4gICAgICAgIChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4gdGhpcy5vbkJhclN0YXJ0KG51bGwsIGRyYWdnYWJsZVJhbmdlLCBldmVudCwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5kcmFnZ2FibGVSYW5nZU9ubHkpIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50Lm9uKCdtb3VzZWRvd24nLFxyXG4gICAgICAgIChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4gdGhpcy5vbkJhclN0YXJ0KFBvaW50ZXJUeXBlLk1pbiwgZHJhZ2dhYmxlUmFuZ2UsIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQoUG9pbnRlclR5cGUuTWF4LCBkcmFnZ2FibGVSYW5nZSwgZXZlbnQsIHRydWUsIHRydWUpXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uU3RhcnQoUG9pbnRlclR5cGUuTWluLCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50Lm9uKCdtb3VzZWRvd24nLFxyXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uU3RhcnQoUG9pbnRlclR5cGUuTWF4LCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5vbmx5QmluZEhhbmRsZXMpIHtcclxuICAgICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50Lm9uKCdtb3VzZWRvd24nLFxyXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uU3RhcnQobnVsbCwgZXZlbnQsIHRydWUsIHRydWUsIHRydWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnRpY2tzRWxlbWVudC5vbignbW91c2Vkb3duJyxcclxuICAgICAgICAgIChldmVudDogTW91c2VFdmVudCk6IHZvaWQgPT4gdGhpcy5vblN0YXJ0KG51bGwsIGV2ZW50LCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMudmlld09wdGlvbnMub25seUJpbmRIYW5kbGVzKSB7XHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudC5vblBhc3NpdmUoJ3RvdWNoc3RhcnQnLFxyXG4gICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vbkJhclN0YXJ0KG51bGwsIGRyYWdnYWJsZVJhbmdlLCBldmVudCwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlT25seSkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25CYXJTdGFydChQb2ludGVyVHlwZS5NaW4sIGRyYWdnYWJsZVJhbmdlLCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50Lm9uUGFzc2l2ZSgndG91Y2hzdGFydCcsXHJcbiAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQoUG9pbnRlclR5cGUuTWF4LCBkcmFnZ2FibGVSYW5nZSwgZXZlbnQsIHRydWUsIHRydWUpXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChQb2ludGVyVHlwZS5NaW4sIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5vblBhc3NpdmUoJ3RvdWNoc3RhcnQnLFxyXG4gICAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCA9PiB0aGlzLm9uU3RhcnQoUG9pbnRlclR5cGUuTWF4LCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgICApO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5vbmx5QmluZEhhbmRsZXMpIHtcclxuICAgICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50Lm9uUGFzc2l2ZSgndG91Y2hzdGFydCcsXHJcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChudWxsLCBldmVudCwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlja3NFbGVtZW50Lm9uUGFzc2l2ZSgndG91Y2hzdGFydCcsXHJcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChudWxsLCBldmVudCwgZmFsc2UsIGZhbHNlLCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5rZXlib2FyZFN1cHBvcnQpIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50Lm9uKCdmb2N1cycsICgpOiB2b2lkID0+IHRoaXMub25Qb2ludGVyRm9jdXMoUG9pbnRlclR5cGUuTWluKSk7XHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50Lm9uKCdmb2N1cycsICgpOiB2b2lkID0+IHRoaXMub25Qb2ludGVyRm9jdXMoUG9pbnRlclR5cGUuTWF4KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0T3B0aW9uc0luZmx1ZW5jaW5nRXZlbnRCaW5kaW5ncyhvcHRpb25zOiBPcHRpb25zKTogYm9vbGVhbltdIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIG9wdGlvbnMuZGlzYWJsZWQsXHJcbiAgICAgIG9wdGlvbnMucmVhZE9ubHksXHJcbiAgICAgIG9wdGlvbnMuZHJhZ2dhYmxlUmFuZ2UsXHJcbiAgICAgIG9wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5LFxyXG4gICAgICBvcHRpb25zLm9ubHlCaW5kSGFuZGxlcyxcclxuICAgICAgb3B0aW9ucy5rZXlib2FyZFN1cHBvcnRcclxuICAgIF07XHJcbiAgfVxyXG5cclxuICAvLyBVbmJpbmQgbW91c2UgYW5kIHRvdWNoIGV2ZW50cyB0byBzbGlkZXIgaGFuZGxlc1xyXG4gIHByaXZhdGUgdW5iaW5kRXZlbnRzKCk6IHZvaWQge1xyXG4gICAgdGhpcy51bnN1YnNjcmliZU9uTW92ZSgpO1xyXG4gICAgdGhpcy51bnN1YnNjcmliZU9uRW5kKCk7XHJcblxyXG4gICAgZm9yIChjb25zdCBlbGVtZW50IG9mIHRoaXMuZ2V0QWxsU2xpZGVyRWxlbWVudHMoKSkge1xyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGVsZW1lbnQpKSB7XHJcbiAgICAgICAgZWxlbWVudC5vZmYoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkJhclN0YXJ0KHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSwgZHJhZ2dhYmxlUmFuZ2U6IGJvb2xlYW4sIGV2ZW50OiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQsXHJcbiAgICBiaW5kTW92ZTogYm9vbGVhbiwgYmluZEVuZDogYm9vbGVhbiwgc2ltdWxhdGVJbW1lZGlhdGVNb3ZlPzogYm9vbGVhbiwgc2ltdWxhdGVJbW1lZGlhdGVFbmQ/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBpZiAoZHJhZ2dhYmxlUmFuZ2UpIHtcclxuICAgICAgdGhpcy5vbkRyYWdTdGFydChwb2ludGVyVHlwZSwgZXZlbnQsIGJpbmRNb3ZlLCBiaW5kRW5kKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMub25TdGFydChwb2ludGVyVHlwZSwgZXZlbnQsIGJpbmRNb3ZlLCBiaW5kRW5kLCBzaW11bGF0ZUltbWVkaWF0ZU1vdmUsIHNpbXVsYXRlSW1tZWRpYXRlRW5kKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIG9uU3RhcnQgZXZlbnQgaGFuZGxlclxyXG4gIHByaXZhdGUgb25TdGFydChwb2ludGVyVHlwZTogUG9pbnRlclR5cGUsIGV2ZW50OiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQsXHJcbiAgICAgIGJpbmRNb3ZlOiBib29sZWFuLCBiaW5kRW5kOiBib29sZWFuLCBzaW11bGF0ZUltbWVkaWF0ZU1vdmU/OiBib29sZWFuLCBzaW11bGF0ZUltbWVkaWF0ZUVuZD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgLy8gT25seSBjYWxsIHByZXZlbnREZWZhdWx0KCkgd2hlbiBoYW5kbGluZyBub24tcGFzc2l2ZSBldmVudHMgKHBhc3NpdmUgZXZlbnRzIGRvbid0IG5lZWQgaXQpXHJcbiAgICBpZiAoIUNvbXBhdGliaWxpdHlIZWxwZXIuaXNUb3VjaEV2ZW50KGV2ZW50KSAmJiAhc3VwcG9ydHNQYXNzaXZlRXZlbnRzKSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAvLyBXZSBoYXZlIHRvIGRvIHRoaXMgaW4gY2FzZSB0aGUgSFRNTCB3aGVyZSB0aGUgc2xpZGVycyBhcmUgb25cclxuICAgIC8vIGhhdmUgYmVlbiBhbmltYXRlZCBpbnRvIHZpZXcuXHJcbiAgICB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKCk7XHJcblxyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHBvaW50ZXJUeXBlKSkge1xyXG4gICAgICBwb2ludGVyVHlwZSA9IHRoaXMuZ2V0TmVhcmVzdEhhbmRsZShldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gcG9pbnRlclR5cGU7XHJcblxyXG4gICAgY29uc3QgcG9pbnRlckVsZW1lbnQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZSA9IHRoaXMuZ2V0UG9pbnRlckVsZW1lbnQocG9pbnRlclR5cGUpO1xyXG4gICAgcG9pbnRlckVsZW1lbnQuYWN0aXZlID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5rZXlib2FyZFN1cHBvcnQpIHtcclxuICAgICAgcG9pbnRlckVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmluZE1vdmUpIHtcclxuICAgICAgdGhpcy51bnN1YnNjcmliZU9uTW92ZSgpO1xyXG5cclxuICAgICAgY29uc3Qgb25Nb3ZlQ2FsbGJhY2s6ICgoZTogTW91c2VFdmVudHxUb3VjaEV2ZW50KSA9PiB2b2lkKSA9XHJcbiAgICAgICAgKGU6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5kcmFnZ2luZy5hY3RpdmUgPyB0aGlzLm9uRHJhZ01vdmUoZSkgOiB0aGlzLm9uTW92ZShlKTtcclxuXHJcbiAgICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzVG91Y2hFdmVudChldmVudCkpIHtcclxuICAgICAgICB0aGlzLm9uTW92ZUV2ZW50TGlzdGVuZXIgPSB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuYXR0YWNoUGFzc2l2ZUV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICBkb2N1bWVudCwgJ3RvdWNobW92ZScsIG9uTW92ZUNhbGxiYWNrKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uTW92ZUV2ZW50TGlzdGVuZXIgPSB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuYXR0YWNoRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgIGRvY3VtZW50LCAnbW91c2Vtb3ZlJywgb25Nb3ZlQ2FsbGJhY2spO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGJpbmRFbmQpIHtcclxuICAgICAgdGhpcy51bnN1YnNjcmliZU9uRW5kKCk7XHJcblxyXG4gICAgICBjb25zdCBvbkVuZENhbGxiYWNrOiAoKGU6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCkgPT4gdm9pZCkgPVxyXG4gICAgICAgIChlOiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25FbmQoZSk7XHJcblxyXG4gICAgICBpZiAoQ29tcGF0aWJpbGl0eUhlbHBlci5pc1RvdWNoRXZlbnQoZXZlbnQpKSB7XHJcbiAgICAgICAgdGhpcy5vbkVuZEV2ZW50TGlzdGVuZXIgPSB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuYXR0YWNoUGFzc2l2ZUV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICd0b3VjaGVuZCcsIG9uRW5kQ2FsbGJhY2spO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25FbmRFdmVudExpc3RlbmVyID0gdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmF0dGFjaEV2ZW50TGlzdGVuZXIoZG9jdW1lbnQsICdtb3VzZXVwJywgb25FbmRDYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVzZXJDaGFuZ2VTdGFydC5lbWl0KHRoaXMuZ2V0Q2hhbmdlQ29udGV4dCgpKTtcclxuXHJcbiAgICBpZiAoQ29tcGF0aWJpbGl0eUhlbHBlci5pc1RvdWNoRXZlbnQoZXZlbnQpICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCgoZXZlbnQgYXMgVG91Y2hFdmVudCkuY2hhbmdlZFRvdWNoZXMpKSB7XHJcbiAgICAgIC8vIFN0b3JlIHRoZSB0b3VjaCBpZGVudGlmaWVyXHJcbiAgICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnRvdWNoSWQpKSB7XHJcbiAgICAgICAgdGhpcy50b3VjaElkID0gKGV2ZW50IGFzIFRvdWNoRXZlbnQpLmNoYW5nZWRUb3VjaGVzWzBdLmlkZW50aWZpZXI7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDbGljayBldmVudHMsIGVpdGhlciB3aXRoIG1vdXNlIG9yIHRvdWNoIGdlc3R1cmUgYXJlIHdlaXJkLiBTb21ldGltZXMgdGhleSByZXN1bHQgaW4gZnVsbFxyXG4gICAgLy8gc3RhcnQsIG1vdmUsIGVuZCBzZXF1ZW5jZSwgYW5kIHNvbWV0aW1lcywgdGhleSBkb24ndCAtIHRoZXkgb25seSBpbnZva2UgbW91c2Vkb3duXHJcbiAgICAvLyBBcyBhIHdvcmthcm91bmQsIHdlIHNpbXVsYXRlIHRoZSBmaXJzdCBtb3ZlIGV2ZW50IGFuZCB0aGUgZW5kIGV2ZW50IGlmIGl0J3MgbmVjZXNzYXJ5XHJcbiAgICBpZiAoc2ltdWxhdGVJbW1lZGlhdGVNb3ZlKSB7XHJcbiAgICAgIHRoaXMub25Nb3ZlKGV2ZW50LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc2ltdWxhdGVJbW1lZGlhdGVFbmQpIHtcclxuICAgICAgdGhpcy5vbkVuZChldmVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBvbk1vdmUgZXZlbnQgaGFuZGxlclxyXG4gIHByaXZhdGUgb25Nb3ZlKGV2ZW50OiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQsIGZyb21UaWNrPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgbGV0IHRvdWNoRm9yVGhpc1NsaWRlcjogVG91Y2ggPSBudWxsO1xyXG5cclxuICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzVG91Y2hFdmVudChldmVudCkpIHtcclxuICAgICAgY29uc3QgY2hhbmdlZFRvdWNoZXM6IFRvdWNoTGlzdCA9IChldmVudCBhcyBUb3VjaEV2ZW50KS5jaGFuZ2VkVG91Y2hlcztcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgaWYgKGNoYW5nZWRUb3VjaGVzW2ldLmlkZW50aWZpZXIgPT09IHRoaXMudG91Y2hJZCkge1xyXG4gICAgICAgICAgdG91Y2hGb3JUaGlzU2xpZGVyID0gY2hhbmdlZFRvdWNoZXNbaV07XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0b3VjaEZvclRoaXNTbGlkZXIpKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuYW5pbWF0ZSAmJiAhdGhpcy52aWV3T3B0aW9ucy5hbmltYXRlT25Nb3ZlKSB7XHJcbiAgICAgIGlmICh0aGlzLm1vdmluZykge1xyXG4gICAgICAgIHRoaXMuc2xpZGVyRWxlbWVudEFuaW1hdGVDbGFzcyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG5cclxuICAgIGNvbnN0IG5ld1BvczogbnVtYmVyID0gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRvdWNoRm9yVGhpc1NsaWRlcilcclxuICAgICAgPyB0aGlzLmdldEV2ZW50UG9zaXRpb24oZXZlbnQsIHRvdWNoRm9yVGhpc1NsaWRlci5pZGVudGlmaWVyKVxyXG4gICAgICA6IHRoaXMuZ2V0RXZlbnRQb3NpdGlvbihldmVudCk7XHJcbiAgICBsZXQgbmV3VmFsdWU6IG51bWJlcjtcclxuICAgIGNvbnN0IGNlaWxWYWx1ZTogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gdGhpcy52aWV3T3B0aW9ucy5mbG9vclxyXG4gICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5jZWlsO1xyXG4gICAgY29uc3QgZmxvb3JWYWx1ZTogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCA/IHRoaXMudmlld09wdGlvbnMuY2VpbCA6IHRoaXMudmlld09wdGlvbnMuZmxvb3I7XHJcblxyXG4gICAgaWYgKG5ld1BvcyA8PSAwKSB7XHJcbiAgICAgIG5ld1ZhbHVlID0gZmxvb3JWYWx1ZTtcclxuICAgIH0gZWxzZSBpZiAobmV3UG9zID49IHRoaXMubWF4SGFuZGxlUG9zaXRpb24pIHtcclxuICAgICAgbmV3VmFsdWUgPSBjZWlsVmFsdWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdWYWx1ZSA9IHRoaXMucG9zaXRpb25Ub1ZhbHVlKG5ld1Bvcyk7XHJcbiAgICAgIGlmIChmcm9tVGljayAmJiAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCkpIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMucm91bmRTdGVwKG5ld1ZhbHVlLCB0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMucm91bmRTdGVwKG5ld1ZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5wb3NpdGlvblRyYWNraW5nSGFuZGxlKG5ld1ZhbHVlKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25FbmQoZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCk6IHZvaWQge1xyXG4gICAgaWYgKENvbXBhdGliaWxpdHlIZWxwZXIuaXNUb3VjaEV2ZW50KGV2ZW50KSkge1xyXG4gICAgICBjb25zdCBjaGFuZ2VkVG91Y2hlczogVG91Y2hMaXN0ID0gKGV2ZW50IGFzIFRvdWNoRXZlbnQpLmNoYW5nZWRUb3VjaGVzO1xyXG4gICAgICBpZiAoY2hhbmdlZFRvdWNoZXNbMF0uaWRlbnRpZmllciAhPT0gdGhpcy50b3VjaElkKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tb3ZpbmcgPSBmYWxzZTtcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmFuaW1hdGUpIHtcclxuICAgICAgdGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnRvdWNoSWQgPSBudWxsO1xyXG5cclxuICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5rZXlib2FyZFN1cHBvcnQpIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRyYWdnaW5nLmFjdGl2ZSA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMudW5zdWJzY3JpYmVPbk1vdmUoKTtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVPbkVuZCgpO1xyXG5cclxuICAgIHRoaXMudXNlckNoYW5nZUVuZC5lbWl0KHRoaXMuZ2V0Q2hhbmdlQ29udGV4dCgpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25Qb2ludGVyRm9jdXMocG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlKTogdm9pZCB7XHJcbiAgICBjb25zdCBwb2ludGVyRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlID0gdGhpcy5nZXRQb2ludGVyRWxlbWVudChwb2ludGVyVHlwZSk7XHJcbiAgICBwb2ludGVyRWxlbWVudC5vbignYmx1cicsICgpOiB2b2lkID0+IHRoaXMub25Qb2ludGVyQmx1cihwb2ludGVyRWxlbWVudCkpO1xyXG4gICAgcG9pbnRlckVsZW1lbnQub24oJ2tleWRvd24nLCAoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkID0+IHRoaXMub25LZXlib2FyZEV2ZW50KGV2ZW50KSk7XHJcbiAgICBwb2ludGVyRWxlbWVudC5vbigna2V5dXAnLCAoKTogdm9pZCA9PiB0aGlzLm9uS2V5VXAoKSk7XHJcbiAgICBwb2ludGVyRWxlbWVudC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9IHBvaW50ZXJUeXBlO1xyXG4gICAgdGhpcy5jdXJyZW50Rm9jdXNQb2ludGVyID0gcG9pbnRlclR5cGU7XHJcbiAgICB0aGlzLmZpcnN0S2V5RG93biA9IHRydWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uS2V5VXAoKTogdm9pZCB7XHJcbiAgICB0aGlzLmZpcnN0S2V5RG93biA9IHRydWU7XHJcbiAgICB0aGlzLnVzZXJDaGFuZ2VFbmQuZW1pdCh0aGlzLmdldENoYW5nZUNvbnRleHQoKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uUG9pbnRlckJsdXIocG9pbnRlcjogU2xpZGVySGFuZGxlRGlyZWN0aXZlKTogdm9pZCB7XHJcbiAgICBwb2ludGVyLm9mZignYmx1cicpO1xyXG4gICAgcG9pbnRlci5vZmYoJ2tleWRvd24nKTtcclxuICAgIHBvaW50ZXIub2ZmKCdrZXl1cCcpO1xyXG4gICAgcG9pbnRlci5hY3RpdmUgPSBmYWxzZTtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnRvdWNoSWQpKSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9IG51bGw7XHJcbiAgICAgIHRoaXMuY3VycmVudEZvY3VzUG9pbnRlciA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldEtleUFjdGlvbnMoY3VycmVudFZhbHVlOiBudW1iZXIpOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSB7XHJcbiAgICBjb25zdCB2YWx1ZVJhbmdlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLmNlaWwgLSB0aGlzLnZpZXdPcHRpb25zLmZsb29yO1xyXG5cclxuICAgIGxldCBpbmNyZWFzZVN0ZXA6IG51bWJlciA9IGN1cnJlbnRWYWx1ZSArIHRoaXMudmlld09wdGlvbnMuc3RlcDtcclxuICAgIGxldCBkZWNyZWFzZVN0ZXA6IG51bWJlciA9IGN1cnJlbnRWYWx1ZSAtIHRoaXMudmlld09wdGlvbnMuc3RlcDtcclxuICAgIGxldCBpbmNyZWFzZVBhZ2U6IG51bWJlciA9IGN1cnJlbnRWYWx1ZSArIHZhbHVlUmFuZ2UgLyAxMDtcclxuICAgIGxldCBkZWNyZWFzZVBhZ2U6IG51bWJlciA9IGN1cnJlbnRWYWx1ZSAtIHZhbHVlUmFuZ2UgLyAxMDtcclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5yZXZlcnNlZENvbnRyb2xzKSB7XHJcbiAgICAgIGluY3JlYXNlU3RlcCA9IGN1cnJlbnRWYWx1ZSAtIHRoaXMudmlld09wdGlvbnMuc3RlcDtcclxuICAgICAgZGVjcmVhc2VTdGVwID0gY3VycmVudFZhbHVlICsgdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgICBpbmNyZWFzZVBhZ2UgPSBjdXJyZW50VmFsdWUgLSB2YWx1ZVJhbmdlIC8gMTA7XHJcbiAgICAgIGRlY3JlYXNlUGFnZSA9IGN1cnJlbnRWYWx1ZSArIHZhbHVlUmFuZ2UgLyAxMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBMZWZ0IHRvIHJpZ2h0IGRlZmF1bHQgYWN0aW9uc1xyXG4gICAgY29uc3QgYWN0aW9uczoge1trZXk6IHN0cmluZ106IG51bWJlcn0gPSB7XHJcbiAgICAgIFVQOiBpbmNyZWFzZVN0ZXAsXHJcbiAgICAgIERPV046IGRlY3JlYXNlU3RlcCxcclxuICAgICAgTEVGVDogZGVjcmVhc2VTdGVwLFxyXG4gICAgICBSSUdIVDogaW5jcmVhc2VTdGVwLFxyXG4gICAgICBQQUdFVVA6IGluY3JlYXNlUGFnZSxcclxuICAgICAgUEFHRURPV046IGRlY3JlYXNlUGFnZSxcclxuICAgICAgSE9NRTogdGhpcy52aWV3T3B0aW9ucy5yZXZlcnNlZENvbnRyb2xzID8gdGhpcy52aWV3T3B0aW9ucy5jZWlsIDogdGhpcy52aWV3T3B0aW9ucy5mbG9vcixcclxuICAgICAgRU5EOiB0aGlzLnZpZXdPcHRpb25zLnJldmVyc2VkQ29udHJvbHMgPyB0aGlzLnZpZXdPcHRpb25zLmZsb29yIDogdGhpcy52aWV3T3B0aW9ucy5jZWlsLFxyXG4gICAgfTtcclxuICAgIC8vIHJpZ2h0IHRvIGxlZnQgbWVhbnMgc3dhcHBpbmcgcmlnaHQgYW5kIGxlZnQgYXJyb3dzXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCkge1xyXG4gICAgICBhY3Rpb25zLkxFRlQgPSBpbmNyZWFzZVN0ZXA7XHJcbiAgICAgIGFjdGlvbnMuUklHSFQgPSBkZWNyZWFzZVN0ZXA7XHJcbiAgICAgIC8vIHJpZ2h0IHRvIGxlZnQgYW5kIHZlcnRpY2FsIG1lYW5zIHdlIGFsc28gc3dhcCB1cCBhbmQgZG93blxyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCB8fCB0aGlzLnZpZXdPcHRpb25zLnJvdGF0ZSAhPT0gMCkge1xyXG4gICAgICAgIGFjdGlvbnMuVVAgPSBkZWNyZWFzZVN0ZXA7XHJcbiAgICAgICAgYWN0aW9ucy5ET1dOID0gaW5jcmVhc2VTdGVwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYWN0aW9ucztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25LZXlib2FyZEV2ZW50KGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBjdXJyZW50VmFsdWU6IG51bWJlciA9IHRoaXMuZ2V0Q3VycmVudFRyYWNraW5nVmFsdWUoKTtcclxuICAgIGNvbnN0IGtleUNvZGU6IG51bWJlciA9ICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChldmVudC5rZXlDb2RlKVxyXG4gICAgICA/IGV2ZW50LmtleUNvZGVcclxuICAgICAgOiBldmVudC53aGljaDtcclxuICAgIGNvbnN0IGtleXM6IHtba2V5Q29kZTogbnVtYmVyXTogc3RyaW5nfSA9IHtcclxuICAgICAgICAzODogJ1VQJyxcclxuICAgICAgICA0MDogJ0RPV04nLFxyXG4gICAgICAgIDM3OiAnTEVGVCcsXHJcbiAgICAgICAgMzk6ICdSSUdIVCcsXHJcbiAgICAgICAgMzM6ICdQQUdFVVAnLFxyXG4gICAgICAgIDM0OiAnUEFHRURPV04nLFxyXG4gICAgICAgIDM2OiAnSE9NRScsXHJcbiAgICAgICAgMzU6ICdFTkQnLFxyXG4gICAgICB9O1xyXG4gICAgY29uc3QgYWN0aW9uczoge1trZXk6IHN0cmluZ106IG51bWJlcn0gPSB0aGlzLmdldEtleUFjdGlvbnMoY3VycmVudFZhbHVlKTtcclxuICAgIGNvbnN0IGtleTogc3RyaW5nID0ga2V5c1trZXlDb2RlXTtcclxuICAgIGNvbnN0IGFjdGlvbjogbnVtYmVyID0gYWN0aW9uc1trZXldO1xyXG5cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChhY3Rpb24pIHx8IFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlcikpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICBpZiAodGhpcy5maXJzdEtleURvd24pIHtcclxuICAgICAgdGhpcy5maXJzdEtleURvd24gPSBmYWxzZTtcclxuICAgICAgdGhpcy51c2VyQ2hhbmdlU3RhcnQuZW1pdCh0aGlzLmdldENoYW5nZUNvbnRleHQoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWN0aW9uVmFsdWU6IG51bWJlciA9IE1hdGhIZWxwZXIuY2xhbXBUb1JhbmdlKGFjdGlvbiwgdGhpcy52aWV3T3B0aW9ucy5mbG9vciwgdGhpcy52aWV3T3B0aW9ucy5jZWlsKTtcclxuICAgIGNvbnN0IG5ld1ZhbHVlOiBudW1iZXIgPSB0aGlzLnJvdW5kU3RlcChhY3Rpb25WYWx1ZSk7XHJcbiAgICBpZiAoIXRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5KSB7XHJcbiAgICAgIHRoaXMucG9zaXRpb25UcmFja2luZ0hhbmRsZShuZXdWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBkaWZmZXJlbmNlOiBudW1iZXIgPSB0aGlzLnZpZXdIaWdoVmFsdWUgLSB0aGlzLnZpZXdMb3dWYWx1ZTtcclxuICAgICAgbGV0IG5ld01pblZhbHVlOiBudW1iZXI7XHJcbiAgICAgIGxldCBuZXdNYXhWYWx1ZTogbnVtYmVyO1xyXG5cclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgbmV3TWluVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICBuZXdNYXhWYWx1ZSA9IG5ld1ZhbHVlICsgZGlmZmVyZW5jZTtcclxuICAgICAgICBpZiAobmV3TWF4VmFsdWUgPiB0aGlzLnZpZXdPcHRpb25zLmNlaWwpIHtcclxuICAgICAgICAgIG5ld01heFZhbHVlID0gdGhpcy52aWV3T3B0aW9ucy5jZWlsO1xyXG4gICAgICAgICAgbmV3TWluVmFsdWUgPSBuZXdNYXhWYWx1ZSAtIGRpZmZlcmVuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgbmV3TWF4VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICBuZXdNaW5WYWx1ZSA9IG5ld1ZhbHVlIC0gZGlmZmVyZW5jZTtcclxuICAgICAgICBpZiAobmV3TWluVmFsdWUgPCB0aGlzLnZpZXdPcHRpb25zLmZsb29yKSB7XHJcbiAgICAgICAgICBuZXdNaW5WYWx1ZSA9IHRoaXMudmlld09wdGlvbnMuZmxvb3I7XHJcbiAgICAgICAgICBuZXdNYXhWYWx1ZSA9IG5ld01pblZhbHVlICsgZGlmZmVyZW5jZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5wb3NpdGlvblRyYWNraW5nQmFyKG5ld01pblZhbHVlLCBuZXdNYXhWYWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBvbkRyYWdTdGFydCBldmVudCBoYW5kbGVyLCBoYW5kbGVzIGRyYWdnaW5nIG9mIHRoZSBtaWRkbGUgYmFyXHJcbiAgcHJpdmF0ZSBvbkRyYWdTdGFydChwb2ludGVyVHlwZTogUG9pbnRlclR5cGUsIGV2ZW50OiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQsXHJcbiAgICBiaW5kTW92ZTogYm9vbGVhbiwgYmluZEVuZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgY29uc3QgcG9zaXRpb246IG51bWJlciA9IHRoaXMuZ2V0RXZlbnRQb3NpdGlvbihldmVudCk7XHJcblxyXG4gICAgdGhpcy5kcmFnZ2luZyA9IG5ldyBEcmFnZ2luZygpO1xyXG4gICAgdGhpcy5kcmFnZ2luZy5hY3RpdmUgPSB0cnVlO1xyXG4gICAgdGhpcy5kcmFnZ2luZy52YWx1ZSA9IHRoaXMucG9zaXRpb25Ub1ZhbHVlKHBvc2l0aW9uKTtcclxuICAgIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZSA9IHRoaXMudmlld0hpZ2hWYWx1ZSAtIHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgdGhpcy5kcmFnZ2luZy5sb3dMaW1pdCA9IHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnRcclxuICAgICAgICA/IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiAtIHBvc2l0aW9uXHJcbiAgICAgICAgOiBwb3NpdGlvbiAtIHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbjtcclxuICAgIHRoaXMuZHJhZ2dpbmcuaGlnaExpbWl0ID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gcG9zaXRpb24gLSB0aGlzLm1heEhhbmRsZUVsZW1lbnQucG9zaXRpb25cclxuICAgICAgICA6IHRoaXMubWF4SGFuZGxlRWxlbWVudC5wb3NpdGlvbiAtIHBvc2l0aW9uO1xyXG5cclxuICAgIHRoaXMub25TdGFydChwb2ludGVyVHlwZSwgZXZlbnQsIGJpbmRNb3ZlLCBiaW5kRW5kKTtcclxuICB9XHJcblxyXG4gIC8qKiBHZXQgbWluIHZhbHVlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBuZXdQb3MgaXMgb3V0T2ZCb3VuZHMgYWJvdmUgb3IgYmVsb3cgdGhlIGJhciBhbmQgcmlnaHRUb0xlZnQgKi9cclxuICBwcml2YXRlIGdldE1pblZhbHVlKG5ld1BvczogbnVtYmVyLCBvdXRPZkJvdW5kczogYm9vbGVhbiwgaXNBYm92ZTogYm9vbGVhbik6IG51bWJlciB7XHJcbiAgICBjb25zdCBpc1JUTDogYm9vbGVhbiA9IHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQ7XHJcbiAgICBsZXQgdmFsdWU6IG51bWJlciA9IG51bGw7XHJcblxyXG4gICAgaWYgKG91dE9mQm91bmRzKSB7XHJcbiAgICAgIGlmIChpc0Fib3ZlKSB7XHJcbiAgICAgICAgdmFsdWUgPSBpc1JUTFxyXG4gICAgICAgICAgPyB0aGlzLnZpZXdPcHRpb25zLmZsb29yXHJcbiAgICAgICAgICA6IHRoaXMudmlld09wdGlvbnMuY2VpbCAtIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZSA9IGlzUlRMXHJcbiAgICAgICAgICA/IHRoaXMudmlld09wdGlvbnMuY2VpbCAtIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZVxyXG4gICAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLmZsb29yO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YWx1ZSA9IGlzUlRMXHJcbiAgICAgICAgPyB0aGlzLnBvc2l0aW9uVG9WYWx1ZShuZXdQb3MgKyB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0KVxyXG4gICAgICAgIDogdGhpcy5wb3NpdGlvblRvVmFsdWUobmV3UG9zIC0gdGhpcy5kcmFnZ2luZy5sb3dMaW1pdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5yb3VuZFN0ZXAodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCBtYXggdmFsdWUgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIG5ld1BvcyBpcyBvdXRPZkJvdW5kcyBhYm92ZSBvciBiZWxvdyB0aGUgYmFyIGFuZCByaWdodFRvTGVmdCAqL1xyXG4gIHByaXZhdGUgZ2V0TWF4VmFsdWUobmV3UG9zOiBudW1iZXIsIG91dE9mQm91bmRzOiBib29sZWFuLCBpc0Fib3ZlOiBib29sZWFuKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGlzUlRMOiBib29sZWFuID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdDtcclxuICAgIGxldCB2YWx1ZTogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgICBpZiAob3V0T2ZCb3VuZHMpIHtcclxuICAgICAgaWYgKGlzQWJvdmUpIHtcclxuICAgICAgICB2YWx1ZSA9IGlzUlRMXHJcbiAgICAgICAgICA/IHRoaXMudmlld09wdGlvbnMuZmxvb3IgKyB0aGlzLmRyYWdnaW5nLmRpZmZlcmVuY2VcclxuICAgICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5jZWlsO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gaXNSVExcclxuICAgICAgICAgID8gdGhpcy52aWV3T3B0aW9ucy5jZWlsXHJcbiAgICAgICAgICA6IHRoaXMudmlld09wdGlvbnMuZmxvb3IgKyB0aGlzLmRyYWdnaW5nLmRpZmZlcmVuY2U7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChpc1JUTCkge1xyXG4gICAgICAgIHZhbHVlID1cclxuICAgICAgICAgIHRoaXMucG9zaXRpb25Ub1ZhbHVlKG5ld1BvcyArIHRoaXMuZHJhZ2dpbmcubG93TGltaXQpICtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YWx1ZSA9XHJcbiAgICAgICAgICB0aGlzLnBvc2l0aW9uVG9WYWx1ZShuZXdQb3MgLSB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0KSArXHJcbiAgICAgICAgICB0aGlzLmRyYWdnaW5nLmRpZmZlcmVuY2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5yb3VuZFN0ZXAodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkRyYWdNb3ZlKGV2ZW50PzogTW91c2VFdmVudHxUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICBjb25zdCBuZXdQb3M6IG51bWJlciA9IHRoaXMuZ2V0RXZlbnRQb3NpdGlvbihldmVudCk7XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuYW5pbWF0ZSAmJiAhdGhpcy52aWV3T3B0aW9ucy5hbmltYXRlT25Nb3ZlKSB7XHJcbiAgICAgIGlmICh0aGlzLm1vdmluZykge1xyXG4gICAgICAgIHRoaXMuc2xpZGVyRWxlbWVudEFuaW1hdGVDbGFzcyA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5tb3ZpbmcgPSB0cnVlO1xyXG5cclxuICAgIGxldCBjZWlsTGltaXQ6IG51bWJlcixcclxuICAgICAgICBmbG9vckxpbWl0OiBudW1iZXIsXHJcbiAgICAgICAgZmxvb3JIYW5kbGVFbGVtZW50OiBTbGlkZXJIYW5kbGVEaXJlY3RpdmUsXHJcbiAgICAgICAgY2VpbEhhbmRsZUVsZW1lbnQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZTtcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIGNlaWxMaW1pdCA9IHRoaXMuZHJhZ2dpbmcubG93TGltaXQ7XHJcbiAgICAgIGZsb29yTGltaXQgPSB0aGlzLmRyYWdnaW5nLmhpZ2hMaW1pdDtcclxuICAgICAgZmxvb3JIYW5kbGVFbGVtZW50ID0gdGhpcy5tYXhIYW5kbGVFbGVtZW50O1xyXG4gICAgICBjZWlsSGFuZGxlRWxlbWVudCA9IHRoaXMubWluSGFuZGxlRWxlbWVudDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNlaWxMaW1pdCA9IHRoaXMuZHJhZ2dpbmcuaGlnaExpbWl0O1xyXG4gICAgICBmbG9vckxpbWl0ID0gdGhpcy5kcmFnZ2luZy5sb3dMaW1pdDtcclxuICAgICAgZmxvb3JIYW5kbGVFbGVtZW50ID0gdGhpcy5taW5IYW5kbGVFbGVtZW50O1xyXG4gICAgICBjZWlsSGFuZGxlRWxlbWVudCA9IHRoaXMubWF4SGFuZGxlRWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpc1VuZGVyRmxvb3JMaW1pdDogYm9vbGVhbiA9IChuZXdQb3MgPD0gZmxvb3JMaW1pdCk7XHJcbiAgICBjb25zdCBpc092ZXJDZWlsTGltaXQ6IGJvb2xlYW4gPSAobmV3UG9zID49IHRoaXMubWF4SGFuZGxlUG9zaXRpb24gLSBjZWlsTGltaXQpO1xyXG5cclxuICAgIGxldCBuZXdNaW5WYWx1ZTogbnVtYmVyO1xyXG4gICAgbGV0IG5ld01heFZhbHVlOiBudW1iZXI7XHJcbiAgICBpZiAoaXNVbmRlckZsb29yTGltaXQpIHtcclxuICAgICAgaWYgKGZsb29ySGFuZGxlRWxlbWVudC5wb3NpdGlvbiA9PT0gMCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBuZXdNaW5WYWx1ZSA9IHRoaXMuZ2V0TWluVmFsdWUobmV3UG9zLCB0cnVlLCBmYWxzZSk7XHJcbiAgICAgIG5ld01heFZhbHVlID0gdGhpcy5nZXRNYXhWYWx1ZShuZXdQb3MsIHRydWUsIGZhbHNlKTtcclxuICAgIH0gZWxzZSBpZiAoaXNPdmVyQ2VpbExpbWl0KSB7XHJcbiAgICAgIGlmIChjZWlsSGFuZGxlRWxlbWVudC5wb3NpdGlvbiA9PT0gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbikge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBuZXdNYXhWYWx1ZSA9IHRoaXMuZ2V0TWF4VmFsdWUobmV3UG9zLCB0cnVlLCB0cnVlKTtcclxuICAgICAgbmV3TWluVmFsdWUgPSB0aGlzLmdldE1pblZhbHVlKG5ld1BvcywgdHJ1ZSwgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdNaW5WYWx1ZSA9IHRoaXMuZ2V0TWluVmFsdWUobmV3UG9zLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgICBuZXdNYXhWYWx1ZSA9IHRoaXMuZ2V0TWF4VmFsdWUobmV3UG9zLCBmYWxzZSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucG9zaXRpb25UcmFja2luZ0JhcihuZXdNaW5WYWx1ZSwgbmV3TWF4VmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHRoZSBuZXcgdmFsdWUgYW5kIHBvc2l0aW9uIGZvciB0aGUgZW50aXJlIGJhclxyXG4gIHByaXZhdGUgcG9zaXRpb25UcmFja2luZ0JhcihuZXdNaW5WYWx1ZTogbnVtYmVyLCBuZXdNYXhWYWx1ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMubWluTGltaXQpICYmXHJcbiAgICAgICAgbmV3TWluVmFsdWUgPCB0aGlzLnZpZXdPcHRpb25zLm1pbkxpbWl0KSB7XHJcbiAgICAgIG5ld01pblZhbHVlID0gdGhpcy52aWV3T3B0aW9ucy5taW5MaW1pdDtcclxuICAgICAgbmV3TWF4VmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChuZXdNaW5WYWx1ZSArIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMubWF4TGltaXQpICYmXHJcbiAgICAgICAgbmV3TWF4VmFsdWUgPiB0aGlzLnZpZXdPcHRpb25zLm1heExpbWl0KSB7XHJcbiAgICAgIG5ld01heFZhbHVlID0gdGhpcy52aWV3T3B0aW9ucy5tYXhMaW1pdDtcclxuICAgICAgbmV3TWluVmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChuZXdNYXhWYWx1ZSAtIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy52aWV3TG93VmFsdWUgPSBuZXdNaW5WYWx1ZTtcclxuICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IG5ld01heFZhbHVlO1xyXG4gICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NaW4sIHRoaXMudmFsdWVUb1Bvc2l0aW9uKG5ld01pblZhbHVlKSk7XHJcbiAgICB0aGlzLnVwZGF0ZUhhbmRsZXMoUG9pbnRlclR5cGUuTWF4LCB0aGlzLnZhbHVlVG9Qb3NpdGlvbihuZXdNYXhWYWx1ZSkpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHRoZSBuZXcgdmFsdWUgYW5kIHBvc2l0aW9uIHRvIHRoZSBjdXJyZW50IHRyYWNraW5nIGhhbmRsZVxyXG4gIHByaXZhdGUgcG9zaXRpb25UcmFja2luZ0hhbmRsZShuZXdWYWx1ZTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICBuZXdWYWx1ZSA9IHRoaXMuYXBwbHlNaW5NYXhMaW1pdChuZXdWYWx1ZSk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5wdXNoUmFuZ2UpIHtcclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuYXBwbHlQdXNoUmFuZ2UobmV3VmFsdWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLm5vU3dpdGNoaW5nKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4gJiZcclxuICAgICAgICAgICAgICBuZXdWYWx1ZSA+IHRoaXMudmlld0hpZ2hWYWx1ZSkge1xyXG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuYXBwbHlNaW5NYXhSYW5nZSh0aGlzLnZpZXdIaWdoVmFsdWUpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1heCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA8IHRoaXMudmlld0xvd1ZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5hcHBseU1pbk1heFJhbmdlKHRoaXMudmlld0xvd1ZhbHVlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmFwcGx5TWluTWF4UmFuZ2UobmV3VmFsdWUpO1xyXG4gICAgICAgIC8qIFRoaXMgaXMgdG8gY2hlY2sgaWYgd2UgbmVlZCB0byBzd2l0Y2ggdGhlIG1pbiBhbmQgbWF4IGhhbmRsZXMgKi9cclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4gJiYgbmV3VmFsdWUgPiB0aGlzLnZpZXdIaWdoVmFsdWUpIHtcclxuICAgICAgICAgIHRoaXMudmlld0xvd1ZhbHVlID0gdGhpcy52aWV3SGlnaFZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NaW4sIHRoaXMubWF4SGFuZGxlRWxlbWVudC5wb3NpdGlvbik7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPSBQb2ludGVyVHlwZS5NYXg7XHJcbiAgICAgICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4ICYmXHJcbiAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZSA8IHRoaXMudmlld0xvd1ZhbHVlKSB7XHJcbiAgICAgICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSB0aGlzLnZpZXdMb3dWYWx1ZTtcclxuICAgICAgICAgIHRoaXMuYXBwbHlWaWV3Q2hhbmdlKCk7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZXMoUG9pbnRlclR5cGUuTWF4LCB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24pO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVBcmlhQXR0cmlidXRlcygpO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gUG9pbnRlclR5cGUuTWluO1xyXG4gICAgICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5rZXlib2FyZFN1cHBvcnQpIHtcclxuICAgICAgICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZ2V0Q3VycmVudFRyYWNraW5nVmFsdWUoKSAhPT0gbmV3VmFsdWUpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgdGhpcy52aWV3TG93VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgdGhpcy52aWV3SGlnaFZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZUhhbmRsZXModGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyLCB0aGlzLnZhbHVlVG9Qb3NpdGlvbihuZXdWYWx1ZSkpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5TWluTWF4TGltaXQobmV3VmFsdWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMubWluTGltaXQpICYmIG5ld1ZhbHVlIDwgdGhpcy52aWV3T3B0aW9ucy5taW5MaW1pdCkge1xyXG4gICAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy5taW5MaW1pdDtcclxuICAgIH1cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5tYXhMaW1pdCkgJiYgbmV3VmFsdWUgPiB0aGlzLnZpZXdPcHRpb25zLm1heExpbWl0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLm1heExpbWl0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseU1pbk1heFJhbmdlKG5ld1ZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3Qgb3Bwb3NpdGVWYWx1ZTogbnVtYmVyID0gKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKVxyXG4gICAgICA/IHRoaXMudmlld0hpZ2hWYWx1ZVxyXG4gICAgICA6IHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgY29uc3QgZGlmZmVyZW5jZTogbnVtYmVyID0gTWF0aC5hYnMobmV3VmFsdWUgLSBvcHBvc2l0ZVZhbHVlKTtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5taW5SYW5nZSkpIHtcclxuICAgICAgaWYgKGRpZmZlcmVuY2UgPCB0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgICByZXR1cm4gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQodGhpcy52aWV3SGlnaFZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5taW5SYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICAgICAgcmV0dXJuIE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0xvd1ZhbHVlICsgdGhpcy52aWV3T3B0aW9ucy5taW5SYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMubWF4UmFuZ2UpKSB7XHJcbiAgICAgIGlmIChkaWZmZXJlbmNlID4gdGhpcy52aWV3T3B0aW9ucy5tYXhSYW5nZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbikge1xyXG4gICAgICAgICAgcmV0dXJuIE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0hpZ2hWYWx1ZSAtIHRoaXMudmlld09wdGlvbnMubWF4UmFuZ2UsIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXQpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgICAgIHJldHVybiBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdCh0aGlzLnZpZXdMb3dWYWx1ZSArIHRoaXMudmlld09wdGlvbnMubWF4UmFuZ2UsIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseVB1c2hSYW5nZShuZXdWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGRpZmZlcmVuY2U6IG51bWJlciA9ICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbilcclxuICAgICAgICAgID8gdGhpcy52aWV3SGlnaFZhbHVlIC0gbmV3VmFsdWVcclxuICAgICAgICAgIDogbmV3VmFsdWUgLSB0aGlzLnZpZXdMb3dWYWx1ZTtcclxuICAgIGNvbnN0IG1pblJhbmdlOiBudW1iZXIgPSAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMubWluUmFuZ2UpKVxyXG4gICAgICAgICAgPyB0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlXHJcbiAgICAgICAgICA6IHRoaXMudmlld09wdGlvbnMuc3RlcDtcclxuICAgIGNvbnN0IG1heFJhbmdlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLm1heFJhbmdlO1xyXG4gICAgLy8gaWYgc21hbGxlciB0aGFuIG1pblJhbmdlXHJcbiAgICBpZiAoZGlmZmVyZW5jZSA8IG1pblJhbmdlKSB7XHJcbiAgICAgIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbikge1xyXG4gICAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KFxyXG4gICAgICAgICAgTWF0aC5taW4obmV3VmFsdWUgKyBtaW5SYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5jZWlsKSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgbmV3VmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdCh0aGlzLnZpZXdIaWdoVmFsdWUgLSBtaW5SYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZXMoUG9pbnRlclR5cGUuTWF4LCB0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdIaWdoVmFsdWUpKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICAgIHRoaXMudmlld0xvd1ZhbHVlID0gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQoXHJcbiAgICAgICAgICBNYXRoLm1heChuZXdWYWx1ZSAtIG1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLmZsb29yKSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgbmV3VmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdCh0aGlzLnZpZXdMb3dWYWx1ZSArIG1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NaW4sIHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0xvd1ZhbHVlKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVBcmlhQXR0cmlidXRlcygpO1xyXG4gICAgfSBlbHNlIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQobWF4UmFuZ2UpICYmIGRpZmZlcmVuY2UgPiBtYXhSYW5nZSkge1xyXG4gICAgICAvLyBpZiBncmVhdGVyIHRoYW4gbWF4UmFuZ2VcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgdGhpcy52aWV3SGlnaFZhbHVlID0gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQobmV3VmFsdWUgKyBtYXhSYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZXMoUG9pbnRlclR5cGUuTWF4LCB0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdIaWdoVmFsdWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICAgIHRoaXMudmlld0xvd1ZhbHVlID0gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQobmV3VmFsdWUgLSBtYXhSYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZXMoUG9pbnRlclR5cGUuTWluLCB0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdMb3dWYWx1ZSkpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlQXJpYUF0dHJpYnV0ZXMoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXdWYWx1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0Q2hhbmdlQ29udGV4dCgpOiBDaGFuZ2VDb250ZXh0IHtcclxuICAgIGNvbnN0IGNoYW5nZUNvbnRleHQ6IENoYW5nZUNvbnRleHQgPSBuZXcgQ2hhbmdlQ29udGV4dCgpO1xyXG4gICAgY2hhbmdlQ29udGV4dC5wb2ludGVyVHlwZSA9IHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlcjtcclxuICAgIGNoYW5nZUNvbnRleHQudmFsdWUgPSArdGhpcy52YWx1ZTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIGNoYW5nZUNvbnRleHQuaGlnaFZhbHVlID0gK3RoaXMuaGlnaFZhbHVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNoYW5nZUNvbnRleHQ7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIFRlbXBsYXRlUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1zbGlkZXItdG9vbHRpcC13cmFwcGVyJyxcclxuICB0ZW1wbGF0ZTogYDxuZy1jb250YWluZXIgKm5nSWY9XCJ0ZW1wbGF0ZVwiPlxyXG4gIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cInRlbXBsYXRlOyBjb250ZXh0OiB7dG9vbHRpcDogdG9vbHRpcCwgcGxhY2VtZW50OiBwbGFjZW1lbnQsIGNvbnRlbnQ6IGNvbnRlbnR9XCI+PC9uZy10ZW1wbGF0ZT5cclxuPC9uZy1jb250YWluZXI+XHJcblxyXG48bmctY29udGFpbmVyICpuZ0lmPVwiIXRlbXBsYXRlXCI+XHJcbiAgPGRpdiBjbGFzcz1cIm5neC1zbGlkZXItaW5uZXItdG9vbHRpcFwiIFthdHRyLnRpdGxlXT1cInRvb2x0aXBcIiBbYXR0ci5kYXRhLXRvb2x0aXAtcGxhY2VtZW50XT1cInBsYWNlbWVudFwiPlxyXG4gICAge3tjb250ZW50fX1cclxuICA8L2Rpdj5cclxuPC9uZy1jb250YWluZXI+YCxcclxuICBzdHlsZXM6IFtgLm5neC1zbGlkZXItaW5uZXItdG9vbHRpcHtoZWlnaHQ6MTAwJX1gXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVG9vbHRpcFdyYXBwZXJDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpXHJcbiAgdGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbHRpcDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHBsYWNlbWVudDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGNvbnRlbnQ6IHN0cmluZztcclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBTbGlkZXJDb21wb25lbnQgfSBmcm9tICcuL3NsaWRlci5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9zbGlkZXItZWxlbWVudC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBTbGlkZXJIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1oYW5kbGUuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgU2xpZGVyTGFiZWxEaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1sYWJlbC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBUb29sdGlwV3JhcHBlckNvbXBvbmVudCB9IGZyb20gJy4vdG9vbHRpcC13cmFwcGVyLmNvbXBvbmVudCc7XHJcblxyXG4vKipcclxuICogTmd4U2xpZGVyIG1vZHVsZVxyXG4gKlxyXG4gKiBUaGUgbW9kdWxlIGV4cG9ydHMgdGhlIHNsaWRlciBjb21wb25lbnRcclxuICovXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIFNsaWRlckNvbXBvbmVudCxcclxuICAgIFNsaWRlckVsZW1lbnREaXJlY3RpdmUsXHJcbiAgICBTbGlkZXJIYW5kbGVEaXJlY3RpdmUsXHJcbiAgICBTbGlkZXJMYWJlbERpcmVjdGl2ZSxcclxuICAgIFRvb2x0aXBXcmFwcGVyQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBTbGlkZXJDb21wb25lbnRcclxuICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hTbGlkZXJNb2R1bGUgeyB9XHJcbiJdLCJuYW1lcyI6WyJ0c2xpYl8xLl9fdmFsdWVzIiwidHNsaWJfMS5fX2V4dGVuZHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUtFLE1BQUc7O0lBRUgsT0FBSTs7SUFFSixRQUFLOztJQUVMLE9BQUk7O0lBRUosWUFBUzs7b0JBUlQsR0FBRztvQkFFSCxJQUFJO29CQUVKLEtBQUs7b0JBRUwsSUFBSTtvQkFFSixTQUFTOzs7O0FBOEJYOzs7QUFBQTs7Ozs7O3FCQUdtQixDQUFDOzs7OztvQkFJRixJQUFJOzs7OztvQkFJSixDQUFDOzs7Ozs7d0JBS0csSUFBSTs7Ozs7O3dCQUtKLElBQUk7Ozs7Ozs7eUJBTUYsS0FBSzs7Ozs7d0JBSVAsSUFBSTs7Ozs7d0JBSUosSUFBSTs7Ozs7eUJBSVEsSUFBSTs7Ozs7Ozs7NkJBT0ksSUFBSTs7Ozs7Ozs7O3lCQVFaLElBQUk7Ozs7OzZCQUlJLElBQUk7Ozs7Ozs7Ozs7MEJBU04sSUFBSTs7OztzQ0FHUCxLQUFLOzs7Ozs4QkFJYixLQUFLOzs7OztrQ0FJRCxLQUFLOzs7O2dDQUdQLEtBQUs7Ozs7bUNBR0YsS0FBSzs7Ozs7eUNBSUEs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
