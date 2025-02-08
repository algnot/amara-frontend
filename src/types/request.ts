export interface ErrorResponse {
  status: boolean;
  message: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isErrorResponse = (data: any): data is ErrorResponse => {
  return typeof data.status === "boolean" && typeof data.message === "string";
};

export interface GetUserInfoResponse {
  email: string;
  image_url: string;
  role: "USER" | "ADMIN";
  user_id: number;
  username: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  access_token: string;
  email: string;
  image_url: string;
  refresh_token: string;
  role: "USER" | "ADMIN";
  user_id: number;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  email: string;
  image_url: string;
  refresh_token: string;
  role: "USER" | "ADMIN";
  user_id: number;
  username: string;
}

export interface ListSalePersonResponse {
  next: number;
  datas: SalePerson[];
}

export interface SalePerson {
  firstname: string;
  lastname: string;
  reference_code: string;
}

export interface UserType {
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  image_url: string;
  uid: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isUserType = (data: any): data is UserType => {
  return (
    typeof data.email === "string" &&
    typeof data.username === "string" &&
    typeof data.role === "string" &&
    typeof data.image_url === "string" &&
    typeof data.uid === "number"
  );
};
