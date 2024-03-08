import api from "@/config/api";
import { User } from "@/types";
import { AxiosError } from "axios";

const getMe = async () => {
  try {
    const res = await api.get<User>("/users/me");
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
  }
};

export default {
  getMe,
};
