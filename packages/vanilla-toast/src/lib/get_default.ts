import type { ToastOptions, ToastPosition } from "../types/toast-types";
import { $id } from "./dom_helpers";

export const DEFAULT_POSITION: ToastPosition = {
    x: "right",
    y: "top",
};

const DEFAULT_OPTIONS: ToastOptions = {
    // Undefined to prioritize props passed to toast container
    // if there is. If not, we set the default value instead.
    position: undefined,
    lifetime: 5000,
    animation_duration: 300,
    importance: "important",
    automatically_close: true,
    close_button: {
        is_shown_on_hover: true,
        position: "right",
    },
    dir: get_dir(),
    theme: "system",
    style: "glass",
};

const media_query = window.matchMedia("(prefers-reduced-motion)");

function get_dir(): "ltr" | "rtl" {
    const attr = document.documentElement.getAttribute("dir");

    if (attr == "ltr" || attr == "rtl") {
        return attr;
    }

    return attr == "auto" || !attr
        ? (window.getComputedStyle(document.documentElement).direction as
              | "rtl"
              | "ltr")
        : (attr as "rtl" | "ltr");
}

export function get_default(options?: ToastOptions): ToastOptions {
    if (!options) {
        return DEFAULT_OPTIONS;
    } else {
        if (!options.lifetime) {
            options.lifetime = DEFAULT_OPTIONS.lifetime;
        }

        // Since negation works on 0 as well. We need it to be 0 if a users
        // prefers to have no animations. With an animation duration of 0, our
        // transitions/animations would then be instant.
        if (media_query.matches) {
            options.animation_duration = 0;
        } else {
            if (
                options.animation_duration != 0 &&
                !options.animation_duration
            ) {
                options.animation_duration = DEFAULT_OPTIONS.animation_duration;
            }
        }

        if (!options.importance) {
            options.importance = DEFAULT_OPTIONS.importance;
        }

        if (options.position) {
            if (
                options.position.x &&
                options.position.x !== "center" &&
                options.position.x != "left" &&
                options.position.x != "right"
            ) {
                options.position.x = DEFAULT_POSITION.x;
            }

            if (
                options.position.y &&
                options.position.y != "bottom" &&
                options.position.y != "top"
            ) {
                options.position.y = DEFAULT_POSITION.y;
            }
        }

        if (options.automatically_close == undefined) {
            options.automatically_close = true;
        }

        if (!options.close_button) {
            options.close_button = DEFAULT_OPTIONS.close_button;
        } else {
            if (options.close_button.is_shown_on_hover == undefined) {
                options.close_button.is_shown_on_hover =
                    DEFAULT_OPTIONS.close_button.is_shown_on_hover;
            } else if (options.close_button.position == undefined) {
                options.close_button.position =
                    DEFAULT_OPTIONS.close_button.position;
            } else if (
                options.close_button.position != "left" &&
                options.close_button.position != "right"
            ) {
                options.close_button.position = "right";
            }
        }

        if (
            !options.theme ||
            (options.theme != "dark" &&
                options.theme != "light" &&
                options.theme != "system")
        ) {
            options.theme = DEFAULT_OPTIONS.theme;
        }

        if (!options.dir || (options.dir != "ltr" && options.dir != "rtl")) {
            options.dir = DEFAULT_OPTIONS.dir;
        }

        if (
            !options.style ||
            (options.style != "glass" &&
                options.style != "icons" &&
                options.style != "monochrome" &&
                options.style != "plain")
        ) {
            options.style = DEFAULT_OPTIONS.style;
        }

        return options;
    }
}

export function get_default_position(position?: ToastPosition): ToastPosition {
    const toast_container = $id("toast-container");
    const toast_position_x = toast_container.getAttribute("data-position-x") as
        | "left"
        | "center"
        | "right";
    const toast_position_y = toast_container.getAttribute("data-position-y") as
        | "bottom"
        | "top";

    if (!position) {
        return DEFAULT_POSITION;
    } else if (!position.x) {
        position.x = toast_position_x ?? DEFAULT_POSITION.x;
    } else if (!position.y) {
        position.y = toast_position_y ?? DEFAULT_POSITION.y;
    }

    return position;
}
