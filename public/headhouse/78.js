function mouseover(x){
    switch (x) {
        case 'right':
            {
                document.getElementById("rattle").src="img/rattlesnakeHoverRight.png"
            };
            break;
        case 'left':
            {
                document.getElementById("rattle").src="img/rattlesnakeHoverLeft.png"
            }
    }}

function mouseleave() {
    document.getElementById("rattle").src="img/rattlesnake.png";}

function reveal(textId) {
    var textBlocks = document.querySelectorAll('.text-block');
    var canvas = document.getElementById('textCanvas');
    var currentBlock = document.getElementById(textId);
    
    textBlocks.forEach(function(block) {
        block.style.display = 'none'; 
    });

    if (currentBlock) {
        currentBlock.style.display = 'block';
        canvas.style.display = 'block';
        randomizePixels();
        setInterval(randomizePixels, 1000); 
    } else {
        canvas.style.display = 'none';
    }
}

function randomizePixels() {
    const pieceElement = document.querySelector('body');
    const canvas = document.getElementById('textCanvas');
    const ctx = canvas.getContext('2d');

    const rect = pieceElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const fontSize = window.getComputedStyle(pieceElement).fontSize;
    ctx.font = `${fontSize} BIZGothic`;
    ctx.fillStyle = 'rgb(68, 68, 005)';
    ctx.textBaseline = 'top';
    const maxWidth = canvas.width;

    function wrapText(text, x, y, maxWidth) {
        let words = text.split(' ');
        let line = '';
        const lineHeight = parseInt(fontSize, 10);

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    wrapText(pieceElement.innerText, 0, 0, maxWidth);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const numPixelsToRemove = 1000000; 
    for (let i = 0; i < numPixelsToRemove; i++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const index = (y * canvas.width + x) * 4;

        data[index + 3] = 0;
    }

    ctx.putImageData(imageData, 0, 0);
}

window.onload = function() {
    randomizePixels();
    setInterval(randomizePixels, 100000); 
}