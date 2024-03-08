import { BACKEND_URL } from "@/env";
import authService from "@/services/auth-service";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: BACKEND_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await authService.refresh();
        api.interceptors.request.use(error.request);
      } catch (error) {
        return Promise.reject(error);
      }
    }
    if (error.response?.status === 500) {
      toast("Server error, please try again later");
    }
    if (error.response?.status === 502) {
      toast("Bad gateway, please try again later");
    }
    if (error.response?.status === 503) {
      toast("Service unavailable, please try again later");
    }
    if (error.response?.status === 504) {
      toast("Gateway timeout, please try again later");
    }
    if (error.response?.status === 429) {
      toast("Too many requests, please try again later");
    }
    return Promise.reject(error);
  }
);

export default api;
