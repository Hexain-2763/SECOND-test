(() => {
  const isPostPage = window.location.pathname.includes("post.html");

  function formatDate(dateStr) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  function renderTags(tags) {
    return tags.map(t => `<span class="post-tag">${t}</span>`).join("");
  }

  // --- Post listing page ---
  if (!isPostPage) {
    const tagBar = document.getElementById("tagBar");
    const postList = document.getElementById("postList");
    const allTags = [...new Set(POSTS.flatMap(p => p.tags))].sort();
    let activeTag = null;

    function buildTagBar() {
      tagBar.innerHTML = "";
      const allBtn = document.createElement("button");
      allBtn.className = "tag-btn" + (activeTag === null ? " active" : "");
      allBtn.textContent = "All";
      allBtn.onclick = () => { activeTag = null; render(); };
      tagBar.appendChild(allBtn);

      allTags.forEach(tag => {
        const btn = document.createElement("button");
        btn.className = "tag-btn" + (activeTag === tag ? " active" : "");
        btn.textContent = tag;
        btn.onclick = () => { activeTag = tag; render(); };
        tagBar.appendChild(btn);
      });
    }

    function render() {
      buildTagBar();
      const filtered = activeTag
        ? POSTS.filter(p => p.tags.includes(activeTag))
        : POSTS;

      if (filtered.length === 0) {
        postList.innerHTML = `<p class="no-posts">No posts found.</p>`;
        return;
      }

      postList.innerHTML = filtered.map(p => `
        <a href="post.html?slug=${p.slug}" class="post-card">
          <div class="post-card-date">${formatDate(p.date)}</div>
          <div class="post-card-title">${p.title}</div>
          <div class="post-card-excerpt">${p.excerpt}</div>
          <div class="post-card-tags">${renderTags(p.tags)}</div>
        </a>
      `).join("");
    }

    render();
  }

  // --- Single post page ---
  if (isPostPage) {
    const container = document.getElementById("postContent");
    const slug = new URLSearchParams(window.location.search).get("slug");
    const post = POSTS.find(p => p.slug === slug);

    if (!post) {
      container.innerHTML = `<p class="no-posts">Post not found.</p>`;
      return;
    }

    document.title = post.title + " — Blog";
    container.innerHTML = `
      <div class="post-meta">${formatDate(post.date)}</div>
      <h1 class="post-title">${post.title}</h1>
      <div class="post-body">${post.content}</div>
      <div class="post-tags">${renderTags(post.tags)}</div>
    `;
  }
})();
