import type { Toast } from "../toast";

import { ToastObserver } from "../store";

export function calculate_total_height_of_previous_toasts(toast: Toast) {
    return [...ToastObserver.toasts.values()].reduce(
        (prev, curr, curr_index) => {
            if (curr_index <= toast.z_index) {
                return prev;
            }

            return prev + curr.initial_height;
        },
        0,
    );
}

export function calculate_toast_offset(
    idx: number,
    gap: number,
    total_height_of_previous_toasts: number,
) {
    return Math.floor(idx * gap + total_height_of_previous_toasts);
}

export function get_height(el: HTMLElement) {
    const original_height = el.style.height;

    el.style.height = "auto";

    const packed_size = el.getBoundingClientRect().height;

    return {
        original_height,
        packed_size,
    };
}
