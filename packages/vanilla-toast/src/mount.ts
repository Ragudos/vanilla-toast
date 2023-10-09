import type { ToastContainerOptions, ToastOptions } from "./types/toast-types";
import { $create, $create_attr, $id } from "./lib/dom_helpers";
import { DEFAULT_POSITION } from "./lib/get_default";

export function mount_toaster(
    options?: Pick<ToastOptions, "position"> & ToastContainerOptions,
) {
    const existing_toast_container = $id("toast-section-container");

    if (existing_toast_container) {
        return;
    }

    const toast_section_container = $create("section");
    const toast_container = $create("ol");
    const aria_label = $create_attr("aria-label");
    const data_section_toast_container = $create_attr(
        "data-toast-section-container",
    );
    const data_position_x_attr = $create_attr("data-position-x");
    const data_position_y_attr = $create_attr("data-position-y");
    const data_toast_container = $create_attr("data-toast-container");
    const data_expanded = $create_attr("data-expanded");
    const data_position_x = options?.position?.x || DEFAULT_POSITION.x;
    const data_position_y = options?.position?.y || DEFAULT_POSITION.y;

    aria_label.value = "Notifications (Alt + T)";
    data_position_x_attr.value = data_position_x;
    data_position_y_attr.value = data_position_y;
    data_expanded.value = `${options?.is_expanded_by_default || false}`;

    toast_section_container.setAttributeNode(aria_label);
    toast_section_container.setAttributeNode(data_section_toast_container);
    toast_section_container.id = "toast-section-container";

    toast_container.setAttributeNode(data_position_x_attr);
    toast_container.setAttributeNode(data_position_y_attr);
    toast_container.setAttributeNode(data_toast_container);
    toast_container.setAttributeNode(data_expanded);
    toast_container.id = "toast-container";

    toast_section_container.append(toast_container);
    document.body.append(toast_section_container);
}
