import type { ToastOptions, ToastProps } from "./types/toast-types";

import { mount_toaster } from "./mount";
import { ToastObserver } from "./store";

import "./styles/index.css";

const toast = Object.defineProperties(ToastObserver.create, {
    success: {
        value: (props: ToastProps, options?: ToastOptions) => {
            return ToastObserver.create(props, options, "success");
        },
        writable: false,
    },
    error: {
        value: (props: ToastProps, options?: ToastOptions) => {
            return ToastObserver.create(props, options, "error");
        },
        writable: false,
    },
    info: {
        value: (props: ToastProps, options?: ToastOptions) => {
            return ToastObserver.create(props, options, "info");
        },
        writable: false,
    },
    warn: {
        value: (props: ToastProps, options?: ToastOptions) => {
            return ToastObserver.create(props, options, "warn");
        },
        writable: false,
    },
    loading: {
        value: (props: ToastProps, options?: ToastOptions) => {
            return ToastObserver.create(props, options, "loading");
        },
        writable: false,
    },
});

export { toast, mount_toaster };
export type { ToastOptions, ToastProps };
