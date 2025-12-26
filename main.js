let generatedOTP = null;
let isGeneratingOTP = false;
let emailOTPMap = {}; // Store OTP per email to avoid regenerating
let debounceTimer = null;

// Determine backend URL based on environment
// For localhost, use port 3000, otherwise use the same origin
const BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? `http://${window.location.hostname}:3000` 
    : window.location.origin;

console.log('Using backend URL:', BACKEND_URL);

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Debounce function for performance
function debounce(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(debounceTimer);
            func(...args);
        };
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(later, wait);
    };
}

// Show loading state
function showLoading(element, isLoading) {
    if (isLoading) {
        element.classList.add('loading');
        element.disabled = true;
    } else {
        element.classList.remove('loading');
        element.disabled = false;
    }
}

// Function to handle OTP generation and sending
async function handleOTPGeneration(email, showLoadingState = true) {
    const responseMessage = document.getElementById('response-message');
    const generateBtn = document.getElementById('generate-otp');
    const emailInput = document.getElementById('email');
    
    // Prevent multiple simultaneous requests
    if (isGeneratingOTP) {
        return false;
    }
    
    if (!email) {
        responseMessage.innerText = "Please enter your email address first.";
        responseMessage.className = "response-message error";
        responseMessage.style.display = 'block';
        return false;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        responseMessage.innerText = "Please enter a valid email address.";
        responseMessage.className = "response-message error";
        responseMessage.style.display = 'block';
        return false;
    }
    
    // Check if OTP already generated for this email
    if (emailOTPMap[email]) {
        generatedOTP = emailOTPMap[email];
        responseMessage.innerText = "OTP already sent! Check your email.";
        responseMessage.className = "response-message success";
        responseMessage.style.display = 'block';
        document.getElementById('otp').focus();
        return true;
    }
    
    isGeneratingOTP = true;
    
    if (showLoadingState) {
        showLoading(generateBtn, true);
        emailInput.classList.add('sending');
    }
    
    try {
        responseMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending OTP...';
        responseMessage.className = "response-message loading-message";
        responseMessage.style.display = 'block';
        
        // Use AbortController for timeout - 30 seconds for remote servers
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        
        // Try to wake up the server first with a health check (only for remote servers)
        if (!BACKEND_URL.includes('localhost') && !BACKEND_URL.includes('127.0.0.1')) {
            try {
                const healthController = new AbortController();
                const healthTimeout = setTimeout(() => healthController.abort(), 5000);
                const healthCheck = await fetch(`${BACKEND_URL}/health`, {
                    method: 'GET',
                    signal: healthController.signal
                });
                clearTimeout(healthTimeout);
                console.log('Health check response:', healthCheck.status);
            } catch (healthError) {
                console.log('Health check failed, proceeding anyway:', healthError);
            }
        }
        
        console.log('Sending OTP request to:', `${BACKEND_URL}/send-otp`);
        const response = await fetch(`${BACKEND_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
            generatedOTP = data.otp;
            emailOTPMap[email] = data.otp; // Store OTP for this email
            responseMessage.innerHTML = '<i class="fas fa-check-circle"></i> OTP has been sent to your email!';
            responseMessage.className = "response-message success";
            
            // Animate OTP field
            const otpInput = document.getElementById('otp');
            otpInput.classList.add('pulse');
            setTimeout(() => otpInput.classList.remove('pulse'), 1000);
            otpInput.focus();
            
            return true;
        } else {
            throw new Error(data.error || 'Failed to send OTP');
        }
    } catch (error) {
        console.error('Error:', error);
        if (error.name === 'AbortError') {
            responseMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Request timeout. The server might be sleeping. Please try again in a few seconds.';
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            responseMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Cannot connect to server. Please make sure the server is running on port 3000.';
        } else {
            responseMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Failed to send OTP: ${error.message}`;
        }
        responseMessage.className = "response-message error";
        return false;
    } finally {
        isGeneratingOTP = false;
        if (showLoadingState) {
            showLoading(generateBtn, false);
            emailInput.classList.remove('sending');
        }
    }
}

// Debounced auto OTP generation
const debouncedAutoOTP = debounce(function(email) {
    if (email && isValidEmail(email) && !emailOTPMap[email] && !isGeneratingOTP) {
        handleOTPGeneration(email, false); // Don't show loading on auto-generate
    }
}, 1500); // Wait 1.5 seconds after user stops typing

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const generateOtpButton = document.getElementById('generate-otp');
    const contactForm = document.getElementById('contact-form');
    const otpInput = document.getElementById('otp');
    const responseMessage = document.getElementById('response-message');
    
    // Auto-generate OTP when user stops typing (with debounce)
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        if (email && isValidEmail(email)) {
            debouncedAutoOTP(email);
        }
    });
    
    // Auto-generate OTP when email field loses focus and email is valid
    emailInput.addEventListener('blur', function() {
        const email = emailInput.value.trim();
        if (email && isValidEmail(email) && !emailOTPMap[email] && !isGeneratingOTP) {
            handleOTPGeneration(email, false);
        }
    });
    
    // Auto-generate OTP when user presses Enter in email field
    emailInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (email && isValidEmail(email)) {
                handleOTPGeneration(email);
            }
        }
    });
    
    // Add event listener for generate OTP button (manual trigger)
    generateOtpButton.addEventListener('click', function() {
        const email = emailInput.value.trim();
        handleOTPGeneration(email);
    });
    
    // Real-time email validation feedback
    emailInput.addEventListener('input', function() {
        const email = emailInput.value.trim();
        if (email && !isValidEmail(email)) {
            emailInput.classList.add('invalid');
        } else {
            emailInput.classList.remove('invalid');
        }
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const otp = otpInput.value.trim();
        
        // Auto-generate OTP if not already generated
        if (!emailOTPMap[email] && !isGeneratingOTP) {
            if (email && isValidEmail(email)) {
                const success = await handleOTPGeneration(email);
                if (success) {
                    responseMessage.innerHTML = '<i class="fas fa-info-circle"></i> Please check your email for OTP and enter it below.';
                    responseMessage.className = "response-message";
                    responseMessage.style.display = 'block';
                }
                return;
            } else {
                responseMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address first.';
                responseMessage.className = "response-message error";
                responseMessage.style.display = 'block';
                return;
            }
        }
        
        if (!generatedOTP) {
            responseMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait for OTP to be generated.';
            responseMessage.className = "response-message loading-message";
            responseMessage.style.display = 'block';
            return;
        }
        
        if (!otp) {
            responseMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Please enter the OTP.';
            responseMessage.className = "response-message error";
            responseMessage.style.display = 'block';
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        showLoading(submitBtn, true);
        responseMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying OTP...';
        responseMessage.className = "response-message loading-message";
        responseMessage.style.display = 'block';
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const response = await fetch(`${BACKEND_URL}/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp, originalOtp: generatedOTP }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const data = await response.json();
            
            if (data.success) {
                responseMessage.innerHTML = '<i class="fas fa-check-circle"></i> Email verified successfully!';
                responseMessage.className = "response-message success";
                contactForm.classList.add('success');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.classList.remove('success');
                    generatedOTP = null;
                    emailOTPMap = {};
                    responseMessage.style.display = 'none';
                }, 2000);
            } else {
                responseMessage.innerHTML = '<i class="fas fa-times-circle"></i> Invalid OTP. Please try again.';
                responseMessage.className = "response-message error";
                otpInput.classList.add('shake');
                setTimeout(() => otpInput.classList.remove('shake'), 500);
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.name === 'AbortError') {
                responseMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Request timeout. Please try again.';
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                responseMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Cannot connect to server. Please make sure the server is running.';
            } else {
                responseMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> An error occurred: ${error.message}`;
            }
            responseMessage.className = "response-message error";
        } finally {
            showLoading(submitBtn, false);
        }
    });
    
    // Add smooth animations on load
    setTimeout(() => {
        document.querySelector('.container').classList.add('loaded');
    }, 100);
});
  