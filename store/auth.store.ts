import { domains, UserApis } from "@/assets/constants/index";
import { LoginInputType, SignupInputType, UserType } from "@/types";
import { showAlert } from "@/utils/AlertService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { create } from "zustand";

interface UserStoreInterface {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  user: UserType | null;
  token: string | null;
  tokens: Number;

  signup: (userInput: SignupInputType) => Promise<void>;
  login: (userInput: LoginInputType) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  attemptInitialQuiz: (quizMarks: number) => Promise<void>;
  resetUserRecord: () => void;
}
export const useUserStore = create<UserStoreInterface>((set, get) => ({
  isAuthenticated: false,
  isCheckingAuth: true,
  user: null,
  token: null,
  tokens: 0,

  //   signup controller
  signup: async (userInput) => {
    try {
      // check for all fields
      if (
        !userInput.email ||
        !userInput.password ||
        !userInput.name ||
        !userInput.domains ||
        domains.length === 0
      ) {
        showAlert("Error", "Please fill all the fields.");
      }

      //   check for valid email
      if (!/^\S+@\S+\.\S+$/.test(userInput.email)) {
        showAlert("Error", "Please enter a valid email address.");
      }

      const response = await axios.post(UserApis.registerUser, userInput);
      if (response.status === 400) throw new Error(response.data.error);

      set({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
        tokens: response.data.tokens,
      });
      showAlert("Success", response.data.message);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error: any) {
      if (error.isAxiosError) {
        showAlert("Error", error.response.data.message);
      } else {
        showAlert("Error", error.message);
      }
    }
  },
  //   login controller
  login: async (userInput) => {
    if (!userInput.email || !userInput.password) {
      showAlert("Error", "Please fill all the fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userInput.email)) {
      showAlert("Error", "Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(UserApis.loginUser, userInput);
      if (response.status === 400) throw new Error(response.data.message);

      set({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
        tokens: response.data.tokens,
      });
      showAlert("Success", response.data.message);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error: any) {
      if (error.isAxiosError) {
        showAlert("Error", error.response.data.message);
      } else {
        showAlert("Error", error.message);
      }
    }
  },
  //   check auth controller
  checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        return set({
          isCheckingAuth: false,
          isAuthenticated: false,
          token: null,
          user: null,
          tokens: 0,
        });
      }

      const response = await axios.get(UserApis.checkAuth, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 400) throw new Error(response.data.message);
      set({
        token: token,
        isCheckingAuth: false,
        isAuthenticated: true,
        user: response.data.user,
        tokens: response.data.tokens,
      });
    } catch (error) {
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  //   logout controller
  logout: async () => {
    try {
      await AsyncStorage.removeItem("token");
      set({
        isAuthenticated: false,
        user: null,
        token: null,
        tokens: 0,
      });
      showAlert("Logged out successfully");
    } catch (error) {
      showAlert("Error Logging out");
    }
  },
  //   attempt initial quiz
  attemptInitialQuiz: async (quizMarks) => {
    try {
      const response = await axios.post(
        UserApis.attemptInitialQuiz,
        {
          quizMarks,
        },
        {
          headers: {
            Authorization: `Bearer ${get().token}`,
          },
        }
      );
      if (response.status === 400) throw new Error(response.data.message);
      showAlert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().checkAuth();
          },
        },
      ]);
    } catch (error: any) {
      if (error.isAxiosError) {
        showAlert("Error", error.response.data.message);
      } else {
        showAlert("Error", error.message);
      }
    }
  },
  //   reset controller
  resetUserRecord: () => {
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      isCheckingAuth: false,
      tokens: 0,
    });
  },
}));
