let map;
let currentIndex = 0;        // Current building index in the quiz
let correctCount = 0;        // Tracks correct answers
let startTime;               // Time when quiz started
let target;                  // The current target location to guess

// Coordinates for CSUN campus buildings
const quizLocations = [
  { name: "Oviatt Library", lat: 34.2400, lng: -118.5290 },
  { name: "The Soraya", lat: 34.2374, lng: -118.5305 },
  { name: "SRC", lat: 34.24085, lng: -118.52492 },
  { name: "Bookstore", lat: 34.2387, lng: -118.5282 },
  { name: "Bayramian Hall", lat: 34.2402, lng: -118.5296 }
];

// Called automatically by Google Maps API on load
window.initMap = function () {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.239, lng: -118.528 }, // Wide view of campus
    zoom: 17,                                // Zoomed out slightly to view full layout
    mapTypeId: "satellite",
    disableDefaultUI: true,
    draggable: false,
    scrollwheel: false,
    disableDoubleClickZoom: true
  });

  startTime = Date.now(); // Start timer
  setNextTarget();        // Start quiz

  // Register double-click event for guessing locations
  map.addListener("dblclick", function (e) {
    handleGuess(e.latLng);
  });
};

// Move to the next building or show results
function setNextTarget() {
  if (currentIndex >= quizLocations.length) {
    endGame();
    return;
  }

  target = quizLocations[currentIndex];
  addStatusEntry(`Where is ${target.name}?`, "prompt");
}

// Evaluate user's guess
function handleGuess(guessLatLng) {
  const distance = google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(target.lat, target.lng),
    guessLatLng
  );

  const isCorrect = distance < 150; // Threshold in meters
  const color = isCorrect ? "green" : "red";
  const delta = 0.0003; // Area size for rectangle feedback

  const bounds = {
    north: guessLatLng.lat() + delta,
    south: guessLatLng.lat() - delta,
    east: guessLatLng.lng() + delta,
    west: guessLatLng.lng() - delta
  };

  // Draw rectangle on guessed location
  new google.maps.Rectangle({
    strokeColor: color,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: color,
    fillOpacity: 0.35,
    map,
    bounds: bounds
  });

  // Smooth pan to actual target location for feedback
  map.panTo(new google.maps.LatLng(target.lat, target.lng));

  if (isCorrect) {
    correctCount++;
    addStatusEntry("Your answer is correct!!", "correct");
  } else {
    addStatusEntry("Sorry, wrong location.", "incorrect");
  }

  currentIndex++;
  setTimeout(setNextTarget, 1500); // Delay before next prompt
}

// Show feedback text in the sidebar
function addStatusEntry(text, type) {
  const log = document.getElementById("status-log");
  const entry = document.createElement("div");
  entry.className = `status-entry ${type}`;
  entry.textContent = text;
  log.appendChild(entry);
}

// Called when the quiz ends
function endGame() {
  const total = quizLocations.length;
  const incorrect = total - correctCount;
  const timeTaken = Math.floor((Date.now() - startTime) / 1000);
  const resultText = `${correctCount} Correct, ${incorrect} Incorrect\nTime: ${timeTaken} seconds`;

  const final = document.createElement("div");
  final.className = "final-score";
  final.innerText = resultText;
  document.getElementById("status-log").appendChild(final);

  // Store best time in local storage
  const bestTime = localStorage.getItem("bestTime");
  if (!bestTime || timeTaken < bestTime) {
    localStorage.setItem("bestTime", timeTaken);
  }

  const highScore = document.createElement("div");
  highScore.className = "final-score";
  highScore.innerText = `Best Time: ${localStorage.getItem("bestTime")} seconds`;
  document.getElementById("status-log").appendChild(highScore);

  // Add restart button
  const restart = document.createElement("button");
  restart.innerText = "Restart Quiz";
  restart.onclick = () => location.reload();
  document.getElementById("status-log").appendChild(restart);
}
