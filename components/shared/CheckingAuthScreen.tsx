// ...existing code...
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { Colors } from "@/assets/constants";

const AView = Animated.View;

const CheckingAuthScreen = () => {
  // animations
  const orbit = useSharedValue(0);
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const shimmer = useSharedValue(-150);
  const glow = useSharedValue(0);

  useEffect(() => {
    orbit.value = withRepeat(
      withTiming(360, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
    dot1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1
    );
    dot2.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1
    );
    dot3.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0, { duration: 600 })
      ),
      -1
    );
    shimmer.value = withRepeat(
      withTiming(220, { duration: 1100, easing: Easing.inOut(Easing.cubic) }),
      -1,
      false
    );
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0, { duration: 1200 })
      ),
      -1
    );
  }, []);

  const orbitStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${orbit.value}deg` }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + glow.value * 0.35,
    transform: [{ scale: 1 + glow.value * 0.08 }],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value }],
  }));

  const dotStyle = (sv: typeof dot1) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: 0.8 + sv.value * 0.3 }],
      opacity: 0.5 + sv.value * 0.5,
    }));

  const d1 = dotStyle(dot1);
  const d2 = dotStyle(dot2);
  const d3 = dotStyle(dot3);

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      {/* soft background glow */}
      <AView
        style={glowStyle}
        className="absolute inset-0 items-center justify-center"
      >
        <LinearGradient
          colors={[Colors.PRIMARY_LIGHT, "transparent"]}
          start={[0.5, 0.5]}
          end={[0.5, 1]}
          style={{ borderRadius: 50 }}
          className=" w-80 h-80 opacity-40"
        />
      </AView>

      <View className="items-center justify-center flex-1 px-6">
        {/* Title with gradient fill */}
        <MaskedView
          maskElement={
            <Text className="mb-2 text-4xl tracking-wide text-center font-outfit-extrabold">
              Smart-Educator
            </Text>
          }
        >
          <LinearGradient
            colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT, Colors.PRIMARY]}
            start={[0, 0]}
            end={[1, 0]}
          >
            <Text className="mb-2 text-4xl tracking-wide text-center opacity-0 font-outfit-extrabold">
              Smart-Educator
            </Text>
          </LinearGradient>
        </MaskedView>

        {/* Orbiting loader */}
        <AView
          style={orbitStyle}
          className="items-center justify-start my-6 rounded-full w-28 h-28"
        >
          <View className="w-full h-full border rounded-full border-white/10" />
          <View
            style={{ backgroundColor: Colors.PRIMARY }}
            className="w-3 h-3 -mt-1 rounded-full shadow-lg"
          />
        </AView>

        {/* Loading text and animated dots */}
        <View className="flex-row items-center">
          <Text className="text-sm text-gray-300 font-outfit">
            Checking your account
          </Text>
          <AView
            style={[d1, { backgroundColor: Colors.PRIMARY }]}
            className="w-1.5 h-1.5 ml-2 rounded-full"
          />
          <AView
            style={[d2, { backgroundColor: Colors.PRIMARY }]}
            className="w-1.5 h-1.5 ml-1.5 rounded-full"
          />
          <AView
            style={[d3, { backgroundColor: Colors.PRIMARY }]}
            className="w-1.5 h-1.5 ml-1.5 rounded-full"
          />
        </View>

        {/* Shimmer progress bar */}
        <View className="w-64 h-2 mt-6 overflow-hidden rounded-full bg-white/10">
          <AView style={shimmerStyle} className="w-24 h-full rounded-full">
            <LinearGradient
              colors={["transparent", Colors.PRIMARY, "transparent"]}
              start={[0, 0.5]}
              end={[1, 0.5]}
              className="w-full h-full"
            />
          </AView>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CheckingAuthScreen;
// ...existing code...
