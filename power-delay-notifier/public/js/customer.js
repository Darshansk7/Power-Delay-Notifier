// Customer Portal JavaScript
class CustomerPortal {
    constructor() {
        this.apiBase = '/api/customers';
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Registration form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Update form
        const updateForm = document.getElementById('updateForm');
        if (updateForm) {
            updateForm.addEventListener('submit', (e) => this.handleUpdate(e));
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            area: formData.get('area').trim()
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
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('registerAlert', 'success', 'Registration successful! You will now receive power delay notifications for your area.');
                e.target.reset();
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

    async handleUpdate(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
            email: formData.get('email').trim(),
            area: formData.get('area').trim()
        };

        // Validation
        if (!this.validateUpdateData(data)) {
            return;
        }

        this.showSpinner('updateSpinner');
        this.clearAlert('updateAlert');

        try {
            const response = await fetch(`${this.apiBase}/area`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('updateAlert', 'success', 'Area updated successfully! You will now receive notifications for your new area.');
                e.target.reset();
            } else {
                this.showAlert('updateAlert', 'error', result.message || 'Update failed. Please check your email and try again.');
            }
        } catch (error) {
            console.error('Update error:', error);
            this.showAlert('updateAlert', 'error', 'Network error. Please check your connection and try again.');
        } finally {
            this.hideSpinner('updateSpinner');
        }
    }

    validateRegistrationData(data) {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.area || data.area.length < 2) {
            errors.push('Area must be at least 2 characters long');
        }

        if (errors.length > 0) {
            this.showAlert('registerAlert', 'error', errors.join('. '));
            return false;
        }

        return true;
    }

    validateUpdateData(data) {
        const errors = [];

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.area || data.area.length < 2) {
            errors.push('Area must be at least 2 characters long');
        }

        if (errors.length > 0) {
            this.showAlert('updateAlert', 'error', errors.join('. '));
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

// Initialize the customer portal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CustomerPortal();
}); 