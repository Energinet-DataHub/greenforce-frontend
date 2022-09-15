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
import { ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
export declare class SliderElementDirective {
    protected elemRef: ElementRef;
    protected renderer: Renderer2;
    protected changeDetectionRef: ChangeDetectorRef;
    private _position;
    readonly position: number;
    private _dimension;
    readonly dimension: number;
    private _alwaysHide;
    readonly alwaysHide: boolean;
    private _vertical;
    readonly vertical: boolean;
    private _scale;
    readonly scale: number;
    private _rotate;
    readonly rotate: number;
    opacity: number;
    visibility: string;
    left: string;
    bottom: string;
    height: string;
    width: string;
    transform: string;
    private eventListenerHelper;
    private eventListeners;
    constructor(elemRef: ElementRef, renderer: Renderer2, changeDetectionRef: ChangeDetectorRef);
    setAlwaysHide(hide: boolean): void;
    hide(): void;
    show(): void;
    isVisible(): boolean;
    setVertical(vertical: boolean): void;
    setScale(scale: number): void;
    setRotate(rotate: number): void;
    getRotate(): number;
    setPosition(pos: number): void;
    calculateDimension(): void;
    setDimension(dim: number): void;
    getBoundingClientRect(): ClientRect;
    on(eventName: string, callback: (event: any) => void, debounceInterval?: number): void;
    onPassive(eventName: string, callback: (event: any) => void, debounceInterval?: number): void;
    off(eventName?: string): void;
    private isRefDestroyed();
}
