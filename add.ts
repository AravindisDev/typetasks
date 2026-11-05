import { addTask, completeTask, filterByStatus } from "./model.js";
import type { Task, TaskStatus } from "./model.js";

let tasks: Task[] = [];
let currentFilter: "all" | TaskStatus = "all";

const titleInput = document.getElementById("title") as HTMLInputElement | null;
const statusSelect = document.getElementById("status") as HTMLSelectElement | null;
const addBtn = document.getElementById("add") as HTMLButtonElement | null;
const listEl = document.getElementById("list") as HTMLUListElement | null;
const chipsEl = document.getElementById("chips") as HTMLDivElement | null;

if (!titleInput || !statusSelect || !addBtn || !listEl || !chipsEl) {
  throw new Error("Required task UI elements are missing from the page.");
}

addBtn.onclick = () => {
  const title = titleInput.value.trim();
  if (!title) return;

  const initialStatus = statusSelect.value as TaskStatus;
  tasks = addTask(tasks, title, initialStatus);
  titleInput.value = "";
  render();
};

function renderChips(): void {
  const filters: Array<"all" | TaskStatus> = ["all", "todo", "in-progress", "done"];
  chipsEl.innerHTML = "";

  filters.forEach((filterName) => {
    const btn = document.createElement("button");
    btn.textContent = filterName;

    if (currentFilter === filterName) {
      btn.classList.add("active");
    }

    btn.onclick = () => {
      currentFilter = filterName;
      render();
    };

    chipsEl.appendChild(btn);
  });
}

function render(): void {
  renderChips();
  listEl.innerHTML = "";

  const displayedTasks = filterByStatus(tasks, currentFilter);

  displayedTasks.forEach((task: Task) => {
    const li = document.createElement("li");
    li.className = "task";

    const leftDiv = document.createElement("div");
    leftDiv.className = "left";

    const titleSpan = document.createElement("span");
    titleSpan.textContent = task.title;

    const badge = document.createElement("span");
    badge.textContent = task.status;
    badge.style.fontSize = "11px";
    badge.style.padding = "2px 6px";
    badge.style.borderRadius = "4px";
    badge.style.background =
      task.status === "done"
        ? "#dcfce7"
        : task.status === "in-progress"
          ? "#fef3c7"
          : "#f3f4f6";

    leftDiv.appendChild(titleSpan);
    leftDiv.appendChild(badge);

    const rightDiv = document.createElement("div");
    rightDiv.style.display = "flex";
    rightDiv.style.gap = "6px";

    if (task.status !== "done") {
      const advanceBtn = document.createElement("button");
      advanceBtn.className = "advance";
      advanceBtn.textContent = "advance →";
      advanceBtn.onclick = () => {
        tasks = completeTask(tasks, task.id);
        render();
      };
      rightDiv.appendChild(advanceBtn);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.textContent = "✕";
    deleteBtn.onclick = () => {
      tasks = tasks.filter((t: Task) => t.id !== task.id);
      render();
    };
    rightDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(rightDiv);
    listEl.appendChild(li);
  });
}

render();
