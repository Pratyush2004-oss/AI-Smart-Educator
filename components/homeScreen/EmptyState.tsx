import { View, Text, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/assets/constants";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";
import CreateCourseModal from "../shared/CreateCourseModal";

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const EmptyState = () => {
  const router = useRouter();

  return (
    <AView
      entering={FadeIn.duration(400)}
      className="items-center justify-center flex-1 px-6 pt-12"
    >
      {/* Icon Circle */}
      <AView
        entering={FadeInDown.delay(100).duration(400)}
        className="items-center justify-center w-32 h-32 mb-6 border-2 rounded-full bg-white/5 border-white/10"
      >
        <View
          className="items-center justify-center w-20 h-20 rounded-full"
          style={{ backgroundColor: Colors.PRIMARY + "20" }}
        >
          <Ionicons name="book-outline" size={40} color={Colors.PRIMARY} />
        </View>
      </AView>

      {/* Title */}
      <AView entering={FadeInDown.delay(200).duration(400)} className="mb-2">
        <Text className="text-2xl text-center font-outfit-extrabold">
          No Enrolled Courses Yet
        </Text>
      </AView>

      {/* Subtitle */}
      <AView entering={FadeInDown.delay(300).duration(400)} className="mb-8">
        <Text className="text-base leading-6 text-center text-gray-500 font-outfit">
          Start your learning journey by exploring our wide range of courses
        </Text>
      </AView>

      {/* Illustration Points */}
      <AView
        entering={FadeInDown.delay(400).duration(400)}
        className="w-full mb-8"
      >
        {[
          { icon: "search-outline", text: "Discover new topics" },
          { icon: "star-outline", text: "Learn at your own pace" },
          { icon: "trophy-outline", text: "Track your progress" },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row items-center p-3 mb-2 border rounded-xl bg-black/5 border-black/10"
          >
            <View
              className="items-center justify-center w-10 h-10 mr-3 rounded-full"
              style={{ backgroundColor: Colors.PRIMARY + "20" }}
            >
              <Ionicons
                name={item.icon as any}
                size={18}
                color={Colors.PRIMARY}
              />
            </View>
            <Text className="text-sm font-outfit">{item.text}</Text>
          </View>
        ))}
      </AView>

      {/* CTA Button */}
      <AView
        entering={FadeInDown.delay(500).duration(400)}
        className="w-full mb-4"
      >
        <CreateCourseModal>
          <AView className="overflow-hidden rounded-xl">
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
              start={[0, 0]}
              end={[1, 0]}
              className="flex-row items-center justify-center py-4"
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text className="ml-2 text-base text-white font-outfit-bold">
                Create Course
              </Text>
            </LinearGradient>
          </AView>
        </CreateCourseModal>
      </AView>

      {/* Explore Button */}
      <AView entering={FadeInDown.delay(500).duration(400)} className="w-full">
        <APressable
          onPress={() => router.push("/(tabs)/explore")}
          className="overflow-hidden rounded-xl"
        >
          <LinearGradient
            colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
            start={[0, 0]}
            end={[1, 0]}
            className="flex-row items-center justify-center py-4"
          >
            <Ionicons name="compass" size={20} color="#fff" />
            <Text className="ml-2 text-base text-white font-outfit-bold">
              Explore Courses
            </Text>
          </LinearGradient>
        </APressable>
      </AView>

      {/* Secondary Action */}
      <AView entering={FadeInDown.delay(600).duration(400)} className="mt-4">
        <Pressable
          onPress={() => router.push("/(tabs)/explore")}
          className="px-4 py-2"
        >
          <Text className="text-sm text-center text-gray-400 font-outfit">
            or browse by category →
          </Text>
        </Pressable>
      </AView>
    </AView>
  );
};

export default EmptyState;
