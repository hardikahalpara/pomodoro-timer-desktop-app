const timeTimerElement = document.getElementById("time-timer")
const timeCurrentElement = document.getElementById("time-current")
const btnStart = document.getElementById("btn-start")
const btnStop = document.getElementById("btn-stop")
const btnPause = document.getElementById("btn-pause")
const btnBreak5 = document.getElementById("btn-break-5")
const btnBreak10 = document.getElementById("btn-break-10")
const btnBreak30 = document.getElementById("btn-break-30")
const background = document.getElementById("background")


// background functions
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


const setTimeCurrent = () => {
    timeCurrent = new Date();
    timeCurrentElement.innerText = timeCurrent.toLocaleTimeString();
};

const setTimeTimmer = () => {
    timeRemaining = new Date(targetTime - timeCurrent).toISOString().substr(11, 8);
    timeTimerElement.innerText = timeRemaining
    if (timeRemaining === "00:00:00") {
        onTimerEnd();
        clearInterval(timeTimerInterval);
    }
};

const startTimer = (duration) => {
    targetTime = new Date();
    targetTime.setMinutes(targetTime.getMinutes() + duration);
    timeTimerInterval = setInterval(setTimeTimmer, 1000);
    btnStart.classList.add("hidden");
    btnPause.classList.remove("hidden");
    btnStop.classList.remove("hidden");
    setBackgroundToWork();
}

const stopTimer = () => {
    timeTimerElement.innerText = "00:00:00"
    clearInterval(timeTimerInterval);
    timeTimerInterval = undefined;
    btnStop.classList.add("hidden");
    btnPause.classList.add("hidden");
    btnStart.classList.remove("hidden");
    btnPause.innerText = "Pause";
    setBackgroundToIdle();
}

const pauseTimer = () => {
    if (timeTimerInterval) {
        clearInterval(timeTimerInterval);
        timeTimerInterval = undefined;
        timeAtPaused = new Date();
        btnPause.innerText = "Resume";
    }
    else {
        const curTime = new Date();
        const timeBetween = curTime - timeAtPaused;
        targetTime.setMilliseconds(targetTime.getMilliseconds() + timeBetween)
        timeTimerInterval = setInterval(setTimeTimmer, 1000)
        btnPause.innerText = "Pause";
    }
}



onTimerEnd = () => {
    const sound = new Audio("alarm.mp3");
    sound.play();
    btnStop.classList.add("hidden");
    btnPause.classList.add("hidden");
    btnStart.classList.remove("hidden");
};

btnStart.addEventListener("click", () => {
    startTimer(1)
})
btnStop.addEventListener("click", stopTimer)
btnPause.addEventListener("click", pauseTimer)
btnBreak5.addEventListener("click", () => {
    stopTimer();
    startTimer(5);
    setBackgroundToBreak();
})
btnBreak10.addEventListener("click", () => {
    stopTimer();
    startTimer(10)
    setBackgroundToBreak();

})
btnBreak30.addEventListener("click", () => {
    stopTimer();
    startTimer(30)
    setBackgroundToBreak();

})

//set the current time
let timeCurrent;
setTimeCurrent();
setBackgroundToIdle();


//start the time current interval
const timeCurrentInterval = setInterval(setTimeCurrent, 1000)

//set up the timer 
let timeTimerInterval
let timeRemaining
let targetTime
let timeTimer = new Date();
timeTimer.setHours(0);
timeTimer.setMinutes(0);
timeTimer.setSeconds(0);


//tracking paused time
let timeAtPaused

