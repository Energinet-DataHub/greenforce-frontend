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
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(
        exports,
        require('rxjs'),
        require('rxjs/operators'),
        require('detect-passive-events'),
        require('@angular/core'),
        require('@angular/forms'),
        require('@angular/common')
      )
    : typeof define === 'function' && define.amd
    ? define(
        '@angular-slider/ngx-slider',
        [
          'exports',
          'rxjs',
          'rxjs/operators',
          'detect-passive-events',
          '@angular/core',
          '@angular/forms',
          '@angular/common',
        ],
        factory
      )
    : factory(
        ((global['angular-slider'] = global['angular-slider'] || {}),
        (global['angular-slider']['ngx-slider'] = {})),
        global.rxjs,
        global.rxjs.operators,
        null,
        global.ng.core,
        global.ng.forms,
        global.ng.common
      );
})(
  this,
  function (
    exports,
    rxjs,
    operators,
    detectPassiveEvents,
    core,
    forms,
    common
  ) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (d, b) {
          d.__proto__ = b;
        }) ||
      function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    function __extends(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    }
    function __values(o) {
      var m = typeof Symbol === 'function' && o[Symbol.iterator],
        i = 0;
      if (m) return m.call(o);
      return {
        next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
        },
      };
    }

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
       */ Options = /** @class */ (function () {
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
       */ ValueHelper = /** @class */ (function () {
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
       */ CompatibilityHelper = /** @class */ (function () {
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
       */ MathHelper = /** @class */ (function () {
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
       */ EventListenerHelper = /** @class */ (function () {
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
            if (detectPassiveEvents.supportsPassiveEvents !== true) {
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
            listener.events = new rxjs.Subject();
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
                  ? operators.throttleTime(throttleInterval, undefined, {
                      leading: true,
                      trailing: true,
                    })
                  : operators.tap(function () {}) // no-op
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
            if (
              !ValueHelper.isNullOrUndefined(eventListener.eventsSubscription)
            ) {
              eventListener.eventsSubscription.unsubscribe();
              eventListener.eventsSubscription = null;
            }
            if (!ValueHelper.isNullOrUndefined(eventListener.events)) {
              eventListener.events.complete();
              eventListener.events = null;
            }
            if (
              !ValueHelper.isNullOrUndefined(eventListener.teardownCallback)
            ) {
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
            listener.events = new rxjs.Subject();
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
                  ? operators.throttleTime(throttleInterval, undefined, {
                      leading: true,
                      trailing: true,
                    })
                  : operators.tap(function () {}) // no-op
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
        get: /**
         * @return {?}
         */ function () {
          return this._position;
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(SliderElementDirective.prototype, 'dimension', {
        get: /**
         * @return {?}
         */ function () {
          return this._dimension;
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(SliderElementDirective.prototype, 'alwaysHide', {
        get: /**
         * @return {?}
         */ function () {
          return this._alwaysHide;
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(SliderElementDirective.prototype, 'vertical', {
        get: /**
         * @return {?}
         */ function () {
          return this._vertical;
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(SliderElementDirective.prototype, 'scale', {
        get: /**
         * @return {?}
         */ function () {
          return this._scale;
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(SliderElementDirective.prototype, 'rotate', {
        get: /**
         * @return {?}
         */ function () {
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
          type: core.Directive,
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
          { type: core.ElementRef },
          { type: core.Renderer2 },
          { type: core.ChangeDetectorRef },
        ];
      };
      SliderElementDirective.propDecorators = {
        opacity: [{ type: core.HostBinding, args: ['style.opacity'] }],
        visibility: [{ type: core.HostBinding, args: ['style.visibility'] }],
        left: [{ type: core.HostBinding, args: ['style.left'] }],
        bottom: [{ type: core.HostBinding, args: ['style.bottom'] }],
        height: [{ type: core.HostBinding, args: ['style.height'] }],
        width: [{ type: core.HostBinding, args: ['style.width'] }],
        transform: [{ type: core.HostBinding, args: ['style.transform'] }],
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
          type: core.Directive,
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
          { type: core.ElementRef },
          { type: core.Renderer2 },
          { type: core.ChangeDetectorRef },
        ];
      };
      SliderHandleDirective.propDecorators = {
        active: [{ type: core.HostBinding, args: ['class.ngx-slider-active'] }],
        role: [{ type: core.HostBinding, args: ['attr.role'] }],
        tabindex: [{ type: core.HostBinding, args: ['attr.tabindex'] }],
        ariaOrientation: [
          { type: core.HostBinding, args: ['attr.aria-orientation'] },
        ],
        ariaLabel: [{ type: core.HostBinding, args: ['attr.aria-label'] }],
        ariaLabelledBy: [
          { type: core.HostBinding, args: ['attr.aria-labelledby'] },
        ],
        ariaValueNow: [
          { type: core.HostBinding, args: ['attr.aria-valuenow'] },
        ],
        ariaValueText: [
          { type: core.HostBinding, args: ['attr.aria-valuetext'] },
        ],
        ariaValueMin: [
          { type: core.HostBinding, args: ['attr.aria-valuemin'] },
        ],
        ariaValueMax: [
          { type: core.HostBinding, args: ['attr.aria-valuemax'] },
        ],
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
        get: /**
         * @return {?}
         */ function () {
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
          type: core.Directive,
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
          { type: core.ElementRef },
          { type: core.Renderer2 },
          { type: core.ChangeDetectorRef },
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
            ValueHelper.isNullOrUndefined(x) !==
            ValueHelper.isNullOrUndefined(y)
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
            ValueHelper.isNullOrUndefined(x) !==
            ValueHelper.isNullOrUndefined(y)
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
      provide: forms.NG_VALUE_ACCESSOR,
      /* tslint:disable-next-line: no-use-before-declare */
      useExisting: core.forwardRef(function () {
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
        this.valueChange = new core.EventEmitter();
        // Model for high value of slider. Not used in simple slider. For range slider, this is the high value.
        this.highValue = null;
        // Output for high value slider to support two-way bindings
        this.highValueChange = new core.EventEmitter();
        // An object with all the other options of the slider.
        // Each option can be updated at runtime and the slider will automatically be re-rendered.
        this.options = new Options();
        // Event emitted when user starts interaction with the slider
        this.userChangeStart = new core.EventEmitter();
        // Event emitted on each change coming from user interaction
        this.userChange = new core.EventEmitter();
        // Event emitted when user finishes interaction with the slider
        this.userChangeEnd = new core.EventEmitter();
        this.initHasRun = false;
        this.inputModelChangeSubject = new rxjs.Subject();
        this.inputModelChangeSubscription = null;
        this.outputModelChangeSubject = new rxjs.Subject();
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
        console.log('constructor end angular-slider-ngx-slider.umd.js');
      }
      Object.defineProperty(SliderComponent.prototype, 'manualRefresh', {
        // Input event that triggers slider refresh (re-positioning of slider elements)
        set: /**
         * @param {?} manualRefresh
         * @return {?}
         */ function (manualRefresh) {
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
        set: /**
         * @param {?} triggerFocus
         * @return {?}
         */ function (triggerFocus) {
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
        get: /**
         * @return {?}
         */ function () {
          return (
            !ValueHelper.isNullOrUndefined(this.value) &&
            !ValueHelper.isNullOrUndefined(this.highValue)
          );
        },
        enumerable: true,
        configurable: true,
      });
      Object.defineProperty(SliderComponent.prototype, 'showTicks', {
        get: /**
         * @return {?}
         */ function () {
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
          console.log('ngOnInit angular-slider-ngx-slider.umd.js');
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
          console.log('ngAfterViewInit angular-slider-ngx-slider.umd.js');
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
          console.log('ngAfterViewInit before manageElementsStyle');
          this.manageElementsStyle();
          console.log('ngAfterViewInit after manageElementsStyle');
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
              operators.distinctUntilChanged(ModelChange.compare),
              // Hack to reset the status of the distinctUntilChanged() - if a "fake" event comes through with forceChange=true,
              // we forcefully by-pass distinctUntilChanged(), but otherwise drop the event
              operators.filter(function (modelChange) {
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
            .pipe(operators.distinctUntilChanged(ModelChange.compare))
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
            this.eventListenerHelper.detachEventListener(
              this.onMoveEventListener
            );
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
            this.eventListenerHelper.detachEventListener(
              this.onEndEventListener
            );
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
          if (
            !ValueHelper.isNullOrUndefined(this.inputModelChangeSubscription)
          ) {
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
          if (
            !ValueHelper.isNullOrUndefined(this.outputModelChangeSubscription)
          ) {
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
                _this.onChangeCallback([
                  modelChange.value,
                  modelChange.highValue,
                ]);
              } else {
                _this.onChangeCallback(modelChange.value);
              }
            }
            if (!ValueHelper.isNullOrUndefined(_this.onTouchedCallback)) {
              if (_this.range) {
                _this.onTouchedCallback([
                  modelChange.value,
                  modelChange.highValue,
                ]);
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
              normalisedInput.value =
                this.viewOptions.stepsArray[valueIndex].value;
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
              normalisedInput.highValue = this.roundStep(
                normalisedInput.highValue
              );
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
          if (
            !ModelValues.compare(normalisedModelValues, previousModelValues)
          ) {
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
          if (
            pointerType !== PointerType.Min &&
            pointerType !== PointerType.Max
          ) {
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
            hideLabelsForTicks ||
              !this.range ||
              this.viewOptions.hidePointerLabels
          );
          this.combinedLabelElement.setAlwaysHide(
            hideLabelsForTicks ||
              !this.range ||
              this.viewOptions.hidePointerLabels
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
            this.viewOptions.draggableRange &&
            !this.viewOptions.onlyBindHandles;
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
          this.sliderElementAriaLabel =
            this.viewOptions.ariaLabel || 'nxg-slider';
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
            this.minHandleElement.ariaLabelledBy =
              this.viewOptions.ariaLabelledBy;
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
            if (
              !ValueHelper.isNullOrUndefined(this.viewOptions.ariaLabelHigh)
            ) {
              this.maxHandleElement.ariaLabel = this.viewOptions.ariaLabelHigh;
            } else if (
              !ValueHelper.isNullOrUndefined(
                this.viewOptions.ariaLabelledByHigh
              )
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
          this.minHandleElement.ariaValueMin =
            this.viewOptions.floor.toString();
          this.minHandleElement.ariaValueMax = this.viewOptions.ceil.toString();
          if (this.range) {
            this.maxHandleElement.ariaValueNow = (+this.highValue).toString();
            this.maxHandleElement.ariaValueText = this.viewOptions.translate(
              +this.highValue,
              LabelType.High
            );
            this.maxHandleElement.ariaValueMin =
              this.viewOptions.floor.toString();
            this.maxHandleElement.ariaValueMax =
              this.viewOptions.ceil.toString();
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
          if (
            !ValueHelper.isNullOrUndefined(this.viewOptions.handleDimension)
          ) {
            this.minHandleElement.setDimension(
              this.viewOptions.handleDimension
            );
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
          var translate = this.viewOptions.vertical
            ? 'translateY'
            : 'translateX';
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
              !ValueHelper.isNullOrUndefined(
                _this.viewOptions.getSelectionBarColor
              )
            ) {
              tick.style['background-color'] = _this.getSelectionBarColor();
            }
            if (
              !tick.selected &&
              !ValueHelper.isNullOrUndefined(_this.viewOptions.getTickColor)
            ) {
              tick.style['background-color'] = _this.getTickColor(value);
            }
            if (
              !ValueHelper.isNullOrUndefined(_this.viewOptions.ticksTooltip)
            ) {
              tick.tooltip = _this.viewOptions.ticksTooltip(value);
              tick.tooltipPlacement = _this.viewOptions.vertical
                ? 'right'
                : 'top';
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
                !ValueHelper.isNullOrUndefined(
                  _this.viewOptions.ticksValuesTooltip
                )
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
              if (
                !ValueHelper.isNullOrUndefined(_this.viewOptions.getStepLegend)
              ) {
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
          if (
            !ValueHelper.isNullOrUndefined(this.viewOptions.getPointerColor)
          ) {
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
          if (
            !ValueHelper.isNullOrUndefined(this.viewOptions.getPointerColor)
          ) {
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
                Math.abs(
                  this.maxHandlePosition - this.minHandleElement.position
                ) + this.handleHalfDimension
              );
              position = Math.floor(
                this.minHandleElement.position + this.handleHalfDimension
              );
            } else {
              dimension =
                this.minHandleElement.position + this.handleHalfDimension;
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
              this.leftOuterSelectionBarElement.setPosition(
                position + dimension
              );
            } else {
              this.leftOuterSelectionBarElement.setDimension(position);
              this.leftOuterSelectionBarElement.setPosition(0);
              this.fullBarElement.calculateDimension();
              this.rightOuterSelectionBarElement.setDimension(
                this.fullBarElement.dimension - (position + dimension)
              );
              this.rightOuterSelectionBarElement.setPosition(
                position + dimension
              );
            }
          }
          if (
            !ValueHelper.isNullOrUndefined(
              this.viewOptions.getSelectionBarColor
            )
          ) {
            /** @type {?} */
            var color = this.getSelectionBarColor();
            this.barStyle = {
              backgroundColor: color,
            };
          } else if (
            !ValueHelper.isNullOrUndefined(
              this.viewOptions.selectionBarGradient
            )
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
            return this.viewOptions.getPointerColor(
              this.highValue,
              pointerType
            );
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
              ? this.viewOptions.combineLabels(
                  highDisplayValue,
                  lowDisplayValue
                )
              : this.viewOptions.combineLabels(
                  lowDisplayValue,
                  highDisplayValue
                );
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
            !ValueHelper.isNullOrUndefined(
              this.viewOptions.customValueToPosition
            )
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
            !ValueHelper.isNullOrUndefined(
              this.viewOptions.customPositionToValue
            )
          ) {
            fn = this.viewOptions.customPositionToValue;
          } else if (this.viewOptions.logScale) {
            fn = ValueHelper.logPositionToValue;
          }
          /** @type {?} */
          var value = fn(
            percent,
            this.viewOptions.floor,
            this.viewOptions.ceil
          );
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
          if (
            !CompatibilityHelper.isTouchEvent(event) &&
            !detectPassiveEvents.supportsPassiveEvents
          ) {
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
              return _this.dragging.active
                ? _this.onDragMove(e)
                : _this.onMove(e);
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
            !ValueHelper.isNullOrUndefined(
              /** @type {?} */ (event).changedTouches
            )
          ) {
            // Store the touch identifier
            if (ValueHelper.isNullOrUndefined(this.touchId)) {
              this.touchId = /** @type {?} */ (
                event
              ).changedTouches[0].identifier;
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
          this.updateHandles(
            PointerType.Min,
            this.valueToPosition(newMinValue)
          );
          this.updateHandles(
            PointerType.Max,
            this.valueToPosition(newMaxValue)
          );
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
                this.updateHandles(
                  PointerType.Min,
                  this.maxHandleElement.position
                );
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
                this.updateHandles(
                  PointerType.Max,
                  this.minHandleElement.position
                );
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
          var minRange = !ValueHelper.isNullOrUndefined(
            this.viewOptions.minRange
          )
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
          type: core.Component,
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
          { type: core.Renderer2 },
          { type: core.ElementRef },
          { type: core.ChangeDetectorRef },
          { type: core.NgZone },
        ];
      };
      SliderComponent.propDecorators = {
        value: [{ type: core.Input }],
        valueChange: [{ type: core.Output }],
        highValue: [{ type: core.Input }],
        highValueChange: [{ type: core.Output }],
        options: [{ type: core.Input }],
        userChangeStart: [{ type: core.Output }],
        userChange: [{ type: core.Output }],
        userChangeEnd: [{ type: core.Output }],
        manualRefresh: [{ type: core.Input }],
        triggerFocus: [{ type: core.Input }],
        leftOuterSelectionBarElement: [
          {
            type: core.ViewChild,
            args: ['leftOuterSelectionBar', { read: SliderElementDirective }],
          },
        ],
        rightOuterSelectionBarElement: [
          {
            type: core.ViewChild,
            args: ['rightOuterSelectionBar', { read: SliderElementDirective }],
          },
        ],
        fullBarElement: [
          {
            type: core.ViewChild,
            args: ['fullBar', { read: SliderElementDirective }],
          },
        ],
        selectionBarElement: [
          {
            type: core.ViewChild,
            args: ['selectionBar', { read: SliderElementDirective }],
          },
        ],
        minHandleElement: [
          {
            type: core.ViewChild,
            args: ['minHandle', { read: SliderHandleDirective }],
          },
        ],
        maxHandleElement: [
          {
            type: core.ViewChild,
            args: ['maxHandle', { read: SliderHandleDirective }],
          },
        ],
        floorLabelElement: [
          {
            type: core.ViewChild,
            args: ['floorLabel', { read: SliderLabelDirective }],
          },
        ],
        ceilLabelElement: [
          {
            type: core.ViewChild,
            args: ['ceilLabel', { read: SliderLabelDirective }],
          },
        ],
        minHandleLabelElement: [
          {
            type: core.ViewChild,
            args: ['minHandleLabel', { read: SliderLabelDirective }],
          },
        ],
        maxHandleLabelElement: [
          {
            type: core.ViewChild,
            args: ['maxHandleLabel', { read: SliderLabelDirective }],
          },
        ],
        combinedLabelElement: [
          {
            type: core.ViewChild,
            args: ['combinedLabel', { read: SliderLabelDirective }],
          },
        ],
        ticksElement: [
          {
            type: core.ViewChild,
            args: ['ticksElement', { read: SliderElementDirective }],
          },
        ],
        tooltipTemplate: [
          { type: core.ContentChild, args: ['tooltipTemplate'] },
        ],
        sliderElementVerticalClass: [
          { type: core.HostBinding, args: ['class.vertical'] },
        ],
        sliderElementAnimateClass: [
          { type: core.HostBinding, args: ['class.animate'] },
        ],
        sliderElementWithLegendClass: [
          { type: core.HostBinding, args: ['class.with-legend'] },
        ],
        sliderElementDisabledAttr: [
          { type: core.HostBinding, args: ['attr.disabled'] },
        ],
        sliderElementAriaLabel: [
          { type: core.HostBinding, args: ['attr.aria-label'] },
        ],
        onResize: [
          { type: core.HostListener, args: ['window:resize', ['$event']] },
        ],
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
          type: core.Component,
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
        template: [{ type: core.Input }],
        tooltip: [{ type: core.Input }],
        placement: [{ type: core.Input }],
        content: [{ type: core.Input }],
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
          type: core.NgModule,
          args: [
            {
              imports: [common.CommonModule],
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

    exports.NgxSliderModule = NgxSliderModule;
    exports.ChangeContext = ChangeContext;
    exports.PointerType = PointerType;
    exports.LabelType = LabelType;
    exports.Options = Options;
    exports.ɵb = SliderElementDirective;
    exports.ɵc = SliderHandleDirective;
    exports.ɵd = SliderLabelDirective;
    exports.ɵa = SliderComponent;
    exports.ɵe = TooltipWrapperComponent;

    Object.defineProperty(exports, '__esModule', { value: true });
  }
);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1zbGlkZXItbmd4LXNsaWRlci51bWQuanMubWFwIiwic291cmNlcyI6W251bGwsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvb3B0aW9ucy50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvcG9pbnRlci10eXBlLnRzIiwibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci9jaGFuZ2UtY29udGV4dC50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvdmFsdWUtaGVscGVyLnRzIiwibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci9jb21wYXRpYmlsaXR5LWhlbHBlci50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvbWF0aC1oZWxwZXIudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL2V2ZW50LWxpc3RlbmVyLnRzIiwibmc6Ly9AYW5ndWxhci1zbGlkZXIvbmd4LXNsaWRlci9ldmVudC1saXN0ZW5lci1oZWxwZXIudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci1lbGVtZW50LmRpcmVjdGl2ZS50cyIsIm5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvc2xpZGVyLWhhbmRsZS5kaXJlY3RpdmUudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci1sYWJlbC5kaXJlY3RpdmUudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci5jb21wb25lbnQudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3Rvb2x0aXAtd3JhcHBlci5jb21wb25lbnQudHMiLCJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyL3NsaWRlci5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLyohICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXHJcbkNvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG5MaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2VcclxudGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGVcclxuTGljZW5zZSBhdCBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuXHJcblRISVMgQ09ERSBJUyBQUk9WSURFRCBPTiBBTiAqQVMgSVMqIEJBU0lTLCBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTllcclxuS0lORCwgRUlUSEVSIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIFdJVEhPVVQgTElNSVRBVElPTiBBTlkgSU1QTElFRFxyXG5XQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgVElUTEUsIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLFxyXG5NRVJDSEFOVEFCTElUWSBPUiBOT04tSU5GUklOR0VNRU5ULlxyXG5cclxuU2VlIHRoZSBBcGFjaGUgVmVyc2lvbiAyLjAgTGljZW5zZSBmb3Igc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zXHJcbmFuZCBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiogKi9cclxuLyogZ2xvYmFsIFJlZmxlY3QsIFByb21pc2UgKi9cclxuXHJcbnZhciBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xyXG4gICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDApXHJcbiAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cclxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxyXG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19nZW5lcmF0b3IodGhpc0FyZywgYm9keSkge1xyXG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcclxuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XHJcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xyXG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xyXG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSB5W29wWzBdICYgMiA/IFwicmV0dXJuXCIgOiBvcFswXSA/IFwidGhyb3dcIiA6IFwibmV4dFwiXSkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XHJcbiAgICAgICAgICAgIGlmICh5ID0gMCwgdCkgb3AgPSBbMCwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIGV4cG9ydHMpIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKCFleHBvcnRzLmhhc093blByb3BlcnR5KHApKSBleHBvcnRzW3BdID0gbVtwXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgbmV4dDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAobyAmJiBpID49IG8ubGVuZ3RoKSBvID0gdm9pZCAwO1xyXG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogbyAmJiBvW2krK10sIGRvbmU6ICFvIH07XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVhZChvLCBuKSB7XHJcbiAgICB2YXIgbSA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvW1N5bWJvbC5pdGVyYXRvcl07XHJcbiAgICBpZiAoIW0pIHJldHVybiBvO1xyXG4gICAgdmFyIGkgPSBtLmNhbGwobyksIHIsIGFyID0gW10sIGU7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIHdoaWxlICgobiA9PT0gdm9pZCAwIHx8IG4tLSA+IDApICYmICEociA9IGkubmV4dCgpKS5kb25lKSBhci5wdXNoKHIudmFsdWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7IGUgPSB7IGVycm9yOiBlcnJvciB9OyB9XHJcbiAgICBmaW5hbGx5IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAociAmJiAhci5kb25lICYmIChtID0gaVtcInJldHVyblwiXSkpIG0uY2FsbChpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZmluYWxseSB7IGlmIChlKSB0aHJvdyBlLmVycm9yOyB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXQodikge1xyXG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBfX2F3YWl0ID8gKHRoaXMudiA9IHYsIHRoaXMpIDogbmV3IF9fYXdhaXQodik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jR2VuZXJhdG9yKHRoaXNBcmcsIF9hcmd1bWVudHMsIGdlbmVyYXRvcikge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBnID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pLCBpLCBxID0gW107XHJcbiAgICByZXR1cm4gaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaWYgKGdbbl0pIGlbbl0gPSBmdW5jdGlvbiAodikgeyByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKGEsIGIpIHsgcS5wdXNoKFtuLCB2LCBhLCBiXSkgPiAxIHx8IHJlc3VtZShuLCB2KTsgfSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHJlc3VtZShuLCB2KSB7IHRyeSB7IHN0ZXAoZ1tuXSh2KSk7IH0gY2F0Y2ggKGUpIHsgc2V0dGxlKHFbMF1bM10sIGUpOyB9IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAocikgeyByLnZhbHVlIGluc3RhbmNlb2YgX19hd2FpdCA/IFByb21pc2UucmVzb2x2ZShyLnZhbHVlLnYpLnRoZW4oZnVsZmlsbCwgcmVqZWN0KSA6IHNldHRsZShxWzBdWzJdLCByKTsgfVxyXG4gICAgZnVuY3Rpb24gZnVsZmlsbCh2YWx1ZSkgeyByZXN1bWUoXCJuZXh0XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gcmVqZWN0KHZhbHVlKSB7IHJlc3VtZShcInRocm93XCIsIHZhbHVlKTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKGYsIHYpIHsgaWYgKGYodiksIHEuc2hpZnQoKSwgcS5sZW5ndGgpIHJlc3VtZShxWzBdWzBdLCBxWzBdWzFdKTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hc3luY0RlbGVnYXRvcihvKSB7XHJcbiAgICB2YXIgaSwgcDtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiwgZnVuY3Rpb24gKGUpIHsgdGhyb3cgZTsgfSksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4sIGYpIHsgaVtuXSA9IG9bbl0gPyBmdW5jdGlvbiAodikgeyByZXR1cm4gKHAgPSAhcCkgPyB7IHZhbHVlOiBfX2F3YWl0KG9bbl0odikpLCBkb25lOiBuID09PSBcInJldHVyblwiIH0gOiBmID8gZih2KSA6IHY7IH0gOiBmOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jVmFsdWVzKG8pIHtcclxuICAgIGlmICghU3ltYm9sLmFzeW5jSXRlcmF0b3IpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTeW1ib2wuYXN5bmNJdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbiAgICB2YXIgbSA9IG9bU3ltYm9sLmFzeW5jSXRlcmF0b3JdLCBpO1xyXG4gICAgcmV0dXJuIG0gPyBtLmNhbGwobykgOiAobyA9IHR5cGVvZiBfX3ZhbHVlcyA9PT0gXCJmdW5jdGlvblwiID8gX192YWx1ZXMobykgOiBvW1N5bWJvbC5pdGVyYXRvcl0oKSwgaSA9IHt9LCB2ZXJiKFwibmV4dFwiKSwgdmVyYihcInRocm93XCIpLCB2ZXJiKFwicmV0dXJuXCIpLCBpW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sIGkpO1xyXG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IGlbbl0gPSBvW25dICYmIGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7IHYgPSBvW25dKHYpLCBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCB2LmRvbmUsIHYudmFsdWUpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc2V0dGxlKHJlc29sdmUsIHJlamVjdCwgZCwgdikgeyBQcm9taXNlLnJlc29sdmUodikudGhlbihmdW5jdGlvbih2KSB7IHJlc29sdmUoeyB2YWx1ZTogdiwgZG9uZTogZCB9KTsgfSwgcmVqZWN0KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tYWtlVGVtcGxhdGVPYmplY3QoY29va2VkLCByYXcpIHtcclxuICAgIGlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNvb2tlZCwgXCJyYXdcIiwgeyB2YWx1ZTogcmF3IH0pOyB9IGVsc2UgeyBjb29rZWQucmF3ID0gcmF3OyB9XHJcbiAgICByZXR1cm4gY29va2VkO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwobW9kLCBrKSkgcmVzdWx0W2tdID0gbW9kW2tdO1xyXG4gICAgcmVzdWx0LmRlZmF1bHQgPSBtb2Q7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19pbXBvcnREZWZhdWx0KG1vZCkge1xyXG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBkZWZhdWx0OiBtb2QgfTtcclxufVxyXG4iLCJpbXBvcnQgeyBQb2ludGVyVHlwZSB9IGZyb20gJy4vcG9pbnRlci10eXBlJztcclxuXHJcbi8qKiBMYWJlbCB0eXBlICovXHJcbmV4cG9ydCBlbnVtIExhYmVsVHlwZSB7XHJcbiAgLyoqIExhYmVsIGFib3ZlIGxvdyBwb2ludGVyICovXHJcbiAgTG93LFxyXG4gIC8qKiBMYWJlbCBhYm92ZSBoaWdoIHBvaW50ZXIgKi9cclxuICBIaWdoLFxyXG4gIC8qKiBMYWJlbCBmb3IgbWluaW11bSBzbGlkZXIgdmFsdWUgKi9cclxuICBGbG9vcixcclxuICAvKiogTGFiZWwgZm9yIG1heGltdW0gc2xpZGVyIHZhbHVlICovXHJcbiAgQ2VpbCxcclxuICAvKiogTGFiZWwgYmVsb3cgbGVnZW5kIHRpY2sgKi9cclxuICBUaWNrVmFsdWVcclxufVxyXG5cclxuLyoqIEZ1bmN0aW9uIHRvIHRyYW5zbGF0ZSBsYWJlbCB2YWx1ZSBpbnRvIHRleHQgKi9cclxuZXhwb3J0IHR5cGUgVHJhbnNsYXRlRnVuY3Rpb24gPSAodmFsdWU6IG51bWJlciwgbGFiZWw6IExhYmVsVHlwZSkgPT4gc3RyaW5nO1xyXG4vKiogRnVuY3Rpb24gdG8gY29tYmluZCAqL1xyXG5leHBvcnQgdHlwZSBDb21iaW5lTGFiZWxzRnVuY3Rpb24gPSAobWluTGFiZWw6IHN0cmluZywgbWF4TGFiZWw6IHN0cmluZykgPT4gc3RyaW5nO1xyXG4vKiogRnVuY3Rpb24gdG8gcHJvdmlkZSBsZWdlbmQgICovXHJcbmV4cG9ydCB0eXBlIEdldExlZ2VuZEZ1bmN0aW9uID0gKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZztcclxuZXhwb3J0IHR5cGUgR2V0U3RlcExlZ2VuZEZ1bmN0aW9uID0gKHN0ZXA6IEN1c3RvbVN0ZXBEZWZpbml0aW9uKSA9PiBzdHJpbmc7XHJcblxyXG4vKiogRnVuY3Rpb24gY29udmVydGluZyBzbGlkZXIgdmFsdWUgdG8gc2xpZGVyIHBvc2l0aW9uICovXHJcbmV4cG9ydCB0eXBlIFZhbHVlVG9Qb3NpdGlvbkZ1bmN0aW9uID0gKHZhbDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpID0+IG51bWJlcjtcclxuXHJcbi8qKiBGdW5jdGlvbiBjb252ZXJ0aW5nIHNsaWRlciBwb3NpdGlvbiB0byBzbGlkZXIgdmFsdWUgKi9cclxuZXhwb3J0IHR5cGUgUG9zaXRpb25Ub1ZhbHVlRnVuY3Rpb24gPSAocGVyY2VudDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpID0+IG51bWJlcjtcclxuXHJcbi8qKlxyXG4gKiBDdXN0b20gc3RlcCBkZWZpbml0aW9uXHJcbiAqXHJcbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gc3BlY2lmeSBjdXN0b20gdmFsdWVzIGFuZCBsZWdlbmQgdmFsdWVzIGZvciBzbGlkZXIgdGlja3NcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ3VzdG9tU3RlcERlZmluaXRpb24ge1xyXG4gIC8qKiBWYWx1ZSAqL1xyXG4gIHZhbHVlOiBudW1iZXI7XHJcbiAgLyoqIExlZ2VuZCAobGFiZWwgZm9yIHRoZSB2YWx1ZSkgKi9cclxuICBsZWdlbmQ/OiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKiBTbGlkZXIgb3B0aW9ucyAqL1xyXG5leHBvcnQgY2xhc3MgT3B0aW9ucyB7XHJcbiAgLyoqIE1pbmltdW0gdmFsdWUgZm9yIGEgc2xpZGVyLlxyXG4gICAgTm90IGFwcGxpY2FibGUgd2hlbiB1c2luZyBzdGVwc0FycmF5LiAqL1xyXG4gIGZsb29yPzogbnVtYmVyID0gMDtcclxuXHJcbiAgLyoqIE1heGltdW0gdmFsdWUgZm9yIGEgc2xpZGVyLlxyXG4gICAgTm90IGFwcGxpY2FibGUgd2hlbiB1c2luZyBzdGVwc0FycmF5LiAqL1xyXG4gIGNlaWw/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogU3RlcCBiZXR3ZWVuIGVhY2ggdmFsdWUuXHJcbiAgICBOb3QgYXBwbGljYWJsZSB3aGVuIHVzaW5nIHN0ZXBzQXJyYXkuICovXHJcbiAgc3RlcD86IG51bWJlciA9IDE7XHJcblxyXG4gIC8qKiBUaGUgbWluaW11bSByYW5nZSBhdXRob3JpemVkIG9uIHRoZSBzbGlkZXIuXHJcbiAgICBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIG1pblJhbmdlPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFRoZSBtYXhpbXVtIHJhbmdlIGF1dGhvcml6ZWQgb24gdGhlIHNsaWRlci5cclxuICAgIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuXHJcbiAgICBXaGVuIHVzaW5nIHN0ZXBzQXJyYXksIGV4cHJlc3NlZCBhcyBpbmRleCBpbnRvIHN0ZXBzQXJyYXkuICovXHJcbiAgbWF4UmFuZ2U/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gaGF2ZSBhIHB1c2ggYmVoYXZpb3IuIFdoZW4gdGhlIG1pbiBoYW5kbGUgZ29lcyBhYm92ZSB0aGUgbWF4LFxyXG4gICAgdGhlIG1heCBpcyBtb3ZlZCBhcyB3ZWxsIChhbmQgdmljZS12ZXJzYSkuIFRoZSByYW5nZSBiZXR3ZWVuIG1pbiBhbmQgbWF4IGlzXHJcbiAgICBkZWZpbmVkIGJ5IHRoZSBzdGVwIG9wdGlvbiAoZGVmYXVsdHMgdG8gMSkgYW5kIGNhbiBhbHNvIGJlIG92ZXJyaWRlbiBieVxyXG4gICAgdGhlIG1pblJhbmdlIG9wdGlvbi4gQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS4gKi9cclxuICBwdXNoUmFuZ2U/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBUaGUgbWluaW11bSB2YWx1ZSBhdXRob3JpemVkIG9uIHRoZSBzbGlkZXIuXHJcbiAgICBXaGVuIHVzaW5nIHN0ZXBzQXJyYXksIGV4cHJlc3NlZCBhcyBpbmRleCBpbnRvIHN0ZXBzQXJyYXkuICovXHJcbiAgbWluTGltaXQ/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogVGhlIG1heGltdW0gdmFsdWUgYXV0aG9yaXplZCBvbiB0aGUgc2xpZGVyLlxyXG4gICAgV2hlbiB1c2luZyBzdGVwc0FycmF5LCBleHByZXNzZWQgYXMgaW5kZXggaW50byBzdGVwc0FycmF5LiAqL1xyXG4gIG1heExpbWl0PzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIEN1c3RvbSB0cmFuc2xhdGUgZnVuY3Rpb24uIFVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHRyYW5zbGF0ZSB2YWx1ZXMgZGlzcGxheWVkXHJcbiAgICAgIG9uIHRoZSBzbGlkZXIuICovXHJcbiAgdHJhbnNsYXRlPzogVHJhbnNsYXRlRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAvKiogQ3VzdG9tIGZ1bmN0aW9uIGZvciBjb21iaW5pbmcgb3ZlcmxhcHBpbmcgbGFiZWxzIGluIHJhbmdlIHNsaWRlci5cclxuICAgICAgSXQgdGFrZXMgdGhlIG1pbiBhbmQgbWF4IHZhbHVlcyAoYWxyZWFkeSB0cmFuc2xhdGVkIHdpdGggdHJhbnNsYXRlIGZ1Y3Rpb24pXHJcbiAgICAgIGFuZCBzaG91bGQgcmV0dXJuIGhvdyB0aGVzZSB0d28gdmFsdWVzIHNob3VsZCBiZSBjb21iaW5lZC5cclxuICAgICAgSWYgbm90IHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBmdW5jdGlvbiB3aWxsIGpvaW4gdGhlIHR3byB2YWx1ZXMgd2l0aFxyXG4gICAgICAnIC0gJyBhcyBzZXBhcmF0b3IuICovXHJcbiAgY29tYmluZUxhYmVscz86IENvbWJpbmVMYWJlbHNGdW5jdGlvbiA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2UgdG8gZGlzcGxheSBsZWdlbmQgdW5kZXIgdGlja3MgKHRodXMsIGl0IG5lZWRzIHRvIGJlIHVzZWQgYWxvbmcgd2l0aFxyXG4gICAgIHNob3dUaWNrcyBvciBzaG93VGlja3NWYWx1ZXMpLiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgd2l0aCBlYWNoIHRpY2tcclxuICAgICB2YWx1ZSBhbmQgcmV0dXJuZWQgY29udGVudCB3aWxsIGJlIGRpc3BsYXllZCB1bmRlciB0aGUgdGljayBhcyBhIGxlZ2VuZC5cclxuICAgICBJZiB0aGUgcmV0dXJuZWQgdmFsdWUgaXMgbnVsbCwgdGhlbiBubyBsZWdlbmQgaXMgZGlzcGxheWVkIHVuZGVyXHJcbiAgICAgdGhlIGNvcnJlc3BvbmRpbmcgdGljay5Zb3UgY2FuIGFsc28gZGlyZWN0bHkgcHJvdmlkZSB0aGUgbGVnZW5kIHZhbHVlc1xyXG4gICAgIGluIHRoZSBzdGVwc0FycmF5IG9wdGlvbi4gKi9cclxuICBnZXRMZWdlbmQ/OiBHZXRMZWdlbmRGdW5jdGlvbiA9IG51bGw7XHJcblxyXG4gICAvKiogVXNlIHRvIGRpc3BsYXkgYSBjdXN0b20gbGVnZW5kIG9mIGEgc3RlcEl0ZW0gZnJvbSBzdGVwc0FycmF5LlxyXG4gICAgSXQgd2lsbCBiZSB0aGUgc2FtZSBhcyBnZXRMZWdlbmQgYnV0IGZvciBzdGVwc0FycmF5LiAqL1xyXG4gIGdldFN0ZXBMZWdlbmQ/OiBHZXRTdGVwTGVnZW5kRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAvKiogSWYgeW91IHdhbnQgdG8gZGlzcGxheSBhIHNsaWRlciB3aXRoIG5vbiBsaW5lYXIvbnVtYmVyIHN0ZXBzLlxyXG4gICAgIEp1c3QgcGFzcyBhbiBhcnJheSB3aXRoIGVhY2ggc2xpZGVyIHZhbHVlIGFuZCB0aGF0J3MgaXQ7IHRoZSBmbG9vciwgY2VpbCBhbmQgc3RlcCBzZXR0aW5nc1xyXG4gICAgIG9mIHRoZSBzbGlkZXIgd2lsbCBiZSBjb21wdXRlZCBhdXRvbWF0aWNhbGx5LlxyXG4gICAgIEJ5IGRlZmF1bHQsIHRoZSB2YWx1ZSBtb2RlbCBhbmQgdmFsdWVIaWdoIG1vZGVsIHZhbHVlcyB3aWxsIGJlIHRoZSB2YWx1ZSBvZiB0aGUgc2VsZWN0ZWQgaXRlbVxyXG4gICAgIGluIHRoZSBzdGVwc0FycmF5LlxyXG4gICAgIFRoZXkgY2FuIGFsc28gYmUgYm91bmQgdG8gdGhlIGluZGV4IG9mIHRoZSBzZWxlY3RlZCBpdGVtIGJ5IHNldHRpbmcgdGhlIGJpbmRJbmRleEZvclN0ZXBzQXJyYXlcclxuICAgICBvcHRpb24gdG8gdHJ1ZS4gKi9cclxuICBzdGVwc0FycmF5PzogQ3VzdG9tU3RlcERlZmluaXRpb25bXSA9IG51bGw7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBiaW5kIHRoZSBpbmRleCBvZiB0aGUgc2VsZWN0ZWQgaXRlbSB0byB2YWx1ZSBtb2RlbCBhbmQgdmFsdWVIaWdoIG1vZGVsLiAqL1xyXG4gIGJpbmRJbmRleEZvclN0ZXBzQXJyYXk/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBXaGVuIHNldCB0byB0cnVlIGFuZCB1c2luZyBhIHJhbmdlIHNsaWRlciwgdGhlIHJhbmdlIGNhbiBiZSBkcmFnZ2VkIGJ5IHRoZSBzZWxlY3Rpb24gYmFyLlxyXG4gICAgQXBwbGllcyB0byByYW5nZSBzbGlkZXIgb25seS4gKi9cclxuICBkcmFnZ2FibGVSYW5nZT86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNhbWUgYXMgZHJhZ2dhYmxlUmFuZ2UgYnV0IHRoZSBzbGlkZXIgcmFuZ2UgY2FuJ3QgYmUgY2hhbmdlZC5cclxuICAgIEFwcGxpZXMgdG8gcmFuZ2Ugc2xpZGVyIG9ubHkuICovXHJcbiAgZHJhZ2dhYmxlUmFuZ2VPbmx5PzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gYWx3YXlzIHNob3cgdGhlIHNlbGVjdGlvbiBiYXIgYmVmb3JlIHRoZSBzbGlkZXIgaGFuZGxlLiAqL1xyXG4gIHNob3dTZWxlY3Rpb25CYXI/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBhbHdheXMgc2hvdyB0aGUgc2VsZWN0aW9uIGJhciBhZnRlciB0aGUgc2xpZGVyIGhhbmRsZS4gKi9cclxuICBzaG93U2VsZWN0aW9uQmFyRW5kPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogIFNldCBhIG51bWJlciB0byBkcmF3IHRoZSBzZWxlY3Rpb24gYmFyIGJldHdlZW4gdGhpcyB2YWx1ZSBhbmQgdGhlIHNsaWRlciBoYW5kbGUuXHJcbiAgICBXaGVuIHVzaW5nIHN0ZXBzQXJyYXksIGV4cHJlc3NlZCBhcyBpbmRleCBpbnRvIHN0ZXBzQXJyYXkuICovXHJcbiAgc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZT86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qKiAgT25seSBmb3IgcmFuZ2Ugc2xpZGVyLiBTZXQgdG8gdHJ1ZSB0byB2aXN1YWxpemUgaW4gZGlmZmVyZW50IGNvbG91ciB0aGUgYXJlYXNcclxuICAgIG9uIHRoZSBsZWZ0L3JpZ2h0ICh0b3AvYm90dG9tIGZvciB2ZXJ0aWNhbCByYW5nZSBzbGlkZXIpIG9mIHNlbGVjdGlvbiBiYXIgYmV0d2VlbiB0aGUgaGFuZGxlcy4gKi9cclxuICBzaG93T3V0ZXJTZWxlY3Rpb25CYXJzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gaGlkZSBwb2ludGVyIGxhYmVscyAqL1xyXG4gIGhpZGVQb2ludGVyTGFiZWxzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gaGlkZSBtaW4gLyBtYXggbGFiZWxzICAqL1xyXG4gIGhpZGVMaW1pdExhYmVscz86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byBmYWxzZSB0byBkaXNhYmxlIHRoZSBhdXRvLWhpZGluZyBiZWhhdmlvciBvZiB0aGUgbGltaXQgbGFiZWxzLiAqL1xyXG4gIGF1dG9IaWRlTGltaXRMYWJlbHM/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIG1ha2UgdGhlIHNsaWRlciByZWFkLW9ubHkuICovXHJcbiAgcmVhZE9ubHk/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBkaXNhYmxlIHRoZSBzbGlkZXIuICovXHJcbiAgZGlzYWJsZWQ/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBkaXNwbGF5IGEgdGljayBmb3IgZWFjaCBzdGVwIG9mIHRoZSBzbGlkZXIuICovXHJcbiAgc2hvd1RpY2tzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZGlzcGxheSBhIHRpY2sgYW5kIHRoZSBzdGVwIHZhbHVlIGZvciBlYWNoIHN0ZXAgb2YgdGhlIHNsaWRlci4uICovXHJcbiAgc2hvd1RpY2tzVmFsdWVzPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiBUaGUgc3RlcCBiZXR3ZWVuIGVhY2ggdGljayB0byBkaXNwbGF5LiBJZiBub3Qgc2V0LCB0aGUgc3RlcCB2YWx1ZSBpcyB1c2VkLlxyXG4gICAgTm90IHVzZWQgd2hlbiB0aWNrc0FycmF5IGlzIHNwZWNpZmllZC4gKi9cclxuICB0aWNrU3RlcD86IG51bWJlciA9IG51bGw7XHJcblxyXG4gIC8qIFRoZSBzdGVwIGJldHdlZW4gZGlzcGxheWluZyBlYWNoIHRpY2sgc3RlcCB2YWx1ZS5cclxuICAgIElmIG5vdCBzZXQsIHRoZW4gdGlja1N0ZXAgb3Igc3RlcCBpcyB1c2VkLCBkZXBlbmRpbmcgb24gd2hpY2ggb25lIGlzIHNldC4gKi9cclxuICB0aWNrVmFsdWVTdGVwPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIFVzZSB0byBkaXNwbGF5IHRpY2tzIGF0IHNwZWNpZmljIHBvc2l0aW9ucy5cclxuICAgIFRoZSBhcnJheSBjb250YWlucyB0aGUgaW5kZXggb2YgdGhlIHRpY2tzIHRoYXQgc2hvdWxkIGJlIGRpc3BsYXllZC5cclxuICAgIEZvciBleGFtcGxlLCBbMCwgMSwgNV0gd2lsbCBkaXNwbGF5IGEgdGljayBmb3IgdGhlIGZpcnN0LCBzZWNvbmQgYW5kIHNpeHRoIHZhbHVlcy4gKi9cclxuICB0aWNrc0FycmF5PzogbnVtYmVyW10gPSBudWxsO1xyXG5cclxuICAvKiogVXNlZCB0byBkaXNwbGF5IGEgdG9vbHRpcCB3aGVuIGEgdGljayBpcyBob3ZlcmVkLlxyXG4gICAgU2V0IHRvIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSB0b29sdGlwIGNvbnRlbnQgZm9yIGEgZ2l2ZW4gdmFsdWUuICovXHJcbiAgdGlja3NUb29sdGlwPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBTYW1lIGFzIHRpY2tzVG9vbHRpcCBidXQgZm9yIHRpY2tzIHZhbHVlcy4gKi9cclxuICB0aWNrc1ZhbHVlc1Rvb2x0aXA/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGRpc3BsYXkgdGhlIHNsaWRlciB2ZXJ0aWNhbGx5LlxyXG4gICAgVGhlIHNsaWRlciB3aWxsIHRha2UgdGhlIGZ1bGwgaGVpZ2h0IG9mIGl0cyBwYXJlbnQuXHJcbiAgICBDaGFuZ2luZyB0aGlzIHZhbHVlIGF0IHJ1bnRpbWUgaXMgbm90IGN1cnJlbnRseSBzdXBwb3J0ZWQuICovXHJcbiAgdmVydGljYWw/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGN1cnJlbnQgY29sb3Igb2YgdGhlIHNlbGVjdGlvbiBiYXIuXHJcbiAgICBJZiB5b3VyIGNvbG9yIHdvbid0IGNoYW5nZSwgZG9uJ3QgdXNlIHRoaXMgb3B0aW9uIGJ1dCBzZXQgaXQgdGhyb3VnaCBDU1MuXHJcbiAgICBJZiB0aGUgcmV0dXJuZWQgY29sb3IgZGVwZW5kcyBvbiBhIG1vZGVsIHZhbHVlIChlaXRoZXIgdmFsdWUgb3IgdmFsdWVIaWdoKSxcclxuICAgIHlvdSBzaG91bGQgdXNlIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uLlxyXG4gICAgSW5kZWVkLCB3aGVuIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQsIHRoZXJlIGlzIG5vIGNlcnRhaW50eSB0aGF0IHRoZSBtb2RlbFxyXG4gICAgaGFzIGFscmVhZHkgYmVlbiB1cGRhdGVkLiovXHJcbiAgZ2V0U2VsZWN0aW9uQmFyQ29sb3I/OiAobWluVmFsdWU6IG51bWJlciwgbWF4VmFsdWU/OiBudW1iZXIpID0+IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIGNvbG9yIG9mIGEgdGljay4gc2hvd1RpY2tzIG11c3QgYmUgZW5hYmxlZC4gKi9cclxuICBnZXRUaWNrQ29sb3I/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgLyoqIEZ1bmN0aW9uIHRoYXQgcmV0dXJucyB0aGUgY3VycmVudCBjb2xvciBvZiBhIHBvaW50ZXIuXHJcbiAgICBJZiB5b3VyIGNvbG9yIHdvbid0IGNoYW5nZSwgZG9uJ3QgdXNlIHRoaXMgb3B0aW9uIGJ1dCBzZXQgaXQgdGhyb3VnaCBDU1MuXHJcbiAgICBJZiB0aGUgcmV0dXJuZWQgY29sb3IgZGVwZW5kcyBvbiBhIG1vZGVsIHZhbHVlIChlaXRoZXIgdmFsdWUgb3IgdmFsdWVIaWdoKSxcclxuICAgIHlvdSBzaG91bGQgdXNlIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gdGhlIGZ1bmN0aW9uLlxyXG4gICAgSW5kZWVkLCB3aGVuIHRoZSBmdW5jdGlvbiBpcyBjYWxsZWQsIHRoZXJlIGlzIG5vIGNlcnRhaW50eSB0aGF0IHRoZSBtb2RlbCBoYXMgYWxyZWFkeSBiZWVuIHVwZGF0ZWQuXHJcbiAgICBUbyBoYW5kbGUgcmFuZ2Ugc2xpZGVyIHBvaW50ZXJzIGluZGVwZW5kZW50bHksIHlvdSBzaG91bGQgZXZhbHVhdGUgcG9pbnRlclR5cGUgd2l0aGluIHRoZSBnaXZlblxyXG4gICAgZnVuY3Rpb24gd2hlcmUgXCJtaW5cIiBzdGFuZHMgZm9yIHZhbHVlIG1vZGVsIGFuZCBcIm1heFwiIGZvciB2YWx1ZUhpZ2ggbW9kZWwgdmFsdWVzLiAqL1xyXG4gIGdldFBvaW50ZXJDb2xvcj86ICh2YWx1ZTogbnVtYmVyLCBwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpID0+IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBIYW5kbGVzIGFyZSBmb2N1c2FibGUgKG9uIGNsaWNrIG9yIHdpdGggdGFiKSBhbmQgY2FuIGJlIG1vZGlmaWVkIHVzaW5nIHRoZSBmb2xsb3dpbmcga2V5Ym9hcmQgY29udHJvbHM6XHJcbiAgICBMZWZ0L2JvdHRvbSBhcnJvd3M6IC0xXHJcbiAgICBSaWdodC90b3AgYXJyb3dzOiArMVxyXG4gICAgUGFnZS1kb3duOiAtMTAlXHJcbiAgICBQYWdlLXVwOiArMTAlXHJcbiAgICBIb21lOiBtaW5pbXVtIHZhbHVlXHJcbiAgICBFbmQ6IG1heGltdW0gdmFsdWVcclxuICAgKi9cclxuICBrZXlib2FyZFN1cHBvcnQ/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIElmIHlvdSBkaXNwbGF5IHRoZSBzbGlkZXIgaW4gYW4gZWxlbWVudCB0aGF0IHVzZXMgdHJhbnNmb3JtOiBzY2FsZSgwLjUpLCBzZXQgdGhlIHNjYWxlIHZhbHVlIHRvIDJcclxuICAgIHNvIHRoYXQgdGhlIHNsaWRlciBpcyByZW5kZXJlZCBwcm9wZXJseSBhbmQgdGhlIGV2ZW50cyBhcmUgaGFuZGxlZCBjb3JyZWN0bHkuICovXHJcbiAgc2NhbGU/OiBudW1iZXIgPSAxO1xyXG5cclxuICAvKiogSWYgeW91IGRpc3BsYXkgdGhlIHNsaWRlciBpbiBhbiBlbGVtZW50IHRoYXQgdXNlcyB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyksIHNldCB0aGUgcm90YXRlIHZhbHVlIHRvIDkwXHJcbiAgIHNvIHRoYXQgdGhlIHNsaWRlciBpcyByZW5kZXJlZCBwcm9wZXJseSBhbmQgdGhlIGV2ZW50cyBhcmUgaGFuZGxlZCBjb3JyZWN0bHkuIFZhbHVlIGlzIGluIGRlZ3JlZXMuICovXHJcbiAgcm90YXRlPzogbnVtYmVyID0gMDtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGZvcmNlIHRoZSB2YWx1ZShzKSB0byBiZSByb3VuZGVkIHRvIHRoZSBzdGVwLCBldmVuIHdoZW4gbW9kaWZpZWQgZnJvbSB0aGUgb3V0c2lkZS5cclxuICAgIFdoZW4gc2V0IHRvIGZhbHNlLCBpZiB0aGUgbW9kZWwgdmFsdWVzIGFyZSBtb2RpZmllZCBmcm9tIG91dHNpZGUgdGhlIHNsaWRlciwgdGhleSBhcmUgbm90IHJvdW5kZWRcclxuICAgIGFuZCBjYW4gYmUgYmV0d2VlbiB0d28gc3RlcHMuICovXHJcbiAgZW5mb3JjZVN0ZXA/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIGZvcmNlIHRoZSB2YWx1ZShzKSB0byBiZSBub3JtYWxpc2VkIHRvIGFsbG93ZWQgcmFuZ2UgKGZsb29yIHRvIGNlaWwpLCBldmVuIHdoZW4gbW9kaWZpZWQgZnJvbSB0aGUgb3V0c2lkZS5cclxuICAgIFdoZW4gc2V0IHRvIGZhbHNlLCBpZiB0aGUgbW9kZWwgdmFsdWVzIGFyZSBtb2RpZmllZCBmcm9tIG91dHNpZGUgdGhlIHNsaWRlciwgYW5kIHRoZXkgYXJlIG91dHNpZGUgYWxsb3dlZCByYW5nZSxcclxuICAgIHRoZSBzbGlkZXIgbWF5IGJlIHJlbmRlcmVkIGluY29ycmVjdGx5LiBIb3dldmVyLCBzZXR0aW5nIHRoaXMgdG8gZmFsc2UgbWF5IGJlIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byBwZXJmb3JtIGN1c3RvbSBub3JtYWxpc2F0aW9uLiAqL1xyXG4gIGVuZm9yY2VSYW5nZT86IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gZm9yY2UgdGhlIHZhbHVlKHMpIHRvIGJlIHJvdW5kZWQgdG8gdGhlIG5lYXJlc3Qgc3RlcCB2YWx1ZSwgZXZlbiB3aGVuIG1vZGlmaWVkIGZyb20gdGhlIG91dHNpZGUuXHJcbiAgICBXaGVuIHNldCB0byBmYWxzZSwgaWYgdGhlIG1vZGVsIHZhbHVlcyBhcmUgbW9kaWZpZWQgZnJvbSBvdXRzaWRlIHRoZSBzbGlkZXIsIGFuZCB0aGV5IGFyZSBvdXRzaWRlIGFsbG93ZWQgcmFuZ2UsXHJcbiAgICB0aGUgc2xpZGVyIG1heSBiZSByZW5kZXJlZCBpbmNvcnJlY3RseS4gSG93ZXZlciwgc2V0dGluZyB0aGlzIHRvIGZhbHNlIG1heSBiZSB1c2VmdWwgaWYgeW91IHdhbnQgdG8gcGVyZm9ybSBjdXN0b20gbm9ybWFsaXNhdGlvbi4gKi9cclxuICBlbmZvcmNlU3RlcHNBcnJheT86IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gcHJldmVudCB0byB1c2VyIGZyb20gc3dpdGNoaW5nIHRoZSBtaW4gYW5kIG1heCBoYW5kbGVzLiBBcHBsaWVzIHRvIHJhbmdlIHNsaWRlciBvbmx5LiAqL1xyXG4gIG5vU3dpdGNoaW5nPzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvKiogU2V0IHRvIHRydWUgdG8gb25seSBiaW5kIGV2ZW50cyBvbiBzbGlkZXIgaGFuZGxlcy4gKi9cclxuICBvbmx5QmluZEhhbmRsZXM/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBzaG93IGdyYXBocyByaWdodCB0byBsZWZ0LlxyXG4gICAgSWYgdmVydGljYWwgaXMgdHJ1ZSBpdCB3aWxsIGJlIGZyb20gdG9wIHRvIGJvdHRvbSBhbmQgbGVmdCAvIHJpZ2h0IGFycm93IGZ1bmN0aW9ucyByZXZlcnNlZC4gKi9cclxuICByaWdodFRvTGVmdD86IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIHJldmVyc2Uga2V5Ym9hcmQgbmF2aWdhdGlvbjpcclxuICAgIFJpZ2h0L3RvcCBhcnJvd3M6IC0xXHJcbiAgICBMZWZ0L2JvdHRvbSBhcnJvd3M6ICsxXHJcbiAgICBQYWdlLXVwOiAtMTAlXHJcbiAgICBQYWdlLWRvd246ICsxMCVcclxuICAgIEVuZDogbWluaW11bSB2YWx1ZVxyXG4gICAgSG9tZTogbWF4aW11bSB2YWx1ZVxyXG4gICAqL1xyXG4gIHJldmVyc2VkQ29udHJvbHM/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBTZXQgdG8gdHJ1ZSB0byBrZWVwIHRoZSBzbGlkZXIgbGFiZWxzIGluc2lkZSB0aGUgc2xpZGVyIGJvdW5kcy4gKi9cclxuICBib3VuZFBvaW50ZXJMYWJlbHM/OiBib29sZWFuID0gdHJ1ZTtcclxuXHJcbiAgLyoqIFNldCB0byB0cnVlIHRvIHVzZSBhIGxvZ2FyaXRobWljIHNjYWxlIHRvIGRpc3BsYXkgdGhlIHNsaWRlci4gICovXHJcbiAgbG9nU2NhbGU/OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8qKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHBvc2l0aW9uIG9uIHRoZSBzbGlkZXIgZm9yIGEgZ2l2ZW4gdmFsdWUuXHJcbiAgICBUaGUgcG9zaXRpb24gbXVzdCBiZSBhIHBlcmNlbnRhZ2UgYmV0d2VlbiAwIGFuZCAxLlxyXG4gICAgVGhlIGZ1bmN0aW9uIHNob3VsZCBiZSBtb25vdG9uaWNhbGx5IGluY3JlYXNpbmcgb3IgZGVjcmVhc2luZzsgb3RoZXJ3aXNlIHRoZSBzbGlkZXIgbWF5IGJlaGF2ZSBpbmNvcnJlY3RseS4gKi9cclxuICBjdXN0b21WYWx1ZVRvUG9zaXRpb24/OiBWYWx1ZVRvUG9zaXRpb25GdW5jdGlvbiA9IG51bGw7XHJcblxyXG4gIC8qKiBGdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIGZvciBhIGdpdmVuIHBvc2l0aW9uIG9uIHRoZSBzbGlkZXIuXHJcbiAgICBUaGUgcG9zaXRpb24gaXMgYSBwZXJjZW50YWdlIGJldHdlZW4gMCBhbmQgMS5cclxuICAgIFRoZSBmdW5jdGlvbiBzaG91bGQgYmUgbW9ub3RvbmljYWxseSBpbmNyZWFzaW5nIG9yIGRlY3JlYXNpbmc7IG90aGVyd2lzZSB0aGUgc2xpZGVyIG1heSBiZWhhdmUgaW5jb3JyZWN0bHkuICovXHJcbiAgY3VzdG9tUG9zaXRpb25Ub1ZhbHVlPzogUG9zaXRpb25Ub1ZhbHVlRnVuY3Rpb24gPSBudWxsO1xyXG5cclxuICAvKiogUHJlY2lzaW9uIGxpbWl0IGZvciBjYWxjdWxhdGVkIHZhbHVlcy5cclxuICAgIFZhbHVlcyB1c2VkIGluIGNhbGN1bGF0aW9ucyB3aWxsIGJlIHJvdW5kZWQgdG8gdGhpcyBudW1iZXIgb2Ygc2lnbmlmaWNhbnQgZGlnaXRzXHJcbiAgICB0byBwcmV2ZW50IGFjY3VtdWxhdGluZyBzbWFsbCBmbG9hdGluZy1wb2ludCBlcnJvcnMuICovXHJcbiAgcHJlY2lzaW9uTGltaXQ/OiBudW1iZXIgPSAxMjtcclxuXHJcbiAgLyoqIFVzZSB0byBkaXNwbGF5IHRoZSBzZWxlY3Rpb24gYmFyIGFzIGEgZ3JhZGllbnQuXHJcbiAgICBUaGUgZ2l2ZW4gb2JqZWN0IG11c3QgY29udGFpbiBmcm9tIGFuZCB0byBwcm9wZXJ0aWVzIHdoaWNoIGFyZSBjb2xvcnMuICovXHJcbiAgc2VsZWN0aW9uQmFyR3JhZGllbnQ/OiB7ZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nfSA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2UgdG8gYWRkIGEgbGFiZWwgZGlyZWN0bHkgdG8gdGhlIHNsaWRlciBmb3IgYWNjZXNzaWJpbGl0eS4gQWRkcyB0aGUgYXJpYS1sYWJlbCBhdHRyaWJ1dGUuICovXHJcbiAgYXJpYUxhYmVsPzogc3RyaW5nID0gJ25neC1zbGlkZXInO1xyXG5cclxuICAvKiogVXNlIGluc3RlYWQgb2YgYXJpYUxhYmVsIHRvIHJlZmVyZW5jZSB0aGUgaWQgb2YgYW4gZWxlbWVudCB3aGljaCB3aWxsIGJlIHVzZWQgdG8gbGFiZWwgdGhlIHNsaWRlci5cclxuICAgIEFkZHMgdGhlIGFyaWEtbGFiZWxsZWRieSBhdHRyaWJ1dGUuICovXHJcbiAgYXJpYUxhYmVsbGVkQnk/OiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGFkZCBhIGxhYmVsIGRpcmVjdGx5IHRvIHRoZSBzbGlkZXIgcmFuZ2UgZm9yIGFjY2Vzc2liaWxpdHkuIEFkZHMgdGhlIGFyaWEtbGFiZWwgYXR0cmlidXRlLiAqL1xyXG4gIGFyaWFMYWJlbEhpZ2g/OiBzdHJpbmcgPSAnbmd4LXNsaWRlci1tYXgnO1xyXG5cclxuICAvKiogVXNlIGluc3RlYWQgb2YgYXJpYUxhYmVsSGlnaCB0byByZWZlcmVuY2UgdGhlIGlkIG9mIGFuIGVsZW1lbnQgd2hpY2ggd2lsbCBiZSB1c2VkIHRvIGxhYmVsIHRoZSBzbGlkZXIgcmFuZ2UuXHJcbiAgICBBZGRzIHRoZSBhcmlhLWxhYmVsbGVkYnkgYXR0cmlidXRlLiAqL1xyXG4gIGFyaWFMYWJlbGxlZEJ5SGlnaD86IHN0cmluZyA9IG51bGw7XHJcblxyXG4gIC8qKiBVc2UgdG8gaW5jcmVhc2UgcmVuZGVyaW5nIHBlcmZvcm1hbmNlLiBJZiB0aGUgdmFsdWUgaXMgbm90IHByb3ZpZGVkLCB0aGUgc2xpZGVyIGNhbGN1bGF0ZXMgdGhlIHdpdGgvaGVpZ2h0IG9mIHRoZSBoYW5kbGUgKi9cclxuICBoYW5kbGVEaW1lbnNpb24/OiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAvKiogVXNlIHRvIGluY3JlYXNlIHJlbmRlcmluZyBwZXJmb3JtYW5jZS4gSWYgdGhlIHZhbHVlIGlzIG5vdCBwcm92aWRlZCwgdGhlIHNsaWRlciBjYWxjdWxhdGVzIHRoZSB3aXRoL2hlaWdodCBvZiB0aGUgYmFyICovXHJcbiAgYmFyRGltZW5zaW9uPzogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgLyoqIEVuYWJsZS9kaXNhYmxlIENTUyBhbmltYXRpb25zICovXHJcbiAgYW5pbWF0ZT86IGJvb2xlYW4gPSB0cnVlO1xyXG5cclxuICAvKiogRW5hYmxlL2Rpc2FibGUgQ1NTIGFuaW1hdGlvbnMgd2hpbGUgbW92aW5nIHRoZSBzbGlkZXIgKi9cclxuICBhbmltYXRlT25Nb3ZlPzogYm9vbGVhbiA9IGZhbHNlO1xyXG59XHJcbiIsIi8qKiBQb2ludGVyIHR5cGUgKi9cclxuZXhwb3J0IGVudW0gUG9pbnRlclR5cGUge1xyXG4gIC8qKiBMb3cgcG9pbnRlciAqL1xyXG4gIE1pbixcclxuICAvKiogSGlnaCBwb2ludGVyICovXHJcbiAgTWF4XHJcbn1cclxuIiwiaW1wb3J0IHsgUG9pbnRlclR5cGUgfSBmcm9tICcuL3BvaW50ZXItdHlwZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhbmdlQ29udGV4dCB7XHJcbiAgdmFsdWU6IG51bWJlcjtcclxuICBoaWdoVmFsdWU/OiBudW1iZXI7XHJcbiAgcG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlO1xyXG59XHJcbiIsImltcG9ydCB7IEN1c3RvbVN0ZXBEZWZpbml0aW9uIH0gZnJvbSAnLi9vcHRpb25zJztcclxuXHJcbi8qKlxyXG4gKiAgQ29sbGVjdGlvbiBvZiBmdW5jdGlvbnMgdG8gaGFuZGxlIGNvbnZlcnNpb25zL2xvb2t1cHMgb2YgdmFsdWVzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgVmFsdWVIZWxwZXIge1xyXG4gIHN0YXRpYyBpc051bGxPclVuZGVmaW5lZCh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gbnVsbDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBhcmVBcnJheXNFcXVhbChhcnJheTE6IGFueVtdLCBhcnJheTI6IGFueVtdKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoYXJyYXkxLmxlbmd0aCAhPT0gYXJyYXkyLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IGFycmF5MS5sZW5ndGg7ICsraSkge1xyXG4gICAgICBpZiAoYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsaW5lYXJWYWx1ZVRvUG9zaXRpb24odmFsOiBudW1iZXIsIG1pblZhbDogbnVtYmVyLCBtYXhWYWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCByYW5nZTogbnVtYmVyID0gbWF4VmFsIC0gbWluVmFsO1xyXG4gICAgcmV0dXJuICh2YWwgLSBtaW5WYWwpIC8gcmFuZ2U7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgbG9nVmFsdWVUb1Bvc2l0aW9uKHZhbDogbnVtYmVyLCBtaW5WYWw6IG51bWJlciwgbWF4VmFsOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgdmFsID0gTWF0aC5sb2codmFsKTtcclxuICAgIG1pblZhbCA9IE1hdGgubG9nKG1pblZhbCk7XHJcbiAgICBtYXhWYWwgPSBNYXRoLmxvZyhtYXhWYWwpO1xyXG4gICAgY29uc3QgcmFuZ2U6IG51bWJlciA9IG1heFZhbCAtIG1pblZhbDtcclxuICAgIHJldHVybiAodmFsIC0gbWluVmFsKSAvIHJhbmdlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxpbmVhclBvc2l0aW9uVG9WYWx1ZShwZXJjZW50OiBudW1iZXIsIG1pblZhbDogbnVtYmVyLCBtYXhWYWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICByZXR1cm4gcGVyY2VudCAqIChtYXhWYWwgLSBtaW5WYWwpICsgbWluVmFsO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGxvZ1Bvc2l0aW9uVG9WYWx1ZShwZXJjZW50OiBudW1iZXIsIG1pblZhbDogbnVtYmVyLCBtYXhWYWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBtaW5WYWwgPSBNYXRoLmxvZyhtaW5WYWwpO1xyXG4gICAgbWF4VmFsID0gTWF0aC5sb2cobWF4VmFsKTtcclxuICAgIGNvbnN0IHZhbHVlOiBudW1iZXIgPSBwZXJjZW50ICogKG1heFZhbCAtIG1pblZhbCkgKyBtaW5WYWw7XHJcbiAgICByZXR1cm4gTWF0aC5leHAodmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGZpbmRTdGVwSW5kZXgobW9kZWxWYWx1ZTogbnVtYmVyLCBzdGVwc0FycmF5OiBDdXN0b21TdGVwRGVmaW5pdGlvbltdKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGRpZmZlcmVuY2VzOiBudW1iZXJbXSA9IHN0ZXBzQXJyYXkubWFwKChzdGVwOiBDdXN0b21TdGVwRGVmaW5pdGlvbik6IG51bWJlciA9PiBNYXRoLmFicyhtb2RlbFZhbHVlIC0gc3RlcC52YWx1ZSkpO1xyXG5cclxuICAgIGxldCBtaW5EaWZmZXJlbmNlSW5kZXg6IG51bWJlciA9IDA7XHJcbiAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCBzdGVwc0FycmF5Lmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICBpZiAoZGlmZmVyZW5jZXNbaW5kZXhdICE9PSBkaWZmZXJlbmNlc1ttaW5EaWZmZXJlbmNlSW5kZXhdICYmIGRpZmZlcmVuY2VzW2luZGV4XSA8IGRpZmZlcmVuY2VzW21pbkRpZmZlcmVuY2VJbmRleF0pIHtcclxuICAgICAgICBtaW5EaWZmZXJlbmNlSW5kZXggPSBpbmRleDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBtaW5EaWZmZXJlbmNlSW5kZXg7XHJcbiAgfVxyXG59XHJcbiIsIi8vIERlY2xhcmF0aW9uIGZvciBSZXNpemVPYnNlcnZlciBhIG5ldyBBUEkgYXZhaWxhYmxlIGluIHNvbWUgb2YgbmV3ZXN0IGJyb3dzZXJzOlxyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvUmVzaXplT2JzZXJ2ZXJcclxuZGVjbGFyZSBjbGFzcyBSZXNpemVPYnNlcnZlciB7XHJcbn1cclxuXHJcbi8qKiBIZWxwZXIgd2l0aCBjb21wYXRpYmlsaXR5IGZ1bmN0aW9ucyB0byBzdXBwb3J0IGRpZmZlcmVudCBicm93c2VycyAqL1xyXG5leHBvcnQgY2xhc3MgQ29tcGF0aWJpbGl0eUhlbHBlciB7XHJcbiAgLyoqIFdvcmthcm91bmQgZm9yIFRvdWNoRXZlbnQgY29uc3RydWN0b3Igc2FkbHkgbm90IGJlaW5nIGF2YWlsYWJsZSBvbiBhbGwgYnJvd3NlcnMgKGUuZy4gRmlyZWZveCwgU2FmYXJpKSAqL1xyXG4gIHB1YmxpYyBzdGF0aWMgaXNUb3VjaEV2ZW50KGV2ZW50OiBhbnkpOiBib29sZWFuIHtcclxuICAgIGlmICgod2luZG93IGFzIGFueSkuVG91Y2hFdmVudCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiBldmVudCBpbnN0YW5jZW9mIFRvdWNoRXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV2ZW50LnRvdWNoZXMgIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIC8qKiBEZXRlY3QgcHJlc2VuY2Ugb2YgUmVzaXplT2JzZXJ2ZXIgQVBJICovXHJcbiAgcHVibGljIHN0YXRpYyBpc1Jlc2l6ZU9ic2VydmVyQXZhaWxhYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICh3aW5kb3cgYXMgYW55KS5SZXNpemVPYnNlcnZlciAhPT0gdW5kZWZpbmVkO1xyXG4gIH1cclxufVxyXG4iLCIvKiogSGVscGVyIHdpdGggbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucyAqL1xyXG5leHBvcnQgY2xhc3MgTWF0aEhlbHBlciB7XHJcbiAgLyogUm91bmQgbnVtYmVycyB0byBhIGdpdmVuIG51bWJlciBvZiBzaWduaWZpY2FudCBkaWdpdHMgKi9cclxuICBzdGF0aWMgcm91bmRUb1ByZWNpc2lvbkxpbWl0KHZhbHVlOiBudW1iZXIsIHByZWNpc2lvbkxpbWl0OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuICsoIHZhbHVlLnRvUHJlY2lzaW9uKHByZWNpc2lvbkxpbWl0KSApO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGlzTW9kdWxvV2l0aGluUHJlY2lzaW9uTGltaXQodmFsdWU6IG51bWJlciwgbW9kdWxvOiBudW1iZXIsIHByZWNpc2lvbkxpbWl0OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IGxpbWl0OiBudW1iZXIgPSBNYXRoLnBvdygxMCwgLXByZWNpc2lvbkxpbWl0KTtcclxuICAgIHJldHVybiBNYXRoLmFicyh2YWx1ZSAlIG1vZHVsbykgPD0gbGltaXQgfHwgTWF0aC5hYnMoTWF0aC5hYnModmFsdWUgJSBtb2R1bG8pIC0gbW9kdWxvKSA8PSBsaW1pdDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBjbGFtcFRvUmFuZ2UodmFsdWU6IG51bWJlciwgZmxvb3I6IG51bWJlciwgY2VpbDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgZmxvb3IpLCBjZWlsKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcblxyXG5leHBvcnQgY2xhc3MgRXZlbnRMaXN0ZW5lciB7XHJcbiAgZXZlbnROYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gIGV2ZW50czogU3ViamVjdDxFdmVudD4gPSBudWxsO1xyXG4gIGV2ZW50c1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICB0ZWFyZG93bkNhbGxiYWNrOiAoKSA9PiB2b2lkID0gbnVsbDtcclxufVxyXG4iLCJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyB0aHJvdHRsZVRpbWUsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgc3VwcG9ydHNQYXNzaXZlRXZlbnRzIH0gZnJvbSAnZGV0ZWN0LXBhc3NpdmUtZXZlbnRzJztcclxuXHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL2V2ZW50LWxpc3RlbmVyJztcclxuaW1wb3J0IHsgVmFsdWVIZWxwZXIgfSBmcm9tICcuL3ZhbHVlLWhlbHBlcic7XHJcblxyXG4vKipcclxuICogSGVscGVyIGNsYXNzIHRvIGF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gRE9NIGVsZW1lbnRzIHdpdGggZGVib3VuY2Ugc3VwcG9ydCB1c2luZyByeGpzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRMaXN0ZW5lckhlbHBlciB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXR0YWNoUGFzc2l2ZUV2ZW50TGlzdGVuZXIobmF0aXZlRWxlbWVudDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiB2b2lkLFxyXG4gICAgICB0aHJvdHRsZUludGVydmFsPzogbnVtYmVyKTogRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAvLyBPbmx5IHVzZSBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycyBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdFxyXG4gICAgaWYgKHN1cHBvcnRzUGFzc2l2ZUV2ZW50cyAhPT0gdHJ1ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hFdmVudExpc3RlbmVyKG5hdGl2ZUVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIHRocm90dGxlSW50ZXJ2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFuZ3VsYXIgZG9lc24ndCBzdXBwb3J0IHBhc3NpdmUgZXZlbnQgaGFuZGxlcnMgKHlldCksIHNvIHdlIG5lZWQgdG8gcm9sbCBvdXIgb3duIGNvZGUgdXNpbmcgbmF0aXZlIGZ1bmN0aW9uc1xyXG4gICAgY29uc3QgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSBuZXcgRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgbGlzdGVuZXIuZXZlbnROYW1lID0gZXZlbnROYW1lO1xyXG4gICAgbGlzdGVuZXIuZXZlbnRzID0gbmV3IFN1YmplY3Q8RXZlbnQ+KCk7XHJcblxyXG4gICAgY29uc3Qgb2JzZXJ2ZXJDYWxsYmFjazogKGV2ZW50OiBFdmVudCkgPT4gdm9pZCA9IChldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGlzdGVuZXIuZXZlbnRzLm5leHQoZXZlbnQpO1xyXG4gICAgfTtcclxuICAgIG5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9ic2VydmVyQ2FsbGJhY2ssIHtwYXNzaXZlOiB0cnVlLCBjYXB0dXJlOiBmYWxzZX0pO1xyXG5cclxuICAgIGxpc3RlbmVyLnRlYXJkb3duQ2FsbGJhY2sgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIG5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9ic2VydmVyQ2FsbGJhY2ssIHtwYXNzaXZlOiB0cnVlLCBjYXB0dXJlOiBmYWxzZX0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24gPSBsaXN0ZW5lci5ldmVudHNcclxuICAgICAgLnBpcGUoKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aHJvdHRsZUludGVydmFsKSlcclxuICAgICAgICA/IHRocm90dGxlVGltZSh0aHJvdHRsZUludGVydmFsLCB1bmRlZmluZWQsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IHRydWV9KVxyXG4gICAgICAgIDogdGFwKCgpID0+IHt9KSAvLyBuby1vcFxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGxpc3RlbmVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRldGFjaEV2ZW50TGlzdGVuZXIoZXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcik6IHZvaWQge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChldmVudExpc3RlbmVyLmV2ZW50c1N1YnNjcmlwdGlvbikpIHtcclxuICAgICAgZXZlbnRMaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgZXZlbnRMaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZXZlbnRMaXN0ZW5lci5ldmVudHMpKSB7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIuZXZlbnRzLmNvbXBsZXRlKCk7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIuZXZlbnRzID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50TGlzdGVuZXIudGVhcmRvd25DYWxsYmFjaykpIHtcclxuICAgICAgZXZlbnRMaXN0ZW5lci50ZWFyZG93bkNhbGxiYWNrKCk7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIudGVhcmRvd25DYWxsYmFjayA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXR0YWNoRXZlbnRMaXN0ZW5lcihuYXRpdmVFbGVtZW50OiBhbnksIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IHZvaWQsXHJcbiAgICAgIHRocm90dGxlSW50ZXJ2YWw/OiBudW1iZXIpOiBFdmVudExpc3RlbmVyIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyOiBFdmVudExpc3RlbmVyID0gbmV3IEV2ZW50TGlzdGVuZXIoKTtcclxuICAgIGxpc3RlbmVyLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcclxuICAgIGxpc3RlbmVyLmV2ZW50cyA9IG5ldyBTdWJqZWN0PEV2ZW50PigpO1xyXG5cclxuICAgIGNvbnN0IG9ic2VydmVyQ2FsbGJhY2s6IChldmVudDogRXZlbnQpID0+IHZvaWQgPSAoZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxpc3RlbmVyLmV2ZW50cy5uZXh0KGV2ZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgbGlzdGVuZXIudGVhcmRvd25DYWxsYmFjayA9IHRoaXMucmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIGV2ZW50TmFtZSwgb2JzZXJ2ZXJDYWxsYmFjayk7XHJcblxyXG4gICAgbGlzdGVuZXIuZXZlbnRzU3Vic2NyaXB0aW9uID0gbGlzdGVuZXIuZXZlbnRzXHJcbiAgICAgIC5waXBlKCghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhyb3R0bGVJbnRlcnZhbCkpXHJcbiAgICAgICAgICA/IHRocm90dGxlVGltZSh0aHJvdHRsZUludGVydmFsLCB1bmRlZmluZWQsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IHRydWV9KVxyXG4gICAgICAgICAgOiB0YXAoKCkgPT4ge30pIC8vIG5vLW9wXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IEV2ZW50KSA9PiB7IGNhbGxiYWNrKGV2ZW50KTsgfSk7XHJcblxyXG4gICAgcmV0dXJuIGxpc3RlbmVyO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgSG9zdEJpbmRpbmcsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXJIZWxwZXIgfSBmcm9tICcuL2V2ZW50LWxpc3RlbmVyLWhlbHBlcic7XHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL2V2ZW50LWxpc3RlbmVyJztcclxuaW1wb3J0IHsgVmFsdWVIZWxwZXIgfSBmcm9tICcuL3ZhbHVlLWhlbHBlcic7XHJcblxyXG5ARGlyZWN0aXZlKHtcclxuICBzZWxlY3RvcjogJ1tuZ3hTbGlkZXJFbGVtZW50XSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNsaWRlckVsZW1lbnREaXJlY3RpdmUge1xyXG4gIHByaXZhdGUgX3Bvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG4gIGdldCBwb3NpdGlvbigpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfZGltZW5zaW9uOiBudW1iZXIgPSAwO1xyXG4gIGdldCBkaW1lbnNpb24oKTogbnVtYmVyIHtcclxuICAgIHJldHVybiB0aGlzLl9kaW1lbnNpb247XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9hbHdheXNIaWRlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgZ2V0IGFsd2F5c0hpZGUoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gdGhpcy5fYWx3YXlzSGlkZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgX3ZlcnRpY2FsOiBib29sZWFuID0gZmFsc2U7XHJcbiAgZ2V0IHZlcnRpY2FsKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuX3ZlcnRpY2FsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBfc2NhbGU6IG51bWJlciA9IDE7XHJcbiAgZ2V0IHNjYWxlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2NhbGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIF9yb3RhdGU6IG51bWJlciA9IDA7XHJcbiAgZ2V0IHJvdGF0ZSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuX3JvdGF0ZTtcclxuICB9XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUub3BhY2l0eScpXHJcbiAgb3BhY2l0eTogbnVtYmVyID0gMTtcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS52aXNpYmlsaXR5JylcclxuICB2aXNpYmlsaXR5OiBzdHJpbmcgPSAndmlzaWJsZSc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUubGVmdCcpXHJcbiAgbGVmdDogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnc3R5bGUuYm90dG9tJylcclxuICBib3R0b206IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLmhlaWdodCcpXHJcbiAgaGVpZ2h0OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdzdHlsZS53aWR0aCcpXHJcbiAgd2lkdGg6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ3N0eWxlLnRyYW5zZm9ybScpXHJcbiAgdHJhbnNmb3JtOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgcHJpdmF0ZSBldmVudExpc3RlbmVySGVscGVyOiBFdmVudExpc3RlbmVySGVscGVyO1xyXG4gIHByaXZhdGUgZXZlbnRMaXN0ZW5lcnM6IEV2ZW50TGlzdGVuZXJbXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZWxlbVJlZjogRWxlbWVudFJlZiwgcHJvdGVjdGVkIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByb3RlY3RlZCBjaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIgPSBuZXcgRXZlbnRMaXN0ZW5lckhlbHBlcih0aGlzLnJlbmRlcmVyKTtcclxuICB9XHJcblxyXG4gIHNldEFsd2F5c0hpZGUoaGlkZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5fYWx3YXlzSGlkZSA9IGhpZGU7XHJcbiAgICBpZiAoaGlkZSkge1xyXG4gICAgICB0aGlzLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGhpZGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLm9wYWNpdHkgPSAwO1xyXG4gIH1cclxuXHJcbiAgc2hvdygpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmFsd2F5c0hpZGUpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub3BhY2l0eSA9IDE7XHJcbiAgfVxyXG5cclxuICBpc1Zpc2libGUoKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5hbHdheXNIaWRlKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLm9wYWNpdHkgIT09IDA7XHJcbiAgfVxyXG5cclxuICBzZXRWZXJ0aWNhbCh2ZXJ0aWNhbDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5fdmVydGljYWwgPSB2ZXJ0aWNhbDtcclxuICAgIGlmICh0aGlzLl92ZXJ0aWNhbCkge1xyXG4gICAgICB0aGlzLmxlZnQgPSAnJztcclxuICAgICAgdGhpcy53aWR0aCA9ICcnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5ib3R0b20gPSAnJztcclxuICAgICAgdGhpcy5oZWlnaHQgPSAnJztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldFNjYWxlKHNjYWxlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuX3NjYWxlID0gc2NhbGU7XHJcbiAgfVxyXG5cclxuICBzZXRSb3RhdGUocm90YXRlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuX3JvdGF0ZSA9IHJvdGF0ZTtcclxuICAgIHRoaXMudHJhbnNmb3JtID0gJ3JvdGF0ZSgnICsgcm90YXRlICsgJ2RlZyknO1xyXG4gIH1cclxuXHJcbiAgZ2V0Um90YXRlKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5fcm90YXRlO1xyXG4gIH1cclxuXHJcbiAgIC8vIFNldCBlbGVtZW50IGxlZnQvdG9wIHBvc2l0aW9uIGRlcGVuZGluZyBvbiB3aGV0aGVyIHNsaWRlciBpcyBob3Jpem9udGFsIG9yIHZlcnRpY2FsXHJcbiAgc2V0UG9zaXRpb24ocG9zOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl9wb3NpdGlvbiAhPT0gcG9zICYmICF0aGlzLmlzUmVmRGVzdHJveWVkKCkpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3Rpb25SZWYubWFya0ZvckNoZWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fcG9zaXRpb24gPSBwb3M7XHJcbiAgICBpZiAodGhpcy5fdmVydGljYWwpIHtcclxuICAgICAgdGhpcy5ib3R0b20gPSBNYXRoLnJvdW5kKHBvcykgKyAncHgnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sZWZ0ID0gTWF0aC5yb3VuZChwb3MpICsgJ3B4JztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIENhbGN1bGF0ZSBlbGVtZW50J3Mgd2lkdGgvaGVpZ2h0IGRlcGVuZGluZyBvbiB3aGV0aGVyIHNsaWRlciBpcyBob3Jpem9udGFsIG9yIHZlcnRpY2FsXHJcbiAgY2FsY3VsYXRlRGltZW5zaW9uKCk6IHZvaWQge1xyXG4gICAgY29uc3QgdmFsOiBDbGllbnRSZWN0ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGlmICh0aGlzLnZlcnRpY2FsKSB7XHJcbiAgICAgIHRoaXMuX2RpbWVuc2lvbiA9ICh2YWwuYm90dG9tIC0gdmFsLnRvcCkgKiB0aGlzLnNjYWxlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fZGltZW5zaW9uID0gKHZhbC5yaWdodCAtIHZhbC5sZWZ0KSAqIHRoaXMuc2NhbGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgZWxlbWVudCB3aWR0aC9oZWlnaHQgZGVwZW5kaW5nIG9uIHdoZXRoZXIgc2xpZGVyIGlzIGhvcml6b250YWwgb3IgdmVydGljYWxcclxuICBzZXREaW1lbnNpb24oZGltOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLl9kaW1lbnNpb24gIT09IGRpbSAmJiAhdGhpcy5pc1JlZkRlc3Ryb3llZCgpKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmLm1hcmtGb3JDaGVjaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2RpbWVuc2lvbiA9IGRpbTtcclxuICAgIGlmICh0aGlzLl92ZXJ0aWNhbCkge1xyXG4gICAgICB0aGlzLmhlaWdodCA9IE1hdGgucm91bmQoZGltKSArICdweCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLndpZHRoID0gTWF0aC5yb3VuZChkaW0pICsgJ3B4JztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOiBDbGllbnRSZWN0IHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICB9XHJcblxyXG4gIG9uKGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IHZvaWQsIGRlYm91bmNlSW50ZXJ2YWw/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyOiBFdmVudExpc3RlbmVyID0gdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmF0dGFjaEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrLCBkZWJvdW5jZUludGVydmFsKTtcclxuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgfVxyXG5cclxuICBvblBhc3NpdmUoZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gdm9pZCwgZGVib3VuY2VJbnRlcnZhbD86IG51bWJlcik6IHZvaWQge1xyXG4gICAgY29uc3QgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuYXR0YWNoUGFzc2l2ZUV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIHRoaXMuZWxlbVJlZi5uYXRpdmVFbGVtZW50LCBldmVudE5hbWUsIGNhbGxiYWNrLCBkZWJvdW5jZUludGVydmFsKTtcclxuICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgfVxyXG5cclxuICBvZmYoZXZlbnROYW1lPzogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBsZXQgbGlzdGVuZXJzVG9LZWVwOiBFdmVudExpc3RlbmVyW107XHJcbiAgICBsZXQgbGlzdGVuZXJzVG9SZW1vdmU6IEV2ZW50TGlzdGVuZXJbXTtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZXZlbnROYW1lKSkge1xyXG4gICAgICBsaXN0ZW5lcnNUb0tlZXAgPSB0aGlzLmV2ZW50TGlzdGVuZXJzLmZpbHRlcigoZXZlbnQ6IEV2ZW50TGlzdGVuZXIpID0+IGV2ZW50LmV2ZW50TmFtZSAhPT0gZXZlbnROYW1lKTtcclxuICAgICAgbGlzdGVuZXJzVG9SZW1vdmUgPSB0aGlzLmV2ZW50TGlzdGVuZXJzLmZpbHRlcigoZXZlbnQ6IEV2ZW50TGlzdGVuZXIpID0+IGV2ZW50LmV2ZW50TmFtZSA9PT0gZXZlbnROYW1lKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGxpc3RlbmVyc1RvS2VlcCA9IFtdO1xyXG4gICAgICBsaXN0ZW5lcnNUb1JlbW92ZSA9IHRoaXMuZXZlbnRMaXN0ZW5lcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiBsaXN0ZW5lcnNUb1JlbW92ZSkge1xyXG4gICAgICB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuZGV0YWNoRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5ldmVudExpc3RlbmVycyA9IGxpc3RlbmVyc1RvS2VlcDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNSZWZEZXN0cm95ZWQoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5jaGFuZ2VEZXRlY3Rpb25SZWYpIHx8IHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmWydkZXN0cm95ZWQnXTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRGlyZWN0aXZlLCBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIEhvc3RCaW5kaW5nLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9zbGlkZXItZWxlbWVudC5kaXJlY3RpdmUnO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgc2VsZWN0b3I6ICdbbmd4U2xpZGVySGFuZGxlXSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNsaWRlckhhbmRsZURpcmVjdGl2ZSBleHRlbmRzIFNsaWRlckVsZW1lbnREaXJlY3RpdmUge1xyXG4gIEBIb3N0QmluZGluZygnY2xhc3Mubmd4LXNsaWRlci1hY3RpdmUnKVxyXG4gIGFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIucm9sZScpXHJcbiAgcm9sZTogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci50YWJpbmRleCcpXHJcbiAgdGFiaW5kZXg6IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS1vcmllbnRhdGlvbicpXHJcbiAgYXJpYU9yaWVudGF0aW9uOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtbGFiZWwnKVxyXG4gIGFyaWFMYWJlbDogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWxhYmVsbGVkYnknKVxyXG4gIGFyaWFMYWJlbGxlZEJ5OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgQEhvc3RCaW5kaW5nKCdhdHRyLmFyaWEtdmFsdWVub3cnKVxyXG4gIGFyaWFWYWx1ZU5vdzogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLXZhbHVldGV4dCcpXHJcbiAgYXJpYVZhbHVlVGV4dDogc3RyaW5nID0gJyc7XHJcblxyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLXZhbHVlbWluJylcclxuICBhcmlhVmFsdWVNaW46IHN0cmluZyA9ICcnO1xyXG5cclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuYXJpYS12YWx1ZW1heCcpXHJcbiAgYXJpYVZhbHVlTWF4OiBzdHJpbmcgPSAnJztcclxuXHJcbiAgZm9jdXMoKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsZW1SZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoZWxlbVJlZjogRWxlbWVudFJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMiwgY2hhbmdlRGV0ZWN0aW9uUmVmOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gICAgc3VwZXIoZWxlbVJlZiwgcmVuZGVyZXIsIGNoYW5nZURldGVjdGlvblJlZik7XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9zbGlkZXItZWxlbWVudC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBWYWx1ZUhlbHBlciB9IGZyb20gJy4vdmFsdWUtaGVscGVyJztcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW25neFNsaWRlckxhYmVsXSdcclxufSlcclxuZXhwb3J0IGNsYXNzIFNsaWRlckxhYmVsRGlyZWN0aXZlIGV4dGVuZHMgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSB7XHJcbiAgcHJpdmF0ZSBfdmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gdGhpcy5fdmFsdWU7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihlbGVtUmVmOiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyLCBjaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmKSB7XHJcbiAgICBzdXBlcihlbGVtUmVmLCByZW5kZXJlciwgY2hhbmdlRGV0ZWN0aW9uUmVmKTtcclxuICB9XHJcblxyXG4gIHNldFZhbHVlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIGxldCByZWNhbGN1bGF0ZURpbWVuc2lvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGlmICghdGhpcy5hbHdheXNIaWRlICYmXHJcbiAgICAgICAgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmFsdWUpIHx8XHJcbiAgICAgICAgIHRoaXMudmFsdWUubGVuZ3RoICE9PSB2YWx1ZS5sZW5ndGggfHxcclxuICAgICAgICAgKHRoaXMudmFsdWUubGVuZ3RoID4gMCAmJiB0aGlzLmRpbWVuc2lvbiA9PT0gMCkpKSB7XHJcbiAgICAgIHJlY2FsY3VsYXRlRGltZW5zaW9uID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xyXG4gICAgdGhpcy5lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuaW5uZXJIVE1MID0gdmFsdWU7XHJcblxyXG4gICAgLy8gVXBkYXRlIGRpbWVuc2lvbiBvbmx5IHdoZW4gbGVuZ3RoIG9mIHRoZSBsYWJlbCBoYXZlIGNoYW5nZWRcclxuICAgIGlmIChyZWNhbGN1bGF0ZURpbWVuc2lvbikge1xyXG4gICAgICB0aGlzLmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgVmlld0NoaWxkLFxyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBIb3N0QmluZGluZyxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgSW5wdXQsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlcjIsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIE91dHB1dCxcclxuICBDb250ZW50Q2hpbGQsXHJcbiAgVGVtcGxhdGVSZWYsXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBmb3J3YXJkUmVmLFxyXG4gIE5nWm9uZVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQgeyBzdXBwb3J0c1Bhc3NpdmVFdmVudHMgfSBmcm9tICdkZXRlY3QtcGFzc2l2ZS1ldmVudHMnO1xyXG5cclxuaW1wb3J0IHtcclxuICBPcHRpb25zLFxyXG4gIExhYmVsVHlwZSxcclxuICBWYWx1ZVRvUG9zaXRpb25GdW5jdGlvbixcclxuICBQb3NpdGlvblRvVmFsdWVGdW5jdGlvbixcclxuICBDdXN0b21TdGVwRGVmaW5pdGlvblxyXG59IGZyb20gJy4vb3B0aW9ucyc7XHJcbmltcG9ydCB7IFBvaW50ZXJUeXBlIH0gZnJvbSAnLi9wb2ludGVyLXR5cGUnO1xyXG5pbXBvcnQgeyBDaGFuZ2VDb250ZXh0IH0gZnJvbSAnLi9jaGFuZ2UtY29udGV4dCc7XHJcbmltcG9ydCB7IFZhbHVlSGVscGVyIH0gZnJvbSAnLi92YWx1ZS1oZWxwZXInO1xyXG5pbXBvcnQgeyBDb21wYXRpYmlsaXR5SGVscGVyIH0gZnJvbSAnLi9jb21wYXRpYmlsaXR5LWhlbHBlcic7XHJcbmltcG9ydCB7IE1hdGhIZWxwZXIgfSBmcm9tICcuL21hdGgtaGVscGVyJztcclxuaW1wb3J0IHsgRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vZXZlbnQtbGlzdGVuZXInO1xyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVySGVscGVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lci1oZWxwZXInO1xyXG5pbXBvcnQgeyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9zbGlkZXItZWxlbWVudC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBTbGlkZXJIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1oYW5kbGUuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgU2xpZGVyTGFiZWxEaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1sYWJlbC5kaXJlY3RpdmUnO1xyXG5cclxuLy8gRGVjbGFyYXRpb24gZm9yIFJlc2l6ZU9ic2VydmVyIGEgbmV3IEFQSSBhdmFpbGFibGUgaW4gc29tZSBvZiBuZXdlc3QgYnJvd3NlcnM6XHJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9SZXNpemVPYnNlcnZlclxyXG5kZWNsYXJlIGNsYXNzIFJlc2l6ZU9ic2VydmVyIHtcclxuICBjb25zdHJ1Y3RvcihjYWxsYmFjazogKCkgPT4gdm9pZCk7XHJcbiAgb2JzZXJ2ZSh0YXJnZXQ6IGFueSk6IHZvaWQ7XHJcbiAgdW5vYnNlcnZlKHRhcmdldDogYW55KTogdm9pZDtcclxuICBkaXNjb25uZWN0KCk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUaWNrIHtcclxuICBzZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHN0eWxlOiBhbnkgPSB7fTtcclxuICB0b29sdGlwOiBzdHJpbmcgPSBudWxsO1xyXG4gIHRvb2x0aXBQbGFjZW1lbnQ6IHN0cmluZyA9IG51bGw7XHJcbiAgdmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgdmFsdWVUb29sdGlwOiBzdHJpbmcgPSBudWxsO1xyXG4gIHZhbHVlVG9vbHRpcFBsYWNlbWVudDogc3RyaW5nID0gbnVsbDtcclxuICBsZWdlbmQ6IHN0cmluZyA9IG51bGw7XHJcbn1cclxuXHJcbmNsYXNzIERyYWdnaW5nIHtcclxuICBhY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB2YWx1ZTogbnVtYmVyID0gMDtcclxuICBkaWZmZXJlbmNlOiBudW1iZXIgPSAwO1xyXG4gIHBvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG4gIGxvd0xpbWl0OiBudW1iZXIgPSAwO1xyXG4gIGhpZ2hMaW1pdDogbnVtYmVyID0gMDtcclxufVxyXG5cclxuY2xhc3MgTW9kZWxWYWx1ZXMge1xyXG4gIHZhbHVlOiBudW1iZXI7XHJcbiAgaGlnaFZhbHVlOiBudW1iZXI7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY29tcGFyZSh4PzogTW9kZWxWYWx1ZXMsIHk/OiBNb2RlbFZhbHVlcyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHgpICYmIFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHkpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh4KSAhPT0gVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoeSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHgudmFsdWUgPT09IHkudmFsdWUgJiYgeC5oaWdoVmFsdWUgPT09IHkuaGlnaFZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgTW9kZWxDaGFuZ2UgZXh0ZW5kcyBNb2RlbFZhbHVlcyB7XHJcbiAgLy8gRmxhZyB1c2VkIHRvIGJ5LXBhc3MgZGlzdGluY3RVbnRpbENoYW5nZWQoKSBmaWx0ZXIgb24gaW5wdXQgdmFsdWVzXHJcbiAgLy8gKHNvbWV0aW1lcyB0aGVyZSBpcyBhIG5lZWQgdG8gcGFzcyB2YWx1ZXMgdGhyb3VnaCBldmVuIHRob3VnaCB0aGUgbW9kZWwgdmFsdWVzIGhhdmUgbm90IGNoYW5nZWQpXHJcbiAgZm9yY2VDaGFuZ2U6IGJvb2xlYW47XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY29tcGFyZSh4PzogTW9kZWxDaGFuZ2UsIHk/OiBNb2RlbENoYW5nZSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHgpICYmIFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHkpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh4KSAhPT0gVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoeSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHgudmFsdWUgPT09IHkudmFsdWUgJiZcclxuICAgICAgICAgICB4LmhpZ2hWYWx1ZSA9PT0geS5oaWdoVmFsdWUgJiZcclxuICAgICAgICAgICB4LmZvcmNlQ2hhbmdlID09PSB5LmZvcmNlQ2hhbmdlO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgSW5wdXRNb2RlbENoYW5nZSBleHRlbmRzIE1vZGVsQ2hhbmdlIHtcclxuICBpbnRlcm5hbENoYW5nZTogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgT3V0cHV0TW9kZWxDaGFuZ2UgZXh0ZW5kcyBNb2RlbENoYW5nZSB7XHJcbiAgdXNlckV2ZW50SW5pdGlhdGVkOiBib29sZWFuO1xyXG59XHJcblxyXG5jb25zdCBOR1hfU0xJREVSX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcclxuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVzZS1iZWZvcmUtZGVjbGFyZSAqL1xyXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNsaWRlckNvbXBvbmVudCksXHJcbiAgbXVsdGk6IHRydWUsXHJcbn07XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtc2xpZGVyJyxcclxuICB0ZW1wbGF0ZTogYDwhLS0gLy8gMCBMZWZ0IHNlbGVjdGlvbiBiYXIgb3V0c2lkZSB0d28gaGFuZGxlcyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjbGVmdE91dGVyU2VsZWN0aW9uQmFyIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyLXdyYXBwZXIgbmd4LXNsaWRlci1sZWZ0LW91dC1zZWxlY3Rpb25cIj5cclxuICA8c3BhbiBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJhclwiPjwvc3Bhbj5cclxuPC9zcGFuPlxyXG48IS0tIC8vIDEgUmlnaHQgc2VsZWN0aW9uIGJhciBvdXRzaWRlIHR3byBoYW5kbGVzIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJFbGVtZW50ICNyaWdodE91dGVyU2VsZWN0aW9uQmFyIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyLXdyYXBwZXIgbmd4LXNsaWRlci1yaWdodC1vdXQtc2VsZWN0aW9uXCI+XHJcbiAgPHNwYW4gY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXJcIj48L3NwYW4+XHJcbjwvc3Bhbj5cclxuPCEtLSAvLyAyIFRoZSB3aG9sZSBzbGlkZXIgYmFyIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJFbGVtZW50ICNmdWxsQmFyIFtjbGFzcy5uZ3gtc2xpZGVyLXRyYW5zcGFyZW50XT1cImZ1bGxCYXJUcmFuc3BhcmVudENsYXNzXCIgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXItd3JhcHBlciBuZ3gtc2xpZGVyLWZ1bGwtYmFyXCI+XHJcbiAgPHNwYW4gY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXJcIj48L3NwYW4+XHJcbjwvc3Bhbj5cclxuPCEtLSAvLyAzIFNlbGVjdGlvbiBiYXIgYmV0d2VlbiB0d28gaGFuZGxlcyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjc2VsZWN0aW9uQmFyIFtjbGFzcy5uZ3gtc2xpZGVyLWRyYWdnYWJsZV09XCJzZWxlY3Rpb25CYXJEcmFnZ2FibGVDbGFzc1wiIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyLXdyYXBwZXIgbmd4LXNsaWRlci1zZWxlY3Rpb24tYmFyXCI+XHJcbiAgPHNwYW4gY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXIgbmd4LXNsaWRlci1zZWxlY3Rpb25cIiBbbmdTdHlsZV09XCJiYXJTdHlsZVwiPjwvc3Bhbj5cclxuPC9zcGFuPlxyXG48IS0tIC8vIDQgTG93IHNsaWRlciBoYW5kbGUgLS0+XHJcbjxzcGFuIG5neFNsaWRlckhhbmRsZSAjbWluSGFuZGxlIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItcG9pbnRlciBuZ3gtc2xpZGVyLXBvaW50ZXItbWluXCIgW25nU3R5bGVdPW1pblBvaW50ZXJTdHlsZT48L3NwYW4+XHJcbjwhLS0gLy8gNSBIaWdoIHNsaWRlciBoYW5kbGUgLS0+XHJcbjxzcGFuIG5neFNsaWRlckhhbmRsZSAjbWF4SGFuZGxlIFtzdHlsZS5kaXNwbGF5XT1cInJhbmdlID8gJ2luaGVyaXQnIDogJ25vbmUnXCIgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1wb2ludGVyIG5neC1zbGlkZXItcG9pbnRlci1tYXhcIiBbbmdTdHlsZV09bWF4UG9pbnRlclN0eWxlPjwvc3Bhbj5cclxuPCEtLSAvLyA2IEZsb29yIGxhYmVsIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjZmxvb3JMYWJlbCBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJ1YmJsZSBuZ3gtc2xpZGVyLWxpbWl0IG5neC1zbGlkZXItZmxvb3JcIj48L3NwYW4+XHJcbjwhLS0gLy8gNyBDZWlsaW5nIGxhYmVsIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjY2VpbExhYmVsIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYnViYmxlIG5neC1zbGlkZXItbGltaXQgbmd4LXNsaWRlci1jZWlsXCI+PC9zcGFuPlxyXG48IS0tIC8vIDggTGFiZWwgYWJvdmUgdGhlIGxvdyBzbGlkZXIgaGFuZGxlIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjbWluSGFuZGxlTGFiZWwgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1idWJibGUgbmd4LXNsaWRlci1tb2RlbC12YWx1ZVwiPjwvc3Bhbj5cclxuPCEtLSAvLyA5IExhYmVsIGFib3ZlIHRoZSBoaWdoIHNsaWRlciBoYW5kbGUgLS0+XHJcbjxzcGFuIG5neFNsaWRlckxhYmVsICNtYXhIYW5kbGVMYWJlbCBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJ1YmJsZSBuZ3gtc2xpZGVyLW1vZGVsLWhpZ2hcIj48L3NwYW4+XHJcbjwhLS0gLy8gMTAgQ29tYmluZWQgcmFuZ2UgbGFiZWwgd2hlbiB0aGUgc2xpZGVyIGhhbmRsZXMgYXJlIGNsb3NlIGV4LiAxNSAtIDE3IC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjY29tYmluZWRMYWJlbCBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJ1YmJsZSBuZ3gtc2xpZGVyLWNvbWJpbmVkXCI+PC9zcGFuPlxyXG48IS0tIC8vIDExIFRoZSB0aWNrcyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjdGlja3NFbGVtZW50IFtoaWRkZW5dPVwiIXNob3dUaWNrc1wiIFtjbGFzcy5uZ3gtc2xpZGVyLXRpY2tzLXZhbHVlcy11bmRlcl09XCJ0aWNrc1VuZGVyVmFsdWVzQ2xhc3NcIiBjbGFzcz1cIm5neC1zbGlkZXItdGlja3NcIj5cclxuICA8c3BhbiAqbmdGb3I9XCJsZXQgdCBvZiB0aWNrc1wiIGNsYXNzPVwibmd4LXNsaWRlci10aWNrXCIgW25nQ2xhc3NdPVwieyduZ3gtc2xpZGVyLXNlbGVjdGVkJzogdC5zZWxlY3RlZH1cIiBbbmdTdHlsZV09XCJ0LnN0eWxlXCI+XHJcbiAgICA8bmd4LXNsaWRlci10b29sdGlwLXdyYXBwZXIgW3RlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiIFt0b29sdGlwXT1cInQudG9vbHRpcFwiIFtwbGFjZW1lbnRdPVwidC50b29sdGlwUGxhY2VtZW50XCI+PC9uZ3gtc2xpZGVyLXRvb2x0aXAtd3JhcHBlcj5cclxuICAgIDxuZ3gtc2xpZGVyLXRvb2x0aXAtd3JhcHBlciAqbmdJZj1cInQudmFsdWUgIT0gbnVsbFwiIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItdGljay12YWx1ZVwiXHJcbiAgICAgICAgW3RlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiIFt0b29sdGlwXT1cInQudmFsdWVUb29sdGlwXCIgW3BsYWNlbWVudF09XCJ0LnZhbHVlVG9vbHRpcFBsYWNlbWVudFwiIFtjb250ZW50XT1cInQudmFsdWVcIj48L25neC1zbGlkZXItdG9vbHRpcC13cmFwcGVyPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJ0LmxlZ2VuZCAhPSBudWxsXCIgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci10aWNrLWxlZ2VuZFwiIFtpbm5lckhUTUxdPVwidC5sZWdlbmRcIj48L3NwYW4+XHJcbiAgPC9zcGFuPlxyXG48L3NwYW4+YCxcclxuICBzdHlsZXM6IFtgOjpuZy1kZWVwIC5uZ3gtc2xpZGVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlO2hlaWdodDo0cHg7d2lkdGg6MTAwJTttYXJnaW46MzVweCAwIDE1cHg7dmVydGljYWwtYWxpZ246bWlkZGxlOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTt0b3VjaC1hY3Rpb246cGFuLXl9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLndpdGgtbGVnZW5ke21hcmdpbi1ib3R0b206NDBweH06Om5nLWRlZXAgLm5neC1zbGlkZXJbZGlzYWJsZWRde2N1cnNvcjpub3QtYWxsb3dlZH06Om5nLWRlZXAgLm5neC1zbGlkZXJbZGlzYWJsZWRdIC5uZ3gtc2xpZGVyLXBvaW50ZXJ7Y3Vyc29yOm5vdC1hbGxvd2VkO2JhY2tncm91bmQtY29sb3I6I2Q4ZTBmM306Om5nLWRlZXAgLm5neC1zbGlkZXJbZGlzYWJsZWRdIC5uZ3gtc2xpZGVyLWRyYWdnYWJsZXtjdXJzb3I6bm90LWFsbG93ZWR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyW2Rpc2FibGVkXSAubmd4LXNsaWRlci1zZWxlY3Rpb257YmFja2dyb3VuZDojOGI5MWEyfTo6bmctZGVlcCAubmd4LXNsaWRlcltkaXNhYmxlZF0gLm5neC1zbGlkZXItdGlja3tjdXJzb3I6bm90LWFsbG93ZWR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyW2Rpc2FibGVkXSAubmd4LXNsaWRlci10aWNrLm5neC1zbGlkZXItc2VsZWN0ZWR7YmFja2dyb3VuZDojOGI5MWEyfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1zcGFue3doaXRlLXNwYWNlOm5vd3JhcDtwb3NpdGlvbjphYnNvbHV0ZTtkaXNwbGF5OmlubGluZS1ibG9ja306Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFzZXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3BhZGRpbmc6MH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFyLXdyYXBwZXJ7bGVmdDowO2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW4tdG9wOi0xNnB4O3BhZGRpbmctdG9wOjE2cHg7d2lkdGg6MTAwJTtoZWlnaHQ6MzJweDt6LWluZGV4OjF9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWRyYWdnYWJsZXtjdXJzb3I6bW92ZX06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFye2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDo0cHg7ei1pbmRleDoxO2JhY2tncm91bmQ6I2Q4ZTBmMztib3JkZXItcmFkaXVzOjJweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFyLXdyYXBwZXIubmd4LXNsaWRlci10cmFuc3BhcmVudCAubmd4LXNsaWRlci1iYXJ7YmFja2dyb3VuZDowIDB9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhci13cmFwcGVyLm5neC1zbGlkZXItbGVmdC1vdXQtc2VsZWN0aW9uIC5uZ3gtc2xpZGVyLWJhcntiYWNrZ3JvdW5kOiNkZjAwMmR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhci13cmFwcGVyLm5neC1zbGlkZXItcmlnaHQtb3V0LXNlbGVjdGlvbiAubmd4LXNsaWRlci1iYXJ7YmFja2dyb3VuZDojMDNhNjg4fTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1zZWxlY3Rpb257ei1pbmRleDoyO2JhY2tncm91bmQ6IzBkYjlmMDtib3JkZXItcmFkaXVzOjJweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItcG9pbnRlcntjdXJzb3I6cG9pbnRlcjt3aWR0aDozMnB4O2hlaWdodDozMnB4O3RvcDotMTRweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZGI5ZjA7ei1pbmRleDozO2JvcmRlci1yYWRpdXM6MTZweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItcG9pbnRlcjphZnRlcntjb250ZW50OicnO3dpZHRoOjhweDtoZWlnaHQ6OHB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxMnB4O2xlZnQ6MTJweDtib3JkZXItcmFkaXVzOjRweDtiYWNrZ3JvdW5kOiNmZmZ9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXBvaW50ZXI6aG92ZXI6YWZ0ZXJ7YmFja2dyb3VuZC1jb2xvcjojZmZmfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1wb2ludGVyLm5neC1zbGlkZXItYWN0aXZle3otaW5kZXg6NH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItcG9pbnRlci5uZ3gtc2xpZGVyLWFjdGl2ZTphZnRlcntiYWNrZ3JvdW5kLWNvbG9yOiM0NTFhZmZ9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJ1YmJsZXtjdXJzb3I6ZGVmYXVsdDtib3R0b206MTZweDtwYWRkaW5nOjFweCAzcHg7Y29sb3I6IzU1NjM3ZDtmb250LXNpemU6MTZweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYnViYmxlLm5neC1zbGlkZXItbGltaXR7Y29sb3I6IzU1NjM3ZH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGlja3N7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjEwMCU7aGVpZ2h0OjA7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDotM3B4O21hcmdpbjowO3otaW5kZXg6MTtsaXN0LXN0eWxlOm5vbmV9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXRpY2tzLXZhbHVlcy11bmRlciAubmd4LXNsaWRlci10aWNrLXZhbHVle3RvcDphdXRvO2JvdHRvbTotMzZweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGlja3t0ZXh0LWFsaWduOmNlbnRlcjtjdXJzb3I6cG9pbnRlcjt3aWR0aDoxMHB4O2hlaWdodDoxMHB4O2JhY2tncm91bmQ6I2Q4ZTBmMztib3JkZXItcmFkaXVzOjUwJTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7bWFyZ2luLWxlZnQ6MTFweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGljay5uZ3gtc2xpZGVyLXNlbGVjdGVke2JhY2tncm91bmQ6IzBkYjlmMH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGljay12YWx1ZXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTM0cHg7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsMCk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLDApfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci10aWNrLWxlZ2VuZHtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MjRweDstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwwKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsMCk7bWF4LXdpZHRoOjUwcHg7d2hpdGUtc3BhY2U6bm9ybWFsfTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbHtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0cHg7aGVpZ2h0OjEwMCU7bWFyZ2luOjAgMjBweDtwYWRkaW5nOjA7dmVydGljYWwtYWxpZ246YmFzZWxpbmU7dG91Y2gtYWN0aW9uOnBhbi14fTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci1iYXNle3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7cGFkZGluZzowfTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci1iYXItd3JhcHBlcnt0b3A6YXV0bztsZWZ0OjA7bWFyZ2luOjAgMCAwIC0xNnB4O3BhZGRpbmc6MCAwIDAgMTZweDtoZWlnaHQ6MTAwJTt3aWR0aDozMnB4fTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci1iYXJ7Ym90dG9tOjA7bGVmdDphdXRvO3dpZHRoOjRweDtoZWlnaHQ6MTAwJX06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItcG9pbnRlcntsZWZ0Oi0xNHB4IWltcG9ydGFudDt0b3A6YXV0bztib3R0b206MH06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItYnViYmxle2xlZnQ6MTZweCFpbXBvcnRhbnQ7Ym90dG9tOjB9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLXRpY2tze2hlaWdodDoxMDAlO3dpZHRoOjA7bGVmdDotM3B4O3RvcDowO3otaW5kZXg6MX06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItdGlja3t2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7bWFyZ2luLWxlZnQ6YXV0bzttYXJnaW4tdG9wOjExcHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLXRpY2stdmFsdWV7bGVmdDoyNHB4O3RvcDphdXRvOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgwLC0yOCUpO3RyYW5zZm9ybTp0cmFuc2xhdGUoMCwtMjglKX06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItdGljay1sZWdlbmR7dG9wOmF1dG87cmlnaHQ6MjRweDstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoMCwtMjglKTt0cmFuc2Zvcm06dHJhbnNsYXRlKDAsLTI4JSk7bWF4LXdpZHRoOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci10aWNrcy12YWx1ZXMtdW5kZXIgLm5neC1zbGlkZXItdGljay12YWx1ZXtib3R0b206YXV0bztsZWZ0OmF1dG87cmlnaHQ6MjRweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgKnt0cmFuc2l0aW9uOm5vbmV9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLmFuaW1hdGUgLm5neC1zbGlkZXItYmFyLXdyYXBwZXJ7dHJhbnNpdGlvbjouM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLXNlbGVjdGlvbnt0cmFuc2l0aW9uOmJhY2tncm91bmQtY29sb3IgLjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1wb2ludGVye3RyYW5zaXRpb246LjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1wb2ludGVyOmFmdGVye3RyYW5zaXRpb246LjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1idWJibGV7dHJhbnNpdGlvbjouM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLWJ1YmJsZS5uZ3gtc2xpZGVyLWxpbWl0e3RyYW5zaXRpb246b3BhY2l0eSAuM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLWJ1YmJsZS5uZ3gtc2xpZGVyLWNvbWJpbmVke3RyYW5zaXRpb246b3BhY2l0eSAuM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLXRpY2t7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kLWNvbG9yIC4zcyBsaW5lYXJ9YF0sXHJcbiAgaG9zdDogeyBjbGFzczogJ25neC1zbGlkZXInIH0sXHJcbiAgcHJvdmlkZXJzOiBbTkdYX1NMSURFUl9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG4gIC8vIE1vZGVsIGZvciBsb3cgdmFsdWUgb2Ygc2xpZGVyLiBGb3Igc2ltcGxlIHNsaWRlciwgdGhpcyBpcyB0aGUgb25seSBpbnB1dC4gRm9yIHJhbmdlIHNsaWRlciwgdGhpcyBpcyB0aGUgbG93IHZhbHVlLlxyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIHZhbHVlOiBudW1iZXIgPSBudWxsO1xyXG4gIC8vIE91dHB1dCBmb3IgbG93IHZhbHVlIHNsaWRlciB0byBzdXBwb3J0IHR3by13YXkgYmluZGluZ3NcclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBNb2RlbCBmb3IgaGlnaCB2YWx1ZSBvZiBzbGlkZXIuIE5vdCB1c2VkIGluIHNpbXBsZSBzbGlkZXIuIEZvciByYW5nZSBzbGlkZXIsIHRoaXMgaXMgdGhlIGhpZ2ggdmFsdWUuXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgaGlnaFZhbHVlOiBudW1iZXIgPSBudWxsO1xyXG4gIC8vIE91dHB1dCBmb3IgaGlnaCB2YWx1ZSBzbGlkZXIgdG8gc3VwcG9ydCB0d28td2F5IGJpbmRpbmdzXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIGhpZ2hWYWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIC8vIEFuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3RoZXIgb3B0aW9ucyBvZiB0aGUgc2xpZGVyLlxyXG4gIC8vIEVhY2ggb3B0aW9uIGNhbiBiZSB1cGRhdGVkIGF0IHJ1bnRpbWUgYW5kIHRoZSBzbGlkZXIgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIHJlLXJlbmRlcmVkLlxyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIG9wdGlvbnM6IE9wdGlvbnMgPSBuZXcgT3B0aW9ucygpO1xyXG5cclxuICAvLyBFdmVudCBlbWl0dGVkIHdoZW4gdXNlciBzdGFydHMgaW50ZXJhY3Rpb24gd2l0aCB0aGUgc2xpZGVyXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIHVzZXJDaGFuZ2VTdGFydDogRXZlbnRFbWl0dGVyPENoYW5nZUNvbnRleHQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBFdmVudCBlbWl0dGVkIG9uIGVhY2ggY2hhbmdlIGNvbWluZyBmcm9tIHVzZXIgaW50ZXJhY3Rpb25cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgdXNlckNoYW5nZTogRXZlbnRFbWl0dGVyPENoYW5nZUNvbnRleHQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBFdmVudCBlbWl0dGVkIHdoZW4gdXNlciBmaW5pc2hlcyBpbnRlcmFjdGlvbiB3aXRoIHRoZSBzbGlkZXJcclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgdXNlckNoYW5nZUVuZDogRXZlbnRFbWl0dGVyPENoYW5nZUNvbnRleHQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBwcml2YXRlIG1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb246IGFueTtcclxuICAvLyBJbnB1dCBldmVudCB0aGF0IHRyaWdnZXJzIHNsaWRlciByZWZyZXNoIChyZS1wb3NpdGlvbmluZyBvZiBzbGlkZXIgZWxlbWVudHMpXHJcbiAgQElucHV0KCkgc2V0IG1hbnVhbFJlZnJlc2gobWFudWFsUmVmcmVzaDogRXZlbnRFbWl0dGVyPHZvaWQ+KSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlTWFudWFsUmVmcmVzaCgpO1xyXG5cclxuICAgIHRoaXMubWFudWFsUmVmcmVzaFN1YnNjcmlwdGlvbiA9IG1hbnVhbFJlZnJlc2guc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zQW5kRGV0ZWN0Q2hhbmdlcygpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyRm9jdXNTdWJzY3JpcHRpb246IGFueTtcclxuICAvLyBJbnB1dCBldmVudCB0aGF0IHRyaWdnZXJzIHNldHRpbmcgZm9jdXMgb24gZ2l2ZW4gc2xpZGVyIGhhbmRsZVxyXG4gIEBJbnB1dCgpIHNldCB0cmlnZ2VyRm9jdXModHJpZ2dlckZvY3VzOiBFdmVudEVtaXR0ZXI8dm9pZD4pIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVUcmlnZ2VyRm9jdXMoKTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXJGb2N1c1N1YnNjcmlwdGlvbiA9IHRyaWdnZXJGb2N1cy5zdWJzY3JpYmUoKHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSkgPT4ge1xyXG4gICAgICB0aGlzLmZvY3VzUG9pbnRlcihwb2ludGVyVHlwZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFNsaWRlciB0eXBlLCB0cnVlIG1lYW5zIHJhbmdlIHNsaWRlclxyXG4gIHB1YmxpYyBnZXQgcmFuZ2UoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmFsdWUpICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLmhpZ2hWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdG8gdHJ1ZSBpZiBpbml0IG1ldGhvZCBhbHJlYWR5IGV4ZWN1dGVkXHJcbiAgcHJpdmF0ZSBpbml0SGFzUnVuOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8vIENoYW5nZXMgaW4gbW9kZWwgaW5wdXRzIGFyZSBwYXNzZWQgdGhyb3VnaCB0aGlzIHN1YmplY3RcclxuICAvLyBUaGVzZSBhcmUgYWxsIGNoYW5nZXMgY29taW5nIGluIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50IHRocm91Z2ggaW5wdXQgYmluZGluZ3Mgb3IgcmVhY3RpdmUgZm9ybSBpbnB1dHNcclxuICBwcml2YXRlIGlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0OiBTdWJqZWN0PElucHV0TW9kZWxDaGFuZ2U+ID0gbmV3IFN1YmplY3Q8SW5wdXRNb2RlbENoYW5nZT4oKTtcclxuICBwcml2YXRlIGlucHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcblxyXG4gIC8vIENoYW5nZXMgdG8gbW9kZWwgb3V0cHV0cyBhcmUgcGFzc2VkIHRocm91Z2ggdGhpcyBzdWJqZWN0XHJcbiAgLy8gVGhlc2UgYXJlIGFsbCBjaGFuZ2VzIHRoYXQgbmVlZCB0byBiZSBjb21tdW5pY2F0ZWQgdG8gb3V0cHV0IGVtaXR0ZXJzIGFuZCByZWdpc3RlcmVkIGNhbGxiYWNrc1xyXG4gIHByaXZhdGUgb3V0cHV0TW9kZWxDaGFuZ2VTdWJqZWN0OiBTdWJqZWN0PE91dHB1dE1vZGVsQ2hhbmdlPiA9IG5ldyBTdWJqZWN0PE91dHB1dE1vZGVsQ2hhbmdlPigpO1xyXG4gIHByaXZhdGUgb3V0cHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcblxyXG4gIC8vIExvdyB2YWx1ZSBzeW5jZWQgdG8gbW9kZWwgbG93IHZhbHVlXHJcbiAgcHJpdmF0ZSB2aWV3TG93VmFsdWU6IG51bWJlciA9IG51bGw7XHJcbiAgLy8gSGlnaCB2YWx1ZSBzeW5jZWQgdG8gbW9kZWwgaGlnaCB2YWx1ZVxyXG4gIHByaXZhdGUgdmlld0hpZ2hWYWx1ZTogbnVtYmVyID0gbnVsbDtcclxuICAvLyBPcHRpb25zIHN5bmNlZCB0byBtb2RlbCBvcHRpb25zLCBiYXNlZCBvbiBkZWZhdWx0c1xyXG4gIHByaXZhdGUgdmlld09wdGlvbnM6IE9wdGlvbnMgPSBuZXcgT3B0aW9ucygpO1xyXG5cclxuICAvLyBIYWxmIG9mIHRoZSB3aWR0aCBvciBoZWlnaHQgb2YgdGhlIHNsaWRlciBoYW5kbGVzXHJcbiAgcHJpdmF0ZSBoYW5kbGVIYWxmRGltZW5zaW9uOiBudW1iZXIgPSAwO1xyXG4gIC8vIE1heGltdW0gcG9zaXRpb24gdGhlIHNsaWRlciBoYW5kbGUgY2FuIGhhdmVcclxuICBwcml2YXRlIG1heEhhbmRsZVBvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG5cclxuICAvLyBXaGljaCBoYW5kbGUgaXMgY3VycmVudGx5IHRyYWNrZWQgZm9yIG1vdmUgZXZlbnRzXHJcbiAgcHJpdmF0ZSBjdXJyZW50VHJhY2tpbmdQb2ludGVyOiBQb2ludGVyVHlwZSA9IG51bGw7XHJcbiAgLy8gSW50ZXJuYWwgdmFyaWFibGUgdG8ga2VlcCB0cmFjayBvZiB0aGUgZm9jdXMgZWxlbWVudFxyXG4gIHByaXZhdGUgY3VycmVudEZvY3VzUG9pbnRlcjogUG9pbnRlclR5cGUgPSBudWxsO1xyXG4gIC8vIFVzZWQgdG8gY2FsbCBvblN0YXJ0IG9uIHRoZSBmaXJzdCBrZXlkb3duIGV2ZW50XHJcbiAgcHJpdmF0ZSBmaXJzdEtleURvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAvLyBDdXJyZW50IHRvdWNoIGlkIG9mIHRvdWNoIGV2ZW50IGJlaW5nIGhhbmRsZWRcclxuICBwcml2YXRlIHRvdWNoSWQ6IG51bWJlciA9IG51bGw7XHJcbiAgLy8gVmFsdWVzIHJlY29yZGVkIHdoZW4gZmlyc3QgZHJhZ2dpbmcgdGhlIGJhclxyXG4gIHByaXZhdGUgZHJhZ2dpbmc6IERyYWdnaW5nID0gbmV3IERyYWdnaW5nKCk7XHJcblxyXG4gIC8qIFNsaWRlciBET00gZWxlbWVudHMgKi9cclxuXHJcbiAgLy8gTGVmdCBzZWxlY3Rpb24gYmFyIG91dHNpZGUgdHdvIGhhbmRsZXNcclxuICBAVmlld0NoaWxkKCdsZWZ0T3V0ZXJTZWxlY3Rpb25CYXInLCB7cmVhZDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBsZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50OiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlO1xyXG5cclxuICAvLyBSaWdodCBzZWxlY3Rpb24gYmFyIG91dHNpZGUgdHdvIGhhbmRsZXNcclxuICBAVmlld0NoaWxkKCdyaWdodE91dGVyU2VsZWN0aW9uQmFyJywge3JlYWQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgcmlnaHRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmU7XHJcblxyXG4gIC8vIFRoZSB3aG9sZSBzbGlkZXIgYmFyXHJcbiAgQFZpZXdDaGlsZCgnZnVsbEJhcicsIHtyZWFkOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlfSlcclxuICBwcml2YXRlIGZ1bGxCYXJFbGVtZW50OiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlO1xyXG5cclxuICAvLyBIaWdobGlnaHQgYmV0d2VlbiB0d28gaGFuZGxlc1xyXG4gIEBWaWV3Q2hpbGQoJ3NlbGVjdGlvbkJhcicsIHtyZWFkOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlfSlcclxuICBwcml2YXRlIHNlbGVjdGlvbkJhckVsZW1lbnQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmU7XHJcblxyXG4gIC8vIExlZnQgc2xpZGVyIGhhbmRsZVxyXG4gIEBWaWV3Q2hpbGQoJ21pbkhhbmRsZScsIHtyZWFkOiBTbGlkZXJIYW5kbGVEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgbWluSGFuZGxlRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlO1xyXG5cclxuICAvLyBSaWdodCBzbGlkZXIgaGFuZGxlXHJcbiAgQFZpZXdDaGlsZCgnbWF4SGFuZGxlJywge3JlYWQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBtYXhIYW5kbGVFbGVtZW50OiBTbGlkZXJIYW5kbGVEaXJlY3RpdmU7XHJcblxyXG4gIC8vIEZsb29yIGxhYmVsXHJcbiAgQFZpZXdDaGlsZCgnZmxvb3JMYWJlbCcsIHtyZWFkOiBTbGlkZXJMYWJlbERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBmbG9vckxhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIENlaWxpbmcgbGFiZWxcclxuICBAVmlld0NoaWxkKCdjZWlsTGFiZWwnLCB7cmVhZDogU2xpZGVyTGFiZWxEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgY2VpbExhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIExhYmVsIGFib3ZlIHRoZSBsb3cgdmFsdWVcclxuICBAVmlld0NoaWxkKCdtaW5IYW5kbGVMYWJlbCcsIHtyZWFkOiBTbGlkZXJMYWJlbERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBtaW5IYW5kbGVMYWJlbEVsZW1lbnQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlO1xyXG5cclxuICAvLyBMYWJlbCBhYm92ZSB0aGUgaGlnaCB2YWx1ZVxyXG4gIEBWaWV3Q2hpbGQoJ21heEhhbmRsZUxhYmVsJywge3JlYWQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlfSlcclxuICBwcml2YXRlIG1heEhhbmRsZUxhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIENvbWJpbmVkIGxhYmVsXHJcbiAgQFZpZXdDaGlsZCgnY29tYmluZWRMYWJlbCcsIHtyZWFkOiBTbGlkZXJMYWJlbERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBjb21iaW5lZExhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIFRoZSB0aWNrc1xyXG4gIEBWaWV3Q2hpbGQoJ3RpY2tzRWxlbWVudCcsIHtyZWFkOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlfSlcclxuICBwcml2YXRlIHRpY2tzRWxlbWVudDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZTtcclxuXHJcbiAgLy8gT3B0aW9uYWwgY3VzdG9tIHRlbXBsYXRlIGZvciBkaXNwbGF5aW5nIHRvb2x0aXBzXHJcbiAgQENvbnRlbnRDaGlsZCgndG9vbHRpcFRlbXBsYXRlJylcclxuICBwdWJsaWMgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAvLyBIb3N0IGVsZW1lbnQgY2xhc3MgYmluZGluZ3NcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnZlcnRpY2FsJylcclxuICBwdWJsaWMgc2xpZGVyRWxlbWVudFZlcnRpY2FsQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmFuaW1hdGUnKVxyXG4gIHB1YmxpYyBzbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy53aXRoLWxlZ2VuZCcpXHJcbiAgcHVibGljIHNsaWRlckVsZW1lbnRXaXRoTGVnZW5kQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuZGlzYWJsZWQnKVxyXG4gIHB1YmxpYyBzbGlkZXJFbGVtZW50RGlzYWJsZWRBdHRyOiBzdHJpbmcgPSBudWxsO1xyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWxhYmVsJylcclxuICBwdWJsaWMgc2xpZGVyRWxlbWVudEFyaWFMYWJlbDogc3RyaW5nID0gJ25neC1zbGlkZXInO1xyXG5cclxuICAvLyBDU1Mgc3R5bGVzIGFuZCBjbGFzcyBmbGFnc1xyXG4gIHB1YmxpYyBiYXJTdHlsZTogYW55ID0ge307XHJcbiAgcHVibGljIG1pblBvaW50ZXJTdHlsZTogYW55ID0ge307XHJcbiAgcHVibGljIG1heFBvaW50ZXJTdHlsZTogYW55ID0ge307XHJcbiAgcHVibGljIGZ1bGxCYXJUcmFuc3BhcmVudENsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIHNlbGVjdGlvbkJhckRyYWdnYWJsZUNsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIHRpY2tzVW5kZXJWYWx1ZXNDbGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvLyBXaGV0aGVyIHRvIHNob3cvaGlkZSB0aWNrc1xyXG4gIHB1YmxpYyBnZXQgc2hvd1RpY2tzKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzO1xyXG4gIH1cclxuXHJcbiAgLyogSWYgdGlja1N0ZXAgaXMgc2V0IG9yIHRpY2tzQXJyYXkgaXMgc3BlY2lmaWVkLlxyXG4gICAgIEluIHRoaXMgY2FzZSwgdGlja3MgdmFsdWVzIHNob3VsZCBiZSBkaXNwbGF5ZWQgYmVsb3cgdGhlIHNsaWRlci4gKi9cclxuICBwcml2YXRlIGludGVybWVkaWF0ZVRpY2tzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgLy8gVGlja3MgYXJyYXkgYXMgZGlzcGxheWVkIGluIHZpZXdcclxuICBwdWJsaWMgdGlja3M6IFRpY2tbXSA9IFtdO1xyXG5cclxuICAvLyBFdmVudCBsaXN0ZW5lcnNcclxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJIZWxwZXI6IEV2ZW50TGlzdGVuZXJIZWxwZXIgPSBudWxsO1xyXG4gIHByaXZhdGUgb25Nb3ZlRXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IG51bGw7XHJcbiAgcHJpdmF0ZSBvbkVuZEV2ZW50TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSBudWxsO1xyXG4gIC8vIFdoZXRoZXIgY3VycmVudGx5IG1vdmluZyB0aGUgc2xpZGVyIChiZXR3ZWVuIG9uU3RhcnQoKSBhbmQgb25FbmQoKSlcclxuICBwcml2YXRlIG1vdmluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvLyBPYnNlcnZlciBmb3Igc2xpZGVyIGVsZW1lbnQgcmVzaXplIGV2ZW50c1xyXG4gIHByaXZhdGUgcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyID0gbnVsbDtcclxuXHJcbiAgLy8gQ2FsbGJhY2tzIGZvciByZWFjdGl2ZSBmb3JtcyBzdXBwb3J0XHJcbiAgcHJpdmF0ZSBvblRvdWNoZWRDYWxsYmFjazogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSBudWxsO1xyXG4gIHByaXZhdGUgb25DaGFuZ2VDYWxsYmFjazogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSBudWxsO1xyXG5cclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgem9uZTogTmdab25lKSB7XHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIgPSBuZXcgRXZlbnRMaXN0ZW5lckhlbHBlcih0aGlzLnJlbmRlcmVyKTtcclxuICB9XHJcblxyXG4gIC8vIE9uSW5pdCBpbnRlcmZhY2VcclxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zID0gbmV3IE9wdGlvbnMoKTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy52aWV3T3B0aW9ucywgdGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICAvLyBXZSBuZWVkIHRvIHJ1biB0aGVzZSB0d28gdGhpbmdzIGZpcnN0LCBiZWZvcmUgdGhlIHJlc3Qgb2YgdGhlIGluaXQgaW4gbmdBZnRlclZpZXdJbml0KCksXHJcbiAgICAvLyBiZWNhdXNlIHRoZXNlIHR3byBzZXR0aW5ncyBhcmUgc2V0IHRocm91Z2ggQEhvc3RCaW5kaW5nIGFuZCBBbmd1bGFyIGNoYW5nZSBkZXRlY3Rpb25cclxuICAgIC8vIG1lY2hhbmlzbSBkb2Vzbid0IGxpa2UgdGhlbSBjaGFuZ2luZyBpbiBuZ0FmdGVyVmlld0luaXQoKVxyXG5cclxuICAgIHRoaXMudXBkYXRlRGlzYWJsZWRTdGF0ZSgpO1xyXG4gICAgdGhpcy51cGRhdGVWZXJ0aWNhbFN0YXRlKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUFyaWFMYWJlbCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQWZ0ZXJWaWV3SW5pdCBpbnRlcmZhY2VcclxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5hcHBseU9wdGlvbnMoKTtcclxuXHJcbiAgICB0aGlzLnN1YnNjcmliZUlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk7XHJcbiAgICB0aGlzLnN1YnNjcmliZU91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpO1xyXG5cclxuICAgIC8vIE9uY2Ugd2UgYXBwbHkgb3B0aW9ucywgd2UgbmVlZCB0byBub3JtYWxpc2UgbW9kZWwgdmFsdWVzIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgdGhpcy5yZW5vcm1hbGlzZU1vZGVsVmFsdWVzKCk7XHJcblxyXG4gICAgdGhpcy52aWV3TG93VmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IHRoaXMubW9kZWxWYWx1ZVRvVmlld1ZhbHVlKHRoaXMuaGlnaFZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVWZXJ0aWNhbFN0YXRlKCk7IC8vIG5lZWQgdG8gcnVuIHRoaXMgYWdhaW4gdG8gY292ZXIgY2hhbmdlcyB0byBzbGlkZXIgZWxlbWVudHNcclxuICAgIHRoaXMubWFuYWdlRWxlbWVudHNTdHlsZSgpO1xyXG4gICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKCk7XHJcbiAgICB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKCk7XHJcbiAgICB0aGlzLmFkZEFjY2Vzc2liaWxpdHkoKTtcclxuICAgIHRoaXMudXBkYXRlQ2VpbExhYmVsKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUZsb29yTGFiZWwoKTtcclxuICAgIHRoaXMuaW5pdEhhbmRsZXMoKTtcclxuICAgIHRoaXMubWFuYWdlRXZlbnRzQmluZGluZ3MoKTtcclxuICAgIHRoaXMudXBkYXRlQXJpYUxhYmVsKCk7XHJcblxyXG4gICAgdGhpcy5zdWJzY3JpYmVSZXNpemVPYnNlcnZlcigpO1xyXG5cclxuICAgIHRoaXMuaW5pdEhhc1J1biA9IHRydWU7XHJcblxyXG4gICAgLy8gUnVuIGNoYW5nZSBkZXRlY3Rpb24gbWFudWFsbHkgdG8gcmVzb2x2ZSBzb21lIGlzc3VlcyB3aGVuIGluaXQgcHJvY2VkdXJlIGNoYW5nZXMgdmFsdWVzIHVzZWQgaW4gdGhlIHZpZXdcclxuICAgIGlmICghdGhpcy5pc1JlZkRlc3Ryb3llZCgpKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE9uQ2hhbmdlcyBpbnRlcmZhY2VcclxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgLy8gQWx3YXlzIGFwcGx5IG9wdGlvbnMgZmlyc3RcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY2hhbmdlcy5vcHRpb25zKSAmJlxyXG4gICAgIEpTT04uc3RyaW5naWZ5KGNoYW5nZXMub3B0aW9ucy5wcmV2aW91c1ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkoY2hhbmdlcy5vcHRpb25zLmN1cnJlbnRWYWx1ZSkpIHtcclxuICAgICAgdGhpcy5vbkNoYW5nZU9wdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGVuIHZhbHVlIGNoYW5nZXNcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY2hhbmdlcy52YWx1ZSkgfHxcclxuICAgICAgICAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY2hhbmdlcy5oaWdoVmFsdWUpKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRNb2RlbENoYW5nZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgICBmb3JjZUNoYW5nZTogZmFsc2UsXHJcbiAgICAgICAgaW50ZXJuYWxDaGFuZ2U6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gT25EZXN0cm95IGludGVyZmFjZVxyXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XHJcblxyXG4gICAgdGhpcy51bnN1YnNjcmliZVJlc2l6ZU9ic2VydmVyKCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlSW5wdXRNb2RlbENoYW5nZVN1YmplY3QoKTtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVPdXRwdXRNb2RlbENoYW5nZVN1YmplY3QoKTtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVNYW51YWxSZWZyZXNoKCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlVHJpZ2dlckZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICAvLyBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcclxuICBwdWJsaWMgd3JpdGVWYWx1ZShvYmo6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSBvYmpbMF07XHJcbiAgICAgIHRoaXMuaGlnaFZhbHVlID0gb2JqWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IG9iajtcclxuICAgIH1cclxuXHJcbiAgICAvLyBuZ09uQ2hhbmdlcygpIGlzIG5vdCBjYWxsZWQgaW4gdGhpcyBpbnN0YW5jZSwgc28gd2UgbmVlZCB0byBjb21tdW5pY2F0ZSB0aGUgY2hhbmdlIG1hbnVhbGx5XHJcbiAgICB0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0Lm5leHQoe1xyXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgZm9yY2VDaGFuZ2U6IGZhbHNlLFxyXG4gICAgICBpbnRlcm5hbENoYW5nZTogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXHJcbiAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2VDYWxsYmFjazogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBvbkNoYW5nZUNhbGxiYWNrO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXHJcbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZENhbGxiYWNrOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBvblRvdWNoZWRDYWxsYmFjaztcclxuICB9XHJcblxyXG4gIC8vIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMudmlld09wdGlvbnMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0QXJpYUxhYmVsKGFyaWFMYWJlbDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbCA9IGFyaWFMYWJlbDtcclxuICAgIHRoaXMudXBkYXRlQXJpYUxhYmVsKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXHJcbiAgcHVibGljIG9uUmVzaXplKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY2FsY3VsYXRlVmlld0RpbWVuc2lvbnNBbmREZXRlY3RDaGFuZ2VzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1YnNjcmliZUlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3ViamVjdFxyXG4gICAgLnBpcGUoXHJcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKE1vZGVsQ2hhbmdlLmNvbXBhcmUpLFxyXG4gICAgICAvLyBIYWNrIHRvIHJlc2V0IHRoZSBzdGF0dXMgb2YgdGhlIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkgLSBpZiBhIFwiZmFrZVwiIGV2ZW50IGNvbWVzIHRocm91Z2ggd2l0aCBmb3JjZUNoYW5nZT10cnVlLFxyXG4gICAgICAvLyB3ZSBmb3JjZWZ1bGx5IGJ5LXBhc3MgZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgYnV0IG90aGVyd2lzZSBkcm9wIHRoZSBldmVudFxyXG4gICAgICBmaWx0ZXIoKG1vZGVsQ2hhbmdlOiBJbnB1dE1vZGVsQ2hhbmdlKSA9PiAhbW9kZWxDaGFuZ2UuZm9yY2VDaGFuZ2UgJiYgIW1vZGVsQ2hhbmdlLmludGVybmFsQ2hhbmdlKVxyXG4gICAgKVxyXG4gICAgLnN1YnNjcmliZSgobW9kZWxDaGFuZ2U6IElucHV0TW9kZWxDaGFuZ2UpID0+IHRoaXMuYXBwbHlJbnB1dE1vZGVsQ2hhbmdlKG1vZGVsQ2hhbmdlKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1YnNjcmliZU91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpOiB2b2lkIHtcclxuICAgIHRoaXMub3V0cHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdFxyXG4gICAgICAucGlwZShcclxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZChNb2RlbENoYW5nZS5jb21wYXJlKVxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKG1vZGVsQ2hhbmdlOiBPdXRwdXRNb2RlbENoYW5nZSkgPT4gdGhpcy5wdWJsaXNoT3V0cHV0TW9kZWxDaGFuZ2UobW9kZWxDaGFuZ2UpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3Vic2NyaWJlUmVzaXplT2JzZXJ2ZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoQ29tcGF0aWJpbGl0eUhlbHBlci5pc1Jlc2l6ZU9ic2VydmVyQXZhaWxhYmxlKCkpIHtcclxuICAgICAgdGhpcy5yZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoKTogdm9pZCA9PiB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zQW5kRGV0ZWN0Q2hhbmdlcygpKTtcclxuICAgICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVSZXNpemVPYnNlcnZlcigpOiB2b2lkIHtcclxuICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzUmVzaXplT2JzZXJ2ZXJBdmFpbGFibGUoKSAmJiB0aGlzLnJlc2l6ZU9ic2VydmVyICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVPbk1vdmUoKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lcikpIHtcclxuICAgICAgdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmRldGFjaEV2ZW50TGlzdGVuZXIodGhpcy5vbk1vdmVFdmVudExpc3RlbmVyKTtcclxuICAgICAgdGhpcy5vbk1vdmVFdmVudExpc3RlbmVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVPbkVuZCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5vbkVuZEV2ZW50TGlzdGVuZXIpKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5kZXRhY2hFdmVudExpc3RlbmVyKHRoaXMub25FbmRFdmVudExpc3RlbmVyKTtcclxuICAgICAgdGhpcy5vbkVuZEV2ZW50TGlzdGVuZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk6IHZvaWQge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24gPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZU91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbikpIHtcclxuICAgICAgdGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVNYW51YWxSZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLm1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIHRoaXMubWFudWFsUmVmcmVzaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLm1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb24gPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZVRyaWdnZXJGb2N1cygpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy50cmlnZ2VyRm9jdXNTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIHRoaXMudHJpZ2dlckZvY3VzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIHRoaXMudHJpZ2dlckZvY3VzU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UG9pbnRlckVsZW1lbnQocG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlKTogU2xpZGVySGFuZGxlRGlyZWN0aXZlIHtcclxuICAgIGlmIChwb2ludGVyVHlwZSA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1pbkhhbmRsZUVsZW1lbnQ7XHJcbiAgICB9IGVsc2UgaWYgKHBvaW50ZXJUeXBlID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4SGFuZGxlRWxlbWVudDtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDdXJyZW50VHJhY2tpbmdWYWx1ZSgpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdMb3dWYWx1ZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld0hpZ2hWYWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtb2RlbFZhbHVlVG9WaWV3VmFsdWUobW9kZWxWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChtb2RlbFZhbHVlKSkge1xyXG4gICAgICByZXR1cm4gTmFOO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KSAmJiAhdGhpcy52aWV3T3B0aW9ucy5iaW5kSW5kZXhGb3JTdGVwc0FycmF5KSB7XHJcbiAgICAgIHJldHVybiBWYWx1ZUhlbHBlci5maW5kU3RlcEluZGV4KCttb2RlbFZhbHVlLCB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICttb2RlbFZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB2aWV3VmFsdWVUb01vZGVsVmFsdWUodmlld1ZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpICYmICF0aGlzLnZpZXdPcHRpb25zLmJpbmRJbmRleEZvclN0ZXBzQXJyYXkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RlcFZhbHVlKHZpZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmlld1ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRTdGVwVmFsdWUoc2xpZGVyVmFsdWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBzdGVwOiBDdXN0b21TdGVwRGVmaW5pdGlvbiA9IHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheVtzbGlkZXJWYWx1ZV07XHJcbiAgICByZXR1cm4gKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChzdGVwKSkgPyBzdGVwLnZhbHVlIDogTmFOO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseVZpZXdDaGFuZ2UoKTogdm9pZCB7XHJcbiAgICB0aGlzLnZhbHVlID0gdGhpcy52aWV3VmFsdWVUb01vZGVsVmFsdWUodGhpcy52aWV3TG93VmFsdWUpO1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy5oaWdoVmFsdWUgPSB0aGlzLnZpZXdWYWx1ZVRvTW9kZWxWYWx1ZSh0aGlzLnZpZXdIaWdoVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub3V0cHV0TW9kZWxDaGFuZ2VTdWJqZWN0Lm5leHQoe1xyXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgdXNlckV2ZW50SW5pdGlhdGVkOiB0cnVlLFxyXG4gICAgICBmb3JjZUNoYW5nZTogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEF0IHRoaXMgcG9pbnQgYWxsIGNoYW5nZXMgYXJlIGFwcGxpZWQgYW5kIG91dHB1dHMgYXJlIGVtaXR0ZWQsIHNvIHdlIHNob3VsZCBiZSBkb25lLlxyXG4gICAgLy8gSG93ZXZlciwgaW5wdXQgY2hhbmdlcyBhcmUgY29tbXVuaWNhdGVkIGluIGRpZmZlcmVudCBzdHJlYW0gYW5kIHdlIG5lZWQgdG8gYmUgcmVhZHkgdG9cclxuICAgIC8vIGFjdCBvbiB0aGUgbmV4dCBpbnB1dCBjaGFuZ2UgZXZlbiBpZiBpdCBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIGxhc3QgaW5wdXQgY2hhbmdlLlxyXG4gICAgLy8gVGhlcmVmb3JlLCB3ZSBzZW5kIGEgc3BlY2lhbCBldmVudCB0byByZXNldCB0aGUgc3RyZWFtLlxyXG4gICAgdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3ViamVjdC5uZXh0KHtcclxuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgIGhpZ2hWYWx1ZTogdGhpcy5oaWdoVmFsdWUsXHJcbiAgICAgIGZvcmNlQ2hhbmdlOiBmYWxzZSxcclxuICAgICAgaW50ZXJuYWxDaGFuZ2U6IHRydWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQXBwbHkgbW9kZWwgY2hhbmdlIHRvIHRoZSBzbGlkZXIgdmlld1xyXG4gIHByaXZhdGUgYXBwbHlJbnB1dE1vZGVsQ2hhbmdlKG1vZGVsQ2hhbmdlOiBJbnB1dE1vZGVsQ2hhbmdlKTogdm9pZCB7XHJcbiAgICBjb25zdCBub3JtYWxpc2VkTW9kZWxDaGFuZ2U6IE1vZGVsVmFsdWVzID0gdGhpcy5ub3JtYWxpc2VNb2RlbFZhbHVlcyhtb2RlbENoYW5nZSk7XHJcblxyXG4gICAgLy8gSWYgbm9ybWFsaXNlZCBtb2RlbCBjaGFuZ2UgaXMgZGlmZmVyZW50LCBhcHBseSB0aGUgY2hhbmdlIHRvIHRoZSBtb2RlbCB2YWx1ZXNcclxuICAgIGNvbnN0IG5vcm1hbGlzYXRpb25DaGFuZ2U6IGJvb2xlYW4gPSAhTW9kZWxWYWx1ZXMuY29tcGFyZShtb2RlbENoYW5nZSwgbm9ybWFsaXNlZE1vZGVsQ2hhbmdlKTtcclxuICAgIGlmIChub3JtYWxpc2F0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSBub3JtYWxpc2VkTW9kZWxDaGFuZ2UudmFsdWU7XHJcbiAgICAgIHRoaXMuaGlnaFZhbHVlID0gbm9ybWFsaXNlZE1vZGVsQ2hhbmdlLmhpZ2hWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXdMb3dWYWx1ZSA9IHRoaXMubW9kZWxWYWx1ZVRvVmlld1ZhbHVlKG5vcm1hbGlzZWRNb2RlbENoYW5nZS52YWx1ZSk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZShub3JtYWxpc2VkTW9kZWxDaGFuZ2UuaGlnaFZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVMb3dIYW5kbGUodGhpcy52YWx1ZVRvUG9zaXRpb24odGhpcy52aWV3TG93VmFsdWUpKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlSGlnaEhhbmRsZSh0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdIaWdoVmFsdWUpKTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uQmFyKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVRpY2tzU2NhbGUoKTtcclxuICAgIHRoaXMudXBkYXRlQXJpYUF0dHJpYnV0ZXMoKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29tYmluZWRMYWJlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEF0IHRoZSBlbmQsIHdlIG5lZWQgdG8gY29tbXVuaWNhdGUgdGhlIG1vZGVsIGNoYW5nZSB0byB0aGUgb3V0cHV0cyBhcyB3ZWxsXHJcbiAgICAvLyBOb3JtYWxpc2F0aW9uIGNoYW5nZXMgYXJlIGFsc28gYWx3YXlzIGZvcmNlZCBvdXQgdG8gZW5zdXJlIHRoYXQgc3Vic2NyaWJlcnMgYWx3YXlzIGVuZCB1cCBpbiBjb3JyZWN0IHN0YXRlXHJcbiAgICB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdC5uZXh0KHtcclxuICAgICAgdmFsdWU6IG5vcm1hbGlzZWRNb2RlbENoYW5nZS52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiBub3JtYWxpc2VkTW9kZWxDaGFuZ2UuaGlnaFZhbHVlLFxyXG4gICAgICBmb3JjZUNoYW5nZTogbm9ybWFsaXNhdGlvbkNoYW5nZSxcclxuICAgICAgdXNlckV2ZW50SW5pdGlhdGVkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBQdWJsaXNoIG1vZGVsIGNoYW5nZSB0byBvdXRwdXQgZXZlbnQgZW1pdHRlcnMgYW5kIHJlZ2lzdGVyZWQgY2FsbGJhY2tzXHJcbiAgcHJpdmF0ZSBwdWJsaXNoT3V0cHV0TW9kZWxDaGFuZ2UobW9kZWxDaGFuZ2U6IE91dHB1dE1vZGVsQ2hhbmdlKTogdm9pZCB7XHJcbiAgICBjb25zdCBlbWl0T3V0cHV0czogKCkgPT4gdm9pZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KG1vZGVsQ2hhbmdlLnZhbHVlKTtcclxuICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgICB0aGlzLmhpZ2hWYWx1ZUNoYW5nZS5lbWl0KG1vZGVsQ2hhbmdlLmhpZ2hWYWx1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5vbkNoYW5nZUNhbGxiYWNrKSkge1xyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2soW21vZGVsQ2hhbmdlLnZhbHVlLCBtb2RlbENoYW5nZS5oaWdoVmFsdWVdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKG1vZGVsQ2hhbmdlLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLm9uVG91Y2hlZENhbGxiYWNrKSkge1xyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKFttb2RlbENoYW5nZS52YWx1ZSwgbW9kZWxDaGFuZ2UuaGlnaFZhbHVlXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sobW9kZWxDaGFuZ2UudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAobW9kZWxDaGFuZ2UudXNlckV2ZW50SW5pdGlhdGVkKSB7XHJcbiAgICAgIC8vIElmIHRoaXMgY2hhbmdlIHdhcyBpbml0aWF0ZWQgYnkgYSB1c2VyIGV2ZW50LCB3ZSBjYW4gZW1pdCBvdXRwdXRzIGluIHRoZSBzYW1lIHRpY2tcclxuICAgICAgZW1pdE91dHB1dHMoKTtcclxuICAgICAgdGhpcy51c2VyQ2hhbmdlLmVtaXQodGhpcy5nZXRDaGFuZ2VDb250ZXh0KCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQnV0LCBpZiB0aGUgY2hhbmdlIHdhcyBpbml0YXRlZCBieSBzb21ldGhpbmcgZWxzZSBsaWtlIGEgY2hhbmdlIGluIGlucHV0IGJpbmRpbmdzLFxyXG4gICAgICAvLyB3ZSBuZWVkIHRvIHdhaXQgdW50aWwgbmV4dCB0aWNrIHRvIGVtaXQgdGhlIG91dHB1dHMgdG8ga2VlcCBBbmd1bGFyIGNoYW5nZSBkZXRlY3Rpb24gaGFwcHlcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IGVtaXRPdXRwdXRzKCk7IH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub3JtYWxpc2VNb2RlbFZhbHVlcyhpbnB1dDogTW9kZWxWYWx1ZXMpOiBNb2RlbFZhbHVlcyB7XHJcbiAgICBjb25zdCBub3JtYWxpc2VkSW5wdXQ6IE1vZGVsVmFsdWVzID0gbmV3IE1vZGVsVmFsdWVzKCk7XHJcbiAgICBub3JtYWxpc2VkSW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZTtcclxuICAgIG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUgPSBpbnB1dC5oaWdoVmFsdWU7XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpKSB7XHJcbiAgICAgIC8vIFdoZW4gdXNpbmcgc3RlcHMgYXJyYXksIG9ubHkgcm91bmQgdG8gbmVhcmVzdCBzdGVwIGluIHRoZSBhcnJheVxyXG4gICAgICAvLyBObyBvdGhlciBlbmZvcmNlbWVudCBjYW4gYmUgZG9uZSwgYXMgdGhlIHN0ZXAgYXJyYXkgbWF5IGJlIG91dCBvZiBvcmRlciwgYW5kIHRoYXQgaXMgcGVyZmVjdGx5IGZpbmVcclxuICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMuZW5mb3JjZVN0ZXBzQXJyYXkpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZUluZGV4OiBudW1iZXIgPSBWYWx1ZUhlbHBlci5maW5kU3RlcEluZGV4KG5vcm1hbGlzZWRJbnB1dC52YWx1ZSwgdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KTtcclxuICAgICAgICBub3JtYWxpc2VkSW5wdXQudmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXlbdmFsdWVJbmRleF0udmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgICBjb25zdCBoaWdoVmFsdWVJbmRleDogbnVtYmVyID0gVmFsdWVIZWxwZXIuZmluZFN0ZXBJbmRleChub3JtYWxpc2VkSW5wdXQuaGlnaFZhbHVlLCB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpO1xyXG4gICAgICAgICAgbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZSA9IHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheVtoaWdoVmFsdWVJbmRleF0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbm9ybWFsaXNlZElucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmVuZm9yY2VTdGVwKSB7XHJcbiAgICAgIG5vcm1hbGlzZWRJbnB1dC52YWx1ZSA9IHRoaXMucm91bmRTdGVwKG5vcm1hbGlzZWRJbnB1dC52YWx1ZSk7XHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZSA9IHRoaXMucm91bmRTdGVwKG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuZW5mb3JjZVJhbmdlKSB7XHJcbiAgICAgIG5vcm1hbGlzZWRJbnB1dC52YWx1ZSA9IE1hdGhIZWxwZXIuY2xhbXBUb1JhbmdlKG5vcm1hbGlzZWRJbnB1dC52YWx1ZSwgdGhpcy52aWV3T3B0aW9ucy5mbG9vciwgdGhpcy52aWV3T3B0aW9ucy5jZWlsKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZSA9IE1hdGhIZWxwZXIuY2xhbXBUb1JhbmdlKG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUsIHRoaXMudmlld09wdGlvbnMuZmxvb3IsIHRoaXMudmlld09wdGlvbnMuY2VpbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHJhbmdlIHNsaWRlciBpbnZhcmlhbnQgKHZhbHVlIDw9IGhpZ2hWYWx1ZSkgaXMgYWx3YXlzIHNhdGlzZmllZFxyXG4gICAgICBpZiAodGhpcy5yYW5nZSAmJiBpbnB1dC52YWx1ZSA+IGlucHV0LmhpZ2hWYWx1ZSkge1xyXG4gICAgICAgIC8vIFdlIGtub3cgdGhhdCBib3RoIHZhbHVlcyBhcmUgbm93IGNsYW1wZWQgY29ycmVjdGx5LCB0aGV5IG1heSBqdXN0IGJlIGluIHRoZSB3cm9uZyBvcmRlclxyXG4gICAgICAgIC8vIFNvIHRoZSBlYXN5IHNvbHV0aW9uIGlzIHRvIHN3YXAgdGhlbS4uLiBleGNlcHQgc3dhcHBpbmcgaXMgc29tZXRpbWVzIGRpc2FibGVkIGluIG9wdGlvbnMsIHNvIHdlIG1ha2UgdGhlIHR3byB2YWx1ZXMgdGhlIHNhbWVcclxuICAgICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5ub1N3aXRjaGluZykge1xyXG4gICAgICAgICAgbm9ybWFsaXNlZElucHV0LnZhbHVlID0gbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgdGVtcFZhbHVlOiBudW1iZXIgPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICAgIG5vcm1hbGlzZWRJbnB1dC52YWx1ZSA9IGlucHV0LmhpZ2hWYWx1ZTtcclxuICAgICAgICAgIG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUgPSB0ZW1wVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5vcm1hbGlzZWRJbnB1dDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVub3JtYWxpc2VNb2RlbFZhbHVlcygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHByZXZpb3VzTW9kZWxWYWx1ZXM6IE1vZGVsVmFsdWVzID0ge1xyXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZVxyXG4gICAgfTtcclxuICAgIGNvbnN0IG5vcm1hbGlzZWRNb2RlbFZhbHVlczogTW9kZWxWYWx1ZXMgPSB0aGlzLm5vcm1hbGlzZU1vZGVsVmFsdWVzKHByZXZpb3VzTW9kZWxWYWx1ZXMpO1xyXG4gICAgaWYgKCFNb2RlbFZhbHVlcy5jb21wYXJlKG5vcm1hbGlzZWRNb2RlbFZhbHVlcywgcHJldmlvdXNNb2RlbFZhbHVlcykpIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IG5vcm1hbGlzZWRNb2RlbFZhbHVlcy52YWx1ZTtcclxuICAgICAgdGhpcy5oaWdoVmFsdWUgPSBub3JtYWxpc2VkTW9kZWxWYWx1ZXMuaGlnaFZhbHVlO1xyXG5cclxuICAgICAgdGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgICBmb3JjZUNoYW5nZTogdHJ1ZSxcclxuICAgICAgICB1c2VyRXZlbnRJbml0aWF0ZWQ6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkNoYW5nZU9wdGlvbnMoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuaW5pdEhhc1J1bikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzOiBib29sZWFuW10gPSB0aGlzLmdldE9wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3ModGhpcy52aWV3T3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5hcHBseU9wdGlvbnMoKTtcclxuXHJcbiAgICBjb25zdCBuZXdPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzOiBib29sZWFuW10gPSB0aGlzLmdldE9wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3ModGhpcy52aWV3T3B0aW9ucyk7XHJcbiAgICAvLyBBdm9pZCByZS1iaW5kaW5nIGV2ZW50cyBpbiBjYXNlIG5vdGhpbmcgY2hhbmdlcyB0aGF0IGNhbiBpbmZsdWVuY2UgaXRcclxuICAgIC8vIEl0IG1ha2VzIGl0IHBvc3NpYmxlIHRvIGNoYW5nZSBvcHRpb25zIHdoaWxlIGRyYWdnaW5nIHRoZSBzbGlkZXJcclxuICAgIGNvbnN0IHJlYmluZEV2ZW50czogYm9vbGVhbiA9ICFWYWx1ZUhlbHBlci5hcmVBcnJheXNFcXVhbChwcmV2aW91c09wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3MsIG5ld09wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3MpO1xyXG5cclxuICAgIC8vIFdpdGggbmV3IG9wdGlvbnMsIHdlIG5lZWQgdG8gcmUtbm9ybWFsaXNlIG1vZGVsIHZhbHVlcyBpZiBuZWNlc3NhcnlcclxuICAgIHRoaXMucmVub3JtYWxpc2VNb2RlbFZhbHVlcygpO1xyXG5cclxuICAgIHRoaXMudmlld0xvd1ZhbHVlID0gdGhpcy5tb2RlbFZhbHVlVG9WaWV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZSh0aGlzLmhpZ2hWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVzZXRTbGlkZXIocmViaW5kRXZlbnRzKTtcclxuICB9XHJcblxyXG4gIC8vIFJlYWQgdGhlIHVzZXIgb3B0aW9ucyBhbmQgYXBwbHkgdGhlbSB0byB0aGUgc2xpZGVyIG1vZGVsXHJcbiAgcHJpdmF0ZSBhcHBseU9wdGlvbnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zID0gbmV3IE9wdGlvbnMoKTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy52aWV3T3B0aW9ucywgdGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlID0gdGhpcy5yYW5nZSAmJiB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlO1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5kcmFnZ2FibGVSYW5nZU9ubHkgPSB0aGlzLnJhbmdlICYmIHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5O1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5KSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2UgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzID0gdGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3MgfHxcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3NWYWx1ZXMgfHxcclxuICAgICAgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja3NBcnJheSk7XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3MgJiZcclxuICAgICAgICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCkgfHwgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja3NBcnJheSkpKSB7XHJcbiAgICAgIHRoaXMuaW50ZXJtZWRpYXRlVGlja3MgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhciA9IHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhciB8fFxyXG4gICAgICB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJFbmQgfHxcclxuICAgICAgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZSk7XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpKSB7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGVwc0FycmF5T3B0aW9ucygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hcHBseUZsb29yQ2VpbE9wdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5jb21iaW5lTGFiZWxzKSkge1xyXG4gICAgICB0aGlzLnZpZXdPcHRpb25zLmNvbWJpbmVMYWJlbHMgPSAobWluVmFsdWU6IHN0cmluZywgbWF4VmFsdWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1pblZhbHVlICsgJyAtICcgKyBtYXhWYWx1ZTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5sb2dTY2FsZSAmJiB0aGlzLnZpZXdPcHRpb25zLmZsb29yID09PSAwKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdDYW5cXCd0IHVzZSBmbG9vcj0wIHdpdGggbG9nYXJpdGhtaWMgc2NhbGUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlTdGVwc0FycmF5T3B0aW9ucygpOiB2b2lkIHtcclxuICAgIHRoaXMudmlld09wdGlvbnMuZmxvb3IgPSAwO1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5jZWlsID0gdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5Lmxlbmd0aCAtIDE7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLnN0ZXAgPSAxO1xyXG5cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRyYW5zbGF0ZSkpIHtcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUgPSAobW9kZWxWYWx1ZTogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuICAgICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5iaW5kSW5kZXhGb3JTdGVwc0FycmF5KSB7XHJcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMuZ2V0U3RlcFZhbHVlKG1vZGVsVmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZyhtb2RlbFZhbHVlKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlGbG9vckNlaWxPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc3RlcCkpIHtcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5zdGVwID0gMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMuc3RlcCA9ICt0aGlzLnZpZXdPcHRpb25zLnN0ZXA7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnN0ZXAgPD0gMCkge1xyXG4gICAgICAgIHRoaXMudmlld09wdGlvbnMuc3RlcCA9IDE7XHJcbiAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmNlaWwpIHx8XHJcbiAgICAgICAgVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5mbG9vcikpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoJ2Zsb29yIGFuZCBjZWlsIG9wdGlvbnMgbXVzdCBiZSBzdXBwbGllZCcpO1xyXG4gICAgfVxyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5jZWlsID0gK3RoaXMudmlld09wdGlvbnMuY2VpbDtcclxuICAgIHRoaXMudmlld09wdGlvbnMuZmxvb3IgPSArdGhpcy52aWV3T3B0aW9ucy5mbG9vcjtcclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUpKSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMudHJhbnNsYXRlID0gKHZhbHVlOiBudW1iZXIpOiBzdHJpbmcgPT4gU3RyaW5nKHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFJlc2V0cyBzbGlkZXJcclxuICBwcml2YXRlIHJlc2V0U2xpZGVyKHJlYmluZEV2ZW50czogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIHRoaXMubWFuYWdlRWxlbWVudHNTdHlsZSgpO1xyXG4gICAgdGhpcy5hZGRBY2Nlc3NpYmlsaXR5KCk7XHJcbiAgICB0aGlzLnVwZGF0ZUNlaWxMYWJlbCgpO1xyXG4gICAgdGhpcy51cGRhdGVGbG9vckxhYmVsKCk7XHJcbiAgICBpZiAocmViaW5kRXZlbnRzKSB7XHJcbiAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XHJcbiAgICAgIHRoaXMubWFuYWdlRXZlbnRzQmluZGluZ3MoKTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlRGlzYWJsZWRTdGF0ZSgpO1xyXG4gICAgdGhpcy51cGRhdGVBcmlhTGFiZWwoKTtcclxuICAgIHRoaXMuY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoKTtcclxuICAgIHRoaXMucmVmb2N1c1BvaW50ZXJJZk5lZWRlZCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyBmb2N1cyBvbiB0aGUgc3BlY2lmaWVkIHBvaW50ZXJcclxuICBwcml2YXRlIGZvY3VzUG9pbnRlcihwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpOiB2b2lkIHtcclxuICAgIC8vIElmIG5vdCBzdXBwbGllZCwgdXNlIG1pbiBwb2ludGVyIGFzIGRlZmF1bHRcclxuICAgIGlmIChwb2ludGVyVHlwZSAhPT0gUG9pbnRlclR5cGUuTWluICYmIHBvaW50ZXJUeXBlICE9PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcG9pbnRlclR5cGUgPSBQb2ludGVyVHlwZS5NaW47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBvaW50ZXJUeXBlID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucmFuZ2UgJiYgcG9pbnRlclR5cGUgPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmb2N1c1BvaW50ZXJJZk5lZWRlZCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5jdXJyZW50Rm9jdXNQb2ludGVyKSkge1xyXG4gICAgICB0aGlzLm9uUG9pbnRlckZvY3VzKHRoaXMuY3VycmVudEZvY3VzUG9pbnRlcik7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZSA9IHRoaXMuZ2V0UG9pbnRlckVsZW1lbnQodGhpcy5jdXJyZW50Rm9jdXNQb2ludGVyKTtcclxuICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIGVhY2ggZWxlbWVudHMgc3R5bGUgYmFzZWQgb24gb3B0aW9uc1xyXG4gIHByaXZhdGUgbWFuYWdlRWxlbWVudHNTdHlsZSgpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlU2NhbGUoKTtcclxuICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuc2V0QWx3YXlzSGlkZSh0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrc1ZhbHVlcyB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVMaW1pdExhYmVscyk7XHJcbiAgICB0aGlzLmNlaWxMYWJlbEVsZW1lbnQuc2V0QWx3YXlzSGlkZSh0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrc1ZhbHVlcyB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVMaW1pdExhYmVscyk7XHJcblxyXG4gICAgY29uc3QgaGlkZUxhYmVsc0ZvclRpY2tzOiBib29sZWFuID0gdGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3NWYWx1ZXMgJiYgIXRoaXMuaW50ZXJtZWRpYXRlVGlja3M7XHJcbiAgICB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5zZXRBbHdheXNIaWRlKGhpZGVMYWJlbHNGb3JUaWNrcyB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVQb2ludGVyTGFiZWxzKTtcclxuICAgIHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LnNldEFsd2F5c0hpZGUoaGlkZUxhYmVsc0ZvclRpY2tzIHx8ICF0aGlzLnJhbmdlIHx8IHRoaXMudmlld09wdGlvbnMuaGlkZVBvaW50ZXJMYWJlbHMpO1xyXG4gICAgdGhpcy5jb21iaW5lZExhYmVsRWxlbWVudC5zZXRBbHdheXNIaWRlKGhpZGVMYWJlbHNGb3JUaWNrcyB8fCAhdGhpcy5yYW5nZSB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVQb2ludGVyTGFiZWxzKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudC5zZXRBbHdheXNIaWRlKCF0aGlzLnJhbmdlICYmICF0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXIpO1xyXG4gICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldEFsd2F5c0hpZGUoIXRoaXMucmFuZ2UgfHwgIXRoaXMudmlld09wdGlvbnMuc2hvd091dGVyU2VsZWN0aW9uQmFycyk7XHJcbiAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldEFsd2F5c0hpZGUoIXRoaXMucmFuZ2UgfHwgIXRoaXMudmlld09wdGlvbnMuc2hvd091dGVyU2VsZWN0aW9uQmFycyk7XHJcblxyXG4gICAgdGhpcy5mdWxsQmFyVHJhbnNwYXJlbnRDbGFzcyA9IHRoaXMucmFuZ2UgJiYgdGhpcy52aWV3T3B0aW9ucy5zaG93T3V0ZXJTZWxlY3Rpb25CYXJzO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25CYXJEcmFnZ2FibGVDbGFzcyA9IHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2UgJiYgIXRoaXMudmlld09wdGlvbnMub25seUJpbmRIYW5kbGVzO1xyXG4gICAgdGhpcy50aWNrc1VuZGVyVmFsdWVzQ2xhc3MgPSB0aGlzLmludGVybWVkaWF0ZVRpY2tzICYmIHRoaXMub3B0aW9ucy5zaG93VGlja3NWYWx1ZXM7XHJcblxyXG4gICAgaWYgKHRoaXMuc2xpZGVyRWxlbWVudFZlcnRpY2FsQ2xhc3MgIT09IHRoaXMudmlld09wdGlvbnMudmVydGljYWwpIHtcclxuICAgICAgdGhpcy51cGRhdGVWZXJ0aWNhbFN0YXRlKCk7XHJcbiAgICAgIC8vIFRoZSBhYm92ZSBjaGFuZ2UgaW4gaG9zdCBjb21wb25lbnQgY2xhc3Mgd2lsbCBub3QgYmUgYXBwbGllZCB1bnRpbCB0aGUgZW5kIG9mIHRoaXMgY3ljbGVcclxuICAgICAgLy8gSG93ZXZlciwgZnVuY3Rpb25zIGNhbGN1bGF0aW5nIHRoZSBzbGlkZXIgcG9zaXRpb24gZXhwZWN0IHRoZSBzbGlkZXIgdG8gYmUgYWxyZWFkeSBzdHlsZWQgYXMgdmVydGljYWxcclxuICAgICAgLy8gU28gYXMgYSB3b3JrYXJvdW5kLCB3ZSBuZWVkIHRvIHJlc2V0IHRoZSBzbGlkZXIgb25jZSBhZ2FpbiB0byBjb21wdXRlIHRoZSBjb3JyZWN0IHZhbHVlc1xyXG4gICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+IHsgdGhpcy5yZXNldFNsaWRlcigpOyB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGFuZ2luZyBhbmltYXRlIGNsYXNzIG1heSBpbnRlcmZlcmUgd2l0aCBzbGlkZXIgcmVzZXQvaW5pdGlhbGlzYXRpb24sIHNvIHdlIHNob3VsZCBzZXQgaXQgc2VwYXJhdGVseSxcclxuICAgIC8vIGFmdGVyIGFsbCBpcyBwcm9wZXJseSBzZXQgdXBcclxuICAgIGlmICh0aGlzLnNsaWRlckVsZW1lbnRBbmltYXRlQ2xhc3MgIT09IHRoaXMudmlld09wdGlvbnMuYW5pbWF0ZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+IHsgdGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzID0gdGhpcy52aWV3T3B0aW9ucy5hbmltYXRlOyB9KTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlUm90YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBNYW5hZ2UgdGhlIGV2ZW50cyBiaW5kaW5ncyBiYXNlZCBvbiByZWFkT25seSBhbmQgZGlzYWJsZWQgb3B0aW9uc1xyXG4gIHByaXZhdGUgbWFuYWdlRXZlbnRzQmluZGluZ3MoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5kaXNhYmxlZCB8fCB0aGlzLnZpZXdPcHRpb25zLnJlYWRPbmx5KSB7XHJcbiAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFNldCB0aGUgZGlzYWJsZWQgc3RhdGUgYmFzZWQgb24gZGlzYWJsZWQgb3B0aW9uXHJcbiAgcHJpdmF0ZSB1cGRhdGVEaXNhYmxlZFN0YXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zbGlkZXJFbGVtZW50RGlzYWJsZWRBdHRyID0gdGhpcy52aWV3T3B0aW9ucy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHRoZSBhcmlhLWxhYmVsIHN0YXRlIGJhc2VkIG9uIGFyaWFMYWJlbCBvcHRpb25cclxuICBwcml2YXRlIHVwZGF0ZUFyaWFMYWJlbCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2xpZGVyRWxlbWVudEFyaWFMYWJlbCA9IHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsIHx8ICdueGctc2xpZGVyJztcclxuICB9XHJcblxyXG4gIC8vIFNldCB2ZXJ0aWNhbCBzdGF0ZSBiYXNlZCBvbiB2ZXJ0aWNhbCBvcHRpb25cclxuICBwcml2YXRlIHVwZGF0ZVZlcnRpY2FsU3RhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNsaWRlckVsZW1lbnRWZXJ0aWNhbENsYXNzID0gdGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbDtcclxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0aGlzLmdldEFsbFNsaWRlckVsZW1lbnRzKCkpIHtcclxuICAgICAgLy8gVGhpcyBpcyBhbHNvIGNhbGxlZCBiZWZvcmUgbmdBZnRlckluaXQsIHNvIG5lZWQgdG8gY2hlY2sgdGhhdCB2aWV3IGNoaWxkIGJpbmRpbmdzIHdvcmtcclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChlbGVtZW50KSkge1xyXG4gICAgICAgIGVsZW1lbnQuc2V0VmVydGljYWwodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlU2NhbGUoKTogdm9pZCB7XHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5nZXRBbGxTbGlkZXJFbGVtZW50cygpKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0U2NhbGUodGhpcy52aWV3T3B0aW9ucy5zY2FsZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVJvdGF0ZSgpOiB2b2lkIHtcclxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0aGlzLmdldEFsbFNsaWRlckVsZW1lbnRzKCkpIHtcclxuICAgICAgZWxlbWVudC5zZXRSb3RhdGUodGhpcy52aWV3T3B0aW9ucy5yb3RhdGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRBbGxTbGlkZXJFbGVtZW50cygpOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlW10ge1xyXG4gICAgcmV0dXJuIFt0aGlzLmxlZnRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQsXHJcbiAgICAgIHRoaXMucmlnaHRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQsXHJcbiAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQsXHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudCxcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LFxyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQsXHJcbiAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQsXHJcbiAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudCxcclxuICAgICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQsXHJcbiAgICAgIHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LFxyXG4gICAgICB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LFxyXG4gICAgICB0aGlzLnRpY2tzRWxlbWVudFxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIC8vIEluaXRpYWxpemUgc2xpZGVyIGhhbmRsZXMgcG9zaXRpb25zIGFuZCBsYWJlbHNcclxuICAvLyBSdW4gb25seSBvbmNlIGR1cmluZyBpbml0aWFsaXphdGlvbiBhbmQgZXZlcnkgdGltZSB2aWV3IHBvcnQgY2hhbmdlcyBzaXplXHJcbiAgcHJpdmF0ZSBpbml0SGFuZGxlcygpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlTG93SGFuZGxlKHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0xvd1ZhbHVlKSk7XHJcblxyXG4gICAgLypcclxuICAgdGhlIG9yZGVyIGhlcmUgaXMgaW1wb3J0YW50IHNpbmNlIHRoZSBzZWxlY3Rpb24gYmFyIHNob3VsZCBiZVxyXG4gICB1cGRhdGVkIGFmdGVyIHRoZSBoaWdoIGhhbmRsZSBidXQgYmVmb3JlIHRoZSBjb21iaW5lZCBsYWJlbFxyXG4gICAqL1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy51cGRhdGVIaWdoSGFuZGxlKHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uQmFyKCk7XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy51cGRhdGVDb21iaW5lZExhYmVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVUaWNrc1NjYWxlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBBZGRzIGFjY2Vzc2liaWxpdHkgYXR0cmlidXRlcywgcnVuIG9ubHkgb25jZSBkdXJpbmcgaW5pdGlhbGl6YXRpb25cclxuICBwcml2YXRlIGFkZEFjY2Vzc2liaWxpdHkoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnJvbGUgPSAnc2xpZGVyJztcclxuXHJcbiAgICBpZiAoIHRoaXMudmlld09wdGlvbnMua2V5Ym9hcmRTdXBwb3J0ICYmXHJcbiAgICAgICEodGhpcy52aWV3T3B0aW9ucy5yZWFkT25seSB8fCB0aGlzLnZpZXdPcHRpb25zLmRpc2FibGVkKSApIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnRhYmluZGV4ID0gJzAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnRhYmluZGV4ID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFPcmllbnRhdGlvbiA9ICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbCkpIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFMYWJlbCA9IHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsO1xyXG4gICAgfSBlbHNlIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWxsZWRCeSkpIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFMYWJlbGxlZEJ5ID0gdGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWxsZWRCeTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQucm9sZSA9ICdzbGlkZXInO1xyXG5cclxuICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMua2V5Ym9hcmRTdXBwb3J0ICYmXHJcbiAgICAgICAgISh0aGlzLnZpZXdPcHRpb25zLnJlYWRPbmx5IHx8IHRoaXMudmlld09wdGlvbnMuZGlzYWJsZWQpKSB7XHJcbiAgICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LnRhYmluZGV4ID0gJzAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC50YWJpbmRleCA9ICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYXJpYU9yaWVudGF0aW9uID0gKHRoaXMudmlld09wdGlvbnMudmVydGljYWwgfHwgdGhpcy52aWV3T3B0aW9ucy5yb3RhdGUgIT09IDApID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuXHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWxIaWdoKSkge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hcmlhTGFiZWwgPSB0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbEhpZ2g7XHJcbiAgICAgIH0gZWxzZSBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsbGVkQnlIaWdoKSkge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hcmlhTGFiZWxsZWRCeSA9IHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsbGVkQnlIaWdoO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGVzIGFyaWEgYXR0cmlidXRlcyBhY2NvcmRpbmcgdG8gY3VycmVudCB2YWx1ZXNcclxuICBwcml2YXRlIHVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU5vdyA9ICgrdGhpcy52YWx1ZSkudG9TdHJpbmcoKTtcclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhVmFsdWVUZXh0ID0gdGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUoK3RoaXMudmFsdWUsIExhYmVsVHlwZS5Mb3cpO1xyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU1pbiA9IHRoaXMudmlld09wdGlvbnMuZmxvb3IudG9TdHJpbmcoKTtcclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhVmFsdWVNYXggPSB0aGlzLnZpZXdPcHRpb25zLmNlaWwudG9TdHJpbmcoKTtcclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYXJpYVZhbHVlTm93ID0gKCt0aGlzLmhpZ2hWYWx1ZSkudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFWYWx1ZVRleHQgPSB0aGlzLnZpZXdPcHRpb25zLnRyYW5zbGF0ZSgrdGhpcy5oaWdoVmFsdWUsIExhYmVsVHlwZS5IaWdoKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU1pbiA9IHRoaXMudmlld09wdGlvbnMuZmxvb3IudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU1heCA9IHRoaXMudmlld09wdGlvbnMuY2VpbC50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGRpbWVuc2lvbnMgdGhhdCBhcmUgZGVwZW5kZW50IG9uIHZpZXcgcG9ydCBzaXplXHJcbiAgLy8gUnVuIG9uY2UgZHVyaW5nIGluaXRpYWxpemF0aW9uIGFuZCBldmVyeSB0aW1lIHZpZXcgcG9ydCBjaGFuZ2VzIHNpemUuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucygpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5oYW5kbGVEaW1lbnNpb24pKSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5zZXREaW1lbnNpb24odGhpcy52aWV3T3B0aW9ucy5oYW5kbGVEaW1lbnNpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhhbmRsZVdpZHRoOiBudW1iZXIgPSB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuZGltZW5zaW9uO1xyXG5cclxuICAgIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbiA9IGhhbmRsZVdpZHRoIC8gMjtcclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuYmFyRGltZW5zaW9uKSkge1xyXG4gICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LnNldERpbWVuc2lvbih0aGlzLnZpZXdPcHRpb25zLmJhckRpbWVuc2lvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWF4SGFuZGxlUG9zaXRpb24gPSB0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIGhhbmRsZVdpZHRoO1xyXG5cclxuICAgIGlmICh0aGlzLmluaXRIYXNSdW4pIHtcclxuICAgICAgdGhpcy51cGRhdGVGbG9vckxhYmVsKCk7XHJcbiAgICAgIHRoaXMudXBkYXRlQ2VpbExhYmVsKCk7XHJcbiAgICAgIHRoaXMuaW5pdEhhbmRsZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnNBbmREZXRlY3RDaGFuZ2VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jYWxjdWxhdGVWaWV3RGltZW5zaW9ucygpO1xyXG4gICAgaWYgKCF0aGlzLmlzUmVmRGVzdHJveWVkKCkpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3Rpb25SZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJZiB0aGUgc2xpZGVyIHJlZmVyZW5jZSBpcyBhbHJlYWR5IGRlc3Ryb3llZFxyXG4gICAqIEByZXR1cm5zIGJvb2xlYW4gLSB0cnVlIGlmIHJlZiBpcyBkZXN0cm95ZWRcclxuICAgKi9cclxuICBwcml2YXRlIGlzUmVmRGVzdHJveWVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmWydkZXN0cm95ZWQnXTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSB0aGUgdGlja3MgcG9zaXRpb25cclxuICBwcml2YXRlIHVwZGF0ZVRpY2tzU2NhbGUoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNsaWRlckVsZW1lbnRXaXRoTGVnZW5kQ2xhc3MgPSBmYWxzZTsgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0aWNrc0FycmF5OiBudW1iZXJbXSA9ICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tzQXJyYXkpXHJcbiAgICAgID8gdGhpcy52aWV3T3B0aW9ucy50aWNrc0FycmF5XHJcbiAgICAgIDogdGhpcy5nZXRUaWNrc0FycmF5KCk7XHJcbiAgICBjb25zdCB0cmFuc2xhdGU6IHN0cmluZyA9IHRoaXMudmlld09wdGlvbnMudmVydGljYWwgPyAndHJhbnNsYXRlWScgOiAndHJhbnNsYXRlWCc7XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgdGlja3NBcnJheS5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGlja1ZhbHVlU3RlcDogbnVtYmVyID0gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja1ZhbHVlU3RlcCkgPyB0aGlzLnZpZXdPcHRpb25zLnRpY2tWYWx1ZVN0ZXAgOlxyXG4gICAgICAgICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCkgPyB0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwKTtcclxuXHJcbiAgICBsZXQgaGFzQXRMZWFzdE9uZUxlZ2VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0IG5ld1RpY2tzOiBUaWNrW10gPSB0aWNrc0FycmF5Lm1hcCgodmFsdWU6IG51bWJlcik6IFRpY2sgPT4ge1xyXG4gICAgICBsZXQgcG9zaXRpb246IG51bWJlciA9IHRoaXMudmFsdWVUb1Bvc2l0aW9uKHZhbHVlKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsKSB7XHJcbiAgICAgICAgcG9zaXRpb24gPSB0aGlzLm1heEhhbmRsZVBvc2l0aW9uIC0gcG9zaXRpb247XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9uOiBzdHJpbmcgPSB0cmFuc2xhdGUgKyAnKCcgKyBNYXRoLnJvdW5kKHBvc2l0aW9uKSArICdweCknO1xyXG4gICAgICBjb25zdCB0aWNrOiBUaWNrID0gbmV3IFRpY2soKTtcclxuICAgICAgdGljay5zZWxlY3RlZCA9IHRoaXMuaXNUaWNrU2VsZWN0ZWQodmFsdWUpO1xyXG4gICAgICB0aWNrLnN0eWxlID0ge1xyXG4gICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6IHRyYW5zbGF0aW9uLFxyXG4gICAgICAgICctbW96LXRyYW5zZm9ybSc6IHRyYW5zbGF0aW9uLFxyXG4gICAgICAgICctby10cmFuc2Zvcm0nOiB0cmFuc2xhdGlvbixcclxuICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHRyYW5zbGF0aW9uLFxyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRpb24sXHJcbiAgICAgIH07XHJcbiAgICAgIGlmICh0aWNrLnNlbGVjdGVkICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKSkge1xyXG4gICAgICAgIHRpY2suc3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IHRoaXMuZ2V0U2VsZWN0aW9uQmFyQ29sb3IoKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXRpY2suc2VsZWN0ZWQgJiYgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuZ2V0VGlja0NvbG9yKSkge1xyXG4gICAgICAgIHRpY2suc3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IHRoaXMuZ2V0VGlja0NvbG9yKHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja3NUb29sdGlwKSkge1xyXG4gICAgICAgIHRpY2sudG9vbHRpcCA9IHRoaXMudmlld09wdGlvbnMudGlja3NUb29sdGlwKHZhbHVlKTtcclxuICAgICAgICB0aWNrLnRvb2x0aXBQbGFjZW1lbnQgPSB0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsID8gJ3JpZ2h0JyA6ICd0b3AnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrc1ZhbHVlcyAmJiAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGlja1ZhbHVlU3RlcCkgJiZcclxuICAgICAgICAgIE1hdGhIZWxwZXIuaXNNb2R1bG9XaXRoaW5QcmVjaXNpb25MaW1pdCh2YWx1ZSwgdGlja1ZhbHVlU3RlcCwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCkpIHtcclxuICAgICAgICB0aWNrLnZhbHVlID0gdGhpcy5nZXREaXNwbGF5VmFsdWUodmFsdWUsIExhYmVsVHlwZS5UaWNrVmFsdWUpO1xyXG4gICAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrc1ZhbHVlc1Rvb2x0aXApKSB7XHJcbiAgICAgICAgICB0aWNrLnZhbHVlVG9vbHRpcCA9IHRoaXMudmlld09wdGlvbnMudGlja3NWYWx1ZXNUb29sdGlwKHZhbHVlKTtcclxuICAgICAgICAgIHRpY2sudmFsdWVUb29sdGlwUGxhY2VtZW50ID0gdGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbFxyXG4gICAgICAgICAgICA/ICdyaWdodCdcclxuICAgICAgICAgICAgOiAndG9wJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBsZWdlbmQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KSkge1xyXG4gICAgICAgIGNvbnN0IHN0ZXA6IEN1c3RvbVN0ZXBEZWZpbml0aW9uID0gdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5W3ZhbHVlXTtcclxuICAgICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuZ2V0U3RlcExlZ2VuZCkpIHtcclxuICAgICAgICAgIGxlZ2VuZCA9IHRoaXMudmlld09wdGlvbnMuZ2V0U3RlcExlZ2VuZChzdGVwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChzdGVwKSkge1xyXG4gICAgICAgICAgbGVnZW5kID0gc3RlcC5sZWdlbmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldExlZ2VuZCkpIHtcclxuICAgICAgICBsZWdlbmQgPSB0aGlzLnZpZXdPcHRpb25zLmdldExlZ2VuZCh2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChsZWdlbmQpKSB7XHJcbiAgICAgICAgdGljay5sZWdlbmQgPSBsZWdlbmQ7XHJcbiAgICAgICAgaGFzQXRMZWFzdE9uZUxlZ2VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aWNrO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc2xpZGVyRWxlbWVudFdpdGhMZWdlbmRDbGFzcyA9IGhhc0F0TGVhc3RPbmVMZWdlbmQ7IH0pO1xyXG5cclxuICAgIC8vIFdlIHNob3VsZCBhdm9pZCByZS1jcmVhdGluZyB0aGUgdGlja3MgYXJyYXkgaWYgcG9zc2libGVcclxuICAgIC8vIFRoaXMgYm90aCBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgbWFrZXMgQ1NTIGFuaW1hdGlvbnMgd29yayBjb3JyZWN0bHlcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy50aWNrcykgJiYgdGhpcy50aWNrcy5sZW5ndGggPT09IG5ld1RpY2tzLmxlbmd0aCkge1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpICA8IG5ld1RpY2tzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnRpY2tzW2ldLCBuZXdUaWNrc1tpXSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGlja3MgPSBuZXdUaWNrcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuaXNSZWZEZXN0cm95ZWQoKSkge1xyXG4gICAgICB0aGlzLmNoYW5nZURldGVjdGlvblJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFRpY2tzQXJyYXkoKTogbnVtYmVyW10ge1xyXG4gICAgY29uc3Qgc3RlcDogbnVtYmVyID0gKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwKSkgPyB0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgY29uc3QgdGlja3NBcnJheTogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICBjb25zdCBudW1iZXJPZlZhbHVlczogbnVtYmVyID0gMSArIE1hdGguZmxvb3IoTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQoXHJcbiAgICAgIE1hdGguYWJzKHRoaXMudmlld09wdGlvbnMuY2VpbCAtIHRoaXMudmlld09wdGlvbnMuZmxvb3IpIC8gc3RlcCxcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdFxyXG4gICAgKSk7XHJcbiAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCBudW1iZXJPZlZhbHVlczsgKytpbmRleCkge1xyXG4gICAgICB0aWNrc0FycmF5LnB1c2goTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQodGhpcy52aWV3T3B0aW9ucy5mbG9vciArIHN0ZXAgKiBpbmRleCwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aWNrc0FycmF5O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc1RpY2tTZWxlY3RlZCh2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMucmFuZ2UpIHtcclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWUpKSB7XHJcbiAgICAgICAgY29uc3QgY2VudGVyOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld0xvd1ZhbHVlID4gY2VudGVyICYmXHJcbiAgICAgICAgICAgIHZhbHVlID49IGNlbnRlciAmJlxyXG4gICAgICAgICAgICB2YWx1ZSA8PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZpZXdMb3dWYWx1ZSA8IGNlbnRlciAmJlxyXG4gICAgICAgICAgICAgICAgICAgdmFsdWUgPD0gY2VudGVyICYmXHJcbiAgICAgICAgICAgICAgICAgICB2YWx1ZSA+PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckVuZCkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA+PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhciAmJiB2YWx1ZSA8PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UgJiYgdmFsdWUgPj0gdGhpcy52aWV3TG93VmFsdWUgJiYgdmFsdWUgPD0gdGhpcy52aWV3SGlnaFZhbHVlKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBwb3NpdGlvbiBvZiB0aGUgZmxvb3IgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUZsb29yTGFiZWwoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuYWx3YXlzSGlkZSkge1xyXG4gICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LnNldFZhbHVlKHRoaXMuZ2V0RGlzcGxheVZhbHVlKHRoaXMudmlld09wdGlvbnMuZmxvb3IsIExhYmVsVHlwZS5GbG9vcikpO1xyXG4gICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmRpbWVuc2lvblxyXG4gICAgICAgIDogMDtcclxuICAgICAgdGhpcy5mbG9vckxhYmVsRWxlbWVudC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgcG9zaXRpb24gb2YgdGhlIGNlaWxpbmcgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUNlaWxMYWJlbCgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5jZWlsTGFiZWxFbGVtZW50LmFsd2F5c0hpZGUpIHtcclxuICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNldFZhbHVlKHRoaXMuZ2V0RGlzcGxheVZhbHVlKHRoaXMudmlld09wdGlvbnMuY2VpbCwgTGFiZWxUeXBlLkNlaWwpKTtcclxuICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gMFxyXG4gICAgICAgIDogdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSB0aGlzLmNlaWxMYWJlbEVsZW1lbnQuZGltZW5zaW9uO1xyXG4gICAgICB0aGlzLmNlaWxMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIHNsaWRlciBoYW5kbGVzIGFuZCBsYWJlbCBwb3NpdGlvbnNcclxuICBwcml2YXRlIHVwZGF0ZUhhbmRsZXMod2hpY2g6IFBvaW50ZXJUeXBlLCBuZXdQb3M6IG51bWJlcik6IHZvaWQge1xyXG4gICAgaWYgKHdoaWNoID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgdGhpcy51cGRhdGVMb3dIYW5kbGUobmV3UG9zKTtcclxuICAgIH0gZWxzZSBpZiAod2hpY2ggPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUhpZ2hIYW5kbGUobmV3UG9zKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbkJhcigpO1xyXG4gICAgdGhpcy51cGRhdGVUaWNrc1NjYWxlKCk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbWJpbmVkTGFiZWwoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byB3b3JrIG91dCB0aGUgcG9zaXRpb24gZm9yIGhhbmRsZSBsYWJlbHMgZGVwZW5kaW5nIG9uIFJUTCBvciBub3RcclxuICBwcml2YXRlIGdldEhhbmRsZUxhYmVsUG9zKGxhYmVsVHlwZTogUG9pbnRlclR5cGUsIG5ld1BvczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGxhYmVsRGltZW5zaW9uOiBudW1iZXIgPSAobGFiZWxUeXBlID09PSBQb2ludGVyVHlwZS5NaW4pXHJcbiAgICAgID8gdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuZGltZW5zaW9uXHJcbiAgICAgIDogdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuZGltZW5zaW9uO1xyXG4gICAgY29uc3QgbmVhckhhbmRsZVBvczogbnVtYmVyID0gbmV3UG9zIC0gbGFiZWxEaW1lbnNpb24gLyAyICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgY29uc3QgZW5kT2ZCYXJQb3M6IG51bWJlciA9IHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gbGFiZWxEaW1lbnNpb247XHJcblxyXG4gICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLmJvdW5kUG9pbnRlckxhYmVscykge1xyXG4gICAgICByZXR1cm4gbmVhckhhbmRsZVBvcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQgJiYgbGFiZWxUeXBlID09PSBQb2ludGVyVHlwZS5NaW4pIHx8XHJcbiAgICAgICAoIXRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQgJiYgbGFiZWxUeXBlID09PSBQb2ludGVyVHlwZS5NYXgpKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLm1pbihuZWFySGFuZGxlUG9zLCBlbmRPZkJhclBvcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobmVhckhhbmRsZVBvcywgMCksIGVuZE9mQmFyUG9zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBsb3cgc2xpZGVyIGhhbmRsZSBwb3NpdGlvbiBhbmQgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUxvd0hhbmRsZShuZXdQb3M6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnNldFBvc2l0aW9uKG5ld1Bvcyk7XHJcbiAgICB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5zZXRWYWx1ZSh0aGlzLmdldERpc3BsYXlWYWx1ZSh0aGlzLnZpZXdMb3dWYWx1ZSwgTGFiZWxUeXBlLkxvdykpO1xyXG4gICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24odGhpcy5nZXRIYW5kbGVMYWJlbFBvcyhQb2ludGVyVHlwZS5NaW4sIG5ld1BvcykpO1xyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5nZXRQb2ludGVyQ29sb3IpKSB7XHJcbiAgICAgIHRoaXMubWluUG9pbnRlclN0eWxlID0ge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5nZXRQb2ludGVyQ29sb3IoUG9pbnRlclR5cGUuTWluKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hdXRvSGlkZUxpbWl0TGFiZWxzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRmxvb3JBbmRDZWlsTGFiZWxzVmlzaWJpbGl0eSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIGhpZ2ggc2xpZGVyIGhhbmRsZSBwb3NpdGlvbiBhbmQgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUhpZ2hIYW5kbGUobmV3UG9zOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5zZXRQb3NpdGlvbihuZXdQb3MpO1xyXG4gICAgdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuc2V0VmFsdWUodGhpcy5nZXREaXNwbGF5VmFsdWUodGhpcy52aWV3SGlnaFZhbHVlLCBMYWJlbFR5cGUuSGlnaCkpO1xyXG4gICAgdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24odGhpcy5nZXRIYW5kbGVMYWJlbFBvcyhQb2ludGVyVHlwZS5NYXgsIG5ld1BvcykpO1xyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5nZXRQb2ludGVyQ29sb3IpKSB7XHJcbiAgICAgIHRoaXMubWF4UG9pbnRlclN0eWxlID0ge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5nZXRQb2ludGVyQ29sb3IoUG9pbnRlclR5cGUuTWF4KSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmF1dG9IaWRlTGltaXRMYWJlbHMpIHtcclxuICAgICAgdGhpcy51cGRhdGVGbG9vckFuZENlaWxMYWJlbHNWaXNpYmlsaXR5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTaG93L2hpZGUgZmxvb3IvY2VpbGluZyBsYWJlbFxyXG4gIHByaXZhdGUgdXBkYXRlRmxvb3JBbmRDZWlsTGFiZWxzVmlzaWJpbGl0eSgpOiB2b2lkIHtcclxuICAgIC8vIFNob3cgYmFzZWQgb25seSBvbiBoaWRlTGltaXRMYWJlbHMgaWYgcG9pbnRlciBsYWJlbHMgYXJlIGhpZGRlblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuaGlkZVBvaW50ZXJMYWJlbHMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGZsb29yTGFiZWxIaWRkZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGxldCBjZWlsTGFiZWxIaWRkZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGNvbnN0IGlzTWluTGFiZWxBdEZsb29yOiBib29sZWFuID0gdGhpcy5pc0xhYmVsQmVsb3dGbG9vckxhYmVsKHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50KTtcclxuICAgIGNvbnN0IGlzTWluTGFiZWxBdENlaWw6IGJvb2xlYW4gPSB0aGlzLmlzTGFiZWxBYm92ZUNlaWxMYWJlbCh0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudCk7XHJcbiAgICBjb25zdCBpc01heExhYmVsQXRDZWlsOiBib29sZWFuID0gdGhpcy5pc0xhYmVsQWJvdmVDZWlsTGFiZWwodGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQpO1xyXG4gICAgY29uc3QgaXNDb21iaW5lZExhYmVsQXRGbG9vcjogYm9vbGVhbiA9IHRoaXMuaXNMYWJlbEJlbG93Rmxvb3JMYWJlbCh0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50KTtcclxuICAgIGNvbnN0IGlzQ29tYmluZWRMYWJlbEF0Q2VpbDogYm9vbGVhbiA9IHRoaXMuaXNMYWJlbEFib3ZlQ2VpbExhYmVsKHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQpO1xyXG5cclxuICAgIGlmIChpc01pbkxhYmVsQXRGbG9vcikge1xyXG4gICAgICBmbG9vckxhYmVsSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5mbG9vckxhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmbG9vckxhYmVsSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc01pbkxhYmVsQXRDZWlsKSB7XHJcbiAgICAgIGNlaWxMYWJlbEhpZGRlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjZWlsTGFiZWxIaWRkZW4gPSBmYWxzZTtcclxuICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICBjb25zdCBoaWRlQ2VpbDogYm9vbGVhbiA9IHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuaXNWaXNpYmxlKCkgPyBpc0NvbWJpbmVkTGFiZWxBdENlaWwgOiBpc01heExhYmVsQXRDZWlsO1xyXG4gICAgICBjb25zdCBoaWRlRmxvb3I6IGJvb2xlYW4gPSB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LmlzVmlzaWJsZSgpID8gaXNDb21iaW5lZExhYmVsQXRGbG9vciA6IGlzTWluTGFiZWxBdEZsb29yO1xyXG5cclxuICAgICAgaWYgKGhpZGVDZWlsKSB7XHJcbiAgICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LmhpZGUoKTtcclxuICAgICAgfSBlbHNlIGlmICghY2VpbExhYmVsSGlkZGVuKSB7XHJcbiAgICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSGlkZSBvciBzaG93IGZsb29yIGxhYmVsXHJcbiAgICAgIGlmIChoaWRlRmxvb3IpIHtcclxuICAgICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmhpZGUoKTtcclxuICAgICAgfSBlbHNlIGlmICghZmxvb3JMYWJlbEhpZGRlbikge1xyXG4gICAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzTGFiZWxCZWxvd0Zsb29yTGFiZWwobGFiZWw6IFNsaWRlckxhYmVsRGlyZWN0aXZlKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBwb3M6IG51bWJlciA9IGxhYmVsLnBvc2l0aW9uO1xyXG4gICAgY29uc3QgZGltOiBudW1iZXIgPSBsYWJlbC5kaW1lbnNpb247XHJcbiAgICBjb25zdCBmbG9vclBvczogbnVtYmVyID0gdGhpcy5mbG9vckxhYmVsRWxlbWVudC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGZsb29yRGltOiBudW1iZXIgPSB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmRpbWVuc2lvbjtcclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgID8gcG9zICsgZGltID49IGZsb29yUG9zIC0gMlxyXG4gICAgICA6IHBvcyA8PSBmbG9vclBvcyArIGZsb29yRGltICsgMjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNMYWJlbEFib3ZlQ2VpbExhYmVsKGxhYmVsOiBTbGlkZXJMYWJlbERpcmVjdGl2ZSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgcG9zOiBudW1iZXIgPSBsYWJlbC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGRpbTogbnVtYmVyID0gbGFiZWwuZGltZW5zaW9uO1xyXG4gICAgY29uc3QgY2VpbFBvczogbnVtYmVyID0gdGhpcy5jZWlsTGFiZWxFbGVtZW50LnBvc2l0aW9uO1xyXG4gICAgY29uc3QgY2VpbERpbTogbnVtYmVyID0gdGhpcy5jZWlsTGFiZWxFbGVtZW50LmRpbWVuc2lvbjtcclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgID8gcG9zIDw9IGNlaWxQb3MgKyBjZWlsRGltICsgMlxyXG4gICAgICA6IHBvcyArIGRpbSA+PSBjZWlsUG9zIC0gMjtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBzbGlkZXIgc2VsZWN0aW9uIGJhciwgY29tYmluZWQgbGFiZWwgYW5kIHJhbmdlIGxhYmVsXHJcbiAgcHJpdmF0ZSB1cGRhdGVTZWxlY3Rpb25CYXIoKTogdm9pZCB7XHJcbiAgICBsZXQgcG9zaXRpb246IG51bWJlciA9IDA7XHJcbiAgICBsZXQgZGltZW5zaW9uOiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3QgaXNTZWxlY3Rpb25CYXJGcm9tUmlnaHQ6IGJvb2xlYW4gPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyAhdGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRW5kXHJcbiAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJFbmQ7XHJcbiAgICBjb25zdCBwb3NpdGlvbkZvclJhbmdlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyB0aGlzLm1heEhhbmRsZUVsZW1lbnQucG9zaXRpb24gKyB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb25cclxuICAgICAgICA6IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICBkaW1lbnNpb24gPSBNYXRoLmFicyh0aGlzLm1heEhhbmRsZUVsZW1lbnQucG9zaXRpb24gLSB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24pO1xyXG4gICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uRm9yUmFuZ2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZSkpIHtcclxuICAgICAgICBjb25zdCBjZW50ZXI6IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZTtcclxuICAgICAgICBjb25zdCBjZW50ZXJQb3NpdGlvbjogbnVtYmVyID0gdGhpcy52YWx1ZVRvUG9zaXRpb24oY2VudGVyKTtcclxuICAgICAgICBjb25zdCBpc01vZGVsR3JlYXRlclRoYW5DZW50ZXI6IGJvb2xlYW4gPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgICAgID8gdGhpcy52aWV3TG93VmFsdWUgPD0gY2VudGVyXHJcbiAgICAgICAgICAgIDogdGhpcy52aWV3TG93VmFsdWUgPiBjZW50ZXI7XHJcbiAgICAgICAgaWYgKGlzTW9kZWxHcmVhdGVyVGhhbkNlbnRlcikge1xyXG4gICAgICAgICAgZGltZW5zaW9uID0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uIC0gY2VudGVyUG9zaXRpb247XHJcbiAgICAgICAgICBwb3NpdGlvbiA9IGNlbnRlclBvc2l0aW9uICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkaW1lbnNpb24gPSBjZW50ZXJQb3NpdGlvbiAtIHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbjtcclxuICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChpc1NlbGVjdGlvbkJhckZyb21SaWdodCkge1xyXG4gICAgICAgIGRpbWVuc2lvbiA9IE1hdGguY2VpbChNYXRoLmFicyh0aGlzLm1heEhhbmRsZVBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uKSArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbik7XHJcbiAgICAgICAgcG9zaXRpb24gPSBNYXRoLmZsb29yKHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGltZW5zaW9uID0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgICAgIHBvc2l0aW9uID0gMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50LnNldERpbWVuc2lvbihkaW1lbnNpb24pO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgIGlmICh0aGlzLnJhbmdlICYmIHRoaXMudmlld09wdGlvbnMuc2hvd091dGVyU2VsZWN0aW9uQmFycykge1xyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCkge1xyXG4gICAgICAgIHRoaXMucmlnaHRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQuc2V0RGltZW5zaW9uKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKDApO1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQuY2FsY3VsYXRlRGltZW5zaW9uKCk7XHJcbiAgICAgICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldERpbWVuc2lvbih0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIChwb3NpdGlvbiArIGRpbWVuc2lvbikpO1xyXG4gICAgICAgIHRoaXMubGVmdE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXRQb3NpdGlvbihwb3NpdGlvbiArIGRpbWVuc2lvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldERpbWVuc2lvbihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKDApO1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQuY2FsY3VsYXRlRGltZW5zaW9uKCk7XHJcbiAgICAgICAgdGhpcy5yaWdodE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXREaW1lbnNpb24odGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSAocG9zaXRpb24gKyBkaW1lbnNpb24pKTtcclxuICAgICAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKHBvc2l0aW9uICsgZGltZW5zaW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKSkge1xyXG4gICAgICBjb25zdCBjb2xvcjogc3RyaW5nID0gdGhpcy5nZXRTZWxlY3Rpb25CYXJDb2xvcigpO1xyXG4gICAgICB0aGlzLmJhclN0eWxlID0ge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnNlbGVjdGlvbkJhckdyYWRpZW50KSkge1xyXG4gICAgICBjb25zdCBvZmZzZXQ6IG51bWJlciA9ICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRnJvbVZhbHVlKSlcclxuICAgICAgICAgICAgPyB0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWUpXHJcbiAgICAgICAgICAgIDogMDtcclxuICAgICAgY29uc3QgcmV2ZXJzZWQ6IGJvb2xlYW4gPSAob2Zmc2V0IC0gcG9zaXRpb24gPiAwICYmICFpc1NlbGVjdGlvbkJhckZyb21SaWdodCkgfHwgKG9mZnNldCAtIHBvc2l0aW9uIDw9IDAgJiYgaXNTZWxlY3Rpb25CYXJGcm9tUmlnaHQpO1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb246IHN0cmluZyA9IHRoaXMudmlld09wdGlvbnMudmVydGljYWxcclxuICAgICAgICAgID8gcmV2ZXJzZWQgPyAnYm90dG9tJyA6ICd0b3AnXHJcbiAgICAgICAgICA6IHJldmVyc2VkID8gJ2xlZnQnIDogJ3JpZ2h0JztcclxuICAgICAgdGhpcy5iYXJTdHlsZSA9IHtcclxuICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6XHJcbiAgICAgICAgICAnbGluZWFyLWdyYWRpZW50KHRvICcgK1xyXG4gICAgICAgICAgZGlyZWN0aW9uICtcclxuICAgICAgICAgICcsICcgK1xyXG4gICAgICAgICAgdGhpcy52aWV3T3B0aW9ucy5zZWxlY3Rpb25CYXJHcmFkaWVudC5mcm9tICtcclxuICAgICAgICAgICcgMCUsJyArXHJcbiAgICAgICAgICB0aGlzLnZpZXdPcHRpb25zLnNlbGVjdGlvbkJhckdyYWRpZW50LnRvICtcclxuICAgICAgICAgICcgMTAwJSknLFxyXG4gICAgICB9O1xyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCkge1xyXG4gICAgICAgIHRoaXMuYmFyU3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID1cclxuICAgICAgICAgICdjZW50ZXIgJyArXHJcbiAgICAgICAgICAob2Zmc2V0ICtcclxuICAgICAgICAgICAgZGltZW5zaW9uICtcclxuICAgICAgICAgICAgcG9zaXRpb24gK1xyXG4gICAgICAgICAgICAocmV2ZXJzZWQgPyAtdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uIDogMCkpICtcclxuICAgICAgICAgICdweCc7XHJcbiAgICAgICAgdGhpcy5iYXJTdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9XHJcbiAgICAgICAgICAnMTAwJSAnICsgKHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uKSArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5iYXJTdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPVxyXG4gICAgICAgICAgb2Zmc2V0IC1cclxuICAgICAgICAgIHBvc2l0aW9uICtcclxuICAgICAgICAgIChyZXZlcnNlZCA/IHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbiA6IDApICtcclxuICAgICAgICAgICdweCBjZW50ZXInO1xyXG4gICAgICAgIHRoaXMuYmFyU3R5bGUuYmFja2dyb3VuZFNpemUgPVxyXG4gICAgICAgICAgdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb24gKyAncHggMTAwJSc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFdyYXBwZXIgYXJvdW5kIHRoZSBnZXRTZWxlY3Rpb25CYXJDb2xvciBvZiB0aGUgdXNlciB0byBwYXNzIHRvIGNvcnJlY3QgcGFyYW1ldGVyc1xyXG4gIHByaXZhdGUgZ2V0U2VsZWN0aW9uQmFyQ29sb3IoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKFxyXG4gICAgICAgIHRoaXMudmFsdWUsXHJcbiAgICAgICAgdGhpcy5oaWdoVmFsdWVcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKHRoaXMudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgLy8gV3JhcHBlciBhcm91bmQgdGhlIGdldFBvaW50ZXJDb2xvciBvZiB0aGUgdXNlciB0byBwYXNzIHRvICBjb3JyZWN0IHBhcmFtZXRlcnNcclxuICBwcml2YXRlIGdldFBvaW50ZXJDb2xvcihwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpOiBzdHJpbmcge1xyXG4gICAgaWYgKHBvaW50ZXJUeXBlID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMuZ2V0UG9pbnRlckNvbG9yKFxyXG4gICAgICAgIHRoaXMuaGlnaFZhbHVlLFxyXG4gICAgICAgIHBvaW50ZXJUeXBlXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy5nZXRQb2ludGVyQ29sb3IoXHJcbiAgICAgIHRoaXMudmFsdWUsXHJcbiAgICAgIHBvaW50ZXJUeXBlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gV3JhcHBlciBhcm91bmQgdGhlIGdldFRpY2tDb2xvciBvZiB0aGUgdXNlciB0byBwYXNzIHRvIGNvcnJlY3QgcGFyYW1ldGVyc1xyXG4gIHByaXZhdGUgZ2V0VGlja0NvbG9yKHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMuZ2V0VGlja0NvbG9yKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBjb21iaW5lZCBsYWJlbCBwb3NpdGlvbiBhbmQgdmFsdWVcclxuICBwcml2YXRlIHVwZGF0ZUNvbWJpbmVkTGFiZWwoKTogdm9pZCB7XHJcbiAgICBsZXQgaXNMYWJlbE92ZXJsYXA6IGJvb2xlYW4gPSBudWxsO1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgaXNMYWJlbE92ZXJsYXAgPVxyXG4gICAgICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LnBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuZGltZW5zaW9uIC0gMTAgPD0gdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQucG9zaXRpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpc0xhYmVsT3ZlcmxhcCA9XHJcbiAgICAgICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQucG9zaXRpb24gKyB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5kaW1lbnNpb24gKyAxMCA+PSB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudC5wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNMYWJlbE92ZXJsYXApIHtcclxuICAgICAgY29uc3QgbG93RGlzcGxheVZhbHVlOiBzdHJpbmcgPSB0aGlzLmdldERpc3BsYXlWYWx1ZSh0aGlzLnZpZXdMb3dWYWx1ZSwgTGFiZWxUeXBlLkxvdyk7XHJcbiAgICAgIGNvbnN0IGhpZ2hEaXNwbGF5VmFsdWU6IHN0cmluZyA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlKHRoaXMudmlld0hpZ2hWYWx1ZSwgTGFiZWxUeXBlLkhpZ2gpO1xyXG4gICAgICBjb25zdCBjb21iaW5lZExhYmVsVmFsdWU6IHN0cmluZyA9IHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnRcclxuICAgICAgICA/IHRoaXMudmlld09wdGlvbnMuY29tYmluZUxhYmVscyhoaWdoRGlzcGxheVZhbHVlLCBsb3dEaXNwbGF5VmFsdWUpXHJcbiAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLmNvbWJpbmVMYWJlbHMobG93RGlzcGxheVZhbHVlLCBoaWdoRGlzcGxheVZhbHVlKTtcclxuXHJcbiAgICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuc2V0VmFsdWUoY29tYmluZWRMYWJlbFZhbHVlKTtcclxuICAgICAgY29uc3QgcG9zOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLmJvdW5kUG9pbnRlckxhYmVsc1xyXG4gICAgICAgID8gTWF0aC5taW4oXHJcbiAgICAgICAgICAgIE1hdGgubWF4KFxyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudC5wb3NpdGlvbiArXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQuZGltZW5zaW9uIC8gMiAtXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LmRpbWVuc2lvbiAvIDIsXHJcbiAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuZGltZW5zaW9uXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQucG9zaXRpb24gKyB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQuZGltZW5zaW9uIC8gMiAtIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuZGltZW5zaW9uIC8gMjtcclxuXHJcbiAgICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24ocG9zKTtcclxuICAgICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuaGlkZSgpO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cGRhdGVIaWdoSGFuZGxlKHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSkpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUxvd0hhbmRsZSh0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdMb3dWYWx1ZSkpO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudC5zaG93KCk7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgICAgdGhpcy5jb21iaW5lZExhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hdXRvSGlkZUxpbWl0TGFiZWxzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRmxvb3JBbmRDZWlsTGFiZWxzVmlzaWJpbGl0eSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIHRoZSB0cmFuc2xhdGVkIHZhbHVlIGlmIGEgdHJhbnNsYXRlIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIGVsc2UgdGhlIG9yaWdpbmFsIHZhbHVlXHJcbiAgcHJpdmF0ZSBnZXREaXNwbGF5VmFsdWUodmFsdWU6IG51bWJlciwgd2hpY2g6IExhYmVsVHlwZSk6IHN0cmluZyB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheSkgJiYgIXRoaXMudmlld09wdGlvbnMuYmluZEluZGV4Rm9yU3RlcHNBcnJheSkge1xyXG4gICAgICB2YWx1ZSA9IHRoaXMuZ2V0U3RlcFZhbHVlKHZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLnRyYW5zbGF0ZSh2YWx1ZSwgd2hpY2gpO1xyXG4gIH1cclxuXHJcbiAgLy8gUm91bmQgdmFsdWUgdG8gc3RlcCBhbmQgcHJlY2lzaW9uIGJhc2VkIG9uIG1pblZhbHVlXHJcbiAgcHJpdmF0ZSByb3VuZFN0ZXAodmFsdWU6IG51bWJlciwgY3VzdG9tU3RlcD86IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBzdGVwOiBudW1iZXIgPSAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY3VzdG9tU3RlcCkgPyBjdXN0b21TdGVwIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgbGV0IHN0ZXBwZWREaWZmZXJlbmNlOiBudW1iZXIgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChcclxuICAgICAgKHZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5mbG9vcikgLyBzdGVwLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgIHN0ZXBwZWREaWZmZXJlbmNlID0gTWF0aC5yb3VuZChzdGVwcGVkRGlmZmVyZW5jZSkgKiBzdGVwO1xyXG4gICAgcmV0dXJuIE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld09wdGlvbnMuZmxvb3IgKyBzdGVwcGVkRGlmZmVyZW5jZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgfVxyXG5cclxuICAvLyBUcmFuc2xhdGUgdmFsdWUgdG8gcGl4ZWwgcG9zaXRpb25cclxuICBwcml2YXRlIHZhbHVlVG9Qb3NpdGlvbih2YWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBsZXQgZm46IFZhbHVlVG9Qb3NpdGlvbkZ1bmN0aW9uICA9IFZhbHVlSGVscGVyLmxpbmVhclZhbHVlVG9Qb3NpdGlvbjtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5jdXN0b21WYWx1ZVRvUG9zaXRpb24pKSB7XHJcbiAgICAgIGZuID0gdGhpcy52aWV3T3B0aW9ucy5jdXN0b21WYWx1ZVRvUG9zaXRpb247XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMudmlld09wdGlvbnMubG9nU2NhbGUpIHtcclxuICAgICAgZm4gPSBWYWx1ZUhlbHBlci5sb2dWYWx1ZVRvUG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgdmFsID0gTWF0aEhlbHBlci5jbGFtcFRvUmFuZ2UodmFsLCB0aGlzLnZpZXdPcHRpb25zLmZsb29yLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpO1xyXG4gICAgbGV0IHBlcmNlbnQ6IG51bWJlciA9IGZuKHZhbCwgdGhpcy52aWV3T3B0aW9ucy5mbG9vciwgdGhpcy52aWV3T3B0aW9ucy5jZWlsKTtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChwZXJjZW50KSkge1xyXG4gICAgICBwZXJjZW50ID0gMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcclxuICAgIH1cclxuICAgIHJldHVybiBwZXJjZW50ICogdGhpcy5tYXhIYW5kbGVQb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIC8vIFRyYW5zbGF0ZSBwb3NpdGlvbiB0byBtb2RlbCB2YWx1ZVxyXG4gIHByaXZhdGUgcG9zaXRpb25Ub1ZhbHVlKHBvc2l0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgbGV0IHBlcmNlbnQ6IG51bWJlciA9IHBvc2l0aW9uIC8gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbjtcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcclxuICAgIH1cclxuICAgIGxldCBmbjogUG9zaXRpb25Ub1ZhbHVlRnVuY3Rpb24gPSBWYWx1ZUhlbHBlci5saW5lYXJQb3NpdGlvblRvVmFsdWU7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuY3VzdG9tUG9zaXRpb25Ub1ZhbHVlKSkge1xyXG4gICAgICBmbiA9IHRoaXMudmlld09wdGlvbnMuY3VzdG9tUG9zaXRpb25Ub1ZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnZpZXdPcHRpb25zLmxvZ1NjYWxlKSB7XHJcbiAgICAgIGZuID0gVmFsdWVIZWxwZXIubG9nUG9zaXRpb25Ub1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmFsdWU6IG51bWJlciA9IGZuKHBlcmNlbnQsIHRoaXMudmlld09wdGlvbnMuZmxvb3IsIHRoaXMudmlld09wdGlvbnMuY2VpbCk7XHJcbiAgICByZXR1cm4gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSA/IHZhbHVlIDogMDtcclxuICB9XHJcblxyXG4gIC8vIEdldCB0aGUgWC1jb29yZGluYXRlIG9yIFktY29vcmRpbmF0ZSBvZiBhbiBldmVudFxyXG4gIHByaXZhdGUgZ2V0RXZlbnRYWShldmVudDogTW91c2VFdmVudHxUb3VjaEV2ZW50LCB0YXJnZXRUb3VjaElkPzogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcclxuICAgICAgcmV0dXJuICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/IGV2ZW50LmNsaWVudFkgOiBldmVudC5jbGllbnRYO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0b3VjaEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3QgdG91Y2hlczogVG91Y2hMaXN0ID0gZXZlbnQudG91Y2hlcztcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0VG91Y2hJZCkpIHtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodG91Y2hlc1tpXS5pZGVudGlmaWVyID09PSB0YXJnZXRUb3VjaElkKSB7XHJcbiAgICAgICAgICB0b3VjaEluZGV4ID0gaTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldHVybiB0aGUgdGFyZ2V0IHRvdWNoIG9yIGlmIHRoZSB0YXJnZXQgdG91Y2ggd2FzIG5vdCBmb3VuZCBpbiB0aGUgZXZlbnRcclxuICAgIC8vIHJldHVybnMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBmaXJzdCB0b3VjaFxyXG4gICAgcmV0dXJuICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/IHRvdWNoZXNbdG91Y2hJbmRleF0uY2xpZW50WSA6IHRvdWNoZXNbdG91Y2hJbmRleF0uY2xpZW50WDtcclxuICB9XHJcblxyXG4gIC8vIENvbXB1dGUgdGhlIGV2ZW50IHBvc2l0aW9uIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBzbGlkZXIgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxyXG4gIHByaXZhdGUgZ2V0RXZlbnRQb3NpdGlvbihldmVudDogTW91c2VFdmVudHxUb3VjaEV2ZW50LCB0YXJnZXRUb3VjaElkPzogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHNsaWRlckVsZW1lbnRCb3VuZGluZ1JlY3Q6IENsaWVudFJlY3QgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCBzbGlkZXJQb3M6IG51bWJlciA9ICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/XHJcbiAgICAgIHNsaWRlckVsZW1lbnRCb3VuZGluZ1JlY3QuYm90dG9tIDogc2xpZGVyRWxlbWVudEJvdW5kaW5nUmVjdC5sZWZ0O1xyXG4gICAgbGV0IGV2ZW50UG9zOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSB7XHJcbiAgICAgIGV2ZW50UG9zID0gLXRoaXMuZ2V0RXZlbnRYWShldmVudCwgdGFyZ2V0VG91Y2hJZCkgKyBzbGlkZXJQb3M7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudFBvcyA9IHRoaXMuZ2V0RXZlbnRYWShldmVudCwgdGFyZ2V0VG91Y2hJZCkgLSBzbGlkZXJQb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV2ZW50UG9zICogdGhpcy52aWV3T3B0aW9ucy5zY2FsZSAtIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuICB9XHJcblxyXG4gIC8vIEdldCB0aGUgaGFuZGxlIGNsb3Nlc3QgdG8gYW4gZXZlbnRcclxuICBwcml2YXRlIGdldE5lYXJlc3RIYW5kbGUoZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCk6IFBvaW50ZXJUeXBlIHtcclxuICAgIGlmICghdGhpcy5yYW5nZSkge1xyXG4gICAgICByZXR1cm4gUG9pbnRlclR5cGUuTWluO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBvc2l0aW9uOiBudW1iZXIgPSB0aGlzLmdldEV2ZW50UG9zaXRpb24oZXZlbnQpO1xyXG4gICAgY29uc3QgZGlzdGFuY2VNaW46IG51bWJlciA9IE1hdGguYWJzKHBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uKTtcclxuICAgIGNvbnN0IGRpc3RhbmNlTWF4OiBudW1iZXIgPSBNYXRoLmFicyhwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlRWxlbWVudC5wb3NpdGlvbik7XHJcblxyXG4gICAgaWYgKGRpc3RhbmNlTWluIDwgZGlzdGFuY2VNYXgpIHtcclxuICAgICAgcmV0dXJuIFBvaW50ZXJUeXBlLk1pbjtcclxuICAgIH0gZWxzZSBpZiAoZGlzdGFuY2VNaW4gPiBkaXN0YW5jZU1heCkge1xyXG4gICAgICByZXR1cm4gUG9pbnRlclR5cGUuTWF4O1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCkge1xyXG4gICAgICAvLyBpZiBldmVudCBpcyBhdCB0aGUgc2FtZSBkaXN0YW5jZSBmcm9tIG1pbi9tYXggdGhlbiBpZiBpdCdzIGF0IGxlZnQgb2YgbWluSCwgd2UgcmV0dXJuIG1pbkggZWxzZSBtYXhIXHJcbiAgICAgIHJldHVybiBwb3NpdGlvbiA8IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiA/IFBvaW50ZXJUeXBlLk1pbiA6IFBvaW50ZXJUeXBlLk1heDtcclxuICAgIH1cclxuICAgIC8vIHJldmVyc2UgaW4gcnRsXHJcbiAgICByZXR1cm4gcG9zaXRpb24gPiB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24gPyBQb2ludGVyVHlwZS5NaW4gOiBQb2ludGVyVHlwZS5NYXg7XHJcbiAgfVxyXG5cclxuICAvLyBCaW5kIG1vdXNlIGFuZCB0b3VjaCBldmVudHMgdG8gc2xpZGVyIGhhbmRsZXNcclxuICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBkcmFnZ2FibGVSYW5nZTogYm9vbGVhbiA9IHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2U7XHJcblxyXG4gICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLm9ubHlCaW5kSGFuZGxlcykge1xyXG4gICAgICB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQobnVsbCwgZHJhZ2dhYmxlUmFuZ2UsIGV2ZW50LCB0cnVlLCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlT25seSkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQoUG9pbnRlclR5cGUuTWluLCBkcmFnZ2FibGVSYW5nZSwgZXZlbnQsIHRydWUsIHRydWUpXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5vbignbW91c2Vkb3duJyxcclxuICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25CYXJTdGFydChQb2ludGVyVHlwZS5NYXgsIGRyYWdnYWJsZVJhbmdlLCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5vbignbW91c2Vkb3duJyxcclxuICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChQb2ludGVyVHlwZS5NaW4sIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChQb2ludGVyVHlwZS5NYXgsIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLm9ubHlCaW5kSGFuZGxlcykge1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChudWxsLCBldmVudCwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlja3NFbGVtZW50Lm9uKCdtb3VzZWRvd24nLFxyXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uU3RhcnQobnVsbCwgZXZlbnQsIHRydWUsIHRydWUsIHRydWUsIHRydWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5vbmx5QmluZEhhbmRsZXMpIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50Lm9uUGFzc2l2ZSgndG91Y2hzdGFydCcsXHJcbiAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQobnVsbCwgZHJhZ2dhYmxlUmFuZ2UsIGV2ZW50LCB0cnVlLCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5KSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5vblBhc3NpdmUoJ3RvdWNoc3RhcnQnLFxyXG4gICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vbkJhclN0YXJ0KFBvaW50ZXJUeXBlLk1pbiwgZHJhZ2dhYmxlUmFuZ2UsIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25CYXJTdGFydChQb2ludGVyVHlwZS5NYXgsIGRyYWdnYWJsZVJhbmdlLCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5vblBhc3NpdmUoJ3RvdWNoc3RhcnQnLFxyXG4gICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vblN0YXJ0KFBvaW50ZXJUeXBlLk1pbiwgZXZlbnQsIHRydWUsIHRydWUpXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50Lm9uUGFzc2l2ZSgndG91Y2hzdGFydCcsXHJcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChQb2ludGVyVHlwZS5NYXgsIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLm9ubHlCaW5kSGFuZGxlcykge1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vblN0YXJ0KG51bGwsIGV2ZW50LCB0cnVlLCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy50aWNrc0VsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vblN0YXJ0KG51bGwsIGV2ZW50LCBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQub24oJ2ZvY3VzJywgKCk6IHZvaWQgPT4gdGhpcy5vblBvaW50ZXJGb2N1cyhQb2ludGVyVHlwZS5NaW4pKTtcclxuICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQub24oJ2ZvY3VzJywgKCk6IHZvaWQgPT4gdGhpcy5vblBvaW50ZXJGb2N1cyhQb2ludGVyVHlwZS5NYXgpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzKG9wdGlvbnM6IE9wdGlvbnMpOiBib29sZWFuW10ge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgb3B0aW9ucy5kaXNhYmxlZCxcclxuICAgICAgb3B0aW9ucy5yZWFkT25seSxcclxuICAgICAgb3B0aW9ucy5kcmFnZ2FibGVSYW5nZSxcclxuICAgICAgb3B0aW9ucy5kcmFnZ2FibGVSYW5nZU9ubHksXHJcbiAgICAgIG9wdGlvbnMub25seUJpbmRIYW5kbGVzLFxyXG4gICAgICBvcHRpb25zLmtleWJvYXJkU3VwcG9ydFxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIC8vIFVuYmluZCBtb3VzZSBhbmQgdG91Y2ggZXZlbnRzIHRvIHNsaWRlciBoYW5kbGVzXHJcbiAgcHJpdmF0ZSB1bmJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlT25Nb3ZlKCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlT25FbmQoKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5nZXRBbGxTbGlkZXJFbGVtZW50cygpKSB7XHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudCkpIHtcclxuICAgICAgICBlbGVtZW50Lm9mZigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uQmFyU3RhcnQocG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlLCBkcmFnZ2FibGVSYW5nZTogYm9vbGVhbiwgZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCxcclxuICAgIGJpbmRNb3ZlOiBib29sZWFuLCBiaW5kRW5kOiBib29sZWFuLCBzaW11bGF0ZUltbWVkaWF0ZU1vdmU/OiBib29sZWFuLCBzaW11bGF0ZUltbWVkaWF0ZUVuZD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGlmIChkcmFnZ2FibGVSYW5nZSkge1xyXG4gICAgICB0aGlzLm9uRHJhZ1N0YXJ0KHBvaW50ZXJUeXBlLCBldmVudCwgYmluZE1vdmUsIGJpbmRFbmQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vblN0YXJ0KHBvaW50ZXJUeXBlLCBldmVudCwgYmluZE1vdmUsIGJpbmRFbmQsIHNpbXVsYXRlSW1tZWRpYXRlTW92ZSwgc2ltdWxhdGVJbW1lZGlhdGVFbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gb25TdGFydCBldmVudCBoYW5kbGVyXHJcbiAgcHJpdmF0ZSBvblN0YXJ0KHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSwgZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCxcclxuICAgICAgYmluZE1vdmU6IGJvb2xlYW4sIGJpbmRFbmQ6IGJvb2xlYW4sIHNpbXVsYXRlSW1tZWRpYXRlTW92ZT86IGJvb2xlYW4sIHNpbXVsYXRlSW1tZWRpYXRlRW5kPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyBPbmx5IGNhbGwgcHJldmVudERlZmF1bHQoKSB3aGVuIGhhbmRsaW5nIG5vbi1wYXNzaXZlIGV2ZW50cyAocGFzc2l2ZSBldmVudHMgZG9uJ3QgbmVlZCBpdClcclxuICAgIGlmICghQ29tcGF0aWJpbGl0eUhlbHBlci5pc1RvdWNoRXZlbnQoZXZlbnQpICYmICFzdXBwb3J0c1Bhc3NpdmVFdmVudHMpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG5cclxuICAgIC8vIFdlIGhhdmUgdG8gZG8gdGhpcyBpbiBjYXNlIHRoZSBIVE1MIHdoZXJlIHRoZSBzbGlkZXJzIGFyZSBvblxyXG4gICAgLy8gaGF2ZSBiZWVuIGFuaW1hdGVkIGludG8gdmlldy5cclxuICAgIHRoaXMuY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoKTtcclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQocG9pbnRlclR5cGUpKSB7XHJcbiAgICAgIHBvaW50ZXJUeXBlID0gdGhpcy5nZXROZWFyZXN0SGFuZGxlKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPSBwb2ludGVyVHlwZTtcclxuXHJcbiAgICBjb25zdCBwb2ludGVyRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlID0gdGhpcy5nZXRQb2ludGVyRWxlbWVudChwb2ludGVyVHlwZSk7XHJcbiAgICBwb2ludGVyRWxlbWVudC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICBwb2ludGVyRWxlbWVudC5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChiaW5kTW92ZSkge1xyXG4gICAgICB0aGlzLnVuc3Vic2NyaWJlT25Nb3ZlKCk7XHJcblxyXG4gICAgICBjb25zdCBvbk1vdmVDYWxsYmFjazogKChlOiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQpID0+IHZvaWQpID1cclxuICAgICAgICAoZTogTW91c2VFdmVudHxUb3VjaEV2ZW50KTogdm9pZCA9PiB0aGlzLmRyYWdnaW5nLmFjdGl2ZSA/IHRoaXMub25EcmFnTW92ZShlKSA6IHRoaXMub25Nb3ZlKGUpO1xyXG5cclxuICAgICAgaWYgKENvbXBhdGliaWxpdHlIZWxwZXIuaXNUb3VjaEV2ZW50KGV2ZW50KSkge1xyXG4gICAgICAgIHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hQYXNzaXZlRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgIGRvY3VtZW50LCAndG91Y2htb3ZlJywgb25Nb3ZlQ2FsbGJhY2spO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgZG9jdW1lbnQsICdtb3VzZW1vdmUnLCBvbk1vdmVDYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmluZEVuZCkge1xyXG4gICAgICB0aGlzLnVuc3Vic2NyaWJlT25FbmQoKTtcclxuXHJcbiAgICAgIGNvbnN0IG9uRW5kQ2FsbGJhY2s6ICgoZTogTW91c2VFdmVudHxUb3VjaEV2ZW50KSA9PiB2b2lkKSA9XHJcbiAgICAgICAgKGU6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vbkVuZChlKTtcclxuXHJcbiAgICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzVG91Y2hFdmVudChldmVudCkpIHtcclxuICAgICAgICB0aGlzLm9uRW5kRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hQYXNzaXZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ3RvdWNoZW5kJywgb25FbmRDYWxsYmFjayk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vbkVuZEV2ZW50TGlzdGVuZXIgPSB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuYXR0YWNoRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ21vdXNldXAnLCBvbkVuZENhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXNlckNoYW5nZVN0YXJ0LmVtaXQodGhpcy5nZXRDaGFuZ2VDb250ZXh0KCkpO1xyXG5cclxuICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzVG91Y2hFdmVudChldmVudCkgJiYgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKChldmVudCBhcyBUb3VjaEV2ZW50KS5jaGFuZ2VkVG91Y2hlcykpIHtcclxuICAgICAgLy8gU3RvcmUgdGhlIHRvdWNoIGlkZW50aWZpZXJcclxuICAgICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudG91Y2hJZCkpIHtcclxuICAgICAgICB0aGlzLnRvdWNoSWQgPSAoZXZlbnQgYXMgVG91Y2hFdmVudCkuY2hhbmdlZFRvdWNoZXNbMF0uaWRlbnRpZmllcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENsaWNrIGV2ZW50cywgZWl0aGVyIHdpdGggbW91c2Ugb3IgdG91Y2ggZ2VzdHVyZSBhcmUgd2VpcmQuIFNvbWV0aW1lcyB0aGV5IHJlc3VsdCBpbiBmdWxsXHJcbiAgICAvLyBzdGFydCwgbW92ZSwgZW5kIHNlcXVlbmNlLCBhbmQgc29tZXRpbWVzLCB0aGV5IGRvbid0IC0gdGhleSBvbmx5IGludm9rZSBtb3VzZWRvd25cclxuICAgIC8vIEFzIGEgd29ya2Fyb3VuZCwgd2Ugc2ltdWxhdGUgdGhlIGZpcnN0IG1vdmUgZXZlbnQgYW5kIHRoZSBlbmQgZXZlbnQgaWYgaXQncyBuZWNlc3NhcnlcclxuICAgIGlmIChzaW11bGF0ZUltbWVkaWF0ZU1vdmUpIHtcclxuICAgICAgdGhpcy5vbk1vdmUoZXZlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzaW11bGF0ZUltbWVkaWF0ZUVuZCkge1xyXG4gICAgICB0aGlzLm9uRW5kKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIG9uTW92ZSBldmVudCBoYW5kbGVyXHJcbiAgcHJpdmF0ZSBvbk1vdmUoZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCwgZnJvbVRpY2s/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBsZXQgdG91Y2hGb3JUaGlzU2xpZGVyOiBUb3VjaCA9IG51bGw7XHJcblxyXG4gICAgaWYgKENvbXBhdGliaWxpdHlIZWxwZXIuaXNUb3VjaEV2ZW50KGV2ZW50KSkge1xyXG4gICAgICBjb25zdCBjaGFuZ2VkVG91Y2hlczogVG91Y2hMaXN0ID0gKGV2ZW50IGFzIFRvdWNoRXZlbnQpLmNoYW5nZWRUb3VjaGVzO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllciA9PT0gdGhpcy50b3VjaElkKSB7XHJcbiAgICAgICAgICB0b3VjaEZvclRoaXNTbGlkZXIgPSBjaGFuZ2VkVG91Y2hlc1tpXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRvdWNoRm9yVGhpc1NsaWRlcikpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hbmltYXRlICYmICF0aGlzLnZpZXdPcHRpb25zLmFuaW1hdGVPbk1vdmUpIHtcclxuICAgICAgaWYgKHRoaXMubW92aW5nKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgbmV3UG9zOiBudW1iZXIgPSAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodG91Y2hGb3JUaGlzU2xpZGVyKVxyXG4gICAgICA/IHRoaXMuZ2V0RXZlbnRQb3NpdGlvbihldmVudCwgdG91Y2hGb3JUaGlzU2xpZGVyLmlkZW50aWZpZXIpXHJcbiAgICAgIDogdGhpcy5nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcclxuICAgIGxldCBuZXdWYWx1ZTogbnVtYmVyO1xyXG4gICAgY29uc3QgY2VpbFZhbHVlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyB0aGlzLnZpZXdPcHRpb25zLmZsb29yXHJcbiAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLmNlaWw7XHJcbiAgICBjb25zdCBmbG9vclZhbHVlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0ID8gdGhpcy52aWV3T3B0aW9ucy5jZWlsIDogdGhpcy52aWV3T3B0aW9ucy5mbG9vcjtcclxuXHJcbiAgICBpZiAobmV3UG9zIDw9IDApIHtcclxuICAgICAgbmV3VmFsdWUgPSBmbG9vclZhbHVlO1xyXG4gICAgfSBlbHNlIGlmIChuZXdQb3MgPj0gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbikge1xyXG4gICAgICBuZXdWYWx1ZSA9IGNlaWxWYWx1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld1ZhbHVlID0gdGhpcy5wb3NpdGlvblRvVmFsdWUobmV3UG9zKTtcclxuICAgICAgaWYgKGZyb21UaWNrICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwKSkge1xyXG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5yb3VuZFN0ZXAobmV3VmFsdWUsIHRoaXMudmlld09wdGlvbnMudGlja1N0ZXApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5yb3VuZFN0ZXAobmV3VmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnBvc2l0aW9uVHJhY2tpbmdIYW5kbGUobmV3VmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkVuZChldmVudDogTW91c2VFdmVudHxUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoQ29tcGF0aWJpbGl0eUhlbHBlci5pc1RvdWNoRXZlbnQoZXZlbnQpKSB7XHJcbiAgICAgIGNvbnN0IGNoYW5nZWRUb3VjaGVzOiBUb3VjaExpc3QgPSAoZXZlbnQgYXMgVG91Y2hFdmVudCkuY2hhbmdlZFRvdWNoZXM7XHJcbiAgICAgIGlmIChjaGFuZ2VkVG91Y2hlc1swXS5pZGVudGlmaWVyICE9PSB0aGlzLnRvdWNoSWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuYW5pbWF0ZSkge1xyXG4gICAgICB0aGlzLnNsaWRlckVsZW1lbnRBbmltYXRlQ2xhc3MgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG91Y2hJZCA9IG51bGw7XHJcblxyXG4gICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gbnVsbDtcclxuICAgIH1cclxuICAgIHRoaXMuZHJhZ2dpbmcuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy51bnN1YnNjcmliZU9uTW92ZSgpO1xyXG4gICAgdGhpcy51bnN1YnNjcmliZU9uRW5kKCk7XHJcblxyXG4gICAgdGhpcy51c2VyQ2hhbmdlRW5kLmVtaXQodGhpcy5nZXRDaGFuZ2VDb250ZXh0KCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvblBvaW50ZXJGb2N1cyhwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpOiB2b2lkIHtcclxuICAgIGNvbnN0IHBvaW50ZXJFbGVtZW50OiBTbGlkZXJIYW5kbGVEaXJlY3RpdmUgPSB0aGlzLmdldFBvaW50ZXJFbGVtZW50KHBvaW50ZXJUeXBlKTtcclxuICAgIHBvaW50ZXJFbGVtZW50Lm9uKCdibHVyJywgKCk6IHZvaWQgPT4gdGhpcy5vblBvaW50ZXJCbHVyKHBvaW50ZXJFbGVtZW50KSk7XHJcbiAgICBwb2ludGVyRWxlbWVudC5vbigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4gdGhpcy5vbktleWJvYXJkRXZlbnQoZXZlbnQpKTtcclxuICAgIHBvaW50ZXJFbGVtZW50Lm9uKCdrZXl1cCcsICgpOiB2b2lkID0+IHRoaXMub25LZXlVcCgpKTtcclxuICAgIHBvaW50ZXJFbGVtZW50LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gcG9pbnRlclR5cGU7XHJcbiAgICB0aGlzLmN1cnJlbnRGb2N1c1BvaW50ZXIgPSBwb2ludGVyVHlwZTtcclxuICAgIHRoaXMuZmlyc3RLZXlEb3duID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25LZXlVcCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZmlyc3RLZXlEb3duID0gdHJ1ZTtcclxuICAgIHRoaXMudXNlckNoYW5nZUVuZC5lbWl0KHRoaXMuZ2V0Q2hhbmdlQ29udGV4dCgpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25Qb2ludGVyQmx1cihwb2ludGVyOiBTbGlkZXJIYW5kbGVEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgIHBvaW50ZXIub2ZmKCdibHVyJyk7XHJcbiAgICBwb2ludGVyLm9mZigna2V5ZG93bicpO1xyXG4gICAgcG9pbnRlci5vZmYoJ2tleXVwJyk7XHJcbiAgICBwb2ludGVyLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudG91Y2hJZCkpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gbnVsbDtcclxuICAgICAgdGhpcy5jdXJyZW50Rm9jdXNQb2ludGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0S2V5QWN0aW9ucyhjdXJyZW50VmFsdWU6IG51bWJlcik6IHtba2V5OiBzdHJpbmddOiBudW1iZXJ9IHtcclxuICAgIGNvbnN0IHZhbHVlUmFuZ2U6IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMuY2VpbCAtIHRoaXMudmlld09wdGlvbnMuZmxvb3I7XHJcblxyXG4gICAgbGV0IGluY3JlYXNlU3RlcDogbnVtYmVyID0gY3VycmVudFZhbHVlICsgdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgbGV0IGRlY3JlYXNlU3RlcDogbnVtYmVyID0gY3VycmVudFZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgbGV0IGluY3JlYXNlUGFnZTogbnVtYmVyID0gY3VycmVudFZhbHVlICsgdmFsdWVSYW5nZSAvIDEwO1xyXG4gICAgbGV0IGRlY3JlYXNlUGFnZTogbnVtYmVyID0gY3VycmVudFZhbHVlIC0gdmFsdWVSYW5nZSAvIDEwO1xyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJldmVyc2VkQ29udHJvbHMpIHtcclxuICAgICAgaW5jcmVhc2VTdGVwID0gY3VycmVudFZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgICBkZWNyZWFzZVN0ZXAgPSBjdXJyZW50VmFsdWUgKyB0aGlzLnZpZXdPcHRpb25zLnN0ZXA7XHJcbiAgICAgIGluY3JlYXNlUGFnZSA9IGN1cnJlbnRWYWx1ZSAtIHZhbHVlUmFuZ2UgLyAxMDtcclxuICAgICAgZGVjcmVhc2VQYWdlID0gY3VycmVudFZhbHVlICsgdmFsdWVSYW5nZSAvIDEwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExlZnQgdG8gcmlnaHQgZGVmYXVsdCBhY3Rpb25zXHJcbiAgICBjb25zdCBhY3Rpb25zOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHtcclxuICAgICAgVVA6IGluY3JlYXNlU3RlcCxcclxuICAgICAgRE9XTjogZGVjcmVhc2VTdGVwLFxyXG4gICAgICBMRUZUOiBkZWNyZWFzZVN0ZXAsXHJcbiAgICAgIFJJR0hUOiBpbmNyZWFzZVN0ZXAsXHJcbiAgICAgIFBBR0VVUDogaW5jcmVhc2VQYWdlLFxyXG4gICAgICBQQUdFRE9XTjogZGVjcmVhc2VQYWdlLFxyXG4gICAgICBIT01FOiB0aGlzLnZpZXdPcHRpb25zLnJldmVyc2VkQ29udHJvbHMgPyB0aGlzLnZpZXdPcHRpb25zLmNlaWwgOiB0aGlzLnZpZXdPcHRpb25zLmZsb29yLFxyXG4gICAgICBFTkQ6IHRoaXMudmlld09wdGlvbnMucmV2ZXJzZWRDb250cm9scyA/IHRoaXMudmlld09wdGlvbnMuZmxvb3IgOiB0aGlzLnZpZXdPcHRpb25zLmNlaWwsXHJcbiAgICB9O1xyXG4gICAgLy8gcmlnaHQgdG8gbGVmdCBtZWFucyBzd2FwcGluZyByaWdodCBhbmQgbGVmdCBhcnJvd3NcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIGFjdGlvbnMuTEVGVCA9IGluY3JlYXNlU3RlcDtcclxuICAgICAgYWN0aW9ucy5SSUdIVCA9IGRlY3JlYXNlU3RlcDtcclxuICAgICAgLy8gcmlnaHQgdG8gbGVmdCBhbmQgdmVydGljYWwgbWVhbnMgd2UgYWxzbyBzd2FwIHVwIGFuZCBkb3duXHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSB7XHJcbiAgICAgICAgYWN0aW9ucy5VUCA9IGRlY3JlYXNlU3RlcDtcclxuICAgICAgICBhY3Rpb25zLkRPV04gPSBpbmNyZWFzZVN0ZXA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhY3Rpb25zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbktleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogbnVtYmVyID0gdGhpcy5nZXRDdXJyZW50VHJhY2tpbmdWYWx1ZSgpO1xyXG4gICAgY29uc3Qga2V5Q29kZTogbnVtYmVyID0gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50LmtleUNvZGUpXHJcbiAgICAgID8gZXZlbnQua2V5Q29kZVxyXG4gICAgICA6IGV2ZW50LndoaWNoO1xyXG4gICAgY29uc3Qga2V5czoge1trZXlDb2RlOiBudW1iZXJdOiBzdHJpbmd9ID0ge1xyXG4gICAgICAgIDM4OiAnVVAnLFxyXG4gICAgICAgIDQwOiAnRE9XTicsXHJcbiAgICAgICAgMzc6ICdMRUZUJyxcclxuICAgICAgICAzOTogJ1JJR0hUJyxcclxuICAgICAgICAzMzogJ1BBR0VVUCcsXHJcbiAgICAgICAgMzQ6ICdQQUdFRE9XTicsXHJcbiAgICAgICAgMzY6ICdIT01FJyxcclxuICAgICAgICAzNTogJ0VORCcsXHJcbiAgICAgIH07XHJcbiAgICBjb25zdCBhY3Rpb25zOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHRoaXMuZ2V0S2V5QWN0aW9ucyhjdXJyZW50VmFsdWUpO1xyXG4gICAgY29uc3Qga2V5OiBzdHJpbmcgPSBrZXlzW2tleUNvZGVdO1xyXG4gICAgY29uc3QgYWN0aW9uOiBudW1iZXIgPSBhY3Rpb25zW2tleV07XHJcblxyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGFjdGlvbikgfHwgVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmICh0aGlzLmZpcnN0S2V5RG93bikge1xyXG4gICAgICB0aGlzLmZpcnN0S2V5RG93biA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VTdGFydC5lbWl0KHRoaXMuZ2V0Q2hhbmdlQ29udGV4dCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3Rpb25WYWx1ZTogbnVtYmVyID0gTWF0aEhlbHBlci5jbGFtcFRvUmFuZ2UoYWN0aW9uLCB0aGlzLnZpZXdPcHRpb25zLmZsb29yLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpO1xyXG4gICAgY29uc3QgbmV3VmFsdWU6IG51bWJlciA9IHRoaXMucm91bmRTdGVwKGFjdGlvblZhbHVlKTtcclxuICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5kcmFnZ2FibGVSYW5nZU9ubHkpIHtcclxuICAgICAgdGhpcy5wb3NpdGlvblRyYWNraW5nSGFuZGxlKG5ld1ZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGRpZmZlcmVuY2U6IG51bWJlciA9IHRoaXMudmlld0hpZ2hWYWx1ZSAtIHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgICBsZXQgbmV3TWluVmFsdWU6IG51bWJlcjtcclxuICAgICAgbGV0IG5ld01heFZhbHVlOiBudW1iZXI7XHJcblxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICBuZXdNaW5WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIG5ld01heFZhbHVlID0gbmV3VmFsdWUgKyBkaWZmZXJlbmNlO1xyXG4gICAgICAgIGlmIChuZXdNYXhWYWx1ZSA+IHRoaXMudmlld09wdGlvbnMuY2VpbCkge1xyXG4gICAgICAgICAgbmV3TWF4VmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLmNlaWw7XHJcbiAgICAgICAgICBuZXdNaW5WYWx1ZSA9IG5ld01heFZhbHVlIC0gZGlmZmVyZW5jZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgICBuZXdNYXhWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIG5ld01pblZhbHVlID0gbmV3VmFsdWUgLSBkaWZmZXJlbmNlO1xyXG4gICAgICAgIGlmIChuZXdNaW5WYWx1ZSA8IHRoaXMudmlld09wdGlvbnMuZmxvb3IpIHtcclxuICAgICAgICAgIG5ld01pblZhbHVlID0gdGhpcy52aWV3T3B0aW9ucy5mbG9vcjtcclxuICAgICAgICAgIG5ld01heFZhbHVlID0gbmV3TWluVmFsdWUgKyBkaWZmZXJlbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnBvc2l0aW9uVHJhY2tpbmdCYXIobmV3TWluVmFsdWUsIG5ld01heFZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIG9uRHJhZ1N0YXJ0IGV2ZW50IGhhbmRsZXIsIGhhbmRsZXMgZHJhZ2dpbmcgb2YgdGhlIG1pZGRsZSBiYXJcclxuICBwcml2YXRlIG9uRHJhZ1N0YXJ0KHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSwgZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCxcclxuICAgIGJpbmRNb3ZlOiBib29sZWFuLCBiaW5kRW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID0gdGhpcy5nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcclxuXHJcbiAgICB0aGlzLmRyYWdnaW5nID0gbmV3IERyYWdnaW5nKCk7XHJcbiAgICB0aGlzLmRyYWdnaW5nLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB0aGlzLmRyYWdnaW5nLnZhbHVlID0gdGhpcy5wb3NpdGlvblRvVmFsdWUocG9zaXRpb24pO1xyXG4gICAgdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlID0gdGhpcy52aWV3SGlnaFZhbHVlIC0gdGhpcy52aWV3TG93VmFsdWU7XHJcbiAgICB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0ID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uIC0gcG9zaXRpb25cclxuICAgICAgICA6IHBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uO1xyXG4gICAgdGhpcy5kcmFnZ2luZy5oaWdoTGltaXQgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyBwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlRWxlbWVudC5wb3NpdGlvblxyXG4gICAgICAgIDogdGhpcy5tYXhIYW5kbGVFbGVtZW50LnBvc2l0aW9uIC0gcG9zaXRpb247XHJcblxyXG4gICAgdGhpcy5vblN0YXJ0KHBvaW50ZXJUeXBlLCBldmVudCwgYmluZE1vdmUsIGJpbmRFbmQpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCBtaW4gdmFsdWUgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIG5ld1BvcyBpcyBvdXRPZkJvdW5kcyBhYm92ZSBvciBiZWxvdyB0aGUgYmFyIGFuZCByaWdodFRvTGVmdCAqL1xyXG4gIHByaXZhdGUgZ2V0TWluVmFsdWUobmV3UG9zOiBudW1iZXIsIG91dE9mQm91bmRzOiBib29sZWFuLCBpc0Fib3ZlOiBib29sZWFuKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGlzUlRMOiBib29sZWFuID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdDtcclxuICAgIGxldCB2YWx1ZTogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgICBpZiAob3V0T2ZCb3VuZHMpIHtcclxuICAgICAgaWYgKGlzQWJvdmUpIHtcclxuICAgICAgICB2YWx1ZSA9IGlzUlRMXHJcbiAgICAgICAgICA/IHRoaXMudmlld09wdGlvbnMuZmxvb3JcclxuICAgICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5jZWlsIC0gdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gaXNSVExcclxuICAgICAgICAgID8gdGhpcy52aWV3T3B0aW9ucy5jZWlsIC0gdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlXHJcbiAgICAgICAgICA6IHRoaXMudmlld09wdGlvbnMuZmxvb3I7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhbHVlID0gaXNSVExcclxuICAgICAgICA/IHRoaXMucG9zaXRpb25Ub1ZhbHVlKG5ld1BvcyArIHRoaXMuZHJhZ2dpbmcubG93TGltaXQpXHJcbiAgICAgICAgOiB0aGlzLnBvc2l0aW9uVG9WYWx1ZShuZXdQb3MgLSB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnJvdW5kU3RlcCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IG1heCB2YWx1ZSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgbmV3UG9zIGlzIG91dE9mQm91bmRzIGFib3ZlIG9yIGJlbG93IHRoZSBiYXIgYW5kIHJpZ2h0VG9MZWZ0ICovXHJcbiAgcHJpdmF0ZSBnZXRNYXhWYWx1ZShuZXdQb3M6IG51bWJlciwgb3V0T2ZCb3VuZHM6IGJvb2xlYW4sIGlzQWJvdmU6IGJvb2xlYW4pOiBudW1iZXIge1xyXG4gICAgY29uc3QgaXNSVEw6IGJvb2xlYW4gPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0O1xyXG4gICAgbGV0IHZhbHVlOiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAgIGlmIChvdXRPZkJvdW5kcykge1xyXG4gICAgICBpZiAoaXNBYm92ZSkge1xyXG4gICAgICAgIHZhbHVlID0gaXNSVExcclxuICAgICAgICAgID8gdGhpcy52aWV3T3B0aW9ucy5mbG9vciArIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZVxyXG4gICAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLmNlaWw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWUgPSBpc1JUTFxyXG4gICAgICAgICAgPyB0aGlzLnZpZXdPcHRpb25zLmNlaWxcclxuICAgICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5mbG9vciArIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGlzUlRMKSB7XHJcbiAgICAgICAgdmFsdWUgPVxyXG4gICAgICAgICAgdGhpcy5wb3NpdGlvblRvVmFsdWUobmV3UG9zICsgdGhpcy5kcmFnZ2luZy5sb3dMaW1pdCkgK1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID1cclxuICAgICAgICAgIHRoaXMucG9zaXRpb25Ub1ZhbHVlKG5ld1BvcyAtIHRoaXMuZHJhZ2dpbmcubG93TGltaXQpICtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnJvdW5kU3RlcCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uRHJhZ01vdmUoZXZlbnQ/OiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IG5ld1BvczogbnVtYmVyID0gdGhpcy5nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hbmltYXRlICYmICF0aGlzLnZpZXdPcHRpb25zLmFuaW1hdGVPbk1vdmUpIHtcclxuICAgICAgaWYgKHRoaXMubW92aW5nKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IHRydWU7XHJcblxyXG4gICAgbGV0IGNlaWxMaW1pdDogbnVtYmVyLFxyXG4gICAgICAgIGZsb29yTGltaXQ6IG51bWJlcixcclxuICAgICAgICBmbG9vckhhbmRsZUVsZW1lbnQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZSxcclxuICAgICAgICBjZWlsSGFuZGxlRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlO1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgY2VpbExpbWl0ID0gdGhpcy5kcmFnZ2luZy5sb3dMaW1pdDtcclxuICAgICAgZmxvb3JMaW1pdCA9IHRoaXMuZHJhZ2dpbmcuaGlnaExpbWl0O1xyXG4gICAgICBmbG9vckhhbmRsZUVsZW1lbnQgPSB0aGlzLm1heEhhbmRsZUVsZW1lbnQ7XHJcbiAgICAgIGNlaWxIYW5kbGVFbGVtZW50ID0gdGhpcy5taW5IYW5kbGVFbGVtZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2VpbExpbWl0ID0gdGhpcy5kcmFnZ2luZy5oaWdoTGltaXQ7XHJcbiAgICAgIGZsb29yTGltaXQgPSB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0O1xyXG4gICAgICBmbG9vckhhbmRsZUVsZW1lbnQgPSB0aGlzLm1pbkhhbmRsZUVsZW1lbnQ7XHJcbiAgICAgIGNlaWxIYW5kbGVFbGVtZW50ID0gdGhpcy5tYXhIYW5kbGVFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlzVW5kZXJGbG9vckxpbWl0OiBib29sZWFuID0gKG5ld1BvcyA8PSBmbG9vckxpbWl0KTtcclxuICAgIGNvbnN0IGlzT3ZlckNlaWxMaW1pdDogYm9vbGVhbiA9IChuZXdQb3MgPj0gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbiAtIGNlaWxMaW1pdCk7XHJcblxyXG4gICAgbGV0IG5ld01pblZhbHVlOiBudW1iZXI7XHJcbiAgICBsZXQgbmV3TWF4VmFsdWU6IG51bWJlcjtcclxuICAgIGlmIChpc1VuZGVyRmxvb3JMaW1pdCkge1xyXG4gICAgICBpZiAoZmxvb3JIYW5kbGVFbGVtZW50LnBvc2l0aW9uID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIG5ld01pblZhbHVlID0gdGhpcy5nZXRNaW5WYWx1ZShuZXdQb3MsIHRydWUsIGZhbHNlKTtcclxuICAgICAgbmV3TWF4VmFsdWUgPSB0aGlzLmdldE1heFZhbHVlKG5ld1BvcywgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGlmIChpc092ZXJDZWlsTGltaXQpIHtcclxuICAgICAgaWYgKGNlaWxIYW5kbGVFbGVtZW50LnBvc2l0aW9uID09PSB0aGlzLm1heEhhbmRsZVBvc2l0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIG5ld01heFZhbHVlID0gdGhpcy5nZXRNYXhWYWx1ZShuZXdQb3MsIHRydWUsIHRydWUpO1xyXG4gICAgICBuZXdNaW5WYWx1ZSA9IHRoaXMuZ2V0TWluVmFsdWUobmV3UG9zLCB0cnVlLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld01pblZhbHVlID0gdGhpcy5nZXRNaW5WYWx1ZShuZXdQb3MsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgIG5ld01heFZhbHVlID0gdGhpcy5nZXRNYXhWYWx1ZShuZXdQb3MsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb3NpdGlvblRyYWNraW5nQmFyKG5ld01pblZhbHVlLCBuZXdNYXhWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdGhlIG5ldyB2YWx1ZSBhbmQgcG9zaXRpb24gZm9yIHRoZSBlbnRpcmUgYmFyXHJcbiAgcHJpdmF0ZSBwb3NpdGlvblRyYWNraW5nQmFyKG5ld01pblZhbHVlOiBudW1iZXIsIG5ld01heFZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5taW5MaW1pdCkgJiZcclxuICAgICAgICBuZXdNaW5WYWx1ZSA8IHRoaXMudmlld09wdGlvbnMubWluTGltaXQpIHtcclxuICAgICAgbmV3TWluVmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLm1pbkxpbWl0O1xyXG4gICAgICBuZXdNYXhWYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KG5ld01pblZhbHVlICsgdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgIH1cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5tYXhMaW1pdCkgJiZcclxuICAgICAgICBuZXdNYXhWYWx1ZSA+IHRoaXMudmlld09wdGlvbnMubWF4TGltaXQpIHtcclxuICAgICAgbmV3TWF4VmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLm1heExpbWl0O1xyXG4gICAgICBuZXdNaW5WYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KG5ld01heFZhbHVlIC0gdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXdMb3dWYWx1ZSA9IG5ld01pblZhbHVlO1xyXG4gICAgdGhpcy52aWV3SGlnaFZhbHVlID0gbmV3TWF4VmFsdWU7XHJcbiAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgdGhpcy51cGRhdGVIYW5kbGVzKFBvaW50ZXJUeXBlLk1pbiwgdGhpcy52YWx1ZVRvUG9zaXRpb24obmV3TWluVmFsdWUpKTtcclxuICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKG5ld01heFZhbHVlKSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdGhlIG5ldyB2YWx1ZSBhbmQgcG9zaXRpb24gdG8gdGhlIGN1cnJlbnQgdHJhY2tpbmcgaGFuZGxlXHJcbiAgcHJpdmF0ZSBwb3NpdGlvblRyYWNraW5nSGFuZGxlKG5ld1ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIG5ld1ZhbHVlID0gdGhpcy5hcHBseU1pbk1heExpbWl0KG5ld1ZhbHVlKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnB1c2hSYW5nZSkge1xyXG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5hcHBseVB1c2hSYW5nZShuZXdWYWx1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMubm9Td2l0Y2hpbmcpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbiAmJlxyXG4gICAgICAgICAgICAgIG5ld1ZhbHVlID4gdGhpcy52aWV3SGlnaFZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5hcHBseU1pbk1heFJhbmdlKHRoaXMudmlld0hpZ2hWYWx1ZSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlIDwgdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmFwcGx5TWluTWF4UmFuZ2UodGhpcy52aWV3TG93VmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuYXBwbHlNaW5NYXhSYW5nZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgLyogVGhpcyBpcyB0byBjaGVjayBpZiB3ZSBuZWVkIHRvIHN3aXRjaCB0aGUgbWluIGFuZCBtYXggaGFuZGxlcyAqL1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbiAmJiBuZXdWYWx1ZSA+IHRoaXMudmlld0hpZ2hWYWx1ZSkge1xyXG4gICAgICAgICAgdGhpcy52aWV3TG93VmFsdWUgPSB0aGlzLnZpZXdIaWdoVmFsdWU7XHJcbiAgICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVzKFBvaW50ZXJUeXBlLk1pbiwgdGhpcy5tYXhIYW5kbGVFbGVtZW50LnBvc2l0aW9uKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlQXJpYUF0dHJpYnV0ZXMoKTtcclxuICAgICAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9IFBvaW50ZXJUeXBlLk1heDtcclxuICAgICAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMua2V5Ym9hcmRTdXBwb3J0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXggJiZcclxuICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlIDwgdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbik7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPSBQb2ludGVyVHlwZS5NaW47XHJcbiAgICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5nZXRDdXJyZW50VHJhY2tpbmdWYWx1ZSgpICE9PSBuZXdWYWx1ZSkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICB0aGlzLnZpZXdMb3dWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuYXBwbHlWaWV3Q2hhbmdlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKG5ld1ZhbHVlKSk7XHJcbiAgICAgIHRoaXMudXBkYXRlQXJpYUF0dHJpYnV0ZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlNaW5NYXhMaW1pdChuZXdWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5taW5MaW1pdCkgJiYgbmV3VmFsdWUgPCB0aGlzLnZpZXdPcHRpb25zLm1pbkxpbWl0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLm1pbkxpbWl0O1xyXG4gICAgfVxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLm1heExpbWl0KSAmJiBuZXdWYWx1ZSA+IHRoaXMudmlld09wdGlvbnMubWF4TGltaXQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMubWF4TGltaXQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmFsdWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5TWluTWF4UmFuZ2UobmV3VmFsdWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBvcHBvc2l0ZVZhbHVlOiBudW1iZXIgPSAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pXHJcbiAgICAgID8gdGhpcy52aWV3SGlnaFZhbHVlXHJcbiAgICAgIDogdGhpcy52aWV3TG93VmFsdWU7XHJcbiAgICBjb25zdCBkaWZmZXJlbmNlOiBudW1iZXIgPSBNYXRoLmFicyhuZXdWYWx1ZSAtIG9wcG9zaXRlVmFsdWUpO1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlKSkge1xyXG4gICAgICBpZiAoZGlmZmVyZW5jZSA8IHRoaXMudmlld09wdGlvbnMubWluUmFuZ2UpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICAgIHJldHVybiBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdCh0aGlzLnZpZXdIaWdoVmFsdWUgLSB0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgICByZXR1cm4gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQodGhpcy52aWV3TG93VmFsdWUgKyB0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5tYXhSYW5nZSkpIHtcclxuICAgICAgaWYgKGRpZmZlcmVuY2UgPiB0aGlzLnZpZXdPcHRpb25zLm1heFJhbmdlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgICByZXR1cm4gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQodGhpcy52aWV3SGlnaFZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5tYXhSYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICAgICAgcmV0dXJuIE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0xvd1ZhbHVlICsgdGhpcy52aWV3T3B0aW9ucy5tYXhSYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmFsdWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5UHVzaFJhbmdlKG5ld1ZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3QgZGlmZmVyZW5jZTogbnVtYmVyID0gKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKVxyXG4gICAgICAgICAgPyB0aGlzLnZpZXdIaWdoVmFsdWUgLSBuZXdWYWx1ZVxyXG4gICAgICAgICAgOiBuZXdWYWx1ZSAtIHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgY29uc3QgbWluUmFuZ2U6IG51bWJlciA9ICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5taW5SYW5nZSkpXHJcbiAgICAgICAgICA/IHRoaXMudmlld09wdGlvbnMubWluUmFuZ2VcclxuICAgICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgY29uc3QgbWF4UmFuZ2U6IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMubWF4UmFuZ2U7XHJcbiAgICAvLyBpZiBzbWFsbGVyIHRoYW4gbWluUmFuZ2VcclxuICAgIGlmIChkaWZmZXJlbmNlIDwgbWluUmFuZ2UpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgdGhpcy52aWV3SGlnaFZhbHVlID0gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQoXHJcbiAgICAgICAgICBNYXRoLm1pbihuZXdWYWx1ZSArIG1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICBuZXdWYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0hpZ2hWYWx1ZSAtIG1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSkpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgdGhpcy52aWV3TG93VmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChcclxuICAgICAgICAgIE1hdGgubWF4KG5ld1ZhbHVlIC0gbWluUmFuZ2UsIHRoaXMudmlld09wdGlvbnMuZmxvb3IpLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICBuZXdWYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0xvd1ZhbHVlICsgbWluUmFuZ2UsIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXQpO1xyXG4gICAgICAgIHRoaXMuYXBwbHlWaWV3Q2hhbmdlKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVzKFBvaW50ZXJUeXBlLk1pbiwgdGhpcy52YWx1ZVRvUG9zaXRpb24odGhpcy52aWV3TG93VmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcbiAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChtYXhSYW5nZSkgJiYgZGlmZmVyZW5jZSA+IG1heFJhbmdlKSB7XHJcbiAgICAgIC8vIGlmIGdyZWF0ZXIgdGhhbiBtYXhSYW5nZVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChuZXdWYWx1ZSArIG1heFJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSlcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgdGhpcy52aWV3TG93VmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChuZXdWYWx1ZSAtIG1heFJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NaW4sIHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0xvd1ZhbHVlKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVBcmlhQXR0cmlidXRlcygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDaGFuZ2VDb250ZXh0KCk6IENoYW5nZUNvbnRleHQge1xyXG4gICAgY29uc3QgY2hhbmdlQ29udGV4dDogQ2hhbmdlQ29udGV4dCA9IG5ldyBDaGFuZ2VDb250ZXh0KCk7XHJcbiAgICBjaGFuZ2VDb250ZXh0LnBvaW50ZXJUeXBlID0gdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyO1xyXG4gICAgY2hhbmdlQ29udGV4dC52YWx1ZSA9ICt0aGlzLnZhbHVlO1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgY2hhbmdlQ29udGV4dC5oaWdoVmFsdWUgPSArdGhpcy5oaWdoVmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbmdlQ29udGV4dDtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBJbnB1dCwgVGVtcGxhdGVSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LXNsaWRlci10b29sdGlwLXdyYXBwZXInLFxyXG4gIHRlbXBsYXRlOiBgPG5nLWNvbnRhaW5lciAqbmdJZj1cInRlbXBsYXRlXCI+XHJcbiAgPG5nLXRlbXBsYXRlICpuZ1RlbXBsYXRlT3V0bGV0PVwidGVtcGxhdGU7IGNvbnRleHQ6IHt0b29sdGlwOiB0b29sdGlwLCBwbGFjZW1lbnQ6IHBsYWNlbWVudCwgY29udGVudDogY29udGVudH1cIj48L25nLXRlbXBsYXRlPlxyXG48L25nLWNvbnRhaW5lcj5cclxuXHJcbjxuZy1jb250YWluZXIgKm5nSWY9XCIhdGVtcGxhdGVcIj5cclxuICA8ZGl2IGNsYXNzPVwibmd4LXNsaWRlci1pbm5lci10b29sdGlwXCIgW2F0dHIudGl0bGVdPVwidG9vbHRpcFwiIFthdHRyLmRhdGEtdG9vbHRpcC1wbGFjZW1lbnRdPVwicGxhY2VtZW50XCI+XHJcbiAgICB7e2NvbnRlbnR9fVxyXG4gIDwvZGl2PlxyXG48L25nLWNvbnRhaW5lcj5gLFxyXG4gIHN0eWxlczogW2Aubmd4LXNsaWRlci1pbm5lci10b29sdGlwe2hlaWdodDoxMDAlfWBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUb29sdGlwV3JhcHBlckNvbXBvbmVudCB7XHJcbiAgQElucHV0KClcclxuICB0ZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcclxuXHJcbiAgQElucHV0KClcclxuICB0b29sdGlwOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcGxhY2VtZW50OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29udGVudDogc3RyaW5nO1xyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IFNsaWRlckNvbXBvbmVudCB9IGZyb20gJy4vc2xpZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNsaWRlckVsZW1lbnREaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1lbGVtZW50LmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IFNsaWRlckhhbmRsZURpcmVjdGl2ZSB9IGZyb20gJy4vc2xpZGVyLWhhbmRsZS5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBTbGlkZXJMYWJlbERpcmVjdGl2ZSB9IGZyb20gJy4vc2xpZGVyLWxhYmVsLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IFRvb2x0aXBXcmFwcGVyQ29tcG9uZW50IH0gZnJvbSAnLi90b29sdGlwLXdyYXBwZXIuY29tcG9uZW50JztcclxuXHJcbi8qKlxyXG4gKiBOZ3hTbGlkZXIgbW9kdWxlXHJcbiAqXHJcbiAqIFRoZSBtb2R1bGUgZXhwb3J0cyB0aGUgc2xpZGVyIGNvbXBvbmVudFxyXG4gKi9cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgU2xpZGVyQ29tcG9uZW50LFxyXG4gICAgU2xpZGVyRWxlbWVudERpcmVjdGl2ZSxcclxuICAgIFNsaWRlckhhbmRsZURpcmVjdGl2ZSxcclxuICAgIFNsaWRlckxhYmVsRGlyZWN0aXZlLFxyXG4gICAgVG9vbHRpcFdyYXBwZXJDb21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFNsaWRlckNvbXBvbmVudFxyXG4gIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNsaWRlck1vZHVsZSB7IH1cclxuIl0sIm5hbWVzIjpbInN1cHBvcnRzUGFzc2l2ZUV2ZW50cyIsIlN1YmplY3QiLCJ0aHJvdHRsZVRpbWUiLCJ0YXAiLCJ0c2xpYl8xLl9fdmFsdWVzIiwiRGlyZWN0aXZlIiwiRWxlbWVudFJlZiIsIlJlbmRlcmVyMiIsIkNoYW5nZURldGVjdG9yUmVmIiwiSG9zdEJpbmRpbmciLCJ0c2xpYl8xLl9fZXh0ZW5kcyIsIk5HX1ZBTFVFX0FDQ0VTU09SIiwiZm9yd2FyZFJlZiIsIkV2ZW50RW1pdHRlciIsImRpc3RpbmN0VW50aWxDaGFuZ2VkIiwiZmlsdGVyIiwiQ29tcG9uZW50IiwiTmdab25lIiwiSW5wdXQiLCJPdXRwdXQiLCJWaWV3Q2hpbGQiLCJDb250ZW50Q2hpbGQiLCJIb3N0TGlzdGVuZXIiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0lBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY0E7SUFFQSxJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYztTQUNwQyxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUUsWUFBWSxLQUFLLElBQUksVUFBVSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUM1RSxVQUFVLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQUUsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUUvRSx1QkFBMEIsQ0FBQyxFQUFFLENBQUM7UUFDMUIsYUFBYSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNwQixnQkFBZ0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtRQUN2QyxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7QUFFRCxzQkEwRXlCLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsT0FBTyxNQUFNLEtBQUssVUFBVSxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUM7WUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENB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
