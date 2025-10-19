import { Colors, imageAssets } from "@/assets/constants/index";
import { useCourseStore } from "@/store/course.store";
import { CourseType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const CourseProgressList = () => {
  const { enrolledCourseList, getCourseInfo } = useCourseStore();

  const router = useRouter();

  const handleCoursePress = async (course: CourseType) => {
    await getCourseInfo(course);
    router.push({
      pathname: "/courseView",
      params: { enroll: "false" },
    });
  };

  const renderCourseCard = ({
    item,
    index,
  }: {
    item: CourseType;
    index: number;
  }) => {
    const progress =
      item.chaptersCount > 0
        ? (item.completedChaptersCount / item.chaptersCount) * 100
        : 0;

    const getProgressColor = () => {
      if (progress > 75) return Colors.GREEN; // green
      if (progress > 50) return Colors.PRIMARY; // yellow
      return Colors.RED; // red
    };

    return (
      <APressable
        entering={FadeInRight.delay(index * 80).duration(300)}
        onPress={() => handleCoursePress(item)}
        className="mr-4 overflow-hidden rounded-2xl"
        style={{ width: CARD_WIDTH }}
      >
        <View className="overflow-hidden border bg-white/5 rounded-2xl border-white/10">
          {/* Banner */}
          <View className="relative">
            <Image
              source={
                imageAssets[item.banner_image as keyof typeof imageAssets]
              }
              className="w-full h-40"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              className="absolute bottom-0 left-0 right-0 h-20"
            />
            {/* Difficulty Badge */}
            <View className="absolute px-3 py-1 rounded-full top-3 right-3 bg-white/90">
              <Text
                className="text-xs font-outfit-bold"
                style={{ color: Colors.PRIMARY }}
              >
                {item.difficulty}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View className="p-4">
            <Text
              className="text-base text-white font-outfit-bold"
              numberOfLines={2}
            >
              {item.courseTitle}
            </Text>

            {/* Stats */}
            <View className="flex-row items-center mt-3 mb-2">
              <View className="flex-row items-center mr-4">
                <Ionicons name="book-outline" size={16} color="#9ca3af" />
                <Text className="ml-1 text-xs text-gray-400 font-outfit">
                  {item.chaptersCount} chapters
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={getProgressColor()}
                />
                <Text
                  className="ml-1 text-xs font-outfit"
                  style={{ color: getProgressColor() }}
                >
                  {item.completedChaptersCount} completed
                </Text>
              </View>
            </View>

            {/* Progress */}
            <View className="mt-2">
              <View className="w-full h-1.5 overflow-hidden rounded-full bg-white/10">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: getProgressColor(),
                  }}
                />
              </View>
              <Text className="mt-1 text-xs text-right text-gray-400 font-outfit">
                {Math.round(progress)}% complete
              </Text>
            </View>
          </View>
        </View>
      </APressable>
    );
  };

  const ListHeader = () => (
    <AView entering={FadeInDown.duration(300)} className="px-5 pt-5">
      <Text className="text-2xl text-white font-outfit-extrabold">
        Your Progress
      </Text>
      <Text className="mt-1 text-sm text-gray-400 font-outfit">
        Continue learning where you left off
      </Text>
    </AView>
  );

  if (!enrolledCourseList || enrolledCourseList.length === 0) {
    return (
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        className="items-center justify-center flex-1 rounded-2xl"
      >
        <Ionicons name="school-outline" size={56} color="#6b7280" />
        <Text className="mt-3 text-base text-gray-300 font-outfit">
          No enrolled courses yet
        </Text>
      </LinearGradient>
    );
  }

  return (
    <>
      <ListHeader />
      <FlatList
        data={enrolledCourseList}
        renderItem={renderCourseCard}
        keyExtractor={(c) => c._id}
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 16,
        }}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
      />
    </>
  );
};

export default CourseProgressList;
