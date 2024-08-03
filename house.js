setTimeout(function(){ window.location = 'windmill.html'; }, 900000)

const imageSources = ["img/homepage/HOMEPAGE.png", "img/homepage/HOMEPAGEhardware2.png"];

let currentIndex2 = 0;

function changeHouse() {
    const img = document.getElementById("houseImg");
    const imgMobile = document.getElementById("houseImgMobile")
    img.src = imageSources[currentIndex2];
    imgMobile.src = imageSources[currentIndex2];
    currentIndex2 = (currentIndex2 + 1) % imageSources.length;
}   

setInterval(changeHouse, 4000);

document.addEventListener("DOMContentLoaded", function() {
    function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

var images = ["img/homepage/HOMEPAGEtopleftwindow.png", "img/homepage/HOMEPAGEbottomrightdoor.png", "img/homepage/HOMEPAGEcloud1.png", "img/homepage/HOMEPAGEfrontdoor.png",  "img/homepage/HOMEPAGEtoprightwindow.png",  "img/homepage/HOMEPAGEtelephone.png"];
var currentIndex = 0;
var intervalTime = 200;
var flickerDuration = 900;
var flickerInterval;
var animationDuration = 5; 
var shuffledImages = shuffleArray(images);

function changeImage() {
    var imgElement = document.getElementById("houseImg");
    var imgMobile = document.getElementById("houseImgMobile");
    imgElement.src = images[currentIndex];
    imgMobile.src = images[currentIndex];
    currentIndex = (currentIndex + 1) % shuffledImages.length;

    if (currentIndex === 0) {
        clearInterval(flickerInterval);
    }
}

flickerInterval = setInterval(changeImage, intervalTime);

});
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
function showDivPeriodically() {
    const periodicDiv = document.getElementById('periodicDiv');

    setInterval(function() {
        periodicDiv.style.display = 'block';
        setTimeout(function() {
            periodicDiv.classList.add('jitter-in');
        }, 10);

        setTimeout(function() {
            periodicDiv.classList.remove('jitter-in');
            periodicDiv.style.display = 'none';
        }, 7000); 
    }, 23000); 
}
window.onload = showDivPeriodically;
