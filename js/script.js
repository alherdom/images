document.getElementById("data").addEventListener("submit", function (event) {
    event.preventDefault();

    var dh = dw = document.getElementById("size").value;
    var bw = document.getElementById("border-width").value;
    var bc = document.getElementById("border-color").value;
    var sharpen = document.getElementById("image-focus").value;
    var blur = document.getElementById("image-blur").value;

    console.log("Size: " + dh);
    console.log("Border Width: " + bw);
    console.log("Border Color: " + bc);
    console.log("Image Focus: " + sharpen);
    console.log("Image Blur: " + blur);
});

const numImages = 20;
for (let i = 1; i <= numImages; i++) {
    const numberWithZero = i.toString().padStart(2, '0');
    const imageURL = `http://$host:$port/small_light(${dw},${dh},${bw},${bc},${sharpen},${blur})/img/image.jpg${numberWithZero}.jpg`;
    const listItem = document.createElement("li");
    const image = document.createElement("img");
    image.src = imageURL;
    listItem.appendChild(image);
    imageList.appendChild(listItem);
}
