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

let code = 68426749;
let week = new Date().getWeek();
// Get year (and check if the week number is between two years)
let year = (new Date().getMonth() === 0 && week >= 52) ? new Date().getFullYear() - 1 : new Date().getFullYear();

window.addEventListener('DOMContentLoaded', () => {
    // Change timetable code
    const codeInput = document.getElementById('code');
    codeInput.onchange = e => {
        code = codeInput.value;
        updateImage();
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
        week = new Date().getWeek();
        year = (new Date().getMonth() === 0 && week >= 52) ? new Date().getFullYear() - 1 : new Date().getFullYear();
        updateImage();
    };

    // Go to selected week
    const calendarInput = document.getElementById('calendar');
    calendarInput.onchange = e => {
        const calendarDate = new Date(calendarInput.value);
        week = calendarDate.getWeek();
        year = calendarDate.getFullYear();
        updateImage();
    }

    // Get code in data file
    code = preferences['code'];
    codeInput.value = code;
    updateImage();

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
        }
    });

    function previousWeek() {
        week--;
        if (week <= 0) {
            year--;
            week = 52;
        }
        updateImage();
    }

    function nextWeek() {
        week++;
        updateImage();
    }

    function updateImage() {
        document.querySelector('#image').innerHTML =
            `<img id="timetable-image" src="https://edt.univ-evry.fr/vue_etudiant_horizontale.php?current_year=${year}&current_student=${code}&current_week=${week}&lar=1920&hau=1080" alt="">`;
    }
});