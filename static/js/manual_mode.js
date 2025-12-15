// MANUAL MODE JAVASCRIPT

function initManualMode() {
    console.log('Initializing Manual Mode...');
    
    // Set current time values
    const timeValues = window.sharedFunctions.getCurrentTimeValues();
    document.getElementById('manual_time_of_day').value = timeValues.timeOfDay;
    document.getElementById('manual_is_weekend').value = timeValues.isWeekend.toString();
    document.getElementById('manual_light_condition').value = timeValues.lightCondition;
    
    // Setup event listeners
    setupManualLocationButton();
    setupManualFormSubmission();
}

function setupManualLocationButton() {
    const useLocationBtn = document.getElementById('manual-use-location-btn');
    const locationInput = document.getElementById('manual_location');
    const areaTypeSelect = document.getElementById('manual_area_type');
    
    if (!useLocationBtn) return;
    
    useLocationBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        // Show loading state
        useLocationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        useLocationBtn.disabled = true;
        locationInput.placeholder = 'Detecting your location...';
        
        try {
            const locationData = await window.sharedFunctions.getCurrentLocation();
            
            // Fill location field
            locationInput.value = locationData.location;
            locationInput.classList.add('location-detected');
            
            // Set area type
            areaTypeSelect.value = locationData.areaType;
            
            // Show success message
            window.sharedFunctions.showLocationSuccess(
                locationData.location, 
                Math.round(locationData.accuracy || 100)
            );
            
        } catch (error) {
            console.error('Location error:', error);
            let errorMessage = 'Location detection failed';
            
            switch(error.code) {
                case 1: // PERMISSION_DENIED
                    errorMessage = 'Location access denied. Please allow location access and try again.';
                    break;
                case 2: // POSITION_UNAVAILABLE
                    errorMessage = 'Location information unavailable. Please enter manually.';
                    break;
                case 3: // TIMEOUT
                    errorMessage = 'Location request timed out. Please try again.';
                    break;
                default:
                    errorMessage = error.message || 'Location detection failed';
            }
            
            window.sharedFunctions.showLocationError(errorMessage);
        } finally {
            // Reset button state
            useLocationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
            useLocationBtn.disabled = false;
            locationInput.placeholder = 'Enter city, area or route name';
        }
    });
}

function setupManualFormSubmission() {
    const form = document.getElementById('manualModeForm');
    const loading = document.getElementById('manual-loading');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading
        if (loading) loading.style.display = 'block';
        
        try {
            // Format data
            const data = window.sharedFunctions.formatFormData(form, 'manual');
            
            console.log('Submitting manual mode data:', data);
            
            // Submit prediction
            await window.sharedFunctions.submitPrediction(data);
            
        } catch (error) {
            if (loading) loading.style.display = 'none';
            alert('Prediction failed: ' + error.message + '\n\nPlease check your input and try again.');
        }
    });
}

// Validate manual form inputs
function validateManualForm() {
    const location = document.getElementById('manual_location').value.trim();
    
    if (!location) {
        alert('Please enter a location');
        return false;
    }
    
    return true;
}

// Export initialization function
window.initManualMode = initManualMode;