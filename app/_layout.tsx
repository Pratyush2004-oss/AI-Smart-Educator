import { SplashScreen, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import SafeScreen from "@/components/shared/SafeScreen";
import { useFonts } from "@/hooks/useFonts";
import { useEffect } from "react";
import CheckingAuthScreen from "@/components/shared/CheckingAuthScreen";
import { ProtectedRoute } from "@/components/shared/Redirect";
// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <CheckingAuthScreen />;
  }

  return (
    <SafeAreaProvider>
      <ProtectedRoute>
        <SafeScreen>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </SafeScreen>
      </ProtectedRoute>
    </SafeAreaProvider>
  );
}
