let currentImage = null;
let cropper = null;

document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        currentImage = new Image();
        currentImage.onload = function() {
            document.getElementById('imagePreview').src = currentImage.src;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('editImage').style.display = 'block';
            document.getElementById('downloadImage').style.display = 'block';
        }
        currentImage.src = event.target.result;
    }

    reader.readAsDataURL(file);
});

document.getElementById('editImage').addEventListener('click', function() {
    document.getElementById('editOptions').style.display = 'block';
});

document.getElementById('editSelect').addEventListener('change', function(e) {
    const editType = e.target.value;
    document.getElementById('resizeOptions').style.display = editType === 'resize' ? 'block' : 'none';
    document.getElementById('cropOptions').style.display = editType === 'crop' ? 'block' : 'none';

    if (editType === 'crop' && !cropper) {
        cropper = new Cropper(document.getElementById('imagePreview'), {
            aspectRatio: NaN,
            viewMode: 1,
        });
    } else if (editType !== 'crop' && cropper) {
        cropper.destroy();
        cropper = null;
    }
});

document.getElementById('applyEdit').addEventListener('click', function() {
    const editType = document.getElementById('editSelect').value;
    const format = document.getElementById('formatSelect').value;

    if (editType === 'resize') {
        const width = parseInt(document.getElementById('width').value);
        const height = parseInt(document.getElementById('height').value);
        resizeImage(width, height);
    } else if (editType === 'crop') {
        cropImage();
    }

    // Apply format change here
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    ctx.drawImage(currentImage, 0, 0);
    currentImage.src = canvas.toDataURL(`image/${format}`);
    document.getElementById('imagePreview').src = currentImage.src;
});

function resizeImage(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(currentImage, 0, 0, width, height);
    updateImage(canvas);
}

function cropImage() {
    if (cropper) {
        const canvas = cropper.getCroppedCanvas();
        updateImage(canvas);
        cropper.destroy();
        cropper = null;
    }
}

function updateImage(canvas) {
    const format = document.getElementById('formatSelect').value;
    currentImage.src = canvas.toDataURL(`image/${format}`);
    document.getElementById('imagePreview').src = currentImage.src;
}

document.getElementById('downloadImage').addEventListener('click', function() {
    const format = document.getElementById('formatSelect').value;
    const link = document.createElement('a');
    link.download = `edited_image.${format}`;
    link.href = currentImage.src;
    link.click();
});

const editBtn = document.getElementById('editBtn');

// Add any other necessary code here

editBtn.addEventListener('click', function() {
    window.location.href = 'edit.html';
});