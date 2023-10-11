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
import { Toast } from "./toast";
import { $id } from "./lib/dom_helpers";
import { gen_random_id } from "./lib/gen_random_id";
import { get_icon } from "./icons";

class Store implements StoreInterface {
    toasts: Map<string, Toast>;
    listeners: Map<number, ToastListener>;
    timers: Map<string, number>;
    listeners_length: number;
    aborters: Map<string, AbortController>;

    constructor() {
        this.listeners_length = 0;
        this.timers = new Map();
        this.toasts = new Map();
        this.listeners = new Map();
        this.aborters = new Map();
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

    update = (toast: Toast, type: "add" | "remove" | "animate-out"): void => {
        for (const listener of this.listeners.values()) {
            listener(toast, type);
        }
    };

    create = (
        props: ToastProps,
        options?: ToastOptions,
        type: ToastTypes = "neutral",
    ): ReturnValue => {
        const toast_id = gen_random_id();

        options = get_default(type, options);

        const toast_size = this.toasts.size;
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

        this.update(toast_data, "add");

        if (options.automatically_close) {
            const timer = setTimeout(() => {
                this.dismiss(toast_id);
            }, options.lifetime - options.animation_duration);

            this.timers.set(`toast-${toast_id}`, timer);
        }

        return { toast_id };
    };

    dismiss = (toast_id: string): void => {
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

        this.toasts.delete(toast_id);
        this.update(toast, "remove");
        this.update(toast, "animate-out");
    };

    add_timer = (
        toast_id: string,
        remaining_time: number,
        timer_removed_on?: number,
    ): void => {
        const toast = this.toasts.get(toast_id);

        if (toast) {
            const timer = setTimeout(() => {
                this.dismiss(toast_id);
            }, remaining_time);

            if (timer_removed_on) {
                /** To have the same amount of time left while toasts are expanded. */
                toast.created_on = timer_removed_on;
            } else {
                toast.created_on = Date.now() - toast.created_on;
            }

            this.timers.set(`toast-${toast_id}`, timer);
        }
    };

    remove_timer = (toast_id: string): void => {
        const timer_id = `toast-${toast_id}`;
        const animation_timer_id = `toast-animation-${toast_id}`;
        const timer = this.timers.get(timer_id);
        const animation_timer = this.timers.get(animation_timer_id);

        clearTimeout(timer);
        clearTimeout(animation_timer);

        this.timers.delete(timer_id);
        this.timers.delete(animation_timer_id);
    };

    update_toast = (
        toast_id: string,
        updated_props: ToastProps,
        type: ToastTypes = "neutral",
        options?: Pick<ToastOptions, "automatically_close" | "loading_icon">,
    ): void => {
        if (!toast_id) {
            return;
        }

        const toast = this.toasts.get(toast_id);

        if (!toast) {
            return;
        }

        toast.options.automatically_close = true;
        toast.props.message = updated_props.message;

        $id(`message-toast-${toast_id}`).textContent = updated_props.message;
        $id(`toast-${toast_id}`).setAttribute("data-type", type);

        if (toast.props.title) {
            toast.props.title = updated_props.title;
            $id(`title-toast-${toast_id}`).textContent = updated_props.title;
        }

        if (
            !options ||
            options.automatically_close == undefined ||
            type != "loading"
        ) {
            toast.options.automatically_close == true;
        }

        if (
            toast.options.automatically_close &&
            type != "loading" &&
            toast.type == "loading"
        ) {
            this.add_timer(toast_id, toast.options.lifetime, Date.now());
        }

        if (toast.type != "neutral" && type == "neutral") {
            const icon = $id(`icon-toast-${toast_id}`);

            if (icon) {
                $id(`toast-${toast_id}`).removeChild(icon);
            }
        }

        if (toast.type != type) {
            const icon_to_remove = $id(`icon-toast-${toast_id}`);

            if (icon_to_remove) {
                $id(`toast-${toast_id}`).removeChild(icon_to_remove);
            }

            const icon = get_icon(type, options?.loading_icon || "normal");

            $id(`toast-${toast_id}`).prepend(icon);
        }
    };

    private $remove_toast = (toast_id: string): void => {
        const toast_element = $id(`toast-${toast_id}`);

        $id("toast-container").removeChild(toast_element);
        this.remove_timer(toast_id);

        const aborter = this.aborters.get(`toast-${toast_id}`);

        if (aborter) {
            aborter.abort();
        }

        this.aborters.delete(`toast-${toast_id}`);
    };
}

const toast_observer = new Store();

export { toast_observer as ToastObserver };
