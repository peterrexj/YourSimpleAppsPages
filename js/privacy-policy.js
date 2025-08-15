// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Load company info
  loadCompanyInfo();
  
  // Load privacy policy based on app ID
  loadPrivacyPolicy();
});

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - The HTML content to sanitize
 * @returns {string} - The sanitized HTML content
 */
function sanitizeHTML(html) {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
}

/**
 * Get the app ID from the URL query parameters
 */
function getAppIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

/**
 * Load company information from JSON file
 */
function loadCompanyInfo() {
  fetch('data/apps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      updateCompanyInfo(data.company);
    })
    .catch(error => {
      console.error('Error loading company info:', error);
    });
}

/**
 * Update company information in the page
 */
function updateCompanyInfo(company) {
  // Update page title
  document.title = `${company.name} - Privacy Policy`;
  
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
}

/**
 * Load privacy policy content based on app ID
 */
function loadPrivacyPolicy() {
  const appId = getAppIdFromUrl();
  
  if (!appId) {
    showError('App ID not specified in the URL');
    return;
  }
  
  // Try to fetch the JSON file to get app details
  fetch('data/apps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Find the app with the matching ID
      const app = data.apps.find(app => app.id === appId);
      
      if (!app) {
        throw new Error(`App with ID "${appId}" not found`);
      }
      
      // Update app info in the header
      updateAppInfo(app);
      
      // Load privacy policy content from the HTML file
      loadPrivacyPolicyContent(app);
    })
    .catch(error => {
      console.error('Error loading app details:', error);
      showError(`Failed to load privacy policy: ${error.message}`);
    });
}

/**
 * Update app information in the page
 */
function updateAppInfo(app) {
  // Update app icon
  const appIcon = document.getElementById('appIcon');
  if (appIcon) {
    appIcon.src = app.icon;
    appIcon.alt = `${app.name} Icon`;
  }
  
  // Update app name
  const appName = document.getElementById('appName');
  if (appName) {
    appName.textContent = `${app.name} Privacy Policy`;
  }
  
  // Update page title
  document.title = `${app.name} - Privacy Policy`;
  document.querySelector('.header-title').textContent = 'Privacy Policy';
}

/**
 * Load privacy policy content from the HTML file
 */
function loadPrivacyPolicyContent(app) {
  // Get the privacy policy content container
  const contentContainer = document.getElementById('privacyPolicyContent');
  
  // Check if the app has a privacy policy URL
  if (!app.privacyPolicyUrl) {
    contentContainer.innerHTML = `
      <div class="error-message">
        <h3>No Privacy Policy Available</h3>
        <p>Privacy policy information is not available for this application.</p>
      </div>
    `;
    return;
  }
  
  // Load the privacy policy content from the URL specified in the app object
  const policyPath = app.privacyPolicyUrl;
  
  fetch(policyPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load privacy policy: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Extract the content from the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Find the privacy policy content div
      const policyContent = tempDiv.querySelector('.privacy-policy-content');
      
      if (policyContent) {
        // Sanitize the content for security
        const sanitizedContent = DOMPurify ? 
          DOMPurify.sanitize(policyContent.innerHTML) : 
          sanitizeHTML(policyContent.innerHTML);
        
        // Set the content
        contentContainer.innerHTML = sanitizedContent;
      } else {
        throw new Error('Privacy policy content not found in the HTML file');
      }
    })
    .catch(error => {
      console.error('Error loading privacy policy:', error);
      contentContainer.innerHTML = `
        <div class="error-message">
          <h3>Error Loading Privacy Policy</h3>
          <p>Failed to load privacy policy. Please try again later.</p>
          <p>Error: ${error.message}</p>
        </div>
      `;
    });
}

/**
 * Show error message on the page
 */
function showError(message) {
  const contentContainer = document.getElementById('privacyPolicyContent');
  
  if (!contentContainer) {
    console.error('Privacy policy content container not found');
    return;
  }
  
  contentContainer.innerHTML = `
    <div class="error-message">
      <h3>Error</h3>
      <p>${message}</p>
      <a href="index.html" class="back-button">
        <i class="fas fa-arrow-left"></i> Return to App List
      </a>
    </div>
  `;
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
  }
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