const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const timerDisplay = document.querySelector('#timer-display');
const btnStartTimer = document.querySelector('#btn-start-timer');
const btnPauseTimer = document.querySelector('#btn-pause-timer');
const btnResetTimer = document.querySelector('#btn-reset-timer');

let seconds = 0;
let timer = null;

function formatTime(seconds){
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(remainingSeconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
}

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

        btnConcludeTask.addEventListener('click', function(){
            taskItem.classList.toggle('completed');
        });

        const btnRemoveTask = document.createElement('button');
        btnRemoveTask.classList.add('remove-task');
        btnRemoveTask.innerText = 'Excluir';
        btnRemoveTask.type = 'button';

        btnRemoveTask.addEventListener('click', function(){
            taskItem.remove();
        });

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

btnStartTimer.addEventListener('click', function(){
    if(timer !== null) return;

    timer = setInterval(function(){
        seconds++;
        timerDisplay.textContent = formatTime(seconds);
    }, 1000);
});

btnPauseTimer.addEventListener('click', function(){
    clearInterval(timer);
    timer = null;
    timerDisplay.textContent = formatTime(seconds);
});

btnResetTimer.addEventListener('click', function(){
    clearInterval(timer);
    timer = null;
    seconds = 0;
    timerDisplay.textContent = '00:00:00';
});