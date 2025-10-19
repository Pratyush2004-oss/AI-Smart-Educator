// ...existing code...
import { Colors } from "@/assets/constants";
import useUserHook from "@/hooks/useUserHook";
import { useUserStore } from "@/store/auth.store";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const TabHeader = () => {
  const { user } = useUserStore();
  const { logoutHook } = useUserHook();
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Animated.View
        entering={FadeInUp.duration(500).springify()}
        className="px-5 py-3 border-b border-white/10"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2 space-x-3">
            <Image
              source={{
                uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
              }}
              className="rounded-full size-6"
            />
            <Text className="text-lg text-white font-outfit-medium">
              {user?.name}
            </Text>
          </View>

          <View className="flex-row items-center gap-3 space-x-4">
            <TouchableOpacity
              className="p-1 rounded-full bg-white/10"
              onPress={() => router.push("/profile")}
            >
              <Feather name="user" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 rounded-full bg-white/10"
              onPress={logoutHook}
            >
              <Feather name="log-out" size={18} color={Colors.LIGHT_RED} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

export default TabHeader;
// ...existing code...