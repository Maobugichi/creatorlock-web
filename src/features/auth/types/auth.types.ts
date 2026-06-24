export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

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

export type Role = "creator" | "buyer";
export type OnboardingStep = "role" | "profile" | "slug";

export interface OnboardingInput {
  role: Role;
  name: string;
  storeSlug?: string;
}

export interface ResetPasswordInput {
  token: string;
  new_password: string;
}

export interface SignupInput {
  email: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  user: {
    id: string;
    email: string;
  };
  accessToken: string;
}