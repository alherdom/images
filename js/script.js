document.getElementById("data").addEventListener("submit", function (event) {
    event.preventDefault();

    var size = document.getElementById("size").value;
    var border_width = document.getElementById("border-width").value;
    var border_color = document.getElementById("border-color").value;
    var image_focus = document.getElementById("image-focus").value;
    var image_blur = document.getElementById("image-blur").value;

    console.log("Size: " + size);
    console.log("Border Width: " + border_width);
    console.log("Border Color: " + border_color);
    console.log("Image Focus: " + image_focus);
    console.log("Image Blur: " + image_blur);
});

const numImages = 20;
for (let i = 1; i <= numImages; i++) {
    const numberWithZero = i.toString().padStart(2, '0');
    const imageURL = `img/image${numberWithZero}.jpg`;
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    image.src = imageURL;
    listItem.appendChild(image);
    imageList.appendChild(listItem);
}
