const prefetchedUrls = new Set();

const leafSettings = [
  ["3%", "17px", "21px", "24s", "-20s", "6vw", "-3vw", "#b75a36", "0.68"],
  ["14%", "13px", "16px", "30s", "-8s", "-5vw", "3vw", "#c58a39", "0.5"],
  ["25%", "19px", "23px", "27s", "-25s", "4vw", "-6vw", "#a94a32", "0.58"],
  ["36%", "12px", "15px", "32s", "-15s", "-7vw", "4vw", "#d09a45", "0.46"],
  ["48%", "16px", "20px", "25s", "-5s", "5vw", "-4vw", "#b75a36", "0.62"],
  ["59%", "14px", "17px", "29s", "-23s", "-4vw", "6vw", "#c47a38", "0.52"],
  ["70%", "20px", "24px", "31s", "-11s", "6vw", "-5vw", "#a94a32", "0.58"],
  ["81%", "12px", "15px", "26s", "-28s", "-6vw", "4vw", "#d09a45", "0.48"],
  ["92%", "17px", "21px", "28s", "-17s", "4vw", "-5vw", "#b75a36", "0.6"],
];

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const leafLayer = document.createElement("div");
  leafLayer.className = "autumn-leaves";
  leafLayer.setAttribute("aria-hidden", "true");

  leafSettings.forEach((settings) => {
    const leaf = document.createElement("span");
    leaf.className = "autumn-leaf";

    [
      "--leaf-x",
      "--leaf-width",
      "--leaf-height",
      "--leaf-duration",
      "--leaf-delay",
      "--leaf-sway-a",
      "--leaf-sway-b",
      "--leaf-color",
      "--leaf-opacity",
    ].forEach((property, index) => {
      leaf.style.setProperty(property, settings[index]);
    });

    leafLayer.appendChild(leaf);
  });

  document.body.prepend(leafLayer);
}

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
