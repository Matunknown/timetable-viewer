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

// Chnage code timetable
const codeSelect = document.getElementById('code');
codeSelect.onchange = e => {
    code = codeSelect.value;
    updateImg();
};

// Go to previous week
const previousButton = document.getElementById('previous-week');
previousButton.onclick = e => {
    week--;
    updateImg();
};

// Go to next week
const nextButton = document.getElementById('next-week');
nextButton.onclick = e => {
    week++;
    updateImg();
};

// Back to current week
const todayButton = document.getElementById('today-week');
todayButton.onclick = e => {
    week = new Date().getWeek();
    updateImg();
};

// Scale up the image
const scaleButton = document.getElementById('img');
scaleButton.onclick = e => {
    const imgSrc = document.getElementById('img-src');
    if (imgSrc.classList.contains('scale-up')) {
        imgSrc.classList.remove('scale-up');
    } else {
        imgSrc.classList.add('scale-up');
    }
};

// Save code in data file
const saveButton = document.getElementById('save');
saveButton.onclick = e => {
    preferences['code'] = code;
    fs.writeFile(path.join(__dirname, 'preferences.json'), JSON.stringify(preferences), (err) => {
        if (err) console.log(err);
    });
};

let code = codeSelect.value;
let week = new Date().getWeek();
// Get year (and check if the week number is between two years)
const year = (new Date().getMonth() === 0 && week >= 52) ? new Date().getFullYear() - 1 : new Date().getFullYear();

// Get code in data file
code = preferences['code'];
document.getElementById('code').value = code;
updateImg();

// Keyboard event
window.addEventListener('keyup', (event) => {
    if (event.defaultPrevented) {
        return;
    }

    const key = event.key;
    if (key === 'ArrowRight') {
        week++;
        updateImg();
    } else if (key === 'ArrowLeft') {
        week--;
        updateImg();
    }
});

// Update the image
function updateImg() {
    document.querySelector('#img').innerHTML =
        `<img id="img-src" src="https://edt.univ-evry.fr/vue_etudiant_horizontale.php?current_year=${year}&current_student=${code}&current_week=${week}&lar=1920&hau=1080" alt="">`;
}