import "./styles/var.css";
import { ToastImportance, ToastPositions, ToastProps, ToastTypes } from ".";
type ToastOptions = {
    dir?: "ltr" | "rtl";
    animation_duration?: {
        in?: number;
        out?: number;
    };
    type?: ToastTypes;
    importance?: ToastImportance;
    animation_timing_function?: "ease-in-out" | "ease-out" | "ease-in" | "linear" | `cubic-beizer(${number}, ${number}, ${number}, ${number})`;
};
export declare function get_toast_direction(position: ToastPositions): "b" | "t";
export declare function toast_transitions(toast_card: HTMLElement, { animation, }: {
    animation: "slide" | "popdown";
}): void;
export declare function toast_status(toast_card: HTMLElement, toast_type: ToastTypes): void;
export declare function hide_overflowing_toasts_on_new_toast(max_toasts_visible: number): void;
export declare function move_toasts(toast_children: HTMLElement[], type: -1 | 1): void;
export declare function attach_close_button(toast: HTMLElement): void;
export declare function show_toast({ title, message }: ToastProps, { dir, type, importance, animation_duration, animation_timing_function, }?: ToastOptions): {
    toast_id: string;
};
export declare function dismiss_toast(toast_id: string): void;
export {};
