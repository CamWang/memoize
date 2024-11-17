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

export interface Category {
  id: number;
  name: string;
  description: string;
  priority: number;
  created_at: string;
  created_by: string;
}

export interface Card {
  id: number;
  front: string;
  back: string;
  category_id: number;
  tags: string[];
  created_at: string;
  username: string;
  study_count: number;
  next_study: string;
  category: Category;
}

interface CreateCategoryRequest {
  name: string;
  description: string;
  priority: number;
}

interface CreateCardRequest {
  front: string;
  back: string;
  category_id: number;
  tags: string[];
}

interface UpdateCardRequest {
  front?: string;
  back?: string;
  category_id?: number;
  tags?: string[];
}

interface ListParams {
  skip?: number;
  limit?: number;
}

interface ListCardsParams extends ListParams {
  study?: boolean;
  category_id?: number;
  tag?: string;
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
    async (data: CreateCategoryRequest): Promise<Category> => {
      return request('/categories/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

  list: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (params?: ListParams): Promise<Category[]> => {
      const queryParams = new URLSearchParams();
      if (params?.skip) queryParams.append('skip', params.skip.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const query = queryParams.toString();
      return request(`/categories/${query ? `?${query}` : ''}`);
    },
};

export const cardApi = {
  create: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (data: CreateCardRequest): Promise<Card> => {
      return request('/cards/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

  list: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (params?: ListCardsParams): Promise<Card[]> => {
      const queryParams = new URLSearchParams();
      
      if (params?.study !== undefined) {
        queryParams.append('study', params.study.toString());
      }
      if (params?.category_id) {
        queryParams.append('category_id', params.category_id.toString());
      }
      if (params?.tag) {
        queryParams.append('tag', params.tag);
      }
      if (params?.skip) {
        queryParams.append('skip', params.skip.toString());
      }
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      const query = queryParams.toString();
      return request(`/cards/${query ? `?${query}` : ''}`);
    },

  update: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (id: number, data: UpdateCardRequest): Promise<Card> => {
      return request(`/cards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },

  delete: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (id: number): Promise<{ message: string }> => {
      return request(`/cards/${id}`, {
        method: 'DELETE',
      });
    },

  study: (request: ReturnType<typeof createAuthenticatedRequest>) => 
    async (id: number, success: boolean): Promise<{ message: string }> => {
      return request(`/cards/${id}/study`, {
        method: 'POST',
        body: JSON.stringify({ success }),
      });
    },
};

export const handleApiError = (error: any) => {
  if (error.status === 400) {
    throw new Error('Bad Request: Invalid data provided');
  } else if (error.status === 401) {
    throw new Error('Unauthorized: Please log in again');
  } else if (error.status === 404) {
    throw new Error('Not Found: The requested resource does not exist');
  } else {
    throw new Error(error.detail || 'An unexpected error occurred');
  }
};

