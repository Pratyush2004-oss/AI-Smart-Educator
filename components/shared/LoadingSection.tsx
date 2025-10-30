import { View, Dimensions, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/assets/constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const EXPLORE_CARD_WIDTH = width * 0.7;

/**
 * SkeletonBox
 * - uses a neutral light-mode base color and a subtle pulsating shimmer (opacity)
 * - accepts nativewind className for sizing/layout; inline backgroundColor ensures visibility in light mode
 */
const SkeletonBox = ({
  className,
  style,
}: {
  className?: string;
  style?: any;
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1400 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.45, 0.9, 0.45]);
    return { opacity };
  });

  // light mode base color (visible on white backgrounds)
  const baseColor = Colors.GRAY; // soft bluish-gray
  return (
    <Animated.View
      style={[
        animatedStyle,
        { backgroundColor: baseColor, borderRadius: 8 },
        style,
      ]}
      className={className}
    />
  );
};

const LoadingSection = ({ isHome }: { isHome: boolean }) => {
  return (
    <LinearGradient
      // light mode background
      colors={["#f8fafc", "#f1f5f9"]}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      {isHome ? <HomeLoading /> : <ExploreLoading />}
    </LinearGradient>
  );
};

// Home Screen Loading
const HomeLoading = () => {
  return (
    <View className="flex-1 pt-4">
      {/* Enrolled Courses Section */}
      <View className="mb-4">
        <View className="px-5 mb-3">
          <SkeletonBox className="w-32 mb-2 rounded-lg h-7" />
          <SkeletonBox className="w-48 h-4 rounded-md" />
        </View>

        {/* Horizontal Cards */}
        <View className="flex-row px-5">
          {[1, 2].map((item) => (
            <View
              key={item}
              className="mr-4 overflow-hidden border rounded-2xl border-white/10"
              style={{ width: CARD_WIDTH }}
            >
              <SkeletonBox className="w-full h-40 rounded-t-2xl" />
              <View className="p-4">
                <SkeletonBox className="w-3/4 h-5 mb-3 rounded-md" />
                <View className="flex-row items-center mb-3">
                  <SkeletonBox className="w-20 h-4 mr-3 rounded-md" />
                  <SkeletonBox className="w-24 h-4 rounded-md" />
                </View>
                <SkeletonBox className="w-full h-1.5 mb-1 rounded-full" />
                <SkeletonBox className="w-16 h-3 ml-auto rounded-md" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Practice Navigation Section */}
      <View className="my-4">
        <View className="px-5 mb-3">
          <SkeletonBox className="w-24 h-6 mb-1 rounded-lg" />
          <SkeletonBox className="w-40 h-3 rounded-md" />
        </View>
        <View className="flex-row px-5">
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="mr-4 overflow-hidden border rounded-2xl border-white/10"
              style={{ width: width * 0.42 }}
            >
              <SkeletonBox className="w-full h-32 rounded-t-2xl" />
              <View className="p-4">
                <View className="flex-row items-center">
                  <SkeletonBox className="w-10 h-10 mr-3 rounded-full" />
                  <SkeletonBox className="flex-1 h-4 rounded-md" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Course Progress Section */}
      <View className="px-5 mt-4">
        <View className="mb-3">
          <SkeletonBox className="w-40 h-6 mb-1 rounded-lg" />
          <SkeletonBox className="w-48 h-3 rounded-md" />
        </View>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="p-4 mb-3 border rounded-2xl border-white/10"
          >
            <View className="flex-row items-center mb-3">
              <SkeletonBox className="w-12 h-12 mr-3 rounded-xl" />
              <View className="flex-1">
                <SkeletonBox className="w-3/4 h-4 mb-2 rounded-md" />
                <SkeletonBox className="w-1/2 h-3 rounded-md" />
              </View>
            </View>
            <SkeletonBox className="w-full h-2 mb-1 rounded-full" />
            <View className="flex-row justify-between">
              <SkeletonBox className="w-16 h-3 rounded-md" />
              <SkeletonBox className="w-12 h-3 rounded-md" />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Explore Screen Loading
const ExploreLoading = () => {
  return (
    <View className="flex-1 pt-5">
      {/* Header */}
      <View className="px-5 mb-6">
        <SkeletonBox className="w-48 h-8 mb-2 rounded-lg" />
        <SkeletonBox className="w-56 h-4 rounded-md" />
      </View>

      {/* Domain Sections */}
      {[1, 2, 3].map((section) => (
        <View key={section} className="mb-6">
          {/* Domain Header */}
          <View className="flex-row items-center justify-between px-5 mb-3">
            <View className="flex-row items-center">
              <SkeletonBox className="w-2 h-6 mr-3 rounded-full" />
              <SkeletonBox className="w-32 h-6 rounded-lg" />
            </View>
            <SkeletonBox className="w-20 h-4 rounded-md" />
          </View>

          {/* Horizontal Course Cards */}
          <View className="flex-row px-5">
            {[1, 2].map((item) => (
              <View
                key={item}
                className="mr-4 overflow-hidden border rounded-2xl border-white/10"
                style={{ width: EXPLORE_CARD_WIDTH }}
              >
                {/* Banner */}
                <SkeletonBox className="w-full h-40 rounded-t-2xl" />

                {/* Content */}
                <View className="p-4">
                  <SkeletonBox className="w-full h-5 mb-3 rounded-md" />

                  {/* Stats */}
                  <View className="flex-row items-center justify-between mb-2">
                    <SkeletonBox className="w-24 h-4 rounded-md" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default LoadingSection;
