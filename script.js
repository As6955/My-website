const targetDate = new Date(2024, 10, 6, 0, 0, 0); // November 6, 2024
let displayMode = "weeksDays";
let autoChangeInterval;
let mouseHeartsEnabled = false;
let currentHeartColor = 'red';
const brightnessLevels = [0.1, 0.3, 0.5, 0.7, 0.9];
let currentBrightnessIndex = 1;
let heartIntervalTime = 5000; // ברירת מחדל של 5 שניות
let heartQuantity = 1; // כמות הלבבות בכל יציאה

function updateTimer() {
    const now = new Date();
    const timeRemaining = targetDate - now;

    if (timeRemaining > 0) {
        const weeks = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        const totalDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        let displayText = '';

        if (displayMode === "weeksDays") {
            displayText = weeks + " שבועות, " + days + " ימים, ";
        } else if (displayMode === "days") {
            displayText = totalDays + " ימים, ";
        }

        displayText += hours + " שעות, " + minutes + " דקות, " + seconds + " שניות";

        document.getElementById('timer').textContent = displayText;
    } else {
        clearInterval(timerInterval);
        document.getElementById('timer').textContent = "מזל טוב! החתונה התקיימה!";
    }
}

document.getElementById('toggleDisplayMode').addEventListener('click', () => {
    if (displayMode === "weeksDays") {
        displayMode = "days";
        document.getElementById('toggleDisplayMode').textContent = "החלף תצוגה לימים בלבד";
    }
    updateTimer();
});

const timerInterval = setInterval(updateTimer, 1000);
updateTimer();

let currentIndex = 0;

function changeBackgroundImage() {
    currentIndex = (currentIndex + 1) % images.length;
    const newImage = new Image();
    newImage.src = images[currentIndex];
    newImage.classList.add('fade');

    newImage.onload = function() {
        document.body.style.backgroundImage = `url('${newImage.src}')`;
    };

    newImage.onerror = function() {
        currentIndex = 0;
        document.body.style.backgroundImage = `url('${images[0]}')`;
    };
}

document.getElementById('toggleAutoChange').addEventListener('click', () => {
    if (autoChangeInterval) {
        clearInterval(autoChangeInterval);
        autoChangeInterval = null;
        document.getElementById('toggleAutoChange').textContent = "התחל החלפת תמונות אוטומטית";
    } else {
        autoChangeInterval = setInterval(changeBackgroundImage, 2000); // החלפה כל 2 שניות
        document.getElementById('toggleAutoChange').textContent = "הפסק החלפת תמונות אוטומטית";
    }
});

document.body.addEventListener('click', (e) => {
    if (!document.getElementById('menu').contains(e.target) && !document.getElementById('openMenuIcon').contains(e.target)) {
        changeBackgroundImage();
        document.getElementById('menu').style.display = 'none';
    } else if (e.target.id === 'openMenuIcon') {
        document.getElementById('menu').style.display = 'block';
    }
});

document.getElementById('openMenuIcon').addEventListener('mouseenter', () => {
    document.getElementById('menu').style.display = 'block';
});

document.getElementById('changeBrightness').addEventListener('click', () => {
    currentBrightnessIndex = (currentBrightnessIndex + 1) % brightnessLevels.length;
    document.querySelector('.overlay').style.backgroundColor = `rgba(0, 0, 0, ${brightnessLevels[currentBrightnessIndex]})`;
});

document.getElementById('toggleMouseHearts').addEventListener('click', () => {
    mouseHeartsEnabled = !mouseHeartsEnabled;
    document.getElementById('toggleMouseHearts').textContent = mouseHeartsEnabled ? 'השבת לבבות של העכבר' : 'הפעל לבבות של העכבר';
});

document.getElementById('changeFont').addEventListener('click', () => {
    const fonts = ["Arial", "Courier New", "Georgia", "Times New Roman", "Verdana"];
    const randomFont = fonts[Math.floor(Math.random() * fonts.length)];
    document.body.style.fontFamily = randomFont;
    alert(`הפונט שונה ל-${randomFont}`);
});

document.getElementById('heartSettings').addEventListener('click', () => {
    heartQuantity = parseInt(prompt("הזן את כמות הלבבות שיצאו כל פעם:", heartQuantity), 10) || heartQuantity;
    heartIntervalTime = parseInt(prompt("הזן את הזמן בין יציאת קבוצות לבבות במילישניות:", heartIntervalTime), 10) || heartIntervalTime;
    clearInterval(heartInterval);
    heartInterval = setInterval(createHearts, heartIntervalTime);
});

document.getElementById('toggleFullScreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`לא ניתן לעבור למסך מלא: ${err.message}`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

document.getElementById('uploadBackground').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function() {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);
    };
    input.click();
});

function createHearts() {
    for (let i = 0; i < heartQuantity; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.top = `${Math.random() * 100}vh`;
        heart.style.backgroundColor = currentHeartColor;
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 9000);
    }
}

let heartInterval = setInterval(createHearts, heartIntervalTime);

document.body.addEventListener('mousemove', (e) => {
    if (mouseHeartsEnabled) {
        for (let i = 0; i < heartQuantity; i++) {
            const heart = document.createElement('div');
            heart.classList.add('heart');
            heart.style.left = `${e.clientX}px`;
            heart.style.top = `${e.clientY}px`;
            heart.style.backgroundColor = currentHeartColor || 'red';
            document.body.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 9000);
        }
    }
});

