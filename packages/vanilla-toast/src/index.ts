import type { ToastOptions, ToastProps } from "./types/toast-types";

import { mount_toaster } from "./mount";
import { ToastObserver } from "./store";

import "./styles/index.css";
import {
    calculate_toast_offset,
    calculate_total_height_of_previous_toasts,
} from "./lib/calculate_height";
import { GAP } from "./toast";

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

ToastObserver.listen((toast, type) => {
    if (type == "add") {
        for (const current_toast of ToastObserver.toasts.values()) {
            if (toast.id == current_toast.id) {
                continue;
            }

            const offset_height =
                calculate_total_height_of_previous_toasts(current_toast);
            const offset = calculate_toast_offset(
                ++current_toast.idx,
                GAP,
                offset_height,
            );

            current_toast.offset = offset;

            current_toast.update_idx();
            current_toast.update_offset();
        }
    } else if (type == "animate-out") {
        toast.animate_out();
    } else if (type == "remove") {
        for (const current_toast of ToastObserver.toasts.values()) {
            if (toast.idx > current_toast.idx) {
                --current_toast.z_index;
            }

            if (toast.idx < current_toast.idx) {
                const offset_height =
                    calculate_total_height_of_previous_toasts(current_toast);
                const offset = calculate_toast_offset(
                    --current_toast.idx,
                    GAP,
                    offset_height,
                );

                current_toast.offset = offset;

                current_toast.update_idx();
                current_toast.update_offset();
            }
        }
    }
});

export { toast, mount_toaster };
export type { ToastOptions, ToastProps };
