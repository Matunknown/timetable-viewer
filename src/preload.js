const fs = require('fs');
const path = require('path');

const preferences = require(path.join(__dirname, 'preferences.json'));

// Get week number
Date.prototype.getWeek = function getWeek() {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Get number of weeks in the year
function weeksInYear(year) {
    const month = 11;
    let day = 31;
    let week;
    do {
        const d = new Date(year, month, day -= 1);
        week = d.getWeek();
    } while (week === 1);

    return week;
}

let code = preferences.code;
let week = new Date().getWeek();
let year = (new Date().getMonth() === 0 && week >= 52) ? new Date().getFullYear() - 1 : new Date().getFullYear(); // Get year (and check if the week number is between two years)

function update() {
    document.getElementById('info').innerText = `Semaine: ${week} Année: ${year}`;
    document.getElementById('image').innerHTML = `<img id="timetable-image" src="https://edt.univ-evry.fr/vue_etudiant_horizontale.php?current_year=${year}&current_student=${code}&current_week=${week}&lar=1920&hau=1080" alt="">`;
}

function today() {
    week = new Date().getWeek();
    year = (new Date().getMonth() === 0 && week >= 52) ? new Date().getFullYear() - 1 : new Date().getFullYear();
    update();
}

function previousWeek() {
    week -= 1;
    if (week <= 0) {
        year -= 1;
        week = weeksInYear(year);
    }
    update();
}

function nextWeek() {
    week += 1;
    if (week > weeksInYear(year)) {
        year += 1;
        week = 1;
    }
    update();
}

window.addEventListener('DOMContentLoaded', () => {
    // Menu preference
    const menu = document.getElementById('menu');
    if (!preferences.menu) {
        menu.classList.add('hide');
    }

    // Change timetable code
    const codeInput = document.getElementById('code');
    codeInput.value = code; // Initialize
    codeInput.onchange = () => {
        code = codeInput.value;
        update();
    };

    // Save code in data file
    const saveButton = document.getElementById('save');
    saveButton.onclick = () => {
        if (process.platform !== 'darwin') {
            preferences.code = code;
            fs.writeFile(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences), (err) => {
                if (err) console.log(err);
            });
        } else {
            alert('Désolé cette fonctionnalité n\'est pas disponible sous macOS.');
        }
    };

    // Go to previous week
    const previousButton = document.getElementById('previous');
    previousButton.onclick = () => {
        previousWeek();
    };

    // Go to next week
    const nextButton = document.getElementById('next');
    nextButton.onclick = () => {
        nextWeek();
    };

    // Back to current week
    const todayButton = document.getElementById('today');
    todayButton.onclick = () => {
        today();
    };

    // Go to selected date
    const calendarInput = document.getElementById('calendar');
    calendarInput.onchange = () => {
        const calendarDate = new Date(calendarInput.value);
        week = calendarDate.getWeek();
        year = calendarDate.getFullYear();
        update();
    };

    // Go to selected week
    const weekInput = document.getElementById('week');
    weekInput.value = week; // Initialize
    weekInput.onchange = () => {
        week = weekInput.value;
        if (week > weeksInYear(year)) {
            year += 1;
            week = 1;
        } else if (week <= 0) {
            year -= 1;
            week = weeksInYear(year);
        }
        update();
    };

    update(); // Initialize
});

// Keyboard event
window.addEventListener('keyup', (event) => {
    if (event.defaultPrevented) {
        return;
    }

    const { key } = event;
    if (key === 'ArrowRight') {
        nextWeek();
    } else if (key === 'ArrowLeft') {
        previousWeek();
    } else if (key === 'Shift') {
        today();
    }
});
