/**
 * LATTICE CONSTRUCTION & DEVELOPMENT
 * Client-Side Asset Protection & Anti-Scraping Engine
 */

(function() {
  'use strict';

  // 1. Silently Suppress Context Menu on Protected Images
  document.addEventListener('contextmenu', function(e) {
    if (e.target.tagName === 'IMG' || e.target.closest('.protected-media') || e.target.closest('.visual-card')) {
      e.preventDefault();
      return false;
    }
  });

  // 2. Silently Prevent Drag & Drop of Images
  document.addEventListener('dragstart', function(e) {
    if (e.target.tagName === 'IMG' || e.target.closest('.protected-media') || e.target.closest('.visual-card')) {
      e.preventDefault();
      return false;
    }
  });

  // 3. Contact Email Click-to-Copy / Reveal
  function initContactProtection() {
    const emailPills = document.querySelectorAll('[data-obfuscate="email"]');
    emailPills.forEach(pill => {
      pill.addEventListener('click', function(e) {
        e.preventDefault();
        const email = typeof window.getLatticeEmail === 'function' 
          ? window.getLatticeEmail() 
          : '';

        navigator.clipboard.writeText(email).then(() => {
          const originalText = pill.innerHTML;
          pill.innerHTML = `<span style="color: #6E7A4E;">✓</span> Copied: <strong>${email}</strong>`;
          setTimeout(() => {
            pill.innerHTML = originalText;
          }, 3500);
        }).catch(() => {
          window.location.href = `mailto:${email}?subject=Lattice%20Construction%20Inquiry`;
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactProtection);
  } else {
    initContactProtection();
  }
})();
