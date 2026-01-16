const PAGE_STYLES = `
<style>
  h2{
    margin:0;
  }
  .modal {
    width: 400px;
    background-color: white;
    border-radius: var(--radius);
    border: 1px solid var(--neutral);
    box-shadow: 0px 4px 6px 3px #0000001c;
    padding: 1.2em;
  }
  .modal::backdrop {
    background-color: rgba(0, 0, 0, 0.4);
  }
  .modal h2 {
    margin: 0;
  }
  .form {
    display: flex;
    flex-direction: column;
  }
  #form_errors {
    color: #fc736c;
    font-size: 1rem;
    margin: 0;
  }
  label {
    margin-top: 6px;
    font-size: 12px;
  }
</style>
`;

async function render(_a, PROJECT_INFO) {
  const { data } = await (
    await fetch(`/api/project/${PROJECT_INFO.id}/members`)
  ).json();

  let content =
    PAGE_STYLES +
    `
<div class="flex-row-between">
  <h2>Board</h2>
  <button id="create">Create new task</button>
</div>
<p>${PROJECT_INFO.name} board</p>
<dialog class="modal">
  <div class="flex-row-between" style="padding-bottom: 1rem">
    <h2>Create a new Issue</h2>
    <button id="close" class="btn-ghost">Close</button>
  </div>
  <form class="form">
    <label for="description">Issue Description</label>
    <input
      type="text"
      name="description"
      id="description"
      placeholder="Issue description"
      autocomplete="off"
    />
    <label for="type">Issue Type</label>
    <select name="type" id="type">
      <option value="task">Task</option>
      <option value="bug">Bug</option>
      <option value="story">Story</option>
    </select>
    <label for="priority">Issue Priority</label>
    <select name="priority" id="priority">
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </select>
    
    <label for="assignee_id">Assignee Id</label>
    <select type="text" name="assignee_id" id="assignee_id" placeholder="Assingee id" default="none">
      <option value="none">None</option>
    ${data.members
      .map(
        (member) => `<option value="${member.id}">${member.fullname}</option>`
      )
      .join("")}
    </select>
   
    <input type="submit" value="Submit" />
    <p id="form_errors"></p>
  </form>
</dialog>`;

  const init = () => {
    const modal = document.querySelector(".modal");
    const createBtn = document.querySelector("#create");
    const closeBtn = document.querySelector("#close");
    const form = document.querySelector(".form");
    const formErrors = document.querySelector("#form_errors");

    if (createBtn) {
      createBtn.addEventListener("click", () => {
        modal.showModal();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.close();
      });
    }
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const description = fd.get("description");
        const type = fd.get("type");
        const priority = fd.get("priority");
        const assignee_id = fd.get("assignee_id");

        console.log(description, type, priority, assignee_id);

        if (!description || !type || !priority || !assignee_id) {
          formErrors.innerHTML = "Null fields";
          return;
        }

        const res = await (
          await fetch("/api/issues/", {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
              description,
              type,
              priority,
              assignee_id,
              project_id: PROJECT_INFO.id,
            }),
          })
        ).json();
      });
    }
  };

  return { html: content, init };
}
export default render;
