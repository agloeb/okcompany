setTimeout(function(){ window.location = 'windmill.html'; }, 300000)

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
        } else{
            block.style.display = 'none';
        }
    });
} 

function toggleImg(imgId) {
    var imgBlocks = document.querySelectorAll('.img-block');
    var currentBlock = document.getElementById(imgId);
    
    imgBlocks.forEach(function(block) {
        if (block === currentBlock) {
            if (block.style.display === 'none' || block.style.display === '') {
                block.style.display = 'block';
                block.style.zIndex = 1;
            } else {
                block.style.display = 'none';
            }
        } else{
            block.style.display = 'none';
        }
    });
} 
