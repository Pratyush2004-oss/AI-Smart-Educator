import { useUserStore } from "@/store/auth.store";
import { useRouter } from "expo-router";

const useUserHook = () => {
  const { logout } = useUserStore();
  const router = useRouter();

  const logoutHook = () => {
    logout();
    router.replace("/(auth)");
  };
  return { logoutHook };
};

export default useUserHook;
