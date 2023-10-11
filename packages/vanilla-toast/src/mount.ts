import type { ToastContainerOptions } from "./types/toast-types";
import { $id } from "./lib/dom_helpers";
import { DEFAULT_POSITION } from "./lib/get_default";
import { create_element } from "./render";
import { listen_to_page_events } from "./listener";

export function mount_toaster(options?: ToastContainerOptions) {
    const existing_toast_container = $id("toast-section-container");

    if (existing_toast_container) {
        return;
    }

    const section = create_element("section", {
        "aria-label": "Notifcations (Alt + T). Escape to unexpand.",
        "data-toast-section-container": "true",
        "data-testid": "toast-section-container",
        id: "toast-section-container",
    });
    const toast_container = create_element("ol", {
        "data-expanded":
            options?.is_expanded_by_default != undefined
                ? options.is_expanded_by_default + ""
                : "false",
        "data-position-x": options?.position?.x || DEFAULT_POSITION.x,
        "data-position-y": options?.position?.y || DEFAULT_POSITION.y,
        "data-toast-container": "true",
        "data-testid": "container",
        id: "toast-container",
        "aria-describedby": "toast-section-heading",
    });
    const label = create_element("h6", {
        id: "toast-section-heading",
        textContent: "A section of notifications",
    });

    section.append(label);
    section.append(toast_container);
    document.body.append(section);

    if (!options?.is_expanded_by_default) {
        listen_to_page_events();
    }
}
