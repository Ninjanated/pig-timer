let timer;
let timeLeft;
let isRunning = false;
let isWorkMode = true;
let workDuration = 25 * 60; // 25 minutes in seconds
let restDuration = 5 * 60;  // 5 minutes in seconds

// DOM Elements
const display = document.getElementById('display');
const modeIndicator = document.getElementById('modeIndicator');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const addTenBtn = document.getElementById('addTenBtn');
const addThirtyBtn = document.getElementById('addThirtyBtn');
const removeTenBtn = document.getElementById('removeTenBtn');
const removeThirtyBtn = document.getElementById('removeThirtyBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPopup = document.getElementById('settingsPopup');
const workMinutesInput = document.getElementById('workMinutesInput');
const workSecondsInput = document.getElementById('workSecondsInput');
const restMinutesInput = document.getElementById('restMinutesInput');
const restSecondsInput = document.getElementById('restSecondsInput');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');

// Initialize timer
function initTimer() {
    timeLeft = isWorkMode ? workDuration : restDuration;
    updateDisplay();
    updateModeIndicator();
}

// Update display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Update mode indicator
function updateModeIndicator() {
    modeIndicator.textContent = isWorkMode ? 'Focus Time' : 'Rest Time';
    modeIndicator.style.color = isWorkMode ? 'rgba(255, 140, 66, 0.9)' : 'rgba(100, 149, 237, 0.9)';
}

// Start/Pause timer
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startPauseBtn.textContent = 'Start';
    } else {
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                isWorkMode = !isWorkMode;
                timeLeft = isWorkMode ? workDuration : restDuration;
                updateDisplay();
                updateModeIndicator();
                startPauseBtn.textContent = 'Start';
                // Play notification sound
                new Audio('notification.mp3').play().catch(() => {});
            }
        }, 1000);
        
        isRunning = true;
        startPauseBtn.textContent = 'Pause';
    }
}

// Reset timer
function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isWorkMode = true;
    timeLeft = workDuration;
    updateDisplay();
    updateModeIndicator();
    startPauseBtn.textContent = 'Start';
}

// Add time
function addTime(seconds) {
    if (!isRunning) {
        timeLeft += seconds;
        updateDisplay();
    }
}

// Remove time
function removeTime(seconds) {
    if (!isRunning && timeLeft > seconds) {
        timeLeft -= seconds;
        updateDisplay();
    }
}

// Open settings popup
function openSettings() {
    workMinutesInput.value = Math.floor(workDuration / 60);
    workSecondsInput.value = workDuration % 60;
    restMinutesInput.value = Math.floor(restDuration / 60);
    restSecondsInput.value = restDuration % 60;
    settingsPopup.classList.add('show');
}

// Close settings popup
function closeSettings() {
    settingsPopup.classList.remove('show');
}

// Save settings
function saveSettings() {
    const newWorkDuration = (parseInt(workMinutesInput.value) * 60) + parseInt(workSecondsInput.value);
    const newRestDuration = (parseInt(restMinutesInput.value) * 60) + parseInt(restSecondsInput.value);
    
    if (newWorkDuration > 0 && newRestDuration > 0) {
        workDuration = newWorkDuration;
        restDuration = newRestDuration;
        resetTimer();
        closeSettings();
    }
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
addTenBtn.addEventListener('click', () => addTime(10 * 60));
addThirtyBtn.addEventListener('click', () => addTime(30 * 60));
removeTenBtn.addEventListener('click', () => removeTime(10 * 60));
removeThirtyBtn.addEventListener('click', () => removeTime(30 * 60));
settingsBtn.addEventListener('click', openSettings);
saveSettingsBtn.addEventListener('click', saveSettings);

// Input validation
[workMinutesInput, workSecondsInput, restMinutesInput, restSecondsInput].forEach(input => {
    input.addEventListener('input', () => {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 0) {
            input.value = '0';
        } else if (input === workMinutesInput || input === restMinutesInput) {
            input.value = Math.min(value, 99);
        } else {
            input.value = Math.min(value, 59);
        }
    });
});

// Initialize
initTimer();
