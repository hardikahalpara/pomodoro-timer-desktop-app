const { BrowserWindow } = require('electron').remote;
const notifier = require('node-notifier');
const timerElement = document.getElementById("time-timer")
const currentTimeElement = document.getElementById("time-current")
const btnStart = document.getElementById("btn-start")
const btnStop = document.getElementById("btn-stop")
const btnPause = document.getElementById("btn-pause")
const btnBreakTiny = document.getElementById("btn-break-tiny")
const btnBreakShort = document.getElementById("btn-break-short")
const btnBreakLong = document.getElementById("btn-break-long")
const background = document.getElementById("background")
const btnMin = document.getElementById("minimize")
const btnClose = document.getElementById("close")
const timerStatus = document.getElementById("timer-status")
const settings = require('./settings.json')


// background updation functions
const setBackgroundToBreak = () => {
    background.classList.remove("onIdle")
    background.classList.remove("onWork")
    background.classList.add("onBreak")
}
const setBackgroundToWork = () => {
    background.classList.remove("onIdle")
    background.classList.remove("onBreak")
    background.classList.add("onWork")
}
const setBackgroundToIdle = () => {
    background.classList.remove("onBreak")
    background.classList.remove("onWork")
    background.classList.add("onIdle")
}


//set up the display state of buttons
btnStop.classList.add("hidden");
btnPause.classList.add("hidden");

// function to update current time
const setCurrentTime = () => {
    timeCurrent = new Date();
    currentTimeElement.innerText = timeCurrent.toLocaleTimeString();
};

// function to set timer
const setTimerTime = (status) => {
    timeRemaining = new Date(targetTime - timeCurrent).toISOString().substr(11, 8);
    timerElement.innerText = timeRemaining
    if (timeRemaining === "00:00:00") {
        onTimerEnd(status);
        clearInterval(timerInterval);
    }
};


// function to start timer
const startTimer = (duration, status) => {
    targetTime = new Date();
    targetTime.setMinutes(targetTime.getMinutes() + duration);
    timerInterval = setInterval(() => setTimerTime(status), 1000);
    btnStart.classList.add("hidden");
    btnPause.classList.remove("hidden");
    btnStop.classList.remove("hidden");
    setBackgroundToWork();
    timerStatus.innerText = "Work"
}


//function to stop timer
const stopTimer = () => {
    timerElement.innerText = "00:00:00"
    clearInterval(timerInterval);
    timerInterval = undefined;
    btnStop.classList.add("hidden");
    btnPause.classList.add("hidden");
    btnStart.classList.remove("hidden");
    btnPause.innerText = "Pause";
    setBackgroundToIdle();
    timerStatus.innerText = "Idle"
}

//function to pause timer
const pauseTimer = () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = undefined;
        timeAtPaused = new Date();
        btnPause.innerText = "Resume";
    }
    else {
        const curTime = new Date();
        const timeBetween = curTime - timeAtPaused;
        targetTime.setMilliseconds(targetTime.getMilliseconds() + timeBetween)
        timerInterval = setInterval(setTimerTime, 1000)
        btnPause.innerText = "Pause";
    }
}


// function to manage timer end event
onTimerEnd = (status) => {
    // const sound = new Audio("alarm.mp3");
    // sound.play();
    notifier.notify({
        title: 'Timer',
        message: status ? `${status} time up!!` : "Time Up!!",
        icon: __dirname + 'logo.png'
    })
    btnStop.classList.add("hidden");
    btnPause.classList.add("hidden");
    btnStart.classList.remove("hidden");
    setBackgroundToIdle();
    timerStatus.innerText = "Idle"
};


// button click listeners
btnStart.addEventListener("click", () => {
    startTimer(settings.WORK_TIME, 'Work')
    //startTimer(25, 'Work')
})
btnStop.addEventListener("click", stopTimer)
btnPause.addEventListener("click", pauseTimer)
btnBreakTiny.addEventListener("click", () => {
    stopTimer();
    startTimer(settings.BREAK_TINY, 'Break')
    // startTimer(5, 'Break');
    setBackgroundToBreak();
    timerStatus.innerText = "Break"
})
btnBreakShort.addEventListener("click", () => {
    stopTimer();
    //startTimer(10, 'Break');
    startTimer(settings.BREAK_SHORT, 'Break');
    setBackgroundToBreak();
    timerStatus.innerText = "Break"
})
btnBreakLong.addEventListener("click", () => {
    stopTimer();
    //startTimer(30, 'Break');
    startTimer(settings.BREAK_LONG, 'Break');
    setBackgroundToBreak();
    timerStatus.innerText = "Break"
})
btnMin.addEventListener("click", (e) => {
    var window = BrowserWindow.getFocusedWindow();
    window.minimize();
});

btnClose.addEventListener("click", (e) => {
    var window = BrowserWindow.getFocusedWindow();
    window.close();
});




//set the current time
let timeCurrent;
setCurrentTime();
setBackgroundToIdle();
timerStatus.innerText = "Idle";

//start the time current interval
const currentTimeInterval = setInterval(setCurrentTime, 1000)

//setting button labels
btnBreakTiny.innerText = settings.BREAK_TINY
btnBreakShort.innerText = settings.BREAK_SHORT
btnBreakLong.innerText = settings.BREAK_LONG
btnStart.innerText = `Start (${settings.WORK_TIME} mins)`

//set up the timer 
let timerInterval
let timeRemaining
let targetTime

//tracking paused time
let timeAtPaused
