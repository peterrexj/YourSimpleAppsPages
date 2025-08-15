// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Load app data
  loadAppDetails();
  
  // Set up event listeners for the privacy modal
  setupPrivacyModal();
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
 * Load app details from JSON file based on the app ID in the URL
 */
function loadAppDetails() {
  const appId = getAppIdFromUrl();
  
  if (!appId) {
    showError('App ID not specified in the URL');
    return;
  }
  
  // Try to fetch the JSON file
  fetch('../data/apps.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('App data loaded successfully from JSON file');
      
      // Find the app with the matching ID
      const app = data.apps.find(app => app.id === appId);
      
      if (!app) {
        throw new Error(`App with ID "${appId}" not found`);
      }
      
      // Update company info
      updateCompanyInfo(data.company);
      
      // Render the app details
      renderAppDetails(app);
    })
    .catch(error => {
      console.error('Error loading app details:', error);
      showError(`Failed to load app details: ${error.message}`);
    });
}

/**
 * Update company information in the page
 */
function updateCompanyInfo(company) {
  // Update page title
  document.title = `${company.name} - App Details`;
  
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
 * Render app details on the page
 */
/**
 * Get the number of visible slides based on screen width
 */
function getVisibleSlidesCount() {
  if (window.innerWidth < 576) {
    return 1;
  } else if (window.innerWidth < 992) {
    return 2;
  } else {
    return 3;
  }
}

function renderAppDetails(app) {
  const appDetailsContainer = document.getElementById('app-details-content');
  
  if (!appDetailsContainer) {
    console.error('App details container not found');
    return;
  }
  
  // Update page title with app name
  document.title = `${app.name} - App Details`;
  document.querySelector('.header-title').textContent = app.name;
  
  // Get the current theme
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  
  // Define gradient background styles based on theme
  const gradientBgStyle = currentTheme === 'dark'
    ? `
      background: linear-gradient(135deg,
        #092635 0%,
        #1B4242 30%,
        #5C8374 70%,
        #9EC8B9 100%);
      position: relative;
      overflow: hidden;
    `
    : `
      background: linear-gradient(135deg,
        #ADB2D4 0%,
        #C7D9DD 30%,
        #D5E5D5 70%,
        #EEF1DA 100%);
      position: relative;
      overflow: hidden;
    `;
  
  // Define pattern styles based on theme
  const patternStyle = currentTheme === 'dark'
    ? `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(circle at 20% 20%, rgba(158,200,185,0.3) 0%, transparent 40%),
                       radial-gradient(circle at 80% 60%, rgba(92,131,116,0.25) 0%, transparent 30%),
                       radial-gradient(circle at 40% 80%, rgba(27,66,66,0.2) 0%, transparent 35%);
      opacity: 0.7;
    `
    : `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.4) 0%, transparent 40%),
                       radial-gradient(circle at 80% 60%, rgba(173,178,212,0.3) 0%, transparent 30%),
                       radial-gradient(circle at 40% 80%, rgba(213,229,213,0.25) 0%, transparent 35%);
      opacity: 0.7;
    `;
  
  // Define app name styles based on theme
  const appNameStyle = currentTheme === 'dark'
    ? `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      font-weight: 700;
      color: rgba(158,200,185,0.4);
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 2px 2px 4px rgba(9,38,53,0.5);
    `
    : `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 3rem;
      font-weight: 700;
      color: rgba(173,178,212,0.4);
      white-space: nowrap;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 2px 2px 4px rgba(255,255,255,0.3);
    `;

  // Create the content HTML
  const content = `
    <div class="app-header-with-landscape">
      <div class="app-landscape-container" style="${gradientBgStyle}">
        <div class="landscape-pattern" style="${patternStyle}"></div>
        ${app.landscapeImage ? `
          <img src="${app.landscapeImage}" alt="${app.name} Banner" class="app-landscape-image" style="position: relative; z-index: 1;">
          <div class="app-landscape-overlay" style="z-index: 2;"></div>
        ` : `
          <div class="landscape-app-name" style="${appNameStyle}">
            ${app.name}
          </div>
        `}
      </div>
      
      <div class="app-header">
        <img src="${app.icon}" alt="${app.name} Icon" class="app-icon-large">
        <div class="app-title-section">
          <h1 class="app-title">${app.name}</h1>
          <p class="app-summary">${app.shortDescription}</p>
        </div>
      </div>
    </div>
    
    <div class="app-features-list">
      ${app.features.map(feature => `<span class="app-feature">${feature}</span>`).join('')}
    </div>
    
    <div class="app-actions">
      ${app.stores.ios ? `<a href="${app.stores.ios}" target="_blank" class="app-link app-store"><i class="fab fa-apple"></i> App Store</a>` : ''}
      ${app.stores.android ? `<a href="${app.stores.android}" target="_blank" class="app-link google-play"><i class="fab fa-google-play"></i> Google Play</a>` : ''}
      ${app.stores.windows ? `<a href="${app.stores.windows}" target="_blank" class="app-link windows-store"><i class="fab fa-windows"></i> Windows</a>` : ''}
      <button class="privacy-button" id="showPrivacyBtn"><i class="fas fa-shield-alt"></i> Privacy Policy</button>
    </div>
    
    <h2>Screenshots</h2>
    ${app.screenshots && app.screenshots.length > 0 ?
      `<div class="screenshots-carousel">
        <div class="carousel-container">
          <div class="carousel-track" id="carouselTrack">
            ${app.screenshots.map((screenshot, index) =>
              `<div class="carousel-slide" data-index="${index}">
                <img src="${screenshot}" alt="${app.name} Screenshot ${index + 1}" class="app-screenshot">
                <div class="slide-number">${index + 1}/${app.screenshots.length}</div>
              </div>`
            ).join('')}
          </div>
          <button class="carousel-button prev" id="prevSlide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="carousel-button next" id="nextSlide">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <div class="carousel-indicators">
          ${Array.from({ length: Math.ceil(app.screenshots.length / getVisibleSlidesCount()) }, (_, i) =>
            `<button class="indicator ${i === 0 ? 'active' : ''}" data-group="${i}"></button>`
          ).join('')}
        </div>
      </div>`
      : '<p>No screenshots available</p>'
    }
    
    ${app.videos && app.videos.length > 0 ?
      `<h2>Videos</h2>
      <div class="videos-section">
        <div class="videos-grid">
          ${app.videos.map((video, index) =>
            `<div class="video-card" data-youtube-id="${video.youtubeId}">
              <div class="video-thumbnail-container">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <div class="video-play-button">
                  <i class="fas fa-play"></i>
                </div>
              </div>
              <div class="video-info">
                <h3 class="video-title">${video.title}</h3>
                <p class="video-description">${video.description}</p>
              </div>
            </div>`
          ).join('')}
        </div>
      </div>`
      : ''
    }
    
    <h2>Description</h2>
    <div class="app-description">
      <p>${app.detailedDescription}</p>
    </div>
  `;
  
  // Set the content
  appDetailsContainer.innerHTML = content;
  
  // Set up privacy policy button to navigate to the privacy policy viewer page
  const privacyButton = document.getElementById('showPrivacyBtn');
  if (privacyButton) {
    privacyButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Navigate to the privacy policy viewer page with the app ID
      if (app.privacyPolicyUrl) {
        window.open(`privacy-policy-viewer.html?id=${app.id}`, '_blank');
      } else {
        alert('Privacy policy is not available for this application.');
      }
    });
  }
  
  // Add a loading message to the privacy content area
  document.getElementById('privacyContent').innerHTML = `
    <div class="loading-container">
      <i class="fas fa-spinner fa-spin loading-spinner"></i>
      <p>Loading privacy policy...</p>
    </div>
  `;
    
    // Initialize carousel if screenshots exist
    if (app.screenshots && app.screenshots.length > 0) {
      initCarousel();
    }
    
    // Initialize video functionality if videos exist
    if (app.videos && app.videos.length > 0) {
      initVideoPlayers();
    }
}

/**
 * Show error message on the page
 */
function showError(message) {
  const appDetailsContainer = document.getElementById('app-details-content');
  
  if (!appDetailsContainer) {
    console.error('App details container not found');
    return;
  }
  
  appDetailsContainer.innerHTML = `
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
 * Set up event listeners for the privacy modal
 */
function setupPrivacyModal() {
  const closeButton = document.getElementById('closePrivacyModal');
  const closeFooterButton = document.getElementById('closePrivacyBtn');
  const agreeButton = document.querySelector('.privacy-modal-button.primary');
  const modal = document.getElementById('privacyModal');
  
  if (closeButton && modal) {
    closeButton.addEventListener('click', hidePrivacyModal);
    
    // Close when clicking outside the modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        hidePrivacyModal();
      }
    });
  }
  
  // Add event listener for the footer close button
  if (closeFooterButton) {
    closeFooterButton.addEventListener('click', hidePrivacyModal);
  }
  
  // Add event listener for the agree button
  if (agreeButton) {
    agreeButton.addEventListener('click', () => {
      // Show a brief confirmation message
      const originalText = agreeButton.textContent;
      agreeButton.textContent = "Thank you!";
      agreeButton.style.backgroundColor = "var(--success-color)";
      
      // Reset and close after a delay
      setTimeout(() => {
        agreeButton.textContent = originalText;
        agreeButton.style.backgroundColor = "";
        hidePrivacyModal();
      }, 1500);
    });
  }
}

/**
 * Load privacy policy content from the HTML file
 */
function loadPrivacyPolicyContent(app) {
  // Get the privacy policy content container
  const contentContainer = document.getElementById('privacyContent');
  
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
  
  // Show loading state
  contentContainer.innerHTML = `
    <div class="loading-container">
      <i class="fas fa-spinner fa-spin loading-spinner"></i>
      <p>Loading privacy policy...</p>
    </div>
  `;
  
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
        
        // Apply theme-specific styling
        applyThemeStylingToPrivacyContent();
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
 * Show the privacy policy modal
 */
function showPrivacyModal() {
  const modal = document.getElementById('privacyModal');
  if (modal) {
    modal.classList.add('visible');
    applyThemeStylingToPrivacyContent();
  }
}

/**
 * Apply theme-specific styling to privacy content
 */
function applyThemeStylingToPrivacyContent() {
  // Force text color when showing modal
  const privacyContent = document.getElementById('privacyContent');
  
  // Apply appropriate text color based on theme using CSS variables
  if (privacyContent) {
    // Get computed text color from CSS variables
    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    const headingColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
    
    // Apply text color to all text elements that might be generated by Markdown
    const textElements = privacyContent.querySelectorAll('div, p, li, span, blockquote, code, em, strong');
    textElements.forEach(element => {
      element.style.color = textColor;
    });
    
    // Apply heading color to all heading elements
    const headingElements = privacyContent.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headingElements.forEach(element => {
      element.style.color = headingColor;
    });
  }
}

/**
 * Hide the privacy policy modal
 */
function hidePrivacyModal() {
  const modal = document.getElementById('privacyModal');
  if (modal) {
    modal.classList.remove('visible');
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
  
  // Refresh app details to update theme-specific styling
  setTimeout(() => {
    // Reload app details to apply theme-specific styles
    loadAppDetails();
  }, 300); // Wait for animation to complete
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


/**
 * Initialize the screenshots carousel
 */
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const indicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));
  const prevButton = document.getElementById('prevSlide');
  const nextButton = document.getElementById('nextSlide');
  
  if (!track || !slides.length || !prevButton || !nextButton) {
    console.error('Carousel elements not found');
    return;
  }
  
  let currentIndex = 0;
  const slidesPerView = getVisibleSlidesCount();
  const totalGroups = Math.ceil(slides.length / slidesPerView);
  
  // Set initial position
  updateCarouselPosition();
  
  // Function to update carousel position
  function updateCarouselPosition() {
    const slideWidth = slides[0].offsetWidth;
    const offset = -currentIndex * slideWidth;
    track.style.transform = `translateX(${offset}px)`;
    
    // Update indicators
    const currentGroup = Math.floor(currentIndex / slidesPerView);
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle('active', i === currentGroup);
    });
  }
  
  // Function to move to a specific slide
  function moveToSlide(index) {
    // Calculate the maximum valid index (last slide should be visible)
    const maxIndex = slides.length - 1;
    
    if (index < 0) {
      // When going backward from the first slide, go to the last slide
      index = maxIndex - (slidesPerView - 1);
    } else if (index > maxIndex - (slidesPerView - 1)) {
      // When going forward from the last slide, go to the first slide
      index = 0;
    }
    
    // Update current index
    currentIndex = index;
    updateCarouselPosition();
  }
  
  // Event listeners for prev/next buttons
  prevButton.addEventListener('click', () => {
    moveToSlide(currentIndex - 1);
  });
  
  nextButton.addEventListener('click', () => {
    moveToSlide(currentIndex + 1);
  });
  
  // Event listeners for indicators
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      moveToSlide(index * slidesPerView);
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      moveToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      moveToSlide(currentIndex + 1);
    }
  });
  
  // Touch events for swipe
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left - next slide
      moveToSlide(currentIndex + 1);
    } else if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right - previous slide
      moveToSlide(currentIndex - 1);
    }
  }
  
  // Auto-advance slides every 5 seconds
  let autoplayInterval = setInterval(() => {
    moveToSlide(currentIndex + 1);
  }, 5000);
  
  // Pause autoplay when user interacts with carousel
  const carouselContainer = document.querySelector('.carousel-container');
  carouselContainer.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  
  carouselContainer.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 5000);
  });
  
  // Update carousel on window resize
  window.addEventListener('resize', () => {
    const newSlidesPerView = getVisibleSlidesCount();
    if (newSlidesPerView !== slidesPerView) {
      // Reload the carousel if the number of visible slides changes
      location.reload();
    }
  });
}

/**
 * Initialize video players and set up event listeners
 */
function initVideoPlayers() {
  const videoCards = document.querySelectorAll('.video-card');
  const videoModal = document.getElementById('videoModal');
  const videoContainer = document.getElementById('videoContainer');
  const closeVideoButton = document.getElementById('closeVideoModal');
  
  if (!videoCards.length || !videoModal || !videoContainer || !closeVideoButton) {
    console.error('Video elements not found');
    return;
  }
  
  // Add click event listeners to video cards
  videoCards.forEach(card => {
    card.addEventListener('click', () => {
      const youtubeId = card.getAttribute('data-youtube-id');
      if (youtubeId) {
        openVideoModal(youtubeId);
      }
    });
  });
  
  // Add click event listener to close button
  closeVideoButton.addEventListener('click', closeVideoModal);
  
  // Close modal when clicking outside the video
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal.classList.contains('visible')) {
      closeVideoModal();
    }
  });
}

/**
 * Open the video modal and load the YouTube video
 * @param {string} youtubeId - The YouTube video ID
 */
function openVideoModal(youtubeId) {
  const videoContainer = document.getElementById('videoContainer');
  const videoModal = document.getElementById('videoModal');
  
  if (!videoContainer || !videoModal) {
    console.error('Video modal elements not found');
    return;
  }
  
  // Create YouTube iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  
  // Clear previous content and add the iframe
  videoContainer.innerHTML = '';
  videoContainer.appendChild(iframe);
  
  // Show the modal
  videoModal.classList.add('visible');
  
  // Prevent body scrolling when modal is open
  document.body.style.overflow = 'hidden';
}

/**
 * Close the video modal
 */
function closeVideoModal() {
  const videoModal = document.getElementById('videoModal');
  const videoContainer = document.getElementById('videoContainer');
  
  if (!videoModal || !videoContainer) {
    return;
  }
  
  // Hide the modal
  videoModal.classList.remove('visible');
  
  // Clear the video to stop playback
  videoContainer.innerHTML = '';
  
  // Re-enable body scrolling
  document.body.style.overflow = '';
}