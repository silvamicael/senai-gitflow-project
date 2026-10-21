const {
    todos,
    addTodo,
    listTodos,
    completeTodo,
    removeTodo,
    listByStatus
} = require('./index');

beforeEach(() => {
    todos.length = 0;
});

describe('addTodo', () => {
    test('adiciona uma nova tarefa com completed = false', () => {
        addTodo('Estudar Jest');
        expect(todos).toHaveLength(1);
        expect(todos[0]).toEqual({ text: 'Estudar Jest', completed: false });
    });

    test('adiciona multiplas tarefas mantendo a ordem de insercao', () => {
        addTodo('Primeira tarefa');
        addTodo('Segunda tarefa');
        addTodo('Terceira tarefa');
        expect(todos).toHaveLength(3);
        expect(todos.map(t => t.text)).toEqual([
            'Primeira tarefa',
            'Segunda tarefa',
            'Terceira tarefa'
        ]);
    });

    test('aceita string vazia como texto (comportamento atual, sem validacao)', () => {
        addTodo('');
        expect(todos).toHaveLength(1);
        expect(todos[0].text).toBe('');
    });
});

describe('completeTodo', () => {
    test('marca uma tarefa existente como concluida', () => {
        addTodo('Lavar louca');
        completeTodo(0);
        expect(todos[0].completed).toBe(true);
    });

    test('nao afeta outras tarefas da lista', () => {
        addTodo('Tarefa A');
        addTodo('Tarefa B');
        completeTodo(1);
        expect(todos[0].completed).toBe(false);
        expect(todos[1].completed).toBe(true);
    });

    test('lanca erro ao tentar completar um indice inexistente', () => {
        expect(() => completeTodo(0)).toThrow(TypeError);
    });

    test('lanca erro ao usar indice negativo invalido', () => {
        addTodo('Unica tarefa');
        expect(() => completeTodo(-5)).toThrow(TypeError);
    });
});

describe('removeTodo', () => {
    test('remove a tarefa no indice informado', () => {
        addTodo('Tarefa A');
        addTodo('Tarefa B');
        removeTodo(0);
        expect(todos).toHaveLength(1);
        expect(todos[0].text).toBe('Tarefa B');
    });

    test('remove corretamente quando ha tarefas concluidas misturadas', () => {
        addTodo('Tarefa A');
        addTodo('Tarefa B');
        completeTodo(1);
        removeTodo(0);
        expect(todos).toHaveLength(1);
        expect(todos[0]).toEqual({ text: 'Tarefa B', completed: true });
    });

    test('indice fora do intervalo nao remove nada nem lanca erro', () => {
        addTodo('Unica tarefa');
        expect(() => removeTodo(10)).not.toThrow();
        expect(todos).toHaveLength(1);
    });
});

describe('listTodos', () => {
    test('imprime cada tarefa com o status correto', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        addTodo('Tarefa 1');
        addTodo('Tarefa 2');
        completeTodo(0);
        listTodos();
        expect(consoleSpy).toHaveBeenCalledTimes(2);
        expect(consoleSpy).toHaveBeenNthCalledWith(1, '1. Tarefa 1 - Concluida');
        expect(consoleSpy).toHaveBeenNthCalledWith(2, '2. Tarefa 2 - Pendente');
        consoleSpy.mockRestore();
    });

    test('nao imprime nada quando a lista esta vazia', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        listTodos();
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});

describe('listByStatus', () => {
    test('lista apenas as tarefas concluidas', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        addTodo('Tarefa A');
        addTodo('Tarefa B');
        completeTodo(1);
        listByStatus('Concluida');
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('2. Tarefa B - Concluida');
        consoleSpy.mockRestore();
    });

    test('lista apenas as tarefas pendentes', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        addTodo('Tarefa A');
        addTodo('Tarefa B');
        completeTodo(1);
        listByStatus('Pendente');
        expect(consoleSpy).toHaveBeenCalledTimes(1);
        expect(consoleSpy).toHaveBeenCalledWith('1. Tarefa A - Pendente');
        consoleSpy.mockRestore();
    });

    test('nao imprime nada quando nenhuma tarefa corresponde ao status', () => {
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
        addTodo('Tarefa A');
        listByStatus('Concluida');
        expect(consoleSpy).not.toHaveBeenCalled();
        consoleSpy.mockRestore();
    });
});