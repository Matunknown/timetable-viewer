const fs = require('fs');
const path = require('path');

// Get week number
Date.prototype.getWeek = function () {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
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
    const imgSrc = document.getElementById("img-src");
    if (imgSrc.classList.contains("scale-up")) {
        imgSrc.classList.remove("scale-up");
    } else {
        imgSrc.classList.add("scale-up");
    }
};

// Save code in data file
const saveButton = document.getElementById('save');
saveButton.onclick = e => {
    fs.writeFile(path.join(__dirname, 'data.txt'), code, function (err) {
        if (err) return console.log(err);
        console.log('Saved.');
    });
};

const year = new Date().getFullYear();
let code = codeSelect.value;
let week = new Date().getWeek();

// Get code in data file
fs.readFile(path.join(__dirname, 'data.txt'), 'utf8', function (err, data) {
    if (err) {
        updateImg();
        return console.log(err);
    }
    code = data;
    document.getElementById('code').value = code;
    updateImg();
});

// Keyboard event
window.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    const key = event.key;
    if (key == 'ArrowRight') {
        week++;
        updateImg();
    } else if (key == 'ArrowLeft') {
        week--;
        updateImg();
    }
});

// Update the image
function updateImg() {
    document.querySelector('#img').innerHTML =
        `<img id="img-src" src="https://edt.univ-evry.fr/vue_etudiant_horizontale.php?current_year=${year}&current_student=${code}&current_week=${week}&lar=1920&hau=1080" alt="">`;
}