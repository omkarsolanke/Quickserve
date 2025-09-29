// client-dashboard.js

let requests = [];
let activeRequest = null;

function showTab(tabId) {
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

// Logout function
function logout() {
  alert('Logged out successfully!');
  window.location.href = 'login.html';
}

// Submit a new request
function submitRequest() {
  const serviceType = document.getElementById('serviceType').value;
  const urgency = document.getElementById('urgency').value;
  const address = document.getElementById('address').value;

  if(!serviceType || !urgency || !address) {
    alert('Please fill all fields.');
    return;
  }

  const newRequest = {
    id: Date.now(),
    service: serviceType,
    urgency: urgency,
    address: address,
    status: 'Searching for provider...',
    provider: null
  };

  requests.push(newRequest);
  activeRequest = newRequest;

  alert('Request submitted! Searching for a nearby provider...');
  showTab('myRequests');
  updateRequestList();

  // Simulate provider acceptance after 5-10 seconds
  setTimeout(() => {
    acceptRequest(newRequest.id);
  }, Math.random() * 5000 + 5000);
}

// Simulate provider accepting the request
function acceptRequest(requestId) {
  const request = requests.find(r => r.id === requestId);
  if(!request) return;

  request.status = 'Accepted';
  request.provider = {
    name: 'Rajesh Kumar',
    contact: '+91 98765 43210',
    lat: 18.588967,
    lng: 73.999716
  };

  alert(`Your request for ${request.service} has been accepted by ${request.provider.name}!`);
  updateRequestList();
  showProviderOnMap(request.provider);
}

// Update request list UI
function updateRequestList() {
  const list = document.getElementById('requestList');
  list.innerHTML = '';

  if(requests.length === 0) {
    document.getElementById('noRequests').classList.remove('hidden');
    return;
  } else {
    document.getElementById('noRequests').classList.add('hidden');
  }

  requests.forEach(r => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 md:p-6 rounded-xl shadow-md';

    card.innerHTML = `
      <h3 class="font-bold text-blue-600 text-lg md:text-xl">${r.service} (${r.urgency})</h3>
      <p class="text-gray-700"><span class="font-medium">Address:</span> ${r.address}</p>
      <p class="text-gray-700"><span class="font-medium">Status:</span> ${r.status}</p>
      ${r.provider ? `<p class="text-gray-700"><span class="font-medium">Provider:</span> ${r.provider.name} (${r.provider.contact})</p>` : ''}
    `;

    list.appendChild(card);
  });
}

// Show provider on map
function showProviderOnMap(provider) {
  const mapContainer = document.getElementById('mapContainer');
  mapContainer.classList.remove('hidden');
  mapContainer.innerHTML = ''; // clear previous map

  const map = L.map('mapContainer').setView([provider.lat, provider.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([provider.lat, provider.lng]).addTo(map)
    .bindPopup(`<b>${provider.name}</b><br>${provider.contact}`)
    .openPopup();
}

// Initialize default tab
showTab('requestForm');
