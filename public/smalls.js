setTimeout(function(){ window.location = 'windmill.html'; }, 300000)

function toggleText(textId) {
  var textBlocks = document.querySelectorAll('.text-block');
  var currentBlock = document.getElementById(textId);

  textBlocks.forEach(function(block) {
    if (block === currentBlock) {
      if (block.style.display === 'none' || block.style.display === '') {
        fadeInTextBlock(block);
        block.style.display = 'block';
        block.style.zIndex = 1;
        generateNoise(block, 20); // Adjust noise density as needed
      }
    } else {
      fadeOutTextBlock(block);
    }
  });
}

function fadeOutTextBlock(block) {
  var currentOpacity = parseFloat(block.style.opacity);
  if (currentOpacity > 0) {
    block.style.opacity = (currentOpacity - 0.02).toFixed(2);
    setTimeout(function() {
      fadeOutTextBlock(block);
    }, 100); // Adjust the interval here for smoother fading
  } else {
    block.style.display = 'none';
    resetNoise(block);
  }
}

function fadeInTextBlock(block) {
  block.style.opacity = 1;
}

function generateNoise(container, count) {
  const fragment = document.createDocumentFragment();
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  for (let i = 0; i < count; i++) {
    const noiseElement = document.createElement('div');
    noiseElement.className = 'noise';
    noiseElement.style.left = Math.floor(Math.random() * containerWidth) + 'px';
    noiseElement.style.top = Math.floor(Math.random() * containerHeight) + 'px';
    noiseElement.style.opacity = '1';
    fragment.appendChild(noiseElement);
  }

  container.appendChild(fragment);
}

function resetNoise(block) {
  // Remove existing noise elements
  var noiseElements = block.querySelectorAll('.noise');
  noiseElements.forEach(function(element) {
    element.remove();
  });
}


function toggleImage(imageId) {
    var image = document.getElementById(imageId);
    if (image.style.display = 'none') {
        image.style.display = 'block'
    }
    else (image.style.display = 'none')
}
