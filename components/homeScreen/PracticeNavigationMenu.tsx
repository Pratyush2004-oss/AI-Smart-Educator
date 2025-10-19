import { PraticeOption } from "@/assets/constants";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.3;

const APressable = Animated.createAnimatedComponent(Pressable);
const AView = Animated.View;

const PracticeNavigationMenu = () => {
  const router = useRouter();

  const handlePress = (path: string) => {
    router.push(path as any);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof PraticeOption)[0];
    index: number;
  }) => {
    return (
      <APressable
        entering={FadeInRight.delay(index * 100).duration(300)}
        // onPress={() => handlePress(item.path)}
        className="mr-2 overflow-hidden rounded-2xl"
        style={{ width: CARD_WIDTH }}
      >
        <LinearGradient
          colors={["rgba(163, 122, 81, 0.15)", "rgba(228, 216, 201, 0.1)"]}
          start={[0, 0]}
          end={[1, 1]}
          className="overflow-hidden border rounded-2xl border-white/10"
        >
          {/* Background Image */}
          <View className="relative h-32">
            <Image
              source={item.image}
              className="w-full h-full opacity-70"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.5)"]}
              className="absolute bottom-0 left-0 right-0 h-16"
            />
            <Text className="absolute text-sm text-white bottom-2 left-3 font-outfit-medium">
              {item.name}
            </Text>
          </View>
        </LinearGradient>
      </APressable>
    );
  };

  return (
    <AView entering={FadeInDown.duration(300)} className="p-3 px-5">
      <Text className="text-2xl text-white font-outfit-extrabold">
        Practice
      </Text>
      <Text className="mt-1 text-sm text-gray-400 font-outfit">
        Explore Quizes, Flashcard and Question-Answers
      </Text>
      <FlatList
        data={PraticeOption}
        numColumns={3}
        className="mt-4"
        contentContainerStyle={{ paddingVertical: 5 }}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        snapToInterval={16}
        decelerationRate="fast"
      />
    </AView>
  );
};

export default PracticeNavigationMenu;
