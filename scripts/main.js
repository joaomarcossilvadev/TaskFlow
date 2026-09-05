const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

form.addEventListener('submit', function(event){
    event.preventDefault();

    const input = taskInput.value.trim();

    try {

        if(input === '') {
            throw new Error('Nome da tarefa é um campo obrigatório');
        }

        const taskItem = document.createElement('li');

        const taskName = document.createElement('p');
        taskName.innerText = input;

        const btnConcludeTask = document.createElement('button');
        btnConcludeTask.classList.add('conclude-button');
        btnConcludeTask.innerText = 'Concluir';
        btnConcludeTask.type = 'button';

        const btnRemoveTask = document.createElement('button');
        btnRemoveTask.classList.add('remove-task');
        btnRemoveTask.innerText = 'Exluir';
        btnRemoveTask.type = 'button';

        taskItem.appendChild(taskName);
        taskItem.appendChild(btnConcludeTask);
        taskItem.appendChild(btnRemoveTask);
        taskList.appendChild(taskItem);


        taskInput.value = '';   
        taskInput.focus();

    } catch(error) {
        console.error(error.message);
    }
});