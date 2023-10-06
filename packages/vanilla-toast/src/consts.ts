import type {
    BoxShadowSizes,
    ToastAnimations,
    ToastCloseButtonPositions,
    ToastColor,
    ToastPositions,
} from ".";

export const DEFAULT_DURATION = 3000;
export const DEFAULT_ANIMATION_DURATION = 400;
export const DEFAULT_ICON_POSITION = "left";
export const DEFAULT_TOAST_POSITION: ToastPositions = "top-right";
export const DEFAULT_COLORS: ToastColor = "background";
export const DEFAULT_ANIMATION: ToastAnimations = "popdown";
export const DEFAULT_CLOSE_BUTTON_POSITION: ToastCloseButtonPositions =
    "top-right";
export const DEFAULT_BOX_SHADOW_SIZE: BoxShadowSizes = "sm";
export const DEFAULT_MAX_TOASTS_VISIBLE = 3;
export const TOAST_POSITIONS: ToastPositions[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-right",
    "bottom-center",
];

/**
 *  A mapping of box shadow sizes
 */
export const BOX_SHADOW_SIZES: {
    [Properties in BoxShadowSizes]: `${number}px ${number}px ${number}px var(--toast-shadow-color)`;
} = {
    sm: "0px 2px 4px var(--toast-shadow-color)",
    md: "0px 3px 6px var(--toast-shadow-color)",
    lg: "0px 4px 8px var(--toast-shadow-color)",
};

/**
 *  A storage for all existing timers for each toast so that if a
 *  toast were to be removed prematurely (before the setTimeout is fulfilled),
 *  then we can clean it up from memory.
 */
export const timer_hashmaps = new Map<string, number>();

/**
 * A storage for all exisiting abort controllers for event listeners
 * for a toast's close button if it exists.
 */
export const close_button_aborters_hashmaps = new Map<
    string,
    AbortController
>();

/**
 *  Toast positions
 */
export const toast_positions: ToastPositions[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
];
