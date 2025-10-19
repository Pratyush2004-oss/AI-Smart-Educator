import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackHeader from "@/components/shared/BackHeader";
import { useCourseStore } from "@/store/course.store";
import Animated, {
  FadeInDown,
  FadeOut,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/assets/constants";

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

type AccordionItemProps = {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
};

const AccordionItem: React.FC<AccordionItemProps> = ({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}) => {
  // Removed height measuring approach
  const rotate = useSharedValue("0deg");

  React.useEffect(() => {
    rotate.value = withTiming(isOpen ? "180deg" : "0deg", { duration: 200 });
  }, [isOpen]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotate.value }],
  }));

  return (
    <AView entering={FadeInDown.duration(300)} className="mb-3">
      {/* Header */}
      <APressable
        onPress={onToggle}
        className={`px-4 py-4 rounded-2xl border flex-row items-center justify-between ${
          isOpen ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10"
        }`}
      >
        <View className="flex-row items-center flex-1 pr-3">
          <View
            className="items-center justify-center w-8 h-8 mr-3 rounded-full"
            style={{ backgroundColor: Colors.PRIMARY + "33" }}
          >
            <Text
              className="text-sm font-outfit-bold"
              style={{ color: Colors.PRIMARY }}
            >
              {index + 1}
            </Text>
          </View>
          <Text
            className="flex-1 text-base text-white font-outfit"
            numberOfLines={2}
          >
            {question}
          </Text>
        </View>
        <Animated.View style={iconStyle}>
          <Ionicons name="chevron-down" size={18} color="#fff" />
        </Animated.View>
      </APressable>

      {/* Body (collapsible) - no onLayout, uses Reanimated Layout */}
      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(220)}
          exiting={FadeOut.duration(120)}
          layout={Layout.springify().stiffness(140).damping(16)}
          className="mt-2 mb-4 overflow-hidden border rounded-2xl border-white/10 bg-white/5"
        >
          <View className="px-4 pt-3 pb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={16}
                color={Colors.PRIMARY}
              />
              <Text className="ml-2 text-sm text-white/70 font-outfit-bold">
                Answer
              </Text>
            </View>
            <Text className="text-[15px] leading-6 text-gray-200 font-outfit text-justify">
              {answer}
            </Text>
          </View>
        </Animated.View>
      )}
    </AView>
  );
};
// ...existing code...

const QaScreen = () => {
  const { selectedQa } = useCourseStore();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const data = useMemo(() => selectedQa?.qaDetail ?? [], [selectedQa]);

  const onToggle = (idx: number) => {
    setSelectedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <BackHeader
        title={selectedQa?.courseTitle || "Q&A"}
        subtitle={`Q&A • ${selectedQa?.qaCount ?? 0} questions`}
        backgroundColor="gradient"
      />

      {/* Header summary */}
      <AView entering={FadeInDown.duration(300)} className="px-5 pt-3 pb-2">
        <View className="flex-row items-center justify-between mt-3">
          <Text className="text-lg text-white font-outfit-bold">
            Frequently Asked
          </Text>
          <View className="px-3 py-1 rounded-full bg-white/10">
            <Text className="text-xs text-white font-outfit-bold">
              {data.length} items
            </Text>
          </View>
        </View>
      </AView>

      {/* List */}
      <FlatList
        data={data}
        keyExtractor={(item, idx) => `${idx}-${item.question}`}
        renderItem={({ item, index }) => (
          <AccordionItem
            index={index}
            question={item.question}
            answer={item.answer}
            isOpen={selectedIndex === index}
            onToggle={() => onToggle(index)}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 28,
          paddingTop: 8,
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 py-24">
            <Ionicons name="chatbubbles-outline" size={56} color="#6b7280" />
            <Text className="mt-3 text-base text-gray-300 font-outfit">
              No questions available
            </Text>
          </View>
        }
      />
    </LinearGradient>
  );
};

export default QaScreen;
