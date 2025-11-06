import { Colors, imageAssets } from "@/assets/constants/index";
import { useCourseStore } from "@/store/course.store";
import { CourseType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "@react-navigation/elements";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const CourseProgressList = () => {
  const { enrolledCourseList, getCourseInfo } = useCourseStore();
  const [loading, setloading] = useState<string | null>(null);

  const router = useRouter();

  const handleCoursePress = async (course: CourseType) => {
    setloading(course._id);
    await getCourseInfo(course)
      .then(() => {
        router.push({
          pathname: "/courseView",
          params: { enroll: "false" },
        });
      })
      .finally(() => setloading(null));
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
      return Colors.GREEN; // green
    };

    // subtle off-white top/bottom glow + elevation
    const containerShadowStyle = {
      shadowColor: "#f8fafc", // off-white glow
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3, // android elevation
    };

    const imageMap = [
      require("@/assets/images/gold.png"),
      require("@/assets/images/silver.png"),
      require("@/assets/images/bronze.png"),
    ];

    const BadgeImage = ({ progress }: { progress: number }) => {
      // pick badge index based on progress thresholds (change thresholds as needed)
      let idx = 2;
      if (progress >= 75)
        idx = 0; // gold
      else if (progress >= 50) idx = 1; // silver
      return (
        <View className="p-1 rounded-full">
          <Image
            source={imageMap[idx]}
            className=""
            style={{ width: 25, height: 25 }}
          />
        </View>
      );
    };
    return (
      <View
        key={item._id}
        style={{
          width: CARD_WIDTH,
          // keep relative so glow can be placed underneath
          position: "relative",
        }}
      >
        {/* bottom glow layer (soft off-white band to simulate lift) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: 5,
            right: 17,
            bottom: 5,
            height: 10,
            borderRadius: 8,
            backgroundColor: "rgba(248,250,252,6)", // very subtle off-white
            transform: [{ scaleX: 1 }],
          }}
        />
        <APressable
          entering={FadeInRight.delay(index * 80).duration(300)}
          onPress={() => handleCoursePress(item)}
          className="mr-4 overflow-hidden border-t border-l border-r border-gray-500/10 rounded-2xl"
          disabled={loading !== null}
          style={[
            {
              // slight lift and background shadow
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04,
              shadowRadius: 2,
              elevation: 2,
            },
            containerShadowStyle,
          ]}
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
              <View className="flex-row items-center gap-1">
                <BadgeImage progress={progress} />

                <Text
                  className="w-5/6 text-lg font-outfit-bold"
                  numberOfLines={1}
                >
                  {item.courseTitle}
                </Text>
              </View>

              {/* Stats */}
              <View className="flex-row items-center mt-3 mb-2">
                <View className="flex-row items-center mr-4">
                  <Ionicons name="book-outline" size={16} color="#9ca3af" />
                  <Text className="ml-1 text-base text-gray-900 font-outfit">
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
                    className="ml-1 text-base font-outfit"
                    style={{ color: getProgressColor() }}
                  >
                    {item.completedChaptersCount} completed
                  </Text>
                  {loading === item._id && (
                    <ActivityIndicator
                      color={Colors.PRIMARY}
                      className="flex-1"
                    />
                  )}
                </View>
              </View>

              {/* Progress */}
              <View className="mt-2">
                <View className="w-full h-1.5 overflow-hidden rounded-full bg-gray-400/10 ">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: getProgressColor(),
                    }}
                  />
                </View>
                <Text className="mt-1 text-base text-right text-gray-400 font-outfit">
                  {Math.round(progress)}% complete
                </Text>
              </View>
            </View>
          </View>
        </APressable>
      </View>
    );
  };

  const ListHeader = () => (
    <AView entering={FadeInDown.duration(300)} className="px-5 pt-5 ">
      <Text className="text-2xl font-outfit-extrabold">Your Progress</Text>
      <Text className="mt-1 text-base text-gray-500 font-outfit">
        Continue learning where you left off ...
      </Text>
    </AView>
  );

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
