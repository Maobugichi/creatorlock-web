export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: "creator" | "buyer" | "admin";
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