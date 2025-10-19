import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import { ChapterType } from "@/types";
import BackHeader from "@/components/shared/BackHeader";
import { LinearGradient } from "expo-linear-gradient";
import * as Speech from "expo-speech";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/assets/constants";

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

// Custom Code Block Component
const CodeBlock = ({ code }: { code: string }) => {
  return (
    <View className="mb-4 overflow-hidden border rounded-2xl bg-gray-900/80 border-white/10">
      <View className="flex-row items-center justify-between px-4 py-3 border-b bg-gray-800/80 border-white/10">
        <View className="flex-row items-center">
          <Ionicons name="code-slash" size={18} color={Colors.PRIMARY} />
          <Text className="ml-2 text-base text-white font-outfit-bold">
            Code Example
          </Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-sm leading-6 text-green-300 font-outfit-medium">
            {renderBoldSegments(code)}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

// Render bold segments for **text**
const renderBoldSegments = (text?: string) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.+?\*\*)/g);
  return parts.map((part, idx) => {
    const isBold = part.startsWith("**") && part.endsWith("**");
    if (isBold) {
      return (
        <Text key={idx} className="text-white font-outfit-bold">
          {part.slice(2, -2)}
        </Text>
      );
    }
    return <Text key={idx}>{part}</Text>;
  });
};

const ChapterViewScreen = () => {
  const { chapterIdx, chapterParams } = useLocalSearchParams();
  const chapterIndex = parseInt(
    Array.isArray(chapterIdx) ? chapterIdx[0] : chapterIdx
  );
  const raw = Array.isArray(chapterParams) ? chapterParams[0] : chapterParams;
  const chapters: ChapterType = JSON.parse(String(raw));
  const [currentPage, setcurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const GetProgress = () => {
    const perc = ((currentPage + 1) / chapters.content.length) * 100;
    return perc;
  };

  const TextToSpeech = () => {
    const content = chapters.content[currentPage];
    const text = `${content.topic}. ${content.explain}${
      content.example ? `. Here is an example: ${content.example}` : ""
    }`;
    const options = {
      language: "en-US",
      onDone: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
      onStopped: () => {
        setIsPlaying(false);
        setIsPaused(false);
      },
    };
    Speech.speak(text, options);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const toggleAudio = async () => {
    if (Platform.OS === "ios") {
      // iOS supports pause and resume
      if (isPaused) {
        await Speech.resume();
        setIsPaused(false);
      } else {
        await Speech.pause();
        setIsPaused(true);
      }
    } else {
      // Android: stop and restart or just stop
      if (isPlaying) {
        stopAudio();
      } else {
        TextToSpeech();
      }
    }
  };

  const stopAudio = () => {
    Speech.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Stop audio when pathname changes
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [pathname]);

  // Stop audio when currentPage changes
  useEffect(() => {
    stopAudio();
  }, [currentPage]);

  // Navigation handlers
  const handleNext = () => {
    if (currentPage < chapters.content.length - 1) {
      setcurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setcurrentPage((prev) => prev - 1);
    }
  };

  // save chapter handler
  const onChapterComplete = async () => {
    setIsLoading(true);
    stopAudio();
    // save chapter progress
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // go back to course view
    router.replace("/courseView");
  };

  if (!chapters)
    return (
      <View className="flex-1">
        <BackHeader title="Nothing Here" />
        <View className="items-center justify-center flex-1 space-y-2 bg-white">
          <Text className="text-lg font-outfit-bold">Chapter Not Found</Text>
        </View>
      </View>
    );

  const currentContent = chapters.content[currentPage];
  const isLastPage = currentPage === chapters.content.length - 1;
  const isFirstPage = currentPage === 0;

  return (
    <View className="flex-1">
      <BackHeader
        title={chapterIndex + 1 + ". " + chapters.chapterName}
        backgroundColor="gradient"
      />
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        start={[0, 0]}
        end={[1, 1]}
        className="flex-1"
      >
        {/* Progress Bar */}
        <AView entering={FadeInDown.duration(300)} className="px-5 pt-4 pb-3">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm text-white/70 font-outfit">
              Section {currentPage + 1} of {chapters.content.length}
            </Text>
            <Text
              className="text-sm font-outfit-bold"
              style={{ color: Colors.PRIMARY }}
            >
              {Math.round(GetProgress())}%
            </Text>
          </View>
          <View className="w-full h-2 overflow-hidden rounded-full bg-white/10">
            <View
              className="h-full rounded-full"
              style={{
                width: `${GetProgress()}%`,
                backgroundColor: Colors.PRIMARY,
              }}
            />
          </View>
        </AView>

        {/* Content */}
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <AView
            key={currentPage}
            entering={FadeIn.duration(400)}
            className="pb-4"
          >
            {/* Topic */}
            <View className="p-5 mb-4 border bg-white/5 rounded-2xl border-white/10">
              <View className="flex-row items-center mb-3">
                <View
                  className="items-center justify-center w-8 h-8 mr-3 rounded-full"
                  style={{ backgroundColor: Colors.PRIMARY + "40" }}
                >
                  <Ionicons name="bulb" size={18} color={Colors.PRIMARY} />
                </View>
                <Text className="text-lg text-white font-outfit-bold">
                  Topic
                </Text>
              </View>
              <Text className="text-base leading-6 text-white font-outfit">
                {currentContent.topic}
              </Text>
            </View>

            {/* Explanation */}
            <View className="p-5 mb-4 border bg-white/5 rounded-2xl border-white/10">
              <View className="flex-row items-center mb-3">
                <View
                  className="items-center justify-center w-8 h-8 mr-3 rounded-full"
                  style={{ backgroundColor: Colors.PRIMARY + "40" }}
                >
                  <Ionicons
                    name="book-outline"
                    size={18}
                    color={Colors.PRIMARY}
                  />
                </View>
                <Text className="text-lg text-white font-outfit-bold">
                  Explanation
                </Text>
              </View>
              <Text className="text-base leading-7 text-gray-300 font-outfit">
                {renderBoldSegments(currentContent.explain)}
              </Text>
            </View>

            {/* Example (if exists) */}
            {currentContent.example && (
              <View className="p-5 mb-4 border bg-green-500/5 rounded-2xl border-green-400/20">
                <View className="flex-row items-center mb-3">
                  <View className="items-center justify-center w-8 h-8 mr-3 rounded-full bg-green-500/20">
                    <Ionicons name="flask" size={18} color="#22c55e" />
                  </View>
                  <Text className="text-lg text-white font-outfit-bold">
                    Example
                  </Text>
                </View>
                <Text className="text-base leading-7 text-gray-300 font-outfit">
                  {renderBoldSegments(currentContent.example)}
                </Text>
              </View>
            )}

            {/* Code (if exists) */}
            {currentContent.code && <CodeBlock code={currentContent.code} />}
          </AView>
        </ScrollView>

        {/* Audio Controls */}
        <View className="flex-row gap-3 px-5 pb-3">
          <APressable
            onPress={TextToSpeech}
            className="items-center justify-center flex-1 p-3 border rounded-xl bg-white/5 border-white/10"
          >
            <View className="flex-row items-center">
              <Ionicons name="play" size={20} color={Colors.PRIMARY} />
              <Text className="ml-2 text-sm text-white font-outfit-bold">
                {Platform.OS === "android" ? "Play" : "Start"}
              </Text>
            </View>
          </APressable>

          {Platform.OS === "ios" && (
            <APressable
              onPress={toggleAudio}
              disabled={!isPlaying}
              className={`flex-1 items-center justify-center p-3 border rounded-xl bg-white/5 border-white/10 ${
                !isPlaying ? "opacity-50" : ""
              }`}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name={isPaused ? "play" : "pause"}
                  size={20}
                  color={Colors.PRIMARY}
                />
                <Text className="ml-2 text-sm text-white font-outfit-bold">
                  {isPaused ? "Resume" : "Pause"}
                </Text>
              </View>
            </APressable>
          )}

          <APressable
            onPress={stopAudio}
            className="items-center justify-center p-3 border rounded-xl bg-white/5 border-white/10"
          >
            <Ionicons name="stop" size={20} color="#ef4444" />
          </APressable>
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row gap-3 px-5 pb-6">
          {/* Previous Button */}
          <APressable
            onPress={handlePrevious}
            disabled={isFirstPage}
            className={`flex-1 overflow-hidden rounded-xl ${
              isFirstPage ? "opacity-50" : ""
            }`}
          >
            <View className="flex-row items-center justify-center py-4 border bg-white/5 border-white/10">
              <Ionicons name="chevron-back" size={20} color="white" />
              <Text className="ml-2 text-base text-white font-outfit-bold">
                Previous
              </Text>
            </View>
          </APressable>

          {/* Next/Finish Button */}
          {isLastPage ? (
            <APressable
              onPress={onChapterComplete}
              disabled={isLoading}
              className="flex-1 overflow-hidden rounded-xl"
            >
              <LinearGradient
                colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
                start={[0, 0]}
                end={[1, 0]}
                className="flex-row items-center justify-center py-4"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                    <Text className="ml-2 text-base text-white font-outfit-bold">
                      Finish
                    </Text>
                  </>
                )}
              </LinearGradient>
            </APressable>
          ) : (
            <APressable
              onPress={handleNext}
              className="flex-1 overflow-hidden rounded-xl"
            >
              <LinearGradient
                colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
                start={[0, 0]}
                end={[1, 0]}
                className="flex-row items-center justify-center py-4"
              >
                <Text className="mr-2 text-base text-white font-outfit-bold">
                  Next
                </Text>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </LinearGradient>
            </APressable>
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

export default ChapterViewScreen;
