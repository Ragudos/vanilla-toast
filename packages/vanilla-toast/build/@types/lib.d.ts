import type { ToastImportance, ToastTypes } from ".";
/**
 * ## Query Selector
 * A shorthand for:
 *
 * ```ts
 * document.querySelector(HTMLElement)
 * ```
 */
export declare const $: {
    <K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K];
    <K_1 extends keyof SVGElementTagNameMap>(selectors: K_1): SVGElementTagNameMap[K_1];
    <K_2 extends keyof MathMLElementTagNameMap>(selectors: K_2): MathMLElementTagNameMap[K_2];
    <K_3 extends keyof HTMLElementDeprecatedTagNameMap>(selectors: K_3): HTMLElementDeprecatedTagNameMap[K_3];
    <E extends Element = Element>(selectors: string): E;
};
/**
 * ## Element Creator
 * A shorthand for:
 *
 * ```ts
 * document.createElement(HTMLElement)
 * ```
 */
export declare const $create: {
    <K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
    <K_1 extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K_1, options?: ElementCreationOptions): HTMLElementDeprecatedTagNameMap[K_1];
    (tagName: string, options?: ElementCreationOptions): HTMLElement;
};
export declare const toast_container: HTMLElement;
/**
 * ## gen_random_id()
 * Synchronously generates a random id using Math.random along a string of alphanumericals using a for loop.
 * If a Math.random() in an if statement is < 0.5, then this turns the current acquired character
 * to uppercase.
 */
export declare function gen_random_id(length?: number): string;
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
export declare function get_icon(type: ToastTypes): HTMLElement | SVGSVGElement;
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
export declare function get_importance(type: ToastTypes): ToastImportance;
export declare let does_user_prefer_reduced_motion: boolean;
