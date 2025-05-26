document.addEventListener("DOMContentLoaded", function () {
    let modes = {
        "focus": 30 * 60,
        "short break": 15 * 60,
        "long break": 45 * 60
    };
    const circle = document.querySelector('.ring-progress');
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = 0;
    let shortBreakCount = 0;
    const alarmSound = document.getElementById("alarmSound");

    let currentMode = "focus"; // Default mode from HTML
    let timeLeft = modes[currentMode];
    let timerInterval = null;
    let isRunning = false;
    let isMuted = false;

    const timerText = document.querySelector(".timer_time p");
    const modeText = document.querySelector(".mode p");
    const graphic = document.querySelector(".graphic");
    const pauseButton = document.getElementById("pauseButton");
    const buttons = document.querySelectorAll(".timer_settings_button");

    const settingsBtn = document.querySelector(".settings");
    const settingsPanel = document.getElementById("settingsPanel");

    settingsBtn.addEventListener("click", () => {
        settingsPanel.classList.toggle("hidden");
    });

    document.getElementById("saveSettings").addEventListener("click", () => {
        const focusTime = parseInt(document.getElementById("focusInput").value) * 60;
        const shortBreakTime = parseInt(document.getElementById("shortBreakInput").value) * 60;
        const longBreakTime = parseInt(document.getElementById("longBreakInput").value) * 60;

        // Update mode times
        modes["focus"] = focusTime;
        modes["short break"] = shortBreakTime;
        modes["long break"] = longBreakTime;

        // Reset current time
        timeLeft = modes[currentMode];
        updateTimerDisplay();
        updateCircle();

        settingsPanel.classList.add("hidden");
    });
    const muteToggle = document.getElementById("muteToggle");

    muteToggle.addEventListener("change", () => {
        isMuted = muteToggle.checked;
    });


    function handleAutoSwitch() {
        if (currentMode === "focus") {
        shortBreakCount++;
        if (shortBreakCount < 4) {
            switchMode("short break");
        } else {
            switchMode("long break");
            shortBreakCount = 0;
        }
    } else {
        switchMode("focus");
    }
    alert(`Time for ${currentMode}! Click start to begin.`);
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerText.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    function updateCircle() {
        const circle = document.querySelector('.ring-progress');
        const radius = circle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;

        const percent = timeLeft / modes[currentMode];
        const offset = circumference * (percent - 1);
        circle.style.strokeDashoffset = offset;
    }

    function switchMode(newMode) {
        currentMode = newMode;
        timeLeft = modes[currentMode];
        modeText.textContent = newMode;
        updateTimerDisplay();
        updateCircle();
        clearInterval(timerInterval);
        isRunning = false;
        pauseButton.textContent = "start";
    }

    function tick() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
            updateCircle();
        } else {
            clearInterval(timerInterval);
            isRunning = false;
            pauseButton.textContent = "start";

            if (!isMuted) {
                alarmSound.play();
            }

            handleAutoSwitch();
        }
    }


    pauseButton.addEventListener("click", () => {
        if (isRunning) {
            clearInterval(timerInterval);
            pauseButton.textContent = "start";
        } else {
            timerInterval = setInterval(tick, 1000);
            pauseButton.textContent = "pause";
        }
        isRunning = !isRunning;
    });

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const mode = button.textContent.trim().toLowerCase();
            switchMode(mode);
        });
    });

    // Save on change
    muteToggle.addEventListener("change", () => {
        isMuted = muteToggle.checked;
        localStorage.setItem("pomodoroMuted", isMuted);
    });
    

    // Restore on load
    const storedMute = localStorage.getItem("pomodoroMuted");
    if (storedMute === "true") {
        isMuted = true;
        muteToggle.checked = true;
    }

    updateTimerDisplay();
    updateCircle();
});

