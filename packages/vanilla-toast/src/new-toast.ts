/** IGNORE FOR NOW. TRYING TO MAKE TOASTS SMOOTH.
 *
 *  NEED TO PROPERLY CALCULATE SPACES, SPECIALLY IF TOASTS HAVE DIFFERENT HEIGHTS.
 */

import "./styles/var.css";
import {
    ToastImportance,
    ToastPositions,
    ToastProps,
    ToastTypes,
    toast,
} from ".";
import {
    $,
    $create,
    does_user_prefer_reduced_motion,
    gen_random_id,
    get_icon,
} from "./lib";

type ToastOptions = {
    dir?: "ltr" | "rtl";
    animation_duration?: {
        in?: number;
        out?: number;
    };
    type?: ToastTypes;
    importance?: ToastImportance;
    animation_timing_function?:
        | "ease-in-out"
        | "ease-out"
        | "ease-in"
        | "linear"
        | `cubic-beizer(${number}, ${number}, ${number}, ${number})`;
};

const toast_container = $("#toast-holder") as HTMLElement;

toast_container.addEventListener("pointerenter", () => {
    toast_container.setAttribute("data-expanded", "true");
});

toast_container.addEventListener("pointerleave", () => {
    toast_container.setAttribute("data-expanded", "false");
});

const DEFAULT_GAP = 16;
const DEFAULT_MAX_TOASTS_VISIBLE = 3;
const DEFAULT_TOAST_POSITION: ToastPositions = "bottom-right";
const DEFAULT_TOAST_ANIMATION = "slide";

const hashmap_of_timers = new Map<string, number>();
const hashmap_of_event_aborters = new Map<string, AbortController>();

const TOAST_IMPORTANCE: {
    [Properties in ToastImportance]: "off" | "polite" | "assertive";
} = {
    critical: "assertive",
    important: "polite",
    "not important": "off",
} as const;

const DEFAULT_ANIMATION_DURATION = {
    in: 400,
    out: 400,
};

export function get_toast_direction(position: ToastPositions): "b" | "t" {
    if (
        position == "bottom-center" ||
        position == "bottom-left" ||
        position == "bottom-right"
    ) {
        return "b";
    } else {
        return "t";
    }
}

export function toast_transitions(
    toast_card: HTMLElement,
    {
        animation,
    }: {
        animation: "slide" | "popdown";
    },
) {
    toast_card.style.setProperty("--toast-offset", "-100%");
    toast_card.style.setProperty("--toast-opacity", "0");

    if (animation == "popdown") {
        toast_card.style.setProperty("--toast-scale", "0");
    }
}

export function toast_status(toast_card: HTMLElement, toast_type: ToastTypes) {
    if (
        toast_type == "loading" ||
        toast_type == "success" ||
        toast_type == "warn" ||
        toast_type == "error"
    ) {
        toast_card.setAttribute("role", "alert");
    } else {
        toast_card.setAttribute("role", "status");
    }
}

export function hide_overflowing_toasts_on_new_toast(
    max_toasts_visible: number,
) {
    const existing_visible_toasts = document.querySelectorAll(
        "[data-visible-toast='true']",
    );

    if (existing_visible_toasts.length == max_toasts_visible) {
        const oldest_existing_toast = existing_visible_toasts[0] as HTMLElement;
        const latest_old_toast = existing_visible_toasts[
            existing_visible_toasts.length - 1
        ] as HTMLElement;

        if (oldest_existing_toast.getAttribute("data-animation") == "popdown") {
            const height = oldest_existing_toast.getBoundingClientRect().height;

            if (height) {
                oldest_existing_toast.style.setProperty(
                    "--toast-height",
                    height + "",
                );
            }

            oldest_existing_toast.style.setProperty("--toast-scale", "0");
        }

        oldest_existing_toast.style.setProperty("--toast-opacity", "0");
        oldest_existing_toast.setAttribute("data-visible-toast", "false");
        latest_old_toast.setAttribute("data-front-toast", "false");
    }
}

export function move_toasts(toast_children: HTMLElement[], type: -1 | 1) {
    for (let i = toast_children.length - 1; i >= 0; --i) {
        const toast = toast_children[i];

        if (toast instanceof HTMLElement) {
            const prev_index = +toast.getAttribute("data-index");
            const new_index = prev_index + type;

            toast.setAttribute("data-index", `${new_index}`);
            toast.style.setProperty("--toast-index", `${new_index}`);

            const gap = +toast.getAttribute("data-toast-gap") ?? DEFAULT_GAP;
            const toast_height = toast.style.getPropertyValue("--toast-height");
            const new_offset = Math.floor((+toast_height + +gap) * new_index);

            toast.style.setProperty(
                "--toast-offset",
                `${new_offset < 0 ? 0 : new_offset}px`,
            );

            toast.style.setProperty(
                "--z-index",
                `${toast_children.length - new_index}`,
            );
        }
    }
}

export function attach_close_button(toast: HTMLElement) {
    const close_button = $create("button");
    const svg = get_icon("close");
    const aborter = new AbortController();

    close_button.appendChild(svg);

    close_button.setAttribute("type", "button");
    close_button.setAttribute("aria-label", "Close");
    close_button.setAttribute("aria-controls", toast.id);
    hashmap_of_event_aborters.set(toast.id, aborter);

    close_button.addEventListener(
        "click",
        () => {
            dismiss_toast(toast.id);
        },
        {
            once: true,
            signal: aborter.signal,
        },
    );

    toast.append(close_button);
}

export function show_toast(
    { title, message }: ToastProps,
    {
        dir,
        type = "neutral",
        importance = "not important",
        animation_duration = DEFAULT_ANIMATION_DURATION,
        animation_timing_function = "ease-in-out",
    }: ToastOptions = {
        dir: "ltr",
        type: "neutral",
        importance: "not important",
        animation_duration: DEFAULT_ANIMATION_DURATION,
        animation_timing_function: "ease-in-out",
    },
) {
    const toast_container = $("#toast-holder") as HTMLElement;
    const toast_children = toast_container.children;
    const animation =
        (toast_container.getAttribute("data-toast-animation") as
            | "slide"
            | "popdown") ?? DEFAULT_TOAST_ANIMATION;
    const position =
        (toast_container.getAttribute(
            "data-toast-position",
        ) as ToastPositions) ?? DEFAULT_TOAST_POSITION;
    const max_toasts_visible =
        toast_container.getAttribute("data-max-toasts-visible") ??
        DEFAULT_MAX_TOASTS_VISIBLE;
    const toast_card = $create("div");
    const toast_id = gen_random_id();
    const toast_direction = get_toast_direction(position);

    toast_card.id = toast_id;
    toast_card.setAttribute("data-vanilla-toast", "true");
    toast_card.setAttribute("data-toast-direction", toast_direction);
    toast_status(toast_card, type);
    toast_card.setAttribute("aria-live", TOAST_IMPORTANCE[importance]);
    toast_card.setAttribute("data-index", "0");
    toast_card.style.setProperty("--toast-index", "0");
    toast_card.setAttribute("data-toast-type", type);
    toast_card.setAttribute("data-animation", animation);
    toast_card.setAttribute("aria-atomic", "true");
    toast_card.setAttribute("data-visible-toast", "true");
    toast_card.setAttribute("data-toast-gap", DEFAULT_GAP + "");
    toast_card.style.setProperty("--toast-gap", DEFAULT_GAP + "px");
    toast_card.style.setProperty("--z-index", toast_children.length + "");
    toast_card.setAttribute("dir", dir);
    toast_card.setAttribute("data-front-toast", "true");

    toast_transitions(toast_card, { animation });
    hide_overflowing_toasts_on_new_toast(+max_toasts_visible);
    move_toasts(toast_children as unknown as HTMLElement[], 1);

    toast_card.textContent = message;
    toast_container.append(toast_card);

    setTimeout(() => {
        if (!does_user_prefer_reduced_motion) {
            toast_card.setAttribute(
                "data-transition-duration",
                (animation_duration?.out || DEFAULT_ANIMATION_DURATION.out) +
                    "",
            );
            toast_card.style.setProperty(
                "--toast-transition-duration",
                (animation_duration?.in || DEFAULT_ANIMATION_DURATION.in) +
                    "ms",
            );
            toast_card.style.setProperty(
                "--toast-transition-timing-function",
                animation_timing_function,
            );
        }

        toast_card.style.setProperty("--toast-offset", "0px");
        toast_card.style.setProperty("--toast-opacity", "1");

        if (animation == "popdown") {
            toast_card.style.setProperty("--toast-scale", "1");
        }
    });

    const toast_card_rect = toast_card.getBoundingClientRect();

    toast_card.style.setProperty("--toast-height", toast_card_rect.height + "");

    attach_close_button(toast_card);

    const timer_to_automatically_remove_toast = setTimeout(
        () => {},
        animation_duration.out || DEFAULT_ANIMATION_DURATION.out,
    );

    hashmap_of_timers.set(toast_id, timer_to_automatically_remove_toast);

    return { toast_id };
}

function show_hidden_toast_when_visible_toast_is_prematurely_closed(
    toast_container: HTMLElement,
) {
    const animation =
        (toast_container.getAttribute("data-toast-animation") as
            | "slide-down"
            | "popdown") ?? DEFAULT_TOAST_ANIMATION;
    const all_hidden_toasts = document.querySelectorAll(
        "[data-visible-toast='false']",
    );
    const last_item_idx = all_hidden_toasts.length - 1;
    const recently_hidden_toast = all_hidden_toasts[
        last_item_idx < 0 ? 0 : last_item_idx
    ] as HTMLElement;

    if (recently_hidden_toast) {
        recently_hidden_toast.style.setProperty("--toast-opacity", "1");

        if (animation == "popdown") {
            recently_hidden_toast.style.setProperty("--toast-scale", "1");
        }

        recently_hidden_toast.setAttribute("data-visible-toast", "true");
    }
}

export function dismiss_toast(toast_id: string) {
    const toast_container = $("#toast-holder");
    const toast_to_remove = $("#" + CSS.escape(toast_id)) as HTMLElement;
    const existing_timer = hashmap_of_timers.get(toast_id);

    clearTimeout(existing_timer);
    hashmap_of_timers.delete(toast_id);

    const aborter = hashmap_of_event_aborters.get(toast_id);
    const is_visible = toast_to_remove.getAttribute("data-visible-toast");

    aborter?.abort();
    hashmap_of_event_aborters.delete(toast_id);

    const toast_children = toast_container.children as unknown as HTMLElement[];

    if (is_visible == "true") {
        show_hidden_toast_when_visible_toast_is_prematurely_closed(
            toast_container as HTMLElement,
        );
    }

    const reversed_idx_of_toast_to_remove =
        +toast_to_remove.getAttribute("data-index");

    for (
        let i = 0;
        i < toast_children.length - reversed_idx_of_toast_to_remove;
        ++i
    ) {
        const toast = toast_children[i] as HTMLElement;
        const toast_idx = +toast.getAttribute("data-index");
        const new_index = toast_idx - 1;

        toast.setAttribute("data-index", new_index + "");
        toast.style.setProperty("--toast-index", `${new_index}`);

        const gap = +toast.getAttribute("data-toast-gap") ?? DEFAULT_GAP;
        const sibling = toast.nextElementSibling as HTMLElement;

        if (sibling) {
            const sibling_rect = sibling.getBoundingClientRect();

            console.log(toast.id, sibling_rect);
        }

        const toast_height = toast.style.getPropertyValue("--toast-height");
        const new_offset = Math.floor((+toast_height + +gap) * new_index);

        toast.style.setProperty(
            "--toast-offset",
            `${new_offset < 0 ? 0 : new_offset}px`,
        );

        toast.style.setProperty(
            "--z-index",
            `${toast_children.length - new_index}`,
        );
    }

    if (does_user_prefer_reduced_motion) {
        toast_to_remove.style.setProperty("--toast-transition-duration", "0ms");
        toast_container.removeChild(toast_container);
    } else {
        const transition_duration =
            +toast_to_remove.getAttribute("data-transition-duration") ??
            DEFAULT_ANIMATION_DURATION.out;

        setTimeout(() => {
            toast_container.removeChild(toast_to_remove);
        }, transition_duration);
    }

    const animation =
        (toast_container.getAttribute("data-toast-animation") as
            | "slide"
            | "popdown") ?? DEFAULT_TOAST_ANIMATION;

    toast_to_remove.style.setProperty("--toast-offset", "-100%");
    toast_to_remove.style.setProperty("--toast-opacity", "0");

    if (animation == "popdown") {
        toast_to_remove.style.setProperty("--toast-scale", "0");
    }
}
