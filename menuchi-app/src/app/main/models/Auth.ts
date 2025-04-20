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

export interface SignupResponse {
  id: string;
  phoneNumber: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
