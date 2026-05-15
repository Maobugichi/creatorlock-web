export type Role = "creator" | "buyer";

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface SignupResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: Role | "admin";
  };
  accessToken: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}