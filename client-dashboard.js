// client-dashboard.js

let map;
let clientLocation = null;

// Mock data for all types of service providers
const providers = [
  // Plumbing
  { id: 1, name: "Rajesh Kumar", service: "Plumbing", price: 350, lat: 18.5895, lng: 74.0012 },
  { id: 2, name: "Amit Verma", service: "Plumbing", price: 420, lat: 18.5908, lng: 73.9975 },
  { id: 3, name: "Suresh Patil", service: "Plumbing", price: 300, lat: 18.5869, lng: 73.9987 },
  { id: 4, name: "Anil Deshmukh", service: "Plumbing", price: 500, lat: 18.5845, lng: 73.9969 },

  // AC Repair
  { id: 5, name: "Vikas Sharma", service: "AC Repair", price: 650, lat: 18.5891, lng: 74.0001 },
  { id: 6, name: "Manish Jadhav", service: "AC Repair", price: 700, lat: 18.5902, lng: 73.9985 },
  { id: 7, name: "Omkar Gaikwad", service: "AC Repair", price: 580, lat: 18.5877, lng: 73.9972 },
  { id: 8, name: "Karan Thakur", service: "AC Repair", price: 720, lat: 18.5839, lng: 74.0023 },

  // Electrical
  { id: 9, name: "Rohit Pawar", service: "Electrical Maintenance", price: 400, lat: 18.5856, lng: 73.9998 },
  { id: 10, name: "Nilesh Kadam", service: "Electrical Maintenance", price: 450, lat: 18.5915, lng: 73.9965 },
  { id: 11, name: "Ajay Bhosale", service: "Electrical Maintenance", price: 380, lat: 18.5881, lng: 74.0018 },
  { id: 12, name: "Vivek Salunkhe", service: "Electrical Maintenance", price: 470, lat: 18.5847, lng: 73.9954 },

  // Cleaning
  { id: 13, name: "Sunita Joshi", service: "Cleaning", price: 250, lat: 18.5892, lng: 73.9981 },
  { id: 14, name: "Meena Chavan", service: "Cleaning", price: 300, lat: 18.5875, lng: 73.9993 },
  { id: 15, name: "Ramesh Shinde", service: "Cleaning", price: 280, lat: 18.5862, lng: 74.0005 },
  { id: 16, name: "Priya Deshmukh", service: "Cleaning", price: 320, lat: 18.5836, lng: 73.9971 }
];

// Show tab
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
  document.getElementById(tabId).classList.remove('hidden');
}

// Logout
function logout() {
  alert('Logged out successfully!');
  window.location.href = 'login.html';
}
const matchingProviders = providers
  .filter(p => p.service.toLowerCase() === serviceType.toLowerCase())
  .map(p => ({
    ...p,
    distance: getDistance(clientLocation.lat, clientLocation.lng, p.lat, p.lng)
  }))
  .sort((a, b) => a.price - b.price);

// Submit request and find providers
function submitRequest() {
  const serviceType = document.getElementById('serviceType').value;
  const urgency = document.getElementById('urgency').value;
  const address = document.getElementById('address').value;

  if (!serviceType || !urgency || !address) {
    alert('Please fill all fields.');
    return;
  }

  alert('Finding nearby service providers...');

  // Get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      clientLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      showNearbyProviders(serviceType);
    }, () => {
      alert('Unable to get your location. Please enable GPS.');
    });
  } else {
    alert('Geolocation not supported by this browser.');
  }
}

// Display providers sorted by price and distance
function showNearbyProviders(serviceType) {
  showTab('myRequests');
  document.getElementById('noRequests').classList.add('hidden');

  const listContainer = document.getElementById('requestList');
  listContainer.innerHTML = `
    <h2 class="text-xl md:text-2xl font-bold text-blue-600 mb-3">
      Nearby ${serviceType} Providers
    </h2>
  `;

  // Filter providers based on the selected service
  const matchingProviders = providers
    .filter(p => p.service.toLowerCase() === serviceType.toLowerCase())
    .map(p => ({
      ...p,
      distance: getDistance(clientLocation.lat, clientLocation.lng, p.lat, p.lng)
    }))
    .sort((a, b) => a.price - b.price);

  if (matchingProviders.length === 0) {
    listContainer.innerHTML += `
      <div class="bg-white p-6 rounded-xl shadow-md text-center text-gray-600">
        No nearby providers available for this service.
      </div>
    `;
    return;
  }

  // Create provider cards
  matchingProviders.forEach(p => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition';
    card.innerHTML = `
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold">${p.name}</h3>
          <p class="text-gray-700">💰 ₹${p.price}</p>
          <p class="text-gray-700">📍 ${(p.distance).toFixed(2)} km away</p>
        </div>
        <button onclick="bookProvider(${p.id})" class="mt-3 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Book
        </button>
      </div>
    `;
    listContainer.appendChild(card);
  });

  showMap(clientLocation.lat, clientLocation.lng, matchingProviders);
}

// Initialize and show map
function showMap(lat, lng, providerList) {
  const mapContainer = document.getElementById('mapContainer');
  mapContainer.classList.remove('hidden');
  mapContainer.innerHTML = ''; // reset previous map

  map = L.map('mapContainer').setView([lat, lng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Client marker
  L.marker([lat, lng]).addTo(map).bindPopup('📍 You are here').openPopup();

  // Provider markers
  providerList.forEach(p => {
    L.marker([p.lat, p.lng]).addTo(map)
      .bindPopup(`<b>${p.name}</b><br>${p.service}<br>₹${p.price}<br>${(p.distance).toFixed(2)} km away`);
  });
}

// Book selected provider
function bookProvider(providerId) {
  const provider = providers.find(p => p.id === providerId);
  alert(`✅ You booked ${provider.name} for ₹${provider.price}. They will arrive soon!`);

  document.getElementById('requestList').innerHTML = `
    <div class="bg-white p-6 rounded-xl shadow-md text-center">
      <h2 class="text-xl font-bold text-green-600">Service Confirmed!</h2>
      <p>Your provider <span class="font-semibold">${provider.name}</span> is on the way.</p>
      <p class="text-gray-700 mt-2">Price: ₹${provider.price}</p>
      <p class="text-gray-600 mt-1">Estimated arrival: ${Math.floor(Math.random() * 10) + 5} mins</p>
    </div>
  `;
}

// Calculate distance using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Initialize
showTab('requestForm');
