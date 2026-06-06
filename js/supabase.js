// Booking form -> Supabase integration (browser-only)
// Expects window.ENV = { SUPABASE_URL, SUPABASE_ANON_KEY } provided by js/env.js
// If not present, the booking form will be disabled gracefully.

let supabaseClient = null;

function loadEnvIfMissing() {
  return new Promise((resolve) => {
    if (window.ENV && window.ENV.SUPABASE_URL && window.ENV.SUPABASE_ANON_KEY) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = '/js/env.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => resolve(); // proceed gracefully if not found
    document.head.appendChild(script);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // try to load /js/env.js if ENV not present yet
  await loadEnvIfMissing();

  // Validate environment configuration
  const env = window.ENV || {};
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;
  const canInitSupabase = typeof window.supabase !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY;

  if (canInitSupabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // expose globally for read-only usages (e.g., blog listing)
    try { window.SUPABASE = supabaseClient; } catch (_) {}
  }

  const bookingForm = document.getElementById('booking-form');
  if (!bookingForm) return;

  const feedbackDiv = document.getElementById('form-feedback');
  const submitBtnInit = bookingForm.querySelector('button[type="submit"]');
  if (!canInitSupabase) {
    showFeedback(feedbackDiv, 'Booking currently unavailable. Please contact us directly while we complete setup.', 'error');
    if (submitBtnInit) submitBtnInit.disabled = true;
  }

  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedbackDiv = document.getElementById('form-feedback');
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    if (!supabaseClient) {
      showFeedback(feedbackDiv, 'Booking currently unavailable. Please contact us directly while we complete setup.', 'error');
      return;
    }
    
    // client-side validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !phone || !service || !message) {
      showFeedback(feedbackDiv, 'All fields are required.', 'error');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showFeedback(feedbackDiv, 'Enter a valid email address.', 'error');
      return;
    }
    // normalize phone and validate basic length
    const normalizedPhone = phone.replace(/[^0-9+\-()\s]/g, '');
    const digitCount = (normalizedPhone.match(/\d/g) || []).length;
    if (digitCount < 8) {
      showFeedback(feedbackDiv, 'Enter a valid phone number.', 'error');
      return;
    }

    // basic sanitization (prevent XSS via innerText later)
    const sanitize = (str) => str.replace(/[<>]/g, '');
    const cleanData = {
      name: sanitize(name),
      email: sanitize(email),
      phone: sanitize(normalizedPhone),
      service: sanitize(service),
      message: sanitize(message),
      created_at: new Date().toISOString()
    };

    try {
      submitBtn && (submitBtn.disabled = true);
      const { error } = await supabaseClient.from('bookings').insert([cleanData]);
      if (error) throw error;
      showFeedback(feedbackDiv, 'Booking successful! We’ll contact you soon.', 'success');
      bookingForm.reset();
    } catch (err) {
      console.error(err);
      showFeedback(feedbackDiv, 'Server error. Please try again later.', 'error');
    } finally {
      submitBtn && (submitBtn.disabled = false);
    }
  });

  // Contact form -> Supabase (if available). If we wire this, signal to other scripts to skip fallback binding.
  const contactForm = document.getElementById('contact-form');
  if (contactForm && supabaseClient) {
    try { window.CONTACT_FORM_SUPABASE_ENABLED = true; } catch (_) {}
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const feedback = document.getElementById('contact-feedback');

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-msg')?.value.trim();

      if (!name || !email || !message) {
        showFeedback(feedback, 'Please fill all fields.', 'error');
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        showFeedback(feedback, 'Enter a valid email address.', 'error');
        return;
      }

      const sanitize = (str) => str.replace(/[<>]/g, '');
      const cleanData = {
        name: sanitize(name),
        email: sanitize(email),
        message: sanitize(message),
        created_at: new Date().toISOString(),
      };

      try {
        const { error } = await supabaseClient.from('contact_messages').insert([cleanData]);
        if (error) throw error;
        showFeedback(feedback, 'Thanks! Your message has been sent.', 'success');
        contactForm.reset();
      } catch (err) {
        console.error(err);
        showFeedback(feedback, 'Server error. Please try again later.', 'error');
      }
    });
  }
});

function showFeedback(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = `feedback ${type}`;
  setTimeout(() => {
    if (el) el.textContent = '';
  }, 5000);
}