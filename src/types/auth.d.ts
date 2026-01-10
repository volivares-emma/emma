export interface AuthResponse {
  user: {
    id: number;
    username: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
