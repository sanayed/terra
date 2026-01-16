class Router {
  constructor(routes, content, PROJECT_INFO, PROJECT_ID) {
    this.routes = routes;
    this.content = content;
    this.PROJECT_INFO = PROJECT_INFO;
    this.PROJECT_ID = PROJECT_ID;
    this.renderCache = new Map();
    this.scriptCache = new Map();

    window.addEventListener("popstate", () => this.route());
  }

  async route() {
    const base = `/projects/${this.PROJECT_ID}`;
    let path = location.pathname.replace(base, "");
    if (path === "" || path === "/") path = "/";

    // Unknown Path, 404 Fallback
    if (!this.routes[path]) {
      this.content.innerHTML = "<h2>Not Found</h2>";
      this.setActive(path);
      return;
    }

    // Rendered, Cached path
    if (this.renderCache.has(path)) {
      const cached = this.renderCache.get(path);
      this.content.innerHTML = cached.html;
      if (cached.init) {
        setTimeout(cached.init, 0);
      }
      this.setActive(path);
      return;
    }

    // Script cached path
    if (this.scriptCache.has(path)) {
      this._draw(path);
    } else {
      // fetch and cache render function
      const { default: render } = await import(
        `/templates/${this.routes[path]}`
      );
      this.scriptCache.set(path, render);
      this._draw(path);
    }

    this.setActive(path);
  }

  async _draw(path) {
    const view = this.scriptCache.get(path);
    const rendered = await view(
      this.content,
      this.PROJECT_INFO,
      this.renderCache
    );
    const isObject =
      typeof rendered === "object" &&
      rendered !== null &&
      !Array.isArray(rendered);
    if (isObject && rendered.html) {
      this.renderCache.set(path, rendered);
      this.content.innerHTML = rendered.html;
      if (rendered.init) {
        setTimeout(rendered.init, 0);
      }
    } else {
      // Fallback for render functions that return plain HTML strings
      this.content.innerHTML = rendered;
    }
  }

  navigate(path) {
    const base = `/projects/${this.PROJECT_ID}`;
    history.pushState({}, "", base + path);
    this.route();
  }

  setActive(path) {
    document.querySelectorAll("[data-href]").forEach((btn) => {
      btn.classList.toggle("active-route", btn.dataset.href === path);
    });
  }
}
