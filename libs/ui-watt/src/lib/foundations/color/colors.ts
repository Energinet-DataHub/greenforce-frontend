/*
 * @Please notice!!! 
 * These values should be kept in-sync with _colors.import.scss
 * Naming convention is as follow: --watt-color-{COLOR GROUP (ONLY IF NOT THE SAME AS COLOR NAME)}-{COLOR NAME}
 */
export enum Colors {
    'primary' = '--watt-color-primary',
    'primaryLight' = '--watt-color-primary-light',
    'primaryDark' = '--watt-color-primary-dark',
    // Focus
    'selection' = '--watt-color-focus-selection',
    'focus' = '--watt-color-focus',
    // Neutrals
    'black' = '--watt-color-neutral-black',
    'white' = '--watt-color-neutral-white',
    'grey50' = '--watt-color-neutral-grey-50',
    'grey100' = '--watt-color-neutral-grey-100',
    'grey200' = '--watt-color-neutral-grey-200',
    'grey300' = '--watt-color-neutral-grey-300',
    'grey400' = '--watt-color-neutral-grey-400',
    'grey500' = '--watt-color-neutral-grey-500',
    'grey600' = '--watt-color-neutral-grey-600',
    'grey700' = '--watt-color-neutral-grey-700',
    'grey800' = '--watt-color-neutral-grey-800',
    'grey900' = '--watt-color-neutral-grey-900',
    // States
    'danger' = '--watt-color-state-danger', 
    'dangerLight' = '--watt-color-state-danger-light', 
    'warning' = '--watt-color-state-warning', 
    'warningLight' = '--watt-color-state-warning-light',
    'success' = '--watt-color-state-success', 
    'successLight' = '--watt-color-state-success-light',
    'info' = '--watt-color-state-info', 
    'infoLight' = '--watt-color-state-info-light',
}