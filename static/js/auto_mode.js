// AUTO MODE JAVASCRIPT - IMPROVED WITH SECTION-WISE AUTO-FILL
// Direct API calls - No backend needed!

// ============================================
// API KEYS - ADD YOUR KEYS HERE
// ============================================
const API_KEYS = {
    RAPIDAPI_KEY: 'YOUR_RAPIDAPI_KEY_HERE',  // For OCR
    GOOGLE_MAPS_KEY: 'YOUR_GOOGLE_MAPS_KEY_HERE',  // For Maps
    OPENWEATHER_KEY: 'YOUR_OPENWEATHER_KEY_HERE'  // For Weather
};

// Global state
let licenseData = null;
let weatherData = null;
let routeData = null;

function initAutoMode() {
    console.log('Initializing Auto Mode...');
    
    // Reset state
    licenseData = null;
    weatherData = null;
    routeData = null;
    
    // Setup event listeners
    setupLicenseUpload();
    setupAutoFormSubmission();
    
    // Auto-fill time data
    fillTemporalData();
}

// ============================================
// SECTION 1: LICENSE UPLOAD & OCR
// ============================================

function openLicenseUploadModal() {
    const modal = new bootstrap.Modal(document.getElementById('licenseUploadModal'));
    modal.show();
}

function setupLicenseUpload() {
    const licenseInput = document.getElementById('licenseInput');
    const uploadZone = document.getElementById('licenseUploadZone');
    
    if (!licenseInput || !uploadZone) return;
    
    // Drag & Drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleLicenseUpload(files[0]);
        }
    });
    
    // File input change
    licenseInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleLicenseUpload(this.files[0]);
        }
    });
}

async function handleLicenseUpload(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (JPG, PNG)');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('licenseImage').src = e.target.result;
        document.getElementById('licensePreview').style.display = 'block';
        document.getElementById('licenseUploadZone').style.display = 'none';
    };
    reader.readAsDataURL(file);
    
    // Process with OCR
    await processLicenseWithOCR(file);
}

async function processLicenseWithOCR(file) {
    const statusDiv = document.getElementById('licenseStatus');
    statusDiv.className = 'license-status processing';
    statusDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting license information...';
    
    try {
        // Convert file to base64
        const base64 = await fileToBase64(file);
        
        // Call OCR API (using OCR.space via RapidAPI)
        const formData = new FormData();
        formData.append('base64Image', base64);
        formData.append('language', 'eng');
        formData.append('isOverlayRequired', 'false');
        
        const response = await fetch('https://ocr-extract-text.p.rapidapi.com/ocr', {
            method: 'POST',
            headers: {
                'X-RapidAPI-Key': API_KEYS.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com'
            },
            body: formData
        });
        
        const result = await response.json();
        
        if (result.ParsedResults && result.ParsedResults[0].ParsedText) {
            const extractedText = result.ParsedResults[0].ParsedText;
            
            // Parse license data from text
            licenseData = parseLicenseText(extractedText);
            
            // Update status
            statusDiv.className = 'license-status valid';
            statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> License validated successfully!';
            
            // Show extracted info
            displayExtractedInfo(licenseData);
            
            // Enable apply button
            document.getElementById('applyLicenseData').disabled = false;
            
        } else {
            throw new Error('Could not extract text from license');
        }
        
    } catch (error) {
        console.error('License processing error:', error);
        statusDiv.className = 'license-status invalid';
        statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> OCR failed. Please try again or fill manually.';
        
        // Allow manual entry anyway
        document.getElementById('applyLicenseData').disabled = false;
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve('data:' + file.type + ';base64,' + base64);
        };
        reader.onerror = error => reject(error);
    });
}

function parseLicenseText(text) {
    // Simple parsing logic - you can improve this based on your license format
    const data = {
        name: '',
        age: 30,
        license_number: '',
        expiry_date: '',
        experience: 5,
        vehicle_class: 'LMV',
        is_valid: true
    };
    
    // Extract age (look for 4-digit year in DOB)
    const dobMatch = text.match(/\b(19|20)\d{2}\b/);
    if (dobMatch) {
        const birthYear = parseInt(dobMatch[0]);
        data.age = new Date().getFullYear() - birthYear;
    }
    
    // Extract license number (usually alphanumeric)
    const licenseMatch = text.match(/\b[A-Z]{2}[0-9]{13}\b/);
    if (licenseMatch) {
        data.license_number = licenseMatch[0];
    }
    
    // Extract vehicle class
    if (text.includes('MC') || text.includes('MCWG')) {
        data.vehicle_class = 'MC';
    } else if (text.includes('LMV')) {
        data.vehicle_class = 'LMV';
    } else if (text.includes('HMV') || text.includes('HGV')) {
        data.vehicle_class = 'HMV';
    }
    
    // Calculate experience (rough estimate)
    if (data.age > 18) {
        data.experience = Math.min(data.age - 18, 30);
    }
    
    return data;
}

function displayExtractedInfo(data) {
    const list = document.getElementById('extractedDataList');
    list.innerHTML = `
        <li><strong>Age:</strong> ${data.age || 'N/A'}</li>
        <li><strong>License Number:</strong> ${data.license_number || 'N/A'}</li>
        <li><strong>Experience:</strong> ${data.experience || 'N/A'} years</li>
        <li><strong>Vehicle Class:</strong> ${data.vehicle_class || 'N/A'}</li>
        <li><strong>Status:</strong> ${data.is_valid ? 'Valid' : 'Expired'}</li>
    `;
    document.getElementById('extractedInfo').style.display = 'block';
}

function applyLicenseDataToForm() {
    if (!licenseData) {
        alert('No license data available');
        return;
    }
    
    // Fill form fields
    if (licenseData.age) document.getElementById('auto_driver_age').value = licenseData.age;
    if (licenseData.experience) document.getElementById('auto_experience').value = licenseData.experience;
    if (licenseData.is_valid !== undefined) {
        document.getElementById('auto_license_valid').value = licenseData.is_valid ? 'yes' : 'no';
    }
    if (licenseData.vehicle_class) {
        const vehicleType = mapVehicleClass(licenseData.vehicle_class);
        document.getElementById('auto_vehicle_type').value = vehicleType;
    }
    
    // Show badge
    window.sharedFunctions.showAutoBadge('driverBadge');
    
    // Close modal
    bootstrap.Modal.getInstance(document.getElementById('licenseUploadModal')).hide();
    
    // Success message
    alert('✅ License data applied to form!');
}

function mapVehicleClass(vehicleClass) {
    const mapping = {
        'MC': 'Bike',
        'MCWG': 'Bike',
        'LMV': 'Car',
        'LMV-NT': 'Car',
        'HMV': 'Truck',
        'HGV': 'Truck',
        'Transport': 'Bus',
        'PSV': 'Bus'
    };
    return mapping[vehicleClass] || 'Car';
}

function resetLicenseUpload() {
    document.getElementById('licensePreview').style.display = 'none';
    document.getElementById('licenseUploadZone').style.display = 'block';
    document.getElementById('licenseInput').value = '';
    document.getElementById('applyLicenseData').disabled = true;
    licenseData = null;
}

window.resetLicenseUpload = resetLicenseUpload;
window.openLicenseUploadModal = openLicenseUploadModal;
window.applyLicenseDataToForm = applyLicenseDataToForm;

// ============================================
// SECTION 2: WEATHER AUTO-FILL
// ============================================

async function autoFillWeatherData() {
    const source = document.getElementById('auto_source_location').value.trim();
    
    if (!source) {
        alert('Please enter source location first');
        return;
    }
    
    window.sharedFunctions.showProcessing('Getting Weather', 'Fetching current weather conditions...');
    
    try {
        // Get coordinates from location name
        const coords = await geocodeLocation(source);
        
        // Fetch weather data
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEYS.OPENWEATHER_KEY}&units=metric`
        );
        
        const data = await response.json();
        
        if (data.weather && data.weather[0]) {
            weatherData = {
                weather: mapWeatherCondition(data.weather[0].main),
                temperature: Math.round(data.main.temp),
                visibility: data.visibility,
                humidity: data.main.humidity,
                wind_speed: data.wind.speed,
                description: data.weather[0].description
            };
            
            // Fill weather fields
            document.getElementById('auto_weather').value = weatherData.weather;
            
            // Determine road surface from weather
            if (weatherData.weather === 'Rainy') {
                document.getElementById('auto_road_surface').value = 'Wet';
            } else if (weatherData.weather === 'Snowy') {
                document.getElementById('auto_road_surface').value = 'Icy';
            } else {
                document.getElementById('auto_road_surface').value = 'Dry';
            }
            
            // Determine visibility
            if (weatherData.visibility > 5000) {
                document.getElementById('auto_visibility').value = 'high';
            } else if (weatherData.visibility > 1000) {
                document.getElementById('auto_visibility').value = 'medium';
            } else {
                document.getElementById('auto_visibility').value = 'low';
            }
            
            // Auto-fill light condition based on time
            fillLightCondition();
            
            // Show badge
            window.sharedFunctions.showAutoBadge('weatherBadge');
            
            window.sharedFunctions.hideProcessing();
            alert(`✅ Weather data filled! Current: ${weatherData.description}, ${weatherData.temperature}°C`);
            
        } else {
            throw new Error('Could not fetch weather data');
        }
        
    } catch (error) {
        window.sharedFunctions.hideProcessing();
        console.error('Weather error:', error);
        alert('⚠️ Could not fetch weather. Please fill manually.');
    }
}

function mapWeatherCondition(condition) {
    const mapping = {
        'Clear': 'Clear',
        'Clouds': 'Clear',
        'Rain': 'Rainy',
        'Drizzle': 'Rainy',
        'Thunderstorm': 'Stormy',
        'Snow': 'Snowy',
        'Mist': 'Foggy',
        'Fog': 'Foggy',
        'Haze': 'Foggy'
    };
    return mapping[condition] || 'Clear';
}

function fillLightCondition() {
    const hour = new Date().getHours();
    let lightCondition = 'Daylight';
    
    if (hour >= 6 && hour < 18) {
        lightCondition = 'Daylight';
    } else if (hour >= 18 && hour < 20) {
        lightCondition = 'Night_with_lights';
    } else {
        lightCondition = 'Night_without_lights';
    }
    
    document.getElementById('auto_light_condition').value = lightCondition;
}

window.autoFillWeatherData = autoFillWeatherData;

// ============================================
// SECTION 3: ROUTE & LOCATION AUTO-FILL
// ============================================

async function autoFillLocationData() {
    const source = document.getElementById('auto_source_location').value.trim();
    const dest = document.getElementById('auto_destination_location').value.trim();
    
    if (!source || !dest) {
        alert('Please enter both source and destination');
        return;
    }
    
    window.sharedFunctions.showProcessing('Analyzing Location', 'Getting area information...');
    
    try {
        // Geocode source location
        const sourceCoords = await geocodeLocation(source);
        
        // Determine area type from address components
        let areaType = 'Urban';
        if (sourceCoords.address) {
            if (sourceCoords.address.city || sourceCoords.address.town) {
                areaType = 'Urban';
            } else if (sourceCoords.address.village || sourceCoords.address.hamlet) {
                areaType = 'Rural';
            } else {
                areaType = 'Suburban';
            }
        }
        
        // Fill fields
        document.getElementById('auto_location').value = `${source} → ${dest}`;
        document.getElementById('auto_area_type').value = areaType;
        
        // Show badge
        window.sharedFunctions.showAutoBadge('locationBadge');
        
        window.sharedFunctions.hideProcessing();
        alert('✅ Location data filled!');
        
    } catch (error) {
        window.sharedFunctions.hideProcessing();
        console.error('Location error:', error);
        alert('⚠️ Could not analyze location. Please fill manually.');
    }
}

// async function autoFillRouteData() {
//     const source = document.getElementById('auto_source_location').value.trim();
//     const dest = document.getElementById('auto_destination_location').value.trim();
    
//     if (!source || !dest) {
//         alert('Please enter both source and destination');
//         return;
//     }
    
//     window.sharedFunctions.showProcessing('Analyzing Route', 'Getting route and traffic data...');
    
//     try {
//         // Get route using Google Maps Directions API
//         const sourceCoords = await geocodeLocation(source);
//         const destCoords = await geocodeLocation(dest);
        
//         const response = await fetch(
//             `https://maps.googleapis.com/maps/api/directions/json?origin=${sourceCoords.lat},${sourceCoords.lon}&destination=${destCoords.lat},${destCoords.lon}&key=${API_KEYS.GOOGLE_MAPS_KEY}`
//         );
        
//         const data = await response.json();
        
//         if (data.routes && data.routes[0]) {
//             const route = data.routes[0];
//             const distance = route.legs[0].distance.value / 1000; // km
            
//             // Determine road type from distance and area
//             let roadType = 'City_Road';
//             if (distance > 50) {
//                 roadType = 'Highway';
//             } else if (distance > 20) {
//                 roadType = 'Rural_Road';
//             }
            
//             // Estimate speed limit based on road type
//             const speedLimits = {
//                 'Highway': 100,
//                 'City_Road': 60,
//                 'Rural_Road': 80
//             };
            
//             // Fill fields
//             document.getElementById('auto_road_type').value = roadType;
//             document.getElementById('auto_speed_limit').value = speedLimits[roadType];
//             document.getElementById('auto_road_design').value = 'Straight'; // Default
//             document.getElementById('auto_traffic_volume').value = 'Medium'; // Default
//             document.getElementById('auto_accident_history').value = 0; // Default
            
//             // Show badge
//             window.sharedFunctions.showAutoBadge('roadBadge');
            
//             window.sharedFunctions.hideProcessing();
//             alert(`✅ Route data filled! Distance: ${distance.toFixed(1)} km`);
            
//         } else {
//             throw new Error('Could not calculate route');
//         }
        
//     } catch (error) {
//         window.sharedFunctions.hideProcessing();
//         console.error('Route error:', error);
//         alert('⚠️ Could not analyze route. Using default values.');
        
//         // Fill with defaults
//         document.getElementById('auto_road_type').value = 'City_Road';
//         document.getElementById('auto_speed_limit').value = 60;
//         document.getElementById('auto_road_design').value = 'Straight';
//         document.getElementById('auto_traffic_volume').value = 'Medium';
//     }
// }

async function geocodeLocation(locationName) {
    // Using OpenStreetMap Nominatim (free, no API key needed)
    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&addressdetails=1&limit=1`
    );
    
    const data = await response.json();
    
    if (data && data[0]) {
        return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            address: data[0].address || {}
        };
    } else {
        throw new Error('Location not found');
    }
}

async function useCurrentLocationAsSource() {
    window.sharedFunctions.showProcessing('Getting Location', 'Detecting your current position...');
    
    try {
        const locationData = await window.sharedFunctions.getCurrentLocation();
        document.getElementById('auto_source_location').value = locationData.location;
        window.sharedFunctions.hideProcessing();
        alert('✅ Current location set as source!');
    } catch (error) {
        window.sharedFunctions.hideProcessing();
        alert('⚠️ Could not get location: ' + error.message);
    }
}

window.autoFillLocationData = autoFillLocationData;
// window.autoFillRouteData = autoFillRouteData;
window.useCurrentLocationAsSource = useCurrentLocationAsSource;

// ============================================
// TEMPORAL DATA AUTO-FILL
// ============================================

function fillTemporalData() {
    const timeValues = window.sharedFunctions.getCurrentTimeValues();
    
    document.getElementById('auto_time_of_day').value = timeValues.timeOfDay;
    document.getElementById('auto_is_weekend').value = timeValues.isWeekend.toString();
    fillLightCondition();
    
    window.sharedFunctions.showAutoBadge('timeBadge');
}

// ============================================
// FORM SUBMISSION
// ============================================

function setupAutoFormSubmission() {
    const form = document.getElementById('autoModeForm');
    const loading = document.getElementById('auto-loading');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (loading) loading.style.display = 'block';
        
        try {
            const data = window.sharedFunctions.formatFormData(form, 'auto');
            
            // Add metadata
            data.license_data = licenseData;
            data.route_data = routeData;
            data.weather_data = weatherData;
            
            console.log('Submitting auto mode data:', data);
            
            await window.sharedFunctions.submitPrediction(data);
            
        } catch (error) {
            if (loading) loading.style.display = 'none';
            alert('Prediction failed: ' + error.message);
        }
    });
}

// Export initialization
window.initAutoMode = initAutoMode;