import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const { data, status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data) {
      navigate("/login");
    }
  }, [data]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <Outlet />
      </div>
      <Toaster />
    </>
  );
};

export default MainLayout;
