import { $create, $create_ns } from "./lib/dom_helpers";

/** I don't know how to parse
 *  camelCase to lowercase yet so here we are.
 *
 *  I mean, I can do a loop and such but it's not
 *  necessary right now and I want something that's not a loop
 *  if possible.
 */
type Properties = {
    [key in
        | keyof HTMLElement
        | `data-${string}`
        | `aria-${string}`
        | keyof HTMLButtonElement]?:
        | string
        | number
        | null
        | undefined
        | boolean
        | Record<string, string>;
};

interface EntityMapData {
    [key: string]: string;
}

export const entityMap: EntityMapData = {
    "&": "amp",
    "<": "lt",
    ">": "gt",
    '"': "quot",
    "'": "#39",
    "/": "#x2F",
};

function non_nullish<T>(
    val: undefined | null | T,
    fallback: T | Record<string, never>,
): T | Record<string, never> {
    return val != null && val != undefined ? val : fallback;
}

export const escapeHtml = (str: object[] | string): keyof HTMLElement => {
    return String(str).replace(
        /[&<>"'/\\]/g,
        (s) => `&${entityMap[s]};`,
    ) as unknown as keyof HTMLElement;
};

export function create_element(
    tag_name: keyof HTMLElementTagNameMap,
    properties: Properties | null,
) {
    const element = $create(tag_name);

    for (const [key, val] of Object.entries(non_nullish(properties, {}))) {
        if (key == "style") {
            for (const [key, value] of Object.entries(
                val as Record<string, string>,
            )) {
                element.style.setProperty(key, value);
            }
        } else if (key == "textContent") {
            element.appendChild(document.createTextNode(val.toString()));
        } else if (val == true) {
            element.setAttribute(key, "true");
        } else if (val != false && val != null) {
            if (typeof val == "string") {
                element.setAttribute(key, escapeHtml(val));
            }
        } else if (val == false) {
            element.removeAttribute(key);
        }
    }

    return element;
}

export function create_svg(
    props: Record<string, string | Record<string, string>>,
) {
    const svg = $create_ns("http://www.w3.org/2000/svg", "svg");
    const path = $create_ns("http://www.w3.org/2000/svg", "path");

    for (const [key, value] of Object.entries(non_nullish(props, {}))) {
        if (key == "d") {
            path.setAttribute(key, value.toString());
        } else if (key == "style") {
            for (const [key, css_value] of Object.entries(
                non_nullish(value, {}),
            )) {
                svg.style[key] = css_value;
            }
        } else {
            svg.setAttribute(key, value.toString());
        }
    }

    svg.appendChild(path);

    return svg;
}
