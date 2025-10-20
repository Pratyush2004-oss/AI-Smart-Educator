import { Colors, imageAssets } from "@/assets/constants/index";
import { useCourseStore } from "@/store/course.store";
import { CourseType, RecommendedCoursesType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import LoadingSection from "../shared/LoadingSection";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const ExploreScreen = () => {
  const { getRecommendedCourseList, recommendedCourseList, getCourseInfo } =
    useCourseStore();
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();
  const [selected, setselected] = useState<string | null>(null);

  useEffect(() => {
      isLoading &&
      getRecommendedCourseList().finally(() => setisLoading(false));
  }, []);

  const handleCoursePress = async (course: CourseType) => {
    setselected(course._id);
    await getCourseInfo(course)
      .then(() => {
        router.push({
          pathname: "/courseView",
          params: {
            enroll: "true",
          },
        });
      })
      .finally(() => setselected(null));
  };

  const handleRefresh = () => {
    setisLoading(true);
    getRecommendedCourseList().finally(() => setisLoading(false));
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

    return (
      <APressable
        entering={FadeInRight.delay(index * 100).duration(300)}
        onPress={() => handleCoursePress(item)}
        disabled={selected !== null}
        className="mr-4 overflow-hidden rounded-2xl"
        style={{ width: CARD_WIDTH }}
      >
        <View className="overflow-hidden border bg-white/5 rounded-2xl border-white/10">
          {/* Banner Image */}
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

            {/* Category Badge */}
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
              numberOfLines={1}
            >
              {item.courseTitle}
            </Text>

            {/* Stats */}
            <View className="flex-row items-center justify-between mt-3 mb-2">
              <View className="flex-row items-center mr-4">
                <Ionicons name="book-outline" size={16} color="#9ca3af" />
                <Text className="ml-1 text-xs text-gray-400 font-outfit">
                  {item.chaptersCount} chapters
                </Text>
              </View>
              {selected === item._id && (
                <ActivityIndicator size="small" color={Colors.PRIMARY} />
              )}
            </View>

            {/* Progress Bar */}
            {progress == 0 && (
              <View className="mt-2">
                <View className="w-full h-1.5 overflow-hidden rounded-full bg-white/10">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: Colors.PRIMARY,
                    }}
                  />
                </View>
                <Text className="mt-1 text-xs text-right text-gray-400 font-outfit">
                  {Math.round(progress)}% complete
                </Text>
              </View>
            )}
          </View>
        </View>
      </APressable>
    );
  };

  const renderDomainSection = ({
    item,
    index,
  }: {
    item: RecommendedCoursesType;
    index: number;
  }) => {
    return (
      <AView
        entering={FadeInDown.delay(index * 150).duration(400)}
        className="mb-6"
      >
        {/* Domain Header */}
        <View className="flex-row items-center justify-between px-5 mb-3">
          <View className="flex-row items-center">
            <View
              className="w-1 h-6 mr-3 rounded-full"
              style={{ backgroundColor: Colors.PRIMARY }}
            />
            <Text className="text-xl text-white font-outfit-bold">
              {item.domain}
            </Text>
          </View>
          <Text className="text-sm text-gray-400 font-outfit">
            {item.courses.length} courses
          </Text>
        </View>

        {/* Horizontal Course List */}
        <FlatList
          data={item.courses}
          renderItem={renderCourseCard}
          keyExtractor={(course) => course._id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          snapToInterval={CARD_WIDTH + 16}
          decelerationRate="fast"
        />
      </AView>
    );
  };

  if (!recommendedCourseList || recommendedCourseList.length === 0) {
    return (
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        className="items-center justify-center flex-1"
      >
        <Ionicons name="search-outline" size={64} color="#6b7280" />
        <Text className="mt-4 text-lg text-gray-300 font-outfit">
          No courses available
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      className="flex-1"
    >
      {isLoading ? (
        <LoadingSection isHome={false} />
      ) : (
        <FlatList
          data={recommendedCourseList}
          renderItem={renderDomainSection}
          keyExtractor={(item) => item.domain}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          ListHeaderComponent={
            <AView entering={FadeInDown.duration(300)} className="px-5 mb-6">
              <Text className="text-2xl text-white font-outfit-extrabold">
                Explore Courses
              </Text>
              <Text className="mt-1 text-sm text-gray-400 font-outfit">
                Discover courses tailored for you
              </Text>
            </AView>
          }
          refreshing={isLoading}
          onRefresh={handleRefresh}
        />
      )}
    </LinearGradient>
  );
};

export default ExploreScreen;
