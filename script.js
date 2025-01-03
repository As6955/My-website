const targetDate = new Date(2024, 10, 6, 19, 0, 0); // November 6, 2024
let displayMode = "days";
let autoChangeInterval;
let mouseHeartsEnabled = false;
let currentHeartColor = 'red';
const brightnessLevels = [0.0, 0.3, 0.5, 0.7, 0.9];
let currentBrightnessIndex = 1;
let heartIntervalTime = 5000; // ברירת מחדל של 5 שניות
let heartQuantity = 1; // כמות הלבבות בכל יציאה
let currentIndex = 0;

function updateTimer() {
    const now = new Date();
    const timeRemaining = targetDate - now;

    if (timeRemaining > 0) {
        const weeks = Math.floor(timeRemaining / (1000 * 60 * 60 * 24 * 7));
        const days = Math.floor((timeRemaining % (1000 * 60 * 60 * 24 * 7)) / (1000 * 60 * 60 * 24));
        const totalDays = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));  // כאן יש לבצע תיקון
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

function changeBackgroundImage(direction = 1) {
    console.log("1:" + currentIndex);

    // תיקון החישוב של האינדקס הנוכחי
    currentIndex += direction;

    if (currentIndex >= images.length) {
        currentIndex = 0; // חזרה לתמונה הראשונה אם עברנו את האינדקס האחרון
    } else if (currentIndex < 0) {
        currentIndex = images.length - 1; // חזרה לתמונה האחרונה אם עברנו את האינדקס הראשון
    }

    console.log("2:" + currentIndex);

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

document.getElementById('toggleDisplayMode').addEventListener('click', () => {
    displayMode = displayMode === "weeksDays" ? "days" : "weeksDays";
    document.getElementById('toggleDisplayMode').textContent = 
        displayMode === "weeksDays" ? "החלף תצוגה לימים בלבד" : "החלף תצוגה לשבועות וימים";
    updateTimer();
});

const timerInterval = setInterval(updateTimer, 1000);
updateTimer();

document.getElementById('toggleAutoChange').addEventListener('click', () => {
    if (autoChangeInterval) {
        clearInterval(autoChangeInterval);
        autoChangeInterval = null;
        document.getElementById('toggleAutoChange').textContent = "התחל החלפת תמונות אוטומטית";
    } else {
        autoChangeInterval = setInterval(() => changeBackgroundImage(1), 2000); // החלפה כל 2 שניות
        document.getElementById('toggleAutoChange').textContent = "הפסק החלפת תמונות אוטומטית";
    }
});

document.body.addEventListener('click', (e) => {
    if (!document.getElementById('menu').contains(e.target) && !document.getElementById('openMenuIcon').contains(e.target)) {
        changeBackgroundImage(1);
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

// הוספת פונקציונליות ניווט מקשי חיצים + רווח ואנטר
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        changeBackgroundImage(-1); // שינוי לתמונה הקודמת
    } else if (e.key === 'ArrowRight') {
        changeBackgroundImage(1); // שינוי לתמונה הבאה
    } else if (e.key === 'Enter') {
        changeBackgroundImage(1); // החלפת תמונה לתמונה הבאה בלחיצה על אנטר
    } else if (e.key === ' ') { // מקש רווח להתחלה/הפסקת החלפת תמונות אוטומטית
        if (autoChangeInterval) {
            clearInterval(autoChangeInterval);
            autoChangeInterval = null;
            document.getElementById('toggleAutoChange').textContent = "התחל החלפת תמונות אוטומטית";
        } else {
            autoChangeInterval = setInterval(() => changeBackgroundImage(1), 2000); // החלפה כל 2 שניות
            document.getElementById('toggleAutoChange').textContent = "הפסק החלפת תמונות אוטומטית";
        }
    }
});

