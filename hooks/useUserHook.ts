import { useUserStore } from "@/store/auth.store";
import { useCourseStore } from "@/store/course.store";
import { useRouter } from "expo-router";

const useUserHook = () => {
  const { logout } = useUserStore();
  const { resetCourseData } = useCourseStore();
  const router = useRouter();

  const logoutHook = () => {
    logout();
    resetCourseData();
    router.replace("/(auth)");
  };
  return { logoutHook };
};

export default useUserHook;
