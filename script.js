const display = document.querySelector('.display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const pauseBtn = document.getElementById('pauseBtn');
const addFiveBtn = document.getElementById('addFiveBtn');
const resetBtn = document.getElementById('resetBtn');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');

let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;
let isPaused = false;

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    display.textContent = formatTime(timeLeft);
}

function getTimeFromInputs() {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    return (minutes * 60) + seconds;
}

function resetToDefault() {
    stopTimer();
    minutesInput.value = "25";
    secondsInput.value = "00";
    timeLeft = 25 * 60;
    updateDisplay();
}

function startTimer() {
    if (!isRunning) {
        // If not paused, get time from inputs
        if (!isPaused) {
            timeLeft = getTimeFromInputs();
        }
        
        isRunning = true;
        isPaused = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        minutesInput.disabled = true;
        secondsInput.disabled = true;
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft <= 0) {
                stopTimer();
                alert('Time is up!');
                timeLeft = getTimeFromInputs();
                updateDisplay();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        isPaused = true;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        startBtn.textContent = 'Resume';
    }
}

function stopTimer() {
    clearInterval(timerId);
    isRunning = false;
    isPaused = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    startBtn.textContent = 'Start';
    timeLeft = getTimeFromInputs();
    updateDisplay();
}

function addFiveMinutes() {
    if (!isRunning) {
        timeLeft += 5 * 60;
        updateDisplay();
    } else {
        timeLeft += 5 * 60;
    }
}

// Event Listeners
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
pauseBtn.addEventListener('click', pauseTimer);
addFiveBtn.addEventListener('click', addFiveMinutes);
resetBtn.addEventListener('click', resetToDefault);

// Input validation
minutesInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

secondsInput.addEventListener('input', function() {
    if (this.value < 0) this.value = 0;
    if (this.value > 59) this.value = 59;
});

// Initialize display
updateDisplay();
