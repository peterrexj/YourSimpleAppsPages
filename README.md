# Mobile Applications Showcase

A clean, responsive HTML page to showcase your mobile applications. This project is designed to be easily deployed on GitHub Pages and customized with your own content through a simple JSON file.

## Features

- Responsive design that works on all devices
- Light and dark theme support with automatic system preference detection
- Clean, modern UI with smooth animations
- JSON-driven content for easy updates
- Detailed app information modals
- Placeholder system for easy customization
- Ready for GitHub Pages deployment
- Google AdSense integration options for monetization

## Project Structure

```
├── index.html              # Main HTML file
├── blog.html               # Blog listing page
├── app-details.html        # App details page
├── contact.html            # Contact page
├── privacy-policy.html     # Privacy policy page
├── terms-and-conditions.html # Terms and conditions page
├── css/
│   ├── styles.css          # Main CSS styles
│   ├── blog-post.css       # Blog post specific styles
│   └── blog-shapes.css     # Decorative background shapes for blog
├── js/
│   ├── script.js           # Main JavaScript functionality
│   ├── blog.js             # Blog specific functionality
│   └── app-details.js      # App details functionality
├── data/
│   └── apps.json           # App data in JSON format
├── blogs/
│   └── posts/              # Individual blog post pages
│       ├── 1.html
│       └── 2.html
├── images/
│   ├── placeholders.html   # Placeholder image generator
│   ├── blog/
│   │   └── placeholders.html # Blog image placeholders
│   ├── logo-icon.png
│   └── favicon.svg
├── 404.html                # Custom 404 error page
└── README.md               # This file
```

## Getting Started

1. Clone or download this repository
2. Open `images/placeholders.html` in your browser
3. Save the placeholder images or replace them with your own
4. Edit the `data/apps.json` file to add your own app information
5. Deploy to GitHub Pages

## Customization

### Editing the JSON Data

The `data/apps.json` file contains all the information about your company and apps. Edit this file to update:

```json
{
  "company": {
    "name": "Your Company Name",
    "logo": "path/to/logo.png",
    "description": "Your company description"
  },
  "apps": [
    {
      "id": "app1",
      "name": "App Name",
      "icon": "path/to/icon.png",
      "shortDescription": "Brief description",
      "detailedDescription": "Longer description",
      "features": ["Feature 1", "Feature 2", "Feature 3"],
      "stores": {
        "ios": "https://apps.apple.com/app/id123456789",
        "android": "https://play.google.com/store/apps/details?id=com.company.app",
        "windows": "https://www.microsoft.com/store/apps/app"
      }
    }
  ],
  "contact": {
    "email": "contact@example.com",
    "phone": "+1 (123) 456-7890",
    "address": "123 Street, City",
    "social": {
      "facebook": "https://facebook.com/example",
      "twitter": "https://twitter.com/example",
      "instagram": "https://instagram.com/example",
      "linkedin": "https://linkedin.com/company/example"
    }
  }
}
```

### Replacing Placeholder Images

1. Generate placeholder images using `images/placeholders.html`
2. Or replace with your own images (keep the same filenames or update the references in the JSON file)

### Modifying Colors and Styles

The color scheme can be customized in `css/styles.css`. Look for the `:root` section at the top of the file to modify the color variables.

```css
:root {
  --primary-color: #1a73e8;
  --secondary-color: #4285f4;
  /* other color variables */
}
```

### Modern Background Shapes

The project features a variety of modern decorative background shapes with CSS effects and animations. These shapes are implemented in a dedicated `css/blog-shapes.css` file and can be easily added to any page:

```css
/* Blob Shape - Organic, fluid shape with gradient and animation */
.bg-blob {
  position: absolute;
  width: 500px;
  height: 500px;
  /* other properties */
  border-radius: 71% 29% 65% 35% / 33% 56% 44% 67%;
  animation: morph 15s linear infinite alternate;
}

/* Hexagon Grid - Modern tech-focused pattern */
.bg-hexagon {
  position: absolute;
  width: 300px;
  height: 300px;
  /* other properties */
  background-image:
    linear-gradient(30deg, rgba(var(--accent-color-rgb), 0.1) 12%, transparent 12.5%, transparent 87%, rgba(var(--accent-color-rgb), 0.1) 87.5%, rgba(var(--accent-color-rgb), 0.1)),
    /* additional gradient layers */;
  background-size: 40px 70px;
  animation: float 20s infinite alternate ease-in-out;
}

/* Wave Pattern - Extending the existing wave concept */
.bg-wave {
  position: absolute;
  width: 400px;
  height: 400px;
  /* other properties */
}

.bg-wave::before, .bg-wave::after {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  /* other properties */
  border-radius: 38% 42% 61% 39% / 44% 51% 49% 56%;
  animation: wave 15s linear infinite;
}
```

#### Available Shape Types

1. **Blob Shapes** - Organic, fluid shapes with morphing animations
2. **Hexagon Grid** - Modern tech-focused pattern with subtle animation
3. **Diagonal Lines** - Subtle repeating pattern for texture
4. **Wave Patterns** - Fluid, overlapping wave animations
5. **Triangle Patterns** - Angular geometric designs
6. **Dotted Grid** - Subtle background texture

#### How to Use the Shapes

1. Include the CSS file in your HTML:
   ```html
   <link rel="stylesheet" href="css/blog-shapes.css">
   ```

2. Add the shape elements to your HTML:
   ```html
   <div class="bg-blob"></div>
   <div class="bg-hexagon"></div>
   <div class="bg-diagonal"></div>
   ```

3. Customize by adjusting the CSS properties like position, size, and colors

All shapes are designed to work with both light and dark themes and include specific adjustments for each theme to ensure proper visibility.

## Adding or Removing Apps

To add a new app or remove an existing one:

1. Open `data/apps.json`
2. To add an app, copy an existing app object and modify its properties
3. To remove an app, delete the entire app object from the JSON array
4. Save the file and refresh the page

The website will automatically update to reflect your changes.

### App Store Links

The app store links (App Store, Google Play, Windows) are designed to wrap properly when all three platforms are displayed:

```css
.app-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
}

.app-link {
  min-width: 120px;
  justify-content: center;
  /* other styles */
}
```

This ensures that the links remain visually appealing and properly aligned on all screen sizes, even when multiple platform links are displayed.

## Deploying to GitHub Pages with Custom Domain

### Basic GitHub Pages Deployment

1. Create a new repository on GitHub (or use an existing one)
2. Push your customized code to the repository
3. Go to the repository settings
4. Navigate to the "Pages" section in the left sidebar
5. Under "Source", select the branch you want to deploy (usually `main` or `master`)
6. Click Save
7. Wait a few minutes for your site to be published

Your site will be published at `https://yourusername.github.io/repository-name/`

### Setting Up a Custom Domain

#### Step 1: Purchase a Domain Name
1. Choose a domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
2. Search for and purchase your desired domain name
3. Access the domain's DNS settings in your registrar's dashboard

#### Step 2: Configure DNS Records
For an apex domain (example.com):
1. Add these A records pointing to GitHub Pages' IP addresses:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

For a subdomain (blog.example.com):
1. Add a CNAME record:
   - Name/Host: subdomain (e.g., "blog" or "www")
   - Value/Target: `yourusername.github.io`
   - TTL: 3600 or automatic

#### Step 3: Configure GitHub Repository
1. In your repository settings, go to the "Pages" section
2. Under "Custom domain", enter your domain name (e.g., example.com or blog.example.com)
3. Click "Save"
4. Check "Enforce HTTPS" once the SSL certificate is provisioned (may take up to 24 hours)

#### Step 4: Add CNAME File
1. Create a file named `CNAME` (no file extension) in the root of your repository
2. Add your custom domain to this file (e.g., `example.com` or `blog.example.com`)
3. Commit and push this file to your repository

```
example.com
```

#### Step 5: Verify and Troubleshoot
1. Wait for DNS propagation (can take 24-48 hours)
2. Visit your custom domain to verify it's working
3. If there are issues:
   - Verify DNS records are correct
   - Check GitHub Pages settings
   - Ensure the CNAME file exists and contains the correct domain
   - Use `dig` or `nslookup` commands to check DNS resolution

#### Step 6: Maintain Your Domain
1. Ensure your domain registration doesn't expire
2. GitHub will automatically renew the SSL certificate
3. If you change repositories, update your DNS settings accordingly

## Important Notes

### Local Development

When testing locally, you may encounter CORS issues when trying to load the JSON file. To avoid this:

To run the site locally (so fetch('data/apps.json') works) you must serve the files over HTTP. From the project root (the folder that contains index.html), use one of these simple options:

1. Python 3 (no install needed if Python is installed)
   - Open a terminal / PowerShell in the project root and run:
     ```
     python -m http.server 8000
     ```
   - Open: http://localhost:8000

2. Node.js (using npx, installs nothing globally)
   - Run:
     ```
     npx http-server -p 8000
     ```
   - Open: http://localhost:8000

3. VS Code Live Server extension
   - Install Live Server, open the project in VS Code, right-click index.html → "Open with Live Server".

Notes and troubleshooting:
- Do NOT open index.html via file:// in the browser — Fetch/XHR will be blocked or fail to load JSON.
- Ensure you run the command from the repository root so the path data/apps.json resolves as expected.
- If you see 404 for data/apps.json in DevTools → Network, verify the file exists at data/apps.json and no typos in the filename.
- If you changed the JSON filename or folder, update the fetch path in your JS (e.g., fetch('data/myapps.json')).
- For Windows with Python2 use: python -m SimpleHTTPServer 8000 (rare).
- If you need HTTPS locally for some browser features, consider tools like mkcert or a local dev proxy, but it's not required for basic testing.

### JSON Data Loading

The application uses the Fetch API with promises to load the JSON data:

```javascript
fetch('data/apps.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Process the data
    renderContent(data);
  })
  .catch(error => {
    console.error('Error loading the JSON data:', error);
    displayErrorMessage('Failed to load app data. Please try again later.');
  });
```

This promise-based approach ensures clean, maintainable code and proper error handling. The implementation includes:

1. Proper error checking with the `response.ok` property
2. Detailed error messages in the console
3. User-friendly error display on the page
4. Robust error handling with the catch block

When deployed to GitHub Pages, the JSON file will load correctly as GitHub Pages serves content through a proper web server.

### Browser Compatibility

This project is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Monetization with Google AdSense

This project includes comprehensive documentation for integrating Google AdSense ads into your blog posts. For detailed instructions, see the [AdSense Integration Guide](ADSENSE-INTEGRATION.md).

The guide covers:

- Multiple implementation options (manual placements, Auto Ads, sidebar ads, or combination approach)
- Step-by-step instructions for each implementation method
- CSS styling for ad containers
- Best practices for ad placement and optimization
- Troubleshooting common issues

## License

This project is available for personal and commercial use. Attribution is appreciated but not required.

## Credits

- Fonts: [Google Fonts](https://fonts.google.com/)
- Icons: [Font Awesome](https://fontawesome.com/)