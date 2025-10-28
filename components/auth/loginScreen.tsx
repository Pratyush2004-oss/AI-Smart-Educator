// ...existing code...
import { LoginInputType } from "@/types";
import { Feather } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/assets/constants/index";
import { Link } from "expo-router";
import { useUserStore } from "@/store/auth.store";

const AnimatedView = Animated.View;

const LoginScreen = () => {
  const [input, setInput] = useState<LoginInputType>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();

  // Reanimated values
  const cardOpacity = useSharedValue(0);
  const cardTranslateY = useSharedValue(60);
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(40);
  const buttonOpacity = useSharedValue(0);

  const animConfig = {
    duration: 700,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  };

  useEffect(() => {
    cardOpacity.value = withTiming(1, animConfig);
    cardTranslateY.value = withTiming(0, animConfig);
    formOpacity.value = withDelay(180, withTiming(1, animConfig));
    formTranslateY.value = withDelay(180, withTiming(0, animConfig));
    buttonOpacity.value = withDelay(360, withTiming(1, animConfig));
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ translateY: cardTranslateY.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleChange = (k: keyof LoginInputType, v: string) =>
    setInput((prev) => ({ ...prev, [k]: v }));

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(input);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1950&q=80",
      }}
      className="flex-1"
    >
      <LinearGradient
        colors={["rgba(8,10,25,0.55)", "rgba(3,7,18,0.75)"]}
        className="flex-1"
        start={[0, 0]}
        end={[1, 1]}
      >
        <KeyboardAvoidingView
          behavior={"padding"}
          className="items-center justify-center flex-1 px-4"
        >
          <AnimatedView
            style={cardAnimatedStyle}
            className="w-full max-w-md overflow-hidden rounded-3xl"
          >
            <BlurView
              intensity={65}
              tint="systemChromeMaterialDark"
              className="p-6 py-16"
            >
              {/* Gradient text using MaskedView */}
              <MaskedView
                maskElement={
                  <Text className="mb-1 text-3xl text-center font-outfit-bold">
                    Smart Educator
                  </Text>
                }
              >
                <LinearGradient
                  colors={[
                    Colors.PRIMARY,
                    Colors.PRIMARY_LIGHT,
                    Colors.PRIMARY,
                  ]}
                  start={[0, 0]}
                  end={[1, 0]}
                >
                  <Text className="mb-1 text-3xl text-center opacity-0 font-outfit-bold">
                    Smart Educator
                  </Text>
                </LinearGradient>
              </MaskedView>
              <Text className="mb-6 text-sm text-center text-gray-300 font-outfit">
                Sign in to continue
              </Text>

              <Animated.View style={formAnimatedStyle}>
                <View className="w-full">
                  {/* Email */}
                  <View className="mb-4">
                    <Text className="mb-2 text-gray-300 font-outfit">
                      Email
                    </Text>
                    <TextInput
                      value={input.email}
                      onChangeText={(t) => handleChange("email", t)}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      placeholder="you@example.com"
                      placeholderTextColor="#9CA3AF"
                      className="p-3 text-white border rounded-lg bg-white/6 border-white/10 font-outfit"
                    />
                  </View>

                  {/* Password */}
                  <View className="relative mb-6">
                    <Text className="mb-2 text-gray-300 font-outfit">
                      Password
                    </Text>
                    <TextInput
                      value={input.password}
                      onChangeText={(t) => handleChange("password", t)}
                      secureTextEntry={!showPassword}
                      placeholder="Enter your password"
                      placeholderTextColor="#9CA3AF"
                      className="p-3 pr-12 text-white border rounded-lg bg-white/6 border-white/10 font-outfit"
                    />
                    <Pressable
                      onPress={() => setShowPassword((s) => !s)}
                      className="absolute bottom-3 right-3"
                      accessibilityLabel={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      <Feather
                        name={showPassword ? "eye" : "eye-off"}
                        size={18}
                        color="white"
                      />
                    </Pressable>
                  </View>
                </View>
              </Animated.View>

              {/* Button */}
              <Animated.View style={buttonAnimatedStyle}>
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.9}
                  className="overflow-hidden rounded-lg"
                >
                  <LinearGradient
                    colors={
                      isLoading
                        ? ["#94a3b8", "#94a3b8"]
                        : [Colors.PRIMARY, Colors.PRIMARY_LIGHT, Colors.PRIMARY]
                    }
                    start={[0, 0]}
                    end={[1, 0]}
                    className="items-center py-3 rounded-lg"
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text
                        className={`text-base text-white font-outfit-extrabold`}
                      >
                        Login
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>

              {/* Divider */}
              <View className="flex-row items-center my-5">
                <View className="flex-1 h-px bg-white/10" />
                <Text className="mx-3 text-sm text-gray-300 font-outfit">
                  or continue with
                </Text>
                <View className="flex-1 h-px bg-white/10" />
              </View>

              {/* Footer */}
              <Text className="text-sm text-center text-gray-300 font-outfit">
                Don't have an account?{" "}
                <Link
                  href={"/(auth)/signup"}
                  style={{ color: Colors.PRIMARY }}
                  className="underline font-outfit-bold underline-offset-2"
                >
                  Signup
                </Link>
              </Text>
            </BlurView>
          </AnimatedView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

export default LoginScreen;
// ...existing code...
