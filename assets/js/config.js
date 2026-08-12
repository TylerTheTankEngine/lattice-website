/**
 * LATTICE CONSTRUCTION & DEVELOPMENT
 * Centralized Client & System Configuration
 * 
 * All operational settings, form delivery endpoints, anti-spam parameters,
 * UI copy strings, and brand theme tokens are maintained in this single source of truth.
 */

window.LATTICE_CONFIG = {
  // Brand & Legal Metadata
  company: {
    name: 'Lattice Construction & Development',
    trade: 'Florida Licensed General Contractor & Constructor',
    license: 'CGC1530057',
    website: 'https://lattice.construction',
    tagline: 'Inside Out Construction & Development',
    serviceAreas: ['Orange County', 'Miami-Dade County', 'Broward County', 'Lee County', 'Collier County']
  },

  // Direct email & phone channels (Disabled for complete privacy / anti-scraping)
  email: null,
  phone: null,

  /**
   * Anonymous Form Delivery Endpoint for GitHub Pages
   * Uses FormSubmit Random Hash Token (Zero exposed email in JavaScript)
   */
  formEndpoint: 'https://formsubmit.co/ajax/534f347e7f5de7402428073ff71f069a',

  // Anti-Spam & Security Parameters
  spamProtection: {
    rateLimitMs: 45000,          // 45-second cooldown between submissions
    minSubmitTimeMs: 1200,       // Minimum time in ms required before submit is considered human
    honeypotFieldId: 'formHoney' // Hidden honeypot input ID
  },

  // Centralized UI Feedback Messages
  messages: {
    success: 'Inquiry submitted successfully. Our team will review and reach out within 24–48 hours.',
    error: 'Inquiry could not be submitted. Please try again.',
    rateLimit: 'Please wait a moment before submitting another inquiry.',
    requiredFields: 'Please fill in all required fields.'
  },

  // Brand Theme Tokens for Generative Canvas & Scripts
  theme: {
    olive: '#6E7A4E',
    oliveRgb: '110, 122, 78',
    obsidian: '#272727',
    obsidianRgb: '39, 39, 39',
    terracotta: '#B66A4C',
    terracottaRgb: '182, 106, 76',
    archWhite: '#F4F2ED'
  }
};

/**
 * Global helper
 */
window.getLatticeEmail = function() {
  return '';
};
