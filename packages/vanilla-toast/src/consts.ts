import type { ToastAnimations, ToastColor, ToastPositions } from ".";

export const DEFAULT_DURATION = 3000;
export const DEFAULT_ANIMATION_DURATION = 400;
export const DEFAULT_ICON_POSITION = "left";
export const DEFAULT_TOAST_POSITION: ToastPositions = "top-right";
export const DEFAULT_COLORS: ToastColor = "background";
export const DEFAULT_ANIMATION: ToastAnimations = "popdown";
/**
 *  A storage for all existing timers for each toast so that if a
 *  toast were to be removed prematurely (before the setTimeout is fulfilled),
 *  then we can clean it up from memory.
 */
export const timer_hashmaps = new Map();

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
