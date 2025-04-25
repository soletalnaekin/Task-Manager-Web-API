const allTasks = document.querySelector("#all-tasks");
const urgentTasks = document.querySelector("#urgent-tasks");

var modal = {
  element: document.querySelector(".modal"),
};

modal.heading = modal.element.querySelector("h2");
modal.title = modal.element.querySelector("#title");
modal.description = modal.element.querySelector("#description");
modal.tags = modal.element.querySelector("#tags");
modal.deadline = modal.element.querySelector("#deadline");
modal.button = modal.element.querySelector(".btn-primary");
modal.bootstrap = new bootstrap.Modal(modal.element);

function createButton() {
  modal.heading.innerHTML = "Create Task";

  modal.title.value =
    modal.description.value =
    modal.tags.value =
    modal.deadline.value =
      "";

  modal.title.readOnly =
    modal.description.readOnly =
    modal.tags.readOnly =
    modal.deadline.readOnly =
      false;

  modal.button.classList.remove("d-none");
  modal.button.onclick = () => {
    createTask(
      modal.title.value,
      modal.description.value,
      modal.tags.value.split(",").map((tag) => tag.trim()),
      false,
      modal.deadline.value ? modal.deadline.value : null
    );
  };

  modal.bootstrap.show();
}

function viewButton(title, description, tags, deadline) {
  modal.heading.innerHTML = "View Task";

  modal.title.value = title;
  modal.description.value = description;
  modal.tags.value = tags;
  modal.deadline.value = deadline;

  modal.title.readOnly =
    modal.description.readOnly =
    modal.tags.readOnly =
    modal.deadline.readOnly =
      true;

  modal.button.classList.add("d-none");

  modal.bootstrap.show();
}

function updateButton(id, title, description, tags, completed, deadline) {
  modal.heading.innerHTML = "Update Task";

  modal.title.value = title;
  modal.description.value = description;
  modal.tags.value = tags;
  modal.deadline.value = deadline;

  modal.title.readOnly =
    modal.description.readOnly =
    modal.tags.readOnly =
    modal.deadline.readOnly =
      false;

  modal.button.classList.remove("d-none");
  modal.button.onclick = () => {
    updateTask(
      id,
      modal.title.value,
      modal.description.value,
      modal.tags.value.split(",").map((tag) => tag.trim()),
      completed,
      modal.deadline.value ? modal.deadline.value : null
    );
  };

  modal.bootstrap.show();
}

function createTask(title, description, tags, completed, deadline) {
  fetch("/api/task/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      tags,
      completed,
      deadline,
    }),
  }).then(() => location.reload());
}

function updateTask(id, title, description, tags, completed, deadline) {
  fetch("/api/task/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      title,
      description,
      tags,
      completed,
      deadline,
    }),
  }).then(() => location.reload());
}

function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?"))
    fetch(`/api/task/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => location.reload());
}

fetch("/api/tasks")
  .then((response) => response.json())
  .then((tasks) => {
    if (!tasks.length) return;

    allTasks.innerHTML = "";

    tasks.map((task) => {
      allTasks.innerHTML += `
        <div class="col mb-4">
          <div class="card h-100 ${
            task.deadline && new Date(task.deadline) < new Date()
              ? "bg-danger-subtle"
              : ""
          }">
            <div class="card-body d-flex flex-column">
              <h3
                class="card-title fs-4 d-flex justify-content-between align-items-center"
              >
                ${task.title}
                <span class="ms-auto me-3 fs-5 fw-lighter">${
                  task.deadline ? new Date(task.deadline).toLocaleString() : ""
                }</span>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  ${task.completed ? "checked" : ""}
                  id="checkDefault"
                  onchange="updateTask(\`${task.id}\`, \`${task.title}\`, \`${
        task.description
      }\`, [${task.tags
        .map((tag) => `\`${tag}\``)
        .join(", ")}], ${!task.completed}, ${
        task.deadline ? `\`${task.deadline}\`` : null
      })"
                />
              </h3>
              <hr />
              <p class="card-text m-0">
                ${task.tags
                  .map(
                    (tag) =>
                      `<span class="badge text-bg-info mb-2 me-2">${tag}</span>`
                  )
                  .join("")}
              </p>
              <p class="card-text">${task.description}</p>
              <p class="card-text mb-1">
                <span class="fst-italic">Created at</span> ${new Date(
                  task.createdAt
                ).toLocaleString()}
              </p>
              <p class="card-text">
                <span class="fst-italic">Updated at</span> ${new Date(
                  task.updatedAt
                ).toLocaleString()}
              </p>
              <div class="mt-auto ms-auto">
                <button type="button" class="btn btn-outline-primary me-2 border-2" onclick="viewButton(\`${
                  task.title
                }\`, \`${task.description}\`, \`${task.tags.join(", ")}\`, \`${
        task.deadline ? task.deadline.substring(0, 19) : ""
      }\`)">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button type="button" class="btn btn-outline-warning me-2 border-2" onclick="updateButton(\`${
                  task.id
                }\`, \`${task.title}\`, \`${
        task.description
      }\`, \`${task.tags.join(", ")}\`, ${
        task.completed ? "true" : "false"
      }, \`${task.deadline ? task.deadline.substring(0, 19) : ""}\`)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="btn btn-outline-danger border-2" onclick="deleteTask(\`${
                  task.id
                }\`)">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>`;
    });

    tasks = tasks.filter(
      (task) =>
        task.deadline &&
        new Date(task.deadline) <
          new Date().setDate(new Date().getDate() + 7) &&
        new Date(task.deadline) > new Date()
    );

    if (!tasks.length) return;

    urgentTasks.innerHTML = "";

    tasks.map((task) => {
      urgentTasks.innerHTML += `
        <div class="col mb-4">
          <div class="card h-100">
            <div class="card-body d-flex flex-column">
              <h3
                class="card-title fs-4 d-flex justify-content-between align-items-center"
              >
                ${task.title}
                <span class="ms-auto me-3 fs-5 fw-lighter">${
                  task.deadline ? new Date(task.deadline).toLocaleString() : ""
                }</span>
                <input
                  class="form-check-input m-0"
                  type="checkbox"
                  ${task.completed ? "checked" : ""}
                  id="checkDefault"
                  onchange="updateTask(\`${task.id}\`, \`${task.title}\`, \`${
        task.description
      }\`, [${task.tags
        .map((tag) => `\`${tag}\``)
        .join(", ")}], ${!task.completed}, ${
        task.deadline ? `\`${task.deadline}\`` : null
      })"
                />
              </h3>
              <hr />
              <p class="card-text m-0">
                ${task.tags
                  .map(
                    (tag) =>
                      `<span class="badge text-bg-info mb-2 me-2">${tag}</span>`
                  )
                  .join("")}
              </p>
              <p class="card-text">${task.description}</p>
              <p class="card-text mb-1">
                <span class="fst-italic">Created at</span> ${new Date(
                  task.createdAt
                ).toLocaleString()}
              </p>
              <p class="card-text">
                <span class="fst-italic">Updated at</span> ${new Date(
                  task.updatedAt
                ).toLocaleString()}
              </p>
              <div class="mt-auto ms-auto">
                <button type="button" class="btn btn-outline-primary me-2 border-2" onclick="viewButton(\`${
                  task.title
                }\`, \`${task.description}\`, \`${task.tags.join(", ")}\`, \`${
        task.deadline ? task.deadline.substring(0, 19) : ""
      }\`)">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button type="button" class="btn btn-outline-warning me-2 border-2" onclick="updateButton(\`${
                  task.id
                }\`, \`${task.title}\`, \`${
        task.description
      }\`, \`${task.tags.join(", ")}\`, ${
        task.completed ? "true" : "false"
      }, \`${task.deadline ? task.deadline.substring(0, 19) : ""}\`)">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="btn btn-outline-danger border-2" onclick="deleteTask(\`${
                  task.id
                }\`)">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          </div>
        </div>`;
    });
  });
