let images = [];
let currentImageIndex = 0;
let editHistory = [[]];
let currentEditIndex = -1;
let cropper;

const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const editingInterface = document.getElementById('editingInterface');
const imageContainer = document.getElementById('imageContainer');
const formatSelect = document.getElementById('formatSelect');
const editTypeSelect = document.getElementById('editTypeSelect');
const resizeControls = document.getElementById('resizeControls');
const cropControls = document.getElementById('cropControls');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const applyEditBtn = document.getElementById('applyEdit');
const undoBtn = document.getElementById('undoBtn');
const redoBtn = document.getElementById('redoBtn');
const applyToAllBtn = document.getElementById('applyToAllBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qualitySlider = document.getElementById('quality-slider');
const qualityValue = document.getElementById('qualityValue');
const aspectRatioSelect = document.getElementById('aspect-ratio-select');
const overlayText = document.getElementById('overlay-text');
const fontSelect = document.getElementById('font-select');
const fontSize = document.getElementById('font-size');
const fontColor = document.getElementById('font-color');

imageUpload.addEventListener('change', handleImageUpload);
editTypeSelect.addEventListener('change', toggleEditControls);
applyEditBtn.addEventListener('click', applyEdit);
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);
applyToAllBtn.addEventListener('click', applyToAll);
downloadBtn.addEventListener('click', downloadImage);
qualitySlider.addEventListener('input', updateQualityValue);
aspectRatioSelect.addEventListener('change', updateCropAspectRatio);

function handleImageUpload(e) {
    images = Array.from(e.target.files);
    displayImagePreviews();
    if (images.length > 0) {
        loadImageForEditing(0);
    }
}

function displayImagePreviews() {
    imagePreview.innerHTML = '';
    images.forEach((image, index) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(image);
        img.onclick = () => loadImageForEditing(index);
        imagePreview.appendChild(img);
    });
}

function loadImageForEditing(index) {
    currentImageIndex = index;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(images[index]);
    img.onload = () => {
        imageContainer.innerHTML = '';
        imageContainer.appendChild(img);
        editingInterface.style.display = 'block';
        initCropper();
        saveEdit();
    };
}

function initCropper() {
    if (cropper) {
        cropper.destroy();
    }
    cropper = new Cropper(imageContainer.firstChild, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 1,
    });
}

function toggleEditControls() {
    const editType = editTypeSelect.value;
    resizeControls.style.display = editType === 'resize' ? 'block' : 'none';
    cropControls.style.display = editType === 'crop' ? 'block' : 'none';
}

function applyEdit() {
    const editType = editTypeSelect.value;
    if (editType === 'resize') {
        resizeImage();
    } else if (editType === 'crop') {
        cropImage();
    }
    addTextOverlay();
    saveEdit();
}

function resizeImage() {
    const width = parseInt(widthInput.value);
    const height = parseInt(heightInput.value);
    cropper.setCropBoxData({ width, height });
    const canvas = cropper.getCroppedCanvas({ width, height });
    replaceImage(canvas);
}

function cropImage() {
    const canvas = cropper.getCroppedCanvas();
    replaceImage(canvas);
}

function replaceImage(canvas) {
    const img = new Image();
    img.src = canvas.toDataURL(formatSelect.value);
    img.onload = () => {
        imageContainer.innerHTML = '';
        imageContainer.appendChild(img);
        initCropper();
    };
}

function addTextOverlay() {
    const canvas = cropper.getCroppedCanvas();
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontSize.value}px ${fontSelect.value}`;
    ctx.fillStyle = fontColor.value;
    ctx.fillText(overlayText.value, 10, 50);
    replaceImage(canvas);
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
        initCropper();
    };
}

function applyToAll() {
    const currentCanvas = cropper.getCroppedCanvas();
    images.forEach((image, index) => {
        if (index !== currentImageIndex) {
            const img = new Image();
            img.src = URL.createObjectURL(image);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = currentCanvas.width;
                canvas.height = currentCanvas.height;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(currentCanvas, 0, 0);
                images[index] = dataURLtoFile(canvas.toDataURL(formatSelect.value), image.name);
            };
        }
    });
}

function downloadImage() {
    const quality = parseFloat(qualitySlider.value);
    const canvas = cropper.getCroppedCanvas();
    const dataURL = canvas.toDataURL(formatSelect.value, quality);
    const link = document.createElement('a');
    link.download = `edited_image.${formatSelect.value.split('/')[1]}`;
    link.href = dataURL;
    link.click();
}

function updateQualityValue() {
    qualityValue.textContent = qualitySlider.value;
}

function updateCropAspectRatio() {
    const ratio = aspectRatioSelect.value;
    if (ratio === 'free') {
        cropper.setAspectRatio(NaN);
    } else {
        const [width, height] = ratio.split(':').map(Number);
        cropper.setAspectRatio(width / height);
    }
}

function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

toggleEditControls();
