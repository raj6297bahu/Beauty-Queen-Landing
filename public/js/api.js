const API_BASE_URL = window.location.origin;

// Get token from localStorage or cookie
const getToken = () => {
    return localStorage.getItem('token') || getCookie('token');
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

// Set token
const setToken = (token) => {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/; max-age=604800`; // 7 days
};

// Remove token
const removeToken = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth API
const authAPI = {
    sendOTP: (email) => apiRequest('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
    }),
    
    signup: (data) => apiRequest('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    
    login: (email, password) => apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    }),
    
    getMe: () => apiRequest('/api/auth/me')
};

// Products API
const productsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/api/products${query ? '?' + query : ''}`);
    },
    
    getById: (id) => apiRequest(`/api/products/${id}`)
};

// Cart API
const cartAPI = {
    get: () => apiRequest('/api/cart'),
    add: (productId, quantity = 1) => apiRequest('/api/cart/add', {
        method: 'POST',
        body: JSON.stringify({ productId, quantity })
    }),
    update: (itemId, quantity) => apiRequest(`/api/cart/update/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity })
    }),
    remove: (itemId) => apiRequest(`/api/cart/remove/${itemId}`, {
        method: 'DELETE'
    }),
    clear: () => apiRequest('/api/cart/clear', {
        method: 'DELETE'
    })
};

// Orders API
const ordersAPI = {
    create: (data) => apiRequest('/api/orders/create', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    verifyPayment: (data) => apiRequest('/api/orders/verify-payment', {
        method: 'POST',
        body: JSON.stringify(data)
    }),
    getMyOrders: () => apiRequest('/api/orders/my-orders')
};

// Feedback API
const feedbackAPI = {
    submit: (data) => apiRequest('/api/feedback/submit', {
        method: 'POST',
        body: JSON.stringify(data)
    })
};

// Check if user is authenticated
const isAuthenticated = () => {
    return !!getToken();
};

// Redirect to login if not authenticated
const requireAuth = () => {
    if (!isAuthenticated()) {
        window.location.href = '/login';
        return false;
    }
    return true;
};

// Logout
const logout = () => {
    removeToken();
    window.location.href = '/';
};

