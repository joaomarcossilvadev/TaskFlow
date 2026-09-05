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
        taskItem.innerText = input;

        taskList.appendChild(taskItem);

        taskInput.value = '';   
        taskInput.focus();

    } catch(error) {
        console.error(error.message);
    }
});