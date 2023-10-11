import type {
    ToastInterface,
    ToastOptions,
    ToastProps,
    ToastTypes,
} from "./types/toast-types";

import { aria_live_map } from "./lib/attributes";
import { $id } from "./lib/dom_helpers";
import { ToastObserver } from "./store";
import { create_element } from "./render";
import { get_icon } from "./icons";
import { get_height } from "./lib/calculate_height";

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
    created_on: number;

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

            return;
        }

        this.src_element = null;

        this.id = id;
        this.props = props;
        this.options = options;
        this.is_dismissed = is_dismissed;
        this.type = type;
        this.idx = idx;
        this.z_index = z_index;
        this.created_on = Date.now();

        if ($id("toast-container")) {
            this.append_to_dom();

            const { packed_size, original_height } = get_height(
                this.src_element,
            );

            $id("toast-container").style.setProperty(
                "--front-toast-height",
                packed_size + "px",
            );

            this.src_element.style.setProperty(
                "--toast-initial-height",
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
            "data-dismissed": "false",
            "data-theme": this.options.theme,
            "data-style": this.options.style,
            "data-type": this.type,
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
            id: `close-toast-${this.id}`,
            "data-close-button": "true",
            "aria-controls": `toast-${this.id}`,
            "aria-pressed": "false",
            "aria-label": "Close Notification Toast",
        });
        const text_container = create_element("div", {
            "data-text-container": "true",
        });
        const message_container = create_element("p", {
            textContent: this.props.message,
            id: `message-toast-${this.id}`,
        });
        const aborter = new AbortController();
        const signal = aborter.signal;

        ToastObserver.aborters.set(`toast-${this.id}`, aborter);

        this.src_element = element;

        close_button.addEventListener(
            "click",
            () => {
                $id(`close-toast-${this.id}`).setAttribute(
                    "aria-pressed",
                    "true",
                );
                ToastObserver.dismiss(this.id);
            },
            {
                once: true,
                signal: signal,
            },
        );

        if (this.type != "neutral") {
            const icon = get_icon(this.type, this.options.loading_icon);
            const icon_container = create_element("div", {
                "data-icon-container": "true",
                id: `icon-toast-${this.id}`,
            });

            icon_container.appendChild(icon);
            this.src_element.append(icon_container);
        }

        if (this.props.title) {
            const title = create_element("h6", {
                textContent: this.props.title,
                id: `title-toast-${this.id}`,
                "data-title": "true",
            });

            text_container.append(title);
        }

        text_container.append(message_container);
        button_container.appendChild(close_button);
        this.src_element.append(text_container);
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
        this.src_element.setAttribute("data-dismissed", this.is_dismissed + "");
    };

    update_idx = (): void => {
        if (this.idx >= MAX_TOASTS_VISIBLE) {
            this.src_element.style.setProperty("--toast-opacity", "0");
            this.src_element.setAttribute("aria-hidden", "true");
        } else if (!this.is_dismissed) {
            this.src_element.style.setProperty("--toast-opacity", "1");
            this.src_element.setAttribute("aria-hidden", "false");
        }

        if (this.idx == 0) {
            $id("toast-container").style.setProperty(
                "--front-toast-height",
                this.initial_height + "px",
            );
            $id("toast-" + this.id).setAttribute("data-front-toast", "true");
        }

        this.src_element.style.setProperty("--toast-index", this.idx + "");
        this.src_element.style.setProperty("--z-index", this.z_index + "");
    };
}
