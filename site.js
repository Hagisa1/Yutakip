const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isTransitionableLink = (link) => {
  if (!link || link.target === "_blank") {
    return false;
  }

  const href = link.getAttribute("href");

  if (!href || href.startsWith("#")) {
    return false;
  }

  const url = new URL(href, window.location.href);

  if (!["http:", "https:"].includes(url.protocol)) {
    return false;
  }

  if (url.origin !== window.location.origin) {
    return false;
  }

  return url.pathname !== window.location.pathname || url.hash !== window.location.hash;
};

document.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (
      prefersReducedMotion ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !isTransitionableLink(link)
    ) {
      return;
    }

    const nextUrl = new URL(link.getAttribute("href"), window.location.href);

    event.preventDefault();
    document.body.classList.add("is-leaving");

    window.setTimeout(() => {
      window.location.href = nextUrl.href;
    }, 320);
  });
});

document.querySelectorAll("form[data-static-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-leaving");
});
