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
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "STUDENT";
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
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "STUDENT";
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
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "STUDENT";
  user_id: number;
  username: string;
}

export interface ListSalePersonResponse {
  next: number;
  datas: SalePerson[];
}

export interface ListUserResponse {
  next: number;
  datas: UserType[];
}

export interface ListPermissionResponse {
  next: number;
  datas: Permission[];
}

export interface Permission {
  id: number;
  key: string;
  name: string;
  description: string;
}

export interface ListStudentResponse {
  next: number;
  datas: StudentResponse[];
}

export interface SalePerson {
  id: string;
  firstname: string;
  lastname: string;
  reference_code: string;
}

export interface UserType {
  email: string;
  username: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "STUDENT";
  image_url: string;
  uid: number;
  permissions: string[];
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

export interface AddStudentRequest {
  firstname_th: string;
  lastname_th: string;
  firstname_en: string;
  lastname_en: string;
  ref_code: string;
}

export interface StudentResponse {
  id: string;
  firstname_th: string;
  lastname_th: string;
  firstname_en: string;
  lastname_en: string;
  student_id: string;
  sale_person: string;
  certificate: GetCertificateResponse[];
  user_id: number;
}

export interface GenerateStudentUserByIdResponse {
  login: string;
  password: string;
}

export interface AddPermissionRequest {
  key: string;
  name: string;
  description: string;
}

export interface AddPermissionResponse {
  id: string;
  key: string;
  name: string;
  description: string;
}

export interface AddSalePersonRequest {
  firstname: string;
  lastname: string;
  code: string;
}

export interface UpdateStudentRequest {
  firstname_th: string;
  lastname_th: string;
  firstname_en: string;
  lastname_en: string;
}

export interface SalePersonResponse {
  firstname: string;
  lastname: string;
  code: string;
  id: number;
}

export interface ListCourseResponse {
  next: number;
  datas: CourseResponse[];
}

export interface CourseResponse {
  id: number;
  course_code: string;
  name_en: string,
  name_th: string,
  version: string,
}

export interface AddCourseRequest {
  course_code: string;
  name_th: string;
  name_en: string;
  version: string;
}

export interface ListCertificateResponse {
  next: number;
  datas: CertificateResponse[];
}

export interface CertificateResponse {
  id: number;
  certificate_number: string;
  batch: string,
  start_date: string,
  end_date: string,
}

export interface RequestCertificateRequest {
  student_id: number;
  course_id: number;
  start_date: string;
  end_date: string;
}

export interface RequestCertificateResponse {
  id: number;
  student_id: number;
  certificate_number: number;
  batch: number;
  course_id: number;
  given_date: string;
  start_date: string;
  end_date: string;
}

export interface GetCertificateResponse {
  id: number;
  certificate_number: number;
  student: StudentResponse;
  course: CourseResponse;
  batch: string;
  given_date: string;
  start_date: string;
  end_date: string;
}

export interface UpdateCertificateRequest {
  start_date: string;
  end_date: string;
  batch: string;
  given_date: number;
}

export interface GetCertificateParamRequest {
  number: string;
  name: string;
  course_name: string;
  certificate_date: string;
  date: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  permissions: number[];
}

export interface UpdateUserRequest {
  username: string;
  email: string;
  password?: string;
  role: string;
  permissions: number[];
}

export interface CreateUserResponse {
  username: string;
  email: string;
  image_url: string;
  role: string;
  permissions: number[];
  user_id: number;
  google_uid?: string;
}
