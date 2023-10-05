// src/lib.ts
var $ = document.querySelector.bind(
  document
);
var $create = document.createElement.bind(
  document
);
var toast_container = document.getElementById("toast-container");
var MAX_ID_LENGTH = 16;
var MIN_ID_LENGTH = 6;
var alpha_numericals = "abcdefghijklmnopqrstuvwxyz0123456789";
function gen_random_id(length = 8) {
  if (length < MIN_ID_LENGTH) {
    throw new Error(
      "Please provide a string length that's greater than " + MIN_ID_LENGTH
    );
  } else if (length > MAX_ID_LENGTH) {
    throw new Error(
      "Please provide a string length that's less than " + MAX_ID_LENGTH
    );
  }
  let str = "";
  for (let idx = 0; idx < length; ++idx) {
    const random = Math.floor(
      Math.random() * (alpha_numericals.length - 1)
    );
    if (Math.random() < 0.5) {
      str += alpha_numericals[random].toUpperCase();
    } else {
      str += alpha_numericals[random];
    }
  }
  return str;
}
function get_icon(type) {
  if (type == "loading") {
    const loader = document.createElement("div");
    loader.classList.add("spin", "toast-loading");
    loader.style.width = "14px";
    loader.style.height = "14px";
    return loader;
  } else {
    const svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    const path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("fill", "none");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    if (type == "success") {
      path.setAttribute(
        "d",
        "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      );
    } else if (type == "error") {
      path.setAttribute(
        "d",
        "M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      );
    } else if (type == "info") {
      path.setAttribute(
        "d",
        "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      );
    } else if (type == "warn") {
      path.setAttribute(
        "d",
        "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
      );
    }
    svg.append(path);
    return svg;
  }
}
function get_importance(type) {
  let importance;
  if (type == "error" || type == "success" || type == "warn") {
    importance = "critical";
  } else if (type == "loading" || type == "neutral") {
    importance = "not important";
  } else {
    importance = "important";
  }
  return importance;
}
var does_user_prefer_reduced_motion_query = window.matchMedia(
  "('prefers-reduced-motion')"
);
var does_user_prefer_reduced_motion = does_user_prefer_reduced_motion_query.matches;
does_user_prefer_reduced_motion_query.addEventListener("change", (e) => {
  does_user_prefer_reduced_motion = e.matches;
});

// src/consts.ts
var DEFAULT_DURATION = 3e3;
var DEFAULT_ANIMATION_DURATION = 400;
var DEFAULT_ICON_POSITION = "left";
var DEFAULT_TOAST_POSITION = "top-right";
var DEFAULT_COLORS = "background";
var DEFAULT_ANIMATION = "popdown";
var timer_hashmaps = /* @__PURE__ */ new Map();

// src/styles/style.module.css
var style_default = {
  "toast-container": "style_toast-container",
  "toast-holder": "style_toast-holder",
  "toast-card": "style_toast-card",
  "toast-text-container": "style_toast-text-container",
  "toast-icon-container": "style_toast-icon-container",
  "toast-icon": "style_toast-icon"
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
function init(options, type = "neutral") {
  let toast_container_provided_duration;
  if (toast_container) {
    toast_container_provided_duration = +toast_container.getAttribute("data-duration");
  } else {
    toast_container_provided_duration = +$("#toast-container");
  }
  let enter_animation_duration;
  let exit_animation_duration;
  let duration;
  let toast_id;
  let importance;
  let color;
  let animation;
  if (options) {
    duration = options?.duration || toast_container_provided_duration || DEFAULT_DURATION;
    toast_id = options?.toast_id || gen_random_id();
    enter_animation_duration = options?.animation_duration?.in || DEFAULT_ANIMATION_DURATION;
    exit_animation_duration = options?.animation_duration?.out || DEFAULT_ANIMATION_DURATION;
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
      out: exit_animation_duration
    },
    duration,
    toast_id,
    icon_position: options?.icon_position || DEFAULT_ICON_POSITION,
    toast_position: options?.toast_position || DEFAULT_TOAST_POSITION,
    importance,
    colors: color,
    animation
  };
}
function show_toast(props, options, type = "neutral") {
  if (type == "loading" && options?.close_button == true) {
    alert("A loading toast should not be manually closed.");
    console.error(
      new Error("A loading toast should not be manually closed.")
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
    animation
  } = init(options, type);
  const toast_container2 = $("#toast-holder");
  toast_container2.classList.add("toast-" + toast_position);
  const { title, message } = props;
  const toast_card = $create("div");
  const toast_text_container = $create("div");
  const toast_message = $create("p");
  let toast_title;
  let toast_icon_container;
  if (title) {
    toast_title = $create("div");
    toast_title.setAttribute(
      "aria-label",
      "The title of toast #" + toast_id
    );
    toast_title.id = "toast-" + toast_id + "-title";
    toast_title.textContent = title;
  }
  if (options?.custom_icon || type != "neutral") {
    toast_icon_container = $create("div");
    toast_icon_container.classList.add(style_default["toast-icon-container"]);
    if (options?.custom_icon) {
      if (typeof options.custom_icon == "string") {
        toast_icon_container.innerHTML = options.custom_icon;
      } else if (options?.custom_icon instanceof HTMLElement || options?.custom_icon instanceof SVGElement) {
        options?.custom_icon.classList.add(style_default["toast-icon"]);
        toast_icon_container.append(options.custom_icon);
      }
    } else {
      const svg = get_icon(type);
      svg.classList.add(style_default["toast-icon"]);
      toast_icon_container.append(svg);
    }
  }
  toast_card.id = toast_id;
  toast_card.classList.add(style_default["toast-card"]);
  toast_card.setAttribute("role", "alert");
  toast_card.setAttribute("data-type", type);
  toast_card.setAttribute("aria-live", aria_live[importance]);
  toast_card.setAttribute("data-color-type", colors);
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
    import("./icon.module-NGTAK4Y7.js").then((module) => {
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
  if (type != "neutral" && icon_position == "left") {
    toast_card.append(toast_icon_container);
  }
  toast_card.append(toast_text_container);
  if (type != "neutral" && icon_position == "right") {
    toast_card.append(toast_icon_container);
    toast_text_container.style.textAlign = "right";
  }
  toast_container2.append(toast_card);
  const timeout = setTimeout(
    () => {
      console.log(toast_id);
      toast.dismiss(toast_id);
    },
    does_user_prefer_reduced_motion ? duration : duration - animation_duration?.out
  );
  timer_hashmaps.set(toast_id, timeout);
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
  if (does_user_prefer_reduced_motion) {
    toast_container2.removeChild(toast2);
  } else {
    clearTimeout(timer_hashmaps.get(toast_id));
    timer_hashmaps.delete(toast_id);
    toast2.style.setProperty("--toast-animation-direction", "reverse");
    toast2.style.setProperty("--toast-animation-fill-mode", "backwards");
    const className = toast2.className;
    toast2.className = "";
    toast2.offsetWidth;
    toast2.className = className;
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
