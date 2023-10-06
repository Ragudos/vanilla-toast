/**@type {import("@types/index.d.ts")} */

import { $, does_user_prefer_reduced_motion, dom_reflow } from "./lib";
import { show_toast } from "./toast";
import {
    DEFAULT_ANIMATION_DURATION,
    close_button_aborters_hashmaps,
    timer_hashmaps,
} from "./consts";

import "./styles/root.css";
import "./styles/position.css";
import "./styles/animations.css";

export type BoxShadowSizes = "sm" | "md" | "lg";
export type ToastCloseButtonPositions = "inline" | "top-right" | "top-left";
type IconPositions = "left" | "right";

/**
 * ## Toast Positions
 * Specifies where the toast will be located
 */
export type ToastPositions =
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "bottom-center";

/**
 * ## Toast Types
 *
 * - Netural means no icon and a plain background
 * - Success means a checkmark icon and a green background
 * - Error means an x icon and a red background
 * - Warn means a warning icon and a yellow background
 * - Info means a letter i icon and a blue background
 * - Loading means a non-closable toast and a loading icon with a plain background
 */
export type ToastTypes =
    | "neutral"
    | "success"
    | "error"
    | "warn"
    | "info"
    | "loading";

/**
 * Various toast animations you can apply to the toast on either enter or exit. This will be
 * applied to the CSS property of var(--animation-name), which will be used by the toast.
 */
export type ToastAnimations =
    | "popdown"
    | "popup"
    | "fade-in"
    | "slide-up"
    | "slide-down"
    | "slide-left"
    | "slide-right";

/**
 * ## Toast Colors
 *
 * The places which the default toast colors will apply to
 */
export type ToastColor = "background" | "icon" | "icon-stroke";

/**
 * ## Toast Importance
 *
 * Indicates how important this toast is to aria for accessibility.
 */
export type ToastImportance = "not important" | "important" | "critical";

/**
 * ## Toast Close Button Options
 * The options available for a close button.
 */
export type ToastCloseButtonOptions = {
    /**
     * The position of the close button of a toast instance.
     * If inline, then the button's position will depend on the
     * value of @type { IconPositions }.
     *
     * @default
     *
     * top-right
     */
    position?: ToastCloseButtonPositions;

    /**
     * If you'd like to pass on a custom button. For example,
     * adding a function that is triggered when the close button is clicked,
     * such as "Undo".
     */
    custom_button?: {
        /**
         * Function to trigger when this button is clicked.
         * You don't need to add the toast.dismiss() function here
         * as it will be called for you together with this function.
         *
         * @param toast_id
         * @returns void
         */
        on_click?: (toast_id: string) => void;

        /**
         * Class name to provide the custom buttom.
         * Please do refer to the CSS properties for this
         * button first before brute-forcing your way with !important
         * when it does not take into effect.
         *
         * The initial className is toast-close-button.
         *
         * Take note that CSS Modules is used for this so the initial class
         * name may not be exactly the same.
         *
         * With this method, you can use TailwindCSS.
         */
        className?: string;
    };

    /**
     * How will this button be visible?
     *
     * Visible means it's there right off the bat.
     *
     * @default
     *
     * visible
     */
    appearance?: "visible" | "visible-on-hover";
} & (
    | {
          type?: "text";
          /**
           * Please do pass in the property "type" a value of "text" if you
           * are going to pass in a text since the conditional checks for the "type" value,
           * and if it does not exist, then it will default to an X icon.
           *
           * @default
           * close
           */
          text?: string;
      }
    | {
          type?: "icon";
          /** If this custom icon is a string,
           *  then we append it using innerHTML.
           *
           * Please do pass in the property "type" a value of "icon" if you
           * are going to pass in an icon since the conditional checks for the "type" value,
           * and if it does not exist, then it will default to an X icon.
           *
           * @default
           *
           * an X icon
           */
          custom_icon?: string | HTMLElement | SVGElement;
      }
);

/**
 * ## Toast Options
 *
 * The options available to a toast instance or element for
 * customization on toast creation.
 *
 */
export type ToastOptions = {
    /**
     * The duration in milliseconds you'd like to give this toast instance before it gets removed
     * from the DOM or the webpage.
     *
     * @default "Toast container attribute [data-duration] value or 3000"
     */
    duration?: number;

    /**
     * The id you'd like to give this toast instance. This is not required as
     * the random id will be pseudo-randomly generated for you already.
     *
     */
    toast_id?: string;

    /**
     * Whether to add a close button or not. Alternatively,
     * you can add options for this close button, or even
     * attach you custom close button.
     *
     *  @default true
     */
    close_button?: boolean | ToastCloseButtonOptions;

    /**
     *  Indicates how long the toast will animate in and out in milliseconds.
     *
     * @default
     *
     * in: 400
     * out: 400
     */
    animation_duration?: {
        in?: number;
        out?: number;
    };

    /**
     *  A custom icon to pass to the toast. This can be a string or an element that will be appended.
     *  The toast maker automatically adds the toast icon class to the element you pass through if it is an element.
     *  If it's a string, then it will not have the toast icon class.
     *
     *
     *  **WARNING**
     *  This method uses innerHTML for strings
     */
    custom_icon?: string | HTMLElement | SVGElement;

    /**
     * The position a specific toast's icon.
     * @type { IconPositions }
     *
     * @default
     *
     * "left"
     */
    icon_position?: IconPositions;

    /**
     * The position where the toast is rendered.
     *
     *  @default
     *
     *  top-right
     */
    toast_position?: ToastPositions;

    /**
     *  Sets the importance of this toast. This translates to
     *  the [aria-live] attribute for accessibility.
     *
     *  This is not required as it will be inferred for you already. Namely:
     *
     *  - Success, Warn, and Error is critical, which means [aria-live] is assertive
     *  - Loading and Neutral states are not important, which means [aria-live] is off
     *  - Info is important, which means [aria-live] is polite
     */
    importance?: ToastImportance;

    /**
     * Sets what the toast color will target.
     *
     * @default
     *
     * background
     */
    colors?: ToastColor;

    /**
     * Enter animation for the toast
     *
     * @default
     * "popdown"
     */
    animation?: ToastAnimations;

    /**
     * Even though loading toasts must be closed programatically (by you),
     * you can still choose to not automatically close other toasts.
     *
     * **WARNING**
     * If you disable this, then you must be the one to close the toast like a loading toast.
     *
     * @default
     * true
     */
    automatically_close?: boolean;

    /**
     * The size of the toast's box shadow. The default is already in the CSS Property var(--toast-box-shadow).
     * This will lazily import the constant that maps the specific CSS value for the box shadow, so take note of that
     * if you're an optimization enthusiast.
     *
     *  @default
     * sm
     */
    shadow_size?: BoxShadowSizes;
};

/**
 * ## ToastProps
 * The main characteristics the toast will have.
 * An optional title and a required message.
 */
export type ToastProps = {
    /**
     * An optional title to give the toast. This will appear in bold by default.
     */
    title?: string;

    /**
     * The main message of the toast.
     */
    message: string;
};

/**
 * ## Toast Return
 *
 * The return value of a toast instance.
 *
 * ### toast_id
 * The id of the toast element that was pseudo-randomly generated, or this can also be
 * the toast id that you provide in the toast function arguments.
 *
 */
export type ToastReturn = {
    toast_id: string;
};

interface Toast {
    (
        props: ToastProps,
        options?: Partial<ToastOptions>,
        type?: ToastTypes,
    ): ToastReturn;

    /**
     * ## Success Toast
     *
     * A toast that signals success. Has a default configuration of:
     *
     * - importance = "critical"
     * - type = "success"
     */
    success: (
        props: ToastProps,
        options?: Partial<ToastOptions>,
    ) => ToastReturn;

    /**
     * ## Error Toast
     *
     * A toast that signals error. Has a default configuration of:
     *
     * - importance = "critical"
     * - type = "error"
     */
    error: (props: ToastProps, options?: Partial<ToastOptions>) => ToastReturn;

    /**
     * ## Warn Toast
     *
     * A toast that signals a warning. Has a default configuration of:
     *
     * - importance = "critical"
     * - type = "warn"
     */
    warn: (props: ToastProps, options?: Partial<ToastOptions>) => ToastReturn;

    /**
     * ## Info Toast
     *
     * A toast to share fun facts or information. Has a default configuration of:
     *
     * - importance = "important"
     * - type = "info"
     */
    info: (props: ToastProps, options?: Partial<ToastOptions>) => ToastReturn;

    /**
     * ## Loading Toast
     *
     * A toast to indicate a loading state of something. Cannot be manually closed with a button, and
     * must be closed by you, the developer, programatically as this will not have a setTimeout. Has a default
     * configuration of:
     *
     * - importance = "not important"
     * - type = "loading"
     */
    loading: (
        props: ToastProps,
        options?: Partial<ToastOptions>,
    ) => ToastReturn;

    /**
     * ## Toast Dismiss
     *
     * Removes a toast based upon its id.
     *
     * You can prematurely remove a toast if you'd like using this function. This is the function used
     * for toast removal.
     *
     * Responsibilities:
     * - Removes event listeners attached to all elements of a toast instance.
     * - Animates a toast instance out.
     * - Removes a toast from the DOM.
     */
    dismiss: (toast_id: string) => void;
}

/**
 * ## Toast
 * The main guy.
 *
 * This calls the main engine (or function) of this library, and has various properties
 * that automatically gives you the type argument for the show_toast() function.
 *
 * There are special functions too, like:
 *
 * - dismiss() or toast.dismiss()
 *
 * ### Accessibility
 * This automatically infers aria-live values for you.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live
 *
 * Additionally, this code automatically detects if a user prefers instant animations (prefers-reduced-motion). If so,
 * your configuration for animation_duration will be disregarded.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
 */
export const toast: Toast = function (props, options, type) {
    return show_toast(props, options, type);
};

toast.success = function (props, options) {
    return show_toast(props, options, "success");
};

toast.error = function (props, options) {
    return show_toast(props, options, "error");
};

toast.warn = function (props, options) {
    return show_toast(props, options, "warn");
};

toast.info = function (props, options) {
    return show_toast(props, options, "info");
};

toast.loading = function (props, options) {
    return show_toast(props, options, "loading");
};

toast.dismiss = function (toast_id) {
    const toast_container = $("#toast-holder") as HTMLElement;
    const toast = $(`#${CSS.escape(toast_id)}`) as HTMLElement;

    if (!toast_container) {
        console.error("Toast container does not exist!");
    }

    if (!toast) {
        console.error("Toast does not exist!");
    }

    /**
     *  Remove all event listeners of
     *  this specific toast instance and its relative aborters.
     */
    close_button_aborters_hashmaps.get(toast_id)?.abort();
    close_button_aborters_hashmaps.delete(toast_id);

    if (does_user_prefer_reduced_motion) {
        toast_container.removeChild(toast);
    } else {
        clearTimeout(timer_hashmaps.get(toast_id));
        timer_hashmaps.delete(toast_id);
        toast.style.setProperty("--toast-animation-direction", "reverse");
        toast.style.setProperty("--toast-animation-fill-mode", "backwards");

        dom_reflow(toast);

        setTimeout(
            () => {
                toast_container.removeChild(toast);
            },
            +toast.getAttribute("data-exit-animation-duration") ??
                DEFAULT_ANIMATION_DURATION,
        );
    }
};
