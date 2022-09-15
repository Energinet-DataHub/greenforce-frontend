/** Helper with mathematical functions */
export declare class MathHelper {
    static roundToPrecisionLimit(value: number, precisionLimit: number): number;
    static isModuloWithinPrecisionLimit(value: number, modulo: number, precisionLimit: number): boolean;
    static clampToRange(value: number, floor: number, ceil: number): number;
}
