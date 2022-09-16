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
import { CustomStepDefinition } from './options';
/**
 *  Collection of functions to handle conversions/lookups of values
 */
export declare class ValueHelper {
    static isNullOrUndefined(value: any): boolean;
    static areArraysEqual(array1: any[], array2: any[]): boolean;
    static linearValueToPosition(val: number, minVal: number, maxVal: number): number;
    static logValueToPosition(val: number, minVal: number, maxVal: number): number;
    static linearPositionToValue(percent: number, minVal: number, maxVal: number): number;
    static logPositionToValue(percent: number, minVal: number, maxVal: number): number;
    static findStepIndex(modelValue: number, stepsArray: CustomStepDefinition[]): number;
}
