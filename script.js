// City Database with Coordinates & Default PM2.5 baselines
const cities = {
  delhi: { name: "New Delhi", lat: 28.6139, lon: 77.2090, defaultPM: 110, landmark: "indiaGate" },
  lahore: { name: "Lahore", lat: 31.5204, lon: 74.3587, defaultPM: 130, landmark: "badshahiMosque" },
  beijing: { name: "Beijing", lat: 39.9042, lon: 116.4074, defaultPM: 85, landmark: "templeOfHeaven" },
  ulaanbaatar: { name: "Ulaanbaatar", lat: 47.9088, lon: 106.8832, defaultPM: 140, landmark: "yurts" },
  la: { name: "Los Angeles", lat: 34.0522, lon: -118.2437, defaultPM: 35, landmark: "palms" },
  london: { name: "London", lat: 51.5074, lon: -0.1278, defaultPM: 25, landmark: "bigBen" }
};

let currentCityKey = "delhi";
let basePM25 = 110;

// CPCB Sub-Index Calculation for PM2.5
function calculatePM25AQI(pm25) {
  if (pm25 <= 30) return (pm25 * 50) / 30;
  if (pm25 <= 60) return 50 + ((pm25 - 30) * 50) / 30;
  if (pm25 <= 90) return 100 + ((pm25 - 60) * 100) / 30;
  if (pm25 <= 120) return 200 + ((pm25 - 90) * 100) / 30;
  if (pm25 <= 250) return 300 + ((pm25 - 120) * 100) / 130;
  return 400 + ((pm25 - 250) * 100) / 130;
}

// AQI Category helper
function getAQICategory(aqi) {
  if (aqi <= 50) return { label: "Good", color: "#22c55e" };
  if (aqi <= 100) return { label: "Satisfactory", color: "#84cc16" };
  if (aqi <= 200) return { label: "Moderate", color: "#eab308" };
  if (aqi <= 300) return { label: "Poor", color: "#f97316" };
  if (aqi <= 400) return { label: "Very Poor", color: "#ef4444" };
  return { label: "Severe", color: "#7f1d1d" };
}

// Fetch Live Data from Open-Meteo API
async function fetchLiveData() {
  const city = cities[currentCityKey];
  try {
    const res = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.lat}&longitude=${city.lon}&hourly=pm2_5`);
    const data = await res.json();
    if (data.hourly && data.hourly.pm2_5) {
      const liveVal = data.hourly.pm2_5.find(val => val !== null);
      if (liveVal !== undefined) {
        basePM25 = liveVal;
      }
    }
  } catch (err) {
    console.warn("API request failed, using default baseline.");
    basePM25 = city.defaultPM;
  }
  updateSimulation();
}

// Core Simulation Engine
function updateSimulation() {
  const wind = parseFloat(document.getElementById('wind').value);
  const temp = parseFloat(document.getElementById('temp').value);
  const hum = parseFloat(document.getElementById('hum').value);
  const stubble = parseFloat(document.getElementById('stubble').value);
  const traffic = parseFloat(document.getElementById('traffic').value);

  // Update slider label values
  document.getElementById('windVal').innerText = wind;
  document.getElementById('tempVal').innerText = temp;
  document.getElementById('humVal').innerText = hum;
  document.getElementById('stubbleVal').innerText = stubble;
  document.getElementById('trafficVal').innerText = traffic;

  // Environmental Math Factors
  const windFactor = Math.max(0.3, 1.6 - wind * 0.05);
  const tempFactor = temp < 15 ? 1.25 : 0.9; // Winter inversion trap
  const humFactor = 1 + (hum - 50) * 0.003;
  const stubbleContribution = stubble * 0.03;
  const trafficFactor = traffic / 100;

  const estimatedPM25 = (basePM25 * trafficFactor + stubbleContribution) * windFactor * tempFactor * humFactor;
  const predictedAQI = Math.min(500, Math.round(calculatePM25AQI(estimatedPM25)));

  // Display outputs
  document.getElementById('aqiValue').innerText = predictedAQI;
  const category = getAQICategory(predictedAQI);
  const badge = document.getElementById('aqiBadge');
  badge.innerText = category.label;
  badge.style.backgroundColor = category.color;

  // Cigarette equivalence (~22 ug/m3 PM2.5 = 1 cigarette/day)
  const cigs = (estimatedPM25 / 22).toFixed(1);
  document.getElementById('cigCount').innerText = cigs;

  // Health Advice
  const adviceEl = document.getElementById('healthAdvice');
  if (predictedAQI > 300) {
    adviceEl.innerText = "🚨 Hazardous air! Wear an N95 mask outdoors and run indoor air purifiers.";
  } else if (predictedAQI > 200) {
    adviceEl.innerText = "⚠️ Unhealthy air. Avoid outdoor strenuous exercises and sensitive group exposure.";
  } else {
    adviceEl.innerText = "✅ Air quality is acceptable for normal outdoor activities.";
  }

  // Draw Smog Canvas with Landmark
  drawCanvas(predictedAQI);
}

// Canvas Landmark & Smog Renderer
const canvas = document.getElementById('smogCanvas');
const ctx = canvas.getContext('2d');

function drawCanvas(aqi) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Sky Background Gradient
  let skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGrad.addColorStop(0, "#0284c7");
  skyGrad.addColorStop(1, "#38bdf8");
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Draw Landmark Silhouette based on active city
  ctx.fillStyle = "#1e293b";
  const landmarkType = cities[currentCityKey].landmark;

  if (landmarkType === "indiaGate") {
    // India Gate (Delhi)
    ctx.fillRect(210, 110, 80, 150);
    ctx.fillRect(190, 130, 120, 20);
    ctx.fillRect(225, 160, 50, 100);
  } else if (landmarkType === "badshahiMosque") {
    // Badshahi Mosque Domes / Minarets (Lahore)
    ctx.fillRect(170, 140, 15, 120);
    ctx.fillRect(315, 140, 15, 120);
    ctx.fillRect(200, 170, 100, 90);
    ctx.beginPath();
    ctx.arc(250, 170, 35, Math.PI, 0, false);
    ctx.fill();
  } else if (landmarkType === "bigBen") {
    // Big Ben / Elizabeth Tower (London)
    ctx.fillRect(220, 90, 60, 170);
    ctx.beginPath();
    ctx.moveTo(215, 90);
    ctx.lineTo(250, 50);
    ctx.lineTo(285, 90);
    ctx.fill();
  } else {
    // Generic Skyline / Default
    ctx.fillRect(160, 150, 40, 110);
    ctx.fillRect(215, 110, 70, 150);
    ctx.fillRect(300, 130, 45, 130);
  }

  // 3. Dynamic Smog & Haze Overlay
  const fogOpacity = Math.min(0.92, aqi / 500);
  ctx.fillStyle = `rgba(148, 163, 184, ${fogOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Event Listeners
document.getElementById('citySelect').addEventListener('change', (e) => {
  currentCityKey = e.target.value;
  basePM25 = cities[currentCityKey].defaultPM;
  fetchLiveData();
});

document.querySelectorAll('input[type="range"]').forEach(input => {
  input.addEventListener('input', updateSimulation);
});

document.getElementById('fetchLiveBtn').addEventListener('click', fetchLiveData);

// Initial Load
fetchLiveData();