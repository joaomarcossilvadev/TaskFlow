const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

const timerDisplay = document.querySelector('#timer-display');
const btnStartTimer = document.querySelector('#btn-start-timer');
const btnPauseTimer = document.querySelector('#btn-pause-timer');
const btnResetTimer = document.querySelector('#btn-reset-timer');

const taskActual = document.querySelector('#task-actual');
const toastMessage = document.querySelector('#toast-message');

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

        if(input.length < 3){
            throw new Error('O nome da tarefa deve ter pelo menos 3 letras.');
        }

        let taskExists = false;

        const taskNames = taskList.querySelectorAll('p');

        for(const taskName of taskNames){
            if(taskName.textContent.toLowerCase() === input.toLowerCase()){
                taskExists = true;
                break;
            }
        }

        if(taskExists){
            throw new Error('Essa tarefa já existe.');
        }

        const taskItem = document.createElement('li');

        const taskName = document.createElement('p');
        taskName.innerText = input;

        const btnFocusTask = document.createElement('button');
        btnFocusTask.classList.add('focus-task');
        btnFocusTask.innerText = 'Focar';
        btnFocusTask.type = 'button';

        btnFocusTask.addEventListener('click', function(){
            taskActual.textContent = taskName.textContent;
        });

        const btnConcludeTask = document.createElement('button');
        btnConcludeTask.classList.add('conclude-button');
        btnConcludeTask.innerText = 'Concluir';
        btnConcludeTask.type = 'button';

        btnConcludeTask.addEventListener('click', function(){
            if(taskActual.textContent === taskName.textContent){
                taskActual.textContent = 'Nenhuma tarefa selecionada';
            }

            taskItem.classList.toggle('completed');

            if(taskItem.classList.contains('completed')){
                btnFocusTask.disabled = true;

                toastMessage.textContent = 'Tarefa concluída com sucesso!';

                setTimeout(function(){
                    toastMessage.textContent = '';
                }, 3000);
            } else {
                btnFocusTask.disabled = false;
            }
        });

        const btnRemoveTask = document.createElement('button');
        btnRemoveTask.classList.add('remove-task');
        btnRemoveTask.innerText = 'Excluir';
        btnRemoveTask.type = 'button';

        btnRemoveTask.addEventListener('click', function(){
            if(taskActual.textContent === taskName.textContent){
                taskActual.textContent = 'Nenhuma tarefa selecionada';
            }

            taskItem.remove();
        });

        taskItem.appendChild(taskName);
        taskItem.appendChild(btnFocusTask);
        taskItem.appendChild(btnConcludeTask);
        taskItem.appendChild(btnRemoveTask);

        taskList.appendChild(taskItem);

        taskInput.value = '';
        taskInput.focus();

    } catch(error) {
        toastMessage.textContent = error.message;

        setTimeout(function(){
            toastMessage.textContent = '';
        }, 3000);
    }
});

btnStartTimer.addEventListener('click', function(){
    try {
        if(timer !== null){
            return;
        }

        if(taskActual.textContent === 'Nenhuma tarefa selecionada'){
            throw new Error('Selecione uma tarefa antes de iniciar o timer.');
        }

        timer = setInterval(function(){
            seconds++;
            timerDisplay.textContent = formatTime(seconds);
        }, 1000);

    } catch(error) {
        toastMessage.textContent = error.message;

        setTimeout(function(){
            toastMessage.textContent = '';
        }, 3000);
    }
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