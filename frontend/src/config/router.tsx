import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/home/Home";
import AuthLayout from "@/pages/layouts/AuthLayout";
import MainLayout from "@/pages/layouts/MainLayout";
import { createBrowserRouter } from "react-router-dom";

export default createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
    ],
  },
]);
