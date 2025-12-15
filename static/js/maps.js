/**
 * MAPS.JS - Route Intelligence Module
 * Analyzes route between source (GPS) and destination (map click)
 * Auto-fills: Road Type, Area Type, Traffic Volume, Road Design, Speed Limit
 * 
 * WORKFLOW:
 * 1. User clicks "Use Current Location" → GPS fills source
 * 2. User clicks "Select Destination on Map" → Opens interactive map
 * 3. User clicks on map → Gets destination coordinates
 * 4. Fetches route from TrueWay Directions API
 * 5. Shows route modal with all details
 * 6. User clicks "Apply to Form" → Road/traffic fields filled!
 * 
 * API USED: TrueWay Directions (RapidAPI)
 */

// API Configuration
const MAPS_API_CONFIG = {
    apiKey: '36f753ce24mshd5d0f628e7126c8p10ce0ajsn936657884bed',
    apiHost: 'trueway-directions2.p.rapidapi.com',
    routeUrl: 'https://trueway-directions2.p.rapidapi.com/FindDrivingRoute',
    useMockData: false // Set to true for testing
};

// Global variables
let currentRouteData = null;
let sourceCoordinates = null;
let destinationCoordinates = null;
let mapInstance = null;
let destinationMarker = null;

/**
 * Use current GPS location as source
 */
async function useCurrentLocationAsSource() {
    try {
        showProcessingOverlay('Getting Location', 'Fetching your current location...');
        
        const coords = await getUserLocation();
        sourceCoordinates = coords;
        
        // Fill source input with coordinates
        document.getElementById('auto_source_location').value = `Current Location (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`;
        
        hideProcessingOverlay();
        showSuccess('Current location set as source!');
        
    } catch (error) {
        hideProcessingOverlay();
        console.error('Location Error:', error);
        showError('Failed to get current location. Please enable location access.');
    }
}

/**
 * Get user's current GPS location
 */
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

/**
 * Open interactive map for destination selection
 */
async function openDestinationMapModal() {
    // If source not set via GPS, try to get current location now
    if (!sourceCoordinates) {
        try {
            showProcessingOverlay('Getting Location', 'Fetching your current location...');
            const coords = await getUserLocation();
            sourceCoordinates = coords;
            document.getElementById('auto_source_location').value = `Current Location (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`;
            hideProcessingOverlay();
        } catch (error) {
            hideProcessingOverlay();
            showError('Please enable location access to use the map feature');
            return;
        }
    }
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('mapSelectionModal'));
    modal.show();
    
    // Initialize map after modal is shown
    setTimeout(() => {
        initializeMap();
    }, 300);
}

/**
 * Initialize Leaflet map for destination selection
 */
function initializeMap() {
    // If map already exists, remove it
    if (mapInstance) {
        mapInstance.remove();
    }
    
    // Create map centered on source location
    mapInstance = L.map('destinationMap').setView([sourceCoordinates.latitude, sourceCoordinates.longitude], 13);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(mapInstance);
    
    // Add source marker (blue)
    L.marker([sourceCoordinates.latitude, sourceCoordinates.longitude], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        })
    }).addTo(mapInstance).bindPopup('<b>Source</b><br>Your Current Location').openPopup();
    
    // Add click event to select destination
    mapInstance.on('click', function(e) {
        selectDestinationOnMap(e.latlng);
    });
    
    console.log('✓ Map initialized');
}

/**
 * Handle destination selection on map
 */
function selectDestinationOnMap(latlng) {
    // Remove previous destination marker if exists
    if (destinationMarker) {
        mapInstance.removeLayer(destinationMarker);
    }
    
    // Add new destination marker (red)
    destinationMarker = L.marker([latlng.lat, latlng.lng], {
        icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41]
        })
    }).addTo(mapInstance).bindPopup('<b>Destination</b><br>Click "Confirm" to analyze route').openPopup();
    
    // Store destination coordinates
    destinationCoordinates = {
        latitude: latlng.lat,
        longitude: latlng.lng
    };
    
    // Enable confirm button
    document.getElementById('confirmDestinationBtn').disabled = false;
    
    console.log('✓ Destination selected:', destinationCoordinates);
}

/**
 * Confirm destination and close map modal
 */
function confirmDestinationSelection() {
    if (!destinationCoordinates) {
        showError('Please select a destination on the map');
        return;
    }
    
    // Fill destination input
    document.getElementById('auto_destination_location').value = `Selected on Map (${destinationCoordinates.latitude.toFixed(4)}, ${destinationCoordinates.longitude.toFixed(4)})`;
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('mapSelectionModal'));
    modal.hide();
    
    showSuccess('Destination selected! Now click "Analyze Route" to get route details.');
}

/**
 * Main function to analyze route
 */
async function autoFillRouteData() {
    try {
        // Check if both source and destination are set
        if (!sourceCoordinates || !destinationCoordinates) {
            showError('Please set both Source (current location) and Destination (on map) first');
            return;
        }
        
        showProcessingOverlay('Analyzing Route', 'Fetching route information...');
        
        // Fetch route data from API
        const routeData = await fetchRouteData(sourceCoordinates, destinationCoordinates);
        
        // Analyze route and extract conditions
        const routeConditions = analyzeRouteConditions(routeData);
        
        // Store globally for Apply button
        window.currentRouteConditions = routeConditions;
        
        hideProcessingOverlay();
        
        // Show route modal with Apply button
        displayRouteModal(routeData, routeConditions);
        
    } catch (error) {
        hideProcessingOverlay();
        console.error('Route Error:', error);
        showError('Failed to analyze route: ' + error.message);
    }
}

/**
 * Fetch route data from TrueWay Directions API
 */
async function fetchRouteData(source, destination) {
    // Use mock data if enabled
    if (MAPS_API_CONFIG.useMockData) {
        return getMockRouteData();
    }
    
    try {
        // Format: stops=lat1,lon1;lat2,lon2
        const stops = `${source.latitude},${source.longitude};${destination.latitude},${destination.longitude}`;
        
        const url = `${MAPS_API_CONFIG.routeUrl}?stops=${encodeURIComponent(stops)}`;
        
        console.log('Fetching route...');
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': MAPS_API_CONFIG.apiKey,
                'x-rapidapi-host': MAPS_API_CONFIG.apiHost
            }
        });
        
        console.log('Route API Response Status:', response.status);
        
        if (response.status === 429) {
            throw new Error('RATE_LIMIT: API rate limit exceeded');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Route API Error:', errorText);
            throw new Error(`API Error ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✓ Route API Response:', data);
        
        currentRouteData = data;
        return data;
        
    } catch (error) {
        console.error('Route Fetch Error:', error);
        throw error;
    }
}

/**
 * Analyze route data and determine road/traffic conditions
 */
function analyzeRouteConditions(routeData) {
    console.log('========== ROUTE ANALYSIS DEBUG ==========');
    
    const conditions = {
        roadType: 'City_Road',
        areaType: 'Urban',
        trafficVolume: 'Medium',
        roadDesign: 'Straight',
        speedLimit: 60,
        distance: 0,
        duration: 0,
        routeSummary: ''
    };
    
    // Extract route info
    const route = routeData.route || {};
    const legs = route.legs || [];
    
    if (legs.length === 0) {
        console.warn('No route legs found');
        return conditions;
    }
    
    const firstLeg = legs[0];
    const steps = firstLeg.steps || [];
    
    // Calculate total distance and duration
    conditions.distance = (route.distance / 1000).toFixed(1); // meters to km
    conditions.duration = Math.round(route.duration / 60); // seconds to minutes
    conditions.routeSummary = route.summary || 'Route calculated';
    
    console.log('Distance:', conditions.distance, 'km');
    console.log('Duration:', conditions.duration, 'min');
    console.log('Total steps:', steps.length);
    
    // Analyze road type based on instructions and road names
    let highwayCount = 0;
    let cityRoadCount = 0;
    let junctionCount = 0;
    let turnCount = 0;
    
    steps.forEach(step => {
        const instruction = (step.instruction || '').toLowerCase();
        const roadName = (step.name || '').toLowerCase();
        
        // Check for highways
        if (roadName.includes('highway') || roadName.includes('expressway') || 
            roadName.includes('nh-') || roadName.includes('sh-') ||
            instruction.includes('highway') || instruction.includes('expressway')) {
            highwayCount++;
        } else {
            cityRoadCount++;
        }
        
        // Check for junctions/intersections
        if (instruction.includes('roundabout') || instruction.includes('junction') || 
            instruction.includes('intersection')) {
            junctionCount++;
        }
        
        // Count turns
        if (instruction.includes('turn') || instruction.includes('left') || 
            instruction.includes('right')) {
            turnCount++;
        }
    });
    
    console.log('Highway segments:', highwayCount);
    console.log('City road segments:', cityRoadCount);
    console.log('Junctions:', junctionCount);
    console.log('Turns:', turnCount);
    
    // Determine road type
    if (highwayCount > cityRoadCount) {
        conditions.roadType = 'Highway';
        conditions.speedLimit = 80;
    } else if (cityRoadCount > 0) {
        conditions.roadType = 'City_Road';
        conditions.speedLimit = 60;
    } else {
        conditions.roadType = 'Rural_Road';
        conditions.speedLimit = 50;
    }
    
    // Determine area type based on distance and road type
    if (conditions.distance < 5) {
        conditions.areaType = 'Urban';
    } else if (conditions.distance < 20) {
        conditions.areaType = 'Suburban';
    } else {
        conditions.areaType = 'Rural';
    }
    
    // Determine road design
    if (junctionCount > 3) {
        conditions.roadDesign = 'Junction';
    } else if (turnCount > 5) {
        conditions.roadDesign = 'Curved';
    } else {
        conditions.roadDesign = 'Straight';
    }
    
    // Determine traffic volume based on time and road type
    const currentHour = new Date().getHours();
    const isRushHour = (currentHour >= 8 && currentHour < 11) || (currentHour >= 17 && currentHour < 20);
    
    if (conditions.roadType === 'City_Road' && isRushHour) {
        conditions.trafficVolume = 'High';
    } else if (conditions.roadType === 'Highway') {
        conditions.trafficVolume = 'Medium';
    } else {
        conditions.trafficVolume = 'Low';
    }
    
    console.log('========== ANALYZED CONDITIONS ==========');
    console.log('✓ Road Type:', conditions.roadType);
    console.log('✓ Area Type:', conditions.areaType);
    console.log('✓ Traffic Volume:', conditions.trafficVolume);
    console.log('✓ Road Design:', conditions.roadDesign);
    console.log('✓ Speed Limit:', conditions.speedLimit);
    console.log('========================================');
    
    return conditions;
}

/**
 * Display route modal with details and Apply button
 */
function displayRouteModal(routeData, conditions) {
    const modal = new bootstrap.Modal(document.getElementById('routeModal'));
    const detailsDiv = document.getElementById('routeDetails');
    
    const html = `
        <div class="route-display">
            <div class="alert alert-info">
                <h6><i class="fas fa-route"></i> Route Summary:</h6>
                <p class="mb-1"><strong>Distance:</strong> ${conditions.distance} km</p>
                <p class="mb-1"><strong>Duration:</strong> ${conditions.duration} minutes</p>
                <p class="mb-0"><strong>Route:</strong> ${conditions.routeSummary}</p>
            </div>
            
            <div class="alert alert-success">
                <h6><i class="fas fa-check-circle"></i> Will Auto-Fill:</h6>
                <ul class="mb-0">
                    <li><strong>Road Type:</strong> ${conditions.roadType.replace('_', ' ')}</li>
                    <li><strong>Area Type:</strong> ${conditions.areaType}</li>
                    <li><strong>Traffic Volume:</strong> ${conditions.trafficVolume}</li>
                    <li><strong>Road Design:</strong> ${conditions.roadDesign}</li>
                    <li><strong>Speed Limit:</strong> ${conditions.speedLimit} km/h</li>
                </ul>
            </div>
            
            <div class="text-center">
                <button type="button" class="btn btn-primary btn-lg" onclick="applyRouteToForm()">
                    <i class="fas fa-check"></i> Apply Route Data to Form
                </button>
            </div>
        </div>
    `;
    
    detailsDiv.innerHTML = html;
    modal.show();
}

/**
 * Apply route data to form
 */
function applyRouteToForm() {
    if (!window.currentRouteConditions) {
        showError('No route data available');
        return;
    }
    
    const conditions = window.currentRouteConditions;
    
    // Fill route summary
    document.getElementById('auto_location').value = `${conditions.distance} km, ${conditions.duration} min - ${conditions.routeSummary}`;
    
    // Fill area type
    const areaTypeSelect = document.getElementById('auto_area_type');
    if (areaTypeSelect) {
        areaTypeSelect.value = conditions.areaType;
        areaTypeSelect.disabled = false;
    }
    
    // Fill road type
    const roadTypeSelect = document.getElementById('auto_road_type');
    if (roadTypeSelect) {
        roadTypeSelect.value = conditions.roadType;
        roadTypeSelect.disabled = false;
    }
    
    // Fill road design
    const roadDesignSelect = document.getElementById('auto_road_design');
    if (roadDesignSelect) {
        roadDesignSelect.value = conditions.roadDesign;
        roadDesignSelect.disabled = false;
    }
    
    // Fill traffic volume
    const trafficVolumeSelect = document.getElementById('auto_traffic_volume');
    if (trafficVolumeSelect) {
        trafficVolumeSelect.value = conditions.trafficVolume;
        trafficVolumeSelect.disabled = false;
    }
    
    // Fill speed limit
    const speedLimitInput = document.getElementById('auto_speed_limit');
    if (speedLimitInput) {
        speedLimitInput.value = conditions.speedLimit;
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('routeModal'));
    if (modal) {
        modal.hide();
    }
    
    // Show success badge
    const roadBadge = document.getElementById('roadBadge');
    if (roadBadge) {
        roadBadge.style.display = 'inline-block';
    }
    
    const locationBadge = document.getElementById('locationBadge');
    if (locationBadge) {
        locationBadge.style.display = 'inline-block';
    }
    
    showSuccess('Route data applied to form successfully!');
}

/**
 * Mock route data for testing
 */
function getMockRouteData() {
    console.log('Using MOCK route data for testing');
    
    return {
        route: {
            distance: 8500, // meters
            duration: 1200, // seconds (20 min)
            summary: 'Via Main Road and Highway 1',
            legs: [{
                steps: [
                    { instruction: 'Head north on Main Street', name: 'Main Street', distance: 500 },
                    { instruction: 'Turn right onto Highway 1', name: 'Highway 1', distance: 7000 },
                    { instruction: 'Turn left at junction', name: 'Park Road', distance: 1000 }
                ]
            }]
        }
    };
}

/**
 * Initialize maps module
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Maps module initialized');
});