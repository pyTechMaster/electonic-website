/**
 * OCR.js - Driver License OCR Handler
 * Extracts driver information from license using OCR API
 * Auto-fills: Age, Experience, License Validity, Vehicle Type
 */

// API Configuration
const OCR_API_CONFIG = {
    url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
    key: '36f753ce24mshd5d0f628e7126c8p10ce0ajsn936657884bed',
    host: 'ocr-extract-text.p.rapidapi.com',
    useMockData: false // Set to true to test without API calls
};

// Global variable to store extracted data
let extractedLicenseData = null;

/**
 * Open License Upload Modal
 */
function openLicenseUploadModal() {
    const modal = new bootstrap.Modal(document.getElementById('licenseUploadModal'));
    modal.show();
}

/**
 * Handle License File Selection
 */
document.addEventListener('DOMContentLoaded', function() {
    const licenseInput = document.getElementById('licenseInput');
    const uploadZone = document.getElementById('licenseUploadZone');
    
    // File input change handler
    licenseInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleLicenseUpload(file);
        }
    });
    
    // Drag and drop handlers
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadZone.style.borderColor = '#0d6efd';
        uploadZone.style.background = 'rgba(13, 110, 253, 0.05)';
    });
    
    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadZone.style.borderColor = '#dee2e6';
        uploadZone.style.background = '#f8f9fa';
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadZone.style.borderColor = '#dee2e6';
        uploadZone.style.background = '#f8f9fa';
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleLicenseUpload(file);
        } else {
            showError('Please upload a valid image file (JPG, PNG)');
        }
    });
});

/**
 * Handle License Upload and OCR Processing
 */
async function handleLicenseUpload(file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showError('File size must be less than 5MB');
        return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('licenseImage').src = e.target.result;
        document.getElementById('licenseUploadZone').style.display = 'none';
        document.getElementById('licensePreview').style.display = 'block';
        document.getElementById('licenseStatus').style.display = 'block';
        document.getElementById('licenseStatus').className = 'license-status processing';
        document.getElementById('licenseStatus').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing license...';
    };
    reader.readAsDataURL(file);
    
    // Process with OCR
    try {
        showProcessingOverlay('Extracting License Data', 'Reading your driver license information...');
        
        const ocrText = await performOCR(file);
        const parsedData = parseLicenseData(ocrText);
        
        hideProcessingOverlay();
        
        if (parsedData) {
            extractedLicenseData = parsedData;
            displayExtractedInfo(parsedData);
            document.getElementById('applyLicenseData').disabled = false;
        } else {
            showError('Could not extract license information. Please try again with a clearer image.');
        }
        
    } catch (error) {
        hideProcessingOverlay();
        console.error('OCR Error:', error);
        
        let errorMessage = 'Failed to process license. Please try again.';
        
        // User-friendly error messages
        if (error.message.includes('RATE_LIMIT')) {
            errorMessage = '⚠️ API Rate Limit Reached!\n\nYour free API requests are exhausted. Solutions:\n1. Wait 24 hours for reset\n2. Upgrade RapidAPI plan\n3. Use a different API key';
        } else if (error.message.includes('API_ENDPOINT')) {
            errorMessage = '⚠️ API Configuration Error!\n\nThe API endpoint might have changed. Please check the API documentation or contact support.';
        } else if (error.message.includes('API_KEY')) {
            errorMessage = '⚠️ Invalid API Key!\n\nPlease check your RapidAPI key in the code.';
        } else if (error.message.includes('No text extracted')) {
            errorMessage = '⚠️ No Text Detected!\n\nPlease upload a clearer image of your license.';
        }
        
        showError(errorMessage);
        document.getElementById('licenseStatus').className = 'license-status error';
        document.getElementById('licenseStatus').innerHTML = '<i class="fas fa-exclamation-circle"></i> Processing failed - ' + (error.message.includes('RATE_LIMIT') ? 'Rate Limit' : 'Error');
    }
}

/**
 * Perform OCR using RapidAPI
 */
async function performOCR(file) {
    // Use mock data if enabled (for testing)
    if (OCR_API_CONFIG.useMockData) {
        return mockOCR();
    }
    
    try {
        // Create FormData object (multipart/form-data)
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch(OCR_API_CONFIG.url, {
            method: 'POST',
            headers: {
                'x-rapidapi-key': OCR_API_CONFIG.key,
                'x-rapidapi-host': OCR_API_CONFIG.host
                // Don't set Content-Type - browser will set it automatically with boundary for FormData
            },
            body: formData
        });
        
        console.log('API Response Status:', response.status);
        
        // Handle specific error codes
        if (response.status === 429) {
            // Rate limit - offer to use mock data
            if (confirm('⚠️ API Rate Limit Reached!\n\nWould you like to use DEMO data to test the feature?')) {
                return mockOCR();
            }
            throw new Error('RATE_LIMIT: API rate limit exceeded. Please wait or upgrade your RapidAPI plan.');
        }
        
        if (response.status === 404) {
            throw new Error('API_ENDPOINT: API endpoint not found. Please check API documentation.');
        }
        
        if (response.status === 403) {
            throw new Error('API_KEY: Invalid API key or unauthorized access.');
        }
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API Error ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('OCR Response:', data);
        
        // Extract text from response (adjust based on actual API response structure)
        // Common response formats: data.text, data.result, data.extracted_text, data.data
        const extractedText = data.text || data.result || data.extracted_text || data.data || JSON.stringify(data);
        
        if (!extractedText || extractedText.length < 10) {
            throw new Error('No text extracted from image. Please upload a clearer image.');
        }
        
        return extractedText;
        
    } catch (error) {
        console.error('OCR Error:', error);
        throw error;
    }
}

/**
 * Mock OCR Function (for testing when API is unavailable)
 * Returns sample Indian driving license text
 */
function mockOCR() {
    console.log('Using MOCK OCR data for testing');
    return `
        GOVERNMENT OF INDIA
        DRIVING LICENCE
        
        Name: RAJESH KUMAR SHARMA
        S/O: RAM KUMAR SHARMA
        
        DOB: 15-08-1995
        
        DL No: MH-0120210012345
        
        ISSUE DATE: 20-01-2021
        VALID TILL: 19-01-2041
        
        COV: MCWG, LMV
        
        Blood Group: O+
        Address: Mumbai, Maharashtra
    `;
}

/**
 * Parse License Data from OCR Text
 * Extracts: Name, DOB, Age, License Number, Issue Date, Expiry Date, Vehicle Type
 */
function parseLicenseData(text) {
    console.log('========== OCR PARSING DEBUG ==========');
    console.log('Raw OCR Text:', text);
    
    const data = {
        fullName: null,
        dateOfBirth: null,
        age: null,
        licenseNumber: null,
        issueDate: null,
        expiryDate: null,
        drivingExperience: null,
        vehicleTypes: [],
        isValid: false
    };
    
    // Clean text
    text = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').toUpperCase();
    console.log('Cleaned Text:', text.substring(0, 200) + '...');
    
    // Extract Name (usually after "NAME" or "S/O" or "D/O")
    const namePatterns = [
        /NAME[:\s]+([A-Z][A-Z\s]{2,40})(?=\s+S\/D\/W|S\/O|D\/O|W\/O|ADD|DOB|D\.O\.B|PIN)/i,
        /NAME[:\s]+([A-Z][A-Z\s]{2,40})(?=\s+[A-Z]\/[A-Z]\/[A-Z])/i, // For S/D/W patterns
        /(?:NAME|नाम)[:\s]+([A-Z][A-Z\s]{2,40})/i,
        /S\/D\/W\s+OF[:\s]+([A-Z\s]+?)(?=ADD|DOB|PIN)/i, // Son/Daughter/Wife of
        /S\/O[:\s]+([A-Z\s]+?)(?=ADD|DOB|D\.O\.B|PIN)/i,
        /D\/O[:\s]+([A-Z\s]+?)(?=ADD|DOB|D\.O\.B|PIN)/i,
        /W\/O[:\s]+([A-Z\s]+?)(?=ADD|DOB|D\.O\.B|PIN)/i
    ];
    
    for (let pattern of namePatterns) {
        const nameMatch = text.match(pattern);
        if (nameMatch) {
            let name = nameMatch[1].trim();
            // Clean up - remove if too short or contains numbers
            if (name.length > 3 && !/\d/.test(name) && !name.includes('GETTYIMAGES') && !name.includes('CREDIT')) {
                data.fullName = name;
                break;
            }
        }
    }
    
    // Fallback: Try to find name between "Name" and "S/D/W"
    if (!data.fullName) {
        const fallbackNameMatch = text.match(/NAME\s+([A-Z\s]+?)\s+S\/D\/W/i);
        if (fallbackNameMatch) {
            data.fullName = fallbackNameMatch[1].trim();
        }
    }
    
    // Extract Date of Birth
    const dobPatterns = [
        /DOB[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /D\.O\.B[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /DATE OF BIRTH[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /BIRTH[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i
    ];
    
    for (let pattern of dobPatterns) {
        const dobMatch = text.match(pattern);
        if (dobMatch) {
            data.dateOfBirth = dobMatch[1];
            data.age = calculateAge(dobMatch[1]);
            break;
        }
    }
    
    // Extract License Number
    const licensePatterns = [
        /(?:DL|LICENSE|LIC)[\s#NO:]*([A-Z]{2}[-\s]?\d{2}[-\s]?\d{4,}[-\s]?\d{7})/i,
        /(?:DL|LICENSE|LIC)[\s#NO:]*([A-Z0-9\-]{10,})/i
    ];
    
    for (let pattern of licensePatterns) {
        const licenseMatch = text.match(pattern);
        if (licenseMatch) {
            data.licenseNumber = licenseMatch[1].trim();
            break;
        }
    }
    
    // Extract Issue Date
    const issuePatterns = [
        /DOI[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i, // DOI - Date of Issue (Indian format)
        /(?:ISSUE|ISSUED|ISS)[\sDATE:]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /(?:FROM|VALID FROM)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /(?:DATE OF ISSUE)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i
    ];
    
    for (let pattern of issuePatterns) {
        const issueMatch = text.match(pattern);
        if (issueMatch) {
            data.issueDate = issueMatch[1];
            data.drivingExperience = calculateExperience(issueMatch[1]);
            break;
        }
    }
    
    // Fallback: If COV section has dates, use the earliest one as issue date
    if (!data.issueDate) {
        const covDateMatch = text.match(/COV.*?(\d{2}-\d{2}-\d{4})/i);
        if (covDateMatch) {
            data.issueDate = covDateMatch[1];
            data.drivingExperience = calculateExperience(covDateMatch[1]);
        }
    }
    
    // Extract Expiry Date
    const expiryPatterns = [
        /VALID TILL[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /(?:VALID|VALIDITY|EXPIRY|EXPIRES|TILL|UPTO)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /(?:VALID UPTO)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
        /(?:EXP|EXPIRY DATE)[:\s]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i
    ];
    
    for (let pattern of expiryPatterns) {
        const expiryMatch = text.match(pattern);
        if (expiryMatch) {
            data.expiryDate = expiryMatch[1];
            data.isValid = checkLicenseValidity(expiryMatch[1]);
            break;
        }
    }
    
    // Extract Vehicle Class/Type (COV - Class of Vehicle)
    const vehiclePatterns = [
        /COV[:\s]*([A-Z,\s]+?)(?=ADDRESS|BLOOD|BG|\d{2}[-\/]\d{2})/i,
        /CLASS[:\s]*([A-Z,\s]+?)(?=ADDRESS|BLOOD|BG|\d{2}[-\/]\d{2})/i,
        /(?:MCWG|LMV|HMV|TRANS)/gi
    ];
    
    for (let pattern of vehiclePatterns) {
        const vehicleMatch = text.match(pattern);
        if (vehicleMatch) {
            const vehicleStr = vehicleMatch[1] || vehicleMatch[0];
            data.vehicleTypes = parseVehicleTypes(vehicleStr);
            break;
        }
    }
    
    // If no specific vehicle type found, check for common abbreviations
    if (data.vehicleTypes.length === 0) {
        if (text.includes('MCWG')) data.vehicleTypes.push('Bike');
        if (text.includes('LMV') || text.includes('CAR')) data.vehicleTypes.push('Car');
        if (text.includes('HMV') || text.includes('TRUCK')) data.vehicleTypes.push('Truck');
        if (text.includes('TRANS') || text.includes('BUS')) data.vehicleTypes.push('Bus');
    }
    
    // Default to Car if nothing found
    if (data.vehicleTypes.length === 0) {
        data.vehicleTypes.push('Car');
    }
    
    console.log('========== EXTRACTION RESULTS ==========');
    console.log('✓ Name:', data.fullName || '❌ NOT FOUND');
    console.log('✓ DOB:', data.dateOfBirth || '❌ NOT FOUND');
    console.log('✓ Age:', data.age || '❌ NOT CALCULATED');
    console.log('✓ License Number:', data.licenseNumber || '❌ NOT FOUND');
    console.log('✓ Issue Date (DOI):', data.issueDate || '❌ NOT FOUND');
    console.log('✓ Driving Experience:', data.drivingExperience !== null ? data.drivingExperience + ' years' : '❌ NOT CALCULATED');
    console.log('✓ Expiry Date:', data.expiryDate || '❌ NOT FOUND');
    console.log('✓ Valid License:', data.isValid ? '✓ YES' : '✗ NO/EXPIRED');
    console.log('✓ Vehicle Types:', data.vehicleTypes.join(', '));
    console.log('========================================');
    
    return data;
}

/**
 * Calculate Age from Date of Birth
 */
function calculateAge(dobString) {
    const dob = parseDate(dobString);
    if (!dob) return null;
    
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Calculate Driving Experience (Years since issue date)
 */
function calculateExperience(issueDateString) {
    const issueDate = parseDate(issueDateString);
    if (!issueDate) return null;
    
    const today = new Date();
    let years = today.getFullYear() - issueDate.getFullYear();
    const monthDiff = today.getMonth() - issueDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < issueDate.getDate())) {
        years--;
    }
    
    return Math.max(0, years);
}

/**
 * Check if License is Still Valid
 */
function checkLicenseValidity(expiryDateString) {
    const expiryDate = parseDate(expiryDateString);
    if (!expiryDate) return false;
    
    const today = new Date();
    return expiryDate > today;
}

/**
 * Parse Date from various formats (DD-MM-YYYY, DD/MM/YYYY, DD-MM-YY)
 */
function parseDate(dateString) {
    if (!dateString) return null;
    
    // Try different date formats
    const formats = [
        /(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/,  // DD-MM-YYYY or DD/MM/YYYY
        /(\d{1,2})[-\/](\d{1,2})[-\/](\d{2})/    // DD-MM-YY or DD/MM/YY
    ];
    
    for (let format of formats) {
        const match = dateString.match(format);
        if (match) {
            let day = parseInt(match[1]);
            let month = parseInt(match[2]) - 1; // Month is 0-indexed
            let year = parseInt(match[3]);
            
            // Convert 2-digit year to 4-digit
            if (year < 100) {
                year += (year > 50) ? 1900 : 2000;
            }
            
            return new Date(year, month, day);
        }
    }
    
    return null;
}

/**
 * Parse Vehicle Types from COV String
 */
function parseVehicleTypes(covString) {
    const types = [];
    
    if (covString.includes('MCWG') || covString.includes('MC')) {
        types.push('Bike');
    }
    if (covString.includes('LMV') || covString.includes('CAR')) {
        types.push('Car');
    }
    if (covString.includes('HMV') || covString.includes('TRUCK')) {
        types.push('Truck');
    }
    if (covString.includes('TRANS') || covString.includes('BUS')) {
        types.push('Bus');
    }
    if (covString.includes('AUTO')) {
        types.push('Auto-rickshaw');
    }
    
    return types;
}

/**
 * Display Extracted Information in Modal
 */
function displayExtractedInfo(data) {
    const statusDiv = document.getElementById('licenseStatus');
    const extractedDiv = document.getElementById('extractedInfo');
    const dataList = document.getElementById('extractedDataList');
    
    statusDiv.className = 'license-status success';
    statusDiv.innerHTML = '<i class="fas fa-check-circle"></i> License processed successfully!';
    
    let html = '';
    
    if (data.fullName) {
        html += `<li><strong>Name:</strong> ${data.fullName}</li>`;
    }
    if (data.dateOfBirth) {
        html += `<li><strong>Date of Birth:</strong> ${data.dateOfBirth}</li>`;
    }
    if (data.age) {
        html += `<li><strong>Age:</strong> ${data.age} years</li>`;
    }
    if (data.licenseNumber) {
        html += `<li><strong>License Number:</strong> ${data.licenseNumber}</li>`;
    }
    if (data.issueDate) {
        html += `<li><strong>Issue Date (DOI):</strong> ${data.issueDate}</li>`;
    }
    if (data.drivingExperience !== null) {
        html += `<li><strong>Driving Experience:</strong> ${data.drivingExperience} years</li>`;
    } else if (data.issueDate) {
        // If experience calculation failed, show the issue date at least
        html += `<li><strong>Driving Experience:</strong> Issue date found but unable to calculate</li>`;
    }
    if (data.expiryDate) {
        html += `<li><strong>Expiry Date:</strong> ${data.expiryDate}</li>`;
    }
    html += `<li><strong>License Status:</strong> <span class="badge ${data.isValid ? 'bg-success' : 'bg-danger'}">${data.isValid ? 'Valid ✓' : 'Expired ✗'}</span></li>`;
    
    if (data.vehicleTypes.length > 0) {
        html += `<li><strong>Vehicle Types:</strong> ${data.vehicleTypes.join(', ')}</li>`;
    }
    
    // Show what will be auto-filled
    html += `<li class="mt-2"><small class="text-muted"><i class="fas fa-info-circle"></i> These details will be auto-filled in the form</small></li>`;
    
    dataList.innerHTML = html;
    extractedDiv.style.display = 'block';
}

/**
 * Apply Extracted License Data to Form
 */
function applyLicenseDataToForm() {
    if (!extractedLicenseData) return;
    
    const data = extractedLicenseData;
    
    // Fill Driver Age
    if (data.age) {
        document.getElementById('auto_driver_age').value = data.age;
    }
    
    // Fill Driving Experience
    if (data.drivingExperience !== null) {
        document.getElementById('auto_experience').value = data.drivingExperience;
    }
    
    // Fill License Validity
    document.getElementById('auto_license_valid').value = data.isValid ? 'yes' : 'no';
    
    // Fill Vehicle Type (use first detected type)
    if (data.vehicleTypes.length > 0) {
        const vehicleType = data.vehicleTypes[0];
        const vehicleSelect = document.getElementById('auto_vehicle_type');
        
        // Try to match with available options
        const options = Array.from(vehicleSelect.options);
        const matchingOption = options.find(opt => opt.value === vehicleType);
        
        if (matchingOption) {
            vehicleSelect.value = vehicleType;
        }
    }
    
    // Show success badge
    const driverBadge = document.getElementById('driverBadge');
    if (driverBadge) {
        driverBadge.style.display = 'inline-block';
    }
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('licenseUploadModal'));
    if (modal) {
        modal.hide();
    }
    
    // Show success message
    showSuccess('Driver information auto-filled successfully!');
}

/**
 * Reset License Upload
 */
function resetLicenseUpload() {
    document.getElementById('licenseInput').value = '';
    document.getElementById('licenseUploadZone').style.display = 'block';
    document.getElementById('licensePreview').style.display = 'none';
    document.getElementById('extractedInfo').style.display = 'none';
    document.getElementById('applyLicenseData').disabled = true;
    extractedLicenseData = null;
}

/**
 * Show Processing Overlay
 */
function showProcessingOverlay(title, message) {
    const overlay = document.getElementById('processingOverlay');
    document.getElementById('processingTitle').textContent = title;
    document.getElementById('processingMessage').textContent = message;
    overlay.style.display = 'flex';
}

/**
 * Hide Processing Overlay
 */
function hideProcessingOverlay() {
    document.getElementById('processingOverlay').style.display = 'none';
}

/**
 * Show Error Message
 */
function showError(message) {
    // You can use your existing notification system
    // For now, using alert
    alert('Error: ' + message);
}

/**
 * Show Success Message
 */
function showSuccess(message) {
    // You can use your existing notification system
    // For now, using alert
    alert('Success: ' + message);
}