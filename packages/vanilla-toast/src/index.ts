import type { ToastOptions, ToastProps } from "./types/toast-types";

import { mount_toaster } from "./mount";
import { ToastObserver } from "./store";

import {
    calculate_toast_offset,
    calculate_total_height_of_previous_toasts,
} from "./lib/calculate_height";
import { GAP } from "./toast";

import "./styles/index.css";
import { $id } from "./lib/dom_helpers";

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

            $id("toast-" + current_toast.id).setAttribute(
                "data-front-toast",
                "false",
            );

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
            $id("toast-" + current_toast.id).setAttribute(
                "data-front-toast",
                "false",
            );

            if (toast.idx > current_toast.idx) {
                --current_toast.z_index;
                current_toast.update_idx();
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

let is_pressed = false;

window.addEventListener("keydown", (e) => {
    if (e.altKey) {
        if ((e.key == "t" || e.key == "T") && !is_pressed) {
            is_pressed = true;

            if (!$id("toast-container")) {
                is_pressed = false;

                return;
            }

            $id("toast-container").setAttribute("data-expanded", "true");
        }
    } else {
        if (is_pressed && e.key == "Escape") {
            is_pressed = false;
            $id("toast-container").setAttribute("data-expanded", "false");
        }
    }
});

export { toast, mount_toaster };
export type { ToastOptions, ToastProps };
