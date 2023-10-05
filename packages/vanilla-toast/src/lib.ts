import type { ToastImportance, ToastTypes } from ".";

/**
 * ## Query Selector
 * A shorthand for:
 *
 * ```ts
 * document.querySelector(HTMLElement)
 * ```
 */
export const $ = document.querySelector.bind(
    document,
) as typeof document.querySelector;

/**
 * ## Element Creator
 * A shorthand for:
 *
 * ```ts
 * document.createElement(HTMLElement)
 * ```
 */
export const $create = document.createElement.bind(
    document,
) as typeof document.createElement;

export const toast_container = document.getElementById("toast-container");

const MAX_ID_LENGTH = 16;
const MIN_ID_LENGTH = 6;
const alpha_numericals = "abcdefghijklmnopqrstuvwxyz0123456789";

/**
 * ## gen_random_id()
 * Synchronously generates a random id using Math.random along a string of alphanumericals using a for loop.
 * If a Math.random() in an if statement is < 0.5, then this turns the current acquired character
 * to uppercase.
 */
export function gen_random_id(length: number = 8) {
    if (length < MIN_ID_LENGTH) {
        throw new Error(
            "Please provide a string length that's greater than " +
                MIN_ID_LENGTH,
        );
    } else if (length > MAX_ID_LENGTH) {
        throw new Error(
            "Please provide a string length that's less than " + MAX_ID_LENGTH,
        );
    }

    let str = "";

    for (let idx = 0; idx < length; ++idx) {
        const random = Math.floor(
            Math.random() * (alpha_numericals.length - 1),
        );

        if (Math.random() < 0.5) {
            str += alpha_numericals[random].toUpperCase();
        } else {
            str += alpha_numericals[random];
        }
    }

    return str;
}

/**
 *  ## get_icon()
 *
 *  A static icon generator to clean up the code a little bit.
 *  Uses document.createElement JS function and append() instead of innerHTML.
 *
 * Icons are from HeroIcons
 *
 *  @see https://heroicons.com/
 *
 */
export function get_icon(type: ToastTypes): HTMLElement | SVGSVGElement {
    if (type == "loading") {
        const loader = document.createElement("div");

        loader.classList.add("spin", "toast-loading");
        loader.style.width = "14px";
        loader.style.height = "14px";

        return loader;
    } else {
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg",
        );
        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path",
        );

        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("fill", "none");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("stroke-width", "1.5");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("width", "16");
        svg.setAttribute("height", "16");

        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");

        if (type == "success") {
            path.setAttribute(
                "d",
                "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            );
        } else if (type == "error") {
            path.setAttribute(
                "d",
                "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            );
        } else if (type == "info") {
            path.setAttribute(
                "d",
                "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
            );
        } else if (type == "warn") {
            path.setAttribute(
                "d",
                "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
            );
        }

        svg.append(path);

        return svg;
    }
}

/**
 * ## get_importance
 *
 * @param type {ToastTypes}
 * @returns A mapped value of aria-live attribute value. Namely:
 *
 * - "not important" == "off"
 * - "important" == "polite"
 * - "critical" == "assertive"
 */
export function get_importance(type: ToastTypes): ToastImportance {
    let importance: ToastImportance;

    if (type == "error" || type == "success" || type == "warn") {
        importance = "critical";
    } else if (type == "loading" || type == "neutral") {
        importance = "not important";
    } else {
        importance = "important";
    }

    return importance;
}

const does_user_prefer_reduced_motion_query = window.matchMedia(
    "('prefers-reduced-motion')",
);

export let does_user_prefer_reduced_motion =
    does_user_prefer_reduced_motion_query.matches;

does_user_prefer_reduced_motion_query.addEventListener("change", (e) => {
    does_user_prefer_reduced_motion = e.matches;
});
