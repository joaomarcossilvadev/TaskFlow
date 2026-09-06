const form = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');

const timerDisplay = document.querySelector('#timer-display');
const btnStartTimer = document.querySelector('#btn-start-timer');
const btnPauseTimer = document.querySelector('#btn-pause-timer');
const btnResetTimer = document.querySelector('#btn-reset-timer');

const taskActual = document.querySelector('#task-actual');
const toastMessage = document.querySelector('#toast-message');

let timer = null;
let currentTaskId = null;

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

tasks = tasks.map(function(task, index) {
    return {
        id: task.id || Date.now() + index,
        title: task.title,
        completed: task.completed || false,
        timeSpent: task.timeSpent || 0
    };
});

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(remainingSeconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function showMessage(message) {
    toastMessage.textContent = message;

    setTimeout(function() {
        toastMessage.textContent = '';
    }, 3000);
}

function getCurrentTask() {
    return tasks.find(function(task) {
        return task.id === currentTaskId;
    });
}

function stopTimer() {
    clearInterval(timer);
    timer = null;
}

function clearCurrentTask() {
    stopTimer();

    currentTaskId = null;

    taskActual.textContent = 'Nenhuma tarefa selecionada';
    timerDisplay.textContent = '00:00:00';
}

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(function(task) {
        const taskItem = document.createElement('li');

        const taskName = document.createElement('p');
        taskName.textContent = task.title;

        const taskTime = document.createElement('span');
        taskTime.textContent = `Tempo: ${formatTime(task.timeSpent)}`;

        const btnFocusTask = document.createElement('button');
        btnFocusTask.classList.add('focus-task');
        btnFocusTask.textContent = 'Focar';
        btnFocusTask.type = 'button';

        const btnConcludeTask = document.createElement('button');
        btnConcludeTask.classList.add('conclude-button');
        btnConcludeTask.textContent = 'Concluir';
        btnConcludeTask.type = 'button';

        const btnRemoveTask = document.createElement('button');
        btnRemoveTask.classList.add('remove-task');
        btnRemoveTask.textContent = 'Excluir';
        btnRemoveTask.type = 'button';

        if(task.completed) {
            taskItem.classList.add('completed');
            btnFocusTask.disabled = true;
        }

        if(task.id === currentTaskId) {
            taskItem.classList.add('focused');
        }

        btnFocusTask.addEventListener('click', function() {
            stopTimer();

            currentTaskId = task.id;

            taskActual.textContent = task.title;
            timerDisplay.textContent = formatTime(task.timeSpent);

            renderTasks();
        });

        btnConcludeTask.addEventListener('click', function() {
            task.completed = !task.completed;

            if(task.completed) {
                if(currentTaskId === task.id) {
                    clearCurrentTask();
                }

                showMessage('Tarefa concluída com sucesso!');
            }

            saveTasks();
            renderTasks();
        });

        btnRemoveTask.addEventListener('click', function() {
            if(currentTaskId === task.id) {
                clearCurrentTask();
            }

            tasks = tasks.filter(function(taskItem) {
                return taskItem.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        taskItem.appendChild(taskName);
        taskItem.appendChild(taskTime);
        taskItem.appendChild(btnFocusTask);
        taskItem.appendChild(btnConcludeTask);
        taskItem.appendChild(btnRemoveTask);

        taskList.appendChild(taskItem);
    });
}

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const input = taskInput.value.trim();

    try {
        if(input === '') {
            throw new Error('Nome da tarefa é um campo obrigatório.');
        }

        if(input.length < 3) {
            throw new Error('O nome da tarefa deve ter pelo menos 3 letras.');
        }

        let taskExists = false;

        for(const task of tasks) {
            if(task.title.toLowerCase() === input.toLowerCase()) {
                taskExists = true;
                break;
            }
        }

        if(taskExists) {
            throw new Error('Essa tarefa já existe.');
        }

        const newTask = {
            id: Date.now(),
            title: input,
            completed: false,
            timeSpent: 0
        };

        tasks.push(newTask);

        saveTasks();
        renderTasks();

        taskInput.value = '';
        taskInput.focus();

    } catch(error) {
        showMessage(error.message);
    }
});

btnStartTimer.addEventListener('click', function() {
    try {
        if(timer !== null) {
            return;
        }

        const currentTask = getCurrentTask();

        if(!currentTask) {
            throw new Error(
                'Selecione uma tarefa antes de iniciar o timer.'
            );
        }

        timer = setInterval(function() {
            currentTask.timeSpent++;

            timerDisplay.textContent = formatTime(
                currentTask.timeSpent
            );

            saveTasks();
            renderTasks();
        }, 1000);

    } catch(error) {
        showMessage(error.message);
    }
});

btnPauseTimer.addEventListener('click', function() {
    stopTimer();
    saveTasks();
});

btnResetTimer.addEventListener('click', function() {
    try {
        const currentTask = getCurrentTask();

        if(!currentTask) {
            throw new Error(
                'Selecione uma tarefa antes de zerar o timer.'
            );
        }

        stopTimer();

        currentTask.timeSpent = 0;

        timerDisplay.textContent = '00:00:00';

        saveTasks();
        renderTasks();

    } catch(error) {
        showMessage(error.message);
    }
});

saveTasks();
renderTasks();