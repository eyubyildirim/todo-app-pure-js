// @ts-check

/** @type {Todo[]} */
// @ts-ignore 
const todosState = JSON.parse(localStorage.getItem("todosList")) ?? [];

/**
 * @typedef {object} Todo - Represents a single todo item.
 * @property {string} id - A unique identifier.
 * @property {string} desc - The content of the todo.
 * @property {number} createdAt - Timestamp of creation date
 * @property {number} dueDate - Timestamp of due date
 * @property {string} status - Status of the todo
 */

const todoInput = document.getElementById("new-todo-input");
const todoDate = document.getElementById("new-todo-date")
const todoButton = document.getElementById("new-todo-button");
const todoList = document.getElementById("todo-list");
const newTodoDiv = document.getElementById("new-todo-div")

todoList?.addEventListener('click', /** @type {(e: MouseEvent) => any} */(e) => {
    if (e.target instanceof HTMLElement) {
        console.log(e.target.id)
        if (e.target.id.includes("delete")) {
            // @ts-ignore
            const todoIndex = todosState.findIndex(v => v.id === e.target.id.replace('delete-button-', ''))
            const oldTodos = structuredClone(todosState)
            todosState.splice(todoIndex, 1)
            renderTodos(todosState, oldTodos, "remove-todo");
        } else if (e.target.id.includes("complete")) {
            // @ts-ignore
            const todoIndex = todosState.findIndex(v => v.id === e.target.id.replace('complete-button-', ''))
            const oldTodos = structuredClone(todosState)
            todosState[todoIndex].status = 'completed'
            renderTodos(todosState, oldTodos)
        }
    }
})

const addClass = (/** @type {HTMLElement | null} */ element, /** @type {string[]} */ ...className) => {
    if (!element) return;
    element.className += " " + className.join(" ");
};

/**
 * @type {(todos: Todo[], oldTodos: Todo[], ...classes: string[]) => void}
 */
const renderTodos = (todos, oldTodos, ...classes) => {
    console.log(todos);
    localStorage.setItem("todosList", JSON.stringify(todos));

    if (todos.length === oldTodos.length) {
        todos = todos.filter((todo, i) => !Object.keys(todo).every(v => todo[v] === oldTodos[i][v]))
        oldTodos = []
    }

    todos.forEach((todo) => {
        const oldTodosIndex = oldTodos.findIndex(v => v.id === todo.id)
        if (oldTodosIndex > -1) {
            oldTodos.splice(oldTodosIndex, 1);
            return;
        }

        const todoElementLi = document.getElementById(todo.id) ?? document.createElement("li");
        todoElementLi.id = todo.id;
        todoElementLi.setAttribute('status', todo.status)

        const todoElementDesc = document.createElement("h6");
        todoElementDesc.textContent = todo.desc;
        todoElementDesc.id = "desc-" + todo.id

        const todoElementDate = document.createElement("h6");
        todoElementDate.textContent = new Date(todo.dueDate).toDateString();
        todoElementDate.id = "date-" + todo.id

        const todoElementStatus = document.createElement("div");
        todoElementStatus.id = "status-" + todo.id

        const todoElementActions = document.createElement("div");

        const todoElementCompleteButton = document.createElement("button");
        const todoElementDeleteButton = document.createElement("button");
        todoElementCompleteButton.id = "complete-button-" + todo.id
        todoElementDeleteButton.id = "delete-button-" + todo.id

        const completeIcon = document.createElement('i')
        completeIcon.classList.add("fa-solid", "fa-check")
        todoElementCompleteButton.appendChild(completeIcon)

        const trashIcon = document.createElement('i')
        trashIcon.classList.add("fa-solid", "fa-trash")
        todoElementDeleteButton.appendChild(trashIcon)

        completeIcon.id = "complete-button-" + todo.id
        trashIcon.id = "delete-button-" + todo.id

        addClass(todoElementLi, "todo-element");

        addClass(todoElementDesc, "todo-desc", "todo-content");
        addClass(todoElementDate, "todo-date", "todo-content");
        switch (todo.status) {
            case "new":
                addClass(todoElementStatus, "todo-status-new", "todo-status");
                break;
            case "completed":
                addClass(todoElementStatus, "todo-status-completed", "todo-status");
                break;
            default:
                addClass(todoElementStatus, "todo-status-new", "todo-status");
        }
        addClass(todoElementActions, "todo-actions");

        addClass(
            todoElementDeleteButton,
            "todo-action-button",
            "todo-action-button-delete",
        );
        addClass(
            todoElementCompleteButton,
            "todo-action-button",
            "todo-action-button-complete",
        );

        if (document.getElementById(todo.id)) {
            todoElementLi.innerHTML = ''
        }

        todoElementActions.appendChild(todoElementCompleteButton);
        todoElementActions.appendChild(todoElementDeleteButton);

        todoElementLi.appendChild(todoElementStatus);
        todoElementLi.appendChild(todoElementDesc);
        todoElementLi.appendChild(todoElementDate);
        todoElementLi.appendChild(todoElementActions);

        if (classes.length > 0) {
            todoElementLi.classList.add(...classes);
            todoElementLi.addEventListener(
                "animationend",
                () => {
                    todoElementLi.classList.remove(...classes);
                },
                { once: true },
            );
        }
        if (document.getElementById(todo.id)) return;

        // @ts-ignore
        todoList.appendChild(todoElementLi);
    });

    oldTodos.forEach((oldTodo) => {
        const todoToRemove = document.getElementById(oldTodo.id);

        if (!todoToRemove) return;

        if (classes.length > 0) {
            todoToRemove.classList.add(...classes);
            todoToRemove.addEventListener(
                "animationend",
                () => {
                    todoToRemove.classList.remove(...classes);
                    // @ts-ignore
                    todoList.removeChild(todoToRemove);
                },
                { once: true },
            );
        }
    });
};

addClass(todoList, "todo-list");

todoInput?.addEventListener("input", (ev) => {
    if (ev.target) {
        if (newTodoDiv?.classList.contains("new-todo-div-error")) {
            // @ts-ignore
            document.getElementById("new-todo-error-message").textContent = ""
            newTodoDiv.classList.remove("new-todo-div-error")
        }
    }
})

todoDate?.addEventListener("change", ev => {
    if (ev.target) {
        if (newTodoDiv?.classList.contains("new-todo-div-error")) {
            // @ts-ignore
            document.getElementById("new-todo-error-message").textContent = ""
            newTodoDiv.classList.remove("new-todo-div-error")
        }
    }
})

todoButton?.addEventListener("click", () => {
    // @ts-ignore
    const newTodoInput = todoInput?.value;
    // @ts-ignore
    const newTodoDate = todoDate?.value;

    if (!newTodoInput || newTodoInput.length < 3) {
        newTodoDiv?.classList.add("new-todo-div-error")
        // @ts-ignore
        document.getElementById("new-todo-error-message").textContent = "Todo description should be longer than 3 characters!"
        return;
    }

    if (!newTodoDate || ((+new Date(newTodoDate)) < +new Date())) {
        newTodoDiv?.classList.add("new-todo-div-error")
        // @ts-ignore
        document.getElementById("new-todo-error-message").textContent = "Due date should be after today!"
        return;
    }

    // @ts-ignore
    document.getElementById("new-todo-input").value = "";

    const newTodo = {
        id: crypto.randomUUID(),
        desc: newTodoInput,
        createdAt: +new Date(),
        dueDate: +new Date(newTodoDate),
        status: "new",
    };

    const oldTodos = [...todosState];
    todosState.push(newTodo);

    renderTodos(todosState, oldTodos, "new-todo");
});

const headerDate = document.getElementById("header-date")
// @ts-ignore
headerDate.textContent = (new Date()).toDateString()
renderTodos(todosState, []);

