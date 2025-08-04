// Simplified Technician Portal JavaScript
class TechnicianPortal {
    constructor() {
        this.apiBase = '/api/technicians';
        this.token = localStorage.getItem('techToken');
        this.technician = JSON.parse(localStorage.getItem('technician') || 'null');
        this.init();
    }

    init() {
        console.log('Technician Portal initialized');
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => this.handleLogout(e));
        }

        // Notification form
        const notificationForm = document.getElementById('notificationForm');
        if (notificationForm) {
            notificationForm.addEventListener('submit', (e) => this.handleSendNotification(e));
        }

        // Area form
        const areaForm = document.getElementById('areaForm');
        if (areaForm) {
            areaForm.addEventListener('submit', (e) => this.handleAreaAssignment(e));
        }
    }

    checkAuthStatus() {
        console.log('Checking auth status...');
        if (this.token && this.technician) {
            console.log('User is authenticated, showing dashboard');
            this.showDashboard();
            this.loadAssignedAreas();
        } else {
            console.log('User is not authenticated, showing login');
            this.showLogin();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        console.log('Login attempt...');
        
        const formData = new FormData(e.target);
        const data = {
            techId: formData.get('techId').trim(),
            password: formData.get('password')
        };

        if (!this.validateLoginData(data)) {
            return;
        }

        this.showSpinner('loginSpinner');
        this.clearAlert('loginAlert');

        try {
            const response = await fetch(`${this.apiBase}/login-by-techid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Login response:', result);

            if (result.success) {
                this.token = result.data.token;
                this.technician = result.data.technician;
                
                // Store in localStorage
                localStorage.setItem('techToken', this.token);
                localStorage.setItem('technician', JSON.stringify(this.technician));
                
                this.showAlert('loginAlert', 'success', 'Login successful!');
                this.showDashboard();
                this.loadAssignedAreas();
            } else {
                this.showAlert('loginAlert', 'error', result.message || 'Login failed. Please check your Tech ID and password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('loginAlert', 'error', 'Network error. Please check your connection and try again.');
        } finally {
            this.hideSpinner('loginSpinner');
        }
    }

    handleLogout(e) {
        e.preventDefault();
        console.log('Logout requested...');
        
        // Clear all data
        this.token = null;
        this.technician = null;
        
        // Clear localStorage
        localStorage.removeItem('techToken');
        localStorage.removeItem('technician');
        
        // Clear forms
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
        
        const notificationForm = document.getElementById('notificationForm');
        if (notificationForm) notificationForm.reset();
        
        const areaForm = document.getElementById('areaForm');
        if (areaForm) areaForm.reset();
        
        // Clear alerts
        this.clearAlert('loginAlert');
        this.clearAlert('notificationAlert');
        this.clearAlert('areaAlert');
        
        // Show login section
        this.showLogin();
        
        console.log('Logout completed, reloading page...');
        
        // Reload page to ensure clean state
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }

    async handleSendNotification(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const selectedAreas = Array.from(formData.getAll('notificationAreas'));
        const data = {
            areas: selectedAreas,
            message: formData.get('message').trim()
        };

        if (!this.validateNotificationData(data)) {
            return;
        }

        this.showSpinner('sendSpinner');
        this.clearAlert('notificationAlert');

        try {
            const response = await fetch('/api/notifications/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                const areaText = selectedAreas.length === 1 ? selectedAreas[0] : selectedAreas.join(', ');
                const successMessage = `Notification sent successfully! ${result.data.totalSent} emails sent to ${result.data.totalRecipients} recipients across ${result.data.areas.length} area(s).`;
                this.showAlert('notificationAlert', 'success', successMessage);
                e.target.reset();
            } else {
                this.showAlert('notificationAlert', 'error', result.message || 'Failed to send notification. Please try again.');
            }
        } catch (error) {
            console.error('Send notification error:', error);
            this.showAlert('notificationAlert', 'error', 'Network error. Please check your connection and try again.');
        } finally {
            this.hideSpinner('sendSpinner');
        }
    }

    async handleAreaAssignment(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const selectedAreas = Array.from(formData.getAll('areas'));

        if (selectedAreas.length === 0) {
            this.showAlert('areaAlert', 'error', 'Please select at least one area.');
            return;
        }

        this.showSpinner('areaSpinner');
        this.clearAlert('areaAlert');

        try {
            const response = await fetch(`${this.apiBase}/assign-areas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ areas: selectedAreas })
            });

            const result = await response.json();

            if (result.success) {
                this.showAlert('areaAlert', 'success', 'Areas assigned successfully!');
                this.loadAssignedAreas();
            } else {
                this.showAlert('areaAlert', 'error', result.message || 'Failed to assign areas.');
            }
        } catch (error) {
            console.error('Area assignment error:', error);
            this.showAlert('areaAlert', 'error', 'Network error. Please try again.');
        } finally {
            this.hideSpinner('areaSpinner');
        }
    }

    async loadAssignedAreas() {
        try {
            const response = await fetch(`${this.apiBase}/profile`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            const result = await response.json();

            if (result.success && result.data.assignedAreas) {
                // Pre-select assigned areas in the area assignment form
                const areaCheckboxes = document.querySelectorAll('input[name="areas"]');
                areaCheckboxes.forEach(checkbox => {
                    checkbox.checked = result.data.assignedAreas.includes(checkbox.value);
                });
            }
        } catch (error) {
            console.error('Load assigned areas error:', error);
        }
    }

    validateLoginData(data) {
        const errors = [];

        if (!data.techId || data.techId.length < 1) {
            errors.push('Tech ID is required');
        }

        if (!data.password || data.password.length < 1) {
            errors.push('Password is required');
        }

        if (errors.length > 0) {
            this.showAlert('loginAlert', 'error', errors.join('. '));
            return false;
        }

        return true;
    }

    validateNotificationData(data) {
        const errors = [];

        if (data.areas.length === 0) {
            errors.push('Please select at least one area for notification.');
        }

        if (!data.message || data.message.length < 10) {
            errors.push('Message must be at least 10 characters long');
        }

        if (errors.length > 0) {
            this.showAlert('notificationAlert', 'error', errors.join('. '));
            return false;
        }

        return true;
    }

    showDashboard() {
        const loginSection = document.getElementById('loginSection');
        const dashboardSection = document.getElementById('dashboardSection');
        
        if (loginSection) loginSection.classList.add('hidden');
        if (dashboardSection) dashboardSection.classList.remove('hidden');
        
        if (this.technician) {
            const techNameElement = document.getElementById('techName');
            if (techNameElement) {
                techNameElement.textContent = this.technician.name;
            }
        }
    }

    showLogin() {
        const loginSection = document.getElementById('loginSection');
        const dashboardSection = document.getElementById('dashboardSection');
        
        if (loginSection) loginSection.classList.remove('hidden');
        if (dashboardSection) dashboardSection.classList.add('hidden');
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

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, creating technician portal...');
    window.technicianPortal = new TechnicianPortal();
}); 