import type { ToastInterface, ToastOptions, ToastProps, ToastTypes } from "./types/toast-types";
export declare const GAP = 12;
export declare const MAX_TOASTS_VISIBLE = 3;
export declare class Toast implements ToastInterface {
    id: string;
    props: ToastProps;
    options?: ToastOptions;
    is_dismissed: boolean;
    type: ToastTypes;
    idx: number;
    z_index: number;
    initial_height: number;
    offset: number;
    created_on: number;
    private src_element;
    constructor(id: string, props: ToastProps, options: ToastOptions, is_dismissed: boolean, type: ToastTypes, idx: number, z_index: number);
    private append_to_dom;
    update_offset: () => void;
    animate_out: () => void;
    update_idx: () => void;
}
