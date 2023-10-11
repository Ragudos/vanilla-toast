import type { Toast, ToastOptions, ToastProps } from "./types/toast-types";
import { mount_toaster } from "./mount";
import "./styles/index.css";
import "./listener";
/** # Toast
 *  Provides all the functions possible to render a toast notification.
 *
 *  - `default` - renders a neutral, black and white toast.
 *  - `success` - renders a check icon beside the toast message.
 *  - `error` - renders an x icon beside the toast message.
 *  - `info` - renders an i icon beside the toast message.
 *  - `warn` - renders a warning icon beside the toast message.
 *  - `loading` - renders a loading icon beside the toast message and cannot be closed unless specified.
 *  - `promise` - handles promises for you and renders a loading toast. Once the promise is finished, then changes the toast to either a success toast or error toast and sets a timer to close the toast. This also returns the error instead of throwing it.
 *  - `dismiss` - dismisses a toast.
 */
declare const toast: Toast;
export { toast, mount_toaster };
export type { ToastOptions, ToastProps };
