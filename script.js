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
  

  // Import thư viện ffmpeg.js
importScripts('https://cdnjs.cloudflare.com/ajax/libs/ffmpeg.js/1.8.0/ffmpeg.min.js');

// Hàm chuyển đổi video sang ảnh
async function convertVideoToImage(videoFile, outputTime, callback) {
  // Tạo đối tượng FFmpeg
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({ log: true });

  try {
    // Khởi tạo FFmpeg
    await ffmpeg.load();

    // Đọc file video
    ffmpeg.FS('readFile', videoFile.name);

    // Chuyển video thành ảnh
    await ffmpeg.run('-i', videoFile.name, '-ss', outputTime, '-frames', '1', 'output.jpg');

    // Đọc file ảnh
    const data = ffmpeg.FS('readFile', 'output.jpg');

    // Gọi callback và truyền data ảnh
    callback(data.buffer);
  } catch (error) {
    console.error(error);
  } finally {
    // Xóa file tạm
    ffmpeg.FS('unlink', videoFile.name);
    ffmpeg.FS('unlink', 'output.jpg');
  }
}

// Sử dụng hàm convertVideoToImage
const videoFile = /* Lấy đối tượng File của video */;
const outputTime = '00:01';
convertVideoToImage(videoFile, outputTime, (imageData) => {
  // imageData chứa dữ liệu ảnh đã chụp từ video
  // Thực hiện các xử lý tiếp theo với imageData
});
