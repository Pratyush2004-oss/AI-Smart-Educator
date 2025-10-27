// ...existing code...
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const TabHeader = () => {
  const shadowStyle: any =
    Platform.OS === "ios"
      ? {
          shadowColor: "#0b1220",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.12,
          shadowRadius: 12,
        }
      : {
          elevation: 6,
          shadowColor: "#0b1220",
        };
  return (
    <View style={{ ...shadowStyle, zIndex: 10 }}>
      <LinearGradient
        colors={["#fff", "#194aa4"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Animated.View
          entering={FadeInUp.duration(500).springify()}
          className="px-5 border-b border-white/10"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 space-x-3">
              <Text
                className="text-[50px] font-times-bold"
                style={{
                  letterSpacing: 2,
                  lineHeight: 70,
                  color: "#0f357b",
                }}
              >
                Start <Text className="text-4xl">Today...</Text>
              </Text>
            </View>
          </View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

export default TabHeader;
// ...existing code...
