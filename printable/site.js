// Printable Website Client Script
document.addEventListener('DOMContentLoaded', () => {
  const config = window.PRINTABLE_SITE || {};

  // 1. Mobile Navigation Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('open');
      mainNav.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !mainNav.contains(e.target) && mainNav.classList.contains('open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
      }
    });

    // Close menu when clicking a link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('open');
        mainNav.classList.remove('open');
      });
    });
  }

  // 2. Play Store Links
  for (const link of document.querySelectorAll('[data-play-store]')) {
    if (!config.playStoreUrl) continue;
    link.href = config.playStoreUrl;
    link.hidden = false;
  }

  // 3. Support Contact Form Submission (Nodemailer Email Dispatch)
  const contactForm = document.querySelector('.support-form');
  const formStatusContainer = document.getElementById('form-status-container');

  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.innerHTML;

      // Extract form values
      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name')?.trim() || '',
        email: formData.get('email')?.trim() || '',
        appName: formData.get('app_name')?.trim() || 'Printable AI 3D model Generator',
        feedback: formData.get('feedback')?.trim() || '',
      };

      // Client-side quick check
      if (!payload.name || !payload.email || !payload.feedback) {
        showFormAlert('error', 'Please fill in all required fields.');
        return;
      }

      // Set loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message to techtornix@gmail.com...';

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          // Success!
          showFormAlert(
            'success',
            `<strong>Message Delivered!</strong> ${result.message} <br><small>Ticket Reference: <code>${result.data?.id || 'Received'}</code></small>`
          );
          contactForm.reset();
          const appNameInput = document.getElementById('app-name');
          if (appNameInput) appNameInput.value = 'Printable AI 3D model Generator';
        } else {
          const errMsg = result.error || 'Failed to submit form. Please try again.';
          showFormAlert('error', `<strong>Delivery Notice:</strong> ${errMsg}`);
        }
      } catch (err) {
        console.warn('Direct API submission error:', err);
        showFormAlert(
          'error',
          '<strong>Connection Notice:</strong> Could not connect to the backend server. Please verify your internet connection.'
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });
  }

  function showFormAlert(type, message) {
    if (!formStatusContainer) return;
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    const icon = type === 'success' ? '✔' : '⚠';
    formStatusContainer.innerHTML = `
      <div class="alert ${alertClass}">
        <span style="font-size: 1.2rem;">${icon}</span>
        <div>${message}</div>
      </div>
    `;
    formStatusContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
});
