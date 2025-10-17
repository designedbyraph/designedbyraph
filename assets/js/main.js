// main.js — mobile menu, project modal, smooth scroll (where applicable), contact form stub
(function () {
  'use strict';

  // Utilities
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle (for small screens)
    const mobileBtn = $('.mobile-menu-btn');
    const nav = $('.main-nav');
    if (mobileBtn && nav) {
      mobileBtn.addEventListener('click', () => {
        const expanded = nav.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });

      // Close menu when a nav link is clicked (mobile)
      const navLinks = $$('.main-nav a');
      navLinks.forEach(link => link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          mobileBtn.setAttribute('aria-expanded', 'false');
        }
      }));
    }

    // Smooth scroll for on-page anchors (only when same-page)
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // update focus for accessibility
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }
        } catch (err) {
          // ignore invalid selectors
        }
      });
    });

    // Modal: open when clicking any .project-card
    const modal = $('#project-modal');
    const modalInner = modal ? modal.querySelector('.modal-inner') : null;
    const modalImg = modal ? modal.querySelector('.modal-img') : null;
    const modalTitle = modal ? modal.querySelector('.modal-title') : null;
    const modalDesc = modal ? modal.querySelector('.modal-desc') : null;
    const modalCloseBtn = modal ? modal.querySelector('.modal-close') : null;

    function openModal({ img, title, desc, alt }) {
      if (!modal) return;
      if (modalImg) {
        modalImg.src = img || '';
        modalImg.alt = alt || title || 'Project image';
      }
      if (modalTitle) modalTitle.textContent = title || '';
      if (modalDesc) modalDesc.textContent = desc || '';
      modal.setAttribute('aria-hidden', 'false');
      // focus close button
      if (modalCloseBtn) modalCloseBtn.focus();
      // lock scroll
      document.documentElement.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      // clear content for good measure (optional)
      if (modalImg) { modalImg.src = ''; modalImg.alt = ''; }
      if (modalTitle) modalTitle.textContent = '';
      if (modalDesc) modalDesc.textContent = '';
      document.documentElement.style.overflow = '';
    }

    // Attach click handlers to project cards (works across pages)
    const projectCards = $$('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const title = card.dataset.title || card.querySelector('.pmeta h4')?.textContent || '';
        const desc = card.dataset.desc || '';
        const img = card.dataset.img || card.querySelector('img')?.src || '';
        const alt = card.querySelector('img')?.alt || title || '';
        openModal({ img, title, desc, alt });
      });

      // keyboard accessible: open on Enter / Space
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          card.click();
        }
      });
    });

    // Close button
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

    // Close on overlay click (but not clicks inside modal-inner)
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    }

    // Close on Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (modal && modal.getAttribute('aria-hidden') === 'false') closeModal();
        // also close mobile nav if open
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // Contact form handler (client-side stub)
    const contactForm = $('#contact-form');
    if (contactForm) {
      window.handleContact = function (ev) {
        ev.preventDefault();
        const form = ev.target;
        const data = {
          name: form.name?.value || '',
          email: form.email?.value || '',
          message: form.message?.value || ''
        };
        // Basic validation
        if (!data.name || !data.email || !data.message) {
          alert('Please complete all fields before sending.');
          return false;
        }

        // NOTE: This is a client-only stub. Replace with your backend endpoint or a form service.
        // For now we show a success message and reset.
        alert('Thanks — your message preview:\n\n' + JSON.stringify(data, null, 2) + '\n\nThis demo form does not send. Replace the handler to submit to a server or form service.');
        form.reset();
        return false;
      };
    }

    // Accessibility: ensure modal inner isn't tabbable when closed
    const observer = new MutationObserver(() => {
      if (!modal) return;
      const hidden = modal.getAttribute('aria-hidden') === 'true';
      const focusables = modal.querySelectorAll('a,button,input,textarea,[tabindex]');
      focusables.forEach(el => {
        if (hidden) {
          el.dataset.prevTabIndex = el.getAttribute('tabindex') || '';
          el.setAttribute('tabindex', '-1');
        } else {
          const prev = el.dataset.prevTabIndex;
          if (prev === '') el.removeAttribute('tabindex');
          else if (prev) el.setAttribute('tabindex', prev);
          else el.removeAttribute('tabindex');
        }
      });
    });
    if (modal) observer.observe(modal, { attributes: true, attributeFilter: ['aria-hidden'] });

    // Small optimization: lazy-load images (native)
    $$('img').forEach(img => {
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });

    // Prevent accidental drag on images for improved mobile feel
    $$('img').forEach(i => i.setAttribute('draggable', 'false'));
  });
})();
