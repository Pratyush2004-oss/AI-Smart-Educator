import { View, Dimensions, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const EXPLORE_CARD_WIDTH = width * 0.7;

const SkeletonBox = ({ className }: { className: string }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]);
    return { opacity };
  });

  return (
    <Animated.View
      style={animatedStyle}
      className={`bg-white/10 ${className}`}
    />
  );
};

const LoadingSection = ({ isHome }: { isHome: boolean }) => {
  return (
    <LinearGradient
      colors={["#fff", "#fff"]}
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
    <View className="flex-1 pt-4 ">
      {/* Enrolled Courses Section */}
      <View className="mb-4">
        <View className="px-5 mb-3">
          <SkeletonBox className="w-32 mb-2 bg-black rounded-lg h-7" />
          <SkeletonBox className="w-48 h-4 bg-black rounded-md" />
        </View>

        {/* Horizontal Cards */}
        <View className="flex-row px-5">
          {[1, 2].map((item) => (
            <View
              key={item}
              className="mr-4 overflow-hidden border rounded-2xl border-white/10"
              style={{ width: CARD_WIDTH }}
            >
              <SkeletonBox className="w-full h-40 bg-black" />
              <View className="p-4 ">
                <SkeletonBox className="w-3/4 h-5 mb-3 bg-black rounded-md" />
                <View className="flex-row items-center mb-3">
                  <SkeletonBox className="w-20 h-4 mr-3 bg-black rounded-md" />
                  <SkeletonBox className="w-24 h-4 bg-black rounded-md" />
                </View>
                <SkeletonBox className="w-full h-1.5 mb-1 rounded-full bg-black" />
                <SkeletonBox className="w-16 h-3 ml-auto bg-black rounded-md" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Practice Navigation Section */}
      <View className="my-4">
        <View className="px-5 mb-3">
          <SkeletonBox className="w-24 h-6 mb-1 bg-black rounded-lg " />
          <SkeletonBox className="w-40 h-3 bg-black rounded-md" />
        </View>
        <View className="flex-row px-5">
          {[1, 2, 3].map((item) => (
            <View
              key={item}
              className="mr-4 overflow-hidden border rounded-2xl border-white/10"
              style={{ width: width * 0.42 }}
            >
              <SkeletonBox className="w-full h-32 bg-black" />
              <View className="p-4">
                <View className="flex-row items-center">
                  <SkeletonBox className="w-10 h-10 mr-3 bg-black rounded-full" />
                  <SkeletonBox className="flex-1 h-4 bg-black rounded-md" />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Course Progress Section */}
      <View className="px-5 mt-4 ">
        <View className="mb-3">
          <SkeletonBox className="w-40 h-6 mb-1 bg-black rounded-lg" />
          <SkeletonBox className="w-48 h-3 bg-black rounded-md" />
        </View>
        {[1, 2, 3].map((item) => (
          <View
            key={item}
            className="p-4 mb-3 border rounded-2xl border-white/10"
          >
            <View className="flex-row items-center mb-3">
              <SkeletonBox className="w-12 h-12 mr-3 bg-black rounded-xl" />
              <View className="flex-1">
                <SkeletonBox className="w-3/4 h-4 mb-2 bg-black rounded-md" />
                <SkeletonBox className="w-1/2 h-3 bg-black rounded-md" />
              </View>
            </View>
            <SkeletonBox className="w-full h-2 mb-1 bg-black rounded-full" />
            <View className="flex-row justify-between">
              <SkeletonBox className="w-16 h-3 bg-black rounded-md" />
              <SkeletonBox className="w-12 h-3 bg-black rounded-md" />
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
        <SkeletonBox className="w-48 h-8 mb-2 bg-black rounded-lg" />
        <SkeletonBox className="w-56 h-4 bg-black rounded-md" />
      </View>

      {/* Domain Sections */}
      {[1, 2, 3].map((section) => (
        <View key={section} className="mb-6">
          {/* Domain Header */}
          <View className="flex-row items-center justify-between px-5 mb-3">
            <View className="flex-row items-center">
              <SkeletonBox className="w-1 h-6 mr-3 bg-black rounded-full" />
              <SkeletonBox className="w-32 h-6 bg-black rounded-lg" />
            </View>
            <SkeletonBox className="w-20 h-4 bg-black rounded-md" />
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
                <SkeletonBox className="w-full h-40 bg-black" />

                {/* Content */}
                <View className="p-4">
                  <SkeletonBox className="w-full h-5 mb-3 bg-black rounded-md" />

                  {/* Stats */}
                  <View className="flex-row items-center justify-between mb-2">
                    <SkeletonBox className="w-24 h-4 bg-black rounded-md" />
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
