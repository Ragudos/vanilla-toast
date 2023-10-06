import { type ToastOptions, type ToastProps, type ToastReturn, type ToastTypes } from ".";
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
