function toggleDescription(id) {
    var descriptions = document.querySelectorAll('.description');
    descriptions.forEach(function(description) {
        description.style.display = 'none';
    });

    var description = document.getElementById(id);
    description.style.display = 'block';
}

function toggleBook(id) {
    var images = document.querySelectorAll('.books img');
    images.forEach(function(image) {
        image.style.display = 'none';
    });

    var image = document.getElementById(id);
    image.style.display = 'block';
}