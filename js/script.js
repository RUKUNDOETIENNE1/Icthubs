// global header/footer loader + hamburger + contact form (no supabase for contact)
document.addEventListener('DOMContentLoaded', () => {
  loadHeaderFooter();
  setupHamburger();
  setupContactForm();
});

function loadHeaderFooter() {
  const headerHtml = `
    <header class="site-header">
      <div class="container header-container">
        <a href="/" class="logo"><img src="/images/icthubs-logo.png" alt="ICTHubs logo" width="160" height="36" fetchpriority="high"></a>
        <button class="hamburger" id="hamburgerBtn" aria-label="Menu">☰</button>
        <nav class="nav-links" id="navLinks">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/projects">Projects</a>
          <a href="/booking">Book</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </header>
  `;
  const footerHtml = `
    <footer>
      <div class="container">
        <div class="footer-grid">
          <div><strong>ICTHubs</strong><br>Intelligence. Insight. Action.</div>
          <div><strong>Contact</strong><br>hello@icthubs.com<br>+250 788 917126</div>
          <div><strong>Kigali, Rwanda</strong><br>KN 74 St</div>
          <div><strong>Follow</strong><br>
            <a href="https://www.instagram.com/icthubs/" target="_blank" rel="noopener">Instagram</a><br>
            <a href="https://www.facebook.com/icthubs" target="_blank" rel="noopener">Facebook</a>
          </div>
        </div>
        <div class="copyright">© 2025 ICTHubs — All rights reserved.</div>
      </div>
    </footer>
  `;
  const headerContainer = document.getElementById('header-container');
  const footerContainer = document.getElementById('footer-container');
  if (headerContainer) headerContainer.innerHTML = headerHtml;
  if (footerContainer) footerContainer.innerHTML = footerHtml;
}

function setupHamburger() {
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('navLinks');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
}

function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;
  // If Supabase wiring is present, do not attach fallback handler
  try { if (window.CONTACT_FORM_SUPABASE_ENABLED) return; } catch (_) {}
  {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const msg = document.getElementById('contact-msg')?.value.trim();
      const feedback = document.getElementById('contact-feedback');
      if (!name || !email || !msg) {
        feedback.textContent = 'Please fill all fields.';
        feedback.className = 'feedback error';
        return;
      }
      if (!email.includes('@')) {
        feedback.textContent = 'Valid email required.';
        feedback.className = 'feedback error';
        return;
      }
      // simulate success (no backend)
      feedback.textContent = 'Thanks! We’ll reply within 24h.';
      feedback.className = 'feedback success';
      contactForm.reset();
      setTimeout(() => { feedback.textContent = ''; }, 4000);
    });
  }
}