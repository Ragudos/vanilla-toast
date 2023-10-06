import {
  $,
  $create,
  append_custom_icon_to_element,
  does_user_prefer_reduced_motion,
  dom_reflow,
  init,
  toast_container
} from "./chunk-Q2JA6M4M.js";
import {
  DEFAULT_BOX_SHADOW_SIZE,
  DEFAULT_CLOSE_BUTTON_POSITION,
  close_button_aborters_hashmaps,
  timer_hashmaps
} from "./chunk-FXXM2XVM.js";

// src/styles/style.module.css
var style_default = {
  "toast-container": "style_toast-container",
  "toast-holder": "style_toast-holder",
  "toast-card": "style_toast-card",
  "toast-card-close-button-hover": "style_toast-card-close-button-hover",
  "toast-close-button": "style_toast-close-button",
  "toast-text-container": "style_toast-text-container",
  "toast-icon-container": "style_toast-icon-container",
  "toast-icon": "style_toast-icon",
  "toast-close-button-text": "style_toast-close-button-text",
  "toast-close-button-top-right": "style_toast-close-button-top-right",
  "toast-close-button-top-left": "style_toast-close-button-top-left",
  "toast-close-button-inline": "style_toast-close-button-inline"
};

// src/toast.ts
var toast_holder = $create("div");
toast_holder.classList.add(style_default["toast-holder"]);
toast_holder.id = "toast-holder";
var aria_live = {
  "not important": "off",
  important: "polite",
  critical: "assertive"
};
window.addEventListener("DOMContentLoaded", () => {
  if (!toast_container) {
    const created_toast_container = $create("div");
    created_toast_container.classList.add(style_default["toast-container"]);
    created_toast_container.setAttribute(
      "aria-label",
      "The main container for toast notifications."
    );
    created_toast_container.append(toast_holder);
    document.body.append(created_toast_container);
  } else {
    toast_container.append(toast_holder);
  }
});
function show_toast(props, options, type = "neutral") {
  if (type == "loading" && options?.close_button == true) {
    alert("A loading toast should not be manually closed.");
    console.error(
      new Error("A loading toast should not be manually closed.")
    );
    throw new Error("A loading toast should not be manually closed.");
  }
  if (options && options.close_button == void 0) {
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
    automatically_close
  } = init(options, type);
  const toast_container2 = $("#toast-holder");
  toast_container2.classList.add("toast-" + toast_position);
  const { title, message } = props;
  const toast_card = $create("div");
  const toast_text_container = $create("div");
  const toast_message = $create("p");
  let toast_title;
  let toast_icon_container;
  let toast_close_button;
  if (title) {
    toast_title = $create("div");
    toast_title.setAttribute(
      "aria-label",
      "The title of toast #" + toast_id
    );
    toast_title.id = "toast-" + toast_id + "-title";
    toast_title.textContent = title;
  }
  if (Boolean(options?.custom_icon) || type != "neutral") {
    toast_icon_container = $create("div");
    toast_icon_container.classList.add(style_default["toast-icon-container"]);
    if (options?.custom_icon) {
      append_custom_icon_to_element(
        toast_icon_container,
        options?.custom_icon
      );
      if (typeof options?.custom_icon != "string") {
        options?.custom_icon.classList.add(style_default["toast-icon"]);
      }
    } else {
      import("./lib-DAF3TZMS.js").then((module) => {
        const svg = module.get_icon(type);
        svg.classList.add(style_default["toast-icon"]);
        toast_icon_container?.append(svg);
      });
    }
  }
  toast_card.id = toast_id;
  toast_card.classList.add(style_default["toast-card"]);
  toast_card.setAttribute("role", "alert");
  toast_card.setAttribute("data-type", type);
  toast_card.setAttribute("aria-live", aria_live[importance]);
  toast_card.setAttribute("data-color-type", colors);
  if (options?.shadow_size) {
    import("./consts-AOXNHAF4.js").then((module) => {
      toast_card.style.setProperty(
        "--toast-box-shadow",
        module.BOX_SHADOW_SIZES[options?.shadow_size || DEFAULT_BOX_SHADOW_SIZE]
      );
    });
  }
  if (!does_user_prefer_reduced_motion) {
    toast_card.setAttribute(
      "data-exit-animation-duration",
      animation_duration?.out?.toString()
    );
    toast_card.style.setProperty(
      "--toast-animation-duration",
      animation_duration?.in + "ms"
    );
  }
  toast_card.style.setProperty("--toast-animation", animation);
  if (colors == "icon" || colors == "icon-stroke") {
    import("./icon.module-EMIUYX33.js").then((module) => {
      toast_card.classList.add(module.default["toast-card"]);
    });
  }
  toast_text_container.classList.add(style_default["toast-text-container"]);
  toast_message.id = "toast-" + toast_id + "-message";
  toast_message.textContent = message;
  toast_message.setAttribute(
    "aria-label",
    "The message of toast #" + toast_id
  );
  if (toast_title) {
    toast_text_container.append(toast_title);
  }
  toast_card.setAttribute(
    "aria-labelledby",
    toast_title ? toast_title.id : toast_message.id
  );
  toast_text_container.append(toast_message);
  if (options?.close_button && type != "loading") {
    let handle_close_button_click;
    toast_close_button = $create("button");
    if (typeof options.close_button != "boolean") {
      if (options.close_button?.appearance == "visible-on-hover") {
        toast_card.classList.add(
          style_default["toast-card-close-button-hover"]
        );
      }
      if (options.close_button.custom_button?.on_click) {
        handle_close_button_click = function() {
          if (typeof options?.close_button != "boolean") {
            if (options?.close_button?.custom_button?.on_click) {
              options?.close_button?.custom_button?.on_click(
                toast_id
              );
            }
          }
          toast.dismiss(toast_id);
        };
      } else {
        handle_close_button_click = function() {
          toast.dismiss(toast_id);
        };
      }
      toast_close_button.classList.add(
        style_default["toast-close-button-" + (options?.close_button?.position || DEFAULT_CLOSE_BUTTON_POSITION)]
      );
      if (options.close_button.type == "text") {
        toast_close_button.classList.add(
          style_default["toast-close-button-text"]
        );
        toast_close_button.style.setProperty(
          "--toast-close-button-border-radius",
          "0.25rem"
        );
        toast_close_button.textContent = options.close_button.text || "close";
      } else if (options.close_button?.type == "icon") {
        if (options.close_button.custom_icon) {
          append_custom_icon_to_element(
            toast_close_button,
            options.close_button?.custom_icon
          );
        } else {
          import("./lib-DAF3TZMS.js").then((module) => {
            const svg = module.get_icon("close");
            svg.classList.add(style_default["toast-icon"]);
            toast_close_button?.append(svg);
          });
        }
      } else {
        import("./lib-DAF3TZMS.js").then((module) => {
          const svg = module.get_icon("close");
          svg.classList.add(style_default["toast-icon"]);
          toast_close_button?.append(svg);
        });
      }
      if (options.close_button.custom_button?.className) {
        toast_close_button.className += " " + options.close_button.custom_button.className;
      }
    } else {
      handle_close_button_click = function() {
        toast.dismiss(toast_id);
      };
      import("./lib-DAF3TZMS.js").then((module) => {
        const svg = module.get_icon("close");
        svg.classList.add(style_default["toast-icon"]);
        toast_close_button?.append(svg);
      });
      toast_close_button.classList.add(
        style_default["toast-close-button-" + DEFAULT_CLOSE_BUTTON_POSITION]
      );
    }
    toast_close_button.setAttribute(
      "aria-label",
      "Close toast #" + toast_id
    );
    toast_close_button.classList.add(style_default["toast-close-button"]);
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
          once: true
        }
      );
    } else {
      console.error(
        "Function to invoke for a close button does not exist!"
      );
    }
  }
  if (!toast_close_button && options?.close_button) {
    throw new Error(
      `Failed on creating a close button when it's specified for the toast instance with an id of ${toast_id} to have one!`
    );
  }
  if (type != "neutral" && icon_position == "left") {
    toast_card.append(toast_icon_container);
  } else {
    if (typeof options?.close_button != "boolean" && options?.close_button?.position == "inline" || options?.close_button) {
      toast_card.append(toast_close_button);
    }
  }
  toast_card.append(toast_text_container);
  if (type != "neutral" && icon_position == "right") {
    toast_card.append(toast_icon_container);
    toast_text_container.style.textAlign = "right";
  } else {
    if (typeof options?.close_button != "boolean" && options?.close_button?.position == "inline" || options?.close_button) {
      toast_card.append(toast_close_button);
    }
  }
  toast_container2.append(toast_card);
  if (type != "loading" && automatically_close == true) {
    const timeout = setTimeout(
      () => {
        toast.dismiss(toast_id);
      },
      does_user_prefer_reduced_motion ? duration : duration - animation_duration?.out
    );
    timer_hashmaps.set(toast_id, timeout);
  }
  return { toast_id };
}

// src/index.ts
var toast = function(props, options, type) {
  return show_toast(props, options, type);
};
toast.success = function(props, options) {
  return show_toast(props, options, "success");
};
toast.error = function(props, options) {
  return show_toast(props, options, "error");
};
toast.warn = function(props, options) {
  return show_toast(props, options, "warn");
};
toast.info = function(props, options) {
  return show_toast(props, options, "info");
};
toast.loading = function(props, options) {
  return show_toast(props, options, "loading");
};
toast.dismiss = function(toast_id) {
  const toast_container2 = $("#toast-holder");
  const toast2 = $(`#${CSS.escape(toast_id)}`);
  if (!toast_container2) {
    console.error("Toast container does not exist!");
  }
  if (!toast2) {
    console.error("Toast does not exist!");
  }
  close_button_aborters_hashmaps.get(toast_id)?.abort();
  close_button_aborters_hashmaps.delete(toast_id);
  if (does_user_prefer_reduced_motion) {
    toast_container2.removeChild(toast2);
  } else {
    clearTimeout(timer_hashmaps.get(toast_id));
    timer_hashmaps.delete(toast_id);
    toast2.style.setProperty("--toast-animation-direction", "reverse");
    toast2.style.setProperty("--toast-animation-fill-mode", "backwards");
    dom_reflow(toast2);
    setTimeout(
      () => {
        toast_container2.removeChild(toast2);
      },
      +toast2.getAttribute("data-exit-animation-duration")
    );
  }
};
export {
  toast
};
//# sourceMappingURL=index.js.map
