// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initTheme();
  
  // Load blog posts
  loadBlogPosts();
  
  // Set up event listeners
  setupEventListeners();
});

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

/**
 * Set up event listeners for the blog page
 */
function setupEventListeners() {
  // Category filter
  const categoryButtons = document.querySelectorAll('.blog-category');
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Filter posts by category
      const category = button.getAttribute('data-category');
      filterPostsByCategory(category);
    });
  });
  
  // Search functionality
  const searchInput = document.getElementById('blogSearch');
  const searchButton = document.getElementById('blogSearchBtn');
  
  if (searchInput && searchButton) {
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      searchPosts(searchTerm);
    });
    
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        searchPosts(searchTerm);
      }
    });
  }
  
  // Pagination
  const paginationItems = document.querySelectorAll('.blog-pagination-item');
  paginationItems.forEach(item => {
    if (!item.querySelector('i')) {  // Skip navigation buttons
      item.addEventListener('click', () => {
        // Remove active class from all items
        paginationItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Load page
        const page = parseInt(item.textContent);
        loadBlogPage(page);
      });
    }
  });
}

/**
 * Load blog posts from JSON file
 */
function loadBlogPosts() {
  // For now, we'll use sample data
  // In a real implementation, this would fetch from a JSON file
  const blogPosts = [
    {
      id: 1,
      title: "Getting Started with App1: A Comprehensive Guide",
      excerpt: "Learn how to make the most of App1 with our step-by-step guide covering all the essential features and tips for beginners.",
      content: "Full blog post content here...",
      image: "https://placehold.co/1200x800/3498db/FFFFFF/png?text=Getting%20Started%20with%20App1",
      date: "2025-07-15",
      author: "John Smith",
      category: "tutorials",
      tags: ["app1", "tutorial", "beginner"]
    },
    {
      id: 2,
      title: "New Features Coming in Our Next Update",
      excerpt: "We're excited to announce several new features that will be included in our upcoming update. Here's a sneak peek at what's coming!",
      content: "Full blog post content here...",
      image: "https://placehold.co/1200x800/2ecc71/FFFFFF/png?text=New%20Features%20Coming",
      date: "2025-07-10",
      author: "Jane Doe",
      category: "updates",
      tags: ["update", "features", "announcement"]
    },
    {
      id: 3,
      title: "How AI is Transforming Mobile Applications",
      excerpt: "Artificial Intelligence is revolutionizing how we interact with mobile apps. Discover the latest trends and how our apps are embracing this technology.",
      content: "Full blog post content here...",
      image: "https://placehold.co/1200x800/9b59b6/FFFFFF/png?text=AI%20in%20Mobile%20Apps",
      date: "2025-07-05",
      author: "Michael Johnson",
      category: "technology",
      tags: ["AI", "technology", "future"]
    },
    {
      id: 4,
      title: "Advanced Features in App2: Unlocking Hidden Potential",
      excerpt: "Discover powerful advanced features in App2 that most users never find, from custom keyboard shortcuts to advanced data visualization.",
      content: "Full blog post content here...",
      image: "https://placehold.co/1200x800/e74c3c/FFFFFF/png?text=Advanced%20Features%20in%20App2",
      date: "2025-08-05",
      author: "Sarah Johnson",
      category: "technology",
      tags: ["app2", "advanced", "productivity", "automation", "tips"]
    },
    {
      id: 5,
      title: "We've Reached 1 Million Downloads!",
      excerpt: "We're thrilled to announce that our apps have collectively reached 1 million downloads! Thank you to all our users for your support.",
      content: "Full blog post content here...",
      image: "https://placehold.co/1200x800/f39c12/FFFFFF/png?text=1%20Million%20Downloads",
      date: "2025-06-20",
      author: "David Brown",
      category: "news",
      tags: ["milestone", "achievement", "announcement"]
    },
    {
      id: 6,
      title: "Security Best Practices for Mobile Apps",
      excerpt: "Keeping your data safe is our top priority. Learn about the security measures we implement and best practices you can follow.",
      content: "Full blog post content here...",
      image: "https://placehold.co/1200x800/1abc9c/FFFFFF/png?text=Security%20Best%20Practices",
      date: "2025-06-15",
      author: "Emily Chen",
      category: "technology",
      tags: ["security", "privacy", "best practices"]
    }
  ];
  
  // Store posts in a global variable for filtering
  window.allBlogPosts = blogPosts;
  
  // Render posts
  renderBlogPosts(blogPosts);
}

/**
 * Render blog posts to the page
 */
function renderBlogPosts(posts) {
  const blogPostsContainer = document.getElementById('blogPosts');
  
  if (!blogPostsContainer) {
    console.error('Blog posts container not found');
    return;
  }
  
  // Clear existing posts
  blogPostsContainer.innerHTML = '';
  
  if (posts.length === 0) {
    blogPostsContainer.innerHTML = `
      <div class="no-posts-message">
        <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 15px;"></i>
        <h3>No posts found</h3>
        <p>Try adjusting your search or filter criteria.</p>
      </div>
    `;
    return;
  }
  
  // Create HTML for each post
  posts.forEach(post => {
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const postHTML = `
      <div class="blog-post-card" data-id="${post.id}" data-category="${post.category}">
        <img src="${post.image}" alt="${post.title}" class="blog-post-image">
        <div class="blog-post-content">
          <h2 class="blog-post-title">${post.title}</h2>
          <div class="blog-post-meta">
            <div class="blog-post-date">
              <i class="far fa-calendar-alt"></i>
              ${formattedDate}
            </div>
            <div class="blog-post-author">
              <i class="far fa-user"></i>
              ${post.author}
            </div>
          </div>
          <p class="blog-post-excerpt">${post.excerpt}</p>
          <a href="blogs/posts/${post.id}.html" class="blog-post-link">
            Read More <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
    
    blogPostsContainer.innerHTML += postHTML;
  });
  
  // Add click event to each post card
  const postCards = document.querySelectorAll('.blog-post-card');
  postCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If the click is on the "Read More" link, let the default behavior happen
      if (e.target.classList.contains('blog-post-link') || e.target.closest('.blog-post-link')) {
        return;
      }
      
      // Otherwise, navigate to the post page
      const postId = card.getAttribute('data-id');
      window.location.href = `blogs/posts/${postId}.html`;
    });
  });
}

/**
 * Filter posts by category
 */
function filterPostsByCategory(category) {
  if (!window.allBlogPosts) {
    console.error('Blog posts not loaded');
    return;
  }
  
  let filteredPosts;
  
  if (category === 'all') {
    filteredPosts = window.allBlogPosts;
  } else {
    filteredPosts = window.allBlogPosts.filter(post => post.category === category);
  }
  
  renderBlogPosts(filteredPosts);
}

/**
 * Search posts by title, excerpt, or content
 */
function searchPosts(searchTerm) {
  if (!window.allBlogPosts) {
    console.error('Blog posts not loaded');
    return;
  }
  
  if (!searchTerm) {
    renderBlogPosts(window.allBlogPosts);
    return;
  }
  
  const filteredPosts = window.allBlogPosts.filter(post => {
    return (
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.author.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });
  
  renderBlogPosts(filteredPosts);
}

/**
 * Load a specific page of blog posts
 */
function loadBlogPage(page) {
  // In a real implementation, this would fetch a specific page of posts
  // For now, we'll just simulate it by showing all posts
  renderBlogPosts(window.allBlogPosts);
}

/**
 * Update company information in the page
 */
function updateCompanyInfo(company) {
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

// Fetch company info from apps.json
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