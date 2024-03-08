import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks";
import authService from "@/services/auth-service";
import { useQueryClient } from "react-query";

const Home = () => {
  const { data } = useUser();
  const queryClient = useQueryClient();

  const logoutHandler = async () => {
    await authService.logout();
    queryClient.invalidateQueries({ queryKey: ["auth"] });
  };

  return (
    <div className="flex flex-col gap-5">
      Hello {data?.username}
      <Button onClick={() => logoutHandler()}>Logout</Button>
    </div>
  );
};

export default Home;
