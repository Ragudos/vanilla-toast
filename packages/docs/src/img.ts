const lazy_load_imgs = document.querySelectorAll("[data-src]");
const observer = new IntersectionObserver(load_img);

function load_img(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;

            if (target instanceof HTMLImageElement) {
                target.src = target.dataset.src as string;
                target.removeAttribute("data-src");
                observer.unobserve(entry.target);
            }
        }
    }
}

lazy_load_imgs.forEach((img) => {
    observer.observe(img);
});
