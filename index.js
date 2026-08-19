const todos = [];

function addTodo(todo) {
    todos.push({
        text: todo,
        completed: false
    });
}

function listTodos() {
  todos.forEach((todo, index) => {
    const status = todo.completed ? "Concluída" : "Pendente";

    console.log(`${index + 1}. ${todo.text} - ${status}`);
  });
}

function completeTodo(index) {
    todos[index].completed = true;
}

function removeTodo(index) {
    todos.splice(index, 1);
}

// Dados para teste
addTodo("Estudar Git");
addTodo("Fazer atividade");
addTodo("Criar Pull Request");

completeTodo(1);

removeTodo(3);

listTodos();