const previewImage = document.getElementById('previewImage');
const changeFormatBtn = document.getElementById('changeFormatBtn');
const downloadBtn = document.getElementById('downloadBtn');
const backBtn = document.getElementById('backBtn');
const formatSelect = document.getElementById('formatSelect');

// Load the current image from localStorage
previewImage.src = localStorage.getItem('currentImage');

changeFormatBtn.addEventListener('click', function() {
    const format = formatSelect.value;
    const canvas = document.createElement('canvas');
    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(previewImage, 0, 0);
    const newFormatImageData = canvas.toDataURL(format);
    previewImage.src = newFormatImageData;
    localStorage.setItem('currentImage', newFormatImageData);
});

downloadBtn.addEventListener('click', function() {
    const format = formatSelect.value;
    const a = document.createElement('a');
    a.href = localStorage.getItem('currentImage');
    a.download = `edited_image.${format.split('/')[1]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

backBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
});
