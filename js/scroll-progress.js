// Scroll Progress Indicator
document.addEventListener('DOMContentLoaded', function() {
  const scrollProgress = document.getElementById('scrollProgress');
  
  if (!scrollProgress) return;
  
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
  }
  
  // Update on scroll
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  
  // Initial update
  updateScrollProgress();
});
