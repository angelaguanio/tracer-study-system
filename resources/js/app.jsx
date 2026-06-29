import '../css/app.css';

import axios from 'axios';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

// Force light mode globally — remove dark class and always apply light
(function enforceLightMode() {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    // Override localStorage so ThemeProvider (if any remains) can't flip it back
    localStorage.setItem('vite-ui-theme', 'light');
})();

// Configure axios globally
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Function to get fresh CSRF token from meta tag
const getCsrfToken = () => {
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
    return csrfToken ? csrfToken.content : null;
};

// Function to update CSRF token
const updateCsrfToken = () => {
    const token = getCsrfToken();
    if (token) {
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
};

// Set initial CSRF token
updateCsrfToken();

// Update CSRF token after each Inertia navigation
router.on('navigate', () => {
    updateCsrfToken();
});

// Update CSRF token after full page loads
router.on('finish', () => {
    updateCsrfToken();
});

// Session keep-alive: ping server every 2 minutes to keep session active
// This prevents CSRF token expiration during long form fills
let keepAliveInterval = null;

const startKeepAlive = () => {
    // Clear any existing interval
    if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
    }
    
    // Ping server every 2 minutes (120000ms) - well before the session expires
    keepAliveInterval = setInterval(() => {
        // Make a lightweight request to keep session alive
        fetch('/api/keep-alive', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        }).catch((error) => {
            console.log('Keep-alive ping failed:', error);
        });
    }, 120000); // 2 minutes
};

// Start keep-alive when app loads
startKeepAlive();

// Restart keep-alive after navigation
router.on('navigate', () => {
    startKeepAlive();
});

// Handle 419 CSRF token mismatch errors globally for Inertia requests
// Show user-friendly message instead of reloading
router.on('error', (event) => {
    // Check multiple possible locations for the status code
    const status = event.detail?.response?.status || 
                   event.detail?.status || 
                   event?.response?.status;
    
    if (status === 419) {
        console.log('CSRF token expired');
        // Show alert to user instead of auto-reloading (which loses form data)
        alert('Your session has expired. Please refresh the page and try again.');
    }
});

// Also handle 419 errors from axios requests
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 419) {
            console.log('CSRF token expired (axios)');
            alert('Your session has expired. Please refresh the page and try again.');
        }
        return Promise.reject(error);
    }
);

const appName = import.meta.env.VITE_APP_NAME || 'Alumni Connect';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
   
});
