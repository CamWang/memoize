const BASE_URL = process.env.EXPO_PUBLIC_API_URL

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    email: string;
    // Add any other user fields that come from the API
  };
}

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Registration failed');
    }
    
    return response.json();
  },

  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${BASE_URL}/token`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Login failed');
    }

    return response.json() as Promise<LoginResponse>;
  },
};

export const createAuthenticatedRequest = (token: string) => {
  return async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Request failed');
    }

    return response.json();
  };
};

// Example usage:
export const userApi = {
  getProfile: async (token: string) => {
    const request = createAuthenticatedRequest(token);
    return request('/profile');
  },
  // Add other authenticated endpoints here
}; 