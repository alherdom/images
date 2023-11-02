document.getElementById("data").addEventListener("submit", function (event) {
    event.preventDefault();

    const table = document.getElementById('imageList');
    table.innerHTML = '';

    var dh = dw = document.getElementById("size").value;
    if (dh > 1) {

        var bh = bw = document.getElementById("border-width").value;
        var bc = document.getElementById("border-color").value;
        var bc = bc.slice(1, 7);
        var sharpen = document.getElementById("image-focus").value;
        var blur = document.getElementById("image-blur").value;

        console.log("Size: " + dh);
        console.log("Border Width: " + bw);
        console.log("Border Color: " + bc);
        console.log("Image Focus: " + sharpen);
        console.log("Image Blur: " + blur);

        const numImages = 20;
        const URL_base = "http://10.109.18.40:80/img/"
        for (let i = 1; i <= numImages; i++) {
            const numberWithZero = i.toString().padStart(2, '0');
            const imageURL = `${URL_base}image${numberWithZero}.jpg?dw=${dw}&dh=${dh}&bw=${bw}&bh=${bh}&bc=${bc}&sharpen=${sharpen}&blur=${blur}`;
            const listItem = document.createElement("li");
            const image = document.createElement("img");
            image.src = imageURL;
            listItem.appendChild(image);
            imageList.appendChild(listItem);
        }
    }
    else {
        alert("The image size must be greather tan 1px");
    }
});