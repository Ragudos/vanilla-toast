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
