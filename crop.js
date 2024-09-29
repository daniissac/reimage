const previewImage = document.getElementById('previewImage');
const cropBtn = document.getElementById('cropBtn');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');

let cropper;

// Load the current image from localStorage
previewImage.src = localStorage.getItem('currentImage');

previewImage.onload = function() {
    cropper = new Cropper(previewImage, {
        aspectRatio: NaN,
        viewMode: 1,
    });
};

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
