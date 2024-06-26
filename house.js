setTimeout(function(){ window.location = 'windmill.html'; }, 900000)

    const imageSources = ["img/homepage/HOMEPAGE.png", "img/homepage/HOMEPAGEhardware2.png"];

    let currentIndex2 = 0;

    function changeHouse() {
        const img = document.getElementById("houseImg");
        img.src = imageSources[currentIndex2];
        currentIndex2 = (currentIndex2 + 1) % imageSources.length;
    }

        setInterval(changeHouse, 4000);

    function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

    var images = ["img/homepage/HOMEPAGEtopleftwindow.png", "img/homepage/HOMEPAGEbottomrightdoor.png", "img/homepage/HOMEPAGEcloud1.png", "img/homepage/HOMEPAGEfrontdoor.png",  "img/homepage/HOMEPAGEtoprightwindow.png",  "img/homepage/HOMEPAGEtelephone.png"];
    var currentIndex = 0;
    var intervalTime = 150;
    var flickerDuration = 900;
    var flickerInterval;
    var animationDuration = 5; 
    var shuffledImages = shuffleArray(images);

    function changeImage() {
        var imgElement = document.getElementById("houseImg");
        imgElement.src = images[currentIndex];
        currentIndex = (currentIndex + 1) % shuffledImages.length;

        if (currentIndex === 0) {
            clearInterval(flickerInterval);
        }
    }

    flickerInterval = setInterval(changeImage, intervalTime);

    function mouseover(x){
        switch (x) {
            case 'frontdoor':
                {
                    document.getElementById("houseImg").src="img/homepage/HOMEPAGEfrontdoor.png"
                };
                break;
            case 'sidedoor':
            {
                    document.getElementById("houseImg").src="img/homepage/HOMEPAGEbottomrightdoor.png"
                };
                break;
            case 'toprightwindow':
            {
                    document.getElementById("houseImg").src="img/homepage/HOMEPAGEtoprightwindow.png"
                };
                break;
            case 'cloud1':
            {
                    document.getElementById("houseImg").src="img/homepage/HOMEPAGEcloud1.png"
                };
                break;
            case 'topleftwindow':
            {
                    document.getElementById("houseImg").src="img/homepage/HOMEPAGEtopleftwindow.png"
                };
                break;
            case 'tele':
            {
                    document.getElementById("houseImg").src="img/homepage/HOMEPAGEtelephone.png"
                };
                break;
            case 'hardware':
            {
                    document.getElementById("houseImg").src="img/homepage/HOMEPAGEhardware2.png"
                };
                break;
            case 'headhouse':
            {
                document.getElementById("headhouse").src="img/headhouseSLUR.gif"
            };
            break;
        }
    }
    function mouseleave() {
  document.getElementById("houseImg").src="img/homepage/HOMEPAGE.png";
}
    function mouseleave2() {
  document.getElementById("headhouse").src="img/headhouse.png";
}

function toggleGlobe(){
    var globe = document.getElementById('globe');
    var house = document.getElementById('house');
    if (globe.style.display === 'none'){
        globe.style.display = 'block';
        globe.style.animation = 'fadeIn forwards 0.5s'
        house.style.animation = 'fadeOut forwards 0.5s';            } else {
        globe.style.display = 'none';
        globe.style.animation = 'fadeOutGlobe forwards 0.5s';
        house.style.opacity = '1';
    } 
}
document.addEventListener('DOMContentLoaded', function() {
    const emailImage = document.getElementById('emailImage');
    emailImage.addEventListener('click', () => {
        const emailAddress = document.getElementById('emailAddress').innerText;
        
        const textarea = document.createElement('textarea');
        textarea.value = emailAddress;
        document.body.appendChild(textarea);
        
        textarea.select();
        document.execCommand('copy');
        
        document.body.removeChild(textarea);

        const copied = document.getElementById('copied').innerText;
        const temptext = document.createElement('temptext');
        temptext.value = copied;
        document.body.appendChild(temptext);
    });
});
function toggleGlobeOff(){
    var globe = document.getElementById('globe');
    var house = document.getElementById('house');
    var copied = document.getElementById('copied');
    if (globe.style.display === 'block'){
        globe.style.animation = 'fadeOutGlobe forwards 0.5s';
        globe.style.display = 'none';
        house.style.animation = 'fadeInHouse forwards 3s';
        copied.style.display = 'block';
        copied.style.animation = 'fadeInOut forwards 2s';
    }

    function toggleCopied(){
        copied.style.display = 'none'
    }
}