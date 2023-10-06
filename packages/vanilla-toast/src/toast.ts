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
    DEFAULT_BOX_SHADOW_SIZE,
    DEFAULT_CLOSE_BUTTON_POSITION,
    DEFAULT_MAX_TOASTS_VISIBLE,
    timer_hashmaps,
    TOAST_POSITIONS,
} from "./consts";
import {
    $,
    $create,
    append_custom_icon_to_element,
    does_user_prefer_reduced_motion_query,
    dom_reflow,
    get_icon,
    init,
    toast_container,
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
    max_toasts_visible: number;
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
    const toast_holder = $create("ol");

    toast_holder.classList.add(style["toast-holder"]);
    toast_holder.id = "toast-holder";
    toast_holder.setAttribute(
        "data-max-toasts",
        options?.max_toasts_visible?.toString() ||
            DEFAULT_MAX_TOASTS_VISIBLE.toString(),
    );

    if (options?.stacked) {
        toast_holder.setAttribute("data-stacked", options?.stacked + "");
    }

    if (!toast_container) {
        const created_toast_container = $create("section");

        created_toast_container.classList.add(style["toast-container"]);
        created_toast_container.setAttribute(
            "aria-label",
            "Notifications. Press (Alt + T) to expand",
        );

        created_toast_container.append(toast_holder);
        document.body.append(created_toast_container);
    } else {
        toast_container.append(toast_holder);
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
    options?: Partial<ToastOptions>,
    type: ToastTypes = "neutral",
): ToastReturn {
    const toast_container = $("#toast-holder")!;

    if (!toast_container) {
        const error = new Error(
            "Toast container has not been mounted yet. Try calling initialize_toast() first.",
        );

        console.error(error);
        throw error;
    }

    if (type == "loading" && options?.close_button == true) {
        alert("A loading toast should not be manually closed.");
        console.error(
            new Error("A loading toast should not be manually closed."),
        );

        throw new Error("A loading toast should not be manually closed.");
    }

    if (options && options.close_button == undefined) {
        options.close_button = true;
    }

    const {
        animation_duration,
        duration,
        toast_id,
        icon_position,
        toast_position,
        importance,
        colors,
        animation,
        automatically_close,
    } = init(options, type);

    if (!toast_container.classList.contains("toast-" + toast_position)) {
        for (const pos of TOAST_POSITIONS) {
            toast_container.classList.remove("toast-" + pos);
        }
    }

    toast_container.classList.add("toast-" + toast_position);

    const { title, message } = props;
    const toast_card = $create("li");
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

    if (Boolean(options?.custom_icon) || type != "neutral") {
        toast_icon_container = $create("div");
        toast_icon_container.classList.add(style["toast-icon-container"]);

        if (options?.custom_icon) {
            append_custom_icon_to_element(
                toast_icon_container,
                options?.custom_icon,
            );

            if (typeof options?.custom_icon != "string") {
                options?.custom_icon.classList.add(style["toast-icon"]);
            }
        } else {
            import("./lib").then((module) => {
                const svg = module.get_icon(type);

                svg.classList.add(style["toast-icon"]);
                toast_icon_container?.append(svg);
            });
        }
    }

    toast_card.id = toast_id;
    toast_card.classList.add(style["toast-card"]);
    toast_card.setAttribute("role", "alert");
    toast_card.setAttribute("data-type", type);
    toast_card.setAttribute("aria-live", aria_live[importance]);
    toast_card.setAttribute("data-color-type", colors);

    if (options?.shadow_size) {
        import("./consts").then((module) => {
            toast_card.style.setProperty(
                "--toast-box-shadow",
                module.BOX_SHADOW_SIZES[
                    options?.shadow_size || DEFAULT_BOX_SHADOW_SIZE
                ],
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

    if (!options || options.close_button) {
        let handle_close_button_click: undefined | ((_e: MouseEvent) => void);

        toast_close_button = $create("button");

        if (options && typeof options.close_button != "boolean") {
            if (options.close_button?.appearance == "visible-on-hover") {
                toast_card.classList.add(
                    style["toast-card-close-button-hover"],
                );
            }

            if (options.close_button.custom_button?.on_click) {
                handle_close_button_click = function () {
                    if (typeof options?.close_button != "boolean") {
                        if (options?.close_button?.custom_button?.on_click) {
                            options?.close_button?.custom_button?.on_click(
                                toast_id,
                            );
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
                        (options?.close_button?.position ||
                            DEFAULT_CLOSE_BUTTON_POSITION)
                ],
            );

            if (options.close_button.type == "text") {
                toast_close_button.classList.add(
                    style["toast-close-button-text"],
                );
                toast_close_button.style.setProperty(
                    "--toast-close-button-border-radius",
                    "0.25rem",
                );
                toast_close_button.textContent =
                    options.close_button.text || "close";
            } else if (options.close_button?.type == "icon") {
                if (options.close_button.custom_icon) {
                    append_custom_icon_to_element(
                        toast_close_button,
                        options?.close_button?.custom_icon,
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

            if (options.close_button.custom_button?.className) {
                toast_close_button.className +=
                    " " + options.close_button.custom_button.className;
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
    } else {
        if (
            (typeof options?.close_button != "boolean" &&
                options?.close_button?.position == "inline") ||
            options?.close_button
        ) {
            toast_card.append(toast_close_button as HTMLButtonElement);
        }
    }

    toast_card.append(toast_text_container);

    if (type != "neutral" && icon_position == "right") {
        toast_card.append(toast_icon_container as Node);
        toast_text_container.style.textAlign = "right";
    } else {
        if (
            !options ||
            (typeof options?.close_button != "boolean" &&
                options?.close_button?.position == "inline") ||
            options?.close_button
        ) {
            toast_card.append(toast_close_button as HTMLButtonElement);
        }
    }

    toast_container.append(toast_card);
    hide_old_toasts();

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

function hide_old_toasts() {
    const toast_container = $("#toast-holder");
    const toast_children = toast_container.children;

    const max_toasts =
        +toast_container.getAttribute("data-max-toasts") ||
        DEFAULT_MAX_TOASTS_VISIBLE;

    if (toast_children.length >= max_toasts) {
        const latest_old_toast = $(
            "[data-latest-old-toast='true']",
        ) as HTMLElement;

        let new_latest_old_toast =
            latest_old_toast?.nextElementSibling as HTMLElement;

        if (!latest_old_toast) {
            new_latest_old_toast = toast_children[0] as HTMLElement;
        }

        if (latest_old_toast) {
            latest_old_toast.removeAttribute("data-latest-old-toast");
            latest_old_toast.setAttribute("aria-hidden", "true");
            latest_old_toast.style.setProperty(
                "--toast-animation-direction",
                "reverse",
            );
            latest_old_toast.style.setProperty(
                "--toast-animation-fill-mode",
                "forwards",
            );

            const animation_duration = latest_old_toast.style.getPropertyValue(
                "--toast-animation-duration",
            );

            setTimeout(() => {
                latest_old_toast.style.position = "absolute";
            }, +animation_duration.split("ms")[0]);

            dom_reflow(latest_old_toast);
        }

        new_latest_old_toast.setAttribute("data-latest-old-toast", "true");
    }
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
