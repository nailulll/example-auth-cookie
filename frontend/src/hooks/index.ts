import authService from "@/services/auth-service";
import userService from "@/services/user-service";
import { useQuery } from "react-query";

export const useUser = () => useQuery("user", userService.getMe);
export const useAuth = () => useQuery("auth", authService.state);
