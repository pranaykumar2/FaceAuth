document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('capture-btn');
  const registerForm = document.getElementById('register-form');
  const imageInput = document.getElementById('image');
  const videoPopup = document.getElementById('video-popup');
  const openVideoBtn = document.getElementById('open-video-btn');
  const closePopupBtn = document.getElementById('close-popup');
  const capturedImage = document.getElementById('captured-image');

  let stream;

  // Open camera when the button is clicked
  openVideoBtn.addEventListener('click', () => {
    videoPopup.style.display = 'flex';
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        stream = s;
        video.srcObject = stream;
        video.style.display = 'block';
        capturedImage.style.display = 'none';
      })
      .catch(err => {
        console.error("Error accessing the camera: " + err);
      });
  });

  // Close the video popup when clicking outside of the popup content
  videoPopup.addEventListener('click', (e) => {
    if (e.target === videoPopup) {
      stopVideoStream();
      videoPopup.style.display = 'none';
    }
  });

  // Capture or recapture the image
  captureBtn.addEventListener('click', () => {
    if (captureBtn.textContent === 'Capture') {
      captureImage();
    } else if (captureBtn.textContent === 'Re-capture') {
      enableVideoStream();
    }
  });

  // Capture the image from the video stream
  function captureImage() {
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    imageInput.value = dataUrl;

    // Display the captured image
    capturedImage.src = dataUrl;
    capturedImage.style.display = 'block';
    video.style.display = 'none';

    stopVideoStream();
    captureBtn.textContent = 'Re-capture';
  }

  // Enable video stream for re-capture
  function enableVideoStream() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(s => {
        stream = s;
        video.srcObject = stream;
        captureBtn.textContent = 'Capture';

        // Hide the captured image
        capturedImage.style.display = 'none';
        video.style.display = 'block';
      })
      .catch(err => {
        console.error("Error accessing the camera: " + err);
      });
  }

  // Stop the video stream
  function stopVideoStream() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      video.srcObject = null;
    }
  }
});
