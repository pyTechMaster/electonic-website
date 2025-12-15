// AUTO MODE JAVASCRIPT

// Global state for auto mode
let licenseData = null;
let routeData = null;
let weatherData = null;
let currentStep = 1;

function initAutoMode() {
    console.log('Initializing Auto Mode...');
    
    // Reset state
    licenseData = null;
    routeData = null;
    weatherData = null;
    currentStep = 1;
    
    // Setup event listeners
    setupLicenseUpload();
    setupRouteSelection();
    setupAutoFormSubmission();
    
    // Show step 1
    moveToStep(1);
}

// ============================================
// STEP 1: LICENSE UPLOAD
// ============================================

function setupLicenseUpload() {
    const licenseInput = document.getElementById('licenseInput');
    const uploadZone = document.getElementById('licenseUploadZone');
    
    if (!licenseInput || !uploadZone) return;
    
    // Click to upload
    uploadZone.addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') {
            licenseInput.click();
        }
    });
    
    // Drag & Drop handlers
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
    // Validate file
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
    
    const formData = new FormData();
    formData.append('license', file);
    
    try {
        const response = await fetch('/api/process-license', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            licenseData = result.data;
            
            // Update status
            statusDiv.className = 'license-status valid';
            statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> License validated successfully!';
            
            // Show extracted info
            displayExtractedInfo(result.data);
            
            // Fill driver info in form
            fillDriverInfo(result.data);
            
            // Move to next step after delay
            setTimeout(() => moveToStep(2), 1500);
            
        } else {
            throw new Error(result.error || 'OCR processing failed');
        }
        
    } catch (error) {
        console.error('License processing error:', error);
        statusDiv.className = 'license-status invalid';
        statusDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + error.message;
    }
}

function displayExtractedInfo(data) {
    const list = document.getElementById('extractedDataList');
    list.innerHTML = `
        <li><strong>Name:</strong> ${data.name || 'N/A'}</li>
        <li><strong>Age:</strong> ${data.age || 'N/A'}</li>
        <li><strong>License Number:</strong> ${data.license_number || 'N/A'}</li>
        <li><strong>Valid Until:</strong> ${data.expiry_date || 'N/A'}</li>
        <li><strong>Experience:</strong> ${data.experience || 'N/A'} years</li>
        <li><strong>Vehicle Class:</strong> ${data.vehicle_class || 'N/A'}</li>
    `;
    document.getElementById('extractedInfo').style.display = 'block';
}

function fillDriverInfo(data) {
    if (data.age) document.getElementById('auto_driver_age').value = data.age;
    if (data.experience) document.getElementById('auto_experience').value = data.experience;
    if (data.is_valid !== undefined) {
        document.getElementById('auto_license_valid').value = data.is_valid ? 'yes' : 'no';
    }
    if (data.vehicle_class) {
        const vehicleType = mapVehicleClass(data.vehicle_class);
        document.getElementById('auto_vehicle_type').value = vehicleType;
    }
    
    window.sharedFunctions.showAutoBadge('driverBadge');
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
    licenseData = null;
    moveToStep(1);
}

// Make resetLicenseUpload global
window.resetLicenseUpload = resetLicenseUpload;

// ============================================
// STEP 2: ROUTE SELECTION
// ============================================

function setupRouteSelection() {
    // Already handled by global onclick functions
    // useCurrentLocationAsSource and analyzeRoute are defined below
}

async function useCurrentLocationAsSource() {
    window.sharedFunctions.showProcessing('Getting Location', 'Detecting your current position...');
    
    try {
        const locationData = await window.sharedFunctions.getCurrentLocation();
        document.getElementById('autoSourceLocation').value = locationData.location;
        window.sharedFunctions.hideProcessing();
    } catch (error) {
        window.sharedFunctions.hideProcessing();
        alert('Failed to get location: ' + error.message);
    }
}

async function analyzeRoute() {
    const source = document.getElementById('autoSourceLocation').value.trim();
    const destination = document.getElementById('autoDestLocation').value.trim();
    
    if (!source || !destination) {
        alert('Please enter both source and destination');
        return;
    }
    
    window.sharedFunctions.showProcessing('Analyzing Route', 'Getting route details, traffic, and weather data...');
    
    try {
        const response = await fetch('/api/analyze-route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source, destination })
        });
        
        const result = await response.json();
        
        if (result.success) {
            routeData = result.route_data;
            weatherData = result.weather_data;
            
            // Fill all auto fields
            fillRouteInfo(result.route_data);
            fillWeatherInfo(result.weather_data);
            fillTemporalData();
            
            // Show weather widget
            displayWeatherWidget(result.weather_data);
            
            window.sharedFunctions.hideProcessing();
            moveToStep(3);
            
        } else {
            throw new Error(result.error || 'Route analysis failed');
        }
        
    } catch (error) {
        window.sharedFunctions.hideProcessing();
        alert('Error analyzing route: ' + error.message);
    }
}

function fillRouteInfo(data) {
    if (data.location) document.getElementById('auto_location').value = data.location;
    if (data.area_type) document.getElementById('auto_area_type').value = data.area_type;
    if (data.road_type) document.getElementById('auto_road_type').value = data.road_type;
    if (data.road_design) document.getElementById('auto_road_design').value = data.road_design;
    if (data.traffic_volume) document.getElementById('auto_traffic_volume').value = data.traffic_volume;
    if (data.speed_limit) document.getElementById('auto_speed_limit').value = data.speed_limit;
    if (data.accident_history !== undefined) document.getElementById('auto_accident_history').value = data.accident_history;
    
    window.sharedFunctions.showAutoBadge('locationBadge');
    window.sharedFunctions.showAutoBadge('roadBadge');
}

function fillWeatherInfo(data) {
    if (data.weather) document.getElementById('auto_weather').value = data.weather;
    if (data.road_surface) document.getElementById('auto_road_surface').value = data.road_surface;
    if (data.visibility) document.getElementById('auto_visibility').value = data.visibility;
    if (data.light_condition) document.getElementById('auto_light_condition').value = data.light_condition;
    
    window.sharedFunctions.showAutoBadge('weatherBadge');
}

function fillTemporalData() {
    const timeValues = window.sharedFunctions.getCurrentTimeValues();
    
    document.getElementById('auto_time_of_day').value = timeValues.timeOfDay;
    document.getElementById('auto_is_weekend').value = timeValues.isWeekend.toString();
    document.getElementById('auto_light_condition').value = timeValues.lightCondition;
    
    window.sharedFunctions.showAutoBadge('timeBadge');
}

function displayWeatherWidget(data) {
    const widget = document.getElementById('weatherWidget');
    if (widget) {
        widget.style.display = 'block';
        document.getElementById('currentWeather').textContent = data.weather || '-';
        document.getElementById('currentTemp').textContent = data.temperature ? `${data.temperature}°C` : '-';
        document.getElementById('currentVisibility').textContent = data.visibility_text || '-';
        document.getElementById('roadSurfaceCondition').textContent = data.road_surface || '-';
    }
}

// Make global functions accessible
window.useCurrentLocationAsSource = useCurrentLocationAsSource;
window.analyzeRoute = analyzeRoute;

// ============================================
// STEP MANAGEMENT
// ============================================

function moveToStep(stepNumber) {
    currentStep = stepNumber;
    
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        const num = index + 1;
        step.classList.remove('active', 'completed');
        if (num < stepNumber) step.classList.add('completed');
        if (num === stepNumber) step.classList.add('active');
    });
    
    // Show/hide sections
    document.getElementById('licenseUploadSection').style.display = stepNumber === 1 ? 'block' : 'none';
    document.getElementById('routeSelectionSection').style.display = stepNumber === 2 ? 'block' : 'none';
    document.getElementById('reviewSection').style.display = stepNumber === 3 ? 'block' : 'none';
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
        
        // Show loading
        if (loading) loading.style.display = 'block';
        
        try {
            // Format data
            const data = window.sharedFunctions.formatFormData(form, 'auto');
            
            // Add auto mode specific data
            data.license_data = licenseData;
            data.route_data = routeData;
            data.weather_data = weatherData;
            
            console.log('Submitting auto mode data:', data);
            
            // Submit prediction
            await window.sharedFunctions.submitPrediction(data);
            
        } catch (error) {
            if (loading) loading.style.display = 'none';
            alert('Prediction failed: ' + error.message);
        }
    });
}

// Export initialization function
window.initAutoMode = initAutoMode;