import type {
    ToastInterface,
    ToastOptions,
    ToastProps,
    ToastTypes,
} from "./types/toast-types";

import { TOAST_ATTRIBUTES, attributes_map } from "./lib/attributes";
import { get_default_position } from "./lib/get_default";
import { $create, $id } from "./lib/dom_helpers";
export const GAP = 16;

export class Toast implements ToastInterface {
    id: string;
    props: ToastProps;
    options?: ToastOptions;
    is_dismissed: boolean;
    type: ToastTypes;
    idx: number;
    z_index: number;
    initial_height: number;
    offset: number;

    private src_element: null | HTMLElement;

    constructor(
        id: string,
        props: ToastProps,
        options: ToastOptions,
        is_dismissed: boolean,
        type: ToastTypes,
        idx: number,
        z_index: number,
    ) {
        if (!$id("toast-container")) {
            console.error(new Error("Please mount the toast container first."));
        }

        this.src_element = null;

        this.id = id;
        this.props = props;
        options.position = get_default_position(options.position);
        this.options = options;
        this.is_dismissed = is_dismissed;
        this.type = type;
        this.idx = idx;
        this.z_index = z_index;

        if ($id("toast-container")) {
            this.append_to_dom();

            const original_height = this.src_element.style.height;

            this.src_element.style.height = "auto";

            const packed_size = this.src_element.getBoundingClientRect().height;

            this.initial_height = packed_size;
            this.src_element.style.height = original_height;
            this.offset = 0;
        }
    }

    append_to_dom(): void {
        const el = $create("li");

        this.src_element = el;

        for (const attr_key in this.options) {
            if (attr_key == "position") {
                this.src_element.setAttribute(
                    attributes_map.position.x,
                    this.options.position.x,
                );
                this.src_element.setAttribute(
                    attributes_map.position.y,
                    this.options.position.y,
                );

                continue;
            }

            this.src_element.setAttribute(
                attributes_map[attr_key],
                this.options[attr_key],
            );
        }

        this.src_element.setAttribute(TOAST_ATTRIBUTES.DATA_VANILLA_TOAST, "");
        this.src_element.style.setProperty("--toast-gap", GAP + "");
        this.src_element.style.setProperty("--toast-offset", "0px");

        this.update_idx();

        this.src_element.id = `toast-${this.id}`;
        this.src_element.textContent = this.props.message;

        $id("toast-container").append(this.src_element);

        setTimeout(() => {
            this.src_element.setAttribute("data-mounted", "true");
        });
    }

    update_offset = (): void => {
        this.src_element.style.setProperty(
            "--toast-offset",
            this.offset + "px",
        );
    };

    animate_out = (): void => {
        this.src_element.setAttribute(
            TOAST_ATTRIBUTES.DATA_DISMISSED,
            this.is_dismissed + "",
        );
    };

    update_idx = (): void => {
        this.src_element.style.setProperty("--toast-index", this.idx + "");
        this.src_element.style.setProperty(
            "--toast-z-index",
            this.z_index + "",
        );
    };
}
