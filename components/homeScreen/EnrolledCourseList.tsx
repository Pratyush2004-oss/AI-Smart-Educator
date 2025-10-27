import { Colors, imageAssets } from "@/assets/constants/index";
import { useCourseStore } from "@/store/course.store";
import { CourseType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
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
import CreateCourseModal from "../shared/CreateCourseModal";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const EnrolledCourseList = () => {
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
    return (
      <View
        key={item._id}
        style={{
          width: CARD_WIDTH,
          marginRight: 16,
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
            right: 5,
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
          className="mr-4 overflow-hidden rounded-2xl"
          disabled={loading !== null}
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
              <Text className="text-lg font-outfit-bold" numberOfLines={2}>
                {item.courseTitle}
              </Text>

              {/* Stats */}
              <View className="flex-row items-center mt-3 mb-2">
                <View className="flex-row items-center justify-between w-full mr-4">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="book-outline" size={16} color="#9ca3af" />
                    <Text className="ml-1 text-base text-gray-400 font-outfit">
                      {item.chaptersCount} chapters
                    </Text>
                  </View>
                  {loading === item._id && (
                    <ActivityIndicator
                      color={Colors.PRIMARY}
                      className="flex-1"
                    />
                  )}
                  <Text className="mt-1 text-sm text-right text-gray-400 font-outfit">
                    {new Date(item.createdAt).toDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </APressable>
      </View>
    );
  };

  const ListHeader = () => (
    <AView
      entering={FadeInDown.duration(300)}
      className="flex-row items-center justify-between flex-1 w-full px-5 pt-5"
    >
      <View>
        <Text className="text-2xl font-outfit-extrabold">Your Courses</Text>
        <Text className="mt-1 text-base text-gray-500 font-outfit">
          View all the courses you have enrolled
        </Text>
      </View>
      <CreateCourseModal>
        <LinearGradient
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 0 }}
          colors={["#194aa4", "#194aa4"]}
          style={{ borderRadius: 10 }}
          className="flex-row items-center gap-1 px-3 py-3 border rounded-xl border-white/10 bg-[#194aa4]"
        >
          <Ionicons name="add-circle-outline" size={16} color="#fff" />
          <Text className="text-sm text-white font-outfit-bold">Add</Text>
        </LinearGradient>
      </CreateCourseModal>
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

export default EnrolledCourseList;
