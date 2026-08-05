const TASKS_KEY = "avek-va-tasks";
const DATE_KEY = "avek-va-tasks-date";
const NOTES_KEY = "avek-va-notes";

const DEFAULT_TASKS = [
    "Reply to all new leads (within 15 min if possible)",
    "Morning follow-ups — yesterday's unanswered leads",
    "Day-3 and day-5 follow-ups (check the list)",
    "Send day-before reminders for tomorrow's walkthroughs",
    "Send day-of reminders for today's visits",
    "Check owner's replies on pending prices and get back to leads",
    "Update the spreadsheet with new bookings",
];

const listEl = document.getElementById("task-list");
const inputEl = document.getElementById("new-task");
const addBtn = document.getElementById("add-task-btn");
const notesEl = document.getElementById("va-notes");
const notesStatus = document.getElementById("notes-status");

function today() {
    return new Date().toISOString().slice(0, 10);
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "null");
    if (!tasks) {
        tasks = DEFAULT_TASKS.map((text, i) => ({ id: Date.now() + i, text, done: false }));
    }
    if (localStorage.getItem(DATE_KEY) !== today()) {
        tasks = tasks.map((t) => ({ ...t, done: false }));
        localStorage.setItem(DATE_KEY, today());
    }
    saveTasks(tasks);
    return tasks;
}

function saveTasks(tasks) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();

function render() {
    listEl.innerHTML = tasks
        .map(
            (t) => `
        <li class="task-item ${t.done ? "done" : ""}">
            <label>
                <input type="checkbox" data-id="${t.id}" ${t.done ? "checked" : ""}>
                <span>${t.text}</span>
            </label>
            <button class="task-del" data-del="${t.id}" aria-label="Delete task">✕</button>
        </li>`
        )
        .join("");
}

function addTask() {
    const text = inputEl.value.trim();
    if (!text) return;
    tasks.push({ id: Date.now(), text, done: false });
    inputEl.value = "";
    saveTasks(tasks);
    render();
}

addBtn.addEventListener("click", addTask);
inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

listEl.addEventListener("change", (e) => {
    const cb = e.target.closest("input[data-id]");
    if (!cb) return;
    const task = tasks.find((t) => t.id === Number(cb.dataset.id));
    task.done = cb.checked;
    saveTasks(tasks);
    render();
});

listEl.addEventListener("click", (e) => {
    const del = e.target.closest("[data-del]");
    if (!del) return;
    tasks = tasks.filter((t) => t.id !== Number(del.dataset.del));
    saveTasks(tasks);
    render();
});

notesEl.value = localStorage.getItem(NOTES_KEY) || "";
let notesTimer;
notesEl.addEventListener("input", () => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
        localStorage.setItem(NOTES_KEY, notesEl.value);
        notesStatus.textContent = "Saved ✓";
        setTimeout(() => (notesStatus.textContent = ""), 1500);
    }, 400);
});

render();
