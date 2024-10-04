let images = [];
let currentImageIndex = 0;
let editHistory = [[]];
let currentEditIndex = -1;
let cropper;

const imageUpload = document.getElementById('imageUpload');
const imageContainer = document.getElementById('imageContainer');
const uploadBtn = document.getElementById('uploadBtn');
const cropBtn = document.getElementById('cropBtn');
const resizeBtn = document.getElementById('resizeBtn');
const textBtn = document.getElementById('textBtn');
const filterBtn = document.getElementById('filterBtn');
const formatBtn = document.getElementById('formatBtn');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const downloadBtn = document.getElementById('downloadBtn');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const closeModal = document.getElementsByClassName('close')[0];

uploadBtn.addEventListener('click', () => imageUpload.click());
cropBtn.addEventListener('click', initCropper);
resizeBtn.addEventListener('click', showResizeDialog);
textBtn.addEventListener('click', showTextOverlayDialog);
filterBtn.addEventListener('click', showFilterOptions);
formatBtn.addEventListener('click', showFormatOptions);
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
downloadBtn.addEventListener('click', downloadImage);
imageUpload.addEventListener('change', handleImageUpload);
closeModal.addEventListener('click', () => modal.style.display = 'none');

function handleImageUpload(e) {
    images = Array.from(e.target.files);
    displayImage(0);
}

function displayImage(index) {
    currentImageIndex = index;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(images[index]);
    img.onload = () => {
        imageContainer.innerHTML = '';
        imageContainer.appendChild(img);
        saveEdit();
    };
}

function initCropper() {
    if (cropper) cropper.destroy();
    cropper = new Cropper(imageContainer.firstChild, {
        aspectRatio: NaN,
        viewMode: 1,
    });
}

function showResizeDialog() {
    modalContent.innerHTML = `
        <h2>Resize Image</h2>
        <input type="number" id="widthInput" placeholder="Width">
        <input type="number" id="heightInput" placeholder="Height">
        <button onclick="resizeImage()">Apply</button>
    `;
    modal.style.display = 'block';
}

function resizeImage() {
    const width = parseInt(document.getElementById('widthInput').value);
    const height = parseInt(document.getElementById('heightInput').value);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d').drawImage(imageContainer.firstChild, 0, 0, width, height);
    replaceImage(canvas.toDataURL());
    modal.style.display = 'none';
}

function showTextOverlayDialog() {
    modalContent.innerHTML = `
        <h2>Add Text Overlay</h2>
        <input type="text" id="overlayText" placeholder="Enter text">
        <input type="color" id="textColor" value="#000000">
        <input type="number" id="fontSize" value="20" min="1" max="100">
        <button onclick="addTextOverlay()">Apply</button>
    `;
    modal.style.display = 'block';
}

function addTextOverlay() {
    const text = document.getElementById('overlayText').value;
    const color = document.getElementById('textColor').value;
    const size = document.getElementById('fontSize').value;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageContainer.firstChild.width;
    canvas.height = imageContainer.firstChild.height;
    ctx.drawImage(imageContainer.firstChild, 0, 0);
    ctx.font = `${size}px Arial`;
    ctx.fillStyle = color;
    ctx.fillText(text, 10, 50);
    replaceImage(canvas.toDataURL());
    modal.style.display = 'none';
}

function showFilterOptions() {
    modalContent.innerHTML = `
        <h2>Apply Filter</h2>
        <button onclick="applyFilter('grayscale')">Grayscale</button>
        <button onclick="applyFilter('sepia')">Sepia</button>
        <button onclick="applyFilter('invert')">Invert</button>
    `;
    modal.style.display = 'block';
}

function applyFilter(filter) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = imageContainer.firstChild.width;
    canvas.height = imageContainer.firstChild.height;
    ctx.filter = filter + '(100%)';
    ctx.drawImage(imageContainer.firstChild, 0, 0);
    replaceImage(canvas.toDataURL());
    modal.style.display = 'none';
}

function showFormatOptions() {
    modalContent.innerHTML = `
        <h2>Choose Format</h2>
        <button onclick="changeFormat('image/jpeg')">JPEG</button>
        <button onclick="changeFormat('image/png')">PNG</button>
        <button onclick="changeFormat('image/webp')">WebP</button>
    `;
    modal.style.display = 'block';
}

function changeFormat(format) {
    const canvas = document.createElement('canvas');
    canvas.width = imageContainer.firstChild.width;
    canvas.height = imageContainer.firstChild.height;
    canvas.getContext('2d').drawImage(imageContainer.firstChild, 0, 0);
    replaceImage(canvas.toDataURL(format));
    modal.style.display = 'none';
}

function replaceImage(dataURL) {
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
        imageContainer.innerHTML = '';
        imageContainer.appendChild(img);
        saveEdit();
    };
}

function saveEdit() {
    currentEditIndex++;
    editHistory[currentImageIndex] = editHistory[currentImageIndex] || [];
    editHistory[currentImageIndex] = editHistory[currentImageIndex].slice(0, currentEditIndex);
    editHistory[currentImageIndex].push(imageContainer.firstChild.src);
}

function undo() {
    if (currentEditIndex > 0) {
        currentEditIndex--;
        loadHistoryState();
    }
}

function redo() {
    if (currentEditIndex < editHistory[currentImageIndex].length - 1) {
        currentEditIndex++;
        loadHistoryState();
    }
}

function loadHistoryState() {
    const img = new Image();
    img.src = editHistory[currentImageIndex][currentEditIndex];
    img.onload = () => {
        imageContainer.innerHTML = '';
        imageContainer.appendChild(img);
    };
}

function downloadImage() {
    const link = document.createElement('a');
    link.download = 'edited_image.png';
    link.href = imageContainer.firstChild.src;
    link.click();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(error => console.log('ServiceWorker registration failed:', error));
    });
}
