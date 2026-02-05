# CSUN Map Quiz

An interactive web-based quiz using the Google Maps JavaScript API that challenges users to locate buildings on the California State University, Northridge (CSUN) campus.

##  Project Overview

This application displays a satellite view of the CSUN campus and prompts the user to double-click on where they believe a specific building is located. The app provides immediate feedback for each guess and tracks the number of correct and incorrect answers, as well as the total time taken.

---

##  Features

- Google Maps (Satellite view) with custom UI
- Interactive double-click guessing system
- Colored rectangle feedback (green = correct, red = incorrect)
- Animated pan-to-feature on incorrect guesses
- Timer that tracks how long the quiz takes
- Local storage high score (best time)
- Restart quiz button after completion
- Responsive layout with split view: map on right, results on left

---

##  Technologies Used

- **HTML/CSS/JavaScript**
- **Google Maps JavaScript API**
  - `geometry` library is used for accurate distance calculations

---

##  How to Run This Project

1. Clone or download the project.
2. Replace the placeholder Google Maps API key in `index.html` with a valid one.

   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=geometry&callback=initMap" async defer></script>
