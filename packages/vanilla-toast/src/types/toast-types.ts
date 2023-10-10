import { aria_live_map } from "../lib/attributes";
import { Toast } from "../toast";

export type ReturnValue = {
    toast_id: string;
};

export type ToastContainerOptions = {
    is_expanded_by_default?: boolean;
};

export type ToastTypes =
    | "neutral"
    | "success"
    | "error"
    | "info"
    | "warn"
    | "loading";

export type ToastPosition = {
    x: "left" | "center" | "right";
    y: "top" | "bottom";
};

export type ToastProps = {
    message: string;
    title?: string;
};

/** Customization for the close button.
 *  You can change its position.
 */
export type CloseButtonOptions = {
    /** @default true */
    is_shown_on_hover?: boolean;
    /** @default right */
    position: "left" | "right";
};

export type ToastOptions = {
    dir?: "ltr" | "rtl";
    position?: ToastPosition;
    importance?: keyof typeof aria_live_map;
    lifetime?: number;
    animation_duration?: number;
    automatically_close?: boolean;
    close_button?: CloseButtonOptions;
    /** For theme toggling
     *  @default
     *
     *  system
     */
    theme?: "light" | "dark" | "system";

    /** Types of style you'd want your toast to have.
     *
     *  `glass` - a glass like appearance
     *
     *  `plain` - a plain background with semantics (i.e. green for success)
     *
     *  `icons` - only color the icons if it's semantic
     *
     *  `monochrome` - no semantic background at all, just black & white
     *
     *  @default
     *
     *  glass
     */
    style?: "glass" | "plain" | "icons" | "monochrome";
};

export type ToastListener = (
    toast: Toast,
    type: "add" | "remove" | "animate-out",
) => void;

export interface ToastInterface {
    id: string;
    props: ToastProps;
    options?: ToastOptions;
    /** To tell toast listeners that they should remove a specific toast from their
     *  internal state as this toast will be removed in due time \(since we need to
     *  animate it out if their is an animation duration\).
     */
    is_dismissed: boolean;
    type: ToastTypes;
    idx: number;
    z_index: number;
    initial_height: number;
    offset: number;
    automatically_close: boolean;
}

export interface StoreInterface {
    /** A map of toast id to its property values. */
    toasts: Map<string, Toast>;
    listeners: Map<number, ToastListener>;
    /** Keeps track of timers that handles
     *  automatically closing a toast.
     */
    timers: Map<string, number>;
    listeners_length: number;
    /** A map of aborters to remove
     *  event listeners on a toast
     */
    aborters: Map<string, AbortController>;

    /** Adds a function which receives information about a toast to the store, and this store will
     *  call that function when an update to its toasts' state occurs.
     *
     *  @returns A cleanup function;
     */
    listen(_listener: ToastListener): void;

    create(
        _props: ToastProps,
        _options?: ToastOptions,
        _type?: ToastTypes,
    ): ReturnValue;

    /** Removes a toast */
    dismiss(toast_id: string): void;

    /** Calls all active listeners to update their state */
    update(_toast: Toast, type: "add" | "remove" | "animate-out"): void;
}
