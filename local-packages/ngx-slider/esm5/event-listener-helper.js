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
    EventListenerHelper.prototype.attachPassiveEventListener = /**
     * @param {?} nativeElement
     * @param {?} eventName
     * @param {?} callback
     * @param {?=} throttleInterval
     * @return {?}
     */
    function (nativeElement, eventName, callback, throttleInterval) {
        // Only use passive event listeners if the browser supports it
        if (supportsPassiveEvents !== true) {
            return this.attachEventListener(nativeElement, eventName, callback, throttleInterval);
        }
        /** @type {?} */
        var listener = new EventListener();
        listener.eventName = eventName;
        listener.events = new Subject();
        /** @type {?} */
        var observerCallback = function (event) {
            listener.events.next(event);
        };
        nativeElement.addEventListener(eventName, observerCallback, { passive: true, capture: false });
        listener.teardownCallback = function () {
            nativeElement.removeEventListener(eventName, observerCallback, { passive: true, capture: false });
        };
        listener.eventsSubscription = listener.events
            .pipe((!ValueHelper.isNullOrUndefined(throttleInterval))
            ? throttleTime(throttleInterval, undefined, { leading: true, trailing: true })
            : tap(function () { }) // no-op
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
    EventListenerHelper.prototype.detachEventListener = /**
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
    EventListenerHelper.prototype.attachEventListener = /**
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
        listener.teardownCallback = this.renderer.listen(nativeElement, eventName, observerCallback);
        listener.eventsSubscription = listener.events
            .pipe((!ValueHelper.isNullOrUndefined(throttleInterval))
            ? throttleTime(throttleInterval, undefined, { leading: true, trailing: true })
            : tap(function () { }) // no-op
        )
            .subscribe(function (event) { callback(event); });
        return listener;
    };
    return EventListenerHelper;
}());
/**
 * Helper class to attach event listeners to DOM elements with debounce support using rxjs
 */
export { EventListenerHelper };
if (false) {
    /** @type {?} */
    EventListenerHelper.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtbGlzdGVuZXItaGVscGVyLmpzIiwic291cmNlUm9vdCI6Im5nOi8vQGFuZ3VsYXItc2xpZGVyL25neC1zbGlkZXIvIiwic291cmNlcyI6WyJldmVudC1saXN0ZW5lci1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUNBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDOzs7O0FBSzdDOzs7QUFBQTtJQUNFLDZCQUFvQixRQUFtQjtRQUFuQixhQUFRLEdBQVIsUUFBUSxDQUFXO0tBQ3RDOzs7Ozs7OztJQUVNLHdEQUEwQjs7Ozs7OztjQUFDLGFBQWtCLEVBQUUsU0FBaUIsRUFBRSxRQUE4QixFQUNuRyxnQkFBeUI7O1FBRTNCLElBQUkscUJBQXFCLEtBQUssSUFBSSxFQUFFO1lBQ2xDLE9BQU8sSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDdkY7O1FBR0QsSUFBTSxRQUFRLEdBQWtCLElBQUksYUFBYSxFQUFFLENBQUM7UUFDcEQsUUFBUSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFDL0IsUUFBUSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBUyxDQUFDOztRQUV2QyxJQUFNLGdCQUFnQixHQUEyQixVQUFDLEtBQVk7WUFDNUQsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0IsQ0FBQztRQUNGLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUs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WyJpbXBvcnQgeyBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyB0aHJvdHRsZVRpbWUsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgc3VwcG9ydHNQYXNzaXZlRXZlbnRzIH0gZnJvbSAnZGV0ZWN0LXBhc3NpdmUtZXZlbnRzJztcclxuXHJcbmltcG9ydCB7IEV2ZW50TGlzdGVuZXIgfSBmcm9tICcuL2V2ZW50LWxpc3RlbmVyJztcclxuaW1wb3J0IHsgVmFsdWVIZWxwZXIgfSBmcm9tICcuL3ZhbHVlLWhlbHBlcic7XHJcblxyXG4vKipcclxuICogSGVscGVyIGNsYXNzIHRvIGF0dGFjaCBldmVudCBsaXN0ZW5lcnMgdG8gRE9NIGVsZW1lbnRzIHdpdGggZGVib3VuY2Ugc3VwcG9ydCB1c2luZyByeGpzXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRXZlbnRMaXN0ZW5lckhlbHBlciB7XHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXR0YWNoUGFzc2l2ZUV2ZW50TGlzdGVuZXIobmF0aXZlRWxlbWVudDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IChldmVudDogYW55KSA9PiB2b2lkLFxyXG4gICAgICB0aHJvdHRsZUludGVydmFsPzogbnVtYmVyKTogRXZlbnRMaXN0ZW5lciB7XHJcbiAgICAvLyBPbmx5IHVzZSBwYXNzaXZlIGV2ZW50IGxpc3RlbmVycyBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdFxyXG4gICAgaWYgKHN1cHBvcnRzUGFzc2l2ZUV2ZW50cyAhPT0gdHJ1ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdHRhY2hFdmVudExpc3RlbmVyKG5hdGl2ZUVsZW1lbnQsIGV2ZW50TmFtZSwgY2FsbGJhY2ssIHRocm90dGxlSW50ZXJ2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFuZ3VsYXIgZG9lc24ndCBzdXBwb3J0IHBhc3NpdmUgZXZlbnQgaGFuZGxlcnMgKHlldCksIHNvIHdlIG5lZWQgdG8gcm9sbCBvdXIgb3duIGNvZGUgdXNpbmcgbmF0aXZlIGZ1bmN0aW9uc1xyXG4gICAgY29uc3QgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIgPSBuZXcgRXZlbnRMaXN0ZW5lcigpO1xyXG4gICAgbGlzdGVuZXIuZXZlbnROYW1lID0gZXZlbnROYW1lO1xyXG4gICAgbGlzdGVuZXIuZXZlbnRzID0gbmV3IFN1YmplY3Q8RXZlbnQ+KCk7XHJcblxyXG4gICAgY29uc3Qgb2JzZXJ2ZXJDYWxsYmFjazogKGV2ZW50OiBFdmVudCkgPT4gdm9pZCA9IChldmVudDogRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgbGlzdGVuZXIuZXZlbnRzLm5leHQoZXZlbnQpO1xyXG4gICAgfTtcclxuICAgIG5hdGl2ZUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9ic2VydmVyQ2FsbGJhY2ssIHtwYXNzaXZlOiB0cnVlLCBjYXB0dXJlOiBmYWxzZX0pO1xyXG5cclxuICAgIGxpc3RlbmVyLnRlYXJkb3duQ2FsbGJhY2sgPSAoKTogdm9pZCA9PiB7XHJcbiAgICAgIG5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIG9ic2VydmVyQ2FsbGJhY2ssIHtwYXNzaXZlOiB0cnVlLCBjYXB0dXJlOiBmYWxzZX0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBsaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24gPSBsaXN0ZW5lci5ldmVudHNcclxuICAgICAgLnBpcGUoKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZCh0aHJvdHRsZUludGVydmFsKSlcclxuICAgICAgICA/IHRocm90dGxlVGltZSh0aHJvdHRsZUludGVydmFsLCB1bmRlZmluZWQsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IHRydWV9KVxyXG4gICAgICAgIDogdGFwKCgpID0+IHt9KSAvLyBuby1vcFxyXG4gICAgICApXHJcbiAgICAgIC5zdWJzY3JpYmUoKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIGxpc3RlbmVyO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGRldGFjaEV2ZW50TGlzdGVuZXIoZXZlbnRMaXN0ZW5lcjogRXZlbnRMaXN0ZW5lcik6IHZvaWQge1xyXG4gICAgaWYgKCFWYWx1ZUhlbHBlci5pc051bGxPclVuZGVmaW5lZChldmVudExpc3RlbmVyLmV2ZW50c1N1YnNjcmlwdGlvbikpIHtcclxuICAgICAgZXZlbnRMaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcclxuICAgICAgZXZlbnRMaXN0ZW5lci5ldmVudHNTdWJzY3JpcHRpb24gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQoZXZlbnRMaXN0ZW5lci5ldmVudHMpKSB7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIuZXZlbnRzLmNvbXBsZXRlKCk7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIuZXZlbnRzID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIVZhbHVlSGVscGVyLmlzTnVsbE9yVW5kZWZpbmVkKGV2ZW50TGlzdGVuZXIudGVhcmRvd25DYWxsYmFjaykpIHtcclxuICAgICAgZXZlbnRMaXN0ZW5lci50ZWFyZG93bkNhbGxiYWNrKCk7XHJcbiAgICAgIGV2ZW50TGlzdGVuZXIudGVhcmRvd25DYWxsYmFjayA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgYXR0YWNoRXZlbnRMaXN0ZW5lcihuYXRpdmVFbGVtZW50OiBhbnksIGV2ZW50TmFtZTogc3RyaW5nLCBjYWxsYmFjazogKGV2ZW50OiBhbnkpID0+IHZvaWQsXHJcbiAgICAgIHRocm90dGxlSW50ZXJ2YWw/OiBudW1iZXIpOiBFdmVudExpc3RlbmVyIHtcclxuICAgIGNvbnN0IGxpc3RlbmVyOiBFdmVudExpc3RlbmVyID0gbmV3IEV2ZW50TGlzdGVuZXIoKTtcclxuICAgIGxpc3RlbmVyLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcclxuICAgIGxpc3RlbmVyLmV2ZW50cyA9IG5ldyBTdWJqZWN0PEV2ZW50PigpO1xyXG5cclxuICAgIGNvbnN0IG9ic2VydmVyQ2FsbGJhY2s6IChldmVudDogRXZlbnQpID0+IHZvaWQgPSAoZXZlbnQ6IEV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgIGxpc3RlbmVyLmV2ZW50cy5uZXh0KGV2ZW50KTtcclxuICAgIH07XHJcblxyXG4gICAgbGlzdGVuZXIudGVhcmRvd25DYWxsYmFjayA9IHRoaXMucmVuZGVyZXIubGlzdGVuKG5hdGl2ZUVsZW1lbnQsIGV2ZW50TmFtZSwgb2JzZXJ2ZXJDYWxsYmFjayk7XHJcblxyXG4gICAgbGlzdGVuZXIuZXZlbnRzU3Vic2NyaXB0aW9uID0gbGlzdGVuZXIuZXZlbnRzXHJcbiAgICAgIC5waXBlKCghVmFsdWVIZWxwZXIuaXNOdWxsT3JVbmRlZmluZWQodGhyb3R0bGVJbnRlcnZhbCkpXHJcbiAgICAgICAgICA/IHRocm90dGxlVGltZSh0aHJvdHRsZUludGVydmFsLCB1bmRlZmluZWQsIHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IHRydWV9KVxyXG4gICAgICAgICAgOiB0YXAoKCkgPT4ge30pIC8vIG5vLW9wXHJcbiAgICAgIClcclxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IEV2ZW50KSA9PiB7IGNhbGxiYWNrKGV2ZW50KTsgfSk7XHJcblxyXG4gICAgcmV0dXJuIGxpc3RlbmVyO1xyXG4gIH1cclxufVxyXG4iXX0=