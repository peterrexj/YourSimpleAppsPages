// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Load app data from JSON
  loadAppData();
  
  // Set up event listeners
  setupEventListeners();
});

/**
 * Load app data from JSON file and render the content
 */
function loadAppData() {
  // Try to fetch the JSON file
  fetch('data/apps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('App data loaded successfully from JSON file');
      
      // Process the data
      renderContent(data);
    })
    .catch(error => {
      console.warn('Could not load JSON file:', error);
      
      // Show error message on the page
      const appsSection = document.querySelector('.apps-section');
      if (appsSection) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
          <h3>Failed to load app data</h3>
          <p>Please check your internet connection and try again.</p>
          <p>Error details: ${error.message}</p>
          <p>Note: If you're viewing this page directly from your file system, please use a local web server.</p>
        `;
        appsSection.appendChild(errorMessage);
      }
    });
}

/**
 * Process and render the app data
 */
function renderContent(data) {
  // Render company information
  renderCompanyInfo(data.company);
  
  // Render app cards
  renderAppCards(data.apps);
  
  // Render contact information with company email
  renderContactInfo(data.contact, data.company);
}

/**
 * Render company information
 */
function renderCompanyInfo(company) {
  // Update company name in title
  document.title = `${company.name} - Mobile Applications`;
  
  // Update logo
  const logoElements = document.querySelectorAll('.header-logo, .footer-logo-img');
  logoElements.forEach(logo => {
    logo.src = company.logo;
    logo.alt = `${company.name} Logo`;
  });
  
  // Update company name in header
  const headerTitle = document.querySelector('.header-title');
  if (headerTitle) {
    headerTitle.textContent = `${company.name} Applications`;
  }
  
  // Update intro section
  const introSection = document.querySelector('.intro-section');
  if (introSection) {
    const introTitle = introSection.querySelector('h2');
    if (introTitle) {
      introTitle.textContent = `Welcome to ${company.name}`;
    }
    
    const introText = introSection.querySelector('p');
    if (introText) {
      introText.textContent = company.description;
    }
  }
  
  // Update footer company name
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
 * Render app cards based on JSON data
 */
function renderAppCards(apps) {
  const appGrid = document.querySelector('.app-grid');
  if (!appGrid) return;
  
  // Clear existing content
  appGrid.innerHTML = '';
  
  // Create app cards
  apps.forEach(app => {
    const appCard = document.createElement('div');
    appCard.className = 'app-card';
    appCard.id = app.id;
    appCard.style.cursor = 'pointer';
    
    // Generate a unique but cohesive color for each card
    const colorSeed = app.id.charCodeAt(app.id.length - 1); // Use last character of ID for variety
    const hue = (colorSeed * 37) % 360; // Create a unique hue
    
    // Apply different color styling based on the current theme
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      // Dark theme - same background for all cards, unique left border
      appCard.style.backgroundColor = `rgba(30, 30, 38, 0.85)`; // Darker, more opaque background
      appCard.style.borderLeft = `5px solid hsla(${hue}, 75%, 55%, 1.0)`; // Bolder, more saturated border
    } else {
      // Light theme - same background for all cards, unique left border
      appCard.style.backgroundColor = `rgba(240, 240, 245, 1.0)`; // More contrasting light background
      appCard.style.borderLeft = `5px solid hsla(${hue}, 85%, 55%, 1.0)`; // Bolder, more saturated border
    }
    
    // Make the entire card clickable
    appCard.addEventListener('click', (e) => {
      // Only navigate if the click wasn't on a button or link
      if (!e.target.closest('a') && !e.target.closest('button')) {
        navigateToAppDetails(app.id);
      }
    });
    
    // Create landscape image container if available
    if (app.landscapeImage) {
      const landscapeContainer = document.createElement('div');
      landscapeContainer.className = 'app-landscape-container';
      
      const landscapeImg = document.createElement('img');
      landscapeImg.src = app.landscapeImage;
      landscapeImg.alt = `${app.name} Banner`;
      landscapeImg.className = 'app-landscape-image';
      
      const overlay = document.createElement('div');
      overlay.className = 'app-landscape-overlay';
      
      landscapeContainer.appendChild(landscapeImg);
      landscapeContainer.appendChild(overlay);
      appCard.appendChild(landscapeContainer);
    }
    
    // Create app icon
    const appIcon = document.createElement('div');
    appIcon.className = 'app-icon';
    appIcon.innerHTML = `<img src="${app.icon}" alt="${app.name} Icon">`;
    
    // Create app details
    const appDetails = document.createElement('div');
    appDetails.className = 'app-details';
    
    // App name
    const appName = document.createElement('h3');
    appName.textContent = app.name;
    
    // App description
    const appDescription = document.createElement('p');
    appDescription.className = 'app-description';
    appDescription.textContent = app.shortDescription;
    
    // App features
    const appFeatures = document.createElement('div');
    appFeatures.className = 'app-features';
    
    app.features.forEach(feature => {
      const featureTag = document.createElement('span');
      featureTag.className = 'feature-tag';
      featureTag.textContent = feature;
      appFeatures.appendChild(featureTag);
    });
    
    // App store links
    const appLinks = document.createElement('div');
    appLinks.className = 'app-links';
    
    // iOS App Store link
    if (app.stores.ios) {
      const iosLink = document.createElement('a');
      iosLink.href = app.stores.ios;
      iosLink.className = 'app-link app-store';
      iosLink.innerHTML = '<i class="fab fa-apple"></i> App Store';
      iosLink.target = '_blank';
      // Prevent the card click event from firing when clicking on the link
      iosLink.addEventListener('click', (e) => e.stopPropagation());
      appLinks.appendChild(iosLink);
    }
    
    // Google Play Store link
    if (app.stores.android) {
      const androidLink = document.createElement('a');
      androidLink.href = app.stores.android;
      androidLink.className = 'app-link google-play';
      androidLink.innerHTML = '<i class="fab fa-google-play"></i> Google Play';
      androidLink.target = '_blank';
      // Prevent the card click event from firing when clicking on the link
      androidLink.addEventListener('click', (e) => e.stopPropagation());
      appLinks.appendChild(androidLink);
    }
    
    // Windows Store link
    if (app.stores.windows) {
      const windowsLink = document.createElement('a');
      windowsLink.href = app.stores.windows;
      windowsLink.className = 'app-link windows-store';
      windowsLink.innerHTML = '<i class="fab fa-windows"></i> Windows';
      windowsLink.target = '_blank';
      // Prevent the card click event from firing when clicking on the link
      windowsLink.addEventListener('click', (e) => e.stopPropagation());
      appLinks.appendChild(windowsLink);
    }
    
    // Add "More Info" button that shows detailed description
    const moreInfoBtn = document.createElement('button');
    moreInfoBtn.className = 'more-info-btn';
    moreInfoBtn.innerHTML = '<i class="fas fa-info-circle"></i> More Info';
    moreInfoBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent the card click event from firing
      navigateToAppDetails(app.id);
    });
    
    // Assemble app details
    appDetails.appendChild(appName);
    appDetails.appendChild(appDescription);
    appDetails.appendChild(appFeatures);
    appDetails.appendChild(appLinks);
    appDetails.appendChild(moreInfoBtn);
    
    // Assemble app card
    appCard.appendChild(appIcon);
    appCard.appendChild(appDetails);
    
    // Add to grid
    appGrid.appendChild(appCard);
  });
}

/**
 * Navigate to the app details page
 */
function navigateToAppDetails(appId) {
  window.location.href = `app-details.html?id=${appId}`;
}

/**
 * Render contact information
 */
function renderContactInfo(contact, company) {
  // Use company email if available
  const email = company && company.email ? company.email : contact.email;
  
  // Update contact email
  const emailElement = document.querySelector('.contact-item:nth-child(1) span');
  if (emailElement) {
    emailElement.textContent = email;
  }
  
  // Update contact phone
  const phoneElement = document.querySelector('.contact-item:nth-child(2) span');
  if (phoneElement) {
    phoneElement.textContent = contact.phone;
  }
  
  // Update contact address
  const addressElement = document.querySelector('.contact-item:nth-child(3) span');
  if (addressElement) {
    addressElement.textContent = contact.address;
  }
  
  // Update social links
  const socialLinks = document.querySelectorAll('.footer-social a');
  if (socialLinks.length >= 4) {
    socialLinks[0].href = contact.social.facebook;
    socialLinks[1].href = contact.social.twitter;
    socialLinks[2].href = contact.social.instagram;
    socialLinks[3].href = contact.social.linkedin;
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
}

/**
 * Set up event listeners for interactive elements
 */
function setupEventListeners() {
  // Theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // App cards hover effect enhancement
  const appCards = document.querySelectorAll('.app-card');
  appCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-12px)';
      card.style.boxShadow = '0 18px 35px rgba(0, 0, 0, 0.2)';
      card.style.transition = 'all 0.3s ease';
      
      // Add a subtle border glow effect
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const glowColor = currentTheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 123, 255, 0.2)';
      card.style.border = `2px solid ${glowColor}`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '';
      card.style.border = '';
    });
  });
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
  
  // Update app card colors for the new theme
  updateAppCardColors(newTheme);
  
  // Add a subtle animation effect to the page
  animateThemeChange();
}

/**
 * Update the theme toggle icon based on current theme
 */
function updateThemeIcon(theme) {
  const lightIcon = document.querySelector('.light-icon');
  const darkIcon = document.querySelector('.dark-icon');
  
  if (theme === 'dark') {
    lightIcon.style.display = 'none';
    darkIcon.style.display = 'block';
  } else {
    lightIcon.style.display = 'block';
    darkIcon.style.display = 'none';
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

/**
 * Update app card colors when theme changes
 */
function updateAppCardColors(theme) {
  const appCards = document.querySelectorAll('.app-card');
  
  appCards.forEach(card => {
    // Get the app ID and generate a color seed
    const appId = card.id;
    const colorSeed = appId.charCodeAt(appId.length - 1);
    const hue = (colorSeed * 37) % 360;
    
    if (theme === 'dark') {
      // Dark theme - same background for all cards, unique left border
      card.style.backgroundColor = `rgba(30, 30, 38, 0.85)`; // Darker, more opaque background
      card.style.borderLeft = `5px solid hsla(${hue}, 75%, 55%, 1.0)`; // Bolder, more saturated border
    } else {
      // Light theme - same background for all cards, unique left border
      card.style.backgroundColor = `rgba(240, 240, 245, 1.0)`; // More contrasting light background
      card.style.borderLeft = `5px solid hsla(${hue}, 85%, 55%, 1.0)`; // Bolder, more saturated border
    }
  });
}

/**
 * Create placeholder images for app icons if they don't exist
 * This helps with GitHub Pages deployment where images might not be available initially
 */
function createPlaceholderImages() {
  const appIcons = document.querySelectorAll('.app-icon img');
  
  appIcons.forEach((img, index) => {
    img.onerror = function() {
      // Create a canvas element to generate a placeholder
      const canvas = document.createElement('canvas');
      canvas.width = 80;
      canvas.height = 80;
      const ctx = canvas.getContext('2d');
      
      // Generate a unique color based on the app index
      const hue = (index * 137) % 360; // Golden angle approximation for good distribution
      
      // Fill background
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fillRect(0, 0, 80, 80);
      
      // Add text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`App${index + 1}`, 40, 40);
      
      // Replace the broken image with the canvas data
      this.src = canvas.toDataURL('image/png');
    };
  });
}

// Call the placeholder function after DOM is loaded
document.addEventListener('DOMContentLoaded', createPlaceholderImages);