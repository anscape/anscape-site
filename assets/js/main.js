/* Anscape Docs - minimal JS
   - Mobile nav toggle
   - Lightbox (images)
   - Media missing fallback (image load error)
*/

(function () {
  const doc = document;
  const body = doc.body;

  // -------------------------
  // Mobile Nav
  // -------------------------
  const navToggle = doc.getElementById("navToggle");
  const navBackdrop = doc.getElementById("navBackdrop");
  const siteNav = doc.getElementById("siteNav");

  function setNav(open) {
    body.classList.toggle("nav-open", open);
    if (navToggle) navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (navBackdrop) navBackdrop.hidden = !open;
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = !body.classList.contains("nav-open");
      setNav(open);
    });
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", () => setNav(false));
  }

  doc.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setNav(false);
      closeLightbox();
    }
  });

  // Close nav when clicking a nav link (mobile)
  if (siteNav) {
    siteNav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a && body.classList.contains("nav-open")) setNav(false);
    });
  }

  // -------------------------
  // Lightbox
  // -------------------------
  const lightbox = doc.getElementById("lightbox");
  const lightboxImg = doc.getElementById("lightboxImg");
  const lightboxCaption = doc.getElementById("lightboxCaption");

  function openLightbox(src, caption) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = caption ? caption : "拡大画像";
    if (lightboxCaption) lightboxCaption.textContent = caption || "";
    lightbox.hidden = false;
    body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    if (!lightbox.hidden) {
      lightbox.hidden = true;
      body.style.overflow = "";
      // release src to reduce memory on mobile
      lightboxImg.src = "";
      if (lightboxCaption) lightboxCaption.textContent = "";
    }
  }

  // expose for Escape handler
  window.closeLightbox = closeLightbox;

  doc.addEventListener("click", (e) => {
    const closeEl = e.target.closest("[data-lightbox-close]");
    if (closeEl) {
      e.preventDefault();
      closeLightbox();
      return;
    }

    const trigger = e.target.closest('a[data-lightbox="true"]');
    if (!trigger) return;

    const href = trigger.getAttribute("href");
    if (!href || href === "#") return;

    e.preventDefault();
    const caption = trigger.getAttribute("data-caption") || "";
    openLightbox(href, caption);
  });

  // -------------------------
  // Media missing fallback (img error)
  // -------------------------
  // Capture phase: image "error" does not bubble reliably.
  doc.addEventListener(
    "error",
    (e) => {
      const target = e.target;
      if (!(target instanceof HTMLImageElement)) return;
      const figure = target.closest("figure");
      if (figure) figure.classList.add("is-missing");
    },
    true
  );
})();