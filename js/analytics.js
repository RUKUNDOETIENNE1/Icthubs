// Analytics Configuration
// Replace with your analytics tracking ID
const ANALYTICS_ID = 'YOUR_ANALYTICS_ID'; // e.g., 'G-XXXXXXXXXX' for Google Analytics or ID for Plausible

// Google Analytics 4 Integration
(function() {
  if (ANALYTICS_ID === 'YOUR_ANALYTICS_ID') {
    console.log('Analytics not configured. Add your tracking ID to js/analytics.js');
    return;
  }

  // Load Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', ANALYTICS_ID);

  // Track page views
  gtag('event', 'page_view', {
    page_title: document.title,
    page_location: window.location.href
  });

  // Track form submissions
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (form.id === 'newsletter-form') {
      gtag('event', 'generate_lead', {
        event_category: 'engagement',
        event_label: 'newsletter_signup'
      });
    }
    if (form.id === 'contact-form') {
      gtag('event', 'generate_lead', {
        event_category: 'contact',
        event_label: 'contact_form_submission'
      });
    }
    if (form.id === 'booking-form') {
      gtag('event', 'generate_lead', {
        event_category: 'booking',
        event_label: 'booking_request'
      });
    }
  });

  // Track button clicks
  document.addEventListener('click', function(e) {
    const button = e.target.closest('a, button');
    if (button) {
      const text = button.textContent.trim().toLowerCase();
      if (text.includes('contact') || text.includes('book')) {
        gtag('event', 'click', {
          event_category: 'engagement',
          event_label: 'contact_cta'
        });
      }
    }
  });
})();

// Alternative: Plausible Analytics (commented out)
/*
(function() {
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = 'icthubs.com';
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
})();
*/
