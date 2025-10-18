import { useUserStore } from "@/store/auth.store";
import { Redirect, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import CheckingAuthScreen from "./CheckingAuthScreen";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const segment = useSegments();
  const { user, isCheckingAuth, isAuthenticated, checkAuth } = useUserStore();

  useEffect(() => {
    if (!user && isCheckingAuth && !isAuthenticated) {
      checkAuth();
    }
  }, [isCheckingAuth, isAuthenticated, checkAuth, user]);

  const isAuthScreen = segment[0] === "(auth)";
  const isTabScreen = segment[0] === "(tabs)";

  if (isCheckingAuth) {
    return <CheckingAuthScreen />;
  }

  if (isAuthScreen && user && isAuthenticated) {
    if (user.quiz && user.quiz.length > 0) {
      return <Redirect href="/InitialQuiz" />;
    } else {
      return <Redirect href="/(tabs)" />;
    }
  } else if (isTabScreen && !user) {
    return <Redirect href="/(auth)" />;
  }

  return <View className="flex-1">{children}</View>;
};
