let generatedOTP = null;
const BACKEND_URL = 'http://localhost:3000'; // Local server URL

// Function to handle OTP generation and sending
async function handleOTPGeneration(email) {
    const responseMessage = document.getElementById('response-message');
    
    if (!email) {
        responseMessage.innerText = "Please enter your email address first.";
        responseMessage.className = "response-message error";
        return;
    }
    
    try {
        responseMessage.innerText = "Sending OTP...";
        responseMessage.className = "response-message";
        
        console.log('Sending OTP request to:', email);
        const response = await fetch(`${BACKEND_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            generatedOTP = data.otp;
            responseMessage.innerText = "OTP has been sent to your email!";
            responseMessage.className = "response-message success";
        } else {
            throw new Error(data.error || 'Failed to send OTP');
        }
    } catch (error) {
        console.error('Error:', error);
        responseMessage.innerText = `Failed to send OTP: ${error.message}`;
        responseMessage.className = "response-message error";
    }
}

// Add event listener for generate OTP button
document.getElementById('generate-otp').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    handleOTPGeneration(email);
});

// Handle form submission
document.getElementById('contact-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    const responseMessage = document.getElementById('response-message');
    
    if (!generatedOTP) {
        responseMessage.innerText = "Please generate OTP first.";
        responseMessage.className = "response-message error";
        return;
    }
    
    try {
        console.log('Verifying OTP...');
        const response = await fetch(`${BACKEND_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp, originalOtp: generatedOTP })
        });
        
        console.log('Verification response status:', response.status);
        const data = await response.json();
        console.log('Verification response data:', data);
        
        if (data.success) {
            responseMessage.innerText = "Email verified successfully!";
            responseMessage.className = "response-message success";
        } else {
            responseMessage.innerText = "Invalid OTP. Please try again.";
            responseMessage.className = "response-message error";
        }
    } catch (error) {
        console.error('Error:', error);
        responseMessage.innerText = `An error occurred: ${error.message}`;
        responseMessage.className = "response-message error";
    }
});
  