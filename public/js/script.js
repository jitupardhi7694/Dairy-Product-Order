// load image to the preview image element
function previewImage(inputElem, previewElem) {
    const file = document.getElementById(inputElem).files;
    // validate file size before preview
    if (fileSizeValidation(inputElem, previewElem) === false) {
        return;
    }
    if (fileTypeValidation(inputElem) === false) {
        return;
    }
    if (file.length > 0) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document
                .getElementById(previewElem)
                .setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(file[0]);
        this.fileName = event.target.files[0].name;
        console.log('this.fileName', this.fileName);
    }
}
