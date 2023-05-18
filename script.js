document.addEventListener('DOMContentLoaded', () => {
    const videoInput = document.getElementById('videoInput');
    const framesPerSecond = document.getElementById('framesPerSecond');
    const convertBtn = document.getElementById('convertBtn');
    const outputContainer = document.getElementById('outputContainer');
  
    convertBtn.addEventListener('click', () => {
      const file = videoInput.files[0];
      const fps = parseInt(framesPerSecond.value);
  
      if (!file || isNaN(fps)) {
        alert('Please select a video file and enter a valid frames per second value.');
        return;
      }
  
      const videoURL = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = videoURL;
      video.style.display = 'none';
  
      video.onloadedmetadata = () => {
        const duration = video.duration;
        const totalFrames = Math.floor(duration * fps);
        const frameTime = 1 / fps;
  
        outputContainer.innerHTML = ''; // Clear previous output
  
        for (let i = 1; i <= totalFrames; i++) {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, (i - 1) * frameTime, 0, frameTime, video.videoHeight, 0, 0, canvas.width, canvas.height);
  
          const img = document.createElement('img');
          img.src = canvas.toDataURL();
          outputContainer.appendChild(img);
        }
  
        video.remove(); // Clean up
      };
    });
  });
  