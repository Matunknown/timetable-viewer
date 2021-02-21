const fs = require('fs');
const path = require('path');

const preferences = require(path.join(__dirname, 'preferences.json'));

// Get week number
Date.prototype.getWeek = function () {
    const d = new Date(Date.UTC(this.getFullYear(), this.getMonth(), this.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Get number of weeks in the year
function weeksInYear(year) {
    const month = 11;
    let day = 31;
    let week;
    do {
        const d = new Date(year, month, day--);
        week = d.getWeek();
    } while (week == 1);

    return week;
}

let code = 68426749;
let week = new Date().getWeek();
// Get year (and check if the week number is between two years)
let year = (new Date().getMonth() === 0 && week >= 52) ? new Date().getFullYear() - 1 : new Date().getFullYear();

window.addEventListener('DOMContentLoaded', () => {
    // Change timetable code
    const codeInput = document.getElementById('code');
    codeInput.onchange = e => {
        code = codeInput.value;
        update();
    };

    // Save code in data file
    const saveButton = document.getElementById('save');
    saveButton.onclick = e => {
        if (process.platform !== 'darwin') {
            preferences['code'] = code;
            fs.writeFile(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences), (err) => {
                if (err) console.log(err);
            });
        } else {
            alert('Désolé cette fonctionnalité n\'est pas disponible sous macOS.');
        }
    };

    // Go to previous week
    const previousButton = document.getElementById('previous');
    previousButton.onclick = e => {
        previousWeek();
    };

    // Go to next week
    const nextButton = document.getElementById('next');
    nextButton.onclick = e => {
        nextWeek();
    };

    // Back to current week
    const todayButton = document.getElementById('today');
    todayButton.onclick = e => {
        today();
    };

    // Go to selected week
    const calendarInput = document.getElementById('calendar');
    calendarInput.onchange = e => {
        const calendarDate = new Date(calendarInput.value);
        week = calendarDate.getWeek();
        year = calendarDate.getFullYear();
        update();
    }

    const weekInput = document.getElementById('week');
    weekInput.value = week;
    weekInput.onchange = e => {
        week = weekInput.value;
        if (week > weeksInYear(year)) {
            year++;
            week = 1;
        } else if (week <= 0) {
            year--;
            week = weeksInYear(year);
        }
        update();
    }

    // Get code in data file
    code = preferences['code'];
    codeInput.value = code;
    update();

    // Keyboard event
    window.addEventListener('keyup', (event) => {
        if (event.defaultPrevented) {
            return;
        }

        const key = event.key;
        if (key === 'ArrowRight') {
            nextWeek();
        } else if (key === 'ArrowLeft') {
            previousWeek();
        } else if (key === 'Enter') {
            today();
        }
    });

    function today() {
        week = new Date().getWeek();
        year = (new Date().getMonth() === 0 && week >= 52) ? new Date().getFullYear() - 1 : new Date().getFullYear();
        update();
    }

    function previousWeek() {
        week--;
        if (week <= 0) {
            year--;
            week = weeksInYear(year);
        }
        update();
    }

    function nextWeek() {
        week++;
        if (week > weeksInYear(year)) {
            year++;
            week = 1;
        }
        update();
    }

    function update() {
        weekInput.value = week;
        document.getElementById("info").innerText = `Semaine: ${week} Année: ${year}`;
        document.getElementById('image').innerHTML =
            `<img id="timetable-image" src="https://edt.univ-evry.fr/vue_etudiant_horizontale.php?current_year=${year}&current_student=${code}&current_week=${week}&lar=1920&hau=1080" alt="">`;
    }
});
