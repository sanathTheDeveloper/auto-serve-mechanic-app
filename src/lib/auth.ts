export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  shopName: string;
  isNewUser: boolean;
  hasCompletedProfile: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Simple auth state management - in production, use proper auth provider
class AuthManager {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false
  };
  
  private listeners: Set<(state: AuthState) => void> = new Set();

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  getState(): AuthState {
    return this.state;
  }

  async signUp(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    shopName: string;
  }): Promise<User> {
    this.state.isLoading = true;
    this.notify();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: `user_${Date.now()}`,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      shopName: userData.shopName,
      isNewUser: true,
      hasCompletedProfile: false
    };

    this.state = {
      user,
      isAuthenticated: true,
      isLoading: false
    };

    // Store in localStorage for persistence
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    this.notify();
    return user;
  }

  async signIn(email: string): Promise<User> {
    this.state.isLoading = true;
    this.notify();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock existing user (in production, this would come from your API)
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      firstName: "John",
      lastName: "Doe",
      phone: "(03) 9XXX XXXX",
      shopName: "John's Auto Service",
      isNewUser: false,
      hasCompletedProfile: true
    };

    this.state = {
      user,
      isAuthenticated: true,
      isLoading: false
    };

    // Store in localStorage for persistence
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    this.notify();
    return user;
  }

  async socialAuth(provider: 'google' | 'facebook'): Promise<User> {
    this.state.isLoading = true;
    this.notify();

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // For demo purposes, assume social auth creates a new user
    const user: User = {
      id: `user_${Date.now()}`,
      email: `user@${provider}.com`,
      firstName: "Social",
      lastName: "User",
      phone: "",
      shopName: "",
      isNewUser: true,
      hasCompletedProfile: false
    };

    this.state = {
      user,
      isAuthenticated: true,
      isLoading: false
    };

    // Store in localStorage for persistence
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    this.notify();
    return user;
  }

  async completeProfile(): Promise<void> {
    if (this.state.user) {
      const updatedUser = {
        ...this.state.user,
        isNewUser: false,
        hasCompletedProfile: true
      };

      this.state.user = updatedUser;
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
      this.notify();
    }
  }

  signOut(): void {
    this.state = {
      user: null,
      isAuthenticated: false,
      isLoading: false
    };
    
    localStorage.removeItem('auth_user');
    this.notify();
  }

  // Initialize auth state from localStorage
  initialize(): void {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as User;
        this.state = {
          user,
          isAuthenticated: true,
          isLoading: false
        };
        this.notify();
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('auth_user');
      }
    }
  }
}

export const authManager = new AuthManager();