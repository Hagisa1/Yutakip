const prefetchedUrls = new Set();

const leafSettings = [
  { x: "4%", width: "26px", height: "31px", duration: "27s", delay: "-19s", swayA: "6vw", swayB: "-3vw", opacity: "0.7", type: "maple", spin: "540deg", flutter: "2.2s", light: "#ffb04b", mid: "#ed6234", dark: "#b5352d", vein: "#913e2d" },
  { x: "14%", width: "21px", height: "26px", duration: "31s", delay: "-8s", swayA: "-5vw", swayB: "3vw", opacity: "0.56", type: "ginkgo", spin: "-540deg", flutter: "2.7s", light: "#fff18a", mid: "#f4c34e", dark: "#d89032", vein: "#a36b2b" },
  { x: "24%", width: "30px", height: "35px", duration: "29s", delay: "-25s", swayA: "4vw", swayB: "-6vw", opacity: "0.63", type: "maple", spin: "-540deg", flutter: "2.4s", light: "#ff8c46", mid: "#e44d32", dark: "#a92e2b", vein: "#85352c" },
  { x: "35%", width: "22px", height: "27px", duration: "34s", delay: "-15s", swayA: "-7vw", swayB: "4vw", opacity: "0.54", type: "ginkgo", spin: "540deg", flutter: "2.9s", light: "#fff082", mid: "#edb93b", dark: "#ce8528", vein: "#996329" },
  { x: "45%", width: "27px", height: "32px", duration: "26s", delay: "-5s", swayA: "5vw", swayB: "-4vw", opacity: "0.69", type: "maple", spin: "540deg", flutter: "2.1s", light: "#ffbc55", mid: "#f07832", dark: "#c5412c", vein: "#92402b" },
  { x: "55%", width: "20px", height: "25px", duration: "30s", delay: "-23s", swayA: "-4vw", swayB: "6vw", opacity: "0.53", type: "ginkgo", spin: "-540deg", flutter: "2.6s", light: "#fff28a", mid: "#eeb843", dark: "#cb7e2b", vein: "#98632b" },
  { x: "65%", width: "29px", height: "34px", duration: "32s", delay: "-11s", swayA: "6vw", swayB: "-5vw", opacity: "0.65", type: "maple", spin: "-540deg", flutter: "2.5s", light: "#ff9c45", mid: "#e85131", dark: "#a82f2b", vein: "#87372b" },
  { x: "75%", width: "21px", height: "26px", duration: "28s", delay: "-28s", swayA: "-6vw", swayB: "4vw", opacity: "0.52", type: "ginkgo", spin: "540deg", flutter: "2.8s", light: "#fff08a", mid: "#f0c54d", dark: "#d48c2d", vein: "#9d6828" },
  { x: "85%", width: "28px", height: "33px", duration: "30s", delay: "-17s", swayA: "4vw", swayB: "-5vw", opacity: "0.67", type: "maple", spin: "540deg", flutter: "2.3s", light: "#ffad4b", mid: "#e65b31", dark: "#ad302b", vein: "#85352b" },
  { x: "94%", width: "22px", height: "27px", duration: "33s", delay: "-12s", swayA: "-4vw", swayB: "5vw", opacity: "0.55", type: "ginkgo", spin: "-540deg", flutter: "2.6s", light: "#fff28b", mid: "#edb63a", dark: "#cf8228", vein: "#95602a" },
];

const mapleLeaf = (index) => `
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="maple-fill-${index}" x1="0" y1="0" x2="0.82" y2="1">
        <stop offset="0%" stop-color="var(--leaf-light)" />
        <stop offset="58%" stop-color="var(--leaf-mid)" />
        <stop offset="100%" stop-color="var(--leaf-dark)" />
      </linearGradient>
    </defs>
    <path d="M50 4 58 27 76 13 73 36 96 32 80 51 98 62 76 68 83 89 60 80 50 98 40 80 17 89 24 68 2 62 20 51 4 32 27 36 24 13 42 27Z" fill="url(#maple-fill-${index})" stroke="var(--leaf-dark)" stroke-opacity=".38" stroke-width="2" stroke-linejoin="round" />
    <path d="M50 91 50 43M50 67 27 43M50 69 74 44M50 55 40 32M50 56 62 32M38 55 21 54M62 56 80 54" fill="none" stroke="var(--leaf-vein)" stroke-opacity=".68" stroke-width="2" stroke-linecap="round" />
  </svg>`;

const ginkgoLeaf = (index) => `
  <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="ginkgo-fill-${index}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--leaf-light)" />
        <stop offset="58%" stop-color="var(--leaf-mid)" />
        <stop offset="100%" stop-color="var(--leaf-dark)" />
      </linearGradient>
    </defs>
    <path d="M50 95C46 79 21 72 9 56-1 43 7 26 20 23c11-3 20 7 26 21-3-16-1-33 8-39 11-7 20 7 18 24 9-12 21-13 27-3 8 13-4 31-17 41-12 10-26 16-32 28Z" fill="url(#ginkgo-fill-${index})" stroke="var(--leaf-dark)" stroke-opacity=".38" stroke-width="2" stroke-linejoin="round" />
    <path d="M50 91 50 44M50 72 20 39M50 70 30 30M50 64 47 18M50 64 67 20M50 70 83 35M50 77 91 48" fill="none" stroke="var(--leaf-vein)" stroke-opacity=".68" stroke-width="1.8" stroke-linecap="round" />
  </svg>`;

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const leafLayer = document.createElement("div");
  leafLayer.className = "autumn-leaves";
  leafLayer.setAttribute("aria-hidden", "true");

  leafSettings.forEach((settings, index) => {
    const leaf = document.createElement("span");
    leaf.className = `autumn-leaf autumn-leaf--${settings.type}`;
    const spinDirection = Math.sign(Number.parseInt(settings.spin, 10)) || 1;

    Object.entries({
      "--leaf-x": settings.x,
      "--leaf-width": settings.width,
      "--leaf-height": settings.height,
      "--leaf-duration": settings.duration,
      "--leaf-delay": settings.delay,
      "--leaf-sway-a": settings.swayA,
      "--leaf-sway-b": settings.swayB,
      "--leaf-opacity": settings.opacity,
      "--leaf-spin": settings.spin,
      "--leaf-rotate-a": `${160 * spinDirection}deg`,
      "--leaf-rotate-b": `${340 * spinDirection}deg`,
      "--leaf-flutter-duration": settings.flutter,
      "--leaf-light": settings.light,
      "--leaf-mid": settings.mid,
      "--leaf-dark": settings.dark,
      "--leaf-vein": settings.vein,
    }).forEach(([property, value]) => {
      leaf.style.setProperty(property, value);
    });

    leaf.innerHTML = settings.type === "maple" ? mapleLeaf(index) : ginkgoLeaf(index);
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

const rulesImageDialog = document.querySelector("#rules-image-dialog");
const rulesImageTrigger = document.querySelector(".rules-poster-link");
const rulesImageCloseButton = rulesImageDialog?.querySelector(".rules-image-dialog-close");

if (rulesImageDialog && rulesImageTrigger && rulesImageCloseButton) {
  rulesImageTrigger.addEventListener("click", () => {
    rulesImageDialog.showModal();
    rulesImageCloseButton.focus();
  });

  rulesImageCloseButton.addEventListener("click", () => {
    rulesImageDialog.close();
  });

  rulesImageDialog.addEventListener("click", (event) => {
    if (event.target === rulesImageDialog) {
      rulesImageDialog.close();
    }
  });
}

const activityGalleryDialog = document.querySelector("#activity-gallery-dialog");
const activityGalleryDialogImage = activityGalleryDialog?.querySelector("img");
const activityGalleryDialogCaption = activityGalleryDialog?.querySelector(".activity-gallery-dialog-caption");
const activityGalleryCloseButton = activityGalleryDialog?.querySelector(".rules-image-dialog-close");

if (activityGalleryDialog && activityGalleryDialogImage && activityGalleryDialogCaption && activityGalleryCloseButton) {
  document.querySelectorAll(".activity-gallery-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const thumbnail = trigger.querySelector("img");

      if (!thumbnail) {
        return;
      }

      activityGalleryDialogImage.src = thumbnail.currentSrc || thumbnail.src;
      activityGalleryDialogImage.alt = thumbnail.alt;
      activityGalleryDialogCaption.textContent = trigger.dataset.caption || "";
      activityGalleryDialog.showModal();
      activityGalleryCloseButton.focus();
    });
  });

  activityGalleryCloseButton.addEventListener("click", () => {
    activityGalleryDialog.close();
  });

  activityGalleryDialog.addEventListener("click", (event) => {
    if (event.target === activityGalleryDialog) {
      activityGalleryDialog.close();
    }
  });
}
