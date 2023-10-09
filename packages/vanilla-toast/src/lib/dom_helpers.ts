export const $ = document.querySelector.bind(
    document,
) as typeof document.querySelector;
export const $$ = document.querySelectorAll.bind(
    document,
) as typeof document.querySelectorAll;
export const $id = document.getElementById.bind(
    document,
) as typeof document.getElementById;
export const $create = document.createElement.bind(
    document,
) as typeof document.createElement;
export const $create_ns = document.createAttributeNS.bind(
    document,
) as typeof document.createAttributeNS;
export const $create_attr = document.createAttribute.bind(
    document,
) as typeof document.createAttribute;
export const $create_attr_ns = document.createAttributeNS.bind(
    document,
) as typeof document.createAttributeNS;
