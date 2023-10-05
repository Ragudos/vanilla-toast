import {
    toast,
    ToastAnimations,
    type ToastColor,
    type ToastImportance,
    type ToastOptions,
    type ToastProps,
    type ToastReturn,
    type ToastTypes,
} from ".";
import {
    DEFAULT_ANIMATION,
    DEFAULT_ANIMATION_DURATION,
    DEFAULT_COLORS,
    DEFAULT_DURATION,
    DEFAULT_ICON_POSITION,
    DEFAULT_TOAST_POSITION,
    timer_hashmaps,
} from "./consts";
import {
    $,
    $create,
    does_user_prefer_reduced_motion,
    gen_random_id,
    get_icon,
    get_importance,
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

function init(options?: Partial<ToastOptions>, type: ToastTypes = "neutral") {
    let toast_container_provided_duration: number;

    if (toast_container) {
        toast_container_provided_duration =
            +toast_container.getAttribute("data-duration")!;
    } else {
        toast_container_provided_duration = +$("#toast-container")!;
    }

    let enter_animation_duration: number;
    let exit_animation_duration: number;
    let duration: number;
    let toast_id: string;
    let importance: ToastImportance;
    let color: ToastColor;
    let animation: ToastAnimations;

    if (options) {
        duration =
            options?.duration ||
            toast_container_provided_duration ||
            DEFAULT_DURATION;
        toast_id = options?.toast_id || gen_random_id();
        enter_animation_duration =
            options?.animation_duration?.in || DEFAULT_ANIMATION_DURATION;
        exit_animation_duration =
            options?.animation_duration?.out || DEFAULT_ANIMATION_DURATION;
        color = options?.colors || DEFAULT_COLORS;
        importance = options?.importance || get_importance(type);
        animation = options?.animation || DEFAULT_ANIMATION;
    } else {
        duration = toast_container_provided_duration || DEFAULT_DURATION;
        toast_id = gen_random_id();
        enter_animation_duration = DEFAULT_ANIMATION_DURATION;
        exit_animation_duration = DEFAULT_ANIMATION_DURATION;
        color = DEFAULT_COLORS;
        importance = get_importance(type);
        animation = DEFAULT_ANIMATION;
    }

    return {
        animation_duration: {
            in: enter_animation_duration,
            out: exit_animation_duration,
        },
        duration,
        toast_id,
        icon_position: options?.icon_position || DEFAULT_ICON_POSITION,
        toast_position: options?.toast_position || DEFAULT_TOAST_POSITION,
        importance,
        colors: color,
        animation,
    };
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
    if (type == "loading" && options?.close_button == true) {
        alert("A loading toast should not be manually closed.");
        console.error(
            new Error("A loading toast should not be manually closed."),
        );

        throw new Error("A loading toast should not be manually closed.");
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
    } = init(options, type);

    const toast_container = $("#toast-holder")!;

    toast_container.classList.add("toast-" + toast_position);

    const { title, message } = props;

    const toast_card = $create("div");
    const toast_text_container = $create("div");
    const toast_message = $create("p");

    let toast_title: undefined | HTMLDivElement;
    let toast_icon_container: undefined | HTMLDivElement;

    if (title) {
        toast_title = $create("div");
        toast_title.setAttribute(
            "aria-label",
            "The title of toast #" + toast_id,
        );
        toast_title.id = "toast-" + toast_id + "-title";
        toast_title.textContent = title;
    }

    if (options?.custom_icon || type != "neutral") {
        toast_icon_container = $create("div");
        toast_icon_container.classList.add(style["toast-icon-container"]);

        if (options?.custom_icon) {
            if (typeof options.custom_icon == "string") {
                toast_icon_container.innerHTML = options.custom_icon;
            } else if (
                options?.custom_icon instanceof HTMLElement ||
                options?.custom_icon instanceof SVGElement
            ) {
                options?.custom_icon.classList.add(style["toast-icon"]);
                toast_icon_container.append(options.custom_icon);
            }
        } else {
            const svg = get_icon(type);

            svg.classList.add(style["toast-icon"]);
            toast_icon_container.append(svg);
        }
    }

    toast_card.id = toast_id;
    toast_card.classList.add(style["toast-card"]);
    toast_card.setAttribute("role", "alert");
    toast_card.setAttribute("data-type", type);
    toast_card.setAttribute("aria-live", aria_live[importance]);
    toast_card.setAttribute("data-color-type", colors);

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

    if (type != "neutral" && icon_position == "left") {
        toast_card.append(toast_icon_container as Node);
    }

    toast_card.append(toast_text_container);

    if (type != "neutral" && icon_position == "right") {
        toast_card.append(toast_icon_container as Node);
        toast_text_container.style.textAlign = "right";
    }

    toast_container.append(toast_card);

    const timeout = setTimeout(
        () => {
            console.log(toast_id);
            toast.dismiss(toast_id as string);
        },
        does_user_prefer_reduced_motion
            ? duration
            : duration - animation_duration?.out,
    );

    timer_hashmaps.set(toast_id, timeout);

    return { toast_id } as { toast_id: string };
}
