// 1. Initialize Map
const map = L.map('map').setView([51.505, -0.09], 13); // Default view
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 2. Authentication Mock Logic
let isLoggedIn = false;

function handleLogin() {
    const email = document.getElementById('email').value;
    if(email.includes('@')) {
        isLoggedIn = true;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('user-panel').style.display = 'block';
        document.getElementById('display-name').innerText = email;
        alert("Account Verified. You may now transmit reports.");
    } else {
        alert("Invalid Email Format.");
    }
}

function handleLogout() {
    isLoggedIn = false;
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('user-panel').style.display = 'none';
}

// 3. Reporting Logic
function submitReport() {
    if (!isLoggedIn) {
        alert("ACCESS DENIED: You must log in to submit a report.");
        return;
    }

    const type = document.getElementById('incident-type').value;
    const desc = document.getElementById('incident-desc').value;
    const name = document.getElementById('reporter-name').value || "Anonymous";

    // Create Alert Object
    const newAlert = {
        type: type,
        description: desc,
        reporter: name,
        time: new Date().toLocaleTimeString(),
        // Mocking random location near center for demo
        lat: 51.505 + (Math.random() - 0.5) * 0.05,
        lng: -0.09 + (Math.random() - 0.5) * 0.05
    };

    addAlertToFeed(newAlert);
    addMarkerToMap(newAlert);
    
    // In real app: send via WebSocket here
    // stompClient.send("/app/report", {}, JSON.stringify(newAlert));
}

// 4. Update UI
function addAlertToFeed(alert) {
    const feed = document.getElementById('feed-panel');
    const div = document.createElement('div');
    div.className = 'alert-card';
    div.innerHTML = `
        <span class="alert-type urgent-text">${alert.type}</span> 
        <span>[${alert.time}]</span><br>
        Details: ${alert.description}<br>
        Reporter: ${alert.reporter}
    `;
    feed.prepend(div);
}

function addMarkerToMap(alert) {
    L.marker([alert.lat, alert.lng]).addTo(map)
        .bindPopup(`<b style="color:red">${alert.type}</b><br>${alert.description}`)
        .openPopup();
}
// 3. Alert Logic
function submitAlert() {
    // ... existing login check ...
    if (!isLoggedIn) {
        alert("ACCESS DENIED: You must log in to submit a report.");
        return;
    }

    const type = document.getElementById('type').value;
    const desc = document.getElementById('desc').value;
    const isAnon = document.getElementById('anon').checked;
    const user = isAnon ? "Anonymous" : document.getElementById('username-display').innerText;

    // NEW FIELD CAPTURE
    const phone = document.getElementById('reporter-phone').value;
    const postalCode = document.getElementById('incident-postal-code').value;

    if(!type || !desc || !phone || !postalCode) { // Now phone and postal code are required
        alert("Please fill in all incident fields, phone number, and postal code.");
        return;
    }

    // Generate Random Location near center for demo
    // ... existing location logic ...

    // --- Data to be sent to Backend (via WebSocket) ---
    const alertData = {
        type: type,
        description: desc,
        reporterName: user,
        phoneNumber: phone, // Pass phone number
        postalCode: postalCode, // Pass postal code
        lat: lat,
        lng: lng,
        time: new Date().toLocaleTimeString()
    };
    // --- END Data to be sent to Backend ---

    addAlertToFeed(alertData); // Use the new object
    addMarkerToMap(alertData);
    
    // In real app: send via WebSocket here (Backend expects ReportRequest DTO)
    // stompClient.send("/app/report", {}, JSON.stringify(alertData));
}

// Update the Feed function to show new data
function addAlertToFeed(alert) {
    const feed = document.getElementById('feed');
    const item = document.createElement('div');
    item.className = 'alert-item';
    item.innerHTML = `
        <span class="timestamp">${alert.time}</span> | 
        <b style="color:red">${alert.type}</b> | Reported by: ${alert.reporterName}<br>
        <span style="font-style: italic;">Location ID: ${alert.postalCode}</span><br>
        ${alert.description}
    `;
    feed.prepend(item);
}
