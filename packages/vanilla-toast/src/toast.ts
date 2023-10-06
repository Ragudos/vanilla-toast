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
    timer_hashmaps,
} from "./consts";
import {
    $,
    $create,
    append_custom_icon_to_element,
    does_user_prefer_reduced_motion,
    init,
    toast_container,
} from "./lib";

import style from "./styles/style.module.css";

type AriaLive = "off" | "polite" | "assertive";

const toast_holder = $create("div");

toast_holder.classList.add(style["toast-holder"]);
toast_holder.id = "toast-holder";

const aria_live: {
    [Properties in ToastImportance]: AriaLive;
} = {
    "not important": "off",
    important: "polite",
    critical: "assertive",
};

window.addEventListener("DOMContentLoaded", () => {
    if (!toast_container) {
        const created_toast_container = $create("div");

        created_toast_container.classList.add(style["toast-container"]);
        created_toast_container.setAttribute(
            "aria-label",
            "The main container for toast notifications.",
        );

        created_toast_container.append(toast_holder);
        document.body.append(created_toast_container);
    } else {
        toast_container.append(toast_holder);
    }
});

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
    const toast_container = $("#toast-holder")!;

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

    if (!does_user_prefer_reduced_motion) {
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
            toast_card.classList.add(module.default["toast-card"]);
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

    if (options?.close_button && type != "loading") {
        let handle_close_button_click: undefined | ((_e: MouseEvent) => void);

        toast_close_button = $create("button");

        if (typeof options.close_button != "boolean") {
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
                    import("./lib").then((module) => {
                        const svg = module.get_icon("close");

                        svg.classList.add(style["toast-icon"]);
                        toast_close_button?.append(svg);
                    });
                }
            } else {
                import("./lib").then((module) => {
                    const svg = module.get_icon("close");

                    svg.classList.add(style["toast-icon"]);
                    toast_close_button?.append(svg);
                });
            }

            if (options.close_button.custom_button?.className) {
                toast_close_button.className +=
                    " " + options.close_button.custom_button.className;
            }
        } else {
            handle_close_button_click = function () {
                toast.dismiss(toast_id);
            };

            import("./lib").then((module) => {
                const svg = module.get_icon("close");

                svg.classList.add(style["toast-icon"]);
                toast_close_button?.append(svg);
            });

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

        const aborter = new AbortController();

        close_button_aborters_hashmaps.set(toast_id, aborter);

        if (handle_close_button_click) {
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

    if (!toast_close_button && options?.close_button) {
        throw new Error(
            `Failed on creating a close button when it's specified for the toast instance with an id of ${toast_id} to have one!`,
        );
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
            (typeof options?.close_button != "boolean" &&
                options?.close_button?.position == "inline") ||
            options?.close_button
        ) {
            toast_card.append(toast_close_button as HTMLButtonElement);
        }
    }

    toast_container.append(toast_card);

    if (type != "loading" && automatically_close == true) {
        const timeout = setTimeout(
            () => {
                toast.dismiss(toast_id as string);
            },
            does_user_prefer_reduced_motion
                ? duration
                : duration - animation_duration?.out,
        );

        timer_hashmaps.set(toast_id, timeout);
    }

    return { toast_id } as { toast_id: string };
}
