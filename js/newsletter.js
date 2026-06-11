// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterMessage = document.getElementById('newsletter-message');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const email = newsletterEmail.value.trim();
      
      if (!email) {
        showNewsletterMessage('Please enter your email address', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showNewsletterMessage('Please enter a valid email address', 'error');
        return;
      }

      // Check if Supabase is configured
      if (typeof supabase === 'undefined' || !supabase) {
        showNewsletterMessage('Newsletter service is not configured yet. Please contact us directly.', 'error');
        return;
      }

      // Check if credentials are still placeholder
      const configScript = document.querySelector('script[src*="supabase-config.js"]');
      if (configScript) {
        // Try to detect if credentials are still placeholders
        fetch('/js/supabase-config.js')
          .then(response => response.text())
          .then(text => {
            if (text.includes('YOUR_SUPABASE_URL') || text.includes('YOUR_SUPABASE_ANON_KEY')) {
              showNewsletterMessage('Newsletter service is being configured. Please try again later.', 'error');
            } else {
              // Proceed with subscription
              handleSubscription(email);
            }
          })
          .catch(() => {
            // If we can't check, try anyway
            handleSubscription(email);
          });
      } else {
        handleSubscription(email);
      }
    });
  }

  async function handleSubscription(email) {
    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Subscribing...';
    showNewsletterMessage('', '');

    try {
      await subscribeToNewsletter(email);
      showNewsletterMessage('Thank you for subscribing! You will receive our latest updates.', 'success');
      newsletterForm.reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      if (error.message === 'This email is already subscribed') {
        showNewsletterMessage('This email is already subscribed to our newsletter.', 'error');
      } else {
        showNewsletterMessage('Subscription failed. Please try again or contact us directly.', 'error');
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }

  function showNewsletterMessage(message, type) {
    if (newsletterMessage) {
      newsletterMessage.textContent = message;
      newsletterMessage.className = 'newsletter-message';
      if (type) {
        newsletterMessage.classList.add(type);
      }
      
      // Auto-hide success messages after 5 seconds
      if (type === 'success') {
        setTimeout(() => {
          newsletterMessage.textContent = '';
          newsletterMessage.className = 'newsletter-message';
        }, 5000);
      }
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});
