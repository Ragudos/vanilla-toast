import {
  DEFAULT_ANIMATION,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_COLORS,
  DEFAULT_DURATION,
  DEFAULT_ICON_POSITION,
  DEFAULT_TOAST_POSITION
} from "./chunk-FXXM2XVM.js";

// src/lib.ts
var $ = document.querySelector.bind(
  document
);
var $create = document.createElement.bind(
  document
);
var toast_container = document.getElementById("toast-container");
var does_user_prefer_reduced_motion_query = window.matchMedia(
  "('prefers-reduced-motion')"
);
var does_user_prefer_reduced_motion = does_user_prefer_reduced_motion_query.matches;
does_user_prefer_reduced_motion_query.addEventListener("change", (e) => {
  does_user_prefer_reduced_motion = e.matches;
});
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
    } else if (type == "close") {
      path.setAttribute("d", "M6 18L18 6M6 6l12 12");
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
    animation,
    automatically_close: options?.automatically_close ?? true
  };
}
function dom_reflow(element) {
  const className = element.className;
  element.className = "";
  element.offsetWidth;
  element.className = className;
}
function append_custom_icon_to_element(element, custom_icon) {
  if (typeof custom_icon == "string") {
    element.innerHTML = custom_icon;
  } else if (custom_icon instanceof HTMLElement || custom_icon instanceof SVGElement) {
    element.append(custom_icon);
  }
}

export {
  $,
  $create,
  toast_container,
  does_user_prefer_reduced_motion,
  gen_random_id,
  get_icon,
  get_importance,
  init,
  dom_reflow,
  append_custom_icon_to_element
};
//# sourceMappingURL=chunk-Q2JA6M4M.js.map
