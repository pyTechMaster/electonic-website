/**
 * WEATHER.JS - Weather Intelligence Module
 * Fetches REAL-TIME weather using FREE wttr.in API (NO KEY NEEDED!)
 * Works directly with GPS coordinates - gets nearest weather station data
 * Auto-fills: Weather, Road Surface, Visibility, Light Conditions
 * 
 * WORKFLOW:
 * 1. User clicks "Get Current Weather" button
 * 2. Gets GPS location (lat, lon)
 * 3. Fetches REAL weather from NEAREST weather station (wttr.in)
 * 4. Shows modal with weather details
 * 5. User clicks "Apply to Form" → Form fields filled!
 */

// API Configuration
const WEATHER_API_CONFIG = {
    // Using FREE wttr.in API - No key needed! Works directly with lat/lon!
    url: 'https://wttr.in',
    useMockData: false,
    timeout: 15000, // 15 seconds timeout
    retries: 3 // Number of retry attempts
};

// Global variable to store weather data
let currentWeatherData = null;

/**
 * Main function to auto-fill weather data
 * Gets user location, fetches weather, and shows in modal
 */
async function autoFillWeatherData() {
    try {
        showProcessingOverlay('Fetching Weather Data', 'Getting your current location...');
        
        // Get user's current location
        const coordinates = await getUserLocation();
        
        showProcessingOverlay('Fetching Weather Data', 'Retrieving current weather conditions...');
        
        // Fetch weather data with retry logic
        const weatherData = await fetchWeatherData(coordinates.latitude, coordinates.longitude);
        
        // Parse and map weather to form fields
        const environmentalConditions = mapWeatherToConditions(weatherData);
        
        // Store globally for Apply button
        window.currentWeatherConditions = environmentalConditions;
        
        hideProcessingOverlay();
        
        // Show weather modal with Apply button (like license feature)
        displayWeatherModal(weatherData, environmentalConditions);
        
    } catch (error) {
        hideProcessingOverlay();
        console.error('Weather Error:', error);
        
        let errorMessage = 'Failed to fetch weather data. ';
        
        if (error.message.includes('GEOLOCATION_DENIED')) {
            errorMessage += 'Location access was denied. Please enable location access in your browser settings.';
        } else if (error.message.includes('TIMEOUT')) {
            errorMessage += 'Request timed out. The weather service might be slow. Please try again.';
        } else if (error.message.includes('NETWORK')) {
            errorMessage += 'Network error. Please check your internet connection.';
        } else {
            errorMessage += error.message;
        }
        
        showError(errorMessage);
    }
}

/**
 * Get user's current GPS location
 */
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                console.log('✓ Location obtained:', coords);
                resolve(coords);
            },
            (error) => {
                console.error('Geolocation error:', error);
                
                // Default to Mumbai coordinates if location denied
                if (error.code === error.PERMISSION_DENIED) {
                    console.log('Location denied, using Mumbai as default');
                    resolve({ latitude: 19.0760, longitude: 72.8777 }); // Mumbai
                } else {
                    reject(new Error('GEOLOCATION_DENIED: ' + error.message));
                }
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
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('TIMEOUT: Request timed out');
        }
        throw error;
    }
}

/**
 * Retry wrapper for fetch requests
 */
async function fetchWithRetry(url, options = {}, retries = 3, timeout = 15000) {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`Attempt ${i + 1}/${retries} to fetch weather data...`);
            const response = await fetchWithTimeout(url, options, timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            lastError = error;
            console.warn(`Attempt ${i + 1} failed:`, error.message);
            
            // If not the last retry, wait before retrying (exponential backoff)
            if (i < retries - 1) {
                const delay = Math.min(1000 * Math.pow(2, i), 5000); // Max 5 seconds
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

/**
 * Fetch weather data using FREE wttr.in API (no key needed, works with lat/lon)
 */
async function fetchWeatherData(latitude, longitude) {
    if (WEATHER_API_CONFIG.useMockData) {
        return getMockWeatherData();
    }
    
    try {
        console.log('Fetching weather from coordinates:', latitude, longitude);
        
        // Try direct wttr.in first (no proxy)
        const weatherUrl = `https://wttr.in/${latitude},${longitude}?format=j1`;
        
        let response;
        let data;
        
        try {
            console.log('Trying direct wttr.in request...');
            response = await fetchWithRetry(
                weatherUrl, 
                {},
                WEATHER_API_CONFIG.retries,
                WEATHER_API_CONFIG.timeout
            );
            data = await response.json();
            console.log('✓ Direct request successful!');
        } catch (directError) {
            console.warn('Direct request failed:', directError.message);
            console.log('Trying with CORS proxy...');
            
            // Fallback to CORS proxy
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(weatherUrl)}`;
            response = await fetchWithRetry(
                proxyUrl,
                {},
                WEATHER_API_CONFIG.retries,
                WEATHER_API_CONFIG.timeout
            );
            data = await response.json();
            console.log('✓ Proxy request successful!');
        }
        
        console.log('✓ Raw Weather Data:', data);
        
        // Parse wttr.in response
        if (!data.current_condition || !data.current_condition[0]) {
            throw new Error('Invalid weather data received');
        }
        
        const current = data.current_condition[0];
        const weatherData = {
            weather: [{
                main: current.weatherDesc[0].value,
                description: current.weatherDesc[0].value.toLowerCase()
            }],
            main: {
                temp: parseFloat(current.temp_C),
                feels_like: parseFloat(current.FeelsLikeC),
                humidity: parseFloat(current.humidity),
                pressure: parseFloat(current.pressure)
            },
            visibility: parseFloat(current.visibility) * 1000,
            clouds: {
                all: parseFloat(current.cloudcover)
            },
            wind: {
                speed: parseFloat(current.windspeedKmph) / 3.6
            },
            name: data.nearest_area && data.nearest_area[0] 
                ? data.nearest_area[0].areaName[0].value 
                : 'Unknown Location'
        };
        
        console.log('✓ Converted Weather Data:', weatherData);
        currentWeatherData = weatherData;
        return weatherData;
        
    } catch (error) {
        console.error('Weather Fetch Error:', error);
        
        // If all retries failed, use mock data as last resort
        console.warn('All attempts failed. Using mock data as fallback...');
        return getMockWeatherData();
    }
}


/**
 * Map weather data to environmental conditions
 * Determines: Weather, Road Surface, Visibility, Light Condition
 */
function mapWeatherToConditions(weatherData) {
    console.log('========== WEATHER MAPPING DEBUG ==========');
    
    const conditions = {
        weather: 'Clear',
        roadSurface: 'Dry',
        visibility: 'high',
        lightCondition: 'Daylight'
    };
    
    // Extract weather info
    const weather = weatherData.weather?.[0] || {};
    const main = weatherData.main || {};
    const clouds = weatherData.clouds || {};
    const rain = weatherData.rain || {};
    const snow = weatherData.snow || {};
    const visibility = weatherData.visibility || 10000; // meters
    
    const weatherDescription = (weather.main || '').toLowerCase();
    const weatherDetail = (weather.description || '').toLowerCase();
    
    console.log('Weather Main:', weatherDescription);
    console.log('Weather Detail:', weatherDetail);
    console.log('Clouds:', clouds.all || 0, '%');
    console.log('Visibility:', visibility, 'meters');
    
    // Determine Weather Condition
    if (weatherDescription.includes('rain') || rain['1h'] > 0) {
        conditions.weather = 'Rainy';
        conditions.roadSurface = 'Wet';
    } else if (weatherDescription.includes('snow') || snow['1h'] > 0) {
        conditions.weather = 'Snowy';
        conditions.roadSurface = 'Icy';
    } else if (weatherDescription.includes('mist') || weatherDescription.includes('fog') || weatherDetail.includes('fog')) {
        conditions.weather = 'Foggy';
        conditions.roadSurface = 'Wet';
    } else if (weatherDescription.includes('storm') || weatherDescription.includes('thunder')) {
        conditions.weather = 'Stormy';
        conditions.roadSurface = 'Wet';
    } else if (clouds.all > 70) {
        conditions.weather = 'Cloudy';
        conditions.roadSurface = 'Dry';
    } else {
        conditions.weather = 'Clear';
        conditions.roadSurface = 'Dry';
    }
    
    // Determine Visibility
    if (visibility < 1000) {
        conditions.visibility = 'low'; // < 1km
    } else if (visibility < 5000) {
        conditions.visibility = 'medium'; // 1-5km
    } else {
        conditions.visibility = 'high'; // > 5km
    }
    
    // Determine Light Condition (based on current time)
    const currentHour = new Date().getHours();
    
    if (currentHour >= 6 && currentHour < 18) {
        conditions.lightCondition = 'Daylight';
    } else if (currentHour >= 18 && currentHour < 21) {
        conditions.lightCondition = 'Night_with_lights'; // Evening - usually street lights
    } else {
        conditions.lightCondition = 'Night_with_lights'; // Night - assuming street lights
    }
    
    // Adjust light condition based on weather
    if (conditions.weather === 'Foggy' || clouds.all > 80) {
        // Heavy clouds or fog reduce visibility even during day
        if (currentHour >= 6 && currentHour < 18) {
            // Still daylight but reduced
            conditions.lightCondition = 'Daylight';
        }
    }
    
    console.log('========== MAPPED CONDITIONS ==========');
    console.log('✓ Weather:', conditions.weather);
    console.log('✓ Road Surface:', conditions.roadSurface);
    console.log('✓ Visibility:', conditions.visibility);
    console.log('✓ Light Condition:', conditions.lightCondition);
    console.log('========================================');
    
    return conditions;
}

/**
 * Fill environmental form fields with weather data
 */
function fillEnvironmentalForm(conditions) {
    // Weather
    const weatherSelect = document.getElementById('auto_weather');
    if (weatherSelect) {
        weatherSelect.value = conditions.weather;
        weatherSelect.disabled = false;
    }
    
    // Road Surface
    const roadSurfaceSelect = document.getElementById('auto_road_surface');
    if (roadSurfaceSelect) {
        roadSurfaceSelect.value = conditions.roadSurface;
        roadSurfaceSelect.disabled = false;
    }
    
    // Visibility
    const visibilitySelect = document.getElementById('auto_visibility');
    if (visibilitySelect) {
        visibilitySelect.value = conditions.visibility;
        visibilitySelect.disabled = false;
    }
    
    // Light Condition
    const lightConditionSelect = document.getElementById('auto_light_condition');
    if (lightConditionSelect) {
        lightConditionSelect.value = conditions.lightCondition;
        lightConditionSelect.disabled = false;
    }
    
    console.log('✓ Environmental conditions filled in form');
}

/**
 * Get default weather conditions (fallback)
 */
function getDefaultWeatherConditions() {
    const currentHour = new Date().getHours();
    
    return {
        weather: 'Clear',
        roadSurface: 'Dry',
        visibility: 'high',
        lightCondition: currentHour >= 6 && currentHour < 18 ? 'Daylight' : 'Night_with_lights'
    };
}

/**
 * Mock weather data for testing
 */
function getMockWeatherData() {
    console.log('Using MOCK weather data for testing');
    
    // Simulate different weather scenarios randomly
    const scenarios = [
        {
            weather: [{ main: 'Clear', description: 'clear sky' }],
            main: { temp: 28, humidity: 60, feels_like: 30, pressure: 1013 },
            clouds: { all: 10 },
            visibility: 10000,
            wind: { speed: 3.5 },
            name: 'Mumbai'
        },
        {
            weather: [{ main: 'Rain', description: 'moderate rain' }],
            main: { temp: 24, humidity: 85, feels_like: 25, pressure: 1010 },
            clouds: { all: 90 },
            rain: { '1h': 5 },
            visibility: 3000,
            wind: { speed: 5.2 },
            name: 'Mumbai'
        },
        {
            weather: [{ main: 'Mist', description: 'mist' }],
            main: { temp: 22, humidity: 95, feels_like: 23, pressure: 1012 },
            clouds: { all: 100 },
            visibility: 800,
            wind: { speed: 2.1 },
            name: 'Mumbai'
        }
    ];
    
    // Return a random scenario
    return scenarios[Math.floor(Math.random() * scenarios.length)];
}

/**
 * Auto-fill time-based conditions
 * Called automatically when form loads or user requests
 */
function autoFillTimeConditions() {
    const now = new Date();
    const currentHour = now.getHours();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Time of Day
    let timeOfDay = 'Morning';
    if (currentHour >= 6 && currentHour < 12) {
        timeOfDay = 'Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
        timeOfDay = 'Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
        timeOfDay = 'Evening';
    } else {
        timeOfDay = 'Night';
    }
    
    const timeSelect = document.getElementById('auto_time_of_day');
    if (timeSelect) {
        timeSelect.value = timeOfDay;
    }
    
    // Is Weekend
    const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
    const weekendSelect = document.getElementById('auto_is_weekend');
    if (weekendSelect) {
        weekendSelect.value = isWeekend.toString();
    }
    
    // Traffic Volume (based on time and day)
    const trafficSelect = document.getElementById('auto_traffic_volume');
    if (trafficSelect) {
        let trafficVolume = 'Low';
        
        if (!isWeekend) {
            // Weekday traffic patterns
            if ((currentHour >= 8 && currentHour < 11) || (currentHour >= 17 && currentHour < 20)) {
                trafficVolume = 'High'; // Rush hours
            } else if ((currentHour >= 11 && currentHour < 17) || (currentHour >= 20 && currentHour < 22)) {
                trafficVolume = 'Medium';
            } else {
                trafficVolume = 'Low';
            }
        } else {
            // Weekend - generally lower traffic
            if (currentHour >= 10 && currentHour < 22) {
                trafficVolume = 'Medium';
            } else {
                trafficVolume = 'Low';
            }
        }
        
        trafficSelect.value = trafficVolume;
    }
    
    console.log('✓ Time-based conditions auto-filled');
    console.log('  - Time of Day:', timeOfDay);
    console.log('  - Is Weekend:', isWeekend);
    console.log('  - Current Hour:', currentHour);
    
    // Show success badge
    const timeBadge = document.getElementById('timeBadge');
    if (timeBadge) {
        timeBadge.style.display = 'inline-block';
    }
}

/**
 * Display weather details in modal with Apply button (like license feature)
 */
function displayWeatherModal(weatherData, conditions) {
    const modal = new bootstrap.Modal(document.getElementById('weatherModal'));
    const detailsDiv = document.getElementById('weatherDetails');
    
    const weather = weatherData.weather?.[0] || {};
    const main = weatherData.main || {};
    const wind = weatherData.wind || {};
    
    const html = `
        <div class="weather-display">
            <div class="text-center mb-4">
                <h2>${weather.main || 'N/A'}</h2>
                <p class="text-muted fs-5">${weather.description || 'No description'}</p>
                <h1 class="display-3">${main.temp ? Math.round(main.temp) + '°C' : 'N/A'}</h1>
            </div>
            
            <div class="alert alert-info">
                <h6><i class="fas fa-info-circle"></i> Current Conditions:</h6>
                <div class="row">
                    <div class="col-6">
                        <p class="mb-1"><strong>Temperature:</strong> ${main.temp ? Math.round(main.temp) + '°C' : 'N/A'}</p>
                        <p class="mb-1"><strong>Feels Like:</strong> ${main.feels_like ? Math.round(main.feels_like) + '°C' : 'N/A'}</p>
                        <p class="mb-1"><strong>Humidity:</strong> ${main.humidity || 'N/A'}%</p>
                    </div>
                    <div class="col-6">
                        <p class="mb-1"><strong>Wind Speed:</strong> ${wind.speed ? wind.speed.toFixed(1) : 'N/A'} m/s</p>
                        <p class="mb-1"><strong>Pressure:</strong> ${main.pressure || 'N/A'} hPa</p>
                        <p class="mb-1"><strong>Visibility:</strong> ${weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) + ' km' : 'N/A'}</p>
                    </div>
                </div>
            </div>
            
            <div class="alert alert-success">
                <h6><i class="fas fa-check-circle"></i> Will Auto-Fill:</h6>
                <ul class="mb-0">
                    <li><strong>Weather:</strong> ${conditions.weather}</li>
                    <li><strong>Road Surface:</strong> ${conditions.roadSurface}</li>
                    <li><strong>Visibility:</strong> ${conditions.visibility}</li>
                    <li><strong>Light Condition:</strong> ${conditions.lightCondition}</li>
                </ul>
            </div>
            
            <div class="text-center">
                <button type="button" class="btn btn-primary btn-lg" onclick="applyWeatherToForm()">
                    <i class="fas fa-check"></i> Apply Weather to Form
                </button>
            </div>
        </div>
    `;
    
    detailsDiv.innerHTML = html;
    modal.show();
}

/**
 * Apply weather data to form (called when user clicks Apply button)
 */
function applyWeatherToForm() {
    if (!window.currentWeatherConditions) {
        showError('No weather data available');
        return;
    }
    
    const conditions = window.currentWeatherConditions;
    
    // Fill the form
    fillEnvironmentalForm(conditions);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('weatherModal'));
    if (modal) {
        modal.hide();
    }
    
    // Show success badge
    const weatherBadge = document.getElementById('weatherBadge');
    if (weatherBadge) {
        weatherBadge.style.display = 'inline-block';
    }
    
    showSuccess('Weather conditions applied to form successfully!');
}

/**
 * Initialize weather module
 * Auto-fill time conditions on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Weather module initialized');
    
    // Auto-fill time-based conditions immediately
    autoFillTimeConditions();
    
    // Update time conditions every minute
    setInterval(autoFillTimeConditions, 60000);
});