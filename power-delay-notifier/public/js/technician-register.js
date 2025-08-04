// Technician Registration JavaScript
class TechnicianRegistration {
    constructor() {
        this.apiBase = '/api/technicians';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        const registrationForm = document.getElementById('registrationForm');
        if (registrationForm) {
            registrationForm.addEventListener('submit', (e) => this.handleRegistration(e));
        }
    }

    async handleRegistration(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            techId: formData.get('techId').trim(),
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validation
        if (!this.validateRegistrationData(data)) {
            return;
        }

        this.showSpinner('registerSpinner');
        this.clearAlert('registerAlert');

        try {
            const response = await fetch(`${this.apiBase}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    techId: data.techId,
                    name: data.name,
                    email: data.email,
                    password: data.password
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('registerAlert', 'success', 
                    'Registration successful! You can now login with your Tech ID and password.');
                e.target.reset();
                
                // Redirect to technician portal after 2 seconds
                setTimeout(() => {
                    window.location.href = '/technician.html';
                }, 2000);
            } else {
                this.showAlert('registerAlert', 'error', result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showAlert('registerAlert', 'error', 'Network error. Please check your connection and try again.');
        } finally {
            this.hideSpinner('registerSpinner');
        }
    }

    validateRegistrationData(data) {
        const errors = [];

        // Tech ID validation
        if (!data.techId || data.techId.length < 3 || data.techId.length > 20) {
            errors.push('Tech ID must be between 3 and 20 characters');
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(data.techId)) {
            errors.push('Tech ID can only contain letters, numbers, hyphens, and underscores');
        }

        // Name validation
        if (!data.name || data.name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        if (!/^[a-zA-Z\s]+$/.test(data.name)) {
            errors.push('Name can only contain letters and spaces');
        }

        // Email validation
        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        // Password validation
        if (!data.password || data.password.length < 6) {
            errors.push('Password must be at least 6 characters long');
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
            errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
        }

        // Confirm password validation
        if (data.password !== data.confirmPassword) {
            errors.push('Passwords do not match');
        }

        if (errors.length > 0) {
            this.showAlert('registerAlert', 'error', errors.join('. '));
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showSpinner(spinnerId) {
        const spinner = document.getElementById(spinnerId);
        if (spinner) {
            spinner.classList.remove('hidden');
        }
    }

    hideSpinner(spinnerId) {
        const spinner = document.getElementById(spinnerId);
        if (spinner) {
            spinner.classList.add('hidden');
        }
    }

    showAlert(alertId, type, message) {
        const alertDiv = document.getElementById(alertId);
        if (alertDiv) {
            alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    clearAlert(alertId) {
        const alertDiv = document.getElementById(alertId);
        if (alertDiv) {
            alertDiv.innerHTML = '';
        }
    }
}

// Initialize the technician registration when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TechnicianRegistration();
}); 