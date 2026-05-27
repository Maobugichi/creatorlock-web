export type Role = "creator" | "buyer";

export interface SignupInput {
  email: string;
  password: string;
}

export interface SignupResponse {
  message:string;
  user: {
    id: string;
    email: string;
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