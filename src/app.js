const path = require('path');

// Get the code
fs = require('fs');
fs.readFile(path.join(__dirname, 'data.txt'), 'utf8', function (err, data) {
    if (err) {
        updateImg();
        return console.log(err);
    }
    document.getElementById("code").value = data;

    updateImg();
});

// Get week number
Date.prototype.getWeek = function () {
    const onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

let weekNumber = new Date().getWeek();
document.querySelector('#week').value = weekNumber;

// Change img scale
function scale() {
    const element = document.getElementById("img-src");
    if (element.classList.contains("scale")) {
        element.classList.remove("scale");
    } else {
        element.classList.add("scale");
    }
}

// Save the code
function save() {
    fs.writeFile(path.join(__dirname, 'data.txt'), document.getElementById("code").value, function (err) {
        if (err) return console.log(err);
        console.log('Saved.');
    });
}

function change(value) {
    weekNumber = weekNumber + value;
    document.querySelector('#week').value = weekNumber;
    updateImg();
}

function today() {
    document.querySelector('#week').value = new Date().getWeek();
    updateImg();
}

// Upadate img
function updateImg() {
    const year = new Date().getFullYear();
    const code = document.getElementById("code").value;
    const week = document.getElementById("week").value;

    document.querySelector('#img').innerHTML =
        `<img id="img-src" src="https://edt.univ-evry.fr/vue_etudiant_horizontale.php?current_year=${year}&current_student=${code}&current_week=${week}&lar=1920&hau=1080" alt="">`;
}

// Keyboard event
window.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }

    const key = event.key;

    if (key == 'ArrowRight') {
        change(1);
    } else if (key == 'ArrowLeft') {
        change(-1);
    }
});