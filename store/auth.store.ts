import { LoginInputType, SignupInputType, UserType } from "@/types";
import { create } from "zustand";
import axios from "axios";
import { domains, UserApis } from "@/assets/constants/index";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserStoreInterface {
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  user: UserType | null;
  token: string | null;

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
        Alert.alert("Error", "Please fill all the fields.");
      }

      //   check for valid email
      if (!/^\S+@\S+\.\S+$/.test(userInput.email)) {
        Alert.alert("Error", "Please enter a valid email address.");
      }

      const response = await axios.post(UserApis.registerUser, userInput);
      if (response.status === 400) throw new Error(response.data.error);

      set({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      });
      Alert.alert("Success", response.data.message);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error: any) {
      if (error.isAxiosError) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", error.message);
      }
    }
  },
  //   login controller
  login: async (userInput) => {
    if (!userInput.email || !userInput.password) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(userInput.email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    try {
      const response = await axios.post(UserApis.loginUser, userInput);
      if (response.status === 400) throw new Error(response.data.message);

      set({
        isAuthenticated: true,
        user: response.data.user,
        token: response.data.token,
      });
      Alert.alert("Success", response.data.message);
      await AsyncStorage.setItem("token", response.data.token);
    } catch (error: any) {
      if (error.isAxiosError) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", error.message);
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
      });
      Alert.alert("Logged out successfully");
    } catch (error) {
      Alert.alert("Error Logging out");
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
      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => {
            get().checkAuth();
          },
        },
      ]);
    } catch (error: any) {
      if (error.isAxiosError) {
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", error.message);
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
    });
  },
}));
