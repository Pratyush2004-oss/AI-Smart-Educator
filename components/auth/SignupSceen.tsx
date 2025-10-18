import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SignupInputType } from "@/types";
import { Feather, Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import { Colors, domains } from "@/assets/constants/index";
import { Link } from "expo-router";
import { useUserStore } from "@/store/auth.store";

const AnimatedView = Animated.View;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Available domains to choose from
const AVAILABLE_DOMAINS = domains;

const SignupScreen = () => {
  const [input, setInput] = useState<SignupInputType>({
    domains: [],
    email: "",
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const { signup } = useUserStore();

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

  const handleChange = (k: keyof SignupInputType, v: string | string[]) =>
    setInput((prev) => ({ ...prev, [k]: v }));

  const toggleDomain = (domain: string) => {
    const currentDomains = input.domains || [];
    if (currentDomains.includes(domain)) {
      handleChange(
        "domains",
        currentDomains.filter((d) => d !== domain)
      );
    } else {
      handleChange("domains", [...currentDomains, domain]);
    }
  };

  const removeDomain = (domain: string) => {
    handleChange(
      "domains",
      (input.domains || []).filter((d) => d !== domain)
    );
  };

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await signup(input);
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
              className="p-6 py-12"
            >
              <ScrollView showsVerticalScrollIndicator={false}>
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
                  Create your account
                </Text>

                <Animated.View style={formAnimatedStyle}>
                  <View className="w-full">
                    {/* Name */}
                    <View className="mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit">
                        Full Name
                      </Text>
                      <TextInput
                        value={input.name}
                        onChangeText={(t) => handleChange("name", t)}
                        placeholder="John Doe"
                        placeholderTextColor="#9CA3AF"
                        className="p-3 text-white border rounded-lg bg-white/6 border-white/10 font-outfit"
                      />
                    </View>

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
                    <View className="relative mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit">
                        Password
                      </Text>
                      <TextInput
                        value={input.password}
                        onChangeText={(t) => handleChange("password", t)}
                        secureTextEntry={!showPassword}
                        placeholder="Create a strong password"
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

                    {/* Domains Selection */}
                    <View className="mb-4">
                      <Text className="mb-2 text-gray-300 font-outfit">
                        Areas of Interest
                      </Text>

                      {/* Selected Domains Pills */}
                      {input.domains && input.domains.length > 0 && (
                        <View className="flex-row flex-wrap gap-2 mb-3">
                          {input.domains.map((domain) => (
                            <View
                              key={domain}
                              className="flex-row items-center px-3 py-2 rounded-full bg-white/10"
                            >
                              <Text className="mr-2 text-xs text-white font-outfit">
                                {domain}
                              </Text>
                              <Pressable onPress={() => removeDomain(domain)}>
                                <Ionicons
                                  name="close-circle"
                                  size={16}
                                  color={Colors.PRIMARY}
                                />
                              </Pressable>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Add Domain Button */}
                      <Pressable
                        onPress={() => setShowDomainModal(true)}
                        className="flex-row items-center justify-between p-3 border rounded-lg bg-white/6 border-white/10"
                      >
                        <Text className="text-gray-400 font-outfit">
                          {input.domains && input.domains.length > 0
                            ? "Add more domains"
                            : "Select domains"}
                        </Text>
                        <Feather name="plus-circle" size={18} color="white" />
                      </Pressable>
                    </View>
                  </View>
                </Animated.View>

                {/* Button */}
                <Animated.View style={buttonAnimatedStyle}>
                  <TouchableOpacity
                    onPress={handleSignup}
                    disabled={isLoading}
                    activeOpacity={0.9}
                    className="overflow-hidden rounded-lg"
                  >
                    <LinearGradient
                      colors={
                        isLoading
                          ? ["#94a3b8", "#94a3b8"]
                          : [
                              Colors.PRIMARY,
                              Colors.PRIMARY_LIGHT,
                              Colors.PRIMARY,
                            ]
                      }
                      start={[0, 0]}
                      end={[1, 0]}
                      className="items-center py-3 rounded-lg"
                    >
                      {isLoading ? (
                        <ActivityIndicator color="#fff" />
                      ) : (
                        <Text className="text-base text-[#8a5225] font-outfit-extrabold">
                          Sign Up
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
                <Text className="gap-1 text-sm text-center text-gray-300 font-outfit">
                  Already have an account?{" "}
                  <Link
                    href={"/(auth)"}
                    replace
                    style={{ color: Colors.PRIMARY }}
                    className="ml-2 underline font-outfit-bold underline-offset-2"
                  >
                    Login
                  </Link>
                </Text>
              </ScrollView>
            </BlurView>
          </AnimatedView>
        </KeyboardAvoidingView>

        {/* Domain Selection Modal */}
        <Modal
          visible={showDomainModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDomainModal(false)}
        >
          <AnimatedPressable
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            onPress={() => setShowDomainModal(false)}
            className="items-center justify-center flex-1 bg-black/90"
          >
            <AnimatedPressable
              entering={FadeIn.duration(300).delay(100)}
              exiting={FadeOut.duration(200)}
              onPress={(e) => e.stopPropagation()}
              className="w-11/12 max-w-md overflow-hidden rounded-2xl"
            >
              <BlurView
                intensity={80}
                tint="systemChromeMaterialDark"
                className="p-6"
              >
                {/* Modal Header */}
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-xl text-white font-outfit-bold">
                    Select Domains
                  </Text>
                  <Pressable onPress={() => setShowDomainModal(false)}>
                    <Ionicons name="close" size={24} color="white" />
                  </Pressable>
                </View>

                <Text className="mb-4 text-sm text-gray-400 font-outfit">
                  Choose areas you're interested in
                </Text>

                {/* Domain List */}
                <ScrollView
                  className="max-h-96"
                  showsVerticalScrollIndicator={false}
                >
                  {AVAILABLE_DOMAINS.map((domain, index) => {
                    const isSelected = (input.domains || []).includes(domain);
                    return (
                      <Pressable
                        key={domain}
                        onPress={() => toggleDomain(domain)}
                        className={`p-4 mb-2 border rounded-xl flex-row items-center justify-between ${
                          isSelected
                            ? "bg-white/15 border-white/20"
                            : "bg-white/5 border-white/10"
                        }`}
                      >
                        <View className="flex-row items-center flex-1">
                          <View
                            className={`w-5 h-5 rounded-full border-2 mr-3 items-center justify-center ${
                              isSelected
                                ? "border-white bg-white/20"
                                : "border-gray-500"
                            }`}
                          >
                            {isSelected && (
                              <Ionicons
                                name="checkmark"
                                size={14}
                                color={Colors.PRIMARY}
                              />
                            )}
                          </View>
                          <Text className="text-base text-white font-outfit">
                            {domain}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Modal Footer */}
                <TouchableOpacity
                  onPress={() => setShowDomainModal(false)}
                  activeOpacity={0.9}
                  className="mt-4 overflow-hidden rounded-lg"
                >
                  <LinearGradient
                    colors={[
                      Colors.PRIMARY,
                      Colors.PRIMARY_LIGHT,
                      Colors.PRIMARY,
                    ]}
                    start={[0, 0]}
                    end={[1, 0]}
                    className="items-center py-3 rounded-lg"
                  >
                    <Text className="text-base text-[#8a5225] font-outfit-extrabold">
                      Done ({input.domains?.length || 0} selected)
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </BlurView>
            </AnimatedPressable>
          </AnimatedPressable>
        </Modal>
      </LinearGradient>
    </ImageBackground>
  );
};

export default SignupScreen;
