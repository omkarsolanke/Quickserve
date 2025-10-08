let isOnline = false;
let countdown;
let services = []; // Store added services

// ------------------- ONLINE/OFFLINE -------------------
function toggleStatus() {
    const btn = document.getElementById("statusBtn") || document.getElementById("statusBtnAccount");
    const indicator = document.getElementById("statusIndicator") || document.getElementById("statusIndicatorAccount");

    // Check if at least one service is added
    if (!services.length) {
        alert("Add at least one service before going online!");
        showTab('account');
        const serviceFormContainer = document.getElementById("serviceFormContainer");
        if (serviceFormContainer) serviceFormContainer.classList.remove("hidden");
        return;
    }

    isOnline = !isOnline;

    if (isOnline) {
        btn.textContent = "Go Offline";
        btn.classList.replace("bg-green-600", "bg-gray-400");
        indicator.textContent = "Online";
        indicator.classList.replace("text-red-500", "text-green-500");

        showTab('jobs');
        startSearching();
    } else {
        btn.textContent = "Go Online";
        btn.classList.replace("bg-gray-400", "bg-green-600");
        indicator.textContent = "Offline";
        indicator.classList.replace("text-green-500", "text-red-500");

        clearInterval(countdown);
        document.getElementById("searching").classList.add("hidden");
        document.getElementById("notification").classList.add("hidden");
        document.getElementById("jobDetails").classList.add("hidden");

        // Ensure Account tab and services are visible
        showTab('account');
        renderServices();
    }
}

// ------------------- TAB NAVIGATION -------------------
function showTab(tab) {
    document.querySelectorAll('.tab-content').forEach(div => div.classList.add('hidden'));
    document.getElementById(tab).classList.remove('hidden');
}

// ------------------- JOB HANDLERS -------------------
function acceptJob() {
    document.getElementById("notification").classList.add("hidden");
    document.getElementById("jobDetails").classList.remove("hidden");
    loadMap();
}

function rejectJob() {
    alert("Job Rejected ❌");
    document.getElementById("notification").classList.add("hidden");
    if (isOnline) startSearching();
}

function completeJob() {
    alert("Job Completed ✅");
    document.getElementById("jobDetails").classList.add("hidden");
    if (isOnline) startSearching();
}

// ------------------- SEARCHING -------------------
function startSearching() {
    if (!isOnline) return;
    const searchingDiv = document.getElementById("searching");
    const timer = document.getElementById("timer");
    let timeLeft = 5; // Demo seconds
    searchingDiv.classList.remove("hidden");
    timer.textContent = timeLeft + "s";

    countdown = setInterval(() => {
        if (!isOnline) {
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

// ------------------- NEW JOB REQUEST -------------------
function showNewRequest() {
    if (!isOnline) return;
    const notif = document.getElementById("notification");

    const job = {
        service: "Locksmith",
        location: "Morning Mist Society",
        urgency: "Within 1 Hour",
        earning: 800,
        tip: 50
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

// ------------------- MAP -------------------
function loadMap() {
    const clientLat = 18.588967594660854;
    const clientLng = 73.99971601087367;
    const map = L.map("map").setView([clientLat, clientLng], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([clientLat, clientLng]).addTo(map)
        .bindPopup("Client Location: Morning Mist Society")
        .openPopup();
}

// ------------------- LOGOUT -------------------
function logout() {
    isOnline = false;
    clearInterval(countdown);
    document.getElementById("searching").classList.add("hidden");
    document.getElementById("notification").classList.add("hidden");
    document.getElementById("jobDetails").classList.add("hidden");

    alert("You have been logged out.");
    window.location.href = "index.html";
}

// ------------------- SERVICE MANAGEMENT -------------------
const addServiceBtn = document.getElementById("addServiceBtn");
const serviceFormContainer = document.getElementById("serviceFormContainer");

if (addServiceBtn) {
    addServiceBtn.addEventListener("click", () => {
        serviceFormContainer.classList.toggle("hidden");
    });
}

function addService() {
    const name = document.getElementById("serviceName").value.trim();
    const desc = document.getElementById("serviceDesc").value.trim();
    const price = parseFloat(document.getElementById("servicePrice").value.trim());

    if (!name || !desc || isNaN(price)) {
        alert("Please fill all service fields correctly.");
        return;
    }

    const service = { id: Date.now(), name, desc, price };
    services.push(service);
    renderServices();

    document.getElementById("serviceName").value = "";
    document.getElementById("serviceDesc").value = "";
    document.getElementById("servicePrice").value = "";
    serviceFormContainer.classList.add("hidden");
}

function renderServices() {
    const list = document.getElementById("serviceList");
    list.innerHTML = "";

    if (!services.length) {
        list.innerHTML = `<p class="text-gray-600" id="noServices">No services added yet.</p>`;
        return;
    }

    services.forEach(s => {
        const card = document.createElement("div");
        card.className = "bg-white p-4 rounded-xl shadow-md flex justify-between items-center";
        card.innerHTML = `
            <div>
                <h3 class="font-bold text-lg">${s.name} - ₹${s.price}</h3>
                <p class="text-gray-700">${s.desc}</p>
            </div>
            <button onclick="deleteService(${s.id})" class="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700">Delete</button>
        `;
        list.appendChild(card);
    });
}

function deleteService(id) {
    services = services.filter(s => s.id !== id);
    renderServices();
}

// ------------------- INITIAL RENDER -------------------
renderServices();
