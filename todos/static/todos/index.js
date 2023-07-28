const BASE_URL = "http://127.0.0.1:8000/todos/"

const addTodoButton = document.getElementById("addNewTask");
const deleteTodoButton = document.getElementById("deleteCompletedTasks");
const todos = document.querySelectorAll("label");
const inputForm = document.querySelector(".input-form");
const input = document.querySelector(".input-form input")

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

for(let todo of todos) {
    todo.addEventListener("click", async () => {
        const isCompleted = !todo.classList.contains("completedTasks");

        const obj = {
            text: todo.innerText,
            id: todo.id,
            is_completed: isCompleted
        }

        try {
            const res = await fetch(BASE_URL + `api/${todo.id}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": `${csrftoken}`
                },
                body: JSON.stringify(obj),
            }) 
            if(res.ok) {
                todo.classList.toggle("completedTasks");
            }
        } catch (err) {
            console.error(err);
        }  
    })
}

addTodoButton.addEventListener("click", () => {
    inputForm.style.opacity = "1";
    inputForm.style.pointerEvents = "all";
    input.focus();
})

inputForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const obj = {
        text: input.value,
        is_completed: "false"
    }

    try {
        inputForm.style.opacity = "0";
        inputForm.style.pointerEvents = "none";
        await fetch(BASE_URL + "api/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": `${csrftoken}`
            },
            body: JSON.stringify(obj)
        })
    } catch (e) {
        console.error(e)
    } finally {
        window.location.reload();
    } 
})

deleteTodoButton.addEventListener("click", async () => {
    try {
        await fetch(BASE_URL + "api/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": `${csrftoken}`
            }
        })
    } catch (e) {
        console.error(e)
    } finally {
        window.location.reload();
    }
})
