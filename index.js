// @ts-check

// @ts-ignore
const todosState = JSON.parse(localStorage.getItem("todosList")) ?? [];

/**
 * @typedef {object} Todo - Represents a single todo item.
 * @property {string} id - A unique identifier.
 * @property {string} desc - The content of the todo.
 * @property {number} createdAt - Timestamp of creation date
 * @property {string} status - Status of the todo
 */

const todoInput = document.getElementById("new-todo-input");
const todoButton = document.getElementById("new-todo-button");
const todoList = document.getElementById("todo-list");

const addClass = (/** @type {HTMLElement | null} */ element, /** @type {string[]} */ ...className) => {
    if (!element) return;
    element.className += " " + className.join(" ");
};

/**
 * @type {(todos: Todo[], oldTodos: Todo[], ...classes: string[]) => void}
 */
const renderTodos = (todos, oldTodos, ...classes) => {
    localStorage.setItem("todosList", JSON.stringify(todos));

    if (todos.length === oldTodos.length) {
        todos = todos.filter((todo, i) => !Object.keys(todo).every(v => todo[v] === oldTodos[i][v]))
        oldTodos = []
    }

    todos.forEach((todo) => {
        if (oldTodos.includes(todo)) {
            oldTodos.splice(oldTodos.indexOf(todo), 1);
            return;
        }

        const todoElementLi = document.getElementById(todo.id) ?? document.createElement("li");

        const todoElementDesc = document.createElement("h6");
        todoElementDesc.textContent = todo.desc;

        const todoElementDate = document.createElement("h6");
        todoElementDate.textContent = new Date(todo.createdAt).toLocaleDateString();

        const todoElementStatus = document.createElement("h6");
        todoElementStatus.textContent = todo.status.toUpperCase();

        const todoElementActions = document.createElement("div");

        const todoElementCompleteButton = document.createElement("button");
        const todoElementDeleteButton = document.createElement("button");

        todoElementCompleteButton.textContent = "Complete";
        todoElementDeleteButton.textContent = "Delete";

        todoElementDeleteButton.addEventListener("click", () => {
            const oldTodos = [...todos]
            todos.splice(todos.indexOf(todo), 1);
            renderTodos(todos, oldTodos, "remove-todo");
        });
        todoElementCompleteButton.addEventListener("click", () => {
            const oldTodos = structuredClone(todos)
            console.log(oldTodos)
            todos[todos.indexOf(todo)].status = "completed"
            renderTodos(todos, oldTodos)
        });

        todoElementLi.id = todo.id;
        addClass(todoElementLi, "todo-element");

        addClass(todoElementDesc, "todo-desc", "todo-content");
        addClass(todoElementDate, "todo-date", "todo-content");
        switch (todo.status) {
            case "new":
                addClass(todoElementStatus, "todo-status-new", "todo-status", "todo-content");
                break;
            case "completed":
                addClass(todoElementStatus, "todo-status-completed", "todo-status", "todo-content");
                break;
            default:
                addClass(todoElementStatus, "todo-status-new", "todo-status", "todo-content");
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

        todoElementActions.appendChild(todoElementDeleteButton);
        todoElementActions.appendChild(todoElementCompleteButton);

        todoElementLi.appendChild(todoElementDesc);
        todoElementLi.appendChild(todoElementDate);
        todoElementLi.appendChild(todoElementStatus);
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

todoButton?.addEventListener("click", () => {
    // @ts-ignore
    const newTodoInput = todoInput?.value;

    // @ts-ignore
    document.getElementById("new-todo-input").value = "";

    const newTodo = {
        id: crypto.randomUUID(),
        desc: newTodoInput,
        createdAt: +new Date(),
        status: "new",
    };

    const oldTodos = [...todosState];
    todosState.push(newTodo);

    renderTodos(todosState, oldTodos, "new-todo");
});

renderTodos(todosState, []);

