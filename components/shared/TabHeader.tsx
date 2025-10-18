import useUserHook from "@/hooks/useUserHook";
import { useUserStore } from "@/store/auth.store";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const TabHeader = () => {
  const { user } = useUserStore();
  const { logoutHook } = useUserHook();
  const router = useRouter();
  return (
    <Animated.View
      entering={FadeInUp.duration(500).springify()}
      className={"px-5 py-3 border-b border-gray-200 bg-gray-200/50"}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 space-x-3">
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            }}
            className="rounded-full size-6"
          />
          <Text className="text-lg text-gray-800 font-outfit-medium">
            {user?.name}
          </Text>
        </View>
        <View className="flex-row items-center gap-3 space-x-4">
          <TouchableOpacity
            className="p-1 rounded-full bg-gray-300/50"
            onPress={() => router.push("/profile")}
          >
            <Feather name="user" size={18} color="rgb(31 41 55)" />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-1 rounded-full bg-gray-300/50"
            onPress={logoutHook}
          >
            <Feather name="log-out" size={18} color="red" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default TabHeader;
