import BackHeader from "@/components/shared/BackHeader";
import { useCourseStore } from "@/store/course.store";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import FlipCard from "react-native-flip-card";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { Colors } from "@/assets/constants";
import { FlashcardContentType } from "@/types/index";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.82;
const SPACING = 16;
const AView = Animated.View;

const FlashcardScreen = () => {
  const { selectedFlashcard } = useCourseStore();
  // get progress
  const [currentPage, setcurrentPage] = useState(0);
  const flatRef = React.useRef<FlatList<FlashcardContentType>>(null);

  const flashcards = selectedFlashcard?.flashcardDetail ?? [];
  const total = flashcards.length;
  const progress = total ? ((currentPage + 1) / total) * 100 : 0; // handle scroll

  // handle scroll (index based on card width + spacing)
  const onScroll = (e: any) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / (CARD_WIDTH + SPACING));
    setcurrentPage(Math.min(Math.max(idx, 0), Math.max(total - 1, 0)));
  };

  const goTo = (dir: 1 | -1) => {
    const next = Math.min(
      Math.max(currentPage + dir, 0),
      Math.max(total - 1, 0)
    );
    if (next !== currentPage) {
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setcurrentPage(next);
    }
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: FlashcardContentType;
    index: number;
  }) => (
    <AView
      entering={FadeInRight.delay(index * 60).duration(300)}
      style={{ width: CARD_WIDTH }}
      className="mr-4"
    >
      <View className="h-full p-5 border rounded-2xl border-white/10 bg-white/5">
        <FlipCard
          style={{ borderWidth: 0 }}
          friction={10}
          perspective={1000}
          flipHorizontal
          flipVertical={false}
          clickable
        >
          {/* FRONT - Question */}
          <View className="items-center justify-center flex-1 p-5 my-auto">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="help-circle-outline"
                size={18}
                color={Colors.PRIMARY}
              />
              <Text className="ml-2 text-2xl text-white/70 font-outfit-bold">
                Question
              </Text>
            </View>
            <View className="py-5">
              <Text className="text-4xl text-center text-white font-outfit-extrabold">
                {item.front}
              </Text>
            </View>
            <Text className="mt-4 text-xs text-gray-400 font-outfit">
              Tap to flip
            </Text>
          </View>

          {/* BACK - Answer */}
          <View className="items-center justify-center flex-1 p-5 my-auto bg-gray-900/30 rounded-xl">
            <View className="flex-row items-center mb-3">
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#22c55e"
              />
              <Text className="ml-2 text-xl text-white/70 font-outfit-bold">
                Answer
              </Text>
            </View>
            <View className="py-5">
              <Text className="text-base leading-6 text-center text-gray-200 font-outfit-medium">
                {item.back}
              </Text>
            </View>
            <Text className="mt-4 text-xs text-gray-400 font-outfit">
              Tap to flip back
            </Text>
          </View>
        </FlipCard>
      </View>
    </AView>
  );

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <BackHeader
        title={selectedFlashcard?.courseTitle || ""}
        subtitle="Flashcard"
        backgroundColor="gradient"
      />
      {/* Progress */}
      <AView entering={FadeInDown.duration(300)} className="px-5 pt-3 pb-2">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-white/70 font-outfit">
            Card {total ? currentPage + 1 : 0} of {total}
          </Text>
          <Text
            className="text-sm font-outfit-bold"
            style={{ color: Colors.PRIMARY }}
          >
            {Math.round(progress)}%
          </Text>
        </View>
        <View className="w-full h-2 overflow-hidden rounded-full bg-white/10">
          <View
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: Colors.PRIMARY }}
          />
        </View>
      </AView>

      {/* Cards - Fixed height container */}
      <View className="flex-1" style={{ maxHeight: 600 }}>
        <FlatList
          ref={flatRef}
          data={flashcards}
          renderItem={renderItem}
          keyExtractor={(_, i) => String(i)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH + SPACING,
            offset: (CARD_WIDTH + SPACING) * index,
            index,
          })}
          ListEmptyComponent={
            <AView
              entering={FadeInDown.duration(300)}
              className="items-center justify-center w-full py-16"
            >
              <Ionicons name="albums-outline" size={48} color="#6b7280" />
              <Text className="mt-3 text-base text-gray-300 font-outfit">
                No flashcards available
              </Text>
            </AView>
          }
        />
      </View>

      {/* Controls */}
      <View className="flex-row items-center justify-between px-5 pt-4 pb-6">
        <Pressable
          onPress={() => goTo(-1)}
          disabled={currentPage === 0}
          className={`px-5 py-3 rounded-xl border bg-white/5 border-white/10 ${
            currentPage === 0 ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white font-outfit-bold">Previous</Text>
        </Pressable>

        <Pressable
          onPress={() => goTo(1)}
          disabled={currentPage >= total - 1}
          className={`overflow-hidden rounded-xl ${currentPage >= total - 1 ? "opacity-50" : ""}`}
        >
          <LinearGradient
            colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="px-5 py-3 rounded-xl"
          >
            <Text className="text-white font-outfit-bold">Next</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default FlashcardScreen;
