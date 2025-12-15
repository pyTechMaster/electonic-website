// SHARED FUNCTIONS FOR BOTH MODES

// Show/hide auto-filled badges
function hideAutoBadges() {
    document.querySelectorAll('.auto-filled-badge').forEach(badge => badge.style.display = 'none');
}

function showAutoBadge(badgeId) {
    const badge = document.getElementById(badgeId);
    if (badge) badge.style.display = 'inline-block';
}

// Processing overlay functions
function showProcessing(title, message) {
    const overlay = document.getElementById('processingOverlay');
    if (overlay) {
        document.getElementById('processingTitle').textContent = title;
        document.getElementById('processingMessage').textContent = message;
        overlay.classList.add('active');
    }
}

function hideProcessing() {
    const overlay = document.getElementById('processingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Get current time-based values
function getCurrentTimeValues() {
    const now = new Date();
    const hour = now.getHours();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    
    let timeOfDay = 'Morning';
    if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
    else if (hour >= 17 && hour < 21) timeOfDay = 'Evening';
    else if (hour >= 21 || hour < 6) timeOfDay = 'Night';
    
    let lightCondition = 'Daylight';
    if (hour >= 6 && hour <= 18) {
        lightCondition = 'Daylight';
    } else {
        lightCondition = 'Night_with_lights';
    }
    
    return {
        timeOfDay,
        isWeekend,
        lightCondition
    };
}

// Get current location using browser geolocation
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
        };

        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
                    const data = await response.json();
                    
                    const address = data.address || {};
                    let areaType = 'Suburban';
                    
                    if (address.city || address.town) {
                        areaType = 'Urban';
                    } else if (address.village || address.hamlet) {
                        areaType = 'Rural';
                    }
                    
                    resolve({
                        location: data.display_name,
                        areaType: areaType,
                        lat: lat,
                        lon: lon,
                        address: address
                    });
                } catch (error) {
                    resolve({
                        location: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
                        areaType: 'Urban',
                        lat: lat,
                        lon: lon
                    });
                }
            },
            function(error) {
                reject(error);
            },
            options
        );
    });
}

// Format form data for submission
function formatFormData(formElement, mode = 'manual') {
    const formData = new FormData(formElement);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Convert numeric fields
    data.driver_age = parseInt(data.driver_age) || 30;
    data.experience = parseInt(data.experience) || 5;
    data.speed_limit = parseInt(data.speed_limit) || 60;
    data.current_speed = parseInt(data.current_speed) || 50;
    data.accident_history = parseInt(data.accident_history) || 0;
    data.is_weekend = data.is_weekend === 'true';
    
    // Add mode
    data.mode = mode;
    
    return data;
}

// Submit prediction to backend
async function submitPrediction(data) {
    try {
        const response = await fetch('/api/predict_comprehensive', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('prediction_result', JSON.stringify(result));
            window.location.href = '/results';
        } else {
            throw new Error(result.error || 'Prediction failed');
        }
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    }
}

// Show location success message
function showLocationSuccess(location, accuracy) {
    const container = document.querySelector('.location-input-group');
    if (!container) return;
    
    const existingMsg = container.querySelector('.location-success-msg, .location-error-msg');
    if (existingMsg) existingMsg.remove();
    
    const successMsg = document.createElement('div');
    successMsg.className = 'location-success-msg';
    successMsg.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show mt-2" role="alert">
            <i class="fas fa-map-marker-alt text-success"></i>
            <strong>Location Detected!</strong> ${location}
            ${accuracy ? `<small class="d-block text-muted">Accuracy: ~${accuracy}m</small>` : ''}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    container.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 8000);
}

// Show location error message
function showLocationError(message) {
    const container = document.querySelector('.location-input-group');
    if (!container) return;
    
    const existingMsg = container.querySelector('.location-success-msg, .location-error-msg');
    if (existingMsg) existingMsg.remove();
    
    const errorMsg = document.createElement('div');
    errorMsg.className = 'location-error-msg';
    errorMsg.innerHTML = `
        <div class="alert alert-warning alert-dismissible fade show mt-2" role="alert">
            <i class="fas fa-exclamation-triangle text-warning"></i>
            <strong>Location Issue</strong>
            <div class="small text-muted">${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    container.appendChild(errorMsg);
    setTimeout(() => errorMsg.remove(), 10000);
}

// Export for use in other scripts
window.sharedFunctions = {
    hideAutoBadges,
    showAutoBadge,
    showProcessing,
    hideProcessing,
    getCurrentTimeValues,
    getCurrentLocation,
    formatFormData,
    submitPrediction,
    showLocationSuccess,
    showLocationError
};