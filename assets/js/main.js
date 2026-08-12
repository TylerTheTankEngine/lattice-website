/**
 * LATTICE CONSTRUCTION - MAIN APPLICATION LOGIC
 * Navigation, Anti-Spam Gate & GitHub Pages Form Delivery
 * Consumes settings dynamically from assets/js/config.js
 */

(function() {
  'use strict';

  const formLoadTime = Date.now();
  let lastSubmitTime = 0;

  const contactForm = document.getElementById('latticeInquiryForm');
  const statusMsg = document.getElementById('formStatusMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();

      const config = window.LATTICE_CONFIG || {};
      const spamConfig = config.spamProtection || { rateLimitMs: 45000, minSubmitTimeMs: 1200, honeypotFieldId: 'formHoney' };
      const messages = config.messages || {
        success: 'Inquiry submitted successfully. Our team will review and reach out within 24–48 hours.',
        error: 'Inquiry could not be submitted. Please try again.',
        rateLimit: 'Please wait a moment before submitting another inquiry.',
        requiredFields: 'Please fill in all required fields.'
      };

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      // Anti-Spam Gate 1: Honeypot Trap
      const honeypot = document.getElementById(spamConfig.honeypotFieldId)?.value;
      if (honeypot) {
        console.warn('Spam trap triggered.');
        return;
      }

      // Anti-Spam Gate 2: Fast Bot Submission Threshold
      if (Date.now() - formLoadTime < spamConfig.minSubmitTimeMs) {
        console.warn('Speed bot submission intercepted.');
        return;
      }

      // Anti-Spam Gate 3: Rate Limiting Cooldown
      const now = Date.now();
      if (now - lastSubmitTime < spamConfig.rateLimitMs) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.innerHTML = `<span>◆</span> ${messages.rateLimit}`;
          statusMsg.style.display = 'flex';
        }
        return;
      }

      const name = document.getElementById('formName')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      const county = document.getElementById('formCounty')?.value || 'Not specified';
      const message = document.getElementById('formMessage')?.value.trim();

      if (!name || !email || !message) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.innerHTML = `<span>◆</span> ${messages.requiredFields}`;
          statusMsg.style.display = 'flex';
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span>Transmitting...</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 6v6l4 2"></path></svg>
      `;

      if (statusMsg) {
        statusMsg.style.display = 'none';
        statusMsg.className = 'form-status-msg';
      }

      const endpoint = config.formEndpoint;

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            county: county,
            message: message,
            _subject: `New Lattice Project Inquiry: ${name} (${county})`,
            _template: 'table'
          })
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success !== 'false') {
          lastSubmitTime = Date.now();
          
          if (statusMsg) {
            statusMsg.className = 'form-status-msg success';
            statusMsg.innerHTML = `<span>◆</span> ${messages.success}`;
            statusMsg.style.display = 'flex';
          }
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        if (statusMsg) {
          statusMsg.className = 'form-status-msg error';
          statusMsg.innerHTML = `<span>◆</span> ${messages.error}`;
          statusMsg.style.display = 'flex';
        }
      }

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }, 3500);
    });
  }
})();
