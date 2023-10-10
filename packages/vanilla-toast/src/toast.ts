import type {
    ToastInterface,
    ToastOptions,
    ToastProps,
    ToastTypes,
} from "./types/toast-types";

import { TOAST_ATTRIBUTES, aria_live_map } from "./lib/attributes";
import { get_default_position } from "./lib/get_default";
import { $id } from "./lib/dom_helpers";
import { ToastObserver } from "./store";
import { create_element } from "./render";
import { get_icon } from "./icons";

export const GAP = 12;
export const MAX_TOASTS_VISIBLE = 3;

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
    automatically_close: boolean;

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
        this.automatically_close = options.automatically_close ?? false;
        this.is_dismissed = is_dismissed;
        this.type = type;
        this.idx = idx;
        this.z_index = z_index;

        if ($id("toast-container")) {
            this.append_to_dom();

            const original_height = this.src_element.style.height;

            this.src_element.style.height = "auto";

            const packed_size = this.src_element.getBoundingClientRect().height;

            $id("toast-container").style.setProperty(
                "--front-toast-height",
                packed_size + "px",
            );
            this.initial_height = packed_size;
            this.src_element.style.height = original_height;
            this.offset = 0;
        }
    }

    private append_to_dom = (): void => {
        const element = create_element("li", {
            dir: this.options.dir.toString(),
            "data-front-toast": true,
            "data-vanilla-toast": true,
            "data-position-x": this.options.position.x,
            "data-position-y": this.options.position.y,
            "data-dismissed": "false",
            id: `toast-${this.id}`,
            "aria-live": aria_live_map[this.options.importance],
            "aria-atomic": true,
            style: {
                "--toast-index": this.idx + "",
                "--z-index": this.z_index + "",
                "--toast-transition-duration":
                    this.options.animation_duration + "ms",
                "--toast-gap": GAP + "px",
                "--toast-offset": "0px",
            },
        });
        const button_container = create_element("div", {
            "data-close-button-container": "true",
            "data-position": this.options.close_button.position,
            "data-show-on-hover":
                this.options.close_button.is_shown_on_hover + "",
        });
        const close_button = create_element("button", {
            type: "button",
            "data-close-button": "true",
            "aria-controls": `toast-${this.id}`,
            "aria-pressed": "false",
            "aria-label": "Close Notification Toast",
        });
        const message_container = create_element("p", {
            textContent: this.props.message,
        });
        const aborter = new AbortController();
        const signal = aborter.signal;

        ToastObserver.aborters.set(`toast-${this.id}`, aborter);

        this.src_element = element;

        close_button.addEventListener(
            "click",
            () => {
                ToastObserver.dismiss(this.id);
            },
            {
                once: true,
                signal: signal,
            },
        );

        if (this.type != "neutral") {
            const icon = get_icon(this.type);
            const icon_container = create_element("div", {
                "data-icon-container": "true",
            });

            icon_container.appendChild(icon);
            this.src_element.append(icon_container);
        }

        button_container.appendChild(close_button);
        this.src_element.append(message_container);
        this.src_element.append(button_container);
        $id("toast-container").append(this.src_element);

        setTimeout(() => {
            this.src_element.setAttribute("data-mounted", "true");
        });
    };

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
        if (this.idx >= MAX_TOASTS_VISIBLE) {
            this.src_element.style.setProperty("--toast-opacity", "0");
        } else if (!this.is_dismissed) {
            this.src_element.style.setProperty("--toast-opacity", "1");
        }

        if (this.idx == 0) {
            $id("toast-" + this.id).setAttribute("data-front-toast", "true");
        }

        this.src_element.style.setProperty("--toast-index", this.idx + "");
        this.src_element.style.setProperty(
            "--toast-z-index",
            this.z_index + "",
        );
    };
}
