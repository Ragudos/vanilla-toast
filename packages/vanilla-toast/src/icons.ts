import type { LoadingIconTypes, ToastTypes } from "./types/toast-types";
import { create_element, create_svg } from "./render";

const DEFAULT_SVG_PROPERTIES = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    width: "20",
    height: "20",
    "stroke-width": "1.5",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    viewBox: "0 0 20 20",
    style: {
        width: "1rem",
        height: "1rem",
    },
};

export function warning_icon() {
    return create_svg({
        ...DEFAULT_SVG_PROPERTIES,
        d: "M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z",
    });
}

export function info_icon() {
    return create_svg({
        ...DEFAULT_SVG_PROPERTIES,
        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    });
}

export function success_icon() {
    return create_svg({
        ...DEFAULT_SVG_PROPERTIES,
        d: "M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z",
    });
}

export function error_icon() {
    return create_svg({
        ...DEFAULT_SVG_PROPERTIES,
        d: "M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z",
    });
}

export function close_icon() {
    return error_icon();
}

/** We use an image for loading icon for now
 *  since we have not implemented stuff for other svg tags yet.
 */
export function loading_icon(type: LoadingIconTypes = "normal") {
    const div = create_element("div", {
        style: {
            width: "100%",
            height: "100%",
        },
    });

    switch (type) {
        case "normal":
            import("./assets/rolling-spinner").then((module) => {
                div.innerHTML = module.rolling_spinner;
            });
            break;

        case "broken-flat":
            import("./assets/flat-broken-spinner").then((module) => {
                div.innerHTML = module.flat_broken_spinner;
            });
            break;

        case "broken-rounded":
            import("./assets/rounded-broken-spinner").then((module) => {
                div.innerHTML = module.rounded_broken_spinner;
            });
            break;

        case "broken-straight":
            import("./assets/straight-broken-spinner").then((module) => {
                div.innerHTML = module.straight_broken_spinner;
            });
            break;

        case "eclipse":
            import("./assets/eclipse_spinner").then((module) => {
                div.innerHTML = module.eclipse_spinner;
            });
            break;

        default:
            import("./assets/rolling-spinner").then((module) => {
                div.innerHTML = module.rolling_spinner;
            });
    }

    return div;
}

export function get_icon(
    type: Omit<ToastTypes, "neutral">,
    loader_type?: LoadingIconTypes,
) {
    switch (type) {
        case "error":
            return error_icon();

        case "info":
            return info_icon();

        case "loading":
            return loading_icon(loader_type);

        case "success":
            return success_icon();

        case "warn":
            return warning_icon();
    }
}
