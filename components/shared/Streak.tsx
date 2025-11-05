import { View, Text, Image } from "react-native";
import React from "react";
import { useUserStore } from "@/store/auth.store";

const Streak = () => {
  const { streak } = useUserStore();

  return (
    <View className="flex-row items-center px-4 py-1 rounded-full bg-gray-100/50">
      <Image
        source={require("@/assets/images/streak.png")}
        className="size-8"
      />
      <Text className="text-lg font-outfit-extrabold">
        {String(streak) || "0"}
      </Text>
    </View>
  );
};

export default Streak;
