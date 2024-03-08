import api from "@/config/api";

import { AxiosError } from "axios";
import { useQueryClient } from "react-query";

const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    await api.post("/auth/login", {
      username,
      password,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};

const register = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    await api.post(
      "/auth/register",
      {
        username,
        password,
      },
      {
        withCredentials: false,
      }
    );
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};

const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};

const refresh = async () => {
  try {
    api.interceptors.response.clear();
    await api.post("/auth/refresh");
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        const queryClient = useQueryClient();
        queryClient.invalidateQueries({ queryKey: ["auth"] });
      }
      throw error;
    }
  }
};

const state = async () => {
  try {
    const res = await api.post<boolean>("/auth/state");
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};

export default { login, register, logout, refresh, state };
