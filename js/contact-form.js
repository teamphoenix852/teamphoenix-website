document.addEventListener('DOMContentLoaded', function() {   
    // Initialize contact form if it exists
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (!submitBtn || !formStatus) {
        console.error('Required form elements not found');
        return;
    }

    // Now safe to use these elements
    submitBtn.disabled = false;
    formStatus.textContent = '';
    
    // Set JavaScript challenge value
    const jsChallenge = document.getElementById('js_challenge');
    if (jsChallenge) {
        jsChallenge.value = Math.floor(Math.random() * 100) + 'human_' + Math.floor(Math.random() * 100);
    }
    
    // Set form load time
    const formLoadTime = document.getElementById('form_load_time');
    if (formLoadTime) {
        formLoadTime.value = Date.now();
    }
    
    // Track form interaction
    let interactedWithForm = false;
    const formFields = form.querySelectorAll('input, textarea, select');
    formFields.forEach(field => {
        field.addEventListener('input', () => interactedWithForm = true);
        field.addEventListener('change', () => interactedWithForm = true);
    });
    
    // Rate limiting
    const lastSubmission = localStorage.getItem('lastFormSubmission');
    if (lastSubmission && submitBtn) {
        const timeSinceLast = Date.now() - parseInt(lastSubmission);
        if (timeSinceLast < 300000) { // 5 minute cooldown
            submitBtn.disabled = true;
            const minutesLeft = Math.ceil((300000 - timeSinceLast)/60000);
            submitBtn.innerHTML = `Please wait ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}`;
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            }, 300000 - timeSinceLast);
        }
    }
    
    // Form submission handler
	form.addEventListener('submit', async function(e) {
		e.preventDefault();
		
		// Reset status
		if (formStatus) {
			formStatus.textContent = '';
			formStatus.className = '';
		}
		
		// Show loading state
		form.classList.add('form-loading');
		if (submitBtn) submitBtn.disabled = true;
		
		// Validate form
		const validationResult = validateForm();
		if (!validationResult.isValid) {
			showError('Please correct the errors in the form');
			return false;
		}
		
		// Validate reCAPTCHA
		const captchaResponse = grecaptcha.getResponse();
		if (!captchaResponse) {
			showError('Please complete the reCAPTCHA verification');
			document.getElementById('captcha-error').textContent = 'Please complete the security check';
			return false;
		}
		
		// Security checks
		if (!performSecurityChecks()) {
			return false;
		}
		
		// Sanitize inputs
		const formData = {
			name: sanitizeInput(document.getElementById('name').value),
			email: sanitizeInput(document.getElementById('email').value),
			phone: sanitizeInput(document.getElementById('phone').value),
			subject: sanitizeInput(document.getElementById('subject').value),
			message: sanitizeInput(document.getElementById('message').value),
			'g-recaptcha-response': captchaResponse
		};
		
		// Validate email format
		if (!validateEmail(formData.email)) {
			showError('Please enter a valid email address');
			document.getElementById('email-error').textContent = 'Please enter a valid email address';
			return false;
		}
		
		try {
			// Send email via FormSubmit.co (free service)
			const response = await fetch('https://formsubmit.co/ajax/inquiry@teamphoenix.com.hk', {
				method: 'POST',
				headers: { 
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					phone: formData.phone,
					subject: formData.subject,
					message: formData.message,
					'g-recaptcha-response': formData['g-recaptcha-response']
				})
			});
			
			const result = await response.json();
			
			if (response.ok) {
				// Show success message
				formStatus.textContent = 'Thank you for your message! We will get back to you soon.';
				formStatus.className = 'success';
				
				// Update rate limiting
				localStorage.setItem('lastFormSubmission', Date.now());
				
				// Reset form after delay
				setTimeout(() => {
					form.reset();
					form.classList.remove('form-loading');
					if (submitBtn) submitBtn.disabled = false;
					interactedWithForm = false;
					grecaptcha.reset();
					
					// Reset timestamp
					if (formLoadTime) formLoadTime.value = Date.now();
				}, 3000);
			} else {
				showError('There was an error sending your message. Please try again later.');
				console.error('Form submission error:', result);
			}
		} catch (error) {
			showError('There was a network error. Please check your connection and try again.');
			console.error('Network error:', error);
		}
	});
    
    // Form validation function
    function validateForm() {
        let isValid = true;
        const requiredFields = ['name', 'email', 'subject', 'message'];
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const errorElement = document.getElementById(`${fieldId}-error`);
            
            // Skip if elements don't exist
            if (!field || !errorElement) return;
            
            if (!field.value.trim()) {
                errorElement.textContent = 'This field is required';
                isValid = false;
            } else {
                errorElement.textContent = '';
            }
        });
        
        return { isValid };
    }
    
    // Security checks
    function performSecurityChecks() {
        // 1. Honeypot fields check
        const honeypotFields = ['hp_name', 'hp_email', 'hp_comment'];
        for (const id of honeypotFields) {
            const field = document.getElementById(id);
            if (field && field.value.trim() !== '') {
                showError('Invalid submission detected');
                return false;
            }
        }
        
        // 2. JavaScript challenge check
        const jsChallenge = document.getElementById('js_challenge');
        if (jsChallenge && jsChallenge.value.indexOf('human_') === -1) {
            showError('Security validation failed');
            return false;
        }
        
        // 3. Minimum time check (at least 5 seconds)
        const formLoadTime = document.getElementById('form_load_time');
        if (formLoadTime && (Date.now() - parseInt(formLoadTime.value) < 5000)) {
            showError('Please take your time to fill out the form');
            return false;
        }
        
        // 4. Interaction check
        if (!interactedWithForm) {
            showError('Please actually fill out the form');
            return false;
        }
        
        return true;
    }
    
    // Show error function
    function showError(message) {
        if (formStatus) {
            formStatus.textContent = message;
            formStatus.className = 'error';
        }
        form.classList.remove('form-loading');
        if (submitBtn) submitBtn.disabled = false;
        grecaptcha.reset();
    }
    
    // Input sanitization function
    function sanitizeInput(input) {
        // Basic HTML tag stripping
        return input.replace(/<[^>]*>/g, '');
    }
    
    // Email validation function
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Input validation on blur
    formFields.forEach(input => {
        input.addEventListener('blur', function() {
            const errorElement = document.getElementById(`${this.id}-error`);
            if (!errorElement) return;
            
            if (this.required && !this.value.trim()) {
                errorElement.textContent = 'This field is required';
            } else {
                errorElement.textContent = '';
                
                // Email validation
                if (this.id === 'email' && this.value && !validateEmail(this.value)) {
                    errorElement.textContent = 'Please enter a valid email address';
                }
                
                // Phone validation
                if (this.id === 'phone' && this.value && !/^[0-9]{8,15}$/.test(this.value)) {
                    errorElement.textContent = 'Please enter 8-15 digits only';
                }
            }
        });
    });
});