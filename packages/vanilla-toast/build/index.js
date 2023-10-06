import{a as f,b,d as x,g as k,i as M,j as A,k as E}from"./chunk-ZFKTEMTL.js";import{g as P,h as I,i as C,k as v,l as T}from"./chunk-7QFZVYKW.js";import{a as m}from"./chunk-DYCPFO4Y.js";var c={"toast-container":"e","toast-holder":"c","toast-card":"o","toast-card-close-button-hover":"s","toast-close-button":"a","toast-text-container":"r","toast-icon-container":"l","toast-icon":"n","toast-close-button-text":"i","toast-close-button-top-right":"d","toast-close-button-top-left":"f","toast-close-button-inline":"p"};var R={"not important":"off",important:"polite",critical:"assertive"};function _(e,t,r="neutral"){let o=f("#toast-holder");if(!o){let i=new Error("Toast container has not been mounted yet. Try calling initialize_toast() first.");throw console.error(i),i}if(r=="loading"&&t?.close_button==!0)throw alert("A loading toast should not be manually closed."),console.error(new Error("A loading toast should not be manually closed.")),new Error("A loading toast should not be manually closed.");t&&t.close_button==null&&(t.close_button=!0);let{animation_duration:p,duration:w,toast_id:n,icon_position:O,toast_position:B,importance:D,colors:L,animation:N,automatically_close:H}=M(t,r);o.classList.add("toast-"+B);let{title:S,message:z}=e,s=b("li"),h=b("div"),y=b("p"),u,g,a;if(S&&(u=b("div"),u.setAttribute("aria-label","The title of toast #"+n),u.id="toast-"+n+"-title",u.textContent=S),(t?.custom_icon||r!="neutral")&&(g=b("div"),g.classList.add(c["toast-icon-container"]),t?.custom_icon?(E(g,t?.custom_icon),typeof t?.custom_icon!="string"&&t?.custom_icon.classList.add(c["toast-icon"])):import("./lib-NIQOT22H.js").then(i=>{let l=i.get_icon(r);l.classList.add(c["toast-icon"]),g?.append(l)})),s.id=n,s.classList.add(c["toast-card"]),s.setAttribute("role","alert"),s.setAttribute("data-type",r),s.setAttribute("aria-live",R[D]),s.setAttribute("data-color-type",L),t?.shadow_size&&import("./consts-KI5LB2CE.js").then(i=>{s.style.setProperty("--toast-box-shadow",i.BOX_SHADOW_SIZES[t?.shadow_size||I])}),x.matches||(s.setAttribute("data-exit-animation-duration",p?.out?.toString()),s.style.setProperty("--toast-animation-duration",p?.in+"ms")),s.style.setProperty("--toast-animation",N),(L=="icon"||L=="icon-stroke")&&import("./icon.module-XIRHFTS7.js").then(i=>{let l="toast-card";s.classList.add(i.default[l])}),h.classList.add(c["toast-text-container"]),y.id="toast-"+n+"-message",y.textContent=z,y.setAttribute("aria-label","The message of toast #"+n),u&&h.append(u),s.setAttribute("aria-labelledby",u?u.id:y.id),h.append(y),t?.close_button&&r!="loading"){let i;if(a=b("button"),typeof t.close_button!="boolean"){if(t.close_button?.appearance=="visible-on-hover"&&s.classList.add(c["toast-card-close-button-hover"]),t.close_button.custom_button?.on_click?i=m(function(){typeof t?.close_button!="boolean"&&t?.close_button?.custom_button?.on_click&&t?.close_button?.custom_button?.on_click(n),d.dismiss(n)},"handle_close_button_click"):i=m(function(){d.dismiss(n)},"handle_close_button_click"),a.classList.add(c["toast-close-button-"+(t?.close_button?.position||P)]),t.close_button.type=="text")a.classList.add(c["toast-close-button-text"]),a.style.setProperty("--toast-close-button-border-radius","0.25rem"),a.textContent=t.close_button.text||"close";else if(t.close_button?.type=="icon")if(t.close_button.custom_icon)E(a,t?.close_button?.custom_icon);else{let l=k("close");l.classList.add(c["toast-icon"]),a?.append(l)}else{let l=k("close");l.classList.add(c["toast-icon"]),a?.append(l)}t.close_button.custom_button?.className&&(a.className+=" "+t.close_button.custom_button.className)}else{i=m(function(){d.dismiss(n)},"handle_close_button_click");let l=k("close");l.classList.add(c["toast-icon"]),a?.append(l),a.classList.add(c["toast-close-button-"+P])}if(a.setAttribute("aria-label","Close toast #"+n),a.classList.add(c["toast-close-button"]),a.setAttribute("type","button"),a.setAttribute("aria-controls",n),a.tabIndex=-1,i){let l=new AbortController;T.set(n,l),a.addEventListener("click",i,{signal:l.signal,once:!0})}else console.error("Function to invoke for a close button does not exist!")}if(!a&&t?.close_button)throw new Error(`Failed on creating a close button when it's specified for the toast instance with an id of ${n} to have one!`);if(r!="neutral"&&O=="left"?s.append(g):(typeof t?.close_button!="boolean"&&t?.close_button?.position=="inline"||t?.close_button)&&s.append(a),s.append(h),r!="neutral"&&O=="right"?(s.append(g),h.style.textAlign="right"):(typeof t?.close_button!="boolean"&&t?.close_button?.position=="inline"||t?.close_button)&&s.append(a),o.append(s),F(),r!="loading"&&H==!0){let i=setTimeout(()=>{d.dismiss(n)},x.matches?w:w-p?.out);v.set(n,i)}return{toast_id:n}}m(_,"show_toast");function F(){let e=f("#toast-holder"),t=e.children,r=+e.getAttribute("data-max-toasts")||3;if(t.length>=r){let o=f("[data-latest-old-toast='true']"),p=o?.nextElementSibling;if(o||(p=t[0]),o){o.removeAttribute("data-latest-old-toast"),o.setAttribute("aria-hidden","true"),o.style.setProperty("--toast-animation-direction","reverse"),o.style.setProperty("--toast-animation-fill-mode","forwards");let w=o.style.getPropertyValue("--toast-animation-duration");setTimeout(()=>{o.style.position="absolute"},+w.split("ms")[0]),A(o)}p.setAttribute("data-latest-old-toast","true")}}m(F,"hide_old_toasts");var d=m(function(e,t,r){return _(e,t,r)},"toast");d.success=function(e,t){return _(e,t,"success")};d.error=function(e,t){return _(e,t,"error")};d.warn=function(e,t){return _(e,t,"warn")};d.info=function(e,t){return _(e,t,"info")};d.loading=function(e,t){return _(e,t,"loading")};d.dismiss=function(e){let t=x.matches,r=f("#toast-holder"),o=f(`#${CSS.escape(e)}`);r||console.error("Toast container does not exist!"),o||console.error("Toast does not exist!"),T.get(e)?.abort(),T.delete(e),clearTimeout(v.get(e)),v.delete(e),o.getAttribute("aria-hidden")=="true"||t?r.removeChild(o):(o.style.setProperty("--toast-animation-direction","reverse"),o.style.setProperty("--toast-animation-fill-mode","forwards"),A(o),setTimeout(()=>{r.removeChild(o)},+o.getAttribute("data-exit-animation-duration")))};export{d as toast};
//# sourceMappingURL=index.js.map
