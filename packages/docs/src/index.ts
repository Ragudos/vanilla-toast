import { toast, mount_toaster } from "@vanilla-toast/vanilla-toast";
import "@vanilla-toast/vanilla-toast/index.min.css";

import "./img";

export let system_theme = "dark";

const media_query = window.matchMedia("prefers-color-scheme: dark");
const theme_btn = document.getElementById("change-theme")!;

function set_theme() {
    const html = document.documentElement;
    const stored_theme = localStorage.getItem("theme");

    html.classList.remove("dark", "light");

    if (stored_theme == "light" || stored_theme == "dark") {
        system_theme = stored_theme;
        html.style.colorScheme = stored_theme;
        html.classList.add(stored_theme);
    } else {
        if (media_query.matches) {
            system_theme = "dark";
            html.style.colorScheme = "dark";
            html.classList.add("dark");
        } else {
            system_theme = "light";
            html.style.colorScheme = "light";
            html.classList.add("light");
        }
    }

    theme_btn.setAttribute(
        "aria-pressed",
        system_theme == "light" ? "true" : "false",
    );
}

theme_btn.addEventListener("click", () => {
    system_theme = system_theme == "light" ? "dark" : "light";
    theme_btn.setAttribute(
        "aria-pressed",
        system_theme == "light" ? "true" : "false",
    );
    localStorage.setItem("theme", system_theme);
    set_theme();
});

window.addEventListener("DOMContentLoaded", () => {
    media_query.addEventListener("change", set_theme);
    set_theme();
    mount_toaster();
});

const render_btns = document.querySelectorAll("[data-render]");
let type: keyof Omit<typeof toast, "dismiss" | "promise"> = "default";
let position_x = "right";
let position_y = "top";
let theme = "dark";
let style = "";

const messages: {
    [key in keyof Omit<typeof toast, "promise" | "dismiss">]: string;
} = {
    default: "Hello, Stranger!",
    success: "The operation was a success!",
    error: "Uh oh. Something went wrong!",
    warn: "Alert!",
    info: "Did you know that toasts are a great way to notify users?",
    loading: "Loading... Please wait",
};

function render() {
    toast[type as keyof Omit<typeof toast, "promise" | "dismiss">](
        {
            message: messages[type],
        },
        {
            theme: theme as "light" | "dark" | "system",
            automatically_close: true,
            style: style as "glass" | "plain" | "icons" | "monochrome",
        },
    );
}

document.querySelector("[data-primary]")?.addEventListener("click", () => {
    render();
});

render_btns.forEach((btn) => {
    const b = btn as HTMLElement;

    b.addEventListener("click", () => {
        const attr = b.getAttribute("data-type");

        if (attr != "position" && attr != "theme" && attr != "style") {
            if (btn instanceof HTMLElement) {
                btn.setAttribute("data-active", "true");
            }

            type =
                (b.getAttribute("data-type") as keyof Omit<
                    typeof toast,
                    "promise" | "dismiss"
                >) ?? "default";

            document
                .querySelectorAll(
                    "[data-type]:not([data-type='position']):not([data-type='theme']):not([data-type='style'])",
                )!
                .forEach((btn) => {
                    if (btn.getAttribute("data-type") != type) {
                        if (btn instanceof HTMLElement) {
                            btn.setAttribute("data-active", "false");
                        }
                    }
                });
        } else if (attr == "position") {
            const pos = b.getAttribute("data-position")!;
            const container = document.getElementById("toast-container")!;

            if (pos == "bottom" || pos == "top") {
                container.setAttribute("data-position-y", pos);
                position_y = pos;
            } else {
                container.setAttribute("data-position-x", pos);
                position_x = pos;
            }

            document
                .querySelector(`button[data-position=${pos}]`)!
                .setAttribute("data-active", "true");

            document
                .querySelectorAll("button[data-type='position']")
                .forEach((btn) => {
                    if (
                        btn.getAttribute("data-position") == position_x ||
                        btn.getAttribute("data-position") == position_y
                    ) {
                        if (btn instanceof HTMLElement) {
                            btn.setAttribute("data-active", "true");
                        }
                    } else {
                        if (btn instanceof HTMLElement) {
                            btn.setAttribute("data-active", "false");
                        }
                    }
                });
        } else if (attr == "theme") {
            theme = b.getAttribute("data-theme")!;

            document
                .querySelectorAll("button[data-type='theme']")
                .forEach((btn) => {
                    if (btn.getAttribute("data-theme") == theme) {
                        if (btn instanceof HTMLElement) {
                            btn.setAttribute("data-active", "true");
                        }
                    } else {
                        if (btn instanceof HTMLElement) {
                            btn.setAttribute("data-active", "false");
                        }
                    }
                });
        } else if (attr == "style") {
            style = b.getAttribute("data-style")!;

            document
                .querySelectorAll("button[data-type='style']")
                .forEach((btn) => {
                    if (btn.getAttribute("data-style") == style) {
                        if (btn instanceof HTMLElement) {
                            btn.setAttribute("data-active", "true");
                        }
                    } else {
                        if (btn instanceof HTMLElement) {
                            btn.setAttribute("data-active", "false");
                        }
                    }
                });
        }

        render();
    });
});
