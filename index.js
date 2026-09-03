const todos = [];

function addTodo(todo) {
    todos.push({
        text: todo,
        completed: false
    });
}

function listTodos() {
    todos.forEach((todo, index) => {
        const status = todo.completed ? "Concluida" : "Pendente";
        console.log(`${index + 1}. ${todo.text} - ${status}`);
    });
}

function completeTodo(index) {
    todos[index].completed = true;
}

function removeTodo(index) {
    todos.splice(index, 1);
}

function listByStatus(status) {
    todos.forEach((todo, index) => {
        const statusAtual = todo.completed ? "Concluida" : "Pendente";
        if (statusAtual === status) {
            console.log(`${index + 1}. ${todo.text} - ${statusAtual}`);
        }
    });
}

module.exports = {
    todos,
    addTodo,
    listTodos,
    completeTodo,
    removeTodo,
    listByStatus
};

if (require.main === module) {
    addTodo("Estudar Git");
    addTodo("Fazer atividade");
    addTodo("Criar Pull Request");

    completeTodo(1);
    removeTodo(1);

    listTodos();
}