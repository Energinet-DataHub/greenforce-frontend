import { Renderer2 } from '@angular/core';
import { EventListener } from './event-listener';
/**
 * Helper class to attach event listeners to DOM elements with debounce support using rxjs
 */
export declare class EventListenerHelper {
    private renderer;
    constructor(renderer: Renderer2);
    attachPassiveEventListener(nativeElement: any, eventName: string, callback: (event: any) => void, throttleInterval?: number): EventListener;
    detachEventListener(eventListener: EventListener): void;
    attachEventListener(nativeElement: any, eventName: string, callback: (event: any) => void, throttleInterval?: number): EventListener;
}
