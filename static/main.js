const fileInput = document.getElementById('fileInput');
const imageCanvas = document.getElementById('imageCanvas');
const annotationTextArea = document.getElementById('annotation');
const userTextArea = document.getElementById('user');

let image;
let ctx;
let isDrawing = false;
let startX, startY, endX, endY;

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function() {
        image = new Image();
        image.onload = function() {
            imageCanvas.width = image.width;
            imageCanvas.height = image.height;
            ctx = imageCanvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
        }
        image.src = reader.result;
    }

    reader.readAsDataURL(file);
});

imageCanvas.addEventListener('mousedown', (event) => {
    isDrawing = true;
    startX = event.offsetX;
    startY = event.offsetY;
});

imageCanvas.addEventListener('mouseup', () => {
    isDrawing = false;
    ctx.beginPath();
    ctx.rect(startX, startY, endX - startX, endY - startY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'blue';
    ctx.stroke();
});

imageCanvas.addEventListener('mousemove', (event) => {
    if (!isDrawing) return;
    endX = event.offsetX;
    endY = event.offsetY;
    draw();
});

// function draw() {
// //     ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
// //     ctx.drawImage(image, 0, 0);
// //     ctx.beginPath();
// //     ctx.rect(startX, startY, endX - startX, endY - startY);
// //     ctx.lineWidth = 2;
// //     ctx.strokeStyle = 'blue';
// //     ctx.stroke();
// // }
// } 

function draw() {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);
    ctx.drawImage(image, 0, 0);
    if (isDrawing) {
        ctx.beginPath();
        ctx.rect(startX, startY, endX - startX, endY - startY);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'blue';
        ctx.stroke();
    }
}


function submitAnnotation() {
    const annotation = annotationTextArea.value;
    const user = document.getElementById("user").value;
    const boundingBox = { x: startX, y: startY, width: endX - startX, height: endY - startY };
    const data = { user , annotation, boundingBox };

    fetch('/submit', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
