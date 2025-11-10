/* main.js - CSP-safe interactions (no inline onclick, no eval)
   Includes download button ripple effect */
(function () {
  'use strict';

  // DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    var mobileBtn = document.querySelector('.mobile-menu-btn');
    var nav = document.querySelector('.nav');

    if (mobileBtn && nav) {
      mobileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = nav.classList.toggle('mobile-open');
        mobileBtn.classList.toggle('active', isOpen);
        if (isOpen) {
          nav.style.display = 'flex';
          nav.style.flexDirection = 'column';
          nav.style.gap = '12px';
          nav.style.padding = '16px';
          nav.style.background = 'rgba(0,0,0,0.85)';
        } else {
          nav.style.display = '';
          nav.style.flexDirection = '';
          nav.style.gap = '';
          nav.style.padding = '';
          nav.style.background = '';
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', function (ev) {
        var t = ev.target;
        if (nav.classList.contains('mobile-open') && !nav.contains(t) && !mobileBtn.contains(t)) {
          nav.classList.remove('mobile-open');
          mobileBtn.classList.remove('active');
          nav.style.display = '';
        }
      });
    }

    // Smooth scroll for internal anchors
    document.addEventListener('click', function (ev) {
      var link = ev.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      var el = document.querySelector(href);
      if (el) {
        ev.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Back to top button (optional if present)
    var backBtn = document.getElementById('backToTop');
    function updateBackBtn() {
      if (!backBtn) return;
      if (window.scrollY > 300) backBtn.classList.remove('hidden');
      else backBtn.classList.add('hidden');
    }
    window.scrollToTop = function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('scroll', updateBackBtn);
    updateBackBtn();

    // Intersection Observer for animate-in elements
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    var items = document.querySelectorAll('.feature-card, .stat, .step, .faq-item, .download-cta, .hero-copy');
    items.forEach(function (i) { io.observe(i); });

    // Ripple effect for download buttons
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.download-btn');
      if (!btn) return;

      var rect = btn.getBoundingClientRect();
      var circle = document.createElement('span');
      var diameter = Math.max(rect.width, rect.height);
      var radius = diameter / 2;

      circle.style.width = circle.style.height = diameter + 'px';
      circle.style.left = (e.clientX - rect.left - radius) + 'px';
      circle.style.top = (e.clientY - rect.top - radius) + 'px';
      circle.className = 'ripple';

      var existing = btn.getElementsByClassName('ripple')[0];
      if (existing) existing.remove();
      btn.appendChild(circle);

      // Remove ripple after animation
      setTimeout(function () {
        try { circle.remove(); } catch (err) {}
      }, 700);
    }, false);
  });
})();
