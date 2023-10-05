import type { ToastAnimations, ToastColor, ToastPositions } from ".";
export declare const DEFAULT_DURATION = 3000;
export declare const DEFAULT_ANIMATION_DURATION = 400;
export declare const DEFAULT_ICON_POSITION = "left";
export declare const DEFAULT_TOAST_POSITION: ToastPositions;
export declare const DEFAULT_COLORS: ToastColor;
export declare const DEFAULT_ANIMATION: ToastAnimations;
/**
 *  A storage for all existing timers for each toast so that if a
 *  toast were to be removed prematurely (before the setTimeout is fulfilled),
 *  then we can clean it up from memory.
 */
export declare const timer_hashmaps: Map<any, any>;
/**
 *  Toast positions
 */
export declare const toast_positions: ToastPositions[];
