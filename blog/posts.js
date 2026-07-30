const POSTS = [
  {
    slug: "hello-world",
    title: "Hello World",
    date: "2025-07-14",
    tags: ["intro", "web"],
    excerpt: "Welcome to my blog! This is the first post where I talk about what this site is all about.",
    content: `
      <p>Welcome to my blog! I'm excited to finally have a space to share my thoughts and projects.</p>
      <p>This site is a collection of things I've been working on — from web experiments to games to whatever else catches my interest. The blog is where I'll write about the process behind these projects, what I've learned, and where things are headed.</p>
      <p>Everything here is built with plain HTML, CSS, and JavaScript. No frameworks, no build tools — just the raw web. I like it that way.</p>
      <p>Stay tuned for more posts coming soon.</p>
    `
  },
  {
    slug: "building-the-pong-game",
    title: "Building the Pong Game",
    date: "2025-07-15",
    tags: ["games", "javascript", "canvas"],
    excerpt: "How I built a two-player Pong game using the Canvas API, with gradient glows and capsule-shaped paddles.",
    content: `
      <p>Pong is one of those classic games that everyone recognizes. I wanted to recreate it using modern web tech — the Canvas API specifically — while adding my own visual flair.</p>
      <h3>The Basics</h3>
      <p>The core game loop runs at 60fps using <code>requestAnimationFrame</code>. Each frame, we move the paddles based on keyboard input, update the ball position, check for collisions, and redraw everything.</p>
      <h3>Visual Polish</h3>
      <p>Instead of plain rectangles, I used capsule-shaped paddles drawn with semicircles and lines. The background has a subtle gradient glow on each side — sky blue for player 1, red for player 2 — that fades toward the center. It's faint enough to not distract but adds depth to the scene.</p>
      <h3>Collision Detection</h3>
      <p>Ball-paddle collisions use AABB (axis-aligned bounding box) intersection. When the ball hits a paddle, its Y velocity is adjusted based on where it hit — hitting the edge of the paddle sends it at a sharper angle than hitting the center.</p>
      <p>The game plays in both a browser version and a Python/Tkinter version, keeping the same mechanics across both.</p>
    `
  },
  {
    slug: "css-glassmorphism",
    title: "Glassmorphism in CSS",
    date: "2025-07-16",
    tags: ["web", "css", "design"],
    excerpt: "A quick look at how to create glassmorphism effects using backdrop-filter and semi-transparent backgrounds.",
    content: `
      <p>Glassmorphism is that frosted-glass look you see on a lot of modern interfaces. It's surprisingly easy to achieve with just a few CSS properties.</p>
      <h3>The Recipe</h3>
      <p>At its core, glassmorphism needs three things:</p>
      <ul>
        <li>A semi-transparent background: <code>rgba(255, 255, 255, 0.12)</code></li>
        <li>A blur filter on the backdrop: <code>backdrop-filter: blur(12px)</code></li>
        <li>A subtle border: <code>border: 1px solid rgba(255, 255, 255, 0.1)</code></li>
      </ul>
      <h3>When It Works Best</h3>
      <p>Glassmorphism shines when there's a colorful or gradient background behind the element. On a flat solid background, it doesn't really have anything to blur — so the effect falls flat. A busy background with varying colors and shapes gives the blur something to work with.</p>
      <h3>Watch Out For</h3>
      <p>Browser support is solid now, but performance can take a hit on low-end devices with lots of blurred elements. Use it sparingly — a card or two is fine, but don't blur your entire page.</p>
    `
  }
];
