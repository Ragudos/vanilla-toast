import { type ToastOptions, type ToastProps, type ToastReturn, type ToastTypes } from ".";
/**
 * ## Toast Container Options
 * The options you want to pass to the toast container. These will be applied
 * when you load the toast container.
 */
export type ToastContainerOptions = {
    /**
     * Whether toasts should be stacked or not.
     *
     * If they are, then new toasts will sit on top of the previous toast. This
     * is great to not clutter the screen.
     *
     * @default
     *
     * false
     */
    stacked?: boolean;
    /**
     * The max amount of toasts visible. This sets the toast container to
     * hide overflows.
     *
     * Note that if you pass in 0, the default amount will be applied.
     *
     * @default
     *
     * 3
     */
    max_toasts_visible: number;
};
export declare function initialize_toast(options?: ToastContainerOptions): void;
/**
 * ## Show toast
 * The main engine of this overall library. This handles toast creation.
 *
 * @param props {ToastProps} This is where you pass in the toast's message and an optional title.
 * @param options {Partial<ToastOptions>} Contains options to customize the toast.
 * @param type {ToastTypes} Specifies what kind of toast this is, and styles and/or performs methods based on the type.
 * @returns {ToastReturn} { toast_id }
 */
export declare function show_toast(props: ToastProps, options?: Partial<ToastOptions>, type?: ToastTypes): ToastReturn;
