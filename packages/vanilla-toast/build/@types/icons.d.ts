import type { LoadingIconTypes, ToastTypes } from "./types/toast-types";
export declare function warning_icon(): SVGSVGElement;
export declare function info_icon(): SVGSVGElement;
export declare function success_icon(): SVGSVGElement;
export declare function error_icon(): SVGSVGElement;
export declare function close_icon(): SVGSVGElement;
/** We use an image for loading icon for now
 *  since we have not implemented stuff for other svg tags yet.
 */
export declare function loading_icon(type?: LoadingIconTypes): HTMLObjectElement | HTMLElement | HTMLStyleElement | HTMLAnchorElement | HTMLScriptElement | HTMLTitleElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLButtonElement | HTMLCanvasElement | HTMLTableCaptionElement | HTMLTableColElement | HTMLDataElement | HTMLDataListElement | HTMLModElement | HTMLDetailsElement | HTMLDialogElement | HTMLDivElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLFormElement | HTMLHeadingElement | HTMLHeadElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement | HTMLImageElement | HTMLInputElement | HTMLLabelElement | HTMLLegendElement | HTMLLIElement | HTMLLinkElement | HTMLMapElement | HTMLMenuElement | HTMLMetaElement | HTMLMeterElement | HTMLOListElement | HTMLOptGroupElement | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement | HTMLPictureElement | HTMLPreElement | HTMLProgressElement | HTMLSelectElement | HTMLSlotElement | HTMLSourceElement | HTMLSpanElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableCellElement | HTMLTemplateElement | HTMLTextAreaElement | HTMLTimeElement | HTMLTableRowElement | HTMLTrackElement | HTMLUListElement | HTMLVideoElement;
export declare function get_icon(type: Omit<ToastTypes, "neutral">, loader_type?: LoadingIconTypes): SVGSVGElement | HTMLElement;
