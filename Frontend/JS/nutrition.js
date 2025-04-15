const nutritionResult = document.getElementById('nutritionResult');
const nutritionDetails = document.getElementById('nutritionDetails');
const loading = document.getElementById('loading');
const webcamContainer = document.getElementById('webcamContainer');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const port = 3000;

let stream;

// Analyze Nutrition from Image URL
async function fetchNutrition() {
  const imageUrl = document.getElementById('imageUrl').value.trim();
  clearNutritionResult();

  if (!imageUrl) {
    alert("Please enter an image URL.");
    return;
  }

  showLoading();

  try {
    const response = await fetch(`http://localhost:${port}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl })
    });

    const data = await response.json();
    renderNutrition(data);
  } catch (err) {
    console.error(err);
    alert("Failed to analyze image.");
  } finally {
    hideLoading();
  }
}

// Start Camera
async function startCamera() {
  webcamContainer.style.display = 'block';
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (err) {
    console.error("Camera error:", err);
    alert("Failed to access webcam.");
  }
}

// Capture Image from Video
async function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);

  const base64Image = canvas.toDataURL('image/jpeg'); // Convert to base64
  console.log(`base64 image = ${base64Image}`)

  // Stop video stream
  stream.getTracks().forEach(track => track.stop());
  webcamContainer.style.display = 'none';

  showLoading();

  try {
    const response = await fetch(`http://localhost:${port}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64_image: base64Image })
    });

    const data = await response.json();
    renderNutrition(data);
  } catch (err) {
    console.error(err);
    alert("Failed to analyze webcam image.");
  } finally {
    hideLoading();
  }
}

function renderNutrition(data) {
  if (data.error) {
    alert("Error: " + data.error);
    return;
  }

  const formattedHTML = formatNutritionOutput(data.nutrition);
  nutritionDetails.innerHTML = formattedHTML;
  nutritionResult.style.display = "block";
}

function clearNutritionResult() {
  nutritionResult.style.display = "none";
  nutritionDetails.innerHTML = '';
  loading.style.display = "none";
}

function showLoading() {
  loading.style.display = "block";
}

function hideLoading() {
  loading.style.display = "none";
}

// function formatNutritionOutput(rawText) {
//   let html = rawText
//     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//     .replace(/\* (.*?)\n/g, '<li>$1</li>')
//     .replace(/\n{2,}/g, '</ul><br><ul>')
//     .replace(/\n/g, '<br>');

//   return `
//     <div class="nutrition-card">
//       <h3 class="section-title">🍽️ Nutrition Breakdown</h3>
//       <div class="nutrition-content">
//         <ul>${html}</ul>
//       </div>
//     </div>`;
// }

function formatNutritionOutput(rawText) {
    const html = rawText
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')       // Bold text
      .replace(/\n{2,}/g, '</p><p>')                           // Double line breaks = paragraph
      .replace(/\n/g, '<br>');                                 // Single line break = line break
  
    return `
      <div class="nutrition-card" style="text-align: left; font-family: sans-serif; line-height: 1.6;">
        <h3 class="section-title">🍎 Nutrition Breakdown</h3>
        <div class="nutrition-content">
          <p>${html}</p>
        </div>
      </div>`;
}
  
  

// Navigation
document.getElementById("home").addEventListener("click", () => {
  window.location.href = "../HTML/dash.html";
});