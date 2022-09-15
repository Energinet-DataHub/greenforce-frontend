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
import { Subject } from 'rxjs';
import { throttleTime, tap } from 'rxjs/operators';
import { supportsPassiveEvents } from 'detect-passive-events';
import { EventListener } from './event-listener';
import { ValueHelper } from './value-helper';
/**
 * Helper class to attach event listeners to DOM elements with debounce support using rxjs
 */
export class EventListenerHelper {
    /**
     * @param {?} renderer
     */
    constructor(renderer) {
        this.renderer = renderer;
    }
    /**
     * @param {?} nativeElement
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} throttleInterval
     * @return {?}
     */
    attachPassiveEventListener(nativeElement, eventName, callback, throttleInterval) {
        // Only use passive event listeners if the browser supports it
        if (supportsPassiveEvents !== true) {
            return this.attachEventListener(nativeElement, eventName, callback, throttleInterval);
        }
        /** @type {?} */
        const listener = new EventListener();
        listener.eventName = eventName;
        listener.events = new Subject();
        /** @type {?} */
        const observerCallback = (event) => {
            listener.events.next(event);
        };
        nativeElement.addEventListener(eventName, observerCallback, { passive: true, capture: false });
        listener.teardownCallback = () => {
            nativeElement.removeEventListener(eventName, observerCallback, { passive: true, capture: false });
        };
        listener.eventsSubscription = listener.events
            .pipe((!ValueHelper.isNullOrUndefined(throttleInterval))
            ? throttleTime(throttleInterval, undefined, { leading: true, trailing: true })
            : tap(() => { }) // no-op
        )
            .subscribe((event) => {
            callback(event);
        });
        return listener;
    }
    /**
     * @param {?} eventListener
     * @return {?}
     */
    detachEventListener(eventListener) {
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
    }
    /**
     * @param {?} nativeElement
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} throttleInterval
     * @return {?}
     */
    attachEventListener(nativeElement, eventName, callback, throttleInterval) {
        /** @type {?} */
        const listener = new EventListener();
        listener.eventName = eventName;
        listener.events = new Subject();
        /** @type {?} */
        const observerCallback = (event) => {
            listener.events.next(event);
        };
        listener.teardownCallback = this.renderer.listen(nativeElement, eventName, observerCallback);
        listener.eventsSubscription = listener.events
            .pipe((!ValueHelper.isNullOrUndefined(throttleInterval))
            ? throttleTime(throttleInterval, undefined, { leading: true, trailing: true })
            : tap(() => { }) // no-op
        )
            .subscribe((event) => { callback(event); });
        return listener;
    }
}
if (false) {
    /** @type {?} */
    EventListenerHelper.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtbGlzdGVuZXItaGVscGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvIiwic291cmNlcyI6WyJldmVudC1saXN0ZW5lci1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBSzdDLE1BQU07Ozs7SUFDSixZQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO0tBQ3RDOzs7Ozs7OztJQUVNLDBCQUEwQixDQUFDLGFBQWtCLEVBQUUsU0FBaUIsRUFBRSxRQUE4QixFQUNuRyxnQkFBeUI7O1FBRTNCLElBQUkscUJBQXFCLEtBQUssSUFBSSxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDdkY7O1FBR0QsTUFBTSxRQUFRLEdBQWtCLElBQUksYUFBYSxFQUFFLENBQUM7UUFDcEQsUUFBUSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDL0IsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBUyxDQUFDOztRQUV2QyxNQUFNLGdCQUFnQixHQUEyQixDQUFDLEtBQVksRUFBUSxFQUFFO1lBQ3RFLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCLENBQUM7UUFDRixhQUFhLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxF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OztDQUVuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IHRocm90dGxlVGltZSwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBzdXBwb3J0c1Bhc3NpdmVFdmVudHMgfSBmcm9tICdkZXRlY3QtcGFzc2l2ZS1ldmVudHMnO1xyXG5cclxuaW1wb3J0IHsgRXZlbnRMaXN0ZW5lciB9IGZyb20gJy4vZXZlbnQtbGlzdGVuZXInO1xyXG5pbXBvcnQgeyBWYWx1ZUhlbHBlciB9IGZyb20gJy4vdmFsdWUtaGVscGVyJztcclxuXHJcbi8qKlxyXG4gKiBIZWxwZXIgY2xhc3MgdG8gYXR0YWNoIGV2ZW50IGxpc3RlbmVycyB0byBET00gZWxlbWVudHMgd2l0aCBkZWJvdW5jZSBzdXBwb3J0IHVzaW5nIHJ4anNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBFdmVudExpc3RlbmVySGVscGVyIHtcclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBhdHRhY2hQYXNzaXZlRXZlbnRMaXN0ZW5lcihuYXRpdmVFbGVtZW50OiBhbnksIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IHZvaWQsXHJcbiAgICAgIHRocm90dGxlSW50ZXJ2YWw/OiBudW1iZXIpOiBFdmVudExpc3RlbmVyIHtcclxuICAgIC8vIE9ubHkgdXNlIHBhc3NpdmUgZXZlbnQgbGlzdGVuZXJzIGlmIHRoZSBicm93c2VyIHN1cHBvcnRzIGl0XHJcbiAgICBpZiAoc3VwcG9ydHNQYXNzaXZlRXZlbnRzICE9PSB0cnVlKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmF0dGFjaEV2ZW50TGlzdGVuZXIobmF0aXZlRWxlbWVudCwgZXZlbnROYW1lLCBjYWxsYmFjaywgdGhyb3R0bGVJbnRlcnZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQW5ndWxhciBkb2Vzbid0IHN1cHBvcnQgcGFzc2l2ZSBldmVudCBoYW5kbGVycyAoeWV0KSwgc28gd2UgbmVlZCB0byByb2xsIG91ciBvd24gY29kZSB1c2luZyBuYXRpdmUgZnVuY3Rpb25zXHJcbiAgICBjb25zdCBsaXN0ZW5lcjogRXZlbnRMaXN0ZW5lciA9IG5ldyBFdmVudExpc3RlbmVyKCk7XHJcbiAgICBsaXN0ZW5lci5ldmVudE5hbWUgPSBldmVudE5hbWU7XHJcbiAgICBsaXN0ZW5lci5ldmVudHMgPSBuZXcgU3ViamVjdDxFdmVudD4oKTtcclxuXHJcbiAgICBjb25zdCBvYnNlcnZlckNhbGxiYWNrOiAoZXZlbnQ6IEV2ZW50KSA9PiB2b2lkID0gKGV2ZW50OiBFdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICBsaXN0ZW5lci5ldmVudHMubmV4dChldmVudCk7XHJcbiAgICB9O1xyXG4gICAgbmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb2JzZXJ2ZXJDYWxsYmFjaywge3Bhc3NpdmU6IHRydWUsIGNhcHR1cmU6IGZhbHNlfSk7XHJcblxyXG4gICAgbGlzdGVuZXIudGVhcmRvd25DYWxsYmFjayA9ICgpOiB2b2lkID0+IHtcclxuICAgICAgbmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgb2JzZXJ2ZXJDYWxsYmFjaywge3Bhc3NpdmU6IHRydWUsIGNhcHR1cmU6IGZhbHNlfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIGxpc3RlbmVyLmV2ZW50c1N1YnNjcmlwdGlvbiA9IGxpc3RlbmVyLmV2ZW50c1xyXG4gICAgICAucGlwZSgoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKHRocm90dGxlSW50ZXJ2YWwpKVxyXG4gICAgICAgID8gdGhyb3R0bGVUaW1lKHRocm90dGxlSW50ZXJ2YWwsIHVuZGVmaW5lZCwgeyBsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogdHJ1ZX0pXHJcbiAgICAgICAgOiB0YXAoKCkgPT4ge30pIC8vIG5vLW9wXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgY2FsbGJhY2soZXZlbnQpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gbGlzdGVuZXI7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZGV0YWNoRXZlbnRMaXN0ZW5lcihldmVudExpc3RlbmVyOiBFdmVudExpc3RlbmVyKTogdm9pZCB7XHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50TGlzdGVuZXIuZXZlbnRzU3Vic2NyaXB0aW9uKSkge1xyXG4gICAgICBldmVudExpc3RlbmVyLmV2ZW50c1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgICBldmVudExpc3RlbmVyLmV2ZW50c1N1YnNjcmlwdGlvbiA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChldmVudExpc3RlbmVyLmV2ZW50cykpIHtcclxuICAgICAgZXZlbnRMaXN0ZW5lci5ldmVudHMuY29tcGxldGUoKTtcclxuICAgICAgZXZlbnRMaXN0ZW5lci5ldmVudHMgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZXZlbnRMaXN0ZW5lci50ZWFyZG93bkNhbGxiYWNrKSkge1xyXG4gICAgICBldmVudExpc3RlbmVyLnRlYXJkb3duQ2FsbGJhY2soKTtcclxuICAgICAgZXZlbnRMaXN0ZW5lci50ZWFyZG93bkNhbGxiYWNrID0gbnVsbDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHB1YmxpYyBhdHRhY2hFdmVudExpc3RlbmVyKG5hdGl2ZUVsZW1lbnQ6IGFueSwgZXZlbnROYW1lOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXZlbnQ6IGFueSkgPT4gdm9pZCxcclxuICAgICAgdGhyb3R0bGVJbnRlcnZhbD86IG51bWJlcik6IEV2ZW50TGlzdGVuZXIge1xyXG4gICAgY29uc3QgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSBuZXcgRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgbGlzdGVuZXIuZXZlbnROYW1lID0gZXZlbnROYW1lO1xyXG4gICAgbGlzdGVuZXIuZXZlbnRzID0gbmV3IFN1YmplY3Q8RXZlbnQ+KCk7XHJcblxyXG4gICAgY29uc3Qgb2JzZXJ2ZXJDYWxsYmFjazogKGV2ZW50OiBFdmVudCkgPT4gdm9pZCA9IChldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGlzdGVuZXIuZXZlbnRzLm5leHQoZXZlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBsaXN0ZW5lci50ZWFyZG93bkNhbGxiYWNrID0gdGhpcy5yZW5kZXJlci5saXN0ZW4obmF0aXZlRWxlbWVudCwgZXZlbnROYW1lLCBvYnNlcnZlckNhbGxiYWNrKTtcclxuXHJcbiAgICBsaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24gPSBsaXN0ZW5lci5ldmVudHNcclxuICAgICAgLnBpcGUoKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aHJvdHRsZUludGVydmFsKSlcclxuICAgICAgICAgID8gdGhyb3R0bGVUaW1lKHRocm90dGxlSW50ZXJ2YWwsIHVuZGVmaW5lZCwgeyBsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogdHJ1ZX0pXHJcbiAgICAgICAgICA6IHRhcCgoKSA9PiB7fSkgLy8gbm8tb3BcclxuICAgICAgKVxyXG4gICAgICAuc3Vic2NyaWJlKChldmVudDogRXZlbnQpID0+IHsgY2FsbGJhY2soZXZlbnQpOyB9KTtcclxuXHJcbiAgICByZXR1cm4gbGlzdGVuZXI7XHJcbiAgfVxyXG59XHJcbiJdfQ==