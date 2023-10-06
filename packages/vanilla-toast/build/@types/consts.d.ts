import type { BoxShadowSizes, ToastAnimations, ToastCloseButtonPositions, ToastColor, ToastPositions } from ".";
export declare const DEFAULT_DURATION = 3000;
export declare const DEFAULT_ANIMATION_DURATION = 400;
export declare const DEFAULT_ICON_POSITION = "left";
export declare const DEFAULT_TOAST_POSITION: ToastPositions;
export declare const DEFAULT_COLORS: ToastColor;
export declare const DEFAULT_ANIMATION: ToastAnimations;
export declare const DEFAULT_CLOSE_BUTTON_POSITION: ToastCloseButtonPositions;
export declare const DEFAULT_BOX_SHADOW_SIZE: BoxShadowSizes;
export declare const DEFAULT_MAX_TOASTS_VISIBLE = 3;
/**
 *  A mapping of box shadow sizes
 */
export declare const BOX_SHADOW_SIZES: {
    [Properties in BoxShadowSizes]: `${number}px ${number}px ${number}px var(--toast-shadow-color)`;
};
/**
 *  A storage for all existing timers for each toast so that if a
 *  toast were to be removed prematurely (before the setTimeout is fulfilled),
 *  then we can clean it up from memory.
 */
export declare const timer_hashmaps: Map<string, number>;
/**
 * A storage for all exisiting abort controllers for event listeners
 * for a toast's close button if it exists.
 */
export declare const close_button_aborters_hashmaps: Map<string, AbortController>;
/**
 *  Toast positions
 */
export declare const toast_positions: ToastPositions[];
