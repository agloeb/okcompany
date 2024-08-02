setTimeout(function(){ window.location = 'windmill.html'; }, 300000)

document.addEventListener('DOMContentLoaded', function() {
const images = document.querySelectorAll('.toggle-image');

    images.forEach(image => {
        if (!image.hasAttribute('data-original-src')) {
            image.setAttribute('data-original-src', image.src);
        }

        image.addEventListener('click', function() {
            const currentSrc = image.src;
            const originalSrc = image.getAttribute('data-original-src');
            const altSrc = image.getAttribute('data-alt-src');

            console.log(`Click on ${image.id}: currentSrc=${currentSrc}, originalSrc=${originalSrc}, altSrc=${altSrc}`);

            if (currentSrc.endsWith(altSrc)) {
                image.src = originalSrc;
            } else {
                image.src = altSrc;
            }

            console.log(`After click: newSrc=${image.src}`);
        });
    });
});

function toggleText(textId) {
    var textBlocks = document.querySelectorAll('.text-block');
    var currentBlock = document.getElementById(textId);
    
    textBlocks.forEach(function(block) {
        if (block === currentBlock) {
        if (block.style.display === 'none' || block.style.display === '') {
            block.style.display = 'block';
            block.style.zIndex = 1;
        } else {
            block.style.display = 'none';
        }
        } 
    });
} 
          
function toggleImg(id) {
    var images = document.querySelectorAll('.img-block');
    images.forEach(function(image) {
        image.style.display = 'none';
    });

    var image = document.getElementById(id);
    image.style.display = 'block';
}

function toggleAllOff() {
    var textBlocks = document.querySelectorAll('.text-block');
    var imageBlocks = document.querySelectorAll('.img-block');

    textBlocks.forEach(function(block) {
        block.style.display = 'none';
    });

    imageBlocks.forEach(function(block) {
        block.style.display = 'none';
    });
    
    var claygutImage = document.querySelector('.toggle-image');
    if (claygutImage) {
        claygutImage.src = 'img/manuals/claygutOFF.png';
    }
}
