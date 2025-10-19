import { Colors, imageAssets } from "@/assets/constants/index";
import BackHeader from "@/components/shared/BackHeader";
import { useCourseStore } from "@/store/course.store";
import { ChapterType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const SelectedCourseSection = () => {
  const { enroll } = useLocalSearchParams();
  const enrollBool = enroll === "true";
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();
  const { selectedCourse, enrollToCourse } = useCourseStore();
  const handleChapterPress = (chapterIdx: number, chapter: ChapterType) => {
    if (enrollBool) return;
    router.push({
      pathname: "/chapterView",
      params: {
        chapterIdx: chapterIdx,
        chapterParams: JSON.stringify(chapter),
      },
    });
  };

  const handleEnroll = async () => {
    setisLoading(true);
    await enrollToCourse(selectedCourse!._id).then(() => {
      router.replace({
        pathname: "/courseView",
        params: {
          enroll: "false",
        },
      });
    });
  };
  if (!selectedCourse) return <Redirect href={"/"} />;

  return (
    selectedCourse && (
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        className="flex-1"
      >
        <BackHeader
          title={selectedCourse.courseTitle}
          subtitle={selectedCourse.category}
          backgroundColor="gradient"
        />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Banner and Title */}
          <AView entering={FadeInDown.duration(400)} className="mb-6">
            <View className="mb-4 overflow-hidden border border-white/10">
              {/* Banner */}
              <Image
                source={
                  imageAssets[
                    selectedCourse.banner_image as keyof typeof imageAssets
                  ]
                }
                className="w-full opacity-80 h-60"
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                className="absolute bottom-0 left-0 right-0 h-20"
              />
              <Text className="absolute text-2xl text-white font-outfit-extrabold bottom-3 left-5">
                {selectedCourse.courseTitle}
              </Text>
            </View>
            {/* Description */}
            <View className="px-6">
              <Text className="text-lg text-white font-outfit-bold">
                Description
              </Text>
              <Text
                className="mb-2 text-xs text-justify font-outfit-light"
                numberOfLines={5}
                style={{ color: Colors.PRIMARY_LIGHT }}
              >
                {selectedCourse.description}
              </Text>
              <View className="flex-row items-center mb-2">
                <Text
                  className="px-3 py-1 mr-2 text-xs rounded-full bg-white/90 font-outfit-bold"
                  style={{ color: Colors.PRIMARY }}
                >
                  {selectedCourse.category}
                </Text>
                <Text
                  className="px-3 py-1 text-xs rounded-full bg-white/90 font-outfit-bold"
                  style={{ color: Colors.PRIMARY }}
                >
                  {selectedCourse.difficulty}
                </Text>
              </View>
              <Text className="mb-2 text-sm text-gray-300 font-outfit">
                {selectedCourse.chaptersCount} chapters
                {!enrollBool && (
                  <Text className="mb-2 text-sm text-gray-300 font-outfit">
                    • {selectedCourse.completedChaptersCount ?? 0} completed
                  </Text>
                )}
              </Text>
              {!enrollBool && (
                <Text className="mb-2 text-xs text-gray-400 font-outfit">
                  Created:{" "}
                  {new Date(selectedCourse.createdAt).toLocaleTimeString()}
                </Text>
              )}
            </View>
          </AView>

          {/* Chapters List */}
          <AView
            entering={FadeInDown.delay(100).duration(400)}
            className="px-6"
          >
            <Text className="mb-4 text-lg text-white font-outfit-bold">
              Chapters
            </Text>
            {selectedCourse.chapters.map(
              (chapter: ChapterType, idx: number) => {
                const isCompleted =
                  selectedCourse.completedChapters &&
                  selectedCourse.completedChapters.includes(idx);
                return (
                  <APressable
                    key={idx}
                    entering={FadeInRight.delay(idx * 80).duration(300)}
                    onPress={() => handleChapterPress(idx, chapter)}
                    className={`mb-3 p-4 rounded-xl border-2 flex-row items-center ${
                      isCompleted
                        ? "bg-green-500/10 border-green-400/25"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <View className="flex-row items-center justify-between flex-1">
                      <Text
                        className="flex-1 text-base text-white font-outfit"
                        numberOfLines={2}
                      >
                        {chapter.chapterName}
                      </Text>
                      {/* play button */}
                      <TouchableOpacity
                        onPress={() => handleChapterPress(idx, chapter)}
                        className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${
                          isCompleted || !enrollBool
                            ? "bg-green-500/20"
                            : "bg-gray-700/20"
                        }`}
                      >
                        <Ionicons
                          name={isCompleted ? "checkmark-circle" : "play"}
                          size={20}
                          color={isCompleted ? "#22c55e" : "#9ca3af"}
                        />
                      </TouchableOpacity>
                    </View>
                    {isCompleted && (
                      <Text className="ml-2 text-xs text-green-400 font-outfit-bold">
                        Completed
                      </Text>
                    )}
                  </APressable>
                );
              }
            )}
          </AView>
        </ScrollView>
        <TouchableOpacity
          onPress={enrollBool ? handleEnroll : () => {}}
          disabled={isLoading}
          activeOpacity={0.9}
          className="absolute overflow-hidden rounded-lg bottom-16 left-6 right-6"
        >
          <LinearGradient
            colors={
              isLoading
                ? ["#94a3b8", "#94a3b8"]
                : [Colors.PRIMARY, Colors.PRIMARY_LIGHT, Colors.PRIMARY]
            }
            start={[0, 0]}
            end={[1, 0]}
            className="items-center py-3 rounded-lg"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                className={`text-base text-[#8a5225] font-outfit-extrabold`}
              >
                {enrollBool ? "Enroll to Course" : "Start Learning"}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    )
  );
};

export default SelectedCourseSection;
