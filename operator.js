function mouseover(x){
            switch (x) {
                case 'ok':
                    {
                    document.getElementById("base-image").src="img/OPERATORbkgOK.png"
                    };
                }}
        function mouseleave() {
            document.getElementById("base-image").src="img/OPERATORbkg.png";
            }

            document.addEventListener('DOMContentLoaded', function() {
            const images = document.querySelectorAll('.toggle-image');

            images.forEach(image => {
                // Set the original source attribute initially if not already set
                if (!image.hasAttribute('data-original-src')) {
                    image.setAttribute('data-original-src', image.src);
                }

                image.addEventListener('click', function() {
                    // Get the current and alternate image sources
                    const currentSrc = image.src;
                    const originalSrc = image.getAttribute('data-original-src');
                    const altSrc = image.getAttribute('data-alt-src');

                    console.log(`Click on ${image.id}: currentSrc=${currentSrc}, originalSrc=${originalSrc}, altSrc=${altSrc}`);

                    // Toggle the image source
                    if (currentSrc.endsWith(altSrc)) {
                        image.src = originalSrc;
                    } else {
                        image.src = altSrc;
                    }

                    console.log(`After click: newSrc=${image.src}`);
                });
            });
        });