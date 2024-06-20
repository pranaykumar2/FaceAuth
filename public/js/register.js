document.addEventListener('DOMContentLoaded', () => {
  window.onload = function() {
    setTimeout(function() {
      document.getElementById('popup').classList.add('slideIn');
    }, 1000);

    const letsGoButton = document.querySelector('.button button');
    letsGoButton.addEventListener('click', function() {
      document.querySelector('.flip-container').classList.toggle('flipped');
      document.querySelector('.back').style.display = 'flex';
    });

    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const captureBtn = document.getElementById('capture-btn');
    const registerForm = document.getElementById('register-form');
    const imageInput = document.getElementById('image');
    const videoPopup = document.getElementById('video-popup');
    const openVideoBtn = document.getElementById('open-video-btn');
    const closePopupBtn = document.getElementById('save-btn');
    const capturedImage = document.getElementById('captured-image');
    const notification = document.getElementById('notification');

    let stream;

    openVideoBtn.addEventListener('click', (event) => {
      event.preventDefault();
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

    videoPopup.addEventListener('click', (e) => {
      if (e.target === videoPopup || e.target === closePopupBtn) {
        stopVideoStream();
        videoPopup.style.display = 'none';
      }
    });

    captureBtn.addEventListener('click', () => {
      if (captureBtn.textContent === 'Capture') {
        captureImage();
      } else if (captureBtn.textContent === 'Re-capture') {
        enableVideoStream();
      }
    });

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      formData.append('image', imageInput.value);

      try {
        const response = await fetch('/register', {
          method: 'POST',
          body: formData
        });
        if (response.ok) {
          showNotification('Image uploaded successfully');
        } else {
          throw new Error('Failed to upload image');
        }
      } catch (err) {
        console.error(err);
        showNotification('Failed to upload image');
      }
    });

    function captureImage() {
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      imageInput.value = dataUrl;

      const imagePreviewSection = document.getElementById('image-preview-section');
      imagePreviewSection.innerHTML = `<a href="#" id="show-image-link" target="_blank">Show Image</a><img id="preview-image" src="${dataUrl}" alt="Captured Image Preview" style="max-width: 100%; display: none;">`;
      imagePreviewSection.style.display = 'block';

      const showImageLink = document.getElementById('show-image-link');
      const previewImage = document.getElementById('preview-image');
      showImageLink.addEventListener('click', (e) => {
        e.preventDefault();
        previewImage.style.display = previewImage.style.display === 'none' ? 'block' : 'none';
      });

      capturedImage.src = dataUrl;
      capturedImage.style.display = 'block';
      video.style.display = 'none';

      stopVideoStream();
      captureBtn.textContent = 'Re-capture';
    }

    function enableVideoStream() {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(s => {
          stream = s;
          video.srcObject = stream;
          captureBtn.textContent = 'Capture';

          capturedImage.style.display = 'none';
          video.style.display = 'block';
        })
        .catch(err => {
          console.error("Error accessing the camera: " + err);
        });
    }

    function stopVideoStream() {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
      }
    }

    function showNotification(message) {
      notification.innerText = message;
      notification.classList.add('show');
      setTimeout(() => {
        notification.classList.remove('show');
      }, 3000);
    }
  }
});
