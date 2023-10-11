import type {
    ToastOptions,
    ToastPosition,
    ToastTypes,
} from "../types/toast-types";

export const DEFAULT_POSITION: ToastPosition = {
    x: "right",
    y: "top",
};

const DEFAULT_OPTIONS: ToastOptions = {
    loading_icon: "eclipse",
    dir: get_dir(),
    role: "status",
    importance: "important",
    lifetime: 5000,
    animation_duration: 300,
    automatically_close: true,
    close_button: {
        is_shown_on_hover: true,
        position: "right",
    },
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
        : "ltr";
}

/** Responsible for mapping the options of a toast
 *  so that we don't have to do null coalescing and fallback applications
 *  and such all around the codebase.
 */
export function get_default(
    type: ToastTypes,
    options?: ToastOptions,
): ToastOptions {
    if (!options) {
        return DEFAULT_OPTIONS;
    } else {
        if (!options.lifetime || options.lifetime <= 0) {
            options.lifetime = DEFAULT_OPTIONS.lifetime;
        }

        if (!options.loading_icon) {
            options.loading_icon = "eclipse";
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
            if (
                type == "error" ||
                type == "loading" ||
                type == "success" ||
                type == "warn"
            ) {
                options.importance = "critical";
            } else {
                options.importance = "important";
            }
        }

        if (!options.role) {
            if (
                type == "error" ||
                type == "loading" ||
                type == "success" ||
                type == "warn"
            ) {
                options.role = "alert";
            } else {
                options.role = "status";
            }
        }

        if (options.automatically_close == undefined && type != "loading") {
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
