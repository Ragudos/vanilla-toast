export const aria_live_map = Object.freeze({
    "not important": "off",
    important: "polite",
    critical: "assertive",
});

export const TOAST_ATTRIBUTES = Object.freeze({
    POSITION_X: "data-position-x",
    POSITION_Y: "data-position-y",
    ANIMATION_DURATION: "data-transition-duration",
    IMPORTANCE: "aria-live",
    DATA_EXPANDED: "data-expanded",
    DATA_DISMISSED: "data-dismissed",
    DATA_VANILLA_TOAST: "data-vanilla-toast",
    DATA_LIFETIME: "data-lifetime",
});

/** Mapping of attributes for toast options */
export const attributes_map = Object.freeze({
    importance: TOAST_ATTRIBUTES.IMPORTANCE,
    lifetime: TOAST_ATTRIBUTES.DATA_LIFETIME,
    animation_duration: TOAST_ATTRIBUTES.ANIMATION_DURATION,
    position: Object.freeze({
        x: TOAST_ATTRIBUTES.POSITION_X,
        y: TOAST_ATTRIBUTES.POSITION_Y,
    }),
});

export type ToastAttributes =
    (typeof TOAST_ATTRIBUTES)[keyof typeof TOAST_ATTRIBUTES];
