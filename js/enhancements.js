// UI enhancements: nav augmentation, hero carousel, blog fallback, scroll effects, animations
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    // Run after header/footer is injected
    if (document.readyState === 'complete') {
      requestAnimationFrame(augmentNav);
    } else {
      setTimeout(augmentNav, 0);
    }
    initCarousels();
    setupBlogFallback();
    initScrollEffects();
    initScrollAnimations();
  });

  function augmentNav() {
    const nav = document.getElementById('navLinks');
    if (!nav) {
      const host = document.getElementById('header-container') || document.body;
      const observer = new MutationObserver(() => {
        const n = document.getElementById('navLinks');
        if (n) {
          observer.disconnect();
          augmentNav();
        }
      });
      observer.observe(host, { childList: true, subtree: true });
      return;
    }
    const links = Array.from(nav.querySelectorAll('a'));
    const hasBlog = links.some(a => (a.getAttribute('href') || '') === '/blog');
    if (!hasBlog) {
      const blogLink = document.createElement('a');
      blogLink.href = '/blog';
      blogLink.textContent = 'Blog';
      const bookLink = links.find(a => (a.getAttribute('href') || '') === '/booking');
      if (bookLink && bookLink.parentNode === nav) {
        nav.insertBefore(blogLink, bookLink);
      } else {
        nav.appendChild(blogLink);
      }
    }
  }

  // Initialize all carousels on the page
  function initCarousels() {
    const carousels = Array.from(document.querySelectorAll('.carousel'));
    carousels.forEach((carousel) => initOneCarousel(carousel));
  }

  function initOneCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');
    if (!track || slides.length === 0) return;

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'dot' + (i === 0 ? ' active' : '');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dotsContainer && dotsContainer.appendChild(b);
      return b;
    });

    let index = 0;
    const setIndex = (i) => { index = (i + slides.length) % slides.length; update(); };
    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    };

    prevBtn && prevBtn.addEventListener('click', () => setIndex(index - 1));
    nextBtn && nextBtn.addEventListener('click', () => setIndex(index + 1));
    dots.forEach((d, i) => d.addEventListener('click', () => setIndex(i)));

    let autoplay = setInterval(() => setIndex(index + 1), 5000);
    const pause = () => { if (autoplay) { clearInterval(autoplay); autoplay = null; } };
    const resume = () => { if (!autoplay) autoplay = setInterval(() => setIndex(index + 1), 5000); };
    carousel.addEventListener('mouseenter', pause);
    carousel.addEventListener('mouseleave', resume);

    update();
  }

  // Fallback static posts if Supabase is not configured
  function setupBlogFallback() {
    const list = document.getElementById('blog-list');
    if (!list) return;
    if (window.SUPABASE) return; // real data should be loaded via blog.js
    const posts = [
      { title: 'Building for Africa: Principles for Reliable Products', excerpt: 'Practical lessons for unstable power, low bandwidth, and price-sensitive markets.', date: '2026-04-20' },
      { title: 'From Manual to Automated: Workflow Automation Wins', excerpt: 'How small automations save thousands of hours for SMEs.', date: '2026-03-15' },
      { title: 'Using AI Responsibly in Local Contexts', excerpt: 'Bias, data scarcity, and human-in-the-loop patterns that work.', date: '2026-02-10' }
    ];
    list.innerHTML = '';
    posts.forEach(p => {
      const card = document.createElement('article');
      card.className = 'blog-card';
      const h3 = document.createElement('h3');
      h3.textContent = p.title;
      const ex = document.createElement('p');
      ex.className = 'blog-excerpt';
      ex.textContent = p.excerpt;
      const meta = document.createElement('div');
      meta.className = 'blog-meta';
      meta.textContent = new Date(p.date).toLocaleDateString();
      card.appendChild(h3); card.appendChild(ex); card.appendChild(meta);
      list.appendChild(card);
    });
    const empty = document.getElementById('blog-empty');
    if (empty) empty.textContent = 'Showing sample posts. Connect Supabase to load real articles.';
  }

  // Scroll effects for header
  function initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (header) {
        if (currentScroll > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  // Intersection Observer for scroll animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe cards, features, and project cards
    const animatedElements = document.querySelectorAll('.card, .project-card, .feature, .service-item, .project-full-card');
    
    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(el);
    });
  }
})();
