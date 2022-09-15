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
import * as tslib_1 from 'tslib';
import {
  Component,
  ViewChild,
  HostBinding,
  HostListener,
  Input,
  ElementRef,
  Renderer2,
  EventEmitter,
  Output,
  ContentChild,
  TemplateRef,
  ChangeDetectorRef,
  forwardRef,
  NgZone,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { supportsPassiveEvents } from 'detect-passive-events';
import { Options, LabelType } from './options';
import { PointerType } from './pointer-type';
import { ChangeContext } from './change-context';
import { ValueHelper } from './value-helper';
import { CompatibilityHelper } from './compatibility-helper';
import { MathHelper } from './math-helper';
import { EventListenerHelper } from './event-listener-helper';
import { SliderElementDirective } from './slider-element.directive';
import { SliderHandleDirective } from './slider-handle.directive';
import { SliderLabelDirective } from './slider-label.directive';
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
export { Tick };
if (false) {
  /** @type {?} */
  Tick.prototype.selected;
  /** @type {?} */
  Tick.prototype.style;
  /** @type {?} */
  Tick.prototype.tooltip;
  /** @type {?} */
  Tick.prototype.tooltipPlacement;
  /** @type {?} */
  Tick.prototype.value;
  /** @type {?} */
  Tick.prototype.valueTooltip;
  /** @type {?} */
  Tick.prototype.valueTooltipPlacement;
  /** @type {?} */
  Tick.prototype.legend;
}
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
if (false) {
  /** @type {?} */
  Dragging.prototype.active;
  /** @type {?} */
  Dragging.prototype.value;
  /** @type {?} */
  Dragging.prototype.difference;
  /** @type {?} */
  Dragging.prototype.position;
  /** @type {?} */
  Dragging.prototype.lowLimit;
  /** @type {?} */
  Dragging.prototype.highLimit;
}
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
if (false) {
  /** @type {?} */
  ModelValues.prototype.value;
  /** @type {?} */
  ModelValues.prototype.highValue;
}
var ModelChange = /** @class */ (function (_super) {
  tslib_1.__extends(ModelChange, _super);
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
if (false) {
  /** @type {?} */
  ModelChange.prototype.forceChange;
}
var InputModelChange = /** @class */ (function (_super) {
  tslib_1.__extends(InputModelChange, _super);
  function InputModelChange() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return InputModelChange;
})(ModelChange);
if (false) {
  /** @type {?} */
  InputModelChange.prototype.internalChange;
}
var OutputModelChange = /** @class */ (function (_super) {
  tslib_1.__extends(OutputModelChange, _super);
  function OutputModelChange() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  return OutputModelChange;
})(ModelChange);
if (false) {
  /** @type {?} */
  OutputModelChange.prototype.userEventInitiated;
}
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
      console.log('ngAfterViewInit slider.component.js');
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
          var _a = tslib_1.__values(this.getAllSliderElements()),
            _b = _a.next();
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
          var _a = tslib_1.__values(this.getAllSliderElements()),
            _b = _a.next();
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
          var _a = tslib_1.__values(this.getAllSliderElements()),
            _b = _a.next();
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
          var _a = tslib_1.__values(this.getAllSliderElements()),
            _b = _a.next();
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
export { SliderComponent };
if (false) {
  /** @type {?} */
  SliderComponent.prototype.value;
  /** @type {?} */
  SliderComponent.prototype.valueChange;
  /** @type {?} */
  SliderComponent.prototype.highValue;
  /** @type {?} */
  SliderComponent.prototype.highValueChange;
  /** @type {?} */
  SliderComponent.prototype.options;
  /** @type {?} */
  SliderComponent.prototype.userChangeStart;
  /** @type {?} */
  SliderComponent.prototype.userChange;
  /** @type {?} */
  SliderComponent.prototype.userChangeEnd;
  /** @type {?} */
  SliderComponent.prototype.manualRefreshSubscription;
  /** @type {?} */
  SliderComponent.prototype.triggerFocusSubscription;
  /** @type {?} */
  SliderComponent.prototype.initHasRun;
  /** @type {?} */
  SliderComponent.prototype.inputModelChangeSubject;
  /** @type {?} */
  SliderComponent.prototype.inputModelChangeSubscription;
  /** @type {?} */
  SliderComponent.prototype.outputModelChangeSubject;
  /** @type {?} */
  SliderComponent.prototype.outputModelChangeSubscription;
  /** @type {?} */
  SliderComponent.prototype.viewLowValue;
  /** @type {?} */
  SliderComponent.prototype.viewHighValue;
  /** @type {?} */
  SliderComponent.prototype.viewOptions;
  /** @type {?} */
  SliderComponent.prototype.handleHalfDimension;
  /** @type {?} */
  SliderComponent.prototype.maxHandlePosition;
  /** @type {?} */
  SliderComponent.prototype.currentTrackingPointer;
  /** @type {?} */
  SliderComponent.prototype.currentFocusPointer;
  /** @type {?} */
  SliderComponent.prototype.firstKeyDown;
  /** @type {?} */
  SliderComponent.prototype.touchId;
  /** @type {?} */
  SliderComponent.prototype.dragging;
  /** @type {?} */
  SliderComponent.prototype.leftOuterSelectionBarElement;
  /** @type {?} */
  SliderComponent.prototype.rightOuterSelectionBarElement;
  /** @type {?} */
  SliderComponent.prototype.fullBarElement;
  /** @type {?} */
  SliderComponent.prototype.selectionBarElement;
  /** @type {?} */
  SliderComponent.prototype.minHandleElement;
  /** @type {?} */
  SliderComponent.prototype.maxHandleElement;
  /** @type {?} */
  SliderComponent.prototype.floorLabelElement;
  /** @type {?} */
  SliderComponent.prototype.ceilLabelElement;
  /** @type {?} */
  SliderComponent.prototype.minHandleLabelElement;
  /** @type {?} */
  SliderComponent.prototype.maxHandleLabelElement;
  /** @type {?} */
  SliderComponent.prototype.combinedLabelElement;
  /** @type {?} */
  SliderComponent.prototype.ticksElement;
  /** @type {?} */
  SliderComponent.prototype.tooltipTemplate;
  /** @type {?} */
  SliderComponent.prototype.sliderElementVerticalClass;
  /** @type {?} */
  SliderComponent.prototype.sliderElementAnimateClass;
  /** @type {?} */
  SliderComponent.prototype.sliderElementWithLegendClass;
  /** @type {?} */
  SliderComponent.prototype.sliderElementDisabledAttr;
  /** @type {?} */
  SliderComponent.prototype.sliderElementAriaLabel;
  /** @type {?} */
  SliderComponent.prototype.barStyle;
  /** @type {?} */
  SliderComponent.prototype.minPointerStyle;
  /** @type {?} */
  SliderComponent.prototype.maxPointerStyle;
  /** @type {?} */
  SliderComponent.prototype.fullBarTransparentClass;
  /** @type {?} */
  SliderComponent.prototype.selectionBarDraggableClass;
  /** @type {?} */
  SliderComponent.prototype.ticksUnderValuesClass;
  /** @type {?} */
  SliderComponent.prototype.intermediateTicks;
  /** @type {?} */
  SliderComponent.prototype.ticks;
  /** @type {?} */
  SliderComponent.prototype.eventListenerHelper;
  /** @type {?} */
  SliderComponent.prototype.onMoveEventListener;
  /** @type {?} */
  SliderComponent.prototype.onEndEventListener;
  /** @type {?} */
  SliderComponent.prototype.moving;
  /** @type {?} */
  SliderComponent.prototype.resizeObserver;
  /** @type {?} */
  SliderComponent.prototype.onTouchedCallback;
  /** @type {?} */
  SliderComponent.prototype.onChangeCallback;
  /** @type {?} */
  SliderComponent.prototype.renderer;
  /** @type {?} */
  SliderComponent.prototype.elementRef;
  /** @type {?} */
  SliderComponent.prototype.changeDetectionRef;
  /** @type {?} */
  SliderComponent.prototype.zone;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0Bhbmd1bGFyLXNsaWRlci9uZ3gtc2xpZGVyLyIsInNvdXJjZXMiOlsic2xpZGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sRUFDTCxTQUFTLEVBRVQsU0FBUyxFQUlULFdBQVcsRUFDWCxZQUFZLEVBQ1osS0FBSyxFQUNMLFVBQVUsRUFDVixTQUFTLEVBQ1QsWUFBWSxFQUNaLE1BQU0sRUFDTixZQUFZLEVBQ1osV0FBVyxFQUNYLGlCQUFpQixFQUVqQixVQUFVLEVBQ1YsTUFBTSxFQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFFOUQsT0FBTyxFQUNMLE9BQU8sRUFDUCxTQUFTLEVBSVYsTUFBTSxXQUFXLENBQUM7QUFDbkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFB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QUUvQixXQUFXLFNBQUMsZUFBZTt5Q0FFM0IsV0FBVyxTQUFDLGlCQUFpQjsyQkF1SzdCLFlBQVksU0FBQyxlQUFlLEVBQUUsQ0FBQyxRQUFRLENBQUM7OzBCQTdlM0M7O1NBMEthLGVBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgVmlld0NoaWxkLFxyXG4gIEFmdGVyVmlld0luaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIE9uRGVzdHJveSxcclxuICBIb3N0QmluZGluZyxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgSW5wdXQsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlcjIsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIE91dHB1dCxcclxuICBDb250ZW50Q2hpbGQsXHJcbiAgVGVtcGxhdGVSZWYsXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgU2ltcGxlQ2hhbmdlcyxcclxuICBmb3J3YXJkUmVmLFxyXG4gIE5nWm9uZVxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgQ29udHJvbFZhbHVlQWNjZXNzb3IsIE5HX1ZBTFVFX0FDQ0VTU09SIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xyXG5cclxuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XHJcblxyXG5pbXBvcnQgeyBzdXBwb3J0c1Bhc3NpdmVFdmVudHMgfSBmcm9tICdkZXRlY3QtcGFzc2l2ZS1ldmVudHMnO1xyXG5cclxuaW1wb3J0IHtcclxuICBPcHRpb25zLFxyXG4gIExhYmVsVHlwZSxcclxuICBWYWx1ZVRvUG9zaXRpb25GdW5jdGlvbixcclxuICBQb3NpdGlvblRvVmFsdWVGdW5jdGlvbixcclxuICBDdXN0b21TdGVwRGVmaW5pdGlvblxyXG59IGZyb20gJy4vb3B0aW9ucyc7XHJcbmltcG9ydCB7IFBvaW50ZXJUeXBlIH0gZnJvbSAnLi9wb2ludGVyLXR5cGUnO1xyXG5pbXBvcnQgeyBDaGFuZ2VDb250ZXh0IH0gZnJvbSAnLi9jaGFuZ2UtY29udGV4dCc7XHJcbmltcG9ydCB7IFZhbHVlSGVscGVyIH0gZnJvbSAnLi92YWx1ZS1oZWxwZXInO1xyXG5pbXBvcnQgeyBDb21wYXRpYmlsaXR5SGVscGVyIH0gZnJvbSAnLi9jb21wYXRpYmlsaXR5LWhlbHBlcic7XHJcbmltcG9ydCB7IE1hdGhIZWxwZXIgfSBmcm9tICcuL21hdGgtaGVscGVyJztcclxuaW1wb3J0IHsgRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vZXZlbnQtbGlzdGVuZXInO1xyXG5pbXBvcnQgeyBFdmVudExpc3RlbmVySGVscGVyIH0gZnJvbSAnLi9ldmVudC1saXN0ZW5lci1oZWxwZXInO1xyXG5pbXBvcnQgeyBTbGlkZXJFbGVtZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9zbGlkZXItZWxlbWVudC5kaXJlY3RpdmUnO1xyXG5pbXBvcnQgeyBTbGlkZXJIYW5kbGVEaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1oYW5kbGUuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgU2xpZGVyTGFiZWxEaXJlY3RpdmUgfSBmcm9tICcuL3NsaWRlci1sYWJlbC5kaXJlY3RpdmUnO1xyXG5cclxuLy8gRGVjbGFyYXRpb24gZm9yIFJlc2l6ZU9ic2VydmVyIGEgbmV3IEFQSSBhdmFpbGFibGUgaW4gc29tZSBvZiBuZXdlc3QgYnJvd3NlcnM6XHJcbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9SZXNpemVPYnNlcnZlclxyXG5kZWNsYXJlIGNsYXNzIFJlc2l6ZU9ic2VydmVyIHtcclxuICBjb25zdHJ1Y3RvcihjYWxsYmFjazogKCkgPT4gdm9pZCk7XHJcbiAgb2JzZXJ2ZSh0YXJnZXQ6IGFueSk6IHZvaWQ7XHJcbiAgdW5vYnNlcnZlKHRhcmdldDogYW55KTogdm9pZDtcclxuICBkaXNjb25uZWN0KCk6IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBUaWNrIHtcclxuICBzZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHN0eWxlOiBhbnkgPSB7fTtcclxuICB0b29sdGlwOiBzdHJpbmcgPSBudWxsO1xyXG4gIHRvb2x0aXBQbGFjZW1lbnQ6IHN0cmluZyA9IG51bGw7XHJcbiAgdmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgdmFsdWVUb29sdGlwOiBzdHJpbmcgPSBudWxsO1xyXG4gIHZhbHVlVG9vbHRpcFBsYWNlbWVudDogc3RyaW5nID0gbnVsbDtcclxuICBsZWdlbmQ6IHN0cmluZyA9IG51bGw7XHJcbn1cclxuXHJcbmNsYXNzIERyYWdnaW5nIHtcclxuICBhY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICB2YWx1ZTogbnVtYmVyID0gMDtcclxuICBkaWZmZXJlbmNlOiBudW1iZXIgPSAwO1xyXG4gIHBvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG4gIGxvd0xpbWl0OiBudW1iZXIgPSAwO1xyXG4gIGhpZ2hMaW1pdDogbnVtYmVyID0gMDtcclxufVxyXG5cclxuY2xhc3MgTW9kZWxWYWx1ZXMge1xyXG4gIHZhbHVlOiBudW1iZXI7XHJcbiAgaGlnaFZhbHVlOiBudW1iZXI7XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY29tcGFyZSh4PzogTW9kZWxWYWx1ZXMsIHk/OiBNb2RlbFZhbHVlcyk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHgpICYmIFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHkpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh4KSAhPT0gVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoeSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHgudmFsdWUgPT09IHkudmFsdWUgJiYgeC5oaWdoVmFsdWUgPT09IHkuaGlnaFZhbHVlO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgTW9kZWxDaGFuZ2UgZXh0ZW5kcyBNb2RlbFZhbHVlcyB7XHJcbiAgLy8gRmxhZyB1c2VkIHRvIGJ5LXBhc3MgZGlzdGluY3RVbnRpbENoYW5nZWQoKSBmaWx0ZXIgb24gaW5wdXQgdmFsdWVzXHJcbiAgLy8gKHNvbWV0aW1lcyB0aGVyZSBpcyBhIG5lZWQgdG8gcGFzcyB2YWx1ZXMgdGhyb3VnaCBldmVuIHRob3VnaCB0aGUgbW9kZWwgdmFsdWVzIGhhdmUgbm90IGNoYW5nZWQpXHJcbiAgZm9yY2VDaGFuZ2U6IGJvb2xlYW47XHJcblxyXG4gIHB1YmxpYyBzdGF0aWMgY29tcGFyZSh4PzogTW9kZWxDaGFuZ2UsIHk/OiBNb2RlbENoYW5nZSk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHgpICYmIFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHkpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh4KSAhPT0gVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoeSkpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHgudmFsdWUgPT09IHkudmFsdWUgJiZcclxuICAgICAgICAgICB4LmhpZ2hWYWx1ZSA9PT0geS5oaWdoVmFsdWUgJiZcclxuICAgICAgICAgICB4LmZvcmNlQ2hhbmdlID09PSB5LmZvcmNlQ2hhbmdlO1xyXG4gIH1cclxufVxyXG5cclxuY2xhc3MgSW5wdXRNb2RlbENoYW5nZSBleHRlbmRzIE1vZGVsQ2hhbmdlIHtcclxuICBpbnRlcm5hbENoYW5nZTogYm9vbGVhbjtcclxufVxyXG5cclxuY2xhc3MgT3V0cHV0TW9kZWxDaGFuZ2UgZXh0ZW5kcyBNb2RlbENoYW5nZSB7XHJcbiAgdXNlckV2ZW50SW5pdGlhdGVkOiBib29sZWFuO1xyXG59XHJcblxyXG5jb25zdCBOR1hfU0xJREVSX0NPTlRST0xfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcclxuICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcclxuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVzZS1iZWZvcmUtZGVjbGFyZSAqL1xyXG4gIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IFNsaWRlckNvbXBvbmVudCksXHJcbiAgbXVsdGk6IHRydWUsXHJcbn07XHJcblxyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtc2xpZGVyJyxcclxuICB0ZW1wbGF0ZTogYDwhLS0gLy8gMCBMZWZ0IHNlbGVjdGlvbiBiYXIgb3V0c2lkZSB0d28gaGFuZGxlcyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjbGVmdE91dGVyU2VsZWN0aW9uQmFyIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyLXdyYXBwZXIgbmd4LXNsaWRlci1sZWZ0LW91dC1zZWxlY3Rpb25cIj5cclxuICA8c3BhbiBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJhclwiPjwvc3Bhbj5cclxuPC9zcGFuPlxyXG48IS0tIC8vIDEgUmlnaHQgc2VsZWN0aW9uIGJhciBvdXRzaWRlIHR3byBoYW5kbGVzIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJFbGVtZW50ICNyaWdodE91dGVyU2VsZWN0aW9uQmFyIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyLXdyYXBwZXIgbmd4LXNsaWRlci1yaWdodC1vdXQtc2VsZWN0aW9uXCI+XHJcbiAgPHNwYW4gY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXJcIj48L3NwYW4+XHJcbjwvc3Bhbj5cclxuPCEtLSAvLyAyIFRoZSB3aG9sZSBzbGlkZXIgYmFyIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJFbGVtZW50ICNmdWxsQmFyIFtjbGFzcy5uZ3gtc2xpZGVyLXRyYW5zcGFyZW50XT1cImZ1bGxCYXJUcmFuc3BhcmVudENsYXNzXCIgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXItd3JhcHBlciBuZ3gtc2xpZGVyLWZ1bGwtYmFyXCI+XHJcbiAgPHNwYW4gY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXJcIj48L3NwYW4+XHJcbjwvc3Bhbj5cclxuPCEtLSAvLyAzIFNlbGVjdGlvbiBiYXIgYmV0d2VlbiB0d28gaGFuZGxlcyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjc2VsZWN0aW9uQmFyIFtjbGFzcy5uZ3gtc2xpZGVyLWRyYWdnYWJsZV09XCJzZWxlY3Rpb25CYXJEcmFnZ2FibGVDbGFzc1wiIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYmFyLXdyYXBwZXIgbmd4LXNsaWRlci1zZWxlY3Rpb24tYmFyXCI+XHJcbiAgPHNwYW4gY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1iYXIgbmd4LXNsaWRlci1zZWxlY3Rpb25cIiBbbmdTdHlsZV09XCJiYXJTdHlsZVwiPjwvc3Bhbj5cclxuPC9zcGFuPlxyXG48IS0tIC8vIDQgTG93IHNsaWRlciBoYW5kbGUgLS0+XHJcbjxzcGFuIG5neFNsaWRlckhhbmRsZSAjbWluSGFuZGxlIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItcG9pbnRlciBuZ3gtc2xpZGVyLXBvaW50ZXItbWluXCIgW25nU3R5bGVdPW1pblBvaW50ZXJTdHlsZT48L3NwYW4+XHJcbjwhLS0gLy8gNSBIaWdoIHNsaWRlciBoYW5kbGUgLS0+XHJcbjxzcGFuIG5neFNsaWRlckhhbmRsZSAjbWF4SGFuZGxlIFtzdHlsZS5kaXNwbGF5XT1cInJhbmdlID8gJ2luaGVyaXQnIDogJ25vbmUnXCIgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1wb2ludGVyIG5neC1zbGlkZXItcG9pbnRlci1tYXhcIiBbbmdTdHlsZV09bWF4UG9pbnRlclN0eWxlPjwvc3Bhbj5cclxuPCEtLSAvLyA2IEZsb29yIGxhYmVsIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjZmxvb3JMYWJlbCBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJ1YmJsZSBuZ3gtc2xpZGVyLWxpbWl0IG5neC1zbGlkZXItZmxvb3JcIj48L3NwYW4+XHJcbjwhLS0gLy8gNyBDZWlsaW5nIGxhYmVsIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjY2VpbExhYmVsIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItYnViYmxlIG5neC1zbGlkZXItbGltaXQgbmd4LXNsaWRlci1jZWlsXCI+PC9zcGFuPlxyXG48IS0tIC8vIDggTGFiZWwgYWJvdmUgdGhlIGxvdyBzbGlkZXIgaGFuZGxlIC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjbWluSGFuZGxlTGFiZWwgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci1idWJibGUgbmd4LXNsaWRlci1tb2RlbC12YWx1ZVwiPjwvc3Bhbj5cclxuPCEtLSAvLyA5IExhYmVsIGFib3ZlIHRoZSBoaWdoIHNsaWRlciBoYW5kbGUgLS0+XHJcbjxzcGFuIG5neFNsaWRlckxhYmVsICNtYXhIYW5kbGVMYWJlbCBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJ1YmJsZSBuZ3gtc2xpZGVyLW1vZGVsLWhpZ2hcIj48L3NwYW4+XHJcbjwhLS0gLy8gMTAgQ29tYmluZWQgcmFuZ2UgbGFiZWwgd2hlbiB0aGUgc2xpZGVyIGhhbmRsZXMgYXJlIGNsb3NlIGV4LiAxNSAtIDE3IC0tPlxyXG48c3BhbiBuZ3hTbGlkZXJMYWJlbCAjY29tYmluZWRMYWJlbCBjbGFzcz1cIm5neC1zbGlkZXItc3BhbiBuZ3gtc2xpZGVyLWJ1YmJsZSBuZ3gtc2xpZGVyLWNvbWJpbmVkXCI+PC9zcGFuPlxyXG48IS0tIC8vIDExIFRoZSB0aWNrcyAtLT5cclxuPHNwYW4gbmd4U2xpZGVyRWxlbWVudCAjdGlja3NFbGVtZW50IFtoaWRkZW5dPVwiIXNob3dUaWNrc1wiIFtjbGFzcy5uZ3gtc2xpZGVyLXRpY2tzLXZhbHVlcy11bmRlcl09XCJ0aWNrc1VuZGVyVmFsdWVzQ2xhc3NcIiBjbGFzcz1cIm5neC1zbGlkZXItdGlja3NcIj5cclxuICA8c3BhbiAqbmdGb3I9XCJsZXQgdCBvZiB0aWNrc1wiIGNsYXNzPVwibmd4LXNsaWRlci10aWNrXCIgW25nQ2xhc3NdPVwieyduZ3gtc2xpZGVyLXNlbGVjdGVkJzogdC5zZWxlY3RlZH1cIiBbbmdTdHlsZV09XCJ0LnN0eWxlXCI+XHJcbiAgICA8bmd4LXNsaWRlci10b29sdGlwLXdyYXBwZXIgW3RlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiIFt0b29sdGlwXT1cInQudG9vbHRpcFwiIFtwbGFjZW1lbnRdPVwidC50b29sdGlwUGxhY2VtZW50XCI+PC9uZ3gtc2xpZGVyLXRvb2x0aXAtd3JhcHBlcj5cclxuICAgIDxuZ3gtc2xpZGVyLXRvb2x0aXAtd3JhcHBlciAqbmdJZj1cInQudmFsdWUgIT0gbnVsbFwiIGNsYXNzPVwibmd4LXNsaWRlci1zcGFuIG5neC1zbGlkZXItdGljay12YWx1ZVwiXHJcbiAgICAgICAgW3RlbXBsYXRlXT1cInRvb2x0aXBUZW1wbGF0ZVwiIFt0b29sdGlwXT1cInQudmFsdWVUb29sdGlwXCIgW3BsYWNlbWVudF09XCJ0LnZhbHVlVG9vbHRpcFBsYWNlbWVudFwiIFtjb250ZW50XT1cInQudmFsdWVcIj48L25neC1zbGlkZXItdG9vbHRpcC13cmFwcGVyPlxyXG4gICAgPHNwYW4gKm5nSWY9XCJ0LmxlZ2VuZCAhPSBudWxsXCIgY2xhc3M9XCJuZ3gtc2xpZGVyLXNwYW4gbmd4LXNsaWRlci10aWNrLWxlZ2VuZFwiIFtpbm5lckhUTUxdPVwidC5sZWdlbmRcIj48L3NwYW4+XHJcbiAgPC9zcGFuPlxyXG48L3NwYW4+YCxcclxuICBzdHlsZXM6IFtgOjpuZy1kZWVwIC5uZ3gtc2xpZGVye2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOnJlbGF0aXZlO2hlaWdodDo0cHg7d2lkdGg6MTAwJTttYXJnaW46MzVweCAwIDE1cHg7dmVydGljYWwtYWxpZ246bWlkZGxlOy13ZWJraXQtdXNlci1zZWxlY3Q6bm9uZTstbW96LXVzZXItc2VsZWN0Om5vbmU7LW1zLXVzZXItc2VsZWN0Om5vbmU7dXNlci1zZWxlY3Q6bm9uZTt0b3VjaC1hY3Rpb246cGFuLXl9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLndpdGgtbGVnZW5ke21hcmdpbi1ib3R0b206NDBweH06Om5nLWRlZXAgLm5neC1zbGlkZXJbZGlzYWJsZWRde2N1cnNvcjpub3QtYWxsb3dlZH06Om5nLWRlZXAgLm5neC1zbGlkZXJbZGlzYWJsZWRdIC5uZ3gtc2xpZGVyLXBvaW50ZXJ7Y3Vyc29yOm5vdC1hbGxvd2VkO2JhY2tncm91bmQtY29sb3I6I2Q4ZTBmM306Om5nLWRlZXAgLm5neC1zbGlkZXJbZGlzYWJsZWRdIC5uZ3gtc2xpZGVyLWRyYWdnYWJsZXtjdXJzb3I6bm90LWFsbG93ZWR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyW2Rpc2FibGVkXSAubmd4LXNsaWRlci1zZWxlY3Rpb257YmFja2dyb3VuZDojOGI5MWEyfTo6bmctZGVlcCAubmd4LXNsaWRlcltkaXNhYmxlZF0gLm5neC1zbGlkZXItdGlja3tjdXJzb3I6bm90LWFsbG93ZWR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyW2Rpc2FibGVkXSAubmd4LXNsaWRlci10aWNrLm5neC1zbGlkZXItc2VsZWN0ZWR7YmFja2dyb3VuZDojOGI5MWEyfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1zcGFue3doaXRlLXNwYWNlOm5vd3JhcDtwb3NpdGlvbjphYnNvbHV0ZTtkaXNwbGF5OmlubGluZS1ibG9ja306Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFzZXt3aWR0aDoxMDAlO2hlaWdodDoxMDAlO3BhZGRpbmc6MH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFyLXdyYXBwZXJ7bGVmdDowO2JveC1zaXppbmc6Ym9yZGVyLWJveDttYXJnaW4tdG9wOi0xNnB4O3BhZGRpbmctdG9wOjE2cHg7d2lkdGg6MTAwJTtoZWlnaHQ6MzJweDt6LWluZGV4OjF9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWRyYWdnYWJsZXtjdXJzb3I6bW92ZX06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFye2xlZnQ6MDt3aWR0aDoxMDAlO2hlaWdodDo0cHg7ei1pbmRleDoxO2JhY2tncm91bmQ6I2Q4ZTBmMztib3JkZXItcmFkaXVzOjJweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYmFyLXdyYXBwZXIubmd4LXNsaWRlci10cmFuc3BhcmVudCAubmd4LXNsaWRlci1iYXJ7YmFja2dyb3VuZDowIDB9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhci13cmFwcGVyLm5neC1zbGlkZXItbGVmdC1vdXQtc2VsZWN0aW9uIC5uZ3gtc2xpZGVyLWJhcntiYWNrZ3JvdW5kOiNkZjAwMmR9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJhci13cmFwcGVyLm5neC1zbGlkZXItcmlnaHQtb3V0LXNlbGVjdGlvbiAubmd4LXNsaWRlci1iYXJ7YmFja2dyb3VuZDojMDNhNjg4fTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1zZWxlY3Rpb257ei1pbmRleDoyO2JhY2tncm91bmQ6IzBkYjlmMDtib3JkZXItcmFkaXVzOjJweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItcG9pbnRlcntjdXJzb3I6cG9pbnRlcjt3aWR0aDozMnB4O2hlaWdodDozMnB4O3RvcDotMTRweDtiYWNrZ3JvdW5kLWNvbG9yOiMwZGI5ZjA7ei1pbmRleDozO2JvcmRlci1yYWRpdXM6MTZweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItcG9pbnRlcjphZnRlcntjb250ZW50OicnO3dpZHRoOjhweDtoZWlnaHQ6OHB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDoxMnB4O2xlZnQ6MTJweDtib3JkZXItcmFkaXVzOjRweDtiYWNrZ3JvdW5kOiNmZmZ9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXBvaW50ZXI6aG92ZXI6YWZ0ZXJ7YmFja2dyb3VuZC1jb2xvcjojZmZmfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci1wb2ludGVyLm5neC1zbGlkZXItYWN0aXZle3otaW5kZXg6NH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItcG9pbnRlci5uZ3gtc2xpZGVyLWFjdGl2ZTphZnRlcntiYWNrZ3JvdW5kLWNvbG9yOiM0NTFhZmZ9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLWJ1YmJsZXtjdXJzb3I6ZGVmYXVsdDtib3R0b206MTZweDtwYWRkaW5nOjFweCAzcHg7Y29sb3I6IzU1NjM3ZDtmb250LXNpemU6MTZweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItYnViYmxlLm5neC1zbGlkZXItbGltaXR7Y29sb3I6IzU1NjM3ZH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGlja3N7Ym94LXNpemluZzpib3JkZXItYm94O3dpZHRoOjEwMCU7aGVpZ2h0OjA7cG9zaXRpb246YWJzb2x1dGU7bGVmdDowO3RvcDotM3B4O21hcmdpbjowO3otaW5kZXg6MTtsaXN0LXN0eWxlOm5vbmV9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyIC5uZ3gtc2xpZGVyLXRpY2tzLXZhbHVlcy11bmRlciAubmd4LXNsaWRlci10aWNrLXZhbHVle3RvcDphdXRvO2JvdHRvbTotMzZweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGlja3t0ZXh0LWFsaWduOmNlbnRlcjtjdXJzb3I6cG9pbnRlcjt3aWR0aDoxMHB4O2hlaWdodDoxMHB4O2JhY2tncm91bmQ6I2Q4ZTBmMztib3JkZXItcmFkaXVzOjUwJTtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MDtsZWZ0OjA7bWFyZ2luLWxlZnQ6MTFweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGljay5uZ3gtc2xpZGVyLXNlbGVjdGVke2JhY2tncm91bmQ6IzBkYjlmMH06Om5nLWRlZXAgLm5neC1zbGlkZXIgLm5neC1zbGlkZXItdGljay12YWx1ZXtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6LTM0cHg7LXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsMCk7dHJhbnNmb3JtOnRyYW5zbGF0ZSgtNTAlLDApfTo6bmctZGVlcCAubmd4LXNsaWRlciAubmd4LXNsaWRlci10aWNrLWxlZ2VuZHtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6MjRweDstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoLTUwJSwwKTt0cmFuc2Zvcm06dHJhbnNsYXRlKC01MCUsMCk7bWF4LXdpZHRoOjUwcHg7d2hpdGUtc3BhY2U6bm9ybWFsfTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbHtwb3NpdGlvbjpyZWxhdGl2ZTt3aWR0aDo0cHg7aGVpZ2h0OjEwMCU7bWFyZ2luOjAgMjBweDtwYWRkaW5nOjA7dmVydGljYWwtYWxpZ246YmFzZWxpbmU7dG91Y2gtYWN0aW9uOnBhbi14fTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci1iYXNle3dpZHRoOjEwMCU7aGVpZ2h0OjEwMCU7cGFkZGluZzowfTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci1iYXItd3JhcHBlcnt0b3A6YXV0bztsZWZ0OjA7bWFyZ2luOjAgMCAwIC0xNnB4O3BhZGRpbmc6MCAwIDAgMTZweDtoZWlnaHQ6MTAwJTt3aWR0aDozMnB4fTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci1iYXJ7Ym90dG9tOjA7bGVmdDphdXRvO3dpZHRoOjRweDtoZWlnaHQ6MTAwJX06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItcG9pbnRlcntsZWZ0Oi0xNHB4IWltcG9ydGFudDt0b3A6YXV0bztib3R0b206MH06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItYnViYmxle2xlZnQ6MTZweCFpbXBvcnRhbnQ7Ym90dG9tOjB9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLXRpY2tze2hlaWdodDoxMDAlO3dpZHRoOjA7bGVmdDotM3B4O3RvcDowO3otaW5kZXg6MX06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItdGlja3t2ZXJ0aWNhbC1hbGlnbjptaWRkbGU7bWFyZ2luLWxlZnQ6YXV0bzttYXJnaW4tdG9wOjExcHh9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLnZlcnRpY2FsIC5uZ3gtc2xpZGVyLXRpY2stdmFsdWV7bGVmdDoyNHB4O3RvcDphdXRvOy13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZSgwLC0yOCUpO3RyYW5zZm9ybTp0cmFuc2xhdGUoMCwtMjglKX06Om5nLWRlZXAgLm5neC1zbGlkZXIudmVydGljYWwgLm5neC1zbGlkZXItdGljay1sZWdlbmR7dG9wOmF1dG87cmlnaHQ6MjRweDstd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGUoMCwtMjglKTt0cmFuc2Zvcm06dHJhbnNsYXRlKDAsLTI4JSk7bWF4LXdpZHRoOm5vbmU7d2hpdGUtc3BhY2U6bm93cmFwfTo6bmctZGVlcCAubmd4LXNsaWRlci52ZXJ0aWNhbCAubmd4LXNsaWRlci10aWNrcy12YWx1ZXMtdW5kZXIgLm5neC1zbGlkZXItdGljay12YWx1ZXtib3R0b206YXV0bztsZWZ0OmF1dG87cmlnaHQ6MjRweH06Om5nLWRlZXAgLm5neC1zbGlkZXIgKnt0cmFuc2l0aW9uOm5vbmV9OjpuZy1kZWVwIC5uZ3gtc2xpZGVyLmFuaW1hdGUgLm5neC1zbGlkZXItYmFyLXdyYXBwZXJ7dHJhbnNpdGlvbjouM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLXNlbGVjdGlvbnt0cmFuc2l0aW9uOmJhY2tncm91bmQtY29sb3IgLjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1wb2ludGVye3RyYW5zaXRpb246LjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1wb2ludGVyOmFmdGVye3RyYW5zaXRpb246LjNzIGxpbmVhcn06Om5nLWRlZXAgLm5neC1zbGlkZXIuYW5pbWF0ZSAubmd4LXNsaWRlci1idWJibGV7dHJhbnNpdGlvbjouM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLWJ1YmJsZS5uZ3gtc2xpZGVyLWxpbWl0e3RyYW5zaXRpb246b3BhY2l0eSAuM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLWJ1YmJsZS5uZ3gtc2xpZGVyLWNvbWJpbmVke3RyYW5zaXRpb246b3BhY2l0eSAuM3MgbGluZWFyfTo6bmctZGVlcCAubmd4LXNsaWRlci5hbmltYXRlIC5uZ3gtc2xpZGVyLXRpY2t7dHJhbnNpdGlvbjpiYWNrZ3JvdW5kLWNvbG9yIC4zcyBsaW5lYXJ9YF0sXHJcbiAgaG9zdDogeyBjbGFzczogJ25neC1zbGlkZXInIH0sXHJcbiAgcHJvdmlkZXJzOiBbTkdYX1NMSURFUl9DT05UUk9MX1ZBTFVFX0FDQ0VTU09SXVxyXG59KVxyXG5leHBvcnQgY2xhc3MgU2xpZGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgQ29udHJvbFZhbHVlQWNjZXNzb3Ige1xyXG4gIC8vIE1vZGVsIGZvciBsb3cgdmFsdWUgb2Ygc2xpZGVyLiBGb3Igc2ltcGxlIHNsaWRlciwgdGhpcyBpcyB0aGUgb25seSBpbnB1dC4gRm9yIHJhbmdlIHNsaWRlciwgdGhpcyBpcyB0aGUgbG93IHZhbHVlLlxyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIHZhbHVlOiBudW1iZXIgPSBudWxsO1xyXG4gIC8vIE91dHB1dCBmb3IgbG93IHZhbHVlIHNsaWRlciB0byBzdXBwb3J0IHR3by13YXkgYmluZGluZ3NcclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgdmFsdWVDaGFuZ2U6IEV2ZW50RW1pdHRlcjxudW1iZXI+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBNb2RlbCBmb3IgaGlnaCB2YWx1ZSBvZiBzbGlkZXIuIE5vdCB1c2VkIGluIHNpbXBsZSBzbGlkZXIuIEZvciByYW5nZSBzbGlkZXIsIHRoaXMgaXMgdGhlIGhpZ2ggdmFsdWUuXHJcbiAgQElucHV0KClcclxuICBwdWJsaWMgaGlnaFZhbHVlOiBudW1iZXIgPSBudWxsO1xyXG4gIC8vIE91dHB1dCBmb3IgaGlnaCB2YWx1ZSBzbGlkZXIgdG8gc3VwcG9ydCB0d28td2F5IGJpbmRpbmdzXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIGhpZ2hWYWx1ZUNoYW5nZTogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XHJcblxyXG4gIC8vIEFuIG9iamVjdCB3aXRoIGFsbCB0aGUgb3RoZXIgb3B0aW9ucyBvZiB0aGUgc2xpZGVyLlxyXG4gIC8vIEVhY2ggb3B0aW9uIGNhbiBiZSB1cGRhdGVkIGF0IHJ1bnRpbWUgYW5kIHRoZSBzbGlkZXIgd2lsbCBhdXRvbWF0aWNhbGx5IGJlIHJlLXJlbmRlcmVkLlxyXG4gIEBJbnB1dCgpXHJcbiAgcHVibGljIG9wdGlvbnM6IE9wdGlvbnMgPSBuZXcgT3B0aW9ucygpO1xyXG5cclxuICAvLyBFdmVudCBlbWl0dGVkIHdoZW4gdXNlciBzdGFydHMgaW50ZXJhY3Rpb24gd2l0aCB0aGUgc2xpZGVyXHJcbiAgQE91dHB1dCgpXHJcbiAgcHVibGljIHVzZXJDaGFuZ2VTdGFydDogRXZlbnRFbWl0dGVyPENoYW5nZUNvbnRleHQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBFdmVudCBlbWl0dGVkIG9uIGVhY2ggY2hhbmdlIGNvbWluZyBmcm9tIHVzZXIgaW50ZXJhY3Rpb25cclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgdXNlckNoYW5nZTogRXZlbnRFbWl0dGVyPENoYW5nZUNvbnRleHQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICAvLyBFdmVudCBlbWl0dGVkIHdoZW4gdXNlciBmaW5pc2hlcyBpbnRlcmFjdGlvbiB3aXRoIHRoZSBzbGlkZXJcclxuICBAT3V0cHV0KClcclxuICBwdWJsaWMgdXNlckNoYW5nZUVuZDogRXZlbnRFbWl0dGVyPENoYW5nZUNvbnRleHQ+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBwcml2YXRlIG1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb246IGFueTtcclxuICAvLyBJbnB1dCBldmVudCB0aGF0IHRyaWdnZXJzIHNsaWRlciByZWZyZXNoIChyZS1wb3NpdGlvbmluZyBvZiBzbGlkZXIgZWxlbWVudHMpXHJcbiAgQElucHV0KCkgc2V0IG1hbnVhbFJlZnJlc2gobWFudWFsUmVmcmVzaDogRXZlbnRFbWl0dGVyPHZvaWQ+KSB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlTWFudWFsUmVmcmVzaCgpO1xyXG5cclxuICAgIHRoaXMubWFudWFsUmVmcmVzaFN1YnNjcmlwdGlvbiA9IG1hbnVhbFJlZnJlc2guc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zQW5kRGV0ZWN0Q2hhbmdlcygpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB0cmlnZ2VyRm9jdXNTdWJzY3JpcHRpb246IGFueTtcclxuICAvLyBJbnB1dCBldmVudCB0aGF0IHRyaWdnZXJzIHNldHRpbmcgZm9jdXMgb24gZ2l2ZW4gc2xpZGVyIGhhbmRsZVxyXG4gIEBJbnB1dCgpIHNldCB0cmlnZ2VyRm9jdXModHJpZ2dlckZvY3VzOiBFdmVudEVtaXR0ZXI8dm9pZD4pIHtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVUcmlnZ2VyRm9jdXMoKTtcclxuXHJcbiAgICB0aGlzLnRyaWdnZXJGb2N1c1N1YnNjcmlwdGlvbiA9IHRyaWdnZXJGb2N1cy5zdWJzY3JpYmUoKHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSkgPT4ge1xyXG4gICAgICB0aGlzLmZvY3VzUG9pbnRlcihwb2ludGVyVHlwZSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8vIFNsaWRlciB0eXBlLCB0cnVlIG1lYW5zIHJhbmdlIHNsaWRlclxyXG4gIHB1YmxpYyBnZXQgcmFuZ2UoKTogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmFsdWUpICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLmhpZ2hWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdG8gdHJ1ZSBpZiBpbml0IG1ldGhvZCBhbHJlYWR5IGV4ZWN1dGVkXHJcbiAgcHJpdmF0ZSBpbml0SGFzUnVuOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gIC8vIENoYW5nZXMgaW4gbW9kZWwgaW5wdXRzIGFyZSBwYXNzZWQgdGhyb3VnaCB0aGlzIHN1YmplY3RcclxuICAvLyBUaGVzZSBhcmUgYWxsIGNoYW5nZXMgY29taW5nIGluIGZyb20gb3V0c2lkZSB0aGUgY29tcG9uZW50IHRocm91Z2ggaW5wdXQgYmluZGluZ3Mgb3IgcmVhY3RpdmUgZm9ybSBpbnB1dHNcclxuICBwcml2YXRlIGlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0OiBTdWJqZWN0PElucHV0TW9kZWxDaGFuZ2U+ID0gbmV3IFN1YmplY3Q8SW5wdXRNb2RlbENoYW5nZT4oKTtcclxuICBwcml2YXRlIGlucHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcblxyXG4gIC8vIENoYW5nZXMgdG8gbW9kZWwgb3V0cHV0cyBhcmUgcGFzc2VkIHRocm91Z2ggdGhpcyBzdWJqZWN0XHJcbiAgLy8gVGhlc2UgYXJlIGFsbCBjaGFuZ2VzIHRoYXQgbmVlZCB0byBiZSBjb21tdW5pY2F0ZWQgdG8gb3V0cHV0IGVtaXR0ZXJzIGFuZCByZWdpc3RlcmVkIGNhbGxiYWNrc1xyXG4gIHByaXZhdGUgb3V0cHV0TW9kZWxDaGFuZ2VTdWJqZWN0OiBTdWJqZWN0PE91dHB1dE1vZGVsQ2hhbmdlPiA9IG5ldyBTdWJqZWN0PE91dHB1dE1vZGVsQ2hhbmdlPigpO1xyXG4gIHByaXZhdGUgb3V0cHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XHJcblxyXG4gIC8vIExvdyB2YWx1ZSBzeW5jZWQgdG8gbW9kZWwgbG93IHZhbHVlXHJcbiAgcHJpdmF0ZSB2aWV3TG93VmFsdWU6IG51bWJlciA9IG51bGw7XHJcbiAgLy8gSGlnaCB2YWx1ZSBzeW5jZWQgdG8gbW9kZWwgaGlnaCB2YWx1ZVxyXG4gIHByaXZhdGUgdmlld0hpZ2hWYWx1ZTogbnVtYmVyID0gbnVsbDtcclxuICAvLyBPcHRpb25zIHN5bmNlZCB0byBtb2RlbCBvcHRpb25zLCBiYXNlZCBvbiBkZWZhdWx0c1xyXG4gIHByaXZhdGUgdmlld09wdGlvbnM6IE9wdGlvbnMgPSBuZXcgT3B0aW9ucygpO1xyXG5cclxuICAvLyBIYWxmIG9mIHRoZSB3aWR0aCBvciBoZWlnaHQgb2YgdGhlIHNsaWRlciBoYW5kbGVzXHJcbiAgcHJpdmF0ZSBoYW5kbGVIYWxmRGltZW5zaW9uOiBudW1iZXIgPSAwO1xyXG4gIC8vIE1heGltdW0gcG9zaXRpb24gdGhlIHNsaWRlciBoYW5kbGUgY2FuIGhhdmVcclxuICBwcml2YXRlIG1heEhhbmRsZVBvc2l0aW9uOiBudW1iZXIgPSAwO1xyXG5cclxuICAvLyBXaGljaCBoYW5kbGUgaXMgY3VycmVudGx5IHRyYWNrZWQgZm9yIG1vdmUgZXZlbnRzXHJcbiAgcHJpdmF0ZSBjdXJyZW50VHJhY2tpbmdQb2ludGVyOiBQb2ludGVyVHlwZSA9IG51bGw7XHJcbiAgLy8gSW50ZXJuYWwgdmFyaWFibGUgdG8ga2VlcCB0cmFjayBvZiB0aGUgZm9jdXMgZWxlbWVudFxyXG4gIHByaXZhdGUgY3VycmVudEZvY3VzUG9pbnRlcjogUG9pbnRlclR5cGUgPSBudWxsO1xyXG4gIC8vIFVzZWQgdG8gY2FsbCBvblN0YXJ0IG9uIHRoZSBmaXJzdCBrZXlkb3duIGV2ZW50XHJcbiAgcHJpdmF0ZSBmaXJzdEtleURvd246IGJvb2xlYW4gPSBmYWxzZTtcclxuICAvLyBDdXJyZW50IHRvdWNoIGlkIG9mIHRvdWNoIGV2ZW50IGJlaW5nIGhhbmRsZWRcclxuICBwcml2YXRlIHRvdWNoSWQ6IG51bWJlciA9IG51bGw7XHJcbiAgLy8gVmFsdWVzIHJlY29yZGVkIHdoZW4gZmlyc3QgZHJhZ2dpbmcgdGhlIGJhclxyXG4gIHByaXZhdGUgZHJhZ2dpbmc6IERyYWdnaW5nID0gbmV3IERyYWdnaW5nKCk7XHJcblxyXG4gIC8qIFNsaWRlciBET00gZWxlbWVudHMgKi9cclxuXHJcbiAgLy8gTGVmdCBzZWxlY3Rpb24gYmFyIG91dHNpZGUgdHdvIGhhbmRsZXNcclxuICBAVmlld0NoaWxkKCdsZWZ0T3V0ZXJTZWxlY3Rpb25CYXInLCB7cmVhZDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBsZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50OiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlO1xyXG5cclxuICAvLyBSaWdodCBzZWxlY3Rpb24gYmFyIG91dHNpZGUgdHdvIGhhbmRsZXNcclxuICBAVmlld0NoaWxkKCdyaWdodE91dGVyU2VsZWN0aW9uQmFyJywge3JlYWQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgcmlnaHRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmU7XHJcblxyXG4gIC8vIFRoZSB3aG9sZSBzbGlkZXIgYmFyXHJcbiAgQFZpZXdDaGlsZCgnZnVsbEJhcicsIHtyZWFkOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlfSlcclxuICBwcml2YXRlIGZ1bGxCYXJFbGVtZW50OiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlO1xyXG5cclxuICAvLyBIaWdobGlnaHQgYmV0d2VlbiB0d28gaGFuZGxlc1xyXG4gIEBWaWV3Q2hpbGQoJ3NlbGVjdGlvbkJhcicsIHtyZWFkOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlfSlcclxuICBwcml2YXRlIHNlbGVjdGlvbkJhckVsZW1lbnQ6IFNsaWRlckVsZW1lbnREaXJlY3RpdmU7XHJcblxyXG4gIC8vIExlZnQgc2xpZGVyIGhhbmRsZVxyXG4gIEBWaWV3Q2hpbGQoJ21pbkhhbmRsZScsIHtyZWFkOiBTbGlkZXJIYW5kbGVEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgbWluSGFuZGxlRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlO1xyXG5cclxuICAvLyBSaWdodCBzbGlkZXIgaGFuZGxlXHJcbiAgQFZpZXdDaGlsZCgnbWF4SGFuZGxlJywge3JlYWQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBtYXhIYW5kbGVFbGVtZW50OiBTbGlkZXJIYW5kbGVEaXJlY3RpdmU7XHJcblxyXG4gIC8vIEZsb29yIGxhYmVsXHJcbiAgQFZpZXdDaGlsZCgnZmxvb3JMYWJlbCcsIHtyZWFkOiBTbGlkZXJMYWJlbERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBmbG9vckxhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIENlaWxpbmcgbGFiZWxcclxuICBAVmlld0NoaWxkKCdjZWlsTGFiZWwnLCB7cmVhZDogU2xpZGVyTGFiZWxEaXJlY3RpdmV9KVxyXG4gIHByaXZhdGUgY2VpbExhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIExhYmVsIGFib3ZlIHRoZSBsb3cgdmFsdWVcclxuICBAVmlld0NoaWxkKCdtaW5IYW5kbGVMYWJlbCcsIHtyZWFkOiBTbGlkZXJMYWJlbERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBtaW5IYW5kbGVMYWJlbEVsZW1lbnQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlO1xyXG5cclxuICAvLyBMYWJlbCBhYm92ZSB0aGUgaGlnaCB2YWx1ZVxyXG4gIEBWaWV3Q2hpbGQoJ21heEhhbmRsZUxhYmVsJywge3JlYWQ6IFNsaWRlckxhYmVsRGlyZWN0aXZlfSlcclxuICBwcml2YXRlIG1heEhhbmRsZUxhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIENvbWJpbmVkIGxhYmVsXHJcbiAgQFZpZXdDaGlsZCgnY29tYmluZWRMYWJlbCcsIHtyZWFkOiBTbGlkZXJMYWJlbERpcmVjdGl2ZX0pXHJcbiAgcHJpdmF0ZSBjb21iaW5lZExhYmVsRWxlbWVudDogU2xpZGVyTGFiZWxEaXJlY3RpdmU7XHJcblxyXG4gIC8vIFRoZSB0aWNrc1xyXG4gIEBWaWV3Q2hpbGQoJ3RpY2tzRWxlbWVudCcsIHtyZWFkOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlfSlcclxuICBwcml2YXRlIHRpY2tzRWxlbWVudDogU2xpZGVyRWxlbWVudERpcmVjdGl2ZTtcclxuXHJcbiAgLy8gT3B0aW9uYWwgY3VzdG9tIHRlbXBsYXRlIGZvciBkaXNwbGF5aW5nIHRvb2x0aXBzXHJcbiAgQENvbnRlbnRDaGlsZCgndG9vbHRpcFRlbXBsYXRlJylcclxuICBwdWJsaWMgdG9vbHRpcFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xyXG5cclxuICAvLyBIb3N0IGVsZW1lbnQgY2xhc3MgYmluZGluZ3NcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLnZlcnRpY2FsJylcclxuICBwdWJsaWMgc2xpZGVyRWxlbWVudFZlcnRpY2FsQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASG9zdEJpbmRpbmcoJ2NsYXNzLmFuaW1hdGUnKVxyXG4gIHB1YmxpYyBzbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgQEhvc3RCaW5kaW5nKCdjbGFzcy53aXRoLWxlZ2VuZCcpXHJcbiAgcHVibGljIHNsaWRlckVsZW1lbnRXaXRoTGVnZW5kQ2xhc3M6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBASG9zdEJpbmRpbmcoJ2F0dHIuZGlzYWJsZWQnKVxyXG4gIHB1YmxpYyBzbGlkZXJFbGVtZW50RGlzYWJsZWRBdHRyOiBzdHJpbmcgPSBudWxsO1xyXG4gIEBIb3N0QmluZGluZygnYXR0ci5hcmlhLWxhYmVsJylcclxuICBwdWJsaWMgc2xpZGVyRWxlbWVudEFyaWFMYWJlbDogc3RyaW5nID0gJ25neC1zbGlkZXInO1xyXG5cclxuICAvLyBDU1Mgc3R5bGVzIGFuZCBjbGFzcyBmbGFnc1xyXG4gIHB1YmxpYyBiYXJTdHlsZTogYW55ID0ge307XHJcbiAgcHVibGljIG1pblBvaW50ZXJTdHlsZTogYW55ID0ge307XHJcbiAgcHVibGljIG1heFBvaW50ZXJTdHlsZTogYW55ID0ge307XHJcbiAgcHVibGljIGZ1bGxCYXJUcmFuc3BhcmVudENsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIHNlbGVjdGlvbkJhckRyYWdnYWJsZUNsYXNzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIHRpY2tzVW5kZXJWYWx1ZXNDbGFzczogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvLyBXaGV0aGVyIHRvIHNob3cvaGlkZSB0aWNrc1xyXG4gIHB1YmxpYyBnZXQgc2hvd1RpY2tzKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzO1xyXG4gIH1cclxuXHJcbiAgLyogSWYgdGlja1N0ZXAgaXMgc2V0IG9yIHRpY2tzQXJyYXkgaXMgc3BlY2lmaWVkLlxyXG4gICAgIEluIHRoaXMgY2FzZSwgdGlja3MgdmFsdWVzIHNob3VsZCBiZSBkaXNwbGF5ZWQgYmVsb3cgdGhlIHNsaWRlci4gKi9cclxuICBwcml2YXRlIGludGVybWVkaWF0ZVRpY2tzOiBib29sZWFuID0gZmFsc2U7XHJcbiAgLy8gVGlja3MgYXJyYXkgYXMgZGlzcGxheWVkIGluIHZpZXdcclxuICBwdWJsaWMgdGlja3M6IFRpY2tbXSA9IFtdO1xyXG5cclxuICAvLyBFdmVudCBsaXN0ZW5lcnNcclxuICBwcml2YXRlIGV2ZW50TGlzdGVuZXJIZWxwZXI6IEV2ZW50TGlzdGVuZXJIZWxwZXIgPSBudWxsO1xyXG4gIHByaXZhdGUgb25Nb3ZlRXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IG51bGw7XHJcbiAgcHJpdmF0ZSBvbkVuZEV2ZW50TGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSBudWxsO1xyXG4gIC8vIFdoZXRoZXIgY3VycmVudGx5IG1vdmluZyB0aGUgc2xpZGVyIChiZXR3ZWVuIG9uU3RhcnQoKSBhbmQgb25FbmQoKSlcclxuICBwcml2YXRlIG1vdmluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAvLyBPYnNlcnZlciBmb3Igc2xpZGVyIGVsZW1lbnQgcmVzaXplIGV2ZW50c1xyXG4gIHByaXZhdGUgcmVzaXplT2JzZXJ2ZXI6IFJlc2l6ZU9ic2VydmVyID0gbnVsbDtcclxuXHJcbiAgLy8gQ2FsbGJhY2tzIGZvciByZWFjdGl2ZSBmb3JtcyBzdXBwb3J0XHJcbiAgcHJpdmF0ZSBvblRvdWNoZWRDYWxsYmFjazogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSBudWxsO1xyXG4gIHByaXZhdGUgb25DaGFuZ2VDYWxsYmFjazogKHZhbHVlOiBhbnkpID0+IHZvaWQgPSBudWxsO1xyXG5cclxuXHJcbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcclxuICAgICAgICAgICAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjaGFuZ2VEZXRlY3Rpb25SZWY6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgem9uZTogTmdab25lKSB7XHJcbiAgICB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIgPSBuZXcgRXZlbnRMaXN0ZW5lckhlbHBlcih0aGlzLnJlbmRlcmVyKTtcclxuICB9XHJcblxyXG4gIC8vIE9uSW5pdCBpbnRlcmZhY2VcclxuICBwdWJsaWMgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zID0gbmV3IE9wdGlvbnMoKTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy52aWV3T3B0aW9ucywgdGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICAvLyBXZSBuZWVkIHRvIHJ1biB0aGVzZSB0d28gdGhpbmdzIGZpcnN0LCBiZWZvcmUgdGhlIHJlc3Qgb2YgdGhlIGluaXQgaW4gbmdBZnRlclZpZXdJbml0KCksXHJcbiAgICAvLyBiZWNhdXNlIHRoZXNlIHR3byBzZXR0aW5ncyBhcmUgc2V0IHRocm91Z2ggQEhvc3RCaW5kaW5nIGFuZCBBbmd1bGFyIGNoYW5nZSBkZXRlY3Rpb25cclxuICAgIC8vIG1lY2hhbmlzbSBkb2Vzbid0IGxpa2UgdGhlbSBjaGFuZ2luZyBpbiBuZ0FmdGVyVmlld0luaXQoKVxyXG5cclxuICAgIHRoaXMudXBkYXRlRGlzYWJsZWRTdGF0ZSgpO1xyXG4gICAgdGhpcy51cGRhdGVWZXJ0aWNhbFN0YXRlKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUFyaWFMYWJlbCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gQWZ0ZXJWaWV3SW5pdCBpbnRlcmZhY2VcclxuICBwdWJsaWMgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5hcHBseU9wdGlvbnMoKTtcclxuXHJcbiAgICB0aGlzLnN1YnNjcmliZUlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk7XHJcbiAgICB0aGlzLnN1YnNjcmliZU91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpO1xyXG5cclxuICAgIC8vIE9uY2Ugd2UgYXBwbHkgb3B0aW9ucywgd2UgbmVlZCB0byBub3JtYWxpc2UgbW9kZWwgdmFsdWVzIGZvciB0aGUgZmlyc3QgdGltZVxyXG4gICAgdGhpcy5yZW5vcm1hbGlzZU1vZGVsVmFsdWVzKCk7XHJcblxyXG4gICAgdGhpcy52aWV3TG93VmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IHRoaXMubW9kZWxWYWx1ZVRvVmlld1ZhbHVlKHRoaXMuaGlnaFZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVWZXJ0aWNhbFN0YXRlKCk7IC8vIG5lZWQgdG8gcnVuIHRoaXMgYWdhaW4gdG8gY292ZXIgY2hhbmdlcyB0byBzbGlkZXIgZWxlbWVudHNcclxuICAgIHRoaXMubWFuYWdlRWxlbWVudHNTdHlsZSgpO1xyXG4gICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKCk7XHJcbiAgICB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zKCk7XHJcbiAgICB0aGlzLmFkZEFjY2Vzc2liaWxpdHkoKTtcclxuICAgIHRoaXMudXBkYXRlQ2VpbExhYmVsKCk7XHJcbiAgICB0aGlzLnVwZGF0ZUZsb29yTGFiZWwoKTtcclxuICAgIHRoaXMuaW5pdEhhbmRsZXMoKTtcclxuICAgIHRoaXMubWFuYWdlRXZlbnRzQmluZGluZ3MoKTtcclxuICAgIHRoaXMudXBkYXRlQXJpYUxhYmVsKCk7XHJcblxyXG4gICAgdGhpcy5zdWJzY3JpYmVSZXNpemVPYnNlcnZlcigpO1xyXG5cclxuICAgIHRoaXMuaW5pdEhhc1J1biA9IHRydWU7XHJcblxyXG4gICAgLy8gUnVuIGNoYW5nZSBkZXRlY3Rpb24gbWFudWFsbHkgdG8gcmVzb2x2ZSBzb21lIGlzc3VlcyB3aGVuIGluaXQgcHJvY2VkdXJlIGNoYW5nZXMgdmFsdWVzIHVzZWQgaW4gdGhlIHZpZXdcclxuICAgIGlmICghdGhpcy5pc1JlZkRlc3Ryb3llZCgpKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIE9uQ2hhbmdlcyBpbnRlcmZhY2VcclxuICBwdWJsaWMgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgLy8gQWx3YXlzIGFwcGx5IG9wdGlvbnMgZmlyc3RcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY2hhbmdlcy5vcHRpb25zKSAmJlxyXG4gICAgIEpTT04uc3RyaW5naWZ5KGNoYW5nZXMub3B0aW9ucy5wcmV2aW91c1ZhbHVlKSAhPT0gSlNPTi5zdHJpbmdpZnkoY2hhbmdlcy5vcHRpb25zLmN1cnJlbnRWYWx1ZSkpIHtcclxuICAgICAgdGhpcy5vbkNoYW5nZU9wdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUaGVuIHZhbHVlIGNoYW5nZXNcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY2hhbmdlcy52YWx1ZSkgfHxcclxuICAgICAgICAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY2hhbmdlcy5oaWdoVmFsdWUpKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRNb2RlbENoYW5nZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgICBmb3JjZUNoYW5nZTogZmFsc2UsXHJcbiAgICAgICAgaW50ZXJuYWxDaGFuZ2U6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gT25EZXN0cm95IGludGVyZmFjZVxyXG4gIHB1YmxpYyBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XHJcblxyXG4gICAgdGhpcy51bnN1YnNjcmliZVJlc2l6ZU9ic2VydmVyKCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlSW5wdXRNb2RlbENoYW5nZVN1YmplY3QoKTtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVPdXRwdXRNb2RlbENoYW5nZVN1YmplY3QoKTtcclxuICAgIHRoaXMudW5zdWJzY3JpYmVNYW51YWxSZWZyZXNoKCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlVHJpZ2dlckZvY3VzKCk7XHJcbiAgfVxyXG5cclxuICAvLyBDb250cm9sVmFsdWVBY2Nlc3NvciBpbnRlcmZhY2VcclxuICBwdWJsaWMgd3JpdGVWYWx1ZShvYmo6IGFueSk6IHZvaWQge1xyXG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSBvYmpbMF07XHJcbiAgICAgIHRoaXMuaGlnaFZhbHVlID0gb2JqWzFdO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IG9iajtcclxuICAgIH1cclxuXHJcbiAgICAvLyBuZ09uQ2hhbmdlcygpIGlzIG5vdCBjYWxsZWQgaW4gdGhpcyBpbnN0YW5jZSwgc28gd2UgbmVlZCB0byBjb21tdW5pY2F0ZSB0aGUgY2hhbmdlIG1hbnVhbGx5XHJcbiAgICB0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0Lm5leHQoe1xyXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgZm9yY2VDaGFuZ2U6IGZhbHNlLFxyXG4gICAgICBpbnRlcm5hbENoYW5nZTogZmFsc2VcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXHJcbiAgcHVibGljIHJlZ2lzdGVyT25DaGFuZ2Uob25DaGFuZ2VDYWxsYmFjazogYW55KTogdm9pZCB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2sgPSBvbkNoYW5nZUNhbGxiYWNrO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29udHJvbFZhbHVlQWNjZXNzb3IgaW50ZXJmYWNlXHJcbiAgcHVibGljIHJlZ2lzdGVyT25Ub3VjaGVkKG9uVG91Y2hlZENhbGxiYWNrOiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sgPSBvblRvdWNoZWRDYWxsYmFjaztcclxuICB9XHJcblxyXG4gIC8vIENvbnRyb2xWYWx1ZUFjY2Vzc29yIGludGVyZmFjZVxyXG4gIHB1YmxpYyBzZXREaXNhYmxlZFN0YXRlKGlzRGlzYWJsZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMudmlld09wdGlvbnMuZGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xyXG4gICAgdGhpcy51cGRhdGVEaXNhYmxlZFN0YXRlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgc2V0QXJpYUxhYmVsKGFyaWFMYWJlbDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbCA9IGFyaWFMYWJlbDtcclxuICAgIHRoaXMudXBkYXRlQXJpYUxhYmVsKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignd2luZG93OnJlc2l6ZScsIFsnJGV2ZW50J10pXHJcbiAgcHVibGljIG9uUmVzaXplKGV2ZW50OiBhbnkpOiB2b2lkIHtcclxuICAgIHRoaXMuY2FsY3VsYXRlVmlld0RpbWVuc2lvbnNBbmREZXRlY3RDaGFuZ2VzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1YnNjcmliZUlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3ViamVjdFxyXG4gICAgLnBpcGUoXHJcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKE1vZGVsQ2hhbmdlLmNvbXBhcmUpLFxyXG4gICAgICAvLyBIYWNrIHRvIHJlc2V0IHRoZSBzdGF0dXMgb2YgdGhlIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCkgLSBpZiBhIFwiZmFrZVwiIGV2ZW50IGNvbWVzIHRocm91Z2ggd2l0aCBmb3JjZUNoYW5nZT10cnVlLFxyXG4gICAgICAvLyB3ZSBmb3JjZWZ1bGx5IGJ5LXBhc3MgZGlzdGluY3RVbnRpbENoYW5nZWQoKSwgYnV0IG90aGVyd2lzZSBkcm9wIHRoZSBldmVudFxyXG4gICAgICBmaWx0ZXIoKG1vZGVsQ2hhbmdlOiBJbnB1dE1vZGVsQ2hhbmdlKSA9PiAhbW9kZWxDaGFuZ2UuZm9yY2VDaGFuZ2UgJiYgIW1vZGVsQ2hhbmdlLmludGVybmFsQ2hhbmdlKVxyXG4gICAgKVxyXG4gICAgLnN1YnNjcmliZSgobW9kZWxDaGFuZ2U6IElucHV0TW9kZWxDaGFuZ2UpID0+IHRoaXMuYXBwbHlJbnB1dE1vZGVsQ2hhbmdlKG1vZGVsQ2hhbmdlKSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN1YnNjcmliZU91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpOiB2b2lkIHtcclxuICAgIHRoaXMub3V0cHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdFxyXG4gICAgICAucGlwZShcclxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZChNb2RlbENoYW5nZS5jb21wYXJlKVxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKG1vZGVsQ2hhbmdlOiBPdXRwdXRNb2RlbENoYW5nZSkgPT4gdGhpcy5wdWJsaXNoT3V0cHV0TW9kZWxDaGFuZ2UobW9kZWxDaGFuZ2UpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgc3Vic2NyaWJlUmVzaXplT2JzZXJ2ZXIoKTogdm9pZCB7XHJcbiAgICBpZiAoQ29tcGF0aWJpbGl0eUhlbHBlci5pc1Jlc2l6ZU9ic2VydmVyQXZhaWxhYmxlKCkpIHtcclxuICAgICAgdGhpcy5yZXNpemVPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoKTogdm9pZCA9PiB0aGlzLmNhbGN1bGF0ZVZpZXdEaW1lbnNpb25zQW5kRGV0ZWN0Q2hhbmdlcygpKTtcclxuICAgICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVSZXNpemVPYnNlcnZlcigpOiB2b2lkIHtcclxuICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzUmVzaXplT2JzZXJ2ZXJBdmFpbGFibGUoKSAmJiB0aGlzLnJlc2l6ZU9ic2VydmVyICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG4gICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVPbk1vdmUoKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lcikpIHtcclxuICAgICAgdGhpcy5ldmVudExpc3RlbmVySGVscGVyLmRldGFjaEV2ZW50TGlzdGVuZXIodGhpcy5vbk1vdmVFdmVudExpc3RlbmVyKTtcclxuICAgICAgdGhpcy5vbk1vdmVFdmVudExpc3RlbmVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVPbkVuZCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5vbkVuZEV2ZW50TGlzdGVuZXIpKSB7XHJcbiAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5kZXRhY2hFdmVudExpc3RlbmVyKHRoaXMub25FbmRFdmVudExpc3RlbmVyKTtcclxuICAgICAgdGhpcy5vbkVuZEV2ZW50TGlzdGVuZXIgPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUlucHV0TW9kZWxDaGFuZ2VTdWJqZWN0KCk6IHZvaWQge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIHRoaXMuaW5wdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLmlucHV0TW9kZWxDaGFuZ2VTdWJzY3JpcHRpb24gPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZU91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbikpIHtcclxuICAgICAgdGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVNYW51YWxSZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLm1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIHRoaXMubWFudWFsUmVmcmVzaFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICB0aGlzLm1hbnVhbFJlZnJlc2hTdWJzY3JpcHRpb24gPSBudWxsO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB1bnN1YnNjcmliZVRyaWdnZXJGb2N1cygpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy50cmlnZ2VyRm9jdXNTdWJzY3JpcHRpb24pKSB7XHJcbiAgICAgIHRoaXMudHJpZ2dlckZvY3VzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICAgIHRoaXMudHJpZ2dlckZvY3VzU3Vic2NyaXB0aW9uID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0UG9pbnRlckVsZW1lbnQocG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlKTogU2xpZGVySGFuZGxlRGlyZWN0aXZlIHtcclxuICAgIGlmIChwb2ludGVyVHlwZSA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm1pbkhhbmRsZUVsZW1lbnQ7XHJcbiAgICB9IGVsc2UgaWYgKHBvaW50ZXJUeXBlID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMubWF4SGFuZGxlRWxlbWVudDtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDdXJyZW50VHJhY2tpbmdWYWx1ZSgpOiBudW1iZXIge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdMb3dWYWx1ZTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld0hpZ2hWYWx1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBtb2RlbFZhbHVlVG9WaWV3VmFsdWUobW9kZWxWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChtb2RlbFZhbHVlKSkge1xyXG4gICAgICByZXR1cm4gTmFOO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KSAmJiAhdGhpcy52aWV3T3B0aW9ucy5iaW5kSW5kZXhGb3JTdGVwc0FycmF5KSB7XHJcbiAgICAgIHJldHVybiBWYWx1ZUhlbHBlci5maW5kU3RlcEluZGV4KCttb2RlbFZhbHVlLCB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICttb2RlbFZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSB2aWV3VmFsdWVUb01vZGVsVmFsdWUodmlld1ZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpICYmICF0aGlzLnZpZXdPcHRpb25zLmJpbmRJbmRleEZvclN0ZXBzQXJyYXkpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RlcFZhbHVlKHZpZXdWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdmlld1ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRTdGVwVmFsdWUoc2xpZGVyVmFsdWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBzdGVwOiBDdXN0b21TdGVwRGVmaW5pdGlvbiA9IHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheVtzbGlkZXJWYWx1ZV07XHJcbiAgICByZXR1cm4gKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChzdGVwKSkgPyBzdGVwLnZhbHVlIDogTmFOO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhcHBseVZpZXdDaGFuZ2UoKTogdm9pZCB7XHJcbiAgICB0aGlzLnZhbHVlID0gdGhpcy52aWV3VmFsdWVUb01vZGVsVmFsdWUodGhpcy52aWV3TG93VmFsdWUpO1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy5oaWdoVmFsdWUgPSB0aGlzLnZpZXdWYWx1ZVRvTW9kZWxWYWx1ZSh0aGlzLnZpZXdIaWdoVmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMub3V0cHV0TW9kZWxDaGFuZ2VTdWJqZWN0Lm5leHQoe1xyXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgdXNlckV2ZW50SW5pdGlhdGVkOiB0cnVlLFxyXG4gICAgICBmb3JjZUNoYW5nZTogZmFsc2VcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEF0IHRoaXMgcG9pbnQgYWxsIGNoYW5nZXMgYXJlIGFwcGxpZWQgYW5kIG91dHB1dHMgYXJlIGVtaXR0ZWQsIHNvIHdlIHNob3VsZCBiZSBkb25lLlxyXG4gICAgLy8gSG93ZXZlciwgaW5wdXQgY2hhbmdlcyBhcmUgY29tbXVuaWNhdGVkIGluIGRpZmZlcmVudCBzdHJlYW0gYW5kIHdlIG5lZWQgdG8gYmUgcmVhZHkgdG9cclxuICAgIC8vIGFjdCBvbiB0aGUgbmV4dCBpbnB1dCBjaGFuZ2UgZXZlbiBpZiBpdCBpcyBleGFjdGx5IHRoZSBzYW1lIGFzIGxhc3QgaW5wdXQgY2hhbmdlLlxyXG4gICAgLy8gVGhlcmVmb3JlLCB3ZSBzZW5kIGEgc3BlY2lhbCBldmVudCB0byByZXNldCB0aGUgc3RyZWFtLlxyXG4gICAgdGhpcy5pbnB1dE1vZGVsQ2hhbmdlU3ViamVjdC5uZXh0KHtcclxuICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgIGhpZ2hWYWx1ZTogdGhpcy5oaWdoVmFsdWUsXHJcbiAgICAgIGZvcmNlQ2hhbmdlOiBmYWxzZSxcclxuICAgICAgaW50ZXJuYWxDaGFuZ2U6IHRydWVcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQXBwbHkgbW9kZWwgY2hhbmdlIHRvIHRoZSBzbGlkZXIgdmlld1xyXG4gIHByaXZhdGUgYXBwbHlJbnB1dE1vZGVsQ2hhbmdlKG1vZGVsQ2hhbmdlOiBJbnB1dE1vZGVsQ2hhbmdlKTogdm9pZCB7XHJcbiAgICBjb25zdCBub3JtYWxpc2VkTW9kZWxDaGFuZ2U6IE1vZGVsVmFsdWVzID0gdGhpcy5ub3JtYWxpc2VNb2RlbFZhbHVlcyhtb2RlbENoYW5nZSk7XHJcblxyXG4gICAgLy8gSWYgbm9ybWFsaXNlZCBtb2RlbCBjaGFuZ2UgaXMgZGlmZmVyZW50LCBhcHBseSB0aGUgY2hhbmdlIHRvIHRoZSBtb2RlbCB2YWx1ZXNcclxuICAgIGNvbnN0IG5vcm1hbGlzYXRpb25DaGFuZ2U6IGJvb2xlYW4gPSAhTW9kZWxWYWx1ZXMuY29tcGFyZShtb2RlbENoYW5nZSwgbm9ybWFsaXNlZE1vZGVsQ2hhbmdlKTtcclxuICAgIGlmIChub3JtYWxpc2F0aW9uQ2hhbmdlKSB7XHJcbiAgICAgIHRoaXMudmFsdWUgPSBub3JtYWxpc2VkTW9kZWxDaGFuZ2UudmFsdWU7XHJcbiAgICAgIHRoaXMuaGlnaFZhbHVlID0gbm9ybWFsaXNlZE1vZGVsQ2hhbmdlLmhpZ2hWYWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXdMb3dWYWx1ZSA9IHRoaXMubW9kZWxWYWx1ZVRvVmlld1ZhbHVlKG5vcm1hbGlzZWRNb2RlbENoYW5nZS52YWx1ZSk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZShub3JtYWxpc2VkTW9kZWxDaGFuZ2UuaGlnaFZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVMb3dIYW5kbGUodGhpcy52YWx1ZVRvUG9zaXRpb24odGhpcy52aWV3TG93VmFsdWUpKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlSGlnaEhhbmRsZSh0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdIaWdoVmFsdWUpKTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uQmFyKCk7XHJcbiAgICB0aGlzLnVwZGF0ZVRpY2tzU2NhbGUoKTtcclxuICAgIHRoaXMudXBkYXRlQXJpYUF0dHJpYnV0ZXMoKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlQ29tYmluZWRMYWJlbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEF0IHRoZSBlbmQsIHdlIG5lZWQgdG8gY29tbXVuaWNhdGUgdGhlIG1vZGVsIGNoYW5nZSB0byB0aGUgb3V0cHV0cyBhcyB3ZWxsXHJcbiAgICAvLyBOb3JtYWxpc2F0aW9uIGNoYW5nZXMgYXJlIGFsc28gYWx3YXlzIGZvcmNlZCBvdXQgdG8gZW5zdXJlIHRoYXQgc3Vic2NyaWJlcnMgYWx3YXlzIGVuZCB1cCBpbiBjb3JyZWN0IHN0YXRlXHJcbiAgICB0aGlzLm91dHB1dE1vZGVsQ2hhbmdlU3ViamVjdC5uZXh0KHtcclxuICAgICAgdmFsdWU6IG5vcm1hbGlzZWRNb2RlbENoYW5nZS52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiBub3JtYWxpc2VkTW9kZWxDaGFuZ2UuaGlnaFZhbHVlLFxyXG4gICAgICBmb3JjZUNoYW5nZTogbm9ybWFsaXNhdGlvbkNoYW5nZSxcclxuICAgICAgdXNlckV2ZW50SW5pdGlhdGVkOiBmYWxzZVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvLyBQdWJsaXNoIG1vZGVsIGNoYW5nZSB0byBvdXRwdXQgZXZlbnQgZW1pdHRlcnMgYW5kIHJlZ2lzdGVyZWQgY2FsbGJhY2tzXHJcbiAgcHJpdmF0ZSBwdWJsaXNoT3V0cHV0TW9kZWxDaGFuZ2UobW9kZWxDaGFuZ2U6IE91dHB1dE1vZGVsQ2hhbmdlKTogdm9pZCB7XHJcbiAgICBjb25zdCBlbWl0T3V0cHV0czogKCkgPT4gdm9pZCA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KG1vZGVsQ2hhbmdlLnZhbHVlKTtcclxuICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgICB0aGlzLmhpZ2hWYWx1ZUNoYW5nZS5lbWl0KG1vZGVsQ2hhbmdlLmhpZ2hWYWx1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5vbkNoYW5nZUNhbGxiYWNrKSkge1xyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlQ2FsbGJhY2soW21vZGVsQ2hhbmdlLnZhbHVlLCBtb2RlbENoYW5nZS5oaWdoVmFsdWVdKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUNhbGxiYWNrKG1vZGVsQ2hhbmdlLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLm9uVG91Y2hlZENhbGxiYWNrKSkge1xyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgICB0aGlzLm9uVG91Y2hlZENhbGxiYWNrKFttb2RlbENoYW5nZS52YWx1ZSwgbW9kZWxDaGFuZ2UuaGlnaFZhbHVlXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMub25Ub3VjaGVkQ2FsbGJhY2sobW9kZWxDaGFuZ2UudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAobW9kZWxDaGFuZ2UudXNlckV2ZW50SW5pdGlhdGVkKSB7XHJcbiAgICAgIC8vIElmIHRoaXMgY2hhbmdlIHdhcyBpbml0aWF0ZWQgYnkgYSB1c2VyIGV2ZW50LCB3ZSBjYW4gZW1pdCBvdXRwdXRzIGluIHRoZSBzYW1lIHRpY2tcclxuICAgICAgZW1pdE91dHB1dHMoKTtcclxuICAgICAgdGhpcy51c2VyQ2hhbmdlLmVtaXQodGhpcy5nZXRDaGFuZ2VDb250ZXh0KCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gQnV0LCBpZiB0aGUgY2hhbmdlIHdhcyBpbml0YXRlZCBieSBzb21ldGhpbmcgZWxzZSBsaWtlIGEgY2hhbmdlIGluIGlucHV0IGJpbmRpbmdzLFxyXG4gICAgICAvLyB3ZSBuZWVkIHRvIHdhaXQgdW50aWwgbmV4dCB0aWNrIHRvIGVtaXQgdGhlIG91dHB1dHMgdG8ga2VlcCBBbmd1bGFyIGNoYW5nZSBkZXRlY3Rpb24gaGFwcHlcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7IGVtaXRPdXRwdXRzKCk7IH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub3JtYWxpc2VNb2RlbFZhbHVlcyhpbnB1dDogTW9kZWxWYWx1ZXMpOiBNb2RlbFZhbHVlcyB7XHJcbiAgICBjb25zdCBub3JtYWxpc2VkSW5wdXQ6IE1vZGVsVmFsdWVzID0gbmV3IE1vZGVsVmFsdWVzKCk7XHJcbiAgICBub3JtYWxpc2VkSW5wdXQudmFsdWUgPSBpbnB1dC52YWx1ZTtcclxuICAgIG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUgPSBpbnB1dC5oaWdoVmFsdWU7XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpKSB7XHJcbiAgICAgIC8vIFdoZW4gdXNpbmcgc3RlcHMgYXJyYXksIG9ubHkgcm91bmQgdG8gbmVhcmVzdCBzdGVwIGluIHRoZSBhcnJheVxyXG4gICAgICAvLyBObyBvdGhlciBlbmZvcmNlbWVudCBjYW4gYmUgZG9uZSwgYXMgdGhlIHN0ZXAgYXJyYXkgbWF5IGJlIG91dCBvZiBvcmRlciwgYW5kIHRoYXQgaXMgcGVyZmVjdGx5IGZpbmVcclxuICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMuZW5mb3JjZVN0ZXBzQXJyYXkpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZUluZGV4OiBudW1iZXIgPSBWYWx1ZUhlbHBlci5maW5kU3RlcEluZGV4KG5vcm1hbGlzZWRJbnB1dC52YWx1ZSwgdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KTtcclxuICAgICAgICBub3JtYWxpc2VkSW5wdXQudmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXlbdmFsdWVJbmRleF0udmFsdWU7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgICBjb25zdCBoaWdoVmFsdWVJbmRleDogbnVtYmVyID0gVmFsdWVIZWxwZXIuZmluZFN0ZXBJbmRleChub3JtYWxpc2VkSW5wdXQuaGlnaFZhbHVlLCB0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpO1xyXG4gICAgICAgICAgbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZSA9IHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheVtoaWdoVmFsdWVJbmRleF0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbm9ybWFsaXNlZElucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmVuZm9yY2VTdGVwKSB7XHJcbiAgICAgIG5vcm1hbGlzZWRJbnB1dC52YWx1ZSA9IHRoaXMucm91bmRTdGVwKG5vcm1hbGlzZWRJbnB1dC52YWx1ZSk7XHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZSA9IHRoaXMucm91bmRTdGVwKG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuZW5mb3JjZVJhbmdlKSB7XHJcbiAgICAgIG5vcm1hbGlzZWRJbnB1dC52YWx1ZSA9IE1hdGhIZWxwZXIuY2xhbXBUb1JhbmdlKG5vcm1hbGlzZWRJbnB1dC52YWx1ZSwgdGhpcy52aWV3T3B0aW9ucy5mbG9vciwgdGhpcy52aWV3T3B0aW9ucy5jZWlsKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZSA9IE1hdGhIZWxwZXIuY2xhbXBUb1JhbmdlKG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUsIHRoaXMudmlld09wdGlvbnMuZmxvb3IsIHRoaXMudmlld09wdGlvbnMuY2VpbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8vIE1ha2Ugc3VyZSB0aGF0IHJhbmdlIHNsaWRlciBpbnZhcmlhbnQgKHZhbHVlIDw9IGhpZ2hWYWx1ZSkgaXMgYWx3YXlzIHNhdGlzZmllZFxyXG4gICAgICBpZiAodGhpcy5yYW5nZSAmJiBpbnB1dC52YWx1ZSA+IGlucHV0LmhpZ2hWYWx1ZSkge1xyXG4gICAgICAgIC8vIFdlIGtub3cgdGhhdCBib3RoIHZhbHVlcyBhcmUgbm93IGNsYW1wZWQgY29ycmVjdGx5LCB0aGV5IG1heSBqdXN0IGJlIGluIHRoZSB3cm9uZyBvcmRlclxyXG4gICAgICAgIC8vIFNvIHRoZSBlYXN5IHNvbHV0aW9uIGlzIHRvIHN3YXAgdGhlbS4uLiBleGNlcHQgc3dhcHBpbmcgaXMgc29tZXRpbWVzIGRpc2FibGVkIGluIG9wdGlvbnMsIHNvIHdlIG1ha2UgdGhlIHR3byB2YWx1ZXMgdGhlIHNhbWVcclxuICAgICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5ub1N3aXRjaGluZykge1xyXG4gICAgICAgICAgbm9ybWFsaXNlZElucHV0LnZhbHVlID0gbm9ybWFsaXNlZElucHV0LmhpZ2hWYWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgdGVtcFZhbHVlOiBudW1iZXIgPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICAgIG5vcm1hbGlzZWRJbnB1dC52YWx1ZSA9IGlucHV0LmhpZ2hWYWx1ZTtcclxuICAgICAgICAgIG5vcm1hbGlzZWRJbnB1dC5oaWdoVmFsdWUgPSB0ZW1wVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5vcm1hbGlzZWRJbnB1dDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVub3JtYWxpc2VNb2RlbFZhbHVlcygpOiB2b2lkIHtcclxuICAgIGNvbnN0IHByZXZpb3VzTW9kZWxWYWx1ZXM6IE1vZGVsVmFsdWVzID0ge1xyXG4gICAgICB2YWx1ZTogdGhpcy52YWx1ZSxcclxuICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZVxyXG4gICAgfTtcclxuICAgIGNvbnN0IG5vcm1hbGlzZWRNb2RlbFZhbHVlczogTW9kZWxWYWx1ZXMgPSB0aGlzLm5vcm1hbGlzZU1vZGVsVmFsdWVzKHByZXZpb3VzTW9kZWxWYWx1ZXMpO1xyXG4gICAgaWYgKCFNb2RlbFZhbHVlcy5jb21wYXJlKG5vcm1hbGlzZWRNb2RlbFZhbHVlcywgcHJldmlvdXNNb2RlbFZhbHVlcykpIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IG5vcm1hbGlzZWRNb2RlbFZhbHVlcy52YWx1ZTtcclxuICAgICAgdGhpcy5oaWdoVmFsdWUgPSBub3JtYWxpc2VkTW9kZWxWYWx1ZXMuaGlnaFZhbHVlO1xyXG5cclxuICAgICAgdGhpcy5vdXRwdXRNb2RlbENoYW5nZVN1YmplY3QubmV4dCh7XHJcbiAgICAgICAgdmFsdWU6IHRoaXMudmFsdWUsXHJcbiAgICAgICAgaGlnaFZhbHVlOiB0aGlzLmhpZ2hWYWx1ZSxcclxuICAgICAgICBmb3JjZUNoYW5nZTogdHJ1ZSxcclxuICAgICAgICB1c2VyRXZlbnRJbml0aWF0ZWQ6IGZhbHNlXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkNoYW5nZU9wdGlvbnMoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuaW5pdEhhc1J1bikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcHJldmlvdXNPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzOiBib29sZWFuW10gPSB0aGlzLmdldE9wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3ModGhpcy52aWV3T3B0aW9ucyk7XHJcblxyXG4gICAgdGhpcy5hcHBseU9wdGlvbnMoKTtcclxuXHJcbiAgICBjb25zdCBuZXdPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzOiBib29sZWFuW10gPSB0aGlzLmdldE9wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3ModGhpcy52aWV3T3B0aW9ucyk7XHJcbiAgICAvLyBBdm9pZCByZS1iaW5kaW5nIGV2ZW50cyBpbiBjYXNlIG5vdGhpbmcgY2hhbmdlcyB0aGF0IGNhbiBpbmZsdWVuY2UgaXRcclxuICAgIC8vIEl0IG1ha2VzIGl0IHBvc3NpYmxlIHRvIGNoYW5nZSBvcHRpb25zIHdoaWxlIGRyYWdnaW5nIHRoZSBzbGlkZXJcclxuICAgIGNvbnN0IHJlYmluZEV2ZW50czogYm9vbGVhbiA9ICFWYWx1ZUhlbHBlci5hcmVBcnJheXNFcXVhbChwcmV2aW91c09wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3MsIG5ld09wdGlvbnNJbmZsdWVuY2luZ0V2ZW50QmluZGluZ3MpO1xyXG5cclxuICAgIC8vIFdpdGggbmV3IG9wdGlvbnMsIHdlIG5lZWQgdG8gcmUtbm9ybWFsaXNlIG1vZGVsIHZhbHVlcyBpZiBuZWNlc3NhcnlcclxuICAgIHRoaXMucmVub3JtYWxpc2VNb2RlbFZhbHVlcygpO1xyXG5cclxuICAgIHRoaXMudmlld0xvd1ZhbHVlID0gdGhpcy5tb2RlbFZhbHVlVG9WaWV3VmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSB0aGlzLm1vZGVsVmFsdWVUb1ZpZXdWYWx1ZSh0aGlzLmhpZ2hWYWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVzZXRTbGlkZXIocmViaW5kRXZlbnRzKTtcclxuICB9XHJcblxyXG4gIC8vIFJlYWQgdGhlIHVzZXIgb3B0aW9ucyBhbmQgYXBwbHkgdGhlbSB0byB0aGUgc2xpZGVyIG1vZGVsXHJcbiAgcHJpdmF0ZSBhcHBseU9wdGlvbnMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zID0gbmV3IE9wdGlvbnMoKTtcclxuICAgIE9iamVjdC5hc3NpZ24odGhpcy52aWV3T3B0aW9ucywgdGhpcy5vcHRpb25zKTtcclxuXHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlID0gdGhpcy5yYW5nZSAmJiB0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlO1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5kcmFnZ2FibGVSYW5nZU9ubHkgPSB0aGlzLnJhbmdlICYmIHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5O1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5KSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2UgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzID0gdGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3MgfHxcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3NWYWx1ZXMgfHxcclxuICAgICAgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja3NBcnJheSk7XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3MgJiZcclxuICAgICAgICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCkgfHwgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja3NBcnJheSkpKSB7XHJcbiAgICAgIHRoaXMuaW50ZXJtZWRpYXRlVGlja3MgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhciA9IHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhciB8fFxyXG4gICAgICB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJFbmQgfHxcclxuICAgICAgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZSk7XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnN0ZXBzQXJyYXkpKSB7XHJcbiAgICAgIHRoaXMuYXBwbHlTdGVwc0FycmF5T3B0aW9ucygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5hcHBseUZsb29yQ2VpbE9wdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5jb21iaW5lTGFiZWxzKSkge1xyXG4gICAgICB0aGlzLnZpZXdPcHRpb25zLmNvbWJpbmVMYWJlbHMgPSAobWluVmFsdWU6IHN0cmluZywgbWF4VmFsdWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG1pblZhbHVlICsgJyAtICcgKyBtYXhWYWx1ZTtcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5sb2dTY2FsZSAmJiB0aGlzLnZpZXdPcHRpb25zLmZsb29yID09PSAwKSB7XHJcbiAgICAgIHRocm93IEVycm9yKCdDYW5cXCd0IHVzZSBmbG9vcj0wIHdpdGggbG9nYXJpdGhtaWMgc2NhbGUnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlTdGVwc0FycmF5T3B0aW9ucygpOiB2b2lkIHtcclxuICAgIHRoaXMudmlld09wdGlvbnMuZmxvb3IgPSAwO1xyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5jZWlsID0gdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5Lmxlbmd0aCAtIDE7XHJcbiAgICB0aGlzLnZpZXdPcHRpb25zLnN0ZXAgPSAxO1xyXG5cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRyYW5zbGF0ZSkpIHtcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUgPSAobW9kZWxWYWx1ZTogbnVtYmVyKTogc3RyaW5nID0+IHtcclxuICAgICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5iaW5kSW5kZXhGb3JTdGVwc0FycmF5KSB7XHJcbiAgICAgICAgICByZXR1cm4gU3RyaW5nKHRoaXMuZ2V0U3RlcFZhbHVlKG1vZGVsVmFsdWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIFN0cmluZyhtb2RlbFZhbHVlKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlGbG9vckNlaWxPcHRpb25zKCk6IHZvaWQge1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc3RlcCkpIHtcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5zdGVwID0gMTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMuc3RlcCA9ICt0aGlzLnZpZXdPcHRpb25zLnN0ZXA7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnN0ZXAgPD0gMCkge1xyXG4gICAgICAgIHRoaXMudmlld09wdGlvbnMuc3RlcCA9IDE7XHJcbiAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmNlaWwpIHx8XHJcbiAgICAgICAgVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5mbG9vcikpIHtcclxuICAgICAgdGhyb3cgRXJyb3IoJ2Zsb29yIGFuZCBjZWlsIG9wdGlvbnMgbXVzdCBiZSBzdXBwbGllZCcpO1xyXG4gICAgfVxyXG4gICAgdGhpcy52aWV3T3B0aW9ucy5jZWlsID0gK3RoaXMudmlld09wdGlvbnMuY2VpbDtcclxuICAgIHRoaXMudmlld09wdGlvbnMuZmxvb3IgPSArdGhpcy52aWV3T3B0aW9ucy5mbG9vcjtcclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUpKSB7XHJcbiAgICAgIHRoaXMudmlld09wdGlvbnMudHJhbnNsYXRlID0gKHZhbHVlOiBudW1iZXIpOiBzdHJpbmcgPT4gU3RyaW5nKHZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFJlc2V0cyBzbGlkZXJcclxuICBwcml2YXRlIHJlc2V0U2xpZGVyKHJlYmluZEV2ZW50czogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcclxuICAgIHRoaXMubWFuYWdlRWxlbWVudHNTdHlsZSgpO1xyXG4gICAgdGhpcy5hZGRBY2Nlc3NpYmlsaXR5KCk7XHJcbiAgICB0aGlzLnVwZGF0ZUNlaWxMYWJlbCgpO1xyXG4gICAgdGhpcy51cGRhdGVGbG9vckxhYmVsKCk7XHJcbiAgICBpZiAocmViaW5kRXZlbnRzKSB7XHJcbiAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XHJcbiAgICAgIHRoaXMubWFuYWdlRXZlbnRzQmluZGluZ3MoKTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlRGlzYWJsZWRTdGF0ZSgpO1xyXG4gICAgdGhpcy51cGRhdGVBcmlhTGFiZWwoKTtcclxuICAgIHRoaXMuY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoKTtcclxuICAgIHRoaXMucmVmb2N1c1BvaW50ZXJJZk5lZWRlZCgpO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0cyBmb2N1cyBvbiB0aGUgc3BlY2lmaWVkIHBvaW50ZXJcclxuICBwcml2YXRlIGZvY3VzUG9pbnRlcihwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpOiB2b2lkIHtcclxuICAgIC8vIElmIG5vdCBzdXBwbGllZCwgdXNlIG1pbiBwb2ludGVyIGFzIGRlZmF1bHRcclxuICAgIGlmIChwb2ludGVyVHlwZSAhPT0gUG9pbnRlclR5cGUuTWluICYmIHBvaW50ZXJUeXBlICE9PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcG9pbnRlclR5cGUgPSBQb2ludGVyVHlwZS5NaW47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHBvaW50ZXJUeXBlID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMucmFuZ2UgJiYgcG9pbnRlclR5cGUgPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVmb2N1c1BvaW50ZXJJZk5lZWRlZCgpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5jdXJyZW50Rm9jdXNQb2ludGVyKSkge1xyXG4gICAgICB0aGlzLm9uUG9pbnRlckZvY3VzKHRoaXMuY3VycmVudEZvY3VzUG9pbnRlcik7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZSA9IHRoaXMuZ2V0UG9pbnRlckVsZW1lbnQodGhpcy5jdXJyZW50Rm9jdXNQb2ludGVyKTtcclxuICAgICAgZWxlbWVudC5mb2N1cygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIGVhY2ggZWxlbWVudHMgc3R5bGUgYmFzZWQgb24gb3B0aW9uc1xyXG4gIHByaXZhdGUgbWFuYWdlRWxlbWVudHNTdHlsZSgpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlU2NhbGUoKTtcclxuICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuc2V0QWx3YXlzSGlkZSh0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrc1ZhbHVlcyB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVMaW1pdExhYmVscyk7XHJcbiAgICB0aGlzLmNlaWxMYWJlbEVsZW1lbnQuc2V0QWx3YXlzSGlkZSh0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrc1ZhbHVlcyB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVMaW1pdExhYmVscyk7XHJcblxyXG4gICAgY29uc3QgaGlkZUxhYmVsc0ZvclRpY2tzOiBib29sZWFuID0gdGhpcy52aWV3T3B0aW9ucy5zaG93VGlja3NWYWx1ZXMgJiYgIXRoaXMuaW50ZXJtZWRpYXRlVGlja3M7XHJcbiAgICB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5zZXRBbHdheXNIaWRlKGhpZGVMYWJlbHNGb3JUaWNrcyB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVQb2ludGVyTGFiZWxzKTtcclxuICAgIHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LnNldEFsd2F5c0hpZGUoaGlkZUxhYmVsc0ZvclRpY2tzIHx8ICF0aGlzLnJhbmdlIHx8IHRoaXMudmlld09wdGlvbnMuaGlkZVBvaW50ZXJMYWJlbHMpO1xyXG4gICAgdGhpcy5jb21iaW5lZExhYmVsRWxlbWVudC5zZXRBbHdheXNIaWRlKGhpZGVMYWJlbHNGb3JUaWNrcyB8fCAhdGhpcy5yYW5nZSB8fCB0aGlzLnZpZXdPcHRpb25zLmhpZGVQb2ludGVyTGFiZWxzKTtcclxuICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudC5zZXRBbHdheXNIaWRlKCF0aGlzLnJhbmdlICYmICF0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXIpO1xyXG4gICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldEFsd2F5c0hpZGUoIXRoaXMucmFuZ2UgfHwgIXRoaXMudmlld09wdGlvbnMuc2hvd091dGVyU2VsZWN0aW9uQmFycyk7XHJcbiAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldEFsd2F5c0hpZGUoIXRoaXMucmFuZ2UgfHwgIXRoaXMudmlld09wdGlvbnMuc2hvd091dGVyU2VsZWN0aW9uQmFycyk7XHJcblxyXG4gICAgdGhpcy5mdWxsQmFyVHJhbnNwYXJlbnRDbGFzcyA9IHRoaXMucmFuZ2UgJiYgdGhpcy52aWV3T3B0aW9ucy5zaG93T3V0ZXJTZWxlY3Rpb25CYXJzO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25CYXJEcmFnZ2FibGVDbGFzcyA9IHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2UgJiYgIXRoaXMudmlld09wdGlvbnMub25seUJpbmRIYW5kbGVzO1xyXG4gICAgdGhpcy50aWNrc1VuZGVyVmFsdWVzQ2xhc3MgPSB0aGlzLmludGVybWVkaWF0ZVRpY2tzICYmIHRoaXMub3B0aW9ucy5zaG93VGlja3NWYWx1ZXM7XHJcblxyXG4gICAgaWYgKHRoaXMuc2xpZGVyRWxlbWVudFZlcnRpY2FsQ2xhc3MgIT09IHRoaXMudmlld09wdGlvbnMudmVydGljYWwpIHtcclxuICAgICAgdGhpcy51cGRhdGVWZXJ0aWNhbFN0YXRlKCk7XHJcbiAgICAgIC8vIFRoZSBhYm92ZSBjaGFuZ2UgaW4gaG9zdCBjb21wb25lbnQgY2xhc3Mgd2lsbCBub3QgYmUgYXBwbGllZCB1bnRpbCB0aGUgZW5kIG9mIHRoaXMgY3ljbGVcclxuICAgICAgLy8gSG93ZXZlciwgZnVuY3Rpb25zIGNhbGN1bGF0aW5nIHRoZSBzbGlkZXIgcG9zaXRpb24gZXhwZWN0IHRoZSBzbGlkZXIgdG8gYmUgYWxyZWFkeSBzdHlsZWQgYXMgdmVydGljYWxcclxuICAgICAgLy8gU28gYXMgYSB3b3JrYXJvdW5kLCB3ZSBuZWVkIHRvIHJlc2V0IHRoZSBzbGlkZXIgb25jZSBhZ2FpbiB0byBjb21wdXRlIHRoZSBjb3JyZWN0IHZhbHVlc1xyXG4gICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+IHsgdGhpcy5yZXNldFNsaWRlcigpOyB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGFuZ2luZyBhbmltYXRlIGNsYXNzIG1heSBpbnRlcmZlcmUgd2l0aCBzbGlkZXIgcmVzZXQvaW5pdGlhbGlzYXRpb24sIHNvIHdlIHNob3VsZCBzZXQgaXQgc2VwYXJhdGVseSxcclxuICAgIC8vIGFmdGVyIGFsbCBpcyBwcm9wZXJseSBzZXQgdXBcclxuICAgIGlmICh0aGlzLnNsaWRlckVsZW1lbnRBbmltYXRlQ2xhc3MgIT09IHRoaXMudmlld09wdGlvbnMuYW5pbWF0ZSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpOiB2b2lkID0+IHsgdGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzID0gdGhpcy52aWV3T3B0aW9ucy5hbmltYXRlOyB9KTtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlUm90YXRlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBNYW5hZ2UgdGhlIGV2ZW50cyBiaW5kaW5ncyBiYXNlZCBvbiByZWFkT25seSBhbmQgZGlzYWJsZWQgb3B0aW9uc1xyXG4gIHByaXZhdGUgbWFuYWdlRXZlbnRzQmluZGluZ3MoKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5kaXNhYmxlZCB8fCB0aGlzLnZpZXdPcHRpb25zLnJlYWRPbmx5KSB7XHJcbiAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmJpbmRFdmVudHMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFNldCB0aGUgZGlzYWJsZWQgc3RhdGUgYmFzZWQgb24gZGlzYWJsZWQgb3B0aW9uXHJcbiAgcHJpdmF0ZSB1cGRhdGVEaXNhYmxlZFN0YXRlKCk6IHZvaWQge1xyXG4gICAgdGhpcy5zbGlkZXJFbGVtZW50RGlzYWJsZWRBdHRyID0gdGhpcy52aWV3T3B0aW9ucy5kaXNhYmxlZCA/ICdkaXNhYmxlZCcgOiBudWxsO1xyXG4gIH1cclxuXHJcbiAgLy8gU2V0IHRoZSBhcmlhLWxhYmVsIHN0YXRlIGJhc2VkIG9uIGFyaWFMYWJlbCBvcHRpb25cclxuICBwcml2YXRlIHVwZGF0ZUFyaWFMYWJlbCgpOiB2b2lkIHtcclxuICAgIHRoaXMuc2xpZGVyRWxlbWVudEFyaWFMYWJlbCA9IHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsIHx8ICdueGctc2xpZGVyJztcclxuICB9XHJcblxyXG4gIC8vIFNldCB2ZXJ0aWNhbCBzdGF0ZSBiYXNlZCBvbiB2ZXJ0aWNhbCBvcHRpb25cclxuICBwcml2YXRlIHVwZGF0ZVZlcnRpY2FsU3RhdGUoKTogdm9pZCB7XHJcbiAgICB0aGlzLnNsaWRlckVsZW1lbnRWZXJ0aWNhbENsYXNzID0gdGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbDtcclxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0aGlzLmdldEFsbFNsaWRlckVsZW1lbnRzKCkpIHtcclxuICAgICAgLy8gVGhpcyBpcyBhbHNvIGNhbGxlZCBiZWZvcmUgbmdBZnRlckluaXQsIHNvIG5lZWQgdG8gY2hlY2sgdGhhdCB2aWV3IGNoaWxkIGJpbmRpbmdzIHdvcmtcclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChlbGVtZW50KSkge1xyXG4gICAgICAgIGVsZW1lbnQuc2V0VmVydGljYWwodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdXBkYXRlU2NhbGUoKTogdm9pZCB7XHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5nZXRBbGxTbGlkZXJFbGVtZW50cygpKSB7XHJcbiAgICAgIGVsZW1lbnQuc2V0U2NhbGUodGhpcy52aWV3T3B0aW9ucy5zY2FsZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVJvdGF0ZSgpOiB2b2lkIHtcclxuICAgIGZvciAoY29uc3QgZWxlbWVudCBvZiB0aGlzLmdldEFsbFNsaWRlckVsZW1lbnRzKCkpIHtcclxuICAgICAgZWxlbWVudC5zZXRSb3RhdGUodGhpcy52aWV3T3B0aW9ucy5yb3RhdGUpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRBbGxTbGlkZXJFbGVtZW50cygpOiBTbGlkZXJFbGVtZW50RGlyZWN0aXZlW10ge1xyXG4gICAgcmV0dXJuIFt0aGlzLmxlZnRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQsXHJcbiAgICAgIHRoaXMucmlnaHRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQsXHJcbiAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQsXHJcbiAgICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudCxcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LFxyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQsXHJcbiAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQsXHJcbiAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudCxcclxuICAgICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQsXHJcbiAgICAgIHRoaXMubWF4SGFuZGxlTGFiZWxFbGVtZW50LFxyXG4gICAgICB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LFxyXG4gICAgICB0aGlzLnRpY2tzRWxlbWVudFxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIC8vIEluaXRpYWxpemUgc2xpZGVyIGhhbmRsZXMgcG9zaXRpb25zIGFuZCBsYWJlbHNcclxuICAvLyBSdW4gb25seSBvbmNlIGR1cmluZyBpbml0aWFsaXphdGlvbiBhbmQgZXZlcnkgdGltZSB2aWV3IHBvcnQgY2hhbmdlcyBzaXplXHJcbiAgcHJpdmF0ZSBpbml0SGFuZGxlcygpOiB2b2lkIHtcclxuICAgIHRoaXMudXBkYXRlTG93SGFuZGxlKHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0xvd1ZhbHVlKSk7XHJcblxyXG4gICAgLypcclxuICAgdGhlIG9yZGVyIGhlcmUgaXMgaW1wb3J0YW50IHNpbmNlIHRoZSBzZWxlY3Rpb24gYmFyIHNob3VsZCBiZVxyXG4gICB1cGRhdGVkIGFmdGVyIHRoZSBoaWdoIGhhbmRsZSBidXQgYmVmb3JlIHRoZSBjb21iaW5lZCBsYWJlbFxyXG4gICAqL1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy51cGRhdGVIaWdoSGFuZGxlKHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXBkYXRlU2VsZWN0aW9uQmFyKCk7XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgdGhpcy51cGRhdGVDb21iaW5lZExhYmVsKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy51cGRhdGVUaWNrc1NjYWxlKCk7XHJcbiAgfVxyXG5cclxuICAvLyBBZGRzIGFjY2Vzc2liaWxpdHkgYXR0cmlidXRlcywgcnVuIG9ubHkgb25jZSBkdXJpbmcgaW5pdGlhbGl6YXRpb25cclxuICBwcml2YXRlIGFkZEFjY2Vzc2liaWxpdHkoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcblxyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnJvbGUgPSAnc2xpZGVyJztcclxuXHJcbiAgICBpZiAoIHRoaXMudmlld09wdGlvbnMua2V5Ym9hcmRTdXBwb3J0ICYmXHJcbiAgICAgICEodGhpcy52aWV3T3B0aW9ucy5yZWFkT25seSB8fCB0aGlzLnZpZXdPcHRpb25zLmRpc2FibGVkKSApIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnRhYmluZGV4ID0gJzAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnRhYmluZGV4ID0gJyc7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFPcmllbnRhdGlvbiA9ICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/ICd2ZXJ0aWNhbCcgOiAnaG9yaXpvbnRhbCc7XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbCkpIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFMYWJlbCA9IHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsO1xyXG4gICAgfSBlbHNlIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWxsZWRCeSkpIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFMYWJlbGxlZEJ5ID0gdGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWxsZWRCeTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQucm9sZSA9ICdzbGlkZXInO1xyXG5cclxuICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMua2V5Ym9hcmRTdXBwb3J0ICYmXHJcbiAgICAgICAgISh0aGlzLnZpZXdPcHRpb25zLnJlYWRPbmx5IHx8IHRoaXMudmlld09wdGlvbnMuZGlzYWJsZWQpKSB7XHJcbiAgICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LnRhYmluZGV4ID0gJzAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC50YWJpbmRleCA9ICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYXJpYU9yaWVudGF0aW9uID0gKHRoaXMudmlld09wdGlvbnMudmVydGljYWwgfHwgdGhpcy52aWV3T3B0aW9ucy5yb3RhdGUgIT09IDApID8gJ3ZlcnRpY2FsJyA6ICdob3Jpem9udGFsJztcclxuXHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5hcmlhTGFiZWxIaWdoKSkge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hcmlhTGFiZWwgPSB0aGlzLnZpZXdPcHRpb25zLmFyaWFMYWJlbEhpZ2g7XHJcbiAgICAgIH0gZWxzZSBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsbGVkQnlIaWdoKSkge1xyXG4gICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hcmlhTGFiZWxsZWRCeSA9IHRoaXMudmlld09wdGlvbnMuYXJpYUxhYmVsbGVkQnlIaWdoO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGVzIGFyaWEgYXR0cmlidXRlcyBhY2NvcmRpbmcgdG8gY3VycmVudCB2YWx1ZXNcclxuICBwcml2YXRlIHVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU5vdyA9ICgrdGhpcy52YWx1ZSkudG9TdHJpbmcoKTtcclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhVmFsdWVUZXh0ID0gdGhpcy52aWV3T3B0aW9ucy50cmFuc2xhdGUoK3RoaXMudmFsdWUsIExhYmVsVHlwZS5Mb3cpO1xyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU1pbiA9IHRoaXMudmlld09wdGlvbnMuZmxvb3IudG9TdHJpbmcoKTtcclxuICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hcmlhVmFsdWVNYXggPSB0aGlzLnZpZXdPcHRpb25zLmNlaWwudG9TdHJpbmcoKTtcclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYXJpYVZhbHVlTm93ID0gKCt0aGlzLmhpZ2hWYWx1ZSkudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFWYWx1ZVRleHQgPSB0aGlzLnZpZXdPcHRpb25zLnRyYW5zbGF0ZSgrdGhpcy5oaWdoVmFsdWUsIExhYmVsVHlwZS5IaWdoKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU1pbiA9IHRoaXMudmlld09wdGlvbnMuZmxvb3IudG9TdHJpbmcoKTtcclxuICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50LmFyaWFWYWx1ZU1heCA9IHRoaXMudmlld09wdGlvbnMuY2VpbC50b1N0cmluZygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gQ2FsY3VsYXRlIGRpbWVuc2lvbnMgdGhhdCBhcmUgZGVwZW5kZW50IG9uIHZpZXcgcG9ydCBzaXplXHJcbiAgLy8gUnVuIG9uY2UgZHVyaW5nIGluaXRpYWxpemF0aW9uIGFuZCBldmVyeSB0aW1lIHZpZXcgcG9ydCBjaGFuZ2VzIHNpemUuXHJcbiAgcHJpdmF0ZSBjYWxjdWxhdGVWaWV3RGltZW5zaW9ucygpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5oYW5kbGVEaW1lbnNpb24pKSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5zZXREaW1lbnNpb24odGhpcy52aWV3T3B0aW9ucy5oYW5kbGVEaW1lbnNpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGhhbmRsZVdpZHRoOiBudW1iZXIgPSB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuZGltZW5zaW9uO1xyXG5cclxuICAgIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbiA9IGhhbmRsZVdpZHRoIC8gMjtcclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuYmFyRGltZW5zaW9uKSkge1xyXG4gICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LnNldERpbWVuc2lvbih0aGlzLnZpZXdPcHRpb25zLmJhckRpbWVuc2lvbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWF4SGFuZGxlUG9zaXRpb24gPSB0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIGhhbmRsZVdpZHRoO1xyXG5cclxuICAgIGlmICh0aGlzLmluaXRIYXNSdW4pIHtcclxuICAgICAgdGhpcy51cGRhdGVGbG9vckxhYmVsKCk7XHJcbiAgICAgIHRoaXMudXBkYXRlQ2VpbExhYmVsKCk7XHJcbiAgICAgIHRoaXMuaW5pdEhhbmRsZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2FsY3VsYXRlVmlld0RpbWVuc2lvbnNBbmREZXRlY3RDaGFuZ2VzKCk6IHZvaWQge1xyXG4gICAgdGhpcy5jYWxjdWxhdGVWaWV3RGltZW5zaW9ucygpO1xyXG4gICAgaWYgKCF0aGlzLmlzUmVmRGVzdHJveWVkKCkpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VEZXRlY3Rpb25SZWYuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBJZiB0aGUgc2xpZGVyIHJlZmVyZW5jZSBpcyBhbHJlYWR5IGRlc3Ryb3llZFxyXG4gICAqIEByZXR1cm5zIGJvb2xlYW4gLSB0cnVlIGlmIHJlZiBpcyBkZXN0cm95ZWRcclxuICAgKi9cclxuICBwcml2YXRlIGlzUmVmRGVzdHJveWVkKCk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIHRoaXMuY2hhbmdlRGV0ZWN0aW9uUmVmWydkZXN0cm95ZWQnXTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSB0aGUgdGlja3MgcG9zaXRpb25cclxuICBwcml2YXRlIHVwZGF0ZVRpY2tzU2NhbGUoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMudmlld09wdGlvbnMuc2hvd1RpY2tzKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4geyB0aGlzLnNsaWRlckVsZW1lbnRXaXRoTGVnZW5kQ2xhc3MgPSBmYWxzZTsgfSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0aWNrc0FycmF5OiBudW1iZXJbXSA9ICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tzQXJyYXkpXHJcbiAgICAgID8gdGhpcy52aWV3T3B0aW9ucy50aWNrc0FycmF5XHJcbiAgICAgIDogdGhpcy5nZXRUaWNrc0FycmF5KCk7XHJcbiAgICBjb25zdCB0cmFuc2xhdGU6IHN0cmluZyA9IHRoaXMudmlld09wdGlvbnMudmVydGljYWwgPyAndHJhbnNsYXRlWScgOiAndHJhbnNsYXRlWCc7XHJcblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgdGlja3NBcnJheS5yZXZlcnNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGlja1ZhbHVlU3RlcDogbnVtYmVyID0gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja1ZhbHVlU3RlcCkgPyB0aGlzLnZpZXdPcHRpb25zLnRpY2tWYWx1ZVN0ZXAgOlxyXG4gICAgICAgICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrU3RlcCkgPyB0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwKTtcclxuXHJcbiAgICBsZXQgaGFzQXRMZWFzdE9uZUxlZ2VuZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0IG5ld1RpY2tzOiBUaWNrW10gPSB0aWNrc0FycmF5Lm1hcCgodmFsdWU6IG51bWJlcik6IFRpY2sgPT4ge1xyXG4gICAgICBsZXQgcG9zaXRpb246IG51bWJlciA9IHRoaXMudmFsdWVUb1Bvc2l0aW9uKHZhbHVlKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsKSB7XHJcbiAgICAgICAgcG9zaXRpb24gPSB0aGlzLm1heEhhbmRsZVBvc2l0aW9uIC0gcG9zaXRpb247XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9uOiBzdHJpbmcgPSB0cmFuc2xhdGUgKyAnKCcgKyBNYXRoLnJvdW5kKHBvc2l0aW9uKSArICdweCknO1xyXG4gICAgICBjb25zdCB0aWNrOiBUaWNrID0gbmV3IFRpY2soKTtcclxuICAgICAgdGljay5zZWxlY3RlZCA9IHRoaXMuaXNUaWNrU2VsZWN0ZWQodmFsdWUpO1xyXG4gICAgICB0aWNrLnN0eWxlID0ge1xyXG4gICAgICAgICctd2Via2l0LXRyYW5zZm9ybSc6IHRyYW5zbGF0aW9uLFxyXG4gICAgICAgICctbW96LXRyYW5zZm9ybSc6IHRyYW5zbGF0aW9uLFxyXG4gICAgICAgICctby10cmFuc2Zvcm0nOiB0cmFuc2xhdGlvbixcclxuICAgICAgICAnLW1zLXRyYW5zZm9ybSc6IHRyYW5zbGF0aW9uLFxyXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRpb24sXHJcbiAgICAgIH07XHJcbiAgICAgIGlmICh0aWNrLnNlbGVjdGVkICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKSkge1xyXG4gICAgICAgIHRpY2suc3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IHRoaXMuZ2V0U2VsZWN0aW9uQmFyQ29sb3IoKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIXRpY2suc2VsZWN0ZWQgJiYgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuZ2V0VGlja0NvbG9yKSkge1xyXG4gICAgICAgIHRpY2suc3R5bGVbJ2JhY2tncm91bmQtY29sb3InXSA9IHRoaXMuZ2V0VGlja0NvbG9yKHZhbHVlKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMudGlja3NUb29sdGlwKSkge1xyXG4gICAgICAgIHRpY2sudG9vbHRpcCA9IHRoaXMudmlld09wdGlvbnMudGlja3NUb29sdGlwKHZhbHVlKTtcclxuICAgICAgICB0aWNrLnRvb2x0aXBQbGFjZW1lbnQgPSB0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsID8gJ3JpZ2h0JyA6ICd0b3AnO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnNob3dUaWNrc1ZhbHVlcyAmJiAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGlja1ZhbHVlU3RlcCkgJiZcclxuICAgICAgICAgIE1hdGhIZWxwZXIuaXNNb2R1bG9XaXRoaW5QcmVjaXNpb25MaW1pdCh2YWx1ZSwgdGlja1ZhbHVlU3RlcCwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCkpIHtcclxuICAgICAgICB0aWNrLnZhbHVlID0gdGhpcy5nZXREaXNwbGF5VmFsdWUodmFsdWUsIExhYmVsVHlwZS5UaWNrVmFsdWUpO1xyXG4gICAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy50aWNrc1ZhbHVlc1Rvb2x0aXApKSB7XHJcbiAgICAgICAgICB0aWNrLnZhbHVlVG9vbHRpcCA9IHRoaXMudmlld09wdGlvbnMudGlja3NWYWx1ZXNUb29sdGlwKHZhbHVlKTtcclxuICAgICAgICAgIHRpY2sudmFsdWVUb29sdGlwUGxhY2VtZW50ID0gdGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbFxyXG4gICAgICAgICAgICA/ICdyaWdodCdcclxuICAgICAgICAgICAgOiAndG9wJztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCBsZWdlbmQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5KSkge1xyXG4gICAgICAgIGNvbnN0IHN0ZXA6IEN1c3RvbVN0ZXBEZWZpbml0aW9uID0gdGhpcy52aWV3T3B0aW9ucy5zdGVwc0FycmF5W3ZhbHVlXTtcclxuICAgICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuZ2V0U3RlcExlZ2VuZCkpIHtcclxuICAgICAgICAgIGxlZ2VuZCA9IHRoaXMudmlld09wdGlvbnMuZ2V0U3RlcExlZ2VuZChzdGVwKTtcclxuICAgICAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChzdGVwKSkge1xyXG4gICAgICAgICAgbGVnZW5kID0gc3RlcC5sZWdlbmQ7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldExlZ2VuZCkpIHtcclxuICAgICAgICBsZWdlbmQgPSB0aGlzLnZpZXdPcHRpb25zLmdldExlZ2VuZCh2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChsZWdlbmQpKSB7XHJcbiAgICAgICAgdGljay5sZWdlbmQgPSBsZWdlbmQ7XHJcbiAgICAgICAgaGFzQXRMZWFzdE9uZUxlZ2VuZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aWNrO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7IHRoaXMuc2xpZGVyRWxlbWVudFdpdGhMZWdlbmRDbGFzcyA9IGhhc0F0TGVhc3RPbmVMZWdlbmQ7IH0pO1xyXG5cclxuICAgIC8vIFdlIHNob3VsZCBhdm9pZCByZS1jcmVhdGluZyB0aGUgdGlja3MgYXJyYXkgaWYgcG9zc2libGVcclxuICAgIC8vIFRoaXMgYm90aCBpbXByb3ZlcyBwZXJmb3JtYW5jZSBhbmQgbWFrZXMgQ1NTIGFuaW1hdGlvbnMgd29yayBjb3JyZWN0bHlcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy50aWNrcykgJiYgdGhpcy50aWNrcy5sZW5ndGggPT09IG5ld1RpY2tzLmxlbmd0aCkge1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpICA8IG5ld1RpY2tzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnRpY2tzW2ldLCBuZXdUaWNrc1tpXSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudGlja3MgPSBuZXdUaWNrcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuaXNSZWZEZXN0cm95ZWQoKSkge1xyXG4gICAgICB0aGlzLmNoYW5nZURldGVjdGlvblJlZi5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldFRpY2tzQXJyYXkoKTogbnVtYmVyW10ge1xyXG4gICAgY29uc3Qgc3RlcDogbnVtYmVyID0gKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwKSkgPyB0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgY29uc3QgdGlja3NBcnJheTogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICBjb25zdCBudW1iZXJPZlZhbHVlczogbnVtYmVyID0gMSArIE1hdGguZmxvb3IoTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQoXHJcbiAgICAgIE1hdGguYWJzKHRoaXMudmlld09wdGlvbnMuY2VpbCAtIHRoaXMudmlld09wdGlvbnMuZmxvb3IpIC8gc3RlcCxcclxuICAgICAgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdFxyXG4gICAgKSk7XHJcbiAgICBmb3IgKGxldCBpbmRleDogbnVtYmVyID0gMDsgaW5kZXggPCBudW1iZXJPZlZhbHVlczsgKytpbmRleCkge1xyXG4gICAgICB0aWNrc0FycmF5LnB1c2goTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQodGhpcy52aWV3T3B0aW9ucy5mbG9vciArIHN0ZXAgKiBpbmRleCwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aWNrc0FycmF5O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc1RpY2tTZWxlY3RlZCh2YWx1ZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICBpZiAoIXRoaXMucmFuZ2UpIHtcclxuICAgICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWUpKSB7XHJcbiAgICAgICAgY29uc3QgY2VudGVyOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld0xvd1ZhbHVlID4gY2VudGVyICYmXHJcbiAgICAgICAgICAgIHZhbHVlID49IGNlbnRlciAmJlxyXG4gICAgICAgICAgICB2YWx1ZSA8PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZpZXdMb3dWYWx1ZSA8IGNlbnRlciAmJlxyXG4gICAgICAgICAgICAgICAgICAgdmFsdWUgPD0gY2VudGVyICYmXHJcbiAgICAgICAgICAgICAgICAgICB2YWx1ZSA+PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckVuZCkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA+PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhciAmJiB2YWx1ZSA8PSB0aGlzLnZpZXdMb3dWYWx1ZSkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmFuZ2UgJiYgdmFsdWUgPj0gdGhpcy52aWV3TG93VmFsdWUgJiYgdmFsdWUgPD0gdGhpcy52aWV3SGlnaFZhbHVlKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBwb3NpdGlvbiBvZiB0aGUgZmxvb3IgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUZsb29yTGFiZWwoKTogdm9pZCB7XHJcbiAgICBpZiAoIXRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuYWx3YXlzSGlkZSkge1xyXG4gICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LnNldFZhbHVlKHRoaXMuZ2V0RGlzcGxheVZhbHVlKHRoaXMudmlld09wdGlvbnMuZmxvb3IsIExhYmVsVHlwZS5GbG9vcikpO1xyXG4gICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmRpbWVuc2lvblxyXG4gICAgICAgIDogMDtcclxuICAgICAgdGhpcy5mbG9vckxhYmVsRWxlbWVudC5zZXRQb3NpdGlvbihwb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBVcGRhdGUgcG9zaXRpb24gb2YgdGhlIGNlaWxpbmcgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUNlaWxMYWJlbCgpOiB2b2lkIHtcclxuICAgIGlmICghdGhpcy5jZWlsTGFiZWxFbGVtZW50LmFsd2F5c0hpZGUpIHtcclxuICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNldFZhbHVlKHRoaXMuZ2V0RGlzcGxheVZhbHVlKHRoaXMudmlld09wdGlvbnMuY2VpbCwgTGFiZWxUeXBlLkNlaWwpKTtcclxuICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LmNhbGN1bGF0ZURpbWVuc2lvbigpO1xyXG4gICAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gMFxyXG4gICAgICAgIDogdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSB0aGlzLmNlaWxMYWJlbEVsZW1lbnQuZGltZW5zaW9uO1xyXG4gICAgICB0aGlzLmNlaWxMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIHNsaWRlciBoYW5kbGVzIGFuZCBsYWJlbCBwb3NpdGlvbnNcclxuICBwcml2YXRlIHVwZGF0ZUhhbmRsZXMod2hpY2g6IFBvaW50ZXJUeXBlLCBuZXdQb3M6IG51bWJlcik6IHZvaWQge1xyXG4gICAgaWYgKHdoaWNoID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgdGhpcy51cGRhdGVMb3dIYW5kbGUobmV3UG9zKTtcclxuICAgIH0gZWxzZSBpZiAod2hpY2ggPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUhpZ2hIYW5kbGUobmV3UG9zKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnVwZGF0ZVNlbGVjdGlvbkJhcigpO1xyXG4gICAgdGhpcy51cGRhdGVUaWNrc1NjYWxlKCk7XHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICB0aGlzLnVwZGF0ZUNvbWJpbmVkTGFiZWwoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byB3b3JrIG91dCB0aGUgcG9zaXRpb24gZm9yIGhhbmRsZSBsYWJlbHMgZGVwZW5kaW5nIG9uIFJUTCBvciBub3RcclxuICBwcml2YXRlIGdldEhhbmRsZUxhYmVsUG9zKGxhYmVsVHlwZTogUG9pbnRlclR5cGUsIG5ld1BvczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGxhYmVsRGltZW5zaW9uOiBudW1iZXIgPSAobGFiZWxUeXBlID09PSBQb2ludGVyVHlwZS5NaW4pXHJcbiAgICAgID8gdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuZGltZW5zaW9uXHJcbiAgICAgIDogdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuZGltZW5zaW9uO1xyXG4gICAgY29uc3QgbmVhckhhbmRsZVBvczogbnVtYmVyID0gbmV3UG9zIC0gbGFiZWxEaW1lbnNpb24gLyAyICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgY29uc3QgZW5kT2ZCYXJQb3M6IG51bWJlciA9IHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gbGFiZWxEaW1lbnNpb247XHJcblxyXG4gICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLmJvdW5kUG9pbnRlckxhYmVscykge1xyXG4gICAgICByZXR1cm4gbmVhckhhbmRsZVBvcztcclxuICAgIH1cclxuXHJcbiAgICBpZiAoKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQgJiYgbGFiZWxUeXBlID09PSBQb2ludGVyVHlwZS5NaW4pIHx8XHJcbiAgICAgICAoIXRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQgJiYgbGFiZWxUeXBlID09PSBQb2ludGVyVHlwZS5NYXgpKSB7XHJcbiAgICAgIHJldHVybiBNYXRoLm1pbihuZWFySGFuZGxlUG9zLCBlbmRPZkJhclBvcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgobmVhckhhbmRsZVBvcywgMCksIGVuZE9mQmFyUG9zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBsb3cgc2xpZGVyIGhhbmRsZSBwb3NpdGlvbiBhbmQgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUxvd0hhbmRsZShuZXdQb3M6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5taW5IYW5kbGVFbGVtZW50LnNldFBvc2l0aW9uKG5ld1Bvcyk7XHJcbiAgICB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5zZXRWYWx1ZSh0aGlzLmdldERpc3BsYXlWYWx1ZSh0aGlzLnZpZXdMb3dWYWx1ZSwgTGFiZWxUeXBlLkxvdykpO1xyXG4gICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24odGhpcy5nZXRIYW5kbGVMYWJlbFBvcyhQb2ludGVyVHlwZS5NaW4sIG5ld1BvcykpO1xyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5nZXRQb2ludGVyQ29sb3IpKSB7XHJcbiAgICAgIHRoaXMubWluUG9pbnRlclN0eWxlID0ge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5nZXRQb2ludGVyQ29sb3IoUG9pbnRlclR5cGUuTWluKSxcclxuICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hdXRvSGlkZUxpbWl0TGFiZWxzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRmxvb3JBbmRDZWlsTGFiZWxzVmlzaWJpbGl0eSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gVXBkYXRlIGhpZ2ggc2xpZGVyIGhhbmRsZSBwb3NpdGlvbiBhbmQgbGFiZWxcclxuICBwcml2YXRlIHVwZGF0ZUhpZ2hIYW5kbGUobmV3UG9zOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5zZXRQb3NpdGlvbihuZXdQb3MpO1xyXG4gICAgdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuc2V0VmFsdWUodGhpcy5nZXREaXNwbGF5VmFsdWUodGhpcy52aWV3SGlnaFZhbHVlLCBMYWJlbFR5cGUuSGlnaCkpO1xyXG4gICAgdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24odGhpcy5nZXRIYW5kbGVMYWJlbFBvcyhQb2ludGVyVHlwZS5NYXgsIG5ld1BvcykpO1xyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5nZXRQb2ludGVyQ29sb3IpKSB7XHJcbiAgICAgIHRoaXMubWF4UG9pbnRlclN0eWxlID0ge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5nZXRQb2ludGVyQ29sb3IoUG9pbnRlclR5cGUuTWF4KSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmF1dG9IaWRlTGltaXRMYWJlbHMpIHtcclxuICAgICAgdGhpcy51cGRhdGVGbG9vckFuZENlaWxMYWJlbHNWaXNpYmlsaXR5KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvLyBTaG93L2hpZGUgZmxvb3IvY2VpbGluZyBsYWJlbFxyXG4gIHByaXZhdGUgdXBkYXRlRmxvb3JBbmRDZWlsTGFiZWxzVmlzaWJpbGl0eSgpOiB2b2lkIHtcclxuICAgIC8vIFNob3cgYmFzZWQgb25seSBvbiBoaWRlTGltaXRMYWJlbHMgaWYgcG9pbnRlciBsYWJlbHMgYXJlIGhpZGRlblxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuaGlkZVBvaW50ZXJMYWJlbHMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IGZsb29yTGFiZWxIaWRkZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGxldCBjZWlsTGFiZWxIaWRkZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGNvbnN0IGlzTWluTGFiZWxBdEZsb29yOiBib29sZWFuID0gdGhpcy5pc0xhYmVsQmVsb3dGbG9vckxhYmVsKHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50KTtcclxuICAgIGNvbnN0IGlzTWluTGFiZWxBdENlaWw6IGJvb2xlYW4gPSB0aGlzLmlzTGFiZWxBYm92ZUNlaWxMYWJlbCh0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudCk7XHJcbiAgICBjb25zdCBpc01heExhYmVsQXRDZWlsOiBib29sZWFuID0gdGhpcy5pc0xhYmVsQWJvdmVDZWlsTGFiZWwodGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQpO1xyXG4gICAgY29uc3QgaXNDb21iaW5lZExhYmVsQXRGbG9vcjogYm9vbGVhbiA9IHRoaXMuaXNMYWJlbEJlbG93Rmxvb3JMYWJlbCh0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50KTtcclxuICAgIGNvbnN0IGlzQ29tYmluZWRMYWJlbEF0Q2VpbDogYm9vbGVhbiA9IHRoaXMuaXNMYWJlbEFib3ZlQ2VpbExhYmVsKHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQpO1xyXG5cclxuICAgIGlmIChpc01pbkxhYmVsQXRGbG9vcikge1xyXG4gICAgICBmbG9vckxhYmVsSGlkZGVuID0gdHJ1ZTtcclxuICAgICAgdGhpcy5mbG9vckxhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmbG9vckxhYmVsSGlkZGVuID0gZmFsc2U7XHJcbiAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc01pbkxhYmVsQXRDZWlsKSB7XHJcbiAgICAgIGNlaWxMYWJlbEhpZGRlbiA9IHRydWU7XHJcbiAgICAgIHRoaXMuY2VpbExhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjZWlsTGFiZWxIaWRkZW4gPSBmYWxzZTtcclxuICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICBjb25zdCBoaWRlQ2VpbDogYm9vbGVhbiA9IHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuaXNWaXNpYmxlKCkgPyBpc0NvbWJpbmVkTGFiZWxBdENlaWwgOiBpc01heExhYmVsQXRDZWlsO1xyXG4gICAgICBjb25zdCBoaWRlRmxvb3I6IGJvb2xlYW4gPSB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LmlzVmlzaWJsZSgpID8gaXNDb21iaW5lZExhYmVsQXRGbG9vciA6IGlzTWluTGFiZWxBdEZsb29yO1xyXG5cclxuICAgICAgaWYgKGhpZGVDZWlsKSB7XHJcbiAgICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LmhpZGUoKTtcclxuICAgICAgfSBlbHNlIGlmICghY2VpbExhYmVsSGlkZGVuKSB7XHJcbiAgICAgICAgdGhpcy5jZWlsTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gSGlkZSBvciBzaG93IGZsb29yIGxhYmVsXHJcbiAgICAgIGlmIChoaWRlRmxvb3IpIHtcclxuICAgICAgICB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmhpZGUoKTtcclxuICAgICAgfSBlbHNlIGlmICghZmxvb3JMYWJlbEhpZGRlbikge1xyXG4gICAgICAgIHRoaXMuZmxvb3JMYWJlbEVsZW1lbnQuc2hvdygpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzTGFiZWxCZWxvd0Zsb29yTGFiZWwobGFiZWw6IFNsaWRlckxhYmVsRGlyZWN0aXZlKTogYm9vbGVhbiB7XHJcbiAgICBjb25zdCBwb3M6IG51bWJlciA9IGxhYmVsLnBvc2l0aW9uO1xyXG4gICAgY29uc3QgZGltOiBudW1iZXIgPSBsYWJlbC5kaW1lbnNpb247XHJcbiAgICBjb25zdCBmbG9vclBvczogbnVtYmVyID0gdGhpcy5mbG9vckxhYmVsRWxlbWVudC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGZsb29yRGltOiBudW1iZXIgPSB0aGlzLmZsb29yTGFiZWxFbGVtZW50LmRpbWVuc2lvbjtcclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgID8gcG9zICsgZGltID49IGZsb29yUG9zIC0gMlxyXG4gICAgICA6IHBvcyA8PSBmbG9vclBvcyArIGZsb29yRGltICsgMjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNMYWJlbEFib3ZlQ2VpbExhYmVsKGxhYmVsOiBTbGlkZXJMYWJlbERpcmVjdGl2ZSk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgcG9zOiBudW1iZXIgPSBsYWJlbC5wb3NpdGlvbjtcclxuICAgIGNvbnN0IGRpbTogbnVtYmVyID0gbGFiZWwuZGltZW5zaW9uO1xyXG4gICAgY29uc3QgY2VpbFBvczogbnVtYmVyID0gdGhpcy5jZWlsTGFiZWxFbGVtZW50LnBvc2l0aW9uO1xyXG4gICAgY29uc3QgY2VpbERpbTogbnVtYmVyID0gdGhpcy5jZWlsTGFiZWxFbGVtZW50LmRpbWVuc2lvbjtcclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgID8gcG9zIDw9IGNlaWxQb3MgKyBjZWlsRGltICsgMlxyXG4gICAgICA6IHBvcyArIGRpbSA+PSBjZWlsUG9zIC0gMjtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBzbGlkZXIgc2VsZWN0aW9uIGJhciwgY29tYmluZWQgbGFiZWwgYW5kIHJhbmdlIGxhYmVsXHJcbiAgcHJpdmF0ZSB1cGRhdGVTZWxlY3Rpb25CYXIoKTogdm9pZCB7XHJcbiAgICBsZXQgcG9zaXRpb246IG51bWJlciA9IDA7XHJcbiAgICBsZXQgZGltZW5zaW9uOiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3QgaXNTZWxlY3Rpb25CYXJGcm9tUmlnaHQ6IGJvb2xlYW4gPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyAhdGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRW5kXHJcbiAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJFbmQ7XHJcbiAgICBjb25zdCBwb3NpdGlvbkZvclJhbmdlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyB0aGlzLm1heEhhbmRsZUVsZW1lbnQucG9zaXRpb24gKyB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb25cclxuICAgICAgICA6IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuXHJcbiAgICBpZiAodGhpcy5yYW5nZSkge1xyXG4gICAgICBkaW1lbnNpb24gPSBNYXRoLmFicyh0aGlzLm1heEhhbmRsZUVsZW1lbnQucG9zaXRpb24gLSB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24pO1xyXG4gICAgICBwb3NpdGlvbiA9IHBvc2l0aW9uRm9yUmFuZ2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZSkpIHtcclxuICAgICAgICBjb25zdCBjZW50ZXI6IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMuc2hvd1NlbGVjdGlvbkJhckZyb21WYWx1ZTtcclxuICAgICAgICBjb25zdCBjZW50ZXJQb3NpdGlvbjogbnVtYmVyID0gdGhpcy52YWx1ZVRvUG9zaXRpb24oY2VudGVyKTtcclxuICAgICAgICBjb25zdCBpc01vZGVsR3JlYXRlclRoYW5DZW50ZXI6IGJvb2xlYW4gPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgICAgID8gdGhpcy52aWV3TG93VmFsdWUgPD0gY2VudGVyXHJcbiAgICAgICAgICAgIDogdGhpcy52aWV3TG93VmFsdWUgPiBjZW50ZXI7XHJcbiAgICAgICAgaWYgKGlzTW9kZWxHcmVhdGVyVGhhbkNlbnRlcikge1xyXG4gICAgICAgICAgZGltZW5zaW9uID0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uIC0gY2VudGVyUG9zaXRpb247XHJcbiAgICAgICAgICBwb3NpdGlvbiA9IGNlbnRlclBvc2l0aW9uICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkaW1lbnNpb24gPSBjZW50ZXJQb3NpdGlvbiAtIHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbjtcclxuICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChpc1NlbGVjdGlvbkJhckZyb21SaWdodCkge1xyXG4gICAgICAgIGRpbWVuc2lvbiA9IE1hdGguY2VpbChNYXRoLmFicyh0aGlzLm1heEhhbmRsZVBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uKSArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbik7XHJcbiAgICAgICAgcG9zaXRpb24gPSBNYXRoLmZsb29yKHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiArIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGltZW5zaW9uID0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uICsgdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uO1xyXG4gICAgICAgIHBvc2l0aW9uID0gMDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50LnNldERpbWVuc2lvbihkaW1lbnNpb24pO1xyXG4gICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgIGlmICh0aGlzLnJhbmdlICYmIHRoaXMudmlld09wdGlvbnMuc2hvd091dGVyU2VsZWN0aW9uQmFycykge1xyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCkge1xyXG4gICAgICAgIHRoaXMucmlnaHRPdXRlclNlbGVjdGlvbkJhckVsZW1lbnQuc2V0RGltZW5zaW9uKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKDApO1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQuY2FsY3VsYXRlRGltZW5zaW9uKCk7XHJcbiAgICAgICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldERpbWVuc2lvbih0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIChwb3NpdGlvbiArIGRpbWVuc2lvbikpO1xyXG4gICAgICAgIHRoaXMubGVmdE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXRQb3NpdGlvbihwb3NpdGlvbiArIGRpbWVuc2lvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldERpbWVuc2lvbihwb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5sZWZ0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKDApO1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQuY2FsY3VsYXRlRGltZW5zaW9uKCk7XHJcbiAgICAgICAgdGhpcy5yaWdodE91dGVyU2VsZWN0aW9uQmFyRWxlbWVudC5zZXREaW1lbnNpb24odGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSAocG9zaXRpb24gKyBkaW1lbnNpb24pKTtcclxuICAgICAgICB0aGlzLnJpZ2h0T3V0ZXJTZWxlY3Rpb25CYXJFbGVtZW50LnNldFBvc2l0aW9uKHBvc2l0aW9uICsgZGltZW5zaW9uKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKSkge1xyXG4gICAgICBjb25zdCBjb2xvcjogc3RyaW5nID0gdGhpcy5nZXRTZWxlY3Rpb25CYXJDb2xvcigpO1xyXG4gICAgICB0aGlzLmJhclN0eWxlID0ge1xyXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogY29sb3IsXHJcbiAgICAgIH07XHJcbiAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnNlbGVjdGlvbkJhckdyYWRpZW50KSkge1xyXG4gICAgICBjb25zdCBvZmZzZXQ6IG51bWJlciA9ICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5zaG93U2VsZWN0aW9uQmFyRnJvbVZhbHVlKSlcclxuICAgICAgICAgICAgPyB0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdPcHRpb25zLnNob3dTZWxlY3Rpb25CYXJGcm9tVmFsdWUpXHJcbiAgICAgICAgICAgIDogMDtcclxuICAgICAgY29uc3QgcmV2ZXJzZWQ6IGJvb2xlYW4gPSAob2Zmc2V0IC0gcG9zaXRpb24gPiAwICYmICFpc1NlbGVjdGlvbkJhckZyb21SaWdodCkgfHwgKG9mZnNldCAtIHBvc2l0aW9uIDw9IDAgJiYgaXNTZWxlY3Rpb25CYXJGcm9tUmlnaHQpO1xyXG4gICAgICBjb25zdCBkaXJlY3Rpb246IHN0cmluZyA9IHRoaXMudmlld09wdGlvbnMudmVydGljYWxcclxuICAgICAgICAgID8gcmV2ZXJzZWQgPyAnYm90dG9tJyA6ICd0b3AnXHJcbiAgICAgICAgICA6IHJldmVyc2VkID8gJ2xlZnQnIDogJ3JpZ2h0JztcclxuICAgICAgdGhpcy5iYXJTdHlsZSA9IHtcclxuICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6XHJcbiAgICAgICAgICAnbGluZWFyLWdyYWRpZW50KHRvICcgK1xyXG4gICAgICAgICAgZGlyZWN0aW9uICtcclxuICAgICAgICAgICcsICcgK1xyXG4gICAgICAgICAgdGhpcy52aWV3T3B0aW9ucy5zZWxlY3Rpb25CYXJHcmFkaWVudC5mcm9tICtcclxuICAgICAgICAgICcgMCUsJyArXHJcbiAgICAgICAgICB0aGlzLnZpZXdPcHRpb25zLnNlbGVjdGlvbkJhckdyYWRpZW50LnRvICtcclxuICAgICAgICAgICcgMTAwJSknLFxyXG4gICAgICB9O1xyXG4gICAgICBpZiAodGhpcy52aWV3T3B0aW9ucy52ZXJ0aWNhbCkge1xyXG4gICAgICAgIHRoaXMuYmFyU3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID1cclxuICAgICAgICAgICdjZW50ZXIgJyArXHJcbiAgICAgICAgICAob2Zmc2V0ICtcclxuICAgICAgICAgICAgZGltZW5zaW9uICtcclxuICAgICAgICAgICAgcG9zaXRpb24gK1xyXG4gICAgICAgICAgICAocmV2ZXJzZWQgPyAtdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uIDogMCkpICtcclxuICAgICAgICAgICdweCc7XHJcbiAgICAgICAgdGhpcy5iYXJTdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9XHJcbiAgICAgICAgICAnMTAwJSAnICsgKHRoaXMuZnVsbEJhckVsZW1lbnQuZGltZW5zaW9uIC0gdGhpcy5oYW5kbGVIYWxmRGltZW5zaW9uKSArICdweCc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5iYXJTdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPVxyXG4gICAgICAgICAgb2Zmc2V0IC1cclxuICAgICAgICAgIHBvc2l0aW9uICtcclxuICAgICAgICAgIChyZXZlcnNlZCA/IHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbiA6IDApICtcclxuICAgICAgICAgICdweCBjZW50ZXInO1xyXG4gICAgICAgIHRoaXMuYmFyU3R5bGUuYmFja2dyb3VuZFNpemUgPVxyXG4gICAgICAgICAgdGhpcy5mdWxsQmFyRWxlbWVudC5kaW1lbnNpb24gLSB0aGlzLmhhbmRsZUhhbGZEaW1lbnNpb24gKyAncHggMTAwJSc7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIFdyYXBwZXIgYXJvdW5kIHRoZSBnZXRTZWxlY3Rpb25CYXJDb2xvciBvZiB0aGUgdXNlciB0byBwYXNzIHRvIGNvcnJlY3QgcGFyYW1ldGVyc1xyXG4gIHByaXZhdGUgZ2V0U2VsZWN0aW9uQmFyQ29sb3IoKTogc3RyaW5nIHtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKFxyXG4gICAgICAgIHRoaXMudmFsdWUsXHJcbiAgICAgICAgdGhpcy5oaWdoVmFsdWVcclxuICAgICAgKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLmdldFNlbGVjdGlvbkJhckNvbG9yKHRoaXMudmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgLy8gV3JhcHBlciBhcm91bmQgdGhlIGdldFBvaW50ZXJDb2xvciBvZiB0aGUgdXNlciB0byBwYXNzIHRvICBjb3JyZWN0IHBhcmFtZXRlcnNcclxuICBwcml2YXRlIGdldFBvaW50ZXJDb2xvcihwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpOiBzdHJpbmcge1xyXG4gICAgaWYgKHBvaW50ZXJUeXBlID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMuZ2V0UG9pbnRlckNvbG9yKFxyXG4gICAgICAgIHRoaXMuaGlnaFZhbHVlLFxyXG4gICAgICAgIHBvaW50ZXJUeXBlXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy52aWV3T3B0aW9ucy5nZXRQb2ludGVyQ29sb3IoXHJcbiAgICAgIHRoaXMudmFsdWUsXHJcbiAgICAgIHBvaW50ZXJUeXBlXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgLy8gV3JhcHBlciBhcm91bmQgdGhlIGdldFRpY2tDb2xvciBvZiB0aGUgdXNlciB0byBwYXNzIHRvIGNvcnJlY3QgcGFyYW1ldGVyc1xyXG4gIHByaXZhdGUgZ2V0VGlja0NvbG9yKHZhbHVlOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMuZ2V0VGlja0NvbG9yKHZhbHVlKTtcclxuICB9XHJcblxyXG4gIC8vIFVwZGF0ZSBjb21iaW5lZCBsYWJlbCBwb3NpdGlvbiBhbmQgdmFsdWVcclxuICBwcml2YXRlIHVwZGF0ZUNvbWJpbmVkTGFiZWwoKTogdm9pZCB7XHJcbiAgICBsZXQgaXNMYWJlbE92ZXJsYXA6IGJvb2xlYW4gPSBudWxsO1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgaXNMYWJlbE92ZXJsYXAgPVxyXG4gICAgICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LnBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuZGltZW5zaW9uIC0gMTAgPD0gdGhpcy5tYXhIYW5kbGVMYWJlbEVsZW1lbnQucG9zaXRpb247XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpc0xhYmVsT3ZlcmxhcCA9XHJcbiAgICAgICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQucG9zaXRpb24gKyB0aGlzLm1pbkhhbmRsZUxhYmVsRWxlbWVudC5kaW1lbnNpb24gKyAxMCA+PSB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudC5wb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoaXNMYWJlbE92ZXJsYXApIHtcclxuICAgICAgY29uc3QgbG93RGlzcGxheVZhbHVlOiBzdHJpbmcgPSB0aGlzLmdldERpc3BsYXlWYWx1ZSh0aGlzLnZpZXdMb3dWYWx1ZSwgTGFiZWxUeXBlLkxvdyk7XHJcbiAgICAgIGNvbnN0IGhpZ2hEaXNwbGF5VmFsdWU6IHN0cmluZyA9IHRoaXMuZ2V0RGlzcGxheVZhbHVlKHRoaXMudmlld0hpZ2hWYWx1ZSwgTGFiZWxUeXBlLkhpZ2gpO1xyXG4gICAgICBjb25zdCBjb21iaW5lZExhYmVsVmFsdWU6IHN0cmluZyA9IHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnRcclxuICAgICAgICA/IHRoaXMudmlld09wdGlvbnMuY29tYmluZUxhYmVscyhoaWdoRGlzcGxheVZhbHVlLCBsb3dEaXNwbGF5VmFsdWUpXHJcbiAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLmNvbWJpbmVMYWJlbHMobG93RGlzcGxheVZhbHVlLCBoaWdoRGlzcGxheVZhbHVlKTtcclxuXHJcbiAgICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuc2V0VmFsdWUoY29tYmluZWRMYWJlbFZhbHVlKTtcclxuICAgICAgY29uc3QgcG9zOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLmJvdW5kUG9pbnRlckxhYmVsc1xyXG4gICAgICAgID8gTWF0aC5taW4oXHJcbiAgICAgICAgICAgIE1hdGgubWF4KFxyXG4gICAgICAgICAgICAgIHRoaXMuc2VsZWN0aW9uQmFyRWxlbWVudC5wb3NpdGlvbiArXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQuZGltZW5zaW9uIC8gMiAtXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbWJpbmVkTGFiZWxFbGVtZW50LmRpbWVuc2lvbiAvIDIsXHJcbiAgICAgICAgICAgICAgMFxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICB0aGlzLmZ1bGxCYXJFbGVtZW50LmRpbWVuc2lvbiAtIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuZGltZW5zaW9uXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgOiB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQucG9zaXRpb24gKyB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQuZGltZW5zaW9uIC8gMiAtIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuZGltZW5zaW9uIC8gMjtcclxuXHJcbiAgICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuc2V0UG9zaXRpb24ocG9zKTtcclxuICAgICAgdGhpcy5taW5IYW5kbGVMYWJlbEVsZW1lbnQuaGlkZSgpO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICAgIHRoaXMuY29tYmluZWRMYWJlbEVsZW1lbnQuc2hvdygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cGRhdGVIaWdoSGFuZGxlKHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSkpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUxvd0hhbmRsZSh0aGlzLnZhbHVlVG9Qb3NpdGlvbih0aGlzLnZpZXdMb3dWYWx1ZSkpO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUxhYmVsRWxlbWVudC5zaG93KCk7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlTGFiZWxFbGVtZW50LnNob3coKTtcclxuICAgICAgdGhpcy5jb21iaW5lZExhYmVsRWxlbWVudC5oaWRlKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hdXRvSGlkZUxpbWl0TGFiZWxzKSB7XHJcbiAgICAgIHRoaXMudXBkYXRlRmxvb3JBbmRDZWlsTGFiZWxzVmlzaWJpbGl0eSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gUmV0dXJuIHRoZSB0cmFuc2xhdGVkIHZhbHVlIGlmIGEgdHJhbnNsYXRlIGZ1bmN0aW9uIGlzIHByb3ZpZGVkIGVsc2UgdGhlIG9yaWdpbmFsIHZhbHVlXHJcbiAgcHJpdmF0ZSBnZXREaXNwbGF5VmFsdWUodmFsdWU6IG51bWJlciwgd2hpY2g6IExhYmVsVHlwZSk6IHN0cmluZyB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuc3RlcHNBcnJheSkgJiYgIXRoaXMudmlld09wdGlvbnMuYmluZEluZGV4Rm9yU3RlcHNBcnJheSkge1xyXG4gICAgICB2YWx1ZSA9IHRoaXMuZ2V0U3RlcFZhbHVlKHZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLnRyYW5zbGF0ZSh2YWx1ZSwgd2hpY2gpO1xyXG4gIH1cclxuXHJcbiAgLy8gUm91bmQgdmFsdWUgdG8gc3RlcCBhbmQgcHJlY2lzaW9uIGJhc2VkIG9uIG1pblZhbHVlXHJcbiAgcHJpdmF0ZSByb3VuZFN0ZXAodmFsdWU6IG51bWJlciwgY3VzdG9tU3RlcD86IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBzdGVwOiBudW1iZXIgPSAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoY3VzdG9tU3RlcCkgPyBjdXN0b21TdGVwIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgbGV0IHN0ZXBwZWREaWZmZXJlbmNlOiBudW1iZXIgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChcclxuICAgICAgKHZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5mbG9vcikgLyBzdGVwLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgIHN0ZXBwZWREaWZmZXJlbmNlID0gTWF0aC5yb3VuZChzdGVwcGVkRGlmZmVyZW5jZSkgKiBzdGVwO1xyXG4gICAgcmV0dXJuIE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld09wdGlvbnMuZmxvb3IgKyBzdGVwcGVkRGlmZmVyZW5jZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgfVxyXG5cclxuICAvLyBUcmFuc2xhdGUgdmFsdWUgdG8gcGl4ZWwgcG9zaXRpb25cclxuICBwcml2YXRlIHZhbHVlVG9Qb3NpdGlvbih2YWw6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBsZXQgZm46IFZhbHVlVG9Qb3NpdGlvbkZ1bmN0aW9uICA9IFZhbHVlSGVscGVyLmxpbmVhclZhbHVlVG9Qb3NpdGlvbjtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5jdXN0b21WYWx1ZVRvUG9zaXRpb24pKSB7XHJcbiAgICAgIGZuID0gdGhpcy52aWV3T3B0aW9ucy5jdXN0b21WYWx1ZVRvUG9zaXRpb247XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMudmlld09wdGlvbnMubG9nU2NhbGUpIHtcclxuICAgICAgZm4gPSBWYWx1ZUhlbHBlci5sb2dWYWx1ZVRvUG9zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgdmFsID0gTWF0aEhlbHBlci5jbGFtcFRvUmFuZ2UodmFsLCB0aGlzLnZpZXdPcHRpb25zLmZsb29yLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpO1xyXG4gICAgbGV0IHBlcmNlbnQ6IG51bWJlciA9IGZuKHZhbCwgdGhpcy52aWV3T3B0aW9ucy5mbG9vciwgdGhpcy52aWV3T3B0aW9ucy5jZWlsKTtcclxuICAgIGlmIChWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChwZXJjZW50KSkge1xyXG4gICAgICBwZXJjZW50ID0gMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcclxuICAgIH1cclxuICAgIHJldHVybiBwZXJjZW50ICogdGhpcy5tYXhIYW5kbGVQb3NpdGlvbjtcclxuICB9XHJcblxyXG4gIC8vIFRyYW5zbGF0ZSBwb3NpdGlvbiB0byBtb2RlbCB2YWx1ZVxyXG4gIHByaXZhdGUgcG9zaXRpb25Ub1ZhbHVlKHBvc2l0aW9uOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgbGV0IHBlcmNlbnQ6IG51bWJlciA9IHBvc2l0aW9uIC8gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbjtcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIHBlcmNlbnQgPSAxIC0gcGVyY2VudDtcclxuICAgIH1cclxuICAgIGxldCBmbjogUG9zaXRpb25Ub1ZhbHVlRnVuY3Rpb24gPSBWYWx1ZUhlbHBlci5saW5lYXJQb3NpdGlvblRvVmFsdWU7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudmlld09wdGlvbnMuY3VzdG9tUG9zaXRpb25Ub1ZhbHVlKSkge1xyXG4gICAgICBmbiA9IHRoaXMudmlld09wdGlvbnMuY3VzdG9tUG9zaXRpb25Ub1ZhbHVlO1xyXG4gICAgfSBlbHNlIGlmICh0aGlzLnZpZXdPcHRpb25zLmxvZ1NjYWxlKSB7XHJcbiAgICAgIGZuID0gVmFsdWVIZWxwZXIubG9nUG9zaXRpb25Ub1ZhbHVlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmFsdWU6IG51bWJlciA9IGZuKHBlcmNlbnQsIHRoaXMudmlld09wdGlvbnMuZmxvb3IsIHRoaXMudmlld09wdGlvbnMuY2VpbCk7XHJcbiAgICByZXR1cm4gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHZhbHVlKSA/IHZhbHVlIDogMDtcclxuICB9XHJcblxyXG4gIC8vIEdldCB0aGUgWC1jb29yZGluYXRlIG9yIFktY29vcmRpbmF0ZSBvZiBhbiBldmVudFxyXG4gIHByaXZhdGUgZ2V0RXZlbnRYWShldmVudDogTW91c2VFdmVudHxUb3VjaEV2ZW50LCB0YXJnZXRUb3VjaElkPzogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcclxuICAgICAgcmV0dXJuICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/IGV2ZW50LmNsaWVudFkgOiBldmVudC5jbGllbnRYO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCB0b3VjaEluZGV4OiBudW1iZXIgPSAwO1xyXG4gICAgY29uc3QgdG91Y2hlczogVG91Y2hMaXN0ID0gZXZlbnQudG91Y2hlcztcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGFyZ2V0VG91Y2hJZCkpIHtcclxuICAgICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAodG91Y2hlc1tpXS5pZGVudGlmaWVyID09PSB0YXJnZXRUb3VjaElkKSB7XHJcbiAgICAgICAgICB0b3VjaEluZGV4ID0gaTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFJldHVybiB0aGUgdGFyZ2V0IHRvdWNoIG9yIGlmIHRoZSB0YXJnZXQgdG91Y2ggd2FzIG5vdCBmb3VuZCBpbiB0aGUgZXZlbnRcclxuICAgIC8vIHJldHVybnMgdGhlIGNvb3JkaW5hdGVzIG9mIHRoZSBmaXJzdCB0b3VjaFxyXG4gICAgcmV0dXJuICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/IHRvdWNoZXNbdG91Y2hJbmRleF0uY2xpZW50WSA6IHRvdWNoZXNbdG91Y2hJbmRleF0uY2xpZW50WDtcclxuICB9XHJcblxyXG4gIC8vIENvbXB1dGUgdGhlIGV2ZW50IHBvc2l0aW9uIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBzbGlkZXIgaXMgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbFxyXG4gIHByaXZhdGUgZ2V0RXZlbnRQb3NpdGlvbihldmVudDogTW91c2VFdmVudHxUb3VjaEV2ZW50LCB0YXJnZXRUb3VjaElkPzogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHNsaWRlckVsZW1lbnRCb3VuZGluZ1JlY3Q6IENsaWVudFJlY3QgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuXHJcbiAgICBjb25zdCBzbGlkZXJQb3M6IG51bWJlciA9ICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSA/XHJcbiAgICAgIHNsaWRlckVsZW1lbnRCb3VuZGluZ1JlY3QuYm90dG9tIDogc2xpZGVyRWxlbWVudEJvdW5kaW5nUmVjdC5sZWZ0O1xyXG4gICAgbGV0IGV2ZW50UG9zOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSB7XHJcbiAgICAgIGV2ZW50UG9zID0gLXRoaXMuZ2V0RXZlbnRYWShldmVudCwgdGFyZ2V0VG91Y2hJZCkgKyBzbGlkZXJQb3M7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudFBvcyA9IHRoaXMuZ2V0RXZlbnRYWShldmVudCwgdGFyZ2V0VG91Y2hJZCkgLSBzbGlkZXJQb3M7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGV2ZW50UG9zICogdGhpcy52aWV3T3B0aW9ucy5zY2FsZSAtIHRoaXMuaGFuZGxlSGFsZkRpbWVuc2lvbjtcclxuICB9XHJcblxyXG4gIC8vIEdldCB0aGUgaGFuZGxlIGNsb3Nlc3QgdG8gYW4gZXZlbnRcclxuICBwcml2YXRlIGdldE5lYXJlc3RIYW5kbGUoZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCk6IFBvaW50ZXJUeXBlIHtcclxuICAgIGlmICghdGhpcy5yYW5nZSkge1xyXG4gICAgICByZXR1cm4gUG9pbnRlclR5cGUuTWluO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHBvc2l0aW9uOiBudW1iZXIgPSB0aGlzLmdldEV2ZW50UG9zaXRpb24oZXZlbnQpO1xyXG4gICAgY29uc3QgZGlzdGFuY2VNaW46IG51bWJlciA9IE1hdGguYWJzKHBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uKTtcclxuICAgIGNvbnN0IGRpc3RhbmNlTWF4OiBudW1iZXIgPSBNYXRoLmFicyhwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlRWxlbWVudC5wb3NpdGlvbik7XHJcblxyXG4gICAgaWYgKGRpc3RhbmNlTWluIDwgZGlzdGFuY2VNYXgpIHtcclxuICAgICAgcmV0dXJuIFBvaW50ZXJUeXBlLk1pbjtcclxuICAgIH0gZWxzZSBpZiAoZGlzdGFuY2VNaW4gPiBkaXN0YW5jZU1heCkge1xyXG4gICAgICByZXR1cm4gUG9pbnRlclR5cGUuTWF4O1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdCkge1xyXG4gICAgICAvLyBpZiBldmVudCBpcyBhdCB0aGUgc2FtZSBkaXN0YW5jZSBmcm9tIG1pbi9tYXggdGhlbiBpZiBpdCdzIGF0IGxlZnQgb2YgbWluSCwgd2UgcmV0dXJuIG1pbkggZWxzZSBtYXhIXHJcbiAgICAgIHJldHVybiBwb3NpdGlvbiA8IHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbiA/IFBvaW50ZXJUeXBlLk1pbiA6IFBvaW50ZXJUeXBlLk1heDtcclxuICAgIH1cclxuICAgIC8vIHJldmVyc2UgaW4gcnRsXHJcbiAgICByZXR1cm4gcG9zaXRpb24gPiB0aGlzLm1pbkhhbmRsZUVsZW1lbnQucG9zaXRpb24gPyBQb2ludGVyVHlwZS5NaW4gOiBQb2ludGVyVHlwZS5NYXg7XHJcbiAgfVxyXG5cclxuICAvLyBCaW5kIG1vdXNlIGFuZCB0b3VjaCBldmVudHMgdG8gc2xpZGVyIGhhbmRsZXNcclxuICBwcml2YXRlIGJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICBjb25zdCBkcmFnZ2FibGVSYW5nZTogYm9vbGVhbiA9IHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2U7XHJcblxyXG4gICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLm9ubHlCaW5kSGFuZGxlcykge1xyXG4gICAgICB0aGlzLnNlbGVjdGlvbkJhckVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQobnVsbCwgZHJhZ2dhYmxlUmFuZ2UsIGV2ZW50LCB0cnVlLCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmRyYWdnYWJsZVJhbmdlT25seSkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQoUG9pbnRlclR5cGUuTWluLCBkcmFnZ2FibGVSYW5nZSwgZXZlbnQsIHRydWUsIHRydWUpXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5vbignbW91c2Vkb3duJyxcclxuICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25CYXJTdGFydChQb2ludGVyVHlwZS5NYXgsIGRyYWdnYWJsZVJhbmdlLCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5vbignbW91c2Vkb3duJyxcclxuICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChQb2ludGVyVHlwZS5NaW4sIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChQb2ludGVyVHlwZS5NYXgsIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLm9ubHlCaW5kSGFuZGxlcykge1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQub24oJ21vdXNlZG93bicsXHJcbiAgICAgICAgICAoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChudWxsLCBldmVudCwgdHJ1ZSwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMudGlja3NFbGVtZW50Lm9uKCdtb3VzZWRvd24nLFxyXG4gICAgICAgICAgKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCA9PiB0aGlzLm9uU3RhcnQobnVsbCwgZXZlbnQsIHRydWUsIHRydWUsIHRydWUsIHRydWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5vbmx5QmluZEhhbmRsZXMpIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25CYXJFbGVtZW50Lm9uUGFzc2l2ZSgndG91Y2hzdGFydCcsXHJcbiAgICAgICAgKGV2ZW50OiBUb3VjaEV2ZW50KTogdm9pZCA9PiB0aGlzLm9uQmFyU3RhcnQobnVsbCwgZHJhZ2dhYmxlUmFuZ2UsIGV2ZW50LCB0cnVlLCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuZHJhZ2dhYmxlUmFuZ2VPbmx5KSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5vblBhc3NpdmUoJ3RvdWNoc3RhcnQnLFxyXG4gICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vbkJhclN0YXJ0KFBvaW50ZXJUeXBlLk1pbiwgZHJhZ2dhYmxlUmFuZ2UsIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICApO1xyXG4gICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25CYXJTdGFydChQb2ludGVyVHlwZS5NYXgsIGRyYWdnYWJsZVJhbmdlLCBldmVudCwgdHJ1ZSwgdHJ1ZSlcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5vblBhc3NpdmUoJ3RvdWNoc3RhcnQnLFxyXG4gICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vblN0YXJ0KFBvaW50ZXJUeXBlLk1pbiwgZXZlbnQsIHRydWUsIHRydWUpXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgICAgdGhpcy5tYXhIYW5kbGVFbGVtZW50Lm9uUGFzc2l2ZSgndG91Y2hzdGFydCcsXHJcbiAgICAgICAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHRoaXMub25TdGFydChQb2ludGVyVHlwZS5NYXgsIGV2ZW50LCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLm9ubHlCaW5kSGFuZGxlcykge1xyXG4gICAgICAgIHRoaXMuZnVsbEJhckVsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vblN0YXJ0KG51bGwsIGV2ZW50LCB0cnVlLCB0cnVlLCB0cnVlKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy50aWNrc0VsZW1lbnQub25QYXNzaXZlKCd0b3VjaHN0YXJ0JyxcclxuICAgICAgICAgIChldmVudDogVG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vblN0YXJ0KG51bGwsIGV2ZW50LCBmYWxzZSwgZmFsc2UsIHRydWUsIHRydWUpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQub24oJ2ZvY3VzJywgKCk6IHZvaWQgPT4gdGhpcy5vblBvaW50ZXJGb2N1cyhQb2ludGVyVHlwZS5NaW4pKTtcclxuICAgICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQub24oJ2ZvY3VzJywgKCk6IHZvaWQgPT4gdGhpcy5vblBvaW50ZXJGb2N1cyhQb2ludGVyVHlwZS5NYXgpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRPcHRpb25zSW5mbHVlbmNpbmdFdmVudEJpbmRpbmdzKG9wdGlvbnM6IE9wdGlvbnMpOiBib29sZWFuW10ge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgb3B0aW9ucy5kaXNhYmxlZCxcclxuICAgICAgb3B0aW9ucy5yZWFkT25seSxcclxuICAgICAgb3B0aW9ucy5kcmFnZ2FibGVSYW5nZSxcclxuICAgICAgb3B0aW9ucy5kcmFnZ2FibGVSYW5nZU9ubHksXHJcbiAgICAgIG9wdGlvbnMub25seUJpbmRIYW5kbGVzLFxyXG4gICAgICBvcHRpb25zLmtleWJvYXJkU3VwcG9ydFxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIC8vIFVuYmluZCBtb3VzZSBhbmQgdG91Y2ggZXZlbnRzIHRvIHNsaWRlciBoYW5kbGVzXHJcbiAgcHJpdmF0ZSB1bmJpbmRFdmVudHMoKTogdm9pZCB7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlT25Nb3ZlKCk7XHJcbiAgICB0aGlzLnVuc3Vic2NyaWJlT25FbmQoKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGVsZW1lbnQgb2YgdGhpcy5nZXRBbGxTbGlkZXJFbGVtZW50cygpKSB7XHJcbiAgICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZWxlbWVudCkpIHtcclxuICAgICAgICBlbGVtZW50Lm9mZigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uQmFyU3RhcnQocG9pbnRlclR5cGU6IFBvaW50ZXJUeXBlLCBkcmFnZ2FibGVSYW5nZTogYm9vbGVhbiwgZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCxcclxuICAgIGJpbmRNb3ZlOiBib29sZWFuLCBiaW5kRW5kOiBib29sZWFuLCBzaW11bGF0ZUltbWVkaWF0ZU1vdmU/OiBib29sZWFuLCBzaW11bGF0ZUltbWVkaWF0ZUVuZD86IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIGlmIChkcmFnZ2FibGVSYW5nZSkge1xyXG4gICAgICB0aGlzLm9uRHJhZ1N0YXJ0KHBvaW50ZXJUeXBlLCBldmVudCwgYmluZE1vdmUsIGJpbmRFbmQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vblN0YXJ0KHBvaW50ZXJUeXBlLCBldmVudCwgYmluZE1vdmUsIGJpbmRFbmQsIHNpbXVsYXRlSW1tZWRpYXRlTW92ZSwgc2ltdWxhdGVJbW1lZGlhdGVFbmQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gb25TdGFydCBldmVudCBoYW5kbGVyXHJcbiAgcHJpdmF0ZSBvblN0YXJ0KHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSwgZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCxcclxuICAgICAgYmluZE1vdmU6IGJvb2xlYW4sIGJpbmRFbmQ6IGJvb2xlYW4sIHNpbXVsYXRlSW1tZWRpYXRlTW92ZT86IGJvb2xlYW4sIHNpbXVsYXRlSW1tZWRpYXRlRW5kPzogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAvLyBPbmx5IGNhbGwgcHJldmVudERlZmF1bHQoKSB3aGVuIGhhbmRsaW5nIG5vbi1wYXNzaXZlIGV2ZW50cyAocGFzc2l2ZSBldmVudHMgZG9uJ3QgbmVlZCBpdClcclxuICAgIGlmICghQ29tcGF0aWJpbGl0eUhlbHBlci5pc1RvdWNoRXZlbnQoZXZlbnQpICYmICFzdXBwb3J0c1Bhc3NpdmVFdmVudHMpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG5cclxuICAgIC8vIFdlIGhhdmUgdG8gZG8gdGhpcyBpbiBjYXNlIHRoZSBIVE1MIHdoZXJlIHRoZSBzbGlkZXJzIGFyZSBvblxyXG4gICAgLy8gaGF2ZSBiZWVuIGFuaW1hdGVkIGludG8gdmlldy5cclxuICAgIHRoaXMuY2FsY3VsYXRlVmlld0RpbWVuc2lvbnMoKTtcclxuXHJcbiAgICBpZiAoVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQocG9pbnRlclR5cGUpKSB7XHJcbiAgICAgIHBvaW50ZXJUeXBlID0gdGhpcy5nZXROZWFyZXN0SGFuZGxlKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPSBwb2ludGVyVHlwZTtcclxuXHJcbiAgICBjb25zdCBwb2ludGVyRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlID0gdGhpcy5nZXRQb2ludGVyRWxlbWVudChwb2ludGVyVHlwZSk7XHJcbiAgICBwb2ludGVyRWxlbWVudC5hY3RpdmUgPSB0cnVlO1xyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICBwb2ludGVyRWxlbWVudC5mb2N1cygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChiaW5kTW92ZSkge1xyXG4gICAgICB0aGlzLnVuc3Vic2NyaWJlT25Nb3ZlKCk7XHJcblxyXG4gICAgICBjb25zdCBvbk1vdmVDYWxsYmFjazogKChlOiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQpID0+IHZvaWQpID1cclxuICAgICAgICAoZTogTW91c2VFdmVudHxUb3VjaEV2ZW50KTogdm9pZCA9PiB0aGlzLmRyYWdnaW5nLmFjdGl2ZSA/IHRoaXMub25EcmFnTW92ZShlKSA6IHRoaXMub25Nb3ZlKGUpO1xyXG5cclxuICAgICAgaWYgKENvbXBhdGliaWxpdHlIZWxwZXIuaXNUb3VjaEV2ZW50KGV2ZW50KSkge1xyXG4gICAgICAgIHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hQYXNzaXZlRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgIGRvY3VtZW50LCAndG91Y2htb3ZlJywgb25Nb3ZlQ2FsbGJhY2spO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25Nb3ZlRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgZG9jdW1lbnQsICdtb3VzZW1vdmUnLCBvbk1vdmVDYWxsYmFjayk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAoYmluZEVuZCkge1xyXG4gICAgICB0aGlzLnVuc3Vic2NyaWJlT25FbmQoKTtcclxuXHJcbiAgICAgIGNvbnN0IG9uRW5kQ2FsbGJhY2s6ICgoZTogTW91c2VFdmVudHxUb3VjaEV2ZW50KSA9PiB2b2lkKSA9XHJcbiAgICAgICAgKGU6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCk6IHZvaWQgPT4gdGhpcy5vbkVuZChlKTtcclxuXHJcbiAgICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzVG91Y2hFdmVudChldmVudCkpIHtcclxuICAgICAgICB0aGlzLm9uRW5kRXZlbnRMaXN0ZW5lciA9IHRoaXMuZXZlbnRMaXN0ZW5lckhlbHBlci5hdHRhY2hQYXNzaXZlRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ3RvdWNoZW5kJywgb25FbmRDYWxsYmFjayk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vbkVuZEV2ZW50TGlzdGVuZXIgPSB0aGlzLmV2ZW50TGlzdGVuZXJIZWxwZXIuYXR0YWNoRXZlbnRMaXN0ZW5lcihkb2N1bWVudCwgJ21vdXNldXAnLCBvbkVuZENhbGxiYWNrKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudXNlckNoYW5nZVN0YXJ0LmVtaXQodGhpcy5nZXRDaGFuZ2VDb250ZXh0KCkpO1xyXG5cclxuICAgIGlmIChDb21wYXRpYmlsaXR5SGVscGVyLmlzVG91Y2hFdmVudChldmVudCkgJiYgIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKChldmVudCBhcyBUb3VjaEV2ZW50KS5jaGFuZ2VkVG91Y2hlcykpIHtcclxuICAgICAgLy8gU3RvcmUgdGhlIHRvdWNoIGlkZW50aWZpZXJcclxuICAgICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudG91Y2hJZCkpIHtcclxuICAgICAgICB0aGlzLnRvdWNoSWQgPSAoZXZlbnQgYXMgVG91Y2hFdmVudCkuY2hhbmdlZFRvdWNoZXNbMF0uaWRlbnRpZmllcjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENsaWNrIGV2ZW50cywgZWl0aGVyIHdpdGggbW91c2Ugb3IgdG91Y2ggZ2VzdHVyZSBhcmUgd2VpcmQuIFNvbWV0aW1lcyB0aGV5IHJlc3VsdCBpbiBmdWxsXHJcbiAgICAvLyBzdGFydCwgbW92ZSwgZW5kIHNlcXVlbmNlLCBhbmQgc29tZXRpbWVzLCB0aGV5IGRvbid0IC0gdGhleSBvbmx5IGludm9rZSBtb3VzZWRvd25cclxuICAgIC8vIEFzIGEgd29ya2Fyb3VuZCwgd2Ugc2ltdWxhdGUgdGhlIGZpcnN0IG1vdmUgZXZlbnQgYW5kIHRoZSBlbmQgZXZlbnQgaWYgaXQncyBuZWNlc3NhcnlcclxuICAgIGlmIChzaW11bGF0ZUltbWVkaWF0ZU1vdmUpIHtcclxuICAgICAgdGhpcy5vbk1vdmUoZXZlbnQsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzaW11bGF0ZUltbWVkaWF0ZUVuZCkge1xyXG4gICAgICB0aGlzLm9uRW5kKGV2ZW50KTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIG9uTW92ZSBldmVudCBoYW5kbGVyXHJcbiAgcHJpdmF0ZSBvbk1vdmUoZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCwgZnJvbVRpY2s/OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBsZXQgdG91Y2hGb3JUaGlzU2xpZGVyOiBUb3VjaCA9IG51bGw7XHJcblxyXG4gICAgaWYgKENvbXBhdGliaWxpdHlIZWxwZXIuaXNUb3VjaEV2ZW50KGV2ZW50KSkge1xyXG4gICAgICBjb25zdCBjaGFuZ2VkVG91Y2hlczogVG91Y2hMaXN0ID0gKGV2ZW50IGFzIFRvdWNoRXZlbnQpLmNoYW5nZWRUb3VjaGVzO1xyXG4gICAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBpZiAoY2hhbmdlZFRvdWNoZXNbaV0uaWRlbnRpZmllciA9PT0gdGhpcy50b3VjaElkKSB7XHJcbiAgICAgICAgICB0b3VjaEZvclRoaXNTbGlkZXIgPSBjaGFuZ2VkVG91Y2hlc1tpXTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRvdWNoRm9yVGhpc1NsaWRlcikpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hbmltYXRlICYmICF0aGlzLnZpZXdPcHRpb25zLmFuaW1hdGVPbk1vdmUpIHtcclxuICAgICAgaWYgKHRoaXMubW92aW5nKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IHRydWU7XHJcblxyXG4gICAgY29uc3QgbmV3UG9zOiBudW1iZXIgPSAhVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodG91Y2hGb3JUaGlzU2xpZGVyKVxyXG4gICAgICA/IHRoaXMuZ2V0RXZlbnRQb3NpdGlvbihldmVudCwgdG91Y2hGb3JUaGlzU2xpZGVyLmlkZW50aWZpZXIpXHJcbiAgICAgIDogdGhpcy5nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcclxuICAgIGxldCBuZXdWYWx1ZTogbnVtYmVyO1xyXG4gICAgY29uc3QgY2VpbFZhbHVlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyB0aGlzLnZpZXdPcHRpb25zLmZsb29yXHJcbiAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLmNlaWw7XHJcbiAgICBjb25zdCBmbG9vclZhbHVlOiBudW1iZXIgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0ID8gdGhpcy52aWV3T3B0aW9ucy5jZWlsIDogdGhpcy52aWV3T3B0aW9ucy5mbG9vcjtcclxuXHJcbiAgICBpZiAobmV3UG9zIDw9IDApIHtcclxuICAgICAgbmV3VmFsdWUgPSBmbG9vclZhbHVlO1xyXG4gICAgfSBlbHNlIGlmIChuZXdQb3MgPj0gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbikge1xyXG4gICAgICBuZXdWYWx1ZSA9IGNlaWxWYWx1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld1ZhbHVlID0gdGhpcy5wb3NpdGlvblRvVmFsdWUobmV3UG9zKTtcclxuICAgICAgaWYgKGZyb21UaWNrICYmICFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLnRpY2tTdGVwKSkge1xyXG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5yb3VuZFN0ZXAobmV3VmFsdWUsIHRoaXMudmlld09wdGlvbnMudGlja1N0ZXApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5yb3VuZFN0ZXAobmV3VmFsdWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnBvc2l0aW9uVHJhY2tpbmdIYW5kbGUobmV3VmFsdWUpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbkVuZChldmVudDogTW91c2VFdmVudHxUb3VjaEV2ZW50KTogdm9pZCB7XHJcbiAgICBpZiAoQ29tcGF0aWJpbGl0eUhlbHBlci5pc1RvdWNoRXZlbnQoZXZlbnQpKSB7XHJcbiAgICAgIGNvbnN0IGNoYW5nZWRUb3VjaGVzOiBUb3VjaExpc3QgPSAoZXZlbnQgYXMgVG91Y2hFdmVudCkuY2hhbmdlZFRvdWNoZXM7XHJcbiAgICAgIGlmIChjaGFuZ2VkVG91Y2hlc1swXS5pZGVudGlmaWVyICE9PSB0aGlzLnRvdWNoSWQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMuYW5pbWF0ZSkge1xyXG4gICAgICB0aGlzLnNsaWRlckVsZW1lbnRBbmltYXRlQ2xhc3MgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMudG91Y2hJZCA9IG51bGw7XHJcblxyXG4gICAgaWYgKCF0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gbnVsbDtcclxuICAgIH1cclxuICAgIHRoaXMuZHJhZ2dpbmcuYWN0aXZlID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy51bnN1YnNjcmliZU9uTW92ZSgpO1xyXG4gICAgdGhpcy51bnN1YnNjcmliZU9uRW5kKCk7XHJcblxyXG4gICAgdGhpcy51c2VyQ2hhbmdlRW5kLmVtaXQodGhpcy5nZXRDaGFuZ2VDb250ZXh0KCkpO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvblBvaW50ZXJGb2N1cyhwb2ludGVyVHlwZTogUG9pbnRlclR5cGUpOiB2b2lkIHtcclxuICAgIGNvbnN0IHBvaW50ZXJFbGVtZW50OiBTbGlkZXJIYW5kbGVEaXJlY3RpdmUgPSB0aGlzLmdldFBvaW50ZXJFbGVtZW50KHBvaW50ZXJUeXBlKTtcclxuICAgIHBvaW50ZXJFbGVtZW50Lm9uKCdibHVyJywgKCk6IHZvaWQgPT4gdGhpcy5vblBvaW50ZXJCbHVyKHBvaW50ZXJFbGVtZW50KSk7XHJcbiAgICBwb2ludGVyRWxlbWVudC5vbigna2V5ZG93bicsIChldmVudDogS2V5Ym9hcmRFdmVudCk6IHZvaWQgPT4gdGhpcy5vbktleWJvYXJkRXZlbnQoZXZlbnQpKTtcclxuICAgIHBvaW50ZXJFbGVtZW50Lm9uKCdrZXl1cCcsICgpOiB2b2lkID0+IHRoaXMub25LZXlVcCgpKTtcclxuICAgIHBvaW50ZXJFbGVtZW50LmFjdGl2ZSA9IHRydWU7XHJcblxyXG4gICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gcG9pbnRlclR5cGU7XHJcbiAgICB0aGlzLmN1cnJlbnRGb2N1c1BvaW50ZXIgPSBwb2ludGVyVHlwZTtcclxuICAgIHRoaXMuZmlyc3RLZXlEb3duID0gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25LZXlVcCgpOiB2b2lkIHtcclxuICAgIHRoaXMuZmlyc3RLZXlEb3duID0gdHJ1ZTtcclxuICAgIHRoaXMudXNlckNoYW5nZUVuZC5lbWl0KHRoaXMuZ2V0Q2hhbmdlQ29udGV4dCgpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgb25Qb2ludGVyQmx1cihwb2ludGVyOiBTbGlkZXJIYW5kbGVEaXJlY3RpdmUpOiB2b2lkIHtcclxuICAgIHBvaW50ZXIub2ZmKCdibHVyJyk7XHJcbiAgICBwb2ludGVyLm9mZigna2V5ZG93bicpO1xyXG4gICAgcG9pbnRlci5vZmYoJ2tleXVwJyk7XHJcbiAgICBwb2ludGVyLmFjdGl2ZSA9IGZhbHNlO1xyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRoaXMudG91Y2hJZCkpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID0gbnVsbDtcclxuICAgICAgdGhpcy5jdXJyZW50Rm9jdXNQb2ludGVyID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0S2V5QWN0aW9ucyhjdXJyZW50VmFsdWU6IG51bWJlcik6IHtba2V5OiBzdHJpbmddOiBudW1iZXJ9IHtcclxuICAgIGNvbnN0IHZhbHVlUmFuZ2U6IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMuY2VpbCAtIHRoaXMudmlld09wdGlvbnMuZmxvb3I7XHJcblxyXG4gICAgbGV0IGluY3JlYXNlU3RlcDogbnVtYmVyID0gY3VycmVudFZhbHVlICsgdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgbGV0IGRlY3JlYXNlU3RlcDogbnVtYmVyID0gY3VycmVudFZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgbGV0IGluY3JlYXNlUGFnZTogbnVtYmVyID0gY3VycmVudFZhbHVlICsgdmFsdWVSYW5nZSAvIDEwO1xyXG4gICAgbGV0IGRlY3JlYXNlUGFnZTogbnVtYmVyID0gY3VycmVudFZhbHVlIC0gdmFsdWVSYW5nZSAvIDEwO1xyXG5cclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJldmVyc2VkQ29udHJvbHMpIHtcclxuICAgICAgaW5jcmVhc2VTdGVwID0gY3VycmVudFZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgICBkZWNyZWFzZVN0ZXAgPSBjdXJyZW50VmFsdWUgKyB0aGlzLnZpZXdPcHRpb25zLnN0ZXA7XHJcbiAgICAgIGluY3JlYXNlUGFnZSA9IGN1cnJlbnRWYWx1ZSAtIHZhbHVlUmFuZ2UgLyAxMDtcclxuICAgICAgZGVjcmVhc2VQYWdlID0gY3VycmVudFZhbHVlICsgdmFsdWVSYW5nZSAvIDEwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExlZnQgdG8gcmlnaHQgZGVmYXVsdCBhY3Rpb25zXHJcbiAgICBjb25zdCBhY3Rpb25zOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHtcclxuICAgICAgVVA6IGluY3JlYXNlU3RlcCxcclxuICAgICAgRE9XTjogZGVjcmVhc2VTdGVwLFxyXG4gICAgICBMRUZUOiBkZWNyZWFzZVN0ZXAsXHJcbiAgICAgIFJJR0hUOiBpbmNyZWFzZVN0ZXAsXHJcbiAgICAgIFBBR0VVUDogaW5jcmVhc2VQYWdlLFxyXG4gICAgICBQQUdFRE9XTjogZGVjcmVhc2VQYWdlLFxyXG4gICAgICBIT01FOiB0aGlzLnZpZXdPcHRpb25zLnJldmVyc2VkQ29udHJvbHMgPyB0aGlzLnZpZXdPcHRpb25zLmNlaWwgOiB0aGlzLnZpZXdPcHRpb25zLmZsb29yLFxyXG4gICAgICBFTkQ6IHRoaXMudmlld09wdGlvbnMucmV2ZXJzZWRDb250cm9scyA/IHRoaXMudmlld09wdGlvbnMuZmxvb3IgOiB0aGlzLnZpZXdPcHRpb25zLmNlaWwsXHJcbiAgICB9O1xyXG4gICAgLy8gcmlnaHQgdG8gbGVmdCBtZWFucyBzd2FwcGluZyByaWdodCBhbmQgbGVmdCBhcnJvd3NcclxuICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0KSB7XHJcbiAgICAgIGFjdGlvbnMuTEVGVCA9IGluY3JlYXNlU3RlcDtcclxuICAgICAgYWN0aW9ucy5SSUdIVCA9IGRlY3JlYXNlU3RlcDtcclxuICAgICAgLy8gcmlnaHQgdG8gbGVmdCBhbmQgdmVydGljYWwgbWVhbnMgd2UgYWxzbyBzd2FwIHVwIGFuZCBkb3duXHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnZlcnRpY2FsIHx8IHRoaXMudmlld09wdGlvbnMucm90YXRlICE9PSAwKSB7XHJcbiAgICAgICAgYWN0aW9ucy5VUCA9IGRlY3JlYXNlU3RlcDtcclxuICAgICAgICBhY3Rpb25zLkRPV04gPSBpbmNyZWFzZVN0ZXA7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBhY3Rpb25zO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBvbktleWJvYXJkRXZlbnQoZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZTogbnVtYmVyID0gdGhpcy5nZXRDdXJyZW50VHJhY2tpbmdWYWx1ZSgpO1xyXG4gICAgY29uc3Qga2V5Q29kZTogbnVtYmVyID0gIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50LmtleUNvZGUpXHJcbiAgICAgID8gZXZlbnQua2V5Q29kZVxyXG4gICAgICA6IGV2ZW50LndoaWNoO1xyXG4gICAgY29uc3Qga2V5czoge1trZXlDb2RlOiBudW1iZXJdOiBzdHJpbmd9ID0ge1xyXG4gICAgICAgIDM4OiAnVVAnLFxyXG4gICAgICAgIDQwOiAnRE9XTicsXHJcbiAgICAgICAgMzc6ICdMRUZUJyxcclxuICAgICAgICAzOTogJ1JJR0hUJyxcclxuICAgICAgICAzMzogJ1BBR0VVUCcsXHJcbiAgICAgICAgMzQ6ICdQQUdFRE9XTicsXHJcbiAgICAgICAgMzY6ICdIT01FJyxcclxuICAgICAgICAzNTogJ0VORCcsXHJcbiAgICAgIH07XHJcbiAgICBjb25zdCBhY3Rpb25zOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHRoaXMuZ2V0S2V5QWN0aW9ucyhjdXJyZW50VmFsdWUpO1xyXG4gICAgY29uc3Qga2V5OiBzdHJpbmcgPSBrZXlzW2tleUNvZGVdO1xyXG4gICAgY29uc3QgYWN0aW9uOiBudW1iZXIgPSBhY3Rpb25zW2tleV07XHJcblxyXG4gICAgaWYgKFZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGFjdGlvbikgfHwgVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgIGlmICh0aGlzLmZpcnN0S2V5RG93bikge1xyXG4gICAgICB0aGlzLmZpcnN0S2V5RG93biA9IGZhbHNlO1xyXG4gICAgICB0aGlzLnVzZXJDaGFuZ2VTdGFydC5lbWl0KHRoaXMuZ2V0Q2hhbmdlQ29udGV4dCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBhY3Rpb25WYWx1ZTogbnVtYmVyID0gTWF0aEhlbHBlci5jbGFtcFRvUmFuZ2UoYWN0aW9uLCB0aGlzLnZpZXdPcHRpb25zLmZsb29yLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpO1xyXG4gICAgY29uc3QgbmV3VmFsdWU6IG51bWJlciA9IHRoaXMucm91bmRTdGVwKGFjdGlvblZhbHVlKTtcclxuICAgIGlmICghdGhpcy52aWV3T3B0aW9ucy5kcmFnZ2FibGVSYW5nZU9ubHkpIHtcclxuICAgICAgdGhpcy5wb3NpdGlvblRyYWNraW5nSGFuZGxlKG5ld1ZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGRpZmZlcmVuY2U6IG51bWJlciA9IHRoaXMudmlld0hpZ2hWYWx1ZSAtIHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgICBsZXQgbmV3TWluVmFsdWU6IG51bWJlcjtcclxuICAgICAgbGV0IG5ld01heFZhbHVlOiBudW1iZXI7XHJcblxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICBuZXdNaW5WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIG5ld01heFZhbHVlID0gbmV3VmFsdWUgKyBkaWZmZXJlbmNlO1xyXG4gICAgICAgIGlmIChuZXdNYXhWYWx1ZSA+IHRoaXMudmlld09wdGlvbnMuY2VpbCkge1xyXG4gICAgICAgICAgbmV3TWF4VmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLmNlaWw7XHJcbiAgICAgICAgICBuZXdNaW5WYWx1ZSA9IG5ld01heFZhbHVlIC0gZGlmZmVyZW5jZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgICBuZXdNYXhWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIG5ld01pblZhbHVlID0gbmV3VmFsdWUgLSBkaWZmZXJlbmNlO1xyXG4gICAgICAgIGlmIChuZXdNaW5WYWx1ZSA8IHRoaXMudmlld09wdGlvbnMuZmxvb3IpIHtcclxuICAgICAgICAgIG5ld01pblZhbHVlID0gdGhpcy52aWV3T3B0aW9ucy5mbG9vcjtcclxuICAgICAgICAgIG5ld01heFZhbHVlID0gbmV3TWluVmFsdWUgKyBkaWZmZXJlbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnBvc2l0aW9uVHJhY2tpbmdCYXIobmV3TWluVmFsdWUsIG5ld01heFZhbHVlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIG9uRHJhZ1N0YXJ0IGV2ZW50IGhhbmRsZXIsIGhhbmRsZXMgZHJhZ2dpbmcgb2YgdGhlIG1pZGRsZSBiYXJcclxuICBwcml2YXRlIG9uRHJhZ1N0YXJ0KHBvaW50ZXJUeXBlOiBQb2ludGVyVHlwZSwgZXZlbnQ6IE1vdXNlRXZlbnR8VG91Y2hFdmVudCxcclxuICAgIGJpbmRNb3ZlOiBib29sZWFuLCBiaW5kRW5kOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICBjb25zdCBwb3NpdGlvbjogbnVtYmVyID0gdGhpcy5nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcclxuXHJcbiAgICB0aGlzLmRyYWdnaW5nID0gbmV3IERyYWdnaW5nKCk7XHJcbiAgICB0aGlzLmRyYWdnaW5nLmFjdGl2ZSA9IHRydWU7XHJcbiAgICB0aGlzLmRyYWdnaW5nLnZhbHVlID0gdGhpcy5wb3NpdGlvblRvVmFsdWUocG9zaXRpb24pO1xyXG4gICAgdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlID0gdGhpcy52aWV3SGlnaFZhbHVlIC0gdGhpcy52aWV3TG93VmFsdWU7XHJcbiAgICB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0ID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdFxyXG4gICAgICAgID8gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uIC0gcG9zaXRpb25cclxuICAgICAgICA6IHBvc2l0aW9uIC0gdGhpcy5taW5IYW5kbGVFbGVtZW50LnBvc2l0aW9uO1xyXG4gICAgdGhpcy5kcmFnZ2luZy5oaWdoTGltaXQgPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0XHJcbiAgICAgICAgPyBwb3NpdGlvbiAtIHRoaXMubWF4SGFuZGxlRWxlbWVudC5wb3NpdGlvblxyXG4gICAgICAgIDogdGhpcy5tYXhIYW5kbGVFbGVtZW50LnBvc2l0aW9uIC0gcG9zaXRpb247XHJcblxyXG4gICAgdGhpcy5vblN0YXJ0KHBvaW50ZXJUeXBlLCBldmVudCwgYmluZE1vdmUsIGJpbmRFbmQpO1xyXG4gIH1cclxuXHJcbiAgLyoqIEdldCBtaW4gdmFsdWUgZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhlIG5ld1BvcyBpcyBvdXRPZkJvdW5kcyBhYm92ZSBvciBiZWxvdyB0aGUgYmFyIGFuZCByaWdodFRvTGVmdCAqL1xyXG4gIHByaXZhdGUgZ2V0TWluVmFsdWUobmV3UG9zOiBudW1iZXIsIG91dE9mQm91bmRzOiBib29sZWFuLCBpc0Fib3ZlOiBib29sZWFuKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGlzUlRMOiBib29sZWFuID0gdGhpcy52aWV3T3B0aW9ucy5yaWdodFRvTGVmdDtcclxuICAgIGxldCB2YWx1ZTogbnVtYmVyID0gbnVsbDtcclxuXHJcbiAgICBpZiAob3V0T2ZCb3VuZHMpIHtcclxuICAgICAgaWYgKGlzQWJvdmUpIHtcclxuICAgICAgICB2YWx1ZSA9IGlzUlRMXHJcbiAgICAgICAgICA/IHRoaXMudmlld09wdGlvbnMuZmxvb3JcclxuICAgICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5jZWlsIC0gdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID0gaXNSVExcclxuICAgICAgICAgID8gdGhpcy52aWV3T3B0aW9ucy5jZWlsIC0gdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlXHJcbiAgICAgICAgICA6IHRoaXMudmlld09wdGlvbnMuZmxvb3I7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhbHVlID0gaXNSVExcclxuICAgICAgICA/IHRoaXMucG9zaXRpb25Ub1ZhbHVlKG5ld1BvcyArIHRoaXMuZHJhZ2dpbmcubG93TGltaXQpXHJcbiAgICAgICAgOiB0aGlzLnBvc2l0aW9uVG9WYWx1ZShuZXdQb3MgLSB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnJvdW5kU3RlcCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvKiogR2V0IG1heCB2YWx1ZSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgbmV3UG9zIGlzIG91dE9mQm91bmRzIGFib3ZlIG9yIGJlbG93IHRoZSBiYXIgYW5kIHJpZ2h0VG9MZWZ0ICovXHJcbiAgcHJpdmF0ZSBnZXRNYXhWYWx1ZShuZXdQb3M6IG51bWJlciwgb3V0T2ZCb3VuZHM6IGJvb2xlYW4sIGlzQWJvdmU6IGJvb2xlYW4pOiBudW1iZXIge1xyXG4gICAgY29uc3QgaXNSVEw6IGJvb2xlYW4gPSB0aGlzLnZpZXdPcHRpb25zLnJpZ2h0VG9MZWZ0O1xyXG4gICAgbGV0IHZhbHVlOiBudW1iZXIgPSBudWxsO1xyXG5cclxuICAgIGlmIChvdXRPZkJvdW5kcykge1xyXG4gICAgICBpZiAoaXNBYm92ZSkge1xyXG4gICAgICAgIHZhbHVlID0gaXNSVExcclxuICAgICAgICAgID8gdGhpcy52aWV3T3B0aW9ucy5mbG9vciArIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZVxyXG4gICAgICAgICAgOiB0aGlzLnZpZXdPcHRpb25zLmNlaWw7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFsdWUgPSBpc1JUTFxyXG4gICAgICAgICAgPyB0aGlzLnZpZXdPcHRpb25zLmNlaWxcclxuICAgICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5mbG9vciArIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGlzUlRMKSB7XHJcbiAgICAgICAgdmFsdWUgPVxyXG4gICAgICAgICAgdGhpcy5wb3NpdGlvblRvVmFsdWUobmV3UG9zICsgdGhpcy5kcmFnZ2luZy5sb3dMaW1pdCkgK1xyXG4gICAgICAgICAgdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHZhbHVlID1cclxuICAgICAgICAgIHRoaXMucG9zaXRpb25Ub1ZhbHVlKG5ld1BvcyAtIHRoaXMuZHJhZ2dpbmcubG93TGltaXQpICtcclxuICAgICAgICAgIHRoaXMuZHJhZ2dpbmcuZGlmZmVyZW5jZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLnJvdW5kU3RlcCh2YWx1ZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG9uRHJhZ01vdmUoZXZlbnQ/OiBNb3VzZUV2ZW50fFRvdWNoRXZlbnQpOiB2b2lkIHtcclxuICAgIGNvbnN0IG5ld1BvczogbnVtYmVyID0gdGhpcy5nZXRFdmVudFBvc2l0aW9uKGV2ZW50KTtcclxuXHJcbiAgICBpZiAodGhpcy52aWV3T3B0aW9ucy5hbmltYXRlICYmICF0aGlzLnZpZXdPcHRpb25zLmFuaW1hdGVPbk1vdmUpIHtcclxuICAgICAgaWYgKHRoaXMubW92aW5nKSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJFbGVtZW50QW5pbWF0ZUNsYXNzID0gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLm1vdmluZyA9IHRydWU7XHJcblxyXG4gICAgbGV0IGNlaWxMaW1pdDogbnVtYmVyLFxyXG4gICAgICAgIGZsb29yTGltaXQ6IG51bWJlcixcclxuICAgICAgICBmbG9vckhhbmRsZUVsZW1lbnQ6IFNsaWRlckhhbmRsZURpcmVjdGl2ZSxcclxuICAgICAgICBjZWlsSGFuZGxlRWxlbWVudDogU2xpZGVySGFuZGxlRGlyZWN0aXZlO1xyXG4gICAgaWYgKHRoaXMudmlld09wdGlvbnMucmlnaHRUb0xlZnQpIHtcclxuICAgICAgY2VpbExpbWl0ID0gdGhpcy5kcmFnZ2luZy5sb3dMaW1pdDtcclxuICAgICAgZmxvb3JMaW1pdCA9IHRoaXMuZHJhZ2dpbmcuaGlnaExpbWl0O1xyXG4gICAgICBmbG9vckhhbmRsZUVsZW1lbnQgPSB0aGlzLm1heEhhbmRsZUVsZW1lbnQ7XHJcbiAgICAgIGNlaWxIYW5kbGVFbGVtZW50ID0gdGhpcy5taW5IYW5kbGVFbGVtZW50O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2VpbExpbWl0ID0gdGhpcy5kcmFnZ2luZy5oaWdoTGltaXQ7XHJcbiAgICAgIGZsb29yTGltaXQgPSB0aGlzLmRyYWdnaW5nLmxvd0xpbWl0O1xyXG4gICAgICBmbG9vckhhbmRsZUVsZW1lbnQgPSB0aGlzLm1pbkhhbmRsZUVsZW1lbnQ7XHJcbiAgICAgIGNlaWxIYW5kbGVFbGVtZW50ID0gdGhpcy5tYXhIYW5kbGVFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGlzVW5kZXJGbG9vckxpbWl0OiBib29sZWFuID0gKG5ld1BvcyA8PSBmbG9vckxpbWl0KTtcclxuICAgIGNvbnN0IGlzT3ZlckNlaWxMaW1pdDogYm9vbGVhbiA9IChuZXdQb3MgPj0gdGhpcy5tYXhIYW5kbGVQb3NpdGlvbiAtIGNlaWxMaW1pdCk7XHJcblxyXG4gICAgbGV0IG5ld01pblZhbHVlOiBudW1iZXI7XHJcbiAgICBsZXQgbmV3TWF4VmFsdWU6IG51bWJlcjtcclxuICAgIGlmIChpc1VuZGVyRmxvb3JMaW1pdCkge1xyXG4gICAgICBpZiAoZmxvb3JIYW5kbGVFbGVtZW50LnBvc2l0aW9uID09PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIG5ld01pblZhbHVlID0gdGhpcy5nZXRNaW5WYWx1ZShuZXdQb3MsIHRydWUsIGZhbHNlKTtcclxuICAgICAgbmV3TWF4VmFsdWUgPSB0aGlzLmdldE1heFZhbHVlKG5ld1BvcywgdHJ1ZSwgZmFsc2UpO1xyXG4gICAgfSBlbHNlIGlmIChpc092ZXJDZWlsTGltaXQpIHtcclxuICAgICAgaWYgKGNlaWxIYW5kbGVFbGVtZW50LnBvc2l0aW9uID09PSB0aGlzLm1heEhhbmRsZVBvc2l0aW9uKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIG5ld01heFZhbHVlID0gdGhpcy5nZXRNYXhWYWx1ZShuZXdQb3MsIHRydWUsIHRydWUpO1xyXG4gICAgICBuZXdNaW5WYWx1ZSA9IHRoaXMuZ2V0TWluVmFsdWUobmV3UG9zLCB0cnVlLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld01pblZhbHVlID0gdGhpcy5nZXRNaW5WYWx1ZShuZXdQb3MsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICAgIG5ld01heFZhbHVlID0gdGhpcy5nZXRNYXhWYWx1ZShuZXdQb3MsIGZhbHNlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wb3NpdGlvblRyYWNraW5nQmFyKG5ld01pblZhbHVlLCBuZXdNYXhWYWx1ZSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdGhlIG5ldyB2YWx1ZSBhbmQgcG9zaXRpb24gZm9yIHRoZSBlbnRpcmUgYmFyXHJcbiAgcHJpdmF0ZSBwb3NpdGlvblRyYWNraW5nQmFyKG5ld01pblZhbHVlOiBudW1iZXIsIG5ld01heFZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5taW5MaW1pdCkgJiZcclxuICAgICAgICBuZXdNaW5WYWx1ZSA8IHRoaXMudmlld09wdGlvbnMubWluTGltaXQpIHtcclxuICAgICAgbmV3TWluVmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLm1pbkxpbWl0O1xyXG4gICAgICBuZXdNYXhWYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KG5ld01pblZhbHVlICsgdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgIH1cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5tYXhMaW1pdCkgJiZcclxuICAgICAgICBuZXdNYXhWYWx1ZSA+IHRoaXMudmlld09wdGlvbnMubWF4TGltaXQpIHtcclxuICAgICAgbmV3TWF4VmFsdWUgPSB0aGlzLnZpZXdPcHRpb25zLm1heExpbWl0O1xyXG4gICAgICBuZXdNaW5WYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KG5ld01heFZhbHVlIC0gdGhpcy5kcmFnZ2luZy5kaWZmZXJlbmNlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnZpZXdMb3dWYWx1ZSA9IG5ld01pblZhbHVlO1xyXG4gICAgdGhpcy52aWV3SGlnaFZhbHVlID0gbmV3TWF4VmFsdWU7XHJcbiAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgdGhpcy51cGRhdGVIYW5kbGVzKFBvaW50ZXJUeXBlLk1pbiwgdGhpcy52YWx1ZVRvUG9zaXRpb24obmV3TWluVmFsdWUpKTtcclxuICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKG5ld01heFZhbHVlKSk7XHJcbiAgfVxyXG5cclxuICAvLyBTZXQgdGhlIG5ldyB2YWx1ZSBhbmQgcG9zaXRpb24gdG8gdGhlIGN1cnJlbnQgdHJhY2tpbmcgaGFuZGxlXHJcbiAgcHJpdmF0ZSBwb3NpdGlvblRyYWNraW5nSGFuZGxlKG5ld1ZhbHVlOiBudW1iZXIpOiB2b2lkIHtcclxuICAgIG5ld1ZhbHVlID0gdGhpcy5hcHBseU1pbk1heExpbWl0KG5ld1ZhbHVlKTtcclxuICAgIGlmICh0aGlzLnJhbmdlKSB7XHJcbiAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLnB1c2hSYW5nZSkge1xyXG4gICAgICAgIG5ld1ZhbHVlID0gdGhpcy5hcHBseVB1c2hSYW5nZShuZXdWYWx1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMubm9Td2l0Y2hpbmcpIHtcclxuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbiAmJlxyXG4gICAgICAgICAgICAgIG5ld1ZhbHVlID4gdGhpcy52aWV3SGlnaFZhbHVlKSB7XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlID0gdGhpcy5hcHBseU1pbk1heFJhbmdlKHRoaXMudmlld0hpZ2hWYWx1ZSk7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlIDwgdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmFwcGx5TWluTWF4UmFuZ2UodGhpcy52aWV3TG93VmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXdWYWx1ZSA9IHRoaXMuYXBwbHlNaW5NYXhSYW5nZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgLyogVGhpcyBpcyB0byBjaGVjayBpZiB3ZSBuZWVkIHRvIHN3aXRjaCB0aGUgbWluIGFuZCBtYXggaGFuZGxlcyAqL1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1pbiAmJiBuZXdWYWx1ZSA+IHRoaXMudmlld0hpZ2hWYWx1ZSkge1xyXG4gICAgICAgICAgdGhpcy52aWV3TG93VmFsdWUgPSB0aGlzLnZpZXdIaWdoVmFsdWU7XHJcbiAgICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVzKFBvaW50ZXJUeXBlLk1pbiwgdGhpcy5tYXhIYW5kbGVFbGVtZW50LnBvc2l0aW9uKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlQXJpYUF0dHJpYnV0ZXMoKTtcclxuICAgICAgICAgIHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9IFBvaW50ZXJUeXBlLk1heDtcclxuICAgICAgICAgIHRoaXMubWluSGFuZGxlRWxlbWVudC5hY3RpdmUgPSBmYWxzZTtcclxuICAgICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5hY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgICAgaWYgKHRoaXMudmlld09wdGlvbnMua2V5Ym9hcmRTdXBwb3J0KSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF4SGFuZGxlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXggJiZcclxuICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlIDwgdGhpcy52aWV3TG93VmFsdWUpIHtcclxuICAgICAgICAgIHRoaXMudmlld0hpZ2hWYWx1ZSA9IHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5hcHBseVZpZXdDaGFuZ2UoKTtcclxuICAgICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMubWluSGFuZGxlRWxlbWVudC5wb3NpdGlvbik7XHJcbiAgICAgICAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPSBQb2ludGVyVHlwZS5NaW47XHJcbiAgICAgICAgICB0aGlzLm1heEhhbmRsZUVsZW1lbnQuYWN0aXZlID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICAgIGlmICh0aGlzLnZpZXdPcHRpb25zLmtleWJvYXJkU3VwcG9ydCkge1xyXG4gICAgICAgICAgICB0aGlzLm1pbkhhbmRsZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5nZXRDdXJyZW50VHJhY2tpbmdWYWx1ZSgpICE9PSBuZXdWYWx1ZSkge1xyXG4gICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICB0aGlzLnZpZXdMb3dWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIHRoaXMuYXBwbHlWaWV3Q2hhbmdlKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NYXgpIHtcclxuICAgICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKG5ld1ZhbHVlKSk7XHJcbiAgICAgIHRoaXMudXBkYXRlQXJpYUF0dHJpYnV0ZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYXBwbHlNaW5NYXhMaW1pdChuZXdWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5taW5MaW1pdCkgJiYgbmV3VmFsdWUgPCB0aGlzLnZpZXdPcHRpb25zLm1pbkxpbWl0KSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnZpZXdPcHRpb25zLm1pbkxpbWl0O1xyXG4gICAgfVxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLm1heExpbWl0KSAmJiBuZXdWYWx1ZSA+IHRoaXMudmlld09wdGlvbnMubWF4TGltaXQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudmlld09wdGlvbnMubWF4TGltaXQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmFsdWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5TWluTWF4UmFuZ2UobmV3VmFsdWU6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICBjb25zdCBvcHBvc2l0ZVZhbHVlOiBudW1iZXIgPSAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pXHJcbiAgICAgID8gdGhpcy52aWV3SGlnaFZhbHVlXHJcbiAgICAgIDogdGhpcy52aWV3TG93VmFsdWU7XHJcbiAgICBjb25zdCBkaWZmZXJlbmNlOiBudW1iZXIgPSBNYXRoLmFicyhuZXdWYWx1ZSAtIG9wcG9zaXRlVmFsdWUpO1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlKSkge1xyXG4gICAgICBpZiAoZGlmZmVyZW5jZSA8IHRoaXMudmlld09wdGlvbnMubWluUmFuZ2UpIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICAgIHJldHVybiBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdCh0aGlzLnZpZXdIaWdoVmFsdWUgLSB0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgICByZXR1cm4gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQodGhpcy52aWV3TG93VmFsdWUgKyB0aGlzLnZpZXdPcHRpb25zLm1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5tYXhSYW5nZSkpIHtcclxuICAgICAgaWYgKGRpZmZlcmVuY2UgPiB0aGlzLnZpZXdPcHRpb25zLm1heFJhbmdlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgICByZXR1cm4gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQodGhpcy52aWV3SGlnaFZhbHVlIC0gdGhpcy52aWV3T3B0aW9ucy5tYXhSYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRUcmFja2luZ1BvaW50ZXIgPT09IFBvaW50ZXJUeXBlLk1heCkge1xyXG4gICAgICAgICAgcmV0dXJuIE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0xvd1ZhbHVlICsgdGhpcy52aWV3T3B0aW9ucy5tYXhSYW5nZSwgdGhpcy52aWV3T3B0aW9ucy5wcmVjaXNpb25MaW1pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3VmFsdWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFwcGx5UHVzaFJhbmdlKG5ld1ZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgY29uc3QgZGlmZmVyZW5jZTogbnVtYmVyID0gKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKVxyXG4gICAgICAgICAgPyB0aGlzLnZpZXdIaWdoVmFsdWUgLSBuZXdWYWx1ZVxyXG4gICAgICAgICAgOiBuZXdWYWx1ZSAtIHRoaXMudmlld0xvd1ZhbHVlO1xyXG4gICAgY29uc3QgbWluUmFuZ2U6IG51bWJlciA9ICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhpcy52aWV3T3B0aW9ucy5taW5SYW5nZSkpXHJcbiAgICAgICAgICA/IHRoaXMudmlld09wdGlvbnMubWluUmFuZ2VcclxuICAgICAgICAgIDogdGhpcy52aWV3T3B0aW9ucy5zdGVwO1xyXG4gICAgY29uc3QgbWF4UmFuZ2U6IG51bWJlciA9IHRoaXMudmlld09wdGlvbnMubWF4UmFuZ2U7XHJcbiAgICAvLyBpZiBzbWFsbGVyIHRoYW4gbWluUmFuZ2VcclxuICAgIGlmIChkaWZmZXJlbmNlIDwgbWluUmFuZ2UpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWluKSB7XHJcbiAgICAgICAgdGhpcy52aWV3SGlnaFZhbHVlID0gTWF0aEhlbHBlci5yb3VuZFRvUHJlY2lzaW9uTGltaXQoXHJcbiAgICAgICAgICBNYXRoLm1pbihuZXdWYWx1ZSArIG1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLmNlaWwpLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICBuZXdWYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0hpZ2hWYWx1ZSAtIG1pblJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSkpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgdGhpcy52aWV3TG93VmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChcclxuICAgICAgICAgIE1hdGgubWF4KG5ld1ZhbHVlIC0gbWluUmFuZ2UsIHRoaXMudmlld09wdGlvbnMuZmxvb3IpLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICBuZXdWYWx1ZSA9IE1hdGhIZWxwZXIucm91bmRUb1ByZWNpc2lvbkxpbWl0KHRoaXMudmlld0xvd1ZhbHVlICsgbWluUmFuZ2UsIHRoaXMudmlld09wdGlvbnMucHJlY2lzaW9uTGltaXQpO1xyXG4gICAgICAgIHRoaXMuYXBwbHlWaWV3Q2hhbmdlKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVIYW5kbGVzKFBvaW50ZXJUeXBlLk1pbiwgdGhpcy52YWx1ZVRvUG9zaXRpb24odGhpcy52aWV3TG93VmFsdWUpKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnVwZGF0ZUFyaWFBdHRyaWJ1dGVzKCk7XHJcbiAgICB9IGVsc2UgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChtYXhSYW5nZSkgJiYgZGlmZmVyZW5jZSA+IG1heFJhbmdlKSB7XHJcbiAgICAgIC8vIGlmIGdyZWF0ZXIgdGhhbiBtYXhSYW5nZVxyXG4gICAgICBpZiAodGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyID09PSBQb2ludGVyVHlwZS5NaW4pIHtcclxuICAgICAgICB0aGlzLnZpZXdIaWdoVmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChuZXdWYWx1ZSArIG1heFJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NYXgsIHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0hpZ2hWYWx1ZSlcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFRyYWNraW5nUG9pbnRlciA9PT0gUG9pbnRlclR5cGUuTWF4KSB7XHJcbiAgICAgICAgdGhpcy52aWV3TG93VmFsdWUgPSBNYXRoSGVscGVyLnJvdW5kVG9QcmVjaXNpb25MaW1pdChuZXdWYWx1ZSAtIG1heFJhbmdlLCB0aGlzLnZpZXdPcHRpb25zLnByZWNpc2lvbkxpbWl0KTtcclxuICAgICAgICB0aGlzLmFwcGx5Vmlld0NoYW5nZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlcyhQb2ludGVyVHlwZS5NaW4sIHRoaXMudmFsdWVUb1Bvc2l0aW9uKHRoaXMudmlld0xvd1ZhbHVlKSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGVBcmlhQXR0cmlidXRlcygpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZXRDaGFuZ2VDb250ZXh0KCk6IENoYW5nZUNvbnRleHQge1xyXG4gICAgY29uc3QgY2hhbmdlQ29udGV4dDogQ2hhbmdlQ29udGV4dCA9IG5ldyBDaGFuZ2VDb250ZXh0KCk7XHJcbiAgICBjaGFuZ2VDb250ZXh0LnBvaW50ZXJUeXBlID0gdGhpcy5jdXJyZW50VHJhY2tpbmdQb2ludGVyO1xyXG4gICAgY2hhbmdlQ29udGV4dC52YWx1ZSA9ICt0aGlzLnZhbHVlO1xyXG4gICAgaWYgKHRoaXMucmFuZ2UpIHtcclxuICAgICAgY2hhbmdlQ29udGV4dC5oaWdoVmFsdWUgPSArdGhpcy5oaWdoVmFsdWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2hhbmdlQ29udGV4dDtcclxuICB9XHJcbn1cclxuIl19
