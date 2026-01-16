const PAGE_STYLES = `
<style>
      .data-table {
        width: 100%;
        border: 1px solid #d6d6e7;
        font-family: system-ui, -apple-system, sans-serif;
        background: #fff;
        border-radius: var(--radius);
        overflow: hidden;
      }

      .data-table thead {
        background: #f5f7fa;
      }

      .data-table th,
      .data-table td {
        padding: 12px 16px;
        text-align: left;
      }

      .data-table th {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #555;
      }

      .data-table tbody tr {
        border-top: 1px solid #eee;
      }

      .data-table tbody tr:hover {
        background: #f9fafb;
      }
</style>
`;

async function render(contentEl, PROJECT_INFO, _cache) {
  // Check if already cached
  if (_cache.has("members-data")) {
    const cached = _cache.get("members-data");
    return { html: cached.html, init: () => {} };
  }

  // Start with loading template
  let content = `<h2>Members</h2><div id="members">Loading...</div>`;
  contentEl.innerHTML = content;

  try {
    const { data } = await (
      await fetch(`/api/project/${PROJECT_INFO.id}/members`)
    ).json();

    // Render fetched members
    let membersHTML =
      PAGE_STYLES +
      `
          <table class="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>`;

    membersHTML =
      membersHTML +
      data.members
        .map(
          (m) => `
            <tr>
              <td>${m.fullname}</a></td>
              <td>${m.email}</td>
              <td>${m.role.toUpperCase()}</td>
            </tr>`
        )
        .join("");

    membersHTML = membersHTML + `</tbody></table>`;
    const html = `
        <h2>Members</h2>
        <div id="members">${membersHTML}</div>
      `;

    // Cache the fetched data
    _cache.set("members-data", { html });

    return { html, init: () => {} };
  } catch (err) {
    const html = "<h2>Failed to load members</h2>";
    return { html, init: () => {} };
  }
}

export default render;
