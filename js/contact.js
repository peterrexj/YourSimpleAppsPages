// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Load company data
  loadCompanyData();
  
  // Set up form submission handler
  setupContactForm();
});

/**
 * Load company data from JSON file
 */
function loadCompanyData() {
  // Try to fetch the JSON file
  fetch('data/apps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Company data loaded successfully from JSON file');
      
      // Store the data globally so it can be accessed by other functions
      window.appsData = data;
      
      // Update company info
      updateCompanyInfo(data.company);
      
      // Update contact info with company data
      updateContactInfo(data.contact, data.company);
      
      // Populate app dropdown
      populateAppDropdown(data.apps);
    })
    .catch(error => {
      console.error('Error loading company data:', error);
    });
}

/**
 * Update company information in the page
 */
function updateCompanyInfo(company) {
  // Update page title
  document.title = `Contact Us - ${company.name}`;
  
  // Update logo
  const logoElements = document.querySelectorAll('.header-logo, .footer-logo-img');
  logoElements.forEach(logo => {
    logo.src = company.logo;
    logo.alt = `${company.name} Logo`;
  });
  
  // Update company name in footer
  const footerCompanyName = document.querySelector('.footer-company-name');
  if (footerCompanyName) {
    footerCompanyName.textContent = company.name;
  }
  
  // Update copyright
  const copyright = document.querySelector('.footer-copyright p');
  if (copyright) {
    const currentYear = new Date().getFullYear();
    const companyNameSpan = copyright.querySelector('.company-name');
    if (companyNameSpan) {
      companyNameSpan.textContent = company.name;
    } else {
      copyright.textContent = `© ${currentYear} ${company.name}. All rights reserved.`;
    }
  }
  
  // Store company email globally for use in the contact form
  window.companyEmail = company.email;
  
  // Update email in contact info if it exists
  if (company.email) {
    const emailElement = document.getElementById('contact-email');
    if (emailElement) {
      emailElement.textContent = company.email;
      emailElement.href = `mailto:${company.email}`;
    }
  }
}

/**
 * Update contact information
 */
function updateContactInfo(contact, company) {
  // Use company email instead of contact email
  const companyEmail = company && company.email ? company.email : 'support@commonwealthbank.com';
  
  // Update email with animation
  const emailElement = document.getElementById('contact-email');
  if (emailElement) {
    // Add a subtle typing animation effect
    animateTextChange(emailElement, companyEmail);
    emailElement.href = `mailto:${companyEmail}`;
    
    // Add tooltip with additional info
    emailElement.setAttribute('title', 'Click to send us an email');
    emailElement.setAttribute('data-contact-type', 'email');
  }
  
  // Update phone number with formatting and animation
  const phoneElement = document.getElementById('contact-phone');
  if (phoneElement && contact.phone) {
    // Format phone number for display if needed
    const formattedPhone = formatPhoneNumber(contact.phone);
    animateTextChange(phoneElement, formattedPhone);
    phoneElement.href = `tel:${contact.phone.replace(/\D/g, '')}`; // Remove non-digits for tel: link
    
    // Add tooltip
    phoneElement.setAttribute('title', 'Click to call us');
    phoneElement.setAttribute('data-contact-type', 'phone');
  }
  
  // Update address with animation and map link
  const addressElement = document.getElementById('contact-address');
  if (addressElement && contact.address) {
    animateTextChange(addressElement, contact.address);
    
    // Make address clickable to open in maps
    addressElement.style.cursor = 'pointer';
    addressElement.setAttribute('title', 'Click to view on map');
    addressElement.setAttribute('data-contact-type', 'address');
    
    // Add event listener to open address in maps
    addressElement.addEventListener('click', () => {
      const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`;
      window.open(mapUrl, '_blank');
    });
  }
  
  // Set up ticket link with enhanced event listener
  const ticketLink = document.getElementById('create-ticket');
  if (ticketLink) {
    ticketLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Use company email for support ticket
      const supportEmail = companyEmail;
      const subject = "Support Ticket Request";
      const body = "I would like to create a support ticket for the following issue:\n\n";
      
      // Create mailto link
      const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Add animation before opening email client
      this.classList.add('clicked');
      setTimeout(() => {
        window.location.href = mailtoLink;
        this.classList.remove('clicked');
      }, 300);
    });
    
    // Add CSS for click animation
    const style = document.createElement('style');
    style.textContent = `
      .contact-info-item .contact-info-icon.clicked {
        transform: rotate(360deg) scale(1.2);
        transition: transform 0.3s ease;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Set up FAQ link with enhanced event listener
  const faqLink = document.getElementById('view-faq');
  if (faqLink) {
    faqLink.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Create a modal for FAQ instead of alert
      showFAQModal();
    });
  }
  
  // Update social links with data attributes and enhanced animations
  const socialContainer = document.getElementById('contact-social-icons');
  if (socialContainer && contact.social) {
    const socialLinks = socialContainer.querySelectorAll('[data-platform]');
    socialLinks.forEach(link => {
      const platform = link.getAttribute('data-platform');
      if (contact.social[platform]) {
        link.href = contact.social[platform];
        
        // Add platform name as tooltip
        link.setAttribute('title', `Follow us on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
        
        // Add hover animation
        link.addEventListener('mouseenter', () => {
          link.style.transform = 'translateY(-5px) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', () => {
          link.style.transform = '';
        });
      }
    });
  }
  
  // Update all other social links in footer
  const footerSocialLinks = document.querySelectorAll('.footer-social a');
  footerSocialLinks.forEach(link => {
    const icon = link.querySelector('i');
    if (!icon) return;
    
    if (icon.classList.contains('fa-facebook-f') && contact.social.facebook) {
      link.href = contact.social.facebook;
      link.setAttribute('title', 'Follow us on Facebook');
    } else if (icon.classList.contains('fa-twitter') && contact.social.twitter) {
      link.href = contact.social.twitter;
      link.setAttribute('title', 'Follow us on Twitter');
    } else if (icon.classList.contains('fa-instagram') && contact.social.instagram) {
      link.href = contact.social.instagram;
      link.setAttribute('title', 'Follow us on Instagram');
    } else if (icon.classList.contains('fa-linkedin-in') && contact.social.linkedin) {
      link.href = contact.social.linkedin;
      link.setAttribute('title', 'Connect with us on LinkedIn');
    }
  });
  
  // Add enhanced animations to contact info items
  initContactAnimations();
}

/**
 * Format phone number for better display
 * @param {string} phone - The raw phone number
 * @returns {string} - Formatted phone number
 */
function formatPhoneNumber(phone) {
  // Simple formatting, can be expanded for different country formats
  const cleaned = phone.replace(/\D/g, '');
  
  // For US-style numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  // For international or other formats, keep original
  return phone;
}

/**
 * Animate text change with a typing effect
 * @param {HTMLElement} element - The element to animate
 * @param {string} newText - The new text content
 */
function animateTextChange(element, newText) {
  // Store original text
  const originalText = element.textContent;
  
  // If texts are the same, no need to animate
  if (originalText === newText) return;
  
  // Clear the element
  element.textContent = '';
  
  // Add a typing cursor
  element.style.borderRight = '2px solid var(--primary-color)';
  element.style.animation = 'blink-caret 0.75s step-end infinite';
  
  // Add CSS for cursor blink if not already added
  if (!document.getElementById('typing-animation-style')) {
    const style = document.createElement('style');
    style.id = 'typing-animation-style';
    style.textContent = `
      @keyframes blink-caret {
        from, to { border-color: transparent }
        50% { border-color: var(--primary-color) }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Type out the new text
  let i = 0;
  const typeInterval = setInterval(() => {
    if (i < newText.length) {
      element.textContent += newText.charAt(i);
      i++;
    } else {
      clearInterval(typeInterval);
      element.style.borderRight = 'none';
      element.style.animation = '';
    }
  }, 30); // Adjust speed as needed
}

/**
 * Show a modal with FAQ content
 */
function showFAQModal() {
  // Create modal container
  const modal = document.createElement('div');
  modal.className = 'faq-modal';
  
  // Create modal content
  modal.innerHTML = `
    <div class="faq-modal-content">
      <div class="faq-modal-header">
        <h3>Frequently Asked Questions</h3>
        <button class="faq-modal-close">&times;</button>
      </div>
      <div class="faq-modal-body">
        <div class="faq-item">
          <h4>How do I download your apps?</h4>
          <p>Our apps are available on the App Store for iOS devices and Google Play Store for Android devices. Simply search for the app name or visit the app details page on our website.</p>
        </div>
        <div class="faq-item">
          <h4>Do you offer technical support?</h4>
          <p>Yes, we provide technical support for all our applications. You can contact us via email, phone, or by submitting a support ticket through our website.</p>
        </div>
        <div class="faq-item">
          <h4>How do I request a feature?</h4>
          <p>We welcome feature requests! Please send us an email with your suggestion or use the contact form on this page.</p>
        </div>
        <div class="faq-item">
          <h4>Are your apps free to use?</h4>
          <p>Some of our apps offer free versions with basic functionality, while others require a one-time purchase or subscription. Please check the individual app pages for pricing details.</p>
        </div>
      </div>
    </div>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .faq-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .faq-modal-content {
      background-color: var(--card-bg);
      border-radius: var(--border-radius);
      box-shadow: var(--card-shadow);
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      transform: translateY(-20px);
      transition: transform 0.3s ease;
    }
    
    .faq-modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 20px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .faq-modal-header h3 {
      margin: 0;
      color: var(--primary-color);
    }
    
    .faq-modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: color 0.2s ease;
    }
    
    .faq-modal-close:hover {
      color: var(--primary-color);
    }
    
    .faq-modal-body {
      padding: 20px;
    }
    
    .faq-item {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .faq-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .faq-item h4 {
      margin: 0 0 10px 0;
      color: var(--text-color);
      font-weight: 600;
    }
    
    .faq-item p {
      margin: 0;
      color: var(--text-secondary);
      line-height: 1.5;
    }
  `;
  document.head.appendChild(style);
  
  // Add to document
  document.body.appendChild(modal);
  
  // Show with animation
  setTimeout(() => {
    modal.style.opacity = '1';
    modal.querySelector('.faq-modal-content').style.transform = 'translateY(0)';
  }, 10);
  
  // Close button functionality
  const closeBtn = modal.querySelector('.faq-modal-close');
  closeBtn.addEventListener('click', () => {
    modal.style.opacity = '0';
    modal.querySelector('.faq-modal-content').style.transform = 'translateY(-20px)';
    setTimeout(() => {
      document.body.removeChild(modal);
    }, 300);
  });
  
  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeBtn.click();
    }
  });
}

/**
 * Initialize animations for contact page elements
 */
function initContactAnimations() {
  // Animate contact info items
  animateContactItems();
  
  // Add hover effects for social icons
  addSocialIconEffects();
  
  // Add scroll-triggered animations
  initScrollAnimations();
  
  // Add floating effect to contact info container
  addFloatingEffect();
  
  // Add interactive elements
  addInteractiveElements();
}

/**
 * Add subtle floating animation to contact info container
 */
function addFloatingEffect() {
  const container = document.querySelector('.contact-info-container');
  if (!container) return;
  
  // Add floating animation
  container.style.animation = 'float 6s ease-in-out infinite';
  
  // Add CSS if not already added
  if (!document.getElementById('floating-animation-style')) {
    const style = document.createElement('style');
    style.id = 'floating-animation-style';
    style.textContent = `
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0px);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Add interactive elements to enhance user experience
 */
function addInteractiveElements() {
  // Add pulse effect to contact section titles
  const sectionTitles = document.querySelectorAll('.contact-section-title');
  sectionTitles.forEach(title => {
    title.addEventListener('mouseenter', () => {
      const icon = title.querySelector('.contact-section-icon');
      if (icon) {
        icon.style.transform = 'scale(1.2)';
        icon.style.backgroundColor = 'var(--primary-color)';
        icon.style.color = 'white';
      }
    });
    
    title.addEventListener('mouseleave', () => {
      const icon = title.querySelector('.contact-section-icon');
      if (icon) {
        icon.style.transform = '';
        icon.style.backgroundColor = '';
        icon.style.color = '';
      }
    });
  });
  
  // Add transition for smooth animation
  const style = document.createElement('style');
  style.textContent = `
    .contact-section-icon {
      transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Add staggered animations to contact info items
 */
function animateContactItems() {
  const contactItems = document.querySelectorAll('.contact-info-item');
  
  contactItems.forEach((item, index) => {
    // Add a slight delay to each item for a staggered animation effect
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100);
    
    // Add enhanced hover effects
    item.addEventListener('mouseenter', () => {
      // Scale up slightly
      item.style.transform = 'translateX(5px) scale(1.02)';
      item.style.backgroundColor = 'rgba(var(--primary-color-rgb), 0.08)';
      
      // Animate the icon
      const icon = item.querySelector('.contact-info-icon');
      if (icon) {
        icon.style.transform = 'rotate(10deg) scale(1.1)';
        icon.style.backgroundColor = 'var(--primary-color)';
        icon.style.color = 'white';
        icon.style.boxShadow = '0 5px 15px rgba(var(--primary-color-rgb), 0.3)';
      }
      
      // Highlight the content
      const content = item.querySelector('.contact-info-content');
      if (content) {
        const heading = content.querySelector('h4');
        if (heading) {
          heading.style.color = 'var(--primary-color)';
          heading.style.transform = 'translateX(3px)';
        }
      }
    });
    
    item.addEventListener('mouseleave', () => {
      // Reset styles
      item.style.transform = '';
      item.style.backgroundColor = '';
      
      const icon = item.querySelector('.contact-info-icon');
      if (icon) {
        icon.style.transform = '';
        icon.style.backgroundColor = '';
        icon.style.color = '';
        icon.style.boxShadow = '';
      }
      
      const content = item.querySelector('.contact-info-content');
      if (content) {
        const heading = content.querySelector('h4');
        if (heading) {
          heading.style.color = '';
          heading.style.transform = '';
        }
      }
    });
  });
  
  // Add CSS for smooth transitions
  const style = document.createElement('style');
  style.textContent = `
    .contact-info-item {
      transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .contact-info-icon {
      transition: transform 0.3s ease, background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .contact-info-content h4 {
      transition: color 0.3s ease, transform 0.3s ease;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Add special effects to social icons
 */
function addSocialIconEffects() {
  const socialIcons = document.querySelectorAll('.social-icon');
  
  socialIcons.forEach(icon => {
    // Add ripple effect on click
    icon.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size/2}px`;
      ripple.style.top = `${e.clientY - rect.top - size/2}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add CSS for ripple effect
  const style = document.createElement('style');
  style.textContent = `
    .social-icon {
      position: relative;
      overflow: hidden;
    }
    
    .ripple-effect {
      position: absolute;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(2);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
  // Simple implementation of AOS (Animate On Scroll)
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  // Initial check for elements in viewport
  checkElementsInViewport();
  
  // Check on scroll
  window.addEventListener('scroll', checkElementsInViewport);
  
  function checkElementsInViewport() {
    animatedElements.forEach(element => {
      if (isElementInViewport(element)) {
        element.classList.add('aos-animate');
      }
    });
  }
  
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
      rect.bottom >= 0
    );
  }
}

/**
 * Initialize theme based on user preference or localStorage
 */
function initTheme() {
  // Check if user has a saved theme preference
  const savedTheme = localStorage.getItem('app-theme');
  
  // If there's a saved preference, use it
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // Check if user prefers dark mode at the OS level
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      updateThemeIcon('dark');
      localStorage.setItem('app-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      updateThemeIcon('light');
      localStorage.setItem('app-theme', 'light');
    }
  }
  
  // Set up theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  // Update the theme
  document.documentElement.setAttribute('data-theme', newTheme);
  
  // Save the preference
  localStorage.setItem('app-theme', newTheme);
  
  // Update the icon
  updateThemeIcon(newTheme);
  
  // Add a subtle animation effect to the page
  animateThemeChange();
  
  // Refresh contact animations and styles for the new theme
  setTimeout(() => {
    // Re-initialize animations with the new theme colors
    initContactAnimations();
    
    // Update any theme-specific elements
    updateThemeSpecificElements(newTheme);
  }, 300); // Wait for animation to complete
}

/**
 * Update theme-specific elements
 */
function updateThemeSpecificElements(theme) {
  // Update contact info container background patterns
  const contactInfoContainer = document.querySelector('.contact-info-container');
  if (contactInfoContainer) {
    // Different pattern styles based on theme
    if (theme === 'dark') {
      contactInfoContainer.style.setProperty('--pattern-opacity', '0.15');
      contactInfoContainer.style.setProperty('--pattern-color', 'rgba(158, 200, 185, 0.3)');
    } else {
      contactInfoContainer.style.setProperty('--pattern-opacity', '0.1');
      contactInfoContainer.style.setProperty('--pattern-color', 'rgba(173, 178, 212, 0.3)');
    }
  }
  
  // Add CSS variables if not already added
  if (!document.getElementById('theme-specific-style')) {
    const style = document.createElement('style');
    style.id = 'theme-specific-style';
    style.textContent = `
      .contact-info-container::before,
      .contact-info-container::after {
        opacity: var(--pattern-opacity, 0.1);
      }
      
      .contact-info-container::before {
        background: radial-gradient(circle, var(--pattern-color, rgba(var(--primary-color-rgb), 0.2)) 0%, rgba(var(--primary-color-rgb), 0) 70%);
      }
      
      .contact-info-container::after {
        background: radial-gradient(circle, var(--pattern-color, rgba(var(--secondary-color-rgb), 0.2)) 0%, rgba(var(--secondary-color-rgb), 0) 70%);
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * Update the theme toggle icon based on current theme
 */
function updateThemeIcon(theme) {
  const lightIcon = document.querySelector('.light-icon');
  const darkIcon = document.querySelector('.dark-icon');
  
  if (lightIcon && darkIcon) {
    if (theme === 'dark') {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    } else {
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
    }
    
    // Function moved outside to proper scope
  }
}

/**
 * Populate app dropdown with app names from the data
 */
function populateAppDropdown(apps) {
  console.log('Populating app dropdown with:', apps);
  const appDropdown = document.getElementById('app');
  if (!appDropdown) {
    console.error('App dropdown element not found');
    return;
  }
  
  // Clear any existing options except the first one
  while (appDropdown.options.length > 1) {
    appDropdown.remove(1);
  }
  
  // Add app options
  apps.forEach(app => {
    const option = document.createElement('option');
    option.value = app.id;
    option.textContent = app.name;
    appDropdown.appendChild(option);
  });
  
  // Add a nice select animation
  appDropdown.addEventListener('focus', function() {
    this.classList.add('focused');
  });
  
  appDropdown.addEventListener('blur', function() {
    this.classList.remove('focused');
  });
}

/**
 * Set up the contact form submission handler
 */
function setupContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const appId = document.getElementById('app').value;
    const appName = appId ? document.getElementById('app').options[document.getElementById('app').selectedIndex].text : '';
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Get company email (should be set by updateCompanyInfo)
    const companyEmail = window.companyEmail || 'support@commonwealthbank.com';
    
    // Construct email body
    let emailBody = `Name: ${name}\n`;
    emailBody += `Email: ${email}\n`;
    if (appId) {
      emailBody += `App: ${appName}\n`;
    }
    emailBody += `Subject: ${subject}\n\n`;
    emailBody += message;
    
    // Encode for mailto link
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(emailBody);
    
    // Create and open mailto link
    const mailtoLink = `mailto:${companyEmail}?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Open the email client
    window.location.href = mailtoLink;
    
    // Show success message with app-specific text if an app was selected
    if (appId) {
      showSuccessMessage(`Thank you for your message about ${appName}! Your email client should open to send this message to ${companyEmail}.`);
    } else {
      showSuccessMessage(`Thank you for your message! Your email client should open to send this message to ${companyEmail}.`);
    }
    
    // Reset form
    this.reset();
  });
}

/**
 * Show a stylish success message instead of an alert
 */
function showSuccessMessage(message) {
  // Create success message element
  const successMsg = document.createElement('div');
  successMsg.className = 'success-message';
  successMsg.innerHTML = `
    <div class="success-icon">
      <i class="fas fa-check-circle"></i>
    </div>
    <div class="success-content">
      <h4>Message Sent!</h4>
      <p>${message}</p>
    </div>
    <button class="success-close">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .success-message {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      display: flex;
      align-items: flex-start;
      gap: 15px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      max-width: 400px;
      animation: slideIn 0.5s forwards;
      transform: translateX(100%);
    }
    
    @keyframes slideIn {
      to { transform: translateX(0); }
    }
    
    @keyframes slideOut {
      to { transform: translateX(120%); opacity: 0; }
    }
    
    .success-icon {
      font-size: 2rem;
      color: white;
    }
    
    .success-content {
      flex: 1;
    }
    
    .success-content h4 {
      margin: 0 0 5px 0;
      font-size: 1.2rem;
    }
    
    .success-content p {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .success-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    
    .success-close:hover {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
  
  // Add to document
  document.body.appendChild(successMsg);
  
  // Add close button functionality
  const closeBtn = successMsg.querySelector('.success-close');
  closeBtn.addEventListener('click', () => {
    successMsg.style.animation = 'slideOut 0.5s forwards';
    setTimeout(() => {
      document.body.removeChild(successMsg);
    }, 500);
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(successMsg)) {
      successMsg.style.animation = 'slideOut 0.5s forwards';
      setTimeout(() => {
        if (document.body.contains(successMsg)) {
          document.body.removeChild(successMsg);
        }
      }, 500);
    }
  }, 5000);
}

/**
 * Add a subtle animation when changing themes
 */
function animateThemeChange() {
  // Create a flash effect overlay
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
  overlay.style.zIndex = '9999';
  overlay.style.pointerEvents = 'none';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s ease';
  
  document.body.appendChild(overlay);
  
  // Trigger animation
  setTimeout(() => {
    overlay.style.opacity = '0.5';
    
    setTimeout(() => {
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        document.body.removeChild(overlay);
      }, 300);
    }, 100);
  }, 0);
}