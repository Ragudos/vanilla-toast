// src/consts.ts
var DEFAULT_DURATION = 3e3;
var DEFAULT_ANIMATION_DURATION = 400;
var DEFAULT_ICON_POSITION = "left";
var DEFAULT_TOAST_POSITION = "top-right";
var DEFAULT_COLORS = "background";
var DEFAULT_ANIMATION = "popdown";
var DEFAULT_CLOSE_BUTTON_POSITION = "top-right";
var DEFAULT_BOX_SHADOW_SIZE = "sm";
var BOX_SHADOW_SIZES = {
  sm: "0px 2px 4px var(--toast-shadow-color)",
  md: "0px 3px 6px var(--toast-shadow-color)",
  lg: "0px 4px 8px var(--toast-shadow-color)"
};
var timer_hashmaps = /* @__PURE__ */ new Map();
var close_button_aborters_hashmaps = /* @__PURE__ */ new Map();
var toast_positions = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right"
];

export {
  DEFAULT_DURATION,
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_ICON_POSITION,
  DEFAULT_TOAST_POSITION,
  DEFAULT_COLORS,
  DEFAULT_ANIMATION,
  DEFAULT_CLOSE_BUTTON_POSITION,
  DEFAULT_BOX_SHADOW_SIZE,
  BOX_SHADOW_SIZES,
  timer_hashmaps,
  close_button_aborters_hashmaps,
  toast_positions
};
//# sourceMappingURL=chunk-FXXM2XVM.js.map
