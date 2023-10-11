import {
    calculate_toast_offset,
    calculate_total_height_of_previous_toasts,
} from "./lib/calculate_height";
import { $id } from "./lib/dom_helpers";
import { ToastObserver } from "./store";
import { GAP } from "./toast";

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

export function listen_to_page_events() {
    let is_pressed = false;
    const leftover_duration_of_toasts: Array<{
        time_left: number;
        toast_id: string;
        removed_on: number;
    }> = [];
    // to first finish removing or adding timers before doing either again.
    const queue: Array<() => void> = [];

    window.addEventListener("keydown", (e) => {
        if (e.altKey) {
            if ((e.key == "t" || e.key == "T") && !is_pressed) {
                is_pressed = true;
                enqueue(remove_timers);
                $id("toast-container").setAttribute("data-expanded", "true");
            }
        } else {
            if (is_pressed && e.key == "Escape") {
                is_pressed = false;
                enqueue(add_timers);
                $id("toast-container").setAttribute("data-expanded", "false");
            }
        }
    });

    $id("toast-container").addEventListener("pointerenter", () => {
        if (!is_pressed) {
            enqueue(remove_timers);
            is_pressed = true;
            $id("toast-container").setAttribute("data-expanded", "true");
        }
    });

    $id("toast-container").addEventListener("pointerleave", () => {
        if (is_pressed) {
            enqueue(add_timers);
            is_pressed = false;
            $id("toast-container").setAttribute("data-expanded", "false");
        }
    });

    function add_timers() {
        for (
            let idx = leftover_duration_of_toasts.length - 1;
            idx >= 0;
            --idx
        ) {
            const duration = leftover_duration_of_toasts[idx];

            ToastObserver.add_timer(
                duration.toast_id,
                duration.time_left,
                duration.removed_on,
            );

            leftover_duration_of_toasts.pop();
        }
    }

    function remove_timers() {
        for (const toast of ToastObserver.toasts.values()) {
            if (toast.options.automatically_close) {
                const time_left =
                    toast.options.lifetime - (Date.now() - toast.created_on);

                // to avoid removing the timer of a toast that's animating out
                if (time_left >= toast.options.animation_duration) {
                    ToastObserver.remove_timer(toast.id);
                    leftover_duration_of_toasts.push({
                        toast_id: toast.id,
                        time_left: time_left,
                        removed_on: Date.now(),
                    });
                }
            }
        }
    }

    function enqueue(fn: () => void) {
        queue.push(fn);
        process_queue();
    }

    function process_queue() {
        const fn = queue.shift();

        if (fn) {
            fn();
        }
    }
}
