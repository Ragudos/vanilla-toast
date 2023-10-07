import { DEFAULT_MAX_TOASTS_VISIBLE } from "./consts";
import { $, dom_reflow } from "./lib";

export function hide_old_toasts() {
    const toast_container = $("#toast-holder");
    const toast_children = toast_container.children;

    const max_toasts =
        +toast_container.getAttribute("data-max-toasts")! ||
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
