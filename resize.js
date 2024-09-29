const previewImage = document.getElementById('previewImage');
const resizeBtn = document.getElementById('resizeBtn');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const widthUnit = document.getElementById('widthUnit');
const heightUnit = document.getElementById('heightUnit');

// Load the current image from localStorage
previewImage.src = localStorage.getItem('currentImage');

function convertToPx(value, unit) {
    switch (unit) {
        case 'cm':
            return value * 37.7952755906; // 96 DPI
        case 'inch':
            return value * 96; // 96 DPI
        default:
            return value;
    }
}

resizeBtn.addEventListener('click', function() {
    const width = convertToPx(parseFloat(resizeWidth.value), widthUnit.value);
    const height = convertToPx(parseFloat(resizeHeight.value), heightUnit.value);
    
    if (width && height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(previewImage, 0, 0, width, height);
        const resizedImageData = canvas.toDataURL('image/png');
        previewImage.src = resizedImageData;
        localStorage.setItem('currentImage', resizedImageData);
    } else {
        alert('Please enter both width and height.');
    }
});

downloadBtn.addEventListener('click', function() {
    const a = document.createElement('a');
    a.href = localStorage.getItem('currentImage');
    a.download = 'edited_image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

backBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
});
