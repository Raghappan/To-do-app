// State management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let isAuthenticated = false;

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const todoApp = document.getElementById('todoApp');
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const weatherDisplay = document.getElementById('weatherDisplay');

// Authentication
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    // Simple mock authentication
    if (username && password) {
        isAuthenticated = true;
        updateAuthUI();
        loadTasks();
        fetchWeather();
    } else {
        alert('Please enter both username and password');
    }
});

logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    updateAuthUI();
    tasks = [];
    saveTasks();
    renderTasks();
});

function updateAuthUI() {
    if (isAuthenticated) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
        todoApp.style.display = 'block';
        usernameInput.style.display = 'none';
        passwordInput.style.display = 'none';
    } else {
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
        todoApp.style.display = 'none';
        usernameInput.style.display = 'block';
        passwordInput.style.display = 'block';
    }
}

// Task Management
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText) {
        const priority = document.querySelector('input[name="priority"]:checked').value;
        const task = {
            id: Date.now(),
            text: taskText,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        tasks.push(task);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

function toggleTask(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks();
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.setAttribute('data-priority', task.priority);
        
        taskElement.innerHTML = `
            <div class="task-content">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.text}</span>
            </div>
            <button class="delete-btn">Delete</button>
        `;
        
        const checkbox = taskElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        taskList.appendChild(taskElement);
    });
}

// Local Storage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    renderTasks();
}

// Weather API Integration
async function fetchWeather() {
    try {
        const API_KEY = '243a221cec85633fa6474264332707a4';
        const city = 'London'; // Default city, you can make this dynamic
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        
        weatherDisplay.innerHTML = `
            <p>Temperature: ${Math.round(data.main.temp)}°C</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Humidity: ${data.main.humidity}%</p>
        `;
    } catch (error) {
        weatherDisplay.innerHTML = '<p>Error fetching weather data</p>';
        console.error('Error fetching weather:', error);
    }
}

// Initialize the app
updateAuthUI(); 