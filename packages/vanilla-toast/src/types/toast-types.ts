import { aria_live_map } from "../lib/attributes";
import { Toast } from "../toast";

export type ReturnValue = {
    toast_id: string;
};

export type ToastTypes =
    | "neutral"
    | "success"
    | "error"
    | "info"
    | "warn"
    | "loading";

export type LoadingIconTypes =
    | "normal"
    | "eclipse"
    | "broken-straight"
    | "broken-rounded"
    | "broken-flat";

export type ToastContainerOptions = {
    /** Whether the toasts
     *  will be expanded by default.
     *
     *  If so, then it will not stack when pressing the shortcut to stack the toasts or not hovering over the toasts.
     */
    is_expanded_by_default?: boolean;

    /** ### Toast position
     *  The position of toasts on the page
     *
     *  By default:
     *  - `x` - right
     *  - `y` - top
     */
    position?: ToastPosition;
};

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
    /**
     * hide the close button and show it when hovering over the toast
     * @default true
     */
    is_shown_on_hover?: boolean;
    /**
     * position the close button either at the left or right
     * @default right
     */
    position: "left" | "right";
};

export type ToastOptions = {
    /** ### Toast text direction
     *  The direction of this toast's text will be rendered in. By default, a function will
     *  check the direction of the current window and the HTML body's attribute `dir`. If none are found,
     *  then the default is applied.
     *
     *  @default
     *  ltr
     */
    dir?: "ltr" | "rtl";

    /** ### Toast role
     *  Indicates the role of this toast and apply it to the `role` HTML attribute
     *
     *  default values based on toast type
     *  - `success | warn | loading | error` - alert
     *  - `info | neutral` - status
     */
    role?: "status" | "alert";

    /** ### Toast importance
     *  Maps to `aria-live` properties for accessibility. By default, this will
     *  be inferred for you based on the type of toast that is rendered.
     *
     *  map values to aria-live property
     *  - `critical` - assertive
     *  - `important` - polite
     *  - `not important` - off
     *
     *  default values based on toast type
     *  - `success | warn | loading | error` - critical
     *  - `info | neutral` - important
     */
    importance?: keyof typeof aria_live_map;

    /** ### Toast lifetime
     *  Indicates how long this toast will stay in milliseconds.
     *
     *  **If a toast is not going to be closed automatically, then
     *  this option is disregarded.**
     *
     *  @default 10000
     */
    lifetime?: number;

    /** ### Toast animation duration
     * This is applied to the CSS property `--toast-transition-duration` and subtracted from the timeout before a toast
     * is dismissed if this toast is not closed automatically.
     */
    animation_duration?: number;

    /** ### Toast automatically close
     * Indicates whether to close this toast automatically
     *
     * **NOTE: If this is set to false, you must be the one to close this toast**
     */
    automatically_close?: boolean;

    /** ### Toast close button options
     *  The options you want to give to this toast's close button
     *
     * - `is_shown_on_hover` - hide the close button and show it when hovering over the toast
     * - `position` - position the close button either at the left or right
     *
     * @default
     * is_shown_on_hover - true
     * position - right
     */
    close_button?: CloseButtonOptions;

    /** ### Toast CSS theme
     *  For theme toggling
     *  @default
     *
     *  system
     */
    theme?: "light" | "dark" | "system";

    /** ### Toast style type
     *  Types of style you'd want your toast to have.
     *  - `glass` - a glass like appearance with semantics (i.e. green for success).
     *  - `plain` - a plain background with semantics (i.e. green for success)
     *  - `icons` - only color the icons if it's semantic
     *  - `monochrome` - no semantic background at all, just black & white
     *
     *  @default
     *
     *  glass
     */
    style?: "glass" | "plain" | "icons" | "monochrome";

    /** ### Toast loading icon
     *  The type of loading icon you want for this toast.
     *  This is disregarded if this toast is not a loading type.
     *
     *  @default
     *  normal
     */
    loading_icon?: LoadingIconTypes;
};

export type ToastListener = (
    toast: Toast,
    type: "add" | "remove" | "animate-out",
) => void;

export interface ToastInterface {
    id: string;

    /** ## Toast props
     *  The props you want to give this toast.
     *
     *  - `title` - the title of this toast. The text is bold by default.
     *  - `message` - the message of this toast. The main message of the toast.
     */
    props: ToastProps;

    /** ## Toast options
     *  The options to give this toast.
     */
    options?: ToastOptions;

    /** ## is_dismissed
     *  To tell toast listeners that they should remove a specific toast from their
     *  internal state as this toast will be removed in due time \(since we need to
     *  animate it out if their is an animation duration\).
     */
    is_dismissed: boolean;

    /** ## Toast type
     *  Loading toasts cannot be closed automatically unless specified.
     */
    type: ToastTypes;
    idx: number;
    z_index: number;

    /** ## Toast initial height
     *  The original height of this toast.
     *
     * This is used since when the toasts are stacked together, the toasts behind the front toast will have the
     * height of the toast in front.
     */
    initial_height: number;

    /** ## Toast offset
     *  The offset of this toast from the main entry point. This is used to move
     *  the toasts since each toast have their position calculated for a smooth moving effect.
     *
     *  To calculate this, we do:
     *
     *  `Toast index * Gap + Height of all the toasts combined except the current toast's which offset is being calculated`
     *
     *  You can think of it as if the toast container has a display of flex. If there are 3 toasts, then the third toast's index would
     *  be two since there would be two gaps in the toast container, and its position will be the two gaps plus the height of its predecessors
     *  combined.
     *
     */
    offset: number;
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

    /** Updates the contents of a toast. */
    update_toast(_toast_id: string, _updated_props: ToastProps): void;

    remove_timer(_toast_id: string): void;
    add_timer(_toast_id: string, _time: number): void;
}

interface MainToast {
    default(
        props: ToastProps,
        options?: ToastOptions,
        type?: ToastTypes,
    ): ReturnValue;

    /** ## Toast success
     *  Renders a check icon beside the toast message.
     */
    success(props: ToastProps, options?: ToastOptions): ReturnValue;
    /** ## Toast error
     *  Renders an x icon beside the toast message.
     */
    error(props: ToastProps, options?: ToastOptions): ReturnValue;
    /** ## Toast info
     *  Renders an i icon beside the toast message.
     */
    info(props: ToastProps, options?: ToastOptions): ReturnValue;
    /** ## Toast warning
     *  Renders a warning icon beside the toast message.
     */
    warn(props: ToastProps, options?: ToastOptions): ReturnValue;
    /** ## Toast Loading
     *  Renders a loading icon beside the toast message and cannot be closed unless specified.
     */
    loading(props: ToastProps, options?: ToastOptions): ReturnValue;
    /** ## Toast Promise
     *  Handles promises for you and renders a loading toast. Once the promise is finished, then changes the toast to either a success toast or error toast and sets a timer to close the toast.
     *  @returns
     *  error | response data
     */
    promise<T, K>(
        callback: (...args: T[]) => Promise<K>,
        ...args: T[]
    ): Promise<K>;
    /** ## Toast dismiss
     *  Removes a toast.
     */
    dismiss(toast_id: string): string;
}

export type { MainToast as Toast };
