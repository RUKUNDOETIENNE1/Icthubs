// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const isExpanded = faqItem.getAttribute('aria-expanded') === 'true';
      
      // Close all other FAQ items
      faqQuestions.forEach(otherQuestion => {
        const otherItem = otherQuestion.parentElement;
        if (otherItem !== faqItem) {
          otherItem.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Toggle current FAQ item
      faqItem.setAttribute('aria-expanded', !isExpanded);
    });
    
    // Add keyboard support
    question.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
});
