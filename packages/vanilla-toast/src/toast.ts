import {
    toast,
    type ToastImportance,
    type ToastOptions,
    type ToastProps,
    type ToastReturn,
    type ToastTypes,
} from ".";
import {
    close_button_aborters_hashmaps,
    DEFAULT_ANIMATION,
    DEFAULT_ANIMATION_DURATION,
    DEFAULT_BOX_SHADOW_SIZE,
    DEFAULT_CLOSE_BUTTON_POSITION,
    DEFAULT_COLORS,
    DEFAULT_DURATION,
    DEFAULT_ICON_POSITION,
    DEFAULT_MAX_TOASTS_VISIBLE,
    DEFAULT_TOAST_POSITION,
    timer_hashmaps,
    TOAST_POSITIONS,
} from "./consts";
import {
    $,
    $create,
    append_custom_icon_to_element,
    does_user_prefer_reduced_motion_query,
    gen_random_id,
    get_icon,
    toast_container,
    toast_status,
} from "./lib";

import style from "./styles/style.module.css";

type AriaLive = "off" | "polite" | "assertive";

/**
 * ## Toast Container Options
 * The options you want to pass to the toast container. These will be applied
 * when you load the toast container.
 */
export type ToastContainerOptions = {
    /**
     * Whether toasts should be stacked or not.
     *
     * If they are, then new toasts will sit on top of the previous toast. This
     * is great to not clutter the screen.
     *
     * If this is enabled, then toasts can be expanded by the shortcut Alt + T,
     * or by hovering over the toasts.
     *
     * @default
     *
     * false
     */
    stacked?: boolean;

    /**
     * The max amount of toasts visible. This sets the toast container to
     * hide overflows.
     *
     * Note that if you pass in 0, the default amount will be applied.
     *
     * @default
     *
     * 3
     */
    max_toasts_visible?: number;

    /**
     * If you want to hide overflowing toasts. This can only
     * be set on initialization.
     */
    hide_overflow_toast?: boolean;

    /**
     * The offset of the toast container. This determines the amount of padding or
     * space the edges of the toasts from the edges of its parent container will have.
     * You can also set this via the CSS properties. By default, the CSS property
     * is == to 95% to the viewport&apos;s dimensions;
     *
     * - --toast-container-width
     * - --toast-container-height
     *
     * @default
     *
     * "95% of its container
     */
    container_offset?: number;
};

const aria_live: {
    [Properties in ToastImportance]: AriaLive;
} = {
    "not important": "off",
    important: "polite",
    critical: "assertive",
};

/**
 * ## Initialize toast
 * @param options
 */
export function initialize_toast(options?: ToastContainerOptions) {
    if (document.getElementById("toast-holder")) {
        return;
    }

    let toast_main_container = toast_container;

    if (!toast_container) {
        toast_main_container = $create("section");
    }

    const toast_holder = $create("div");

    toast_holder.classList.add(style["toast-holder"]);
    toast_holder.id = "toast-holder";
    toast_holder.setAttribute(
        "data-max-toasts",
        options?.max_toasts_visible?.toString() ||
            DEFAULT_MAX_TOASTS_VISIBLE.toString(),
    );
    toast_holder.setAttribute("data-testid", "toast-holder");
    toast_main_container.title = "Notifications";

    if (options?.stacked) {
        toast_main_container.setAttribute("aria-label", "Notifications");
        toast_holder.setAttribute("data-stacked", options?.stacked + "");
    }

    if (options?.hide_overflow_toast) {
        toast_holder.setAttribute("data-hide-overflow-toast", "true");
    }

    if (options?.container_offset != undefined) {
        toast_main_container.style.width = `calc(100% - ${options.container_offset}px)`;
        toast_main_container.style.height = `calc(100% - ${options.container_offset}px)`;
    }

    toast_main_container.classList.add(style["toast-container"]);
    toast_main_container.append(toast_holder);

    if (!toast_container) {
        document.body.append(toast_main_container);
    }
}

/**
 * ## Show toast
 * The main engine of this overall library. This handles toast creation.
 *
 * @param props {ToastProps} This is where you pass in the toast's message and an optional title.
 * @param options {Partial<ToastOptions>} Contains options to customize the toast.
 * @param type {ToastTypes} Specifies what kind of toast this is, and styles and/or performs methods based on the type.
 * @returns {ToastReturn} { toast_id }
 */
export function show_toast(
    props: ToastProps,
    {
        animation = DEFAULT_ANIMATION,
        close_button = true,
        toast_position = DEFAULT_TOAST_POSITION,
        toast_id = undefined,
        custom_icon = undefined,
        importance = "not important",
        icon_position = DEFAULT_ICON_POSITION,
        animation_duration = {
            in: DEFAULT_ANIMATION_DURATION,
            out: DEFAULT_ANIMATION_DURATION,
        },
        shadow_size = DEFAULT_BOX_SHADOW_SIZE,
        automatically_close = true,
        dir = "ltr",
        colors = DEFAULT_COLORS,
        duration = DEFAULT_DURATION,
    }: Partial<ToastOptions> = {
        animation: DEFAULT_ANIMATION,
        close_button: true,
        toast_position: DEFAULT_TOAST_POSITION,
        toast_id: undefined,
        custom_icon: undefined,
        animation_duration: {
            in: DEFAULT_ANIMATION_DURATION,
            out: DEFAULT_ANIMATION_DURATION,
        },
        icon_position: DEFAULT_ICON_POSITION,
        importance: "not important",
        shadow_size: undefined,
        automatically_close: true,
        dir: "ltr",
        colors: DEFAULT_COLORS,
        duration: DEFAULT_DURATION,
    },
    type: ToastTypes = "neutral",
): ToastReturn {
    const toast_container = $("#toast-holder")! as HTMLElement;

    if (!toast_container) {
        const error = new Error(
            "Toast container has not been mounted yet. Try calling initialize_toast() first.",
        );

        alert(error);
        console.error(error);
        throw error;
    }

    if (type == "loading" && close_button == true) {
        alert("A loading toast should not be manually closed.");
        console.error(
            new Error("A loading toast should not be manually closed."),
        );

        throw new Error("A loading toast should not be manually closed.");
    }

    if (!toast_container.classList.contains("toast-" + toast_position)) {
        for (const pos of TOAST_POSITIONS) {
            toast_container.classList.remove("toast-" + pos);
        }
    }

    if (!toast_id) {
        toast_id = gen_random_id();
    }

    toast_container.classList.add("toast-" + toast_position);

    const { title, message } = props;
    const toast_card = $create("div");
    const toast_text_container = $create("div");
    const toast_message = $create("p");

    let toast_title: undefined | HTMLDivElement;
    let toast_icon_container: undefined | HTMLDivElement;
    let toast_close_button: undefined | HTMLButtonElement;

    if (title) {
        toast_title = $create("div");
        toast_title.setAttribute(
            "aria-label",
            "The title of toast #" + toast_id,
        );
        toast_title.id = "toast-" + toast_id + "-title";
        toast_title.textContent = title;
    }

    if (Boolean(custom_icon) || type != "neutral") {
        toast_icon_container = $create("div");
        toast_icon_container.classList.add(style["toast-icon-container"]);

        if (custom_icon) {
            append_custom_icon_to_element(toast_icon_container, custom_icon);

            if (typeof custom_icon != "string") {
                custom_icon.classList.add(style["toast-icon"]);
            }
        } else {
            const svg = get_icon(type);

            svg.classList.add(style["toast-icon"]);
            toast_icon_container?.append(svg);
        }
    }

    toast_card.id = toast_id;
    toast_card.classList.add(style["toast-card"]);
    toast_card.setAttribute("data-vanilla-toast", "true");
    toast_status(toast_card, type);
    toast_card.setAttribute("aria-atomic", "true");
    toast_card.setAttribute("data-type", type);
    toast_card.setAttribute("aria-live", aria_live[importance]);
    toast_card.setAttribute("data-color-type", colors);
    toast_card.setAttribute("dir", dir);

    if (shadow_size) {
        import("./consts").then((module) => {
            toast_card.style.setProperty(
                "--toast-box-shadow",
                module.BOX_SHADOW_SIZES[shadow_size || DEFAULT_BOX_SHADOW_SIZE],
            );
        });
    }

    if (!does_user_prefer_reduced_motion_query.matches) {
        toast_card.setAttribute(
            "data-exit-animation-duration",
            animation_duration?.out?.toString(),
        );
        toast_card.style.setProperty(
            "--toast-animation-duration",
            animation_duration?.in + "ms",
        );
    }

    toast_card.style.setProperty("--toast-animation", animation);

    if (colors == "icon" || colors == "icon-stroke") {
        import("./styles/dynamic/icon.module.css").then((module) => {
            const toast_card_class_name = "toast-card";

            toast_card.classList.add(module.default[toast_card_class_name]);
        });
    }

    toast_text_container.classList.add(style["toast-text-container"]);

    toast_message.id = "toast-" + toast_id + "-message";
    toast_message.textContent = message;
    toast_message.setAttribute(
        "aria-label",
        "The message of toast #" + toast_id,
    );

    if (toast_title) {
        toast_text_container.append(toast_title);
    }

    toast_card.setAttribute(
        "aria-labelledby",
        toast_title ? toast_title.id : toast_message.id,
    );

    toast_text_container.append(toast_message);

    if (type != "loading" && close_button) {
        let handle_close_button_click: undefined | ((_e: MouseEvent) => void);

        toast_close_button = $create("button");

        if (typeof close_button != "boolean") {
            if (close_button?.appearance == "visible-on-hover") {
                toast_card.classList.add(
                    style["toast-card-close-button-hover"],
                );
            }

            if (close_button.custom_button?.on_click) {
                handle_close_button_click = function () {
                    if (typeof close_button != "boolean") {
                        if (close_button?.custom_button?.on_click) {
                            close_button?.custom_button?.on_click(toast_id);
                        }
                    }

                    toast.dismiss(toast_id);
                };
            } else {
                handle_close_button_click = function () {
                    toast.dismiss(toast_id);
                };
            }

            toast_close_button.classList.add(
                style[
                    "toast-close-button-" +
                        (close_button?.position ||
                            DEFAULT_CLOSE_BUTTON_POSITION)
                ],
            );

            if (close_button.type == "text") {
                toast_close_button.classList.add(
                    style["toast-close-button-text"],
                );
                toast_close_button.style.setProperty(
                    "--toast-close-button-border-radius",
                    "0.25rem",
                );
                toast_close_button.textContent = close_button?.text || "close";
            } else if (close_button?.type == "icon") {
                if (close_button.custom_icon) {
                    append_custom_icon_to_element(
                        toast_close_button,
                        close_button?.custom_icon,
                    );
                } else {
                    const svg = get_icon("close");

                    svg.classList.add(style["toast-icon"]);
                    toast_close_button?.append(svg);
                }
            } else {
                const svg = get_icon("close");

                svg.classList.add(style["toast-icon"]);
                toast_close_button?.append(svg);
            }

            if (close_button?.custom_button?.className) {
                toast_close_button.className +=
                    " " + close_button.custom_button.className;
            }
        } else {
            handle_close_button_click = function () {
                toast.dismiss(toast_id);
            };
            const svg = get_icon("close");

            svg.classList.add(style["toast-icon"]);
            toast_close_button?.append(svg);

            toast_close_button.classList.add(
                style["toast-close-button-" + DEFAULT_CLOSE_BUTTON_POSITION],
            );
        }

        if (
            typeof close_button != "boolean" &&
            close_button.position == "inline-top"
        ) {
            toast_close_button.classList.add("toast-close-button-inline-top");
        }

        toast_close_button.setAttribute(
            "aria-label",
            "Close toast #" + toast_id,
        );
        toast_close_button.classList.add(style["toast-close-button"]);
        toast_close_button.setAttribute("type", "button");
        toast_close_button.setAttribute("aria-controls", toast_id);
        toast_close_button.tabIndex = -1;

        if (handle_close_button_click) {
            const aborter = new AbortController();

            close_button_aborters_hashmaps.set(toast_id, aborter);
            toast_close_button.addEventListener(
                "click",
                handle_close_button_click,
                {
                    signal: aborter.signal,
                    once: true,
                },
            );
        } else {
            console.error(
                "Function to invoke for a close button does not exist!",
            );
        }
    }

    if (type != "neutral" && icon_position == "left") {
        toast_card.append(toast_icon_container as Node);
    } else if (type != "loading") {
        if (
            (typeof close_button != "boolean" &&
                (close_button?.position == "inline" ||
                    close_button?.position == "inline-top")) ||
            close_button
        ) {
            toast_card.append(toast_close_button as HTMLButtonElement);
        }
    }

    toast_card.append(toast_text_container);

    if (type != "neutral" && icon_position == "right") {
        toast_card.append(toast_icon_container as Node);
        toast_text_container.style.textAlign = "right";
    } else if (type != "loading") {
        if (
            (typeof close_button != "boolean" &&
                (close_button?.position == "inline" ||
                    close_button?.position == "inline-top")) ||
            close_button
        ) {
            toast_card.append(toast_close_button as HTMLButtonElement);
        }
    }

    if (
        toast_position == "bottom-center" ||
        toast_position == "bottom-left" ||
        toast_position == "bottom-right"
    ) {
        toast_container.style.flexDirection = "column";
    }

    toast_container.append(toast_card);

    if (toast_container.getAttribute("data-hide-overflow-toasts") == "true") {
        import("./hide-toast").then((module) => {
            module.hide_old_toasts();
        });
    }

    // if (options?.close_on_swipe) {
    //     toast_card.addEventListener("pointermove", (e) => {
    //         if (toast_card.getAttribute("data-swipe") == "true") {
    //             const rect = toast_card.getBoundingClientRect();

    //             console.log(rect);

    //             const x = e.clientX;
    //             const y = e.clientY;

    //             console.log(e);
    //         }
    //     });

    //     toast_card.addEventListener("pointerdown", () => {
    //         toast_card.setAttribute("data-swipe", "true");
    //     });

    //     toast_card.addEventListener("pointerup", () => {
    //         console.log("released!");
    //         toast_card.setAttribute("data-swipe", "false");
    //     });
    // }

    if (type != "loading" && automatically_close == true) {
        const timeout = setTimeout(
            () => {
                toast.dismiss(toast_id as string);
            },
            does_user_prefer_reduced_motion_query.matches
                ? duration
                : duration - animation_duration?.out,
        );

        timer_hashmaps.set(toast_id, timeout);
    }

    return { toast_id } as { toast_id: string };
}

// FOR FUTURE FEATURE, DRAGGABLE TOAST
// function toast_draggable(toast_card: HTMLElement) {
//     const toast_container = $("#toast-holder");

//     toast_card.draggable = true;

//     toast_card.addEventListener("dragend", (e) => {
//         toast_card.style.zIndex = "30";
//         toast_card.style.position = "fixed";

//         const rect = toast_card.getBoundingClientRect();
//         const container_width = toast_container.getBoundingClientRect().width;

//         toast_card.style.width = container_width + "px";

//         const x = e.pageX;
//         const y = e.pageY;

//         toast_card.style.left = `${x - rect.width / 2}px`;
//         toast_card.style.top = `${y - rect.height / 2}px`;
//     });
// }
