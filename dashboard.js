// dashboard.js

let isOnline = false;
let countdown;

// Toggle Online/Offline status
function toggleStatus() {
    const btn = document.getElementById("statusBtn") || document.getElementById("statusBtnAccount");
    const indicator = document.getElementById("statusIndicator");

    isOnline = !isOnline;

    if (isOnline) {
        btn.textContent = "Go Offline";
        btn.classList.remove("bg-green-600");
        btn.classList.add("bg-gray-400");
        indicator.textContent = "Online";
        indicator.classList.remove("text-red-500");
        indicator.classList.add("text-green-500");

        alert("You are now ONLINE ✅. Searching for nearby requests will start.");

        // Switch to Jobs tab automatically
        showTab('jobs');
        startSearching();
    } else {
        btn.textContent = "Go Online";
        btn.classList.remove("bg-gray-400");
        btn.classList.add("bg-green-600");
        indicator.textContent = "Offline";
        indicator.classList.remove("text-green-500");
        indicator.classList.add("text-red-500");

        alert("You are now OFFLINE ❌. Requests will be paused.");

        // Stop ongoing search and hide notifications
        clearInterval(countdown);
        document.getElementById("searching").classList.add("hidden");
        document.getElementById("notification").classList.add("hidden");
        document.getElementById("jobDetails").classList.add("hidden");

        // Return to Account tab
        showTab('account');
    }
}


// Tab navigation
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
}

// Accept job
function acceptJob() {
    document.getElementById("notification").classList.add("hidden");
    document.getElementById("jobDetails").classList.remove("hidden");
    loadMap();
}

// Reject job
function rejectJob() {
    alert("Job Rejected ❌");
    document.getElementById("notification").classList.add("hidden");
}

// Complete job
function completeJob() {
    alert("Job Completed ✅");
    document.getElementById("jobDetails").classList.add("hidden");
    if (isOnline) startSearching();
}

// Start 30-second search for next request
function startSearching() {
    if (!isOnline) return; // Do nothing if offline
    const searchingDiv = document.getElementById("searching");
    const timer = document.getElementById("timer");
    let timeLeft = 5;
    searchingDiv.classList.remove("hidden");
    timer.textContent = timeLeft + "s";

    countdown = setInterval(() => {
        if (!isOnline) { // Stop if went offline
            clearInterval(countdown);
            searchingDiv.classList.add("hidden");
            return;
        }
        timeLeft--;
        timer.textContent = timeLeft + "s";
        if (timeLeft <= 0) {
            clearInterval(countdown);
            searchingDiv.classList.add("hidden");
            showNewRequest();
        }
    }, 1000);
}

// Show new incoming request
function showNewRequest() {
    if (!isOnline) return; // Do not show request if offline
    const notif = document.getElementById("notification");
    notif.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Incoming Job Request 🚨</h2>
        <p class="text-gray-700"><span class="font-medium">Service:</span> Plumbing</p>
        <p class="text-gray-700"><span class="font-medium">Location:</span> Downtown</p>
        <p class="text-gray-700"><span class="font-medium\">Urgency:</span> Within 24 Hours</p>
        <div class="flex gap-4 mt-4">
            <button onclick="acceptJob()" class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Accept</button>
            <button onclick="rejectJob()" class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Reject</button>
        </div>
    `;
    notif.classList.remove("hidden");
}

// Load map with client location
// Load map with client location
function loadMap() {
    // Use the coordinates from your iframe
    const clientLat = 18.588967594660854; // Latitude
    const clientLng = 73.99971601087367;  // Longitude
    const map = L.map("map").setView([clientLat, clientLng], 16); // zoom level 16

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at client location
    L.marker([clientLat, clientLng]).addTo(map)
        .bindPopup("Client Location: Morning Mist Society")
        .openPopup();
}

function showNewRequest() {
    if (!isOnline) return; // Do not show request if offline
    const notif = document.getElementById("notification");

    // Example job data
    const job = {
        service: "Locksmith",
        location: "Morning Mist Society",
        urgency: "Within 1 Hours",
        earning: 400, // ₹800 for this job
        tip: 50       // Optional tip
    };

    notif.innerHTML = `
        <h2 class="text-xl font-bold mb-2">Incoming Job Request 🚨</h2>
        <p class="text-gray-700"><span class="font-medium">Service:</span> ${job.service}</p>
        <p class="text-gray-700"><span class="font-medium">Location:</span> ${job.location}</p>
        <p class="text-gray-700"><span class="font-medium">Urgency:</span> ${job.urgency}</p>
        <p class="text-gray-700"><span class="font-medium">Expected Earning:</span> ₹${job.earning} + Tip ₹${job.tip}</p>
        <div class="flex gap-4 mt-4">
            <button onclick="acceptJob()" class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">Accept</button>
            <button onclick="rejectJob()" class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Reject</button>
        </div>
    `;
    notif.classList.remove("hidden");
}
// Reject job
function rejectJob() {
    alert("Job Rejected ❌");
    document.getElementById("notification").classList.add("hidden");

    // Start the search countdown again if provider is online
    if (isOnline) startSearching();
}
function logout() {
    // Reset online status
    isOnline = false;
    const btn = document.getElementById("statusBtn");
    const indicator = document.getElementById("statusIndicator");

    btn.textContent = "Go Online";
    btn.classList.remove("bg-green-600");
    btn.classList.add("bg-gray-400");
    indicator.textContent = "Offline";
    indicator.classList.remove("text-green-500");
    indicator.classList.add("text-red-500");

    // Stop countdown/searching
    clearInterval(countdown);
    document.getElementById("searching").classList.add("hidden");
    document.getElementById("notification").classList.add("hidden");
    document.getElementById("jobDetails").classList.add("hidden");

    // Redirect to login page
    alert("You have been logged out.");
    window.location.href = "index.html"; // change to your login page
}
