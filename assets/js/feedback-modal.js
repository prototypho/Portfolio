// Feedback Modal Handler
document.addEventListener('DOMContentLoaded', function() {
  const feedbackModal = document.getElementById('modal-feedback');
  const feedbackLinks = document.querySelectorAll('.feedback-link');
  const closeModalBtn = document.getElementById('feedback-modal-close');
  const customerNameEl = document.getElementById('feedback-customer-name');
  const feedbackTextEl = document.getElementById('feedback-text');

  // Open modal when clicking feedback link
  feedbackLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const customerName = this.getAttribute('data-customer-name');
      const feedback = this.getAttribute('data-feedback');
      const rating = parseInt(this.getAttribute('data-rating')) || 5;
      
      // Update modal content
      customerNameEl.textContent = customerName;
      feedbackTextEl.textContent = feedback;
      
      // Update star rating
      const stars = document.querySelectorAll('.feedback-stars .star');
      stars.forEach((star, index) => {
        if (index < rating) {
          setTimeout(() => {
            star.classList.add('filled');
          }, index * 100);
        } else {
          star.classList.remove('filled');
        }
      });
      
      // Show modal
      feedbackModal.setAttribute('aria-hidden', 'false');
      feedbackModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeFeedbackModal() {
    feedbackModal.setAttribute('aria-hidden', 'true');
    feedbackModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeModalBtn.addEventListener('click', closeFeedbackModal);

  // Close when clicking outside
  feedbackModal.addEventListener('click', function(e) {
    if (e.target === feedbackModal) {
      closeFeedbackModal();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && feedbackModal.getAttribute('aria-hidden') === 'false') {
      closeFeedbackModal();
    }
  });
});
