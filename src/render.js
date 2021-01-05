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