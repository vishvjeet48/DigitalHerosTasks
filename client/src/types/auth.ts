export interface Admin {
  username: string;
}

export interface LoginFormData {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
