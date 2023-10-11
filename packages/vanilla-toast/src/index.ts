import type {
    ReturnValue,
    Toast,
    ToastOptions,
    ToastProps,
} from "./types/toast-types";

import { mount_toaster } from "./mount";
import { ToastObserver } from "./store";

import "./styles/index.css";
import "./listener";

/** # Toast
 *  Provides all the functions possible to render a toast notification.
 *
 *  - `default` - renders a neutral, black and white toast.
 *  - `success` - renders a check icon beside the toast message.
 *  - `error` - renders an x icon beside the toast message.
 *  - `info` - renders an i icon beside the toast message.
 *  - `warn` - renders a warning icon beside the toast message.
 *  - `loading` - renders a loading icon beside the toast message and cannot be closed unless specified.
 *  - `promise` - handles promises for you and renders a loading toast. Once the promise is finished, then changes the toast to either a success toast or error toast and sets a timer to close the toast. This also returns the error instead of throwing it.
 *  - `dismiss` - dismisses a toast.
 */
const toast = <Toast>{
    default: ToastObserver.create,
    success(props, options) {
        return ToastObserver.create(props, options, "success");
    },
    error(props: ToastProps, options?: ToastOptions): ReturnValue {
        return ToastObserver.create(props, options, "error");
    },
    info(props: ToastProps, options?: ToastOptions): ReturnValue {
        return ToastObserver.create(props, options, "info");
    },
    warn(props: ToastProps, options?: ToastOptions): ReturnValue {
        return ToastObserver.create(props, options, "warn");
    },
    loading(props: ToastProps, options?: ToastOptions): ReturnValue {
        return ToastObserver.create(props, options, "loading");
    },
    async promise(callback, ...args) {
        const { toast_id } = toast.loading({
            message: "Loading...",
        });

        try {
            const response = await callback(...args);

            ToastObserver.update_toast(
                toast_id,
                { message: "Success!" },
                "success",
            );

            return response;
        } catch (error) {
            console.error(error);

            ToastObserver.update_toast(
                toast_id,
                {
                    message: "Something went wrong!",
                },
                "error",
            );

            return error;
        }
    },
    dismiss: ToastObserver.dismiss,
};

export { toast, mount_toaster };
export type { ToastOptions, ToastProps };
