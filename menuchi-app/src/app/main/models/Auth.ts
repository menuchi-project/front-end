export interface SignupRequest {
  phoneNumber: string;
  password: string;
  username: string;
  email: string;
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}
