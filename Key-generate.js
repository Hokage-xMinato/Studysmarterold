let adVerified = localStorage.getItem('adVerified');
let lastWatched = localStorage.getItem('adWatchedTime');

// Check if not verified or time expired
if (!adVerified || !lastWatched || (Date.now() - lastWatched) > (24 * 60 * 60 * 1000)) {
  alert("Access denied! Please watch the ad first through the shortener link.");
    window.location.href = "https://lksfy.com/generate-key";
}
   else {
        // Allow access to content
        document.getElementById('content').style.display = "block";
   }
