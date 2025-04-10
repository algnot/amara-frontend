import {
  AddCourseRequest,
  AddPermissionRequest,
  AddPermissionResponse,
  AddSalePersonRequest,
  AddStudentRequest,
  CourseResponse,
  CreateUserRequest,
  CreateUserResponse,
  ErrorResponse,
  GenerateStudentUserByIdResponse,
  GetCertificateResponse,
  ListCertificateResponse,
  ListCourseResponse,
  ListPermissionResponse,
  ListSalePersonResponse,
  ListStudentResponse,
  ListUserResponse,
  LoginRequest,
  LoginResponse,
  RequestCertificateRequest,
  RequestCertificateResponse,
  SalePerson,
  SalePersonResponse,
  StudentResponse,
  UpdateCertificateRequest,
  UpdateStudentRequest,
  UpdateUserRequest,
  UserType,
} from "@/types/request";
import axios, { AxiosInstance } from "axios";
import { getItem, removeItem, setItem } from "./storage";

const handlerError = (error: unknown): ErrorResponse => {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data && error.response.data.message) {
      return {
        status: false,
        message: error.response.data.message,
      };
    } else {
      return {
        status: false,
        message: error.message,
      };
    }
  } else {
    return {
      status: false,
      message: "An unknow error occurred. try again!",
    };
  }
};

export class BackendClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_PATH,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getItem("access_token")}`,
      },
    });
  }

  async getUserInfo(): Promise<UserType | ErrorResponse> {
    try {
      const response = await this.client.get("/auth/me");
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.getUserInfo();
        }
        return {
          email: "",
          username: "",
          role: "USER",
          image_url: "",
          uid: 0,
          permissions: [],
        };
      }
      return handlerError(e);
    }
  }

  async generateNewAccessToken(): Promise<ErrorResponse | void> {
    try {
      const response = await this.client.get("/auth/generate-access-token");
      setItem("access_token", response.data.access_token);
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        removeItem("refresh_token");
      }
      return handlerError(e);
    }
  }

  async login(payload: LoginRequest): Promise<LoginResponse | ErrorResponse> {
    try {
      const response = await this.client.post("/auth/login", payload);
      setItem("access_token", response.data.access_token);
      setItem("refresh_token", response.data.refresh_token);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async loginWithGoogle(token: string): Promise<LoginResponse | ErrorResponse> {
    try {
      const response = await this.client.post("/auth/google", {
        token
      });
      setItem("access_token", response.data.access_token);
      setItem("refresh_token", response.data.refresh_token);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async listSalePerson(
    limit: number,
    offset: number | "",
    text: string
  ): Promise<ListSalePersonResponse | ErrorResponse> {
    try {
      const response = await this.client.get(
        `/data/list?limit=${limit}&offset=${offset}&text=${text}&model=sale_person`
      );
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.listSalePerson(limit, offset, text);
        }
      }
      return handlerError(e);
    }
  }

  async listStudent(
    limit: number,
    offset: number | "",
    text: string
  ): Promise<ListStudentResponse | ErrorResponse> {
    try {
      const response = await this.client.get(
        `/data/list?limit=${limit}&offset=${offset}&text=${text}&model=student`,
      );
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.listStudent(limit, offset, text);
        }
      }
      return handlerError(e);
    }
  }

  async addNewStudent(
    payload: AddStudentRequest
  ): Promise<StudentResponse | ErrorResponse> {
    try {
      const response = await this.client.post("/student/new", payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async addNewPermission(
    payload: AddPermissionRequest
  ): Promise<AddPermissionResponse | ErrorResponse> {
    try {
      const response = await this.client.post("/permission/new", payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getStudentByStudentCode(
    studentCode: string
  ): Promise<StudentResponse | ErrorResponse> {
    try {
      const response = await this.client.get("/student/get/" + studentCode);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getCourseById(id: string): Promise<CourseResponse | ErrorResponse> {
    try {
      const response = await this.client.get("/course/get/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getPermissionById(id: string): Promise<AddPermissionResponse | ErrorResponse> {
    try {
      const response = await this.client.get("/permission/get/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async listUser(
    limit: number,
    offset: number | "",
    text: string
  ): Promise<ListUserResponse | ErrorResponse> {
    try {
      const response = await this.client.get(`/data/list?limit=${limit}&offset=${offset}&text=${text}&model=user`);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.listUser(limit, offset, text);
        }
      }
      return handlerError(e);
    }
  }

  async listPermission(
    limit: number,
    offset: number | "",
    text: string
  ): Promise<ListPermissionResponse | ErrorResponse> {
    try {
      const response = await this.client.get(`/data/list?limit=${limit}&offset=${offset}&text=${text}&model=permission`);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.listPermission(limit, offset, text);
        }
      }
      return handlerError(e);
    }
  }

  async addNewSalePerson(
    payload: AddSalePersonRequest
  ): Promise<SalePersonResponse | ErrorResponse> {
    try {
      const response = await this.client.post(`/sale-person/new`, payload);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.addNewSalePerson(payload);
        }
      }
      return handlerError(e);
    }
  }

  async getSalePersonById(id: string): Promise<SalePerson | ErrorResponse> {
    try {
      const response = await this.client.get("/sale-person/get/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async updateSalePersonById(
    id: string,
    payload: AddSalePersonRequest
  ): Promise<SalePerson | ErrorResponse> {
    try {
      const response = await this.client.put("/sale-person/update/" + id, payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async updatePermissionById(
    id: string,
    payload: AddPermissionRequest
  ): Promise<AddPermissionResponse | ErrorResponse> {
    try {
      const response = await this.client.put("/permission/update/" + id, payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async updateStudentById(
    id: string,
    payload: UpdateStudentRequest
  ): Promise<StudentResponse | ErrorResponse> {
    try {
      const response = await this.client.put("/student/update/" + id, payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async generateStudentUserById(
    id: string,
  ): Promise<GenerateStudentUserByIdResponse | ErrorResponse> {
    try {
      const response = await this.client.post("/student/generate-user/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async listCourse(
    limit: number,
    offset: number | "",
    text: string
  ): Promise<ListCourseResponse | ErrorResponse> {
    try {
      const response = await this.client.get(`/data/list?limit=${limit}&offset=${offset}&text=${text}&model=course`);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.listCourse(limit, offset, text);
        }
      }
      return handlerError(e);
    }
  }

  async listCertificate(
    limit: number,
    offset: number | "",
    text: string
  ): Promise<ListCertificateResponse | ErrorResponse> {
    try {
      const response = await this.client.get(`/data/list?limit=${limit}&offset=${offset}&text=${text}&model=certificate`);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.listCertificate(limit, offset, text);
        }
      }
      return handlerError(e);
    }
  }

  async listDraftCertificate(
    limit: number,
    offset: number | "",
    text: string
  ): Promise<ListCertificateResponse | ErrorResponse> {
    try {
      const response = await this.client.get(`/data/list?limit=${limit}&offset=${offset}&text=draft&model=certificate`);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.listCertificate(limit, offset, text);
        }
      }
      return handlerError(e);
    }
  }

  async addNewCourse(
    payload: AddCourseRequest
  ): Promise<CourseResponse | ErrorResponse> {
    try {
      const response = await this.client.post(`/course/new`, payload);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.addNewCourse(payload);
        }
      }
      return handlerError(e);
    }
  }

  async createUser(
    payload: CreateUserRequest
  ): Promise<CreateUserResponse | ErrorResponse> {
    try {
      const response = await this.client.post(`/user/create`, payload);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.createUser(payload);
        }
      }
      return handlerError(e);
    }
  }

  async updateUserById(
    id: string,
    payload: UpdateUserRequest
  ): Promise<CreateUserResponse | ErrorResponse> {
    try {
      const response = await this.client.put(`/user/update/${id}`, payload);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.updateUserById(id, payload);
        }
      }
      return handlerError(e);
    }
  }

  async getUserById(
    id: string
  ): Promise<CreateUserResponse | ErrorResponse> {
    try {
      const response = await this.client.get(`/user/get/` + id);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.getUserById(id);
        }
      }
      return handlerError(e);
    }
  }

  async updateCourse(
    id: string,
    payload: AddCourseRequest
  ): Promise<CourseResponse | ErrorResponse> {
    try {
      const response = await this.client.put(`/course/update/${id}`, payload);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.addNewCourse(payload);
        }
      }
      return handlerError(e);
    }
  }

  async requestCertificate(
    payload: RequestCertificateRequest
  ): Promise<RequestCertificateResponse | ErrorResponse> {
    try {
      const response = await this.client.post(`/certificate/request`, payload);
      return response.data;
    } catch (e) {
      if (axios.isAxiosError(e) && e.status === 403) {
        removeItem("access_token");
        const refreshToken = getItem("refresh_token");
        if (refreshToken) {
          await this.generateNewAccessToken();
          return this.requestCertificate(payload);
        }
      }
      return handlerError(e);
    }
  }

  async getCertificateById(
    id: string
  ): Promise<GetCertificateResponse | ErrorResponse> {
    try {
      const response = await this.client.get("/certificate/get/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getPublicCertificateById(
    id: string
  ): Promise<GetCertificateResponse | ErrorResponse> {
    try {
      const response = await this.client.get("/certificate/get-certificate/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async deleteCertificateById(
    id: string
  ): Promise<GetCertificateResponse | ErrorResponse> {
    try {
      const response = await this.client.delete("/certificate/delete/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async updateCertificateById(
    id: string,
    payload: UpdateCertificateRequest
  ): Promise<GetCertificateResponse | ErrorResponse> {
    try {
      const response = await this.client.put("/certificate/update/" + id, payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async exportStudentCSV(): Promise<string | ErrorResponse> {
    try {
      const response = await this.client.get("/export/student");
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async exportCertificateCSV(): Promise<string | ErrorResponse> {
    try {
      const response = await this.client.get("/export/certificate");
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async exportCourseCSV(): Promise<string | ErrorResponse> {
    try {
      const response = await this.client.get("/export/course");
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async exportSalePersonCSV(): Promise<string | ErrorResponse> {
    try {
      const response = await this.client.get("/export/sale-person");
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }
}
