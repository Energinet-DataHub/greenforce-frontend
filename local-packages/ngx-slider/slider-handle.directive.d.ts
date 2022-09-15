import { ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { SliderElementDirective } from './slider-element.directive';
export declare class SliderHandleDirective extends SliderElementDirective {
    active: boolean;
    role: string;
    tabindex: string;
    ariaOrientation: string;
    ariaLabel: string;
    ariaLabelledBy: string;
    ariaValueNow: string;
    ariaValueText: string;
    ariaValueMin: string;
    ariaValueMax: string;
    focus(): void;
    constructor(elemRef: ElementRef, renderer: Renderer2, changeDetectionRef: ChangeDetectorRef);
}
