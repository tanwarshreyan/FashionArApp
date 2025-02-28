document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    const clothing = document.getElementById("clothing");

    // Google Drive Model Links
    const models = [
        "https://drive.google.com/uc?export=download&id=11OYMXG1lHVcM-H99Dl3w0qkQdlLnB3YU", // Shirt
        "https://drive.google.com/uc?export=download&id=1e379BzIuU5AL7rKUe1li-ZOdAe3RW6kU", // Hoodie
        "https://drive.google.com/uc?export=download&id=1aL1v11AiAgUKCavyJuMzUSYJXKFyiXFD"  // Skirt
    ];

    let currentModelIndex = 0;

    function loadModel(index) {
        clothing.setAttribute("gltf-model", models[index]);
    }

    function startVideo() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                video.srcObject = stream;
            })
            .catch((err) => console.error("Camera Access Denied", err));
    }

    startVideo();
    loadModel(currentModelIndex);

    // Gesture Recognition
    handTrack.load().then(model => {
        setInterval(() => {
            model.detect(video).then(predictions => {
                predictions.forEach(prediction => {
                    if (prediction.label === "open") {
                        currentModelIndex = (currentModelIndex + 1) % models.length;
                        loadModel(currentModelIndex);
                    }
                });
            });
        }, 1000);
    });

    // Swipe Gesture to Change Clothes
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });

    document.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].screenX;
        if (touchEndX < touchStartX - 50) {
            currentModelIndex = (currentModelIndex + 1) % models.length;
            loadModel(currentModelIndex);
        }
    });

    // Space Key to Change Clothes (For Testing)
    document.addEventListener("keydown", (event) => {
        if (event.key === " ") {
            currentModelIndex = (currentModelIndex + 1) % models.length;
            loadModel(currentModelIndex);
        }
    });
});
