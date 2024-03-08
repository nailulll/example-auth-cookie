import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const { data, status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      navigate("/home");
    }
  }, [data]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <main className="flex min-h-screen items-center justify-center">
        <Outlet />
      </main>
      <Toaster />
    </>
  );
};

export default AuthLayout;
