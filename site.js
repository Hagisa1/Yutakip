const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefetchedUrls = new Set();
const faviconVersion = "v=2";

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

const prefetchPage = (url) => {
  const cacheKey = `${url.origin}${url.pathname}`;

  if (prefetchedUrls.has(cacheKey)) {
    return;
  }

  prefetchedUrls.add(cacheKey);

  const prefetchLink = document.createElement("link");
  prefetchLink.rel = "prefetch";
  prefetchLink.href = url.href;
  prefetchLink.as = "document";
  document.head.appendChild(prefetchLink);
};

const ensureFavicon = () => {
  const iconHref = `./favicon-32.png?${faviconVersion}`;
  const touchHref = `./apple-touch-icon.png?${faviconVersion}`;

  [
    ['link[rel="icon"]', { rel: "icon", href: iconHref, type: "image/png", sizes: "32x32" }],
    ['link[rel="shortcut icon"]', { rel: "shortcut icon", href: iconHref, type: "image/png" }],
    ['link[rel="apple-touch-icon"]', { rel: "apple-touch-icon", href: touchHref, sizes: "180x180" }],
  ].forEach(([selector, attributes]) => {
    let link = document.head.querySelector(selector);

    if (!link) {
      link = document.createElement("link");
      document.head.appendChild(link);
    }

    Object.entries(attributes).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
  });
};

document.querySelectorAll("a[href]").forEach((link) => {
  if (!isTransitionableLink(link)) {
    return;
  }

  const nextUrl = new URL(link.getAttribute("href"), window.location.href);

  link.addEventListener(
    "mouseenter",
    () => {
      prefetchPage(nextUrl);
    },
    { passive: true }
  );

  link.addEventListener(
    "focus",
    () => {
      prefetchPage(nextUrl);
    },
    { passive: true }
  );

  link.addEventListener(
    "touchstart",
    () => {
      prefetchPage(nextUrl);
    },
    { passive: true }
  );
});

document.querySelectorAll("form[data-static-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});

const scheduleWarmup = () => {
  document.querySelectorAll("nav a[href]").forEach((link) => {
    if (!isTransitionableLink(link)) {
      return;
    }

    prefetchPage(new URL(link.getAttribute("href"), window.location.href));
  });
};

if ("requestIdleCallback" in window) {
  window.requestIdleCallback(scheduleWarmup, { timeout: 1200 });
} else {
  window.setTimeout(scheduleWarmup, 500);
}

ensureFavicon();
