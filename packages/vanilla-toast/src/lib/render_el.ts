import { $create } from "./dom_helpers";

type Node<K extends keyof HTMLElementTagNameMap> = {
    type: K;
    attributes: Record<string, string>;
};

/** Renders an element you pass through.
 *  As of right now, there is no way to validate
 *  if an HTMLAttribute is valid,
 *  so do make sure to pass in valid values.
 */
export function render_el<K extends keyof HTMLElementTagNameMap>({
    type,
    attributes,
}: Node<K>): HTMLElement {
    const element = $create(type);

    for (const attribute_key in attributes) {
        element.setAttribute(attribute_key, attributes[attribute_key]);
    }

    return element;
}
