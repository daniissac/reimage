const imageUpload = document.getElementById('imageUpload');
const previewImage = document.getElementById('previewImage');
const optionsContainer = document.getElementById('optionsContainer');
const resizeBtn = document.getElementById('resizeBtn');
const cropBtn = document.getElementById('cropBtn');
const formatBtn = document.getElementById('formatBtn');

imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        localStorage.setItem('originalImage', event.target.result);
        localStorage.setItem('currentImage', event.target.result);
        previewImage.src = event.target.result;
        optionsContainer.style.display = 'flex';
    }
    reader.readAsDataURL(file);
});

resizeBtn.addEventListener('click', () => {
    window.location.href = 'resize.html';
});

cropBtn.addEventListener('click', () => {
    window.location.href = 'crop.html';
});

formatBtn.addEventListener('click', () => {
    window.location.href = 'format.html';
});
