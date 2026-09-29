const prefetchedUrls = new Set();

const isTransitionableLink = (link) => {
  if (!link || link.target === "_blank") {
    return false;
  }

  const href = link.getAttribute("href");

  if (!href || href.startsWith("#")) {
    return false;
  }

  const url = new URL(href, window.location.href);

  return (
    ["http:", "https:"].includes(url.protocol) &&
    url.origin === window.location.origin &&
    (url.pathname !== window.location.pathname || url.hash !== window.location.hash)
  );
};

const canPrefetch = () => {
  const connection = navigator.connection;
  return !connection?.saveData && !["slow-2g", "2g"].includes(connection?.effectiveType);
};

const prefetchPage = (url) => {
  if (!canPrefetch()) {
    return;
  }

  const cacheKey = url.origin + url.pathname + url.search;

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

document.querySelectorAll("a[href]").forEach((link) => {
  if (!isTransitionableLink(link)) {
    return;
  }

  const nextUrl = new URL(link.getAttribute("href"), window.location.href);
  const prefetchOnIntent = () => prefetchPage(nextUrl);

  link.addEventListener("pointerenter", prefetchOnIntent, { passive: true });
  link.addEventListener("focus", prefetchOnIntent, { passive: true });
});

document.querySelectorAll("form[data-static-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});
