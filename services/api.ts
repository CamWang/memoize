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
    created_at: string;
  };
}

interface Category {
  id?: number;
  name: string;
  description: string;
  priority: number;
}

interface Card {
  id?: number;
  front: string;
  back: string;
  tags: string[];
  category_id: number;
  study_count?: number;
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
    const formData = {
      username: username,
      password: password,
    };

    const response = await fetch(`${BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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

export const categoryApi = {
  create: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (data: Category) => {
      return request('/categories/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

  list: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async () => {
      return request('/categories/');
    },
};

export const cardApi = {
  create: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (data: Card) => {
      return request('/cards/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

  list: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (categoryId?: number, tag?: string) => {
      const params = new URLSearchParams();
      if (categoryId) params.append('category_id', categoryId.toString());
      if (tag) params.append('tag', tag);
      
      return request(`/cards/${params.toString() ? `?${params.toString()}` : ''}`);
    },

  update: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (id: number, data: Partial<Card>) => {
      return request(`/cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

  delete: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (id: number) => {
      return request(`/cards/${id}`, {
        method: 'DELETE',
      });
    },

  study: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (id: number, success: boolean) => {
      return request(`/cards/${id}/study`, {
        method: 'POST',
        body: JSON.stringify({ success }),
      });
    },
};

