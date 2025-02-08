import {
  AddSalePersonRequest,
  AddStudentRequest,
  ErrorResponse,
  ListSalePersonResponse,
  ListStudentResponse,
  ListUserResponse,
  LoginRequest,
  LoginResponse,
  SalePerson,
  SalePersonResponse,
  StudentResponse,
  UpdateStudentRequest,
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

const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_PATH,
  headers: {
    "Content-Type": "application/json",
  },
});

export class BackendClient {
  async getUserInfo(): Promise<UserType | ErrorResponse> {
    try {
      const accessToken = getItem("access_token");
      const response = await client.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
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
        };
      }
      return handlerError(e);
    }
  }

  async generateNewAccessToken(): Promise<ErrorResponse | void> {
    try {
      const refreshToken = getItem("refresh_token");
      const response = await client.get("/auth/generate-access-token", {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });
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
      const response = await client.post("/auth/login", payload);
      setItem("access_token", response.data.access_token);
      setItem("refresh_token", response.data.refresh_token);
      await this.getUserInfo();
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
      const accessToken = getItem("access_token");
      const response = await client.get(
        `/data/list?limit=${limit}&offset=${offset}&text=${text}&model=sale_person`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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
      const accessToken = getItem("access_token");
      const response = await client.get(
        `/data/list?limit=${limit}&offset=${offset}&text=${text}&model=student`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
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

  async addNewStudent(payload: AddStudentRequest): Promise<StudentResponse | ErrorResponse> {
    try {
      const response = await client.post("/student/new", payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async getStudentByStudentCode(studentCode: string): Promise<StudentResponse | ErrorResponse> {
    try {
      const response = await client.get("/student/get/" + studentCode);
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
      const accessToken = getItem("access_token");
      const response = await client.get(
        `/data/list?limit=${limit}&offset=${offset}&text=${text}&model=user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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

  async addNewSalePerson(payload: AddSalePersonRequest): Promise<SalePersonResponse | ErrorResponse> {
    try {
      const accessToken = getItem("access_token");
      const response = await client.post(
        `/sale-person/new`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
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
      const response = await client.get("/sale-person/get/" + id);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async updateSalePersonById(id: string, payload: AddSalePersonRequest): Promise<SalePerson | ErrorResponse> {
    try {
      const response = await client.put("/sale-person/update/" + id, payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }

  async updateStudentById(id: string, payload: UpdateStudentRequest): Promise<StudentResponse | ErrorResponse> {
    try {
      const response = await client.put("/student/update/" + id, payload);
      return response.data;
    } catch (e) {
      return handlerError(e);
    }
  }
}
