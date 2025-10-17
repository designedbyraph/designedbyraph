document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const navMenu = document.querySelector(".main-nav");

  // Header hide on scroll
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const current = window.pageYOffset || document.documentElement.scrollTop;
    if (current > lastScroll && current > 100) {
      header.classList.add("hide");
    } else {
      header.classList.remove("hide");
    }
    lastScroll = current <= 0 ? 0 : current;
  });

  // Mobile menu toggle
  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      const isOpen = navMenu.classList.contains("active");
      mobileBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && e.target !== mobileBtn) {
        navMenu.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active");
        mobileBtn.setAttribute("aria-expanded", "false");
      }
    });
  }
});
// ====== Slide-in menu toggle logic ======
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const sideMenu = document.querySelector("#sideMenu");
  const overlay = document.querySelector("#menuOverlay");
  const closeBtn = document.querySelector(".close-btn");

  if (!menuToggle || !sideMenu || !overlay) return;

  function openMenu() {
    sideMenu.classList.add("active");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
  }
  function closeMenu() {
    sideMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
  }

  menuToggle.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
});
