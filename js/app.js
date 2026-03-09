/* =============================================================
   BERGSVELO — Main JS
   ============================================================= */

(function () {
  'use strict';

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close when any nav link is clicked
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on backdrop click (outside menu)
    document.addEventListener('click', e => {
      if (
        menu.classList.contains('open') &&
        !menu.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /* ---------- Sticky / scrolled header ---------- */
  const header = document.getElementById('site-header');

  if (header) {
    const updateHeader = () => {
      // Sub-pages start with .scrolled class already applied
      if (!header.classList.contains('scrolled') || window.scrollY > 50) {
        header.classList.toggle('scrolled', window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  /* ---------- Hero background ken burns ---------- */
  const heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    // Small delay so the class change triggers the CSS transition
    requestAnimationFrame(() => {
      setTimeout(() => heroBg.classList.add('loaded'), 100);
    });
  }

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealSelectors = ['.reveal', '.reveal-left', '.reveal-right'];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));

  if (revealEls.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show everything
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Contact form AJAX ---------- */
  const form       = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sūta&hellip;';
      formStatus.textContent = '';

      try {
        const data = new FormData(form);
        const res  = await fetch(form.action, { method: 'POST', body: data });

        if (res.ok) {
          formStatus.style.color = '#3d6ef0';
          formStatus.textContent = 'Paldies! Ziņa ir nosūtīta. Sazināsimies drīzumā.';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch {
        formStatus.style.color = '#e55';
        formStatus.textContent = 'Kļūda sūtot ziņu. Lūdzu mēģiniet vēlreiz vai zvaniet mums.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  /* ---------- Pricing accordion (mobile) ---------- */
  document.querySelectorAll('.pricing-cat-header').forEach(function (header) {
    /* Add chevron icon */
    var chevron = document.createElement('span');
    chevron.className = 'pricing-cat-chevron';
    chevron.innerHTML = '&#9660;'; /* ▼ */
    header.appendChild(chevron);

    header.addEventListener('click', function () {
      if (window.innerWidth > 768) return; /* desktop — always open */
      header.parentElement.classList.toggle('open');
    });
  });

})();