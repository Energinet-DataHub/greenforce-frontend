/** Helper with compatibility functions to support different browsers */
export declare class CompatibilityHelper {
    /** Workaround for TouchEvent constructor sadly not being available on all browsers (e.g. Firefox, Safari) */
    static isTouchEvent(event: any): boolean;
    /** Detect presence of ResizeObserver API */
    static isResizeObserverAvailable(): boolean;
}
