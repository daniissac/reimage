const previewImage = document.getElementById('previewImage');
const resizeBtn = document.getElementById('resizeBtn');
const cropBtn = document.getElementById('cropBtn');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');
const resizeWidth = document.getElementById('resizeWidth');
const resizeHeight = document.getElementById('resizeHeight');
const widthUnit = document.getElementById('widthUnit');
const heightUnit = document.getElementById('heightUnit');

let cropper;

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

previewImage.onload = function() {
    cropper = new Cropper(previewImage, {
        aspectRatio: NaN,
        viewMode: 1,
    });
};

resizeBtn.addEventListener('click', function() {
    const width = convertToPx(parseFloat(resizeWidth.value), widthUnit.value);
    const height = convertToPx(parseFloat(resizeHeight.value), heightUnit.value);
    
    if (width && height) {
        const canvas = cropper.getCroppedCanvas({
            width: width,
            height: height
        });
        const resizedImageData = canvas.toDataURL('image/png');
        localStorage.setItem('currentImage', resizedImageData);
        previewImage.src = resizedImageData;
        cropper.destroy();
        cropper = new Cropper(previewImage, {
            aspectRatio: NaN,
            viewMode: 1,
        });
    } else {
        alert('Please enter both width and height.');
    }
});

cropBtn.addEventListener('click', function() {
    const croppedCanvas = cropper.getCroppedCanvas();
    const croppedImageData = croppedCanvas.toDataURL('image/png');
    localStorage.setItem('currentImage', croppedImageData);
    previewImage.src = croppedImageData;
    cropper.destroy();
    cropper = new Cropper(previewImage, {
        aspectRatio: NaN,
        viewMode: 1,
    });
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
