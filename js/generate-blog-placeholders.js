/**
 * Blog Image Placeholder Generator
 * 
 * This script creates placeholder images for blog posts using the placehold.co service.
 * It updates the blog.js file to use these placeholder images until real images are added.
 * 
 * Usage:
 * 1. Open the browser console on any page of the website
 * 2. Copy and paste this entire script
 * 3. Press Enter to execute
 * 
 * Note: This is a temporary solution until real images are added.
 */

// Define blog post titles and corresponding placeholder images
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with App1",
    color: "3498db", // Blue
    category: "tutorials"
  },
  {
    id: 2,
    title: "New Features Coming",
    color: "2ecc71", // Green
    category: "updates"
  },
  {
    id: 3,
    title: "AI in Mobile Apps",
    color: "9b59b6", // Purple
    category: "technology"
  },
  {
    id: 4,
    title: "Advanced Features in App2",
    color: "e74c3c", // Red
    category: "technology"
  },
  {
    id: 5,
    title: "1 Million Downloads",
    color: "f39c12", // Orange
    category: "news"
  },
  {
    id: 6,
    title: "Security Best Practices",
    color: "1abc9c", // Teal
    category: "technology"
  }
];

// Generate placeholder image URLs
console.log("Blog Post Placeholder Images:");
console.log("============================");
console.log("Copy and use these URLs in your blog.js file until real images are available:");
console.log("");

blogPosts.forEach(post => {
  // Format: https://placehold.co/1200x800/[HEX]/FFFFFF/png?text=[TEXT]
  const imageUrl = `https://placehold.co/1200x800/${post.color}/FFFFFF/png?text=${encodeURIComponent(post.title)}`;
  console.log(`Blog Post ${post.id} (${post.category}):`);
  console.log(imageUrl);
  console.log("");
});

console.log("============================");
console.log("Instructions:");
console.log("1. Copy these URLs");
console.log("2. Replace the image paths in js/blog.js");
console.log("3. For a permanent solution, download these images and save them as:");
console.log("   images/blog/blog-post1.jpg through images/blog/blog-post6.jpg");