// Scale up the image
const image = document.getElementById('image');
image.onclick = e => {
    const timetableImage = document.getElementById('timetable-image');
    if (timetableImage.classList.contains('scale-up')) {
        timetableImage.classList.remove('scale-up');
    } else {
        timetableImage.classList.add('scale-up');
    }
};
