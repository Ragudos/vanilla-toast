/** MAIN STATE HANDLER */

import type {
    ReturnValue,
    StoreInterface,
    ToastListener,
    ToastOptions,
    ToastProps,
    ToastTypes,
} from "./types/toast-types";
import { get_default } from "./lib/get_default";
import { GAP, Toast } from "./toast";
import { $id } from "./lib/dom_helpers";
import { gen_random_id } from "./lib/gen_random_id";
import {
    calculate_toast_offset,
    calculate_total_height_of_previous_toasts,
} from "./lib/calculate_height";

class Store implements StoreInterface {
    toasts: Map<string, Toast>;
    listeners: Map<number, ToastListener>;
    timers: Map<string, number>;
    toasts_length: number;
    listeners_length: number;

    // to update the toasts
    // synchronously.
    private queue: Array<() => void>;
    private is_updating: boolean;

    constructor() {
        this.listeners_length = 0;
        this.toasts_length = 0;
        this.timers = new Map();
        this.toasts = new Map();
        this.listeners = new Map();

        this.queue = [];
        this.is_updating = false;
    }

    listen = (listener: ToastListener): (() => void) => {
        const listener_id = this.listeners_length++;

        this.listeners.set(listener_id, listener);

        const cleanup = () => {
            this.listeners_length--;
            this.listeners.delete(listener_id);
        };

        return cleanup;
    };

    update = (toast: Toast): void => {
        for (const listener of this.listeners.values()) {
            listener(toast);
        }
    };

    create = (
        props: ToastProps,
        options?: ToastOptions,
        type: ToastTypes = "neutral",
    ): ReturnValue => {
        const toast_id = gen_random_id();

        options = get_default(options);

        // let z_index: number;

        const toast_size = this.toasts.size;
        // const max_index = this.calculate_z_index();

        // // if (toast_size != 0 && toast_size == max_index) {
        // //     z_index = max_index;
        // // } else {
        // //     z_index = toast_size;
        // // }

        const create_operation = () => {
            const toast_data = new Toast(
                toast_id,
                props,
                options,
                false,
                type,
                0,
                toast_size,
            ) satisfies Toast;

            this.toasts.set(toast_id, toast_data);

            for (const current_toast of this.toasts.values()) {
                if (toast_id == current_toast.id) {
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

            this.update(toast_data);

            // Subtract the lifetime to the duration of a toast's animation.
            // This is good as when the time is met, we set the is_dismissed to true,
            // thus making all listeners animate a toast out.
            const timer = setTimeout(() => {
                this.dismiss(toast_id);
            }, options.lifetime - options.animation_duration);

            this.timers.set(`toast-${toast_id}`, timer);
        };

        this.enqueue_operation(create_operation);

        return { toast_id };
    };

    dismiss = (toast_id: string): void => {
        const dismiss_operation = () => {
            const toast = this.toasts.get(toast_id);

            if (!toast) {
                console.error(
                    new Error("Tried to remove a toast that does not exist!"),
                );
            }

            toast.is_dismissed = true;

            const animation_timeout = setTimeout(() => {
                this.$remove_toast(toast_id);
            }, toast.options.animation_duration);

            this.timers.set(`toast-animation-${toast_id}`, animation_timeout);

            toast.animate_out();

            this.update(toast);
        };

        this.enqueue_operation(dismiss_operation);
    };

    remove_timers = (toast_id: string): void => {
        const timer_id = `toast-${toast_id}`;
        const animation_timer_id = `toast-animation-${toast_id}`;
        const timer = this.timers.get(timer_id);
        const animation_timer = this.timers.get(animation_timer_id);

        clearTimeout(timer);
        clearTimeout(animation_timer);

        this.timers.delete(timer_id);
        this.timers.delete(animation_timer_id);
    };

    $remove_toast = (toast_id: string): void => {
        const removing_operation = () => {
            const toast_element = $id(`toast-${toast_id}`);
            const toast = this.toasts.get(toast_id);

            $id("toast-container").removeChild(toast_element);
            this.remove_timers(toast_id);

            for (const current_toast of this.toasts.values()) {
                if (toast.idx > current_toast.idx) {
                    --current_toast.z_index;
                }

                if (toast.idx < current_toast.idx) {
                    const offset_height =
                        calculate_total_height_of_previous_toasts(
                            current_toast,
                        );
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

            this.toasts.delete(toast_id);
        };

        this.enqueue_operation(removing_operation);
    };

    private enqueue_operation = (operation: () => void): void => {
        this.queue.push(operation);
        this.process_queue();
    };

    private process_queue = (): void => {
        if (!this.is_updating) {
            if (this.queue.length > 0) {
                this.is_updating = true;

                const operation = this.queue.shift();

                if (operation) {
                    operation();
                }
            }

            this.is_updating = false;
        }
    };

    private calculate_z_index = (): number => {
        if (this.toasts.size == 0) {
            return 0;
        }

        return (
            Math.max(
                ...[...this.toasts.values()].map((toast) => toast.z_index),
            ) + 1
        );
    };
}

const toast_observer = new Store();

export { toast_observer as ToastObserver };
