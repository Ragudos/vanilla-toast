/** MAIN STATE HANDLER */
import type { ReturnValue, StoreInterface, ToastListener, ToastOptions, ToastProps, ToastTypes } from "./types/toast-types";
import { Toast } from "./toast";
declare class Store implements StoreInterface {
    toasts: Map<string, Toast>;
    listeners: Map<number, ToastListener>;
    timers: Map<string, number>;
    listeners_length: number;
    aborters: Map<string, AbortController>;
    constructor();
    listen: (listener: ToastListener) => (() => void);
    update: (toast: Toast, type: "add" | "remove" | "animate-out") => void;
    create: (props: ToastProps, options?: ToastOptions, type?: ToastTypes) => ReturnValue;
    dismiss: (toast_id: string) => void;
    add_timer: (toast_id: string, remaining_time: number, timer_removed_on?: number) => void;
    remove_timer: (toast_id: string) => void;
    update_toast: (toast_id: string, updated_props: ToastProps, type?: ToastTypes, options?: Pick<ToastOptions, "automatically_close" | "loading_icon">) => void;
    private $remove_toast;
}
declare const toast_observer: Store;
export { toast_observer as ToastObserver };
