// DOM Elements
const display = document.getElementById('display');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const modeIndicator = document.getElementById('modeIndicator');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPopup = document.getElementById('settingsPopup');
const settingsCloseBtn = document.getElementById('settingsCloseBtn');

// Quick adjust buttons
const addTenBtn = document.getElementById('addTenBtn');
const addThirtyBtn = document.getElementById('addThirtyBtn');
const removeTenBtn = document.getElementById('removeTenBtn');
const removeThirtyBtn = document.getElementById('removeThirtyBtn');

// Settings inputs
const workMinutesInput = document.getElementById('workMinutesInput');
const workSecondsInput = document.getElementById('workSecondsInput');
const restMinutesInput = document.getElementById('restMinutesInput');
const restSecondsInput = document.getElementById('restSecondsInput');

// Timer variables
let timer;
let timeLeft;
let isRunning = false;
let isWorkTime = true;

// Default durations (in seconds)
let FOCUS_TIME = 25 * 60;
let REST_TIME = 5 * 60;

// Initialize timer
function initTimer() {
    timeLeft = FOCUS_TIME;
    updateDisplay();
}

// Update display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Start/Pause timer
function toggleTimer() {
    if (isRunning) {
        clearInterval(timer);
        isRunning = false;
        startPauseBtn.textContent = 'Start';
    } else {
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                playNotificationSound();
                if (isWorkTime) {
                    isWorkTime = false;
                    timeLeft = REST_TIME;
                    modeIndicator.textContent = 'Rest Time';
                } else {
                    isWorkTime = true;
                    timeLeft = FOCUS_TIME;
                    modeIndicator.textContent = 'Focus Time';
                }
                updateDisplay();
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
    startPauseBtn.textContent = 'Start';
    isWorkTime = true;
    modeIndicator.textContent = 'Focus Time';
    timeLeft = FOCUS_TIME;
    updateDisplay();
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

// Play notification sound
function playNotificationSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Settings functions
function openSettings() {
    settingsPopup.classList.add('show');
}

function closeSettings() {
    settingsPopup.classList.remove('show');
    // Update timer durations
    FOCUS_TIME = (parseInt(workMinutesInput.value) * 60) + parseInt(workSecondsInput.value);
    REST_TIME = (parseInt(restMinutesInput.value) * 60) + parseInt(restSecondsInput.value);
    resetTimer();
}

// Event Listeners
startPauseBtn.addEventListener('click', toggleTimer);
resetBtn.addEventListener('click', resetTimer);
settingsBtn.addEventListener('click', openSettings);
settingsCloseBtn.addEventListener('click', closeSettings);

// Quick adjust buttons
addTenBtn.addEventListener('click', () => addTime(600));
addThirtyBtn.addEventListener('click', () => addTime(1800));
removeTenBtn.addEventListener('click', () => removeTime(600));
removeThirtyBtn.addEventListener('click', () => removeTime(1800));

// Input validation
[workMinutesInput, workSecondsInput, restMinutesInput, restSecondsInput].forEach(input => {
    input.addEventListener('change', () => {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 0) value = 0;
        if (value > 59) value = 59;
        input.value = value;
    });
});

// Initialize
initTimer();
