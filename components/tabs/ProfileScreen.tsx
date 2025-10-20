import { View, Text, Pressable, ScrollView, Image } from "react-native";
import React, { use } from "react";
import { useRouter } from "expo-router";
import { ProfileMenu, Colors } from "@/assets/constants/index";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useUserStore } from "@/store/auth.store";
import useUserHook from "@/hooks/useUserHook";
import CreateCourseModal from "../shared/CreateCourseModal";
import { useCourseStore } from "@/store/course.store";

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const ProfileScreen = () => {
  const { enrolledCourseList } = useCourseStore();
  const router = useRouter();
  const { user } = useUserStore();
  const { logoutHook } = useUserHook();

  const handleMenuPress = (path: string, type: string) => {
    router.push({
      pathname: path as any,
      params: { type: type },
    });
  };
  const quizMarks: number = user?.quizMarks ?? 0;
  const getMarksColor =
    quizMarks >= 75
      ? Colors.GREEN
      : quizMarks >= 50
        ? Colors.PRIMARY
        : Colors.RED;

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Header */}
        <AView
          entering={FadeInUp.duration(400)}
          className="items-center px-5 pt-8 pb-6"
        >
          {/* Avatar */}
          <View className="relative mb-4">
            <View className="items-center justify-center w-24 h-24 overflow-hidden border-4 rounded-full border-white/20">
              <Image
                source={{
                  uri: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View
              className="absolute bottom-0 right-0 p-1.5 rounded-full border-2 border-white/20"
              style={{ backgroundColor: Colors.PRIMARY }}
            >
              <Ionicons name="pencil" size={14} color="#fff" />
            </View>
          </View>

          {/* User Info */}
          <Text className="text-2xl text-white font-outfit-extrabold">
            {user?.name || "Guest User"}
          </Text>
          <Text className="mt-1 text-sm text-gray-400 font-outfit">
            {user?.email || "guest@example.com"}
          </Text>

          {/* Stats */}
          <View className="flex-row justify-center w-full gap-4 mt-6">
            <View className="items-center flex-1 px-4 py-3 border rounded-xl bg-white/5 border-white/10">
              <Text
                className="text-2xl font-outfit-extrabold"
                style={{ color: Colors.PRIMARY }}
              >
                {enrolledCourseList.length}
              </Text>
              <Text className="mt-1 text-xs text-gray-400 font-outfit">
                Courses
              </Text>
            </View>
            <View className="items-center flex-1 px-4 py-3 border rounded-xl bg-white/5 border-white/10">
              <Text
                className="text-2xl font-outfit-extrabold"
                style={{ color: getMarksColor }}
              >
                {quizMarks}
              </Text>
              <Text className="mt-1 text-xs text-gray-400 font-outfit">
                Marks Scored
              </Text>
            </View>
            <View className="items-center flex-1 px-4 py-3 border rounded-xl bg-white/5 border-white/10">
              <Text
                className="text-2xl font-outfit-extrabold"
                style={{ color: Colors.ORANGE }}
              >
                45h
              </Text>
              <Text className="mt-1 text-xs text-gray-400 font-outfit">
                Learning
              </Text>
            </View>
          </View>
        </AView>

        {/* Menu Items */}
        <View className="px-5 mt-4">
          <Text className="mb-3 text-sm text-gray-400 uppercase font-outfit-bold">
            Account Settings
          </Text>

          {/* create course modal */}
          <CreateCourseModal>
            <AView
              entering={FadeInDown.delay(60).duration(300)}
              className="mb-3 overflow-hidden border rounded-xl border-white/10"
            >
              <LinearGradient
                colors={[
                  "rgba(255, 255, 255, 0.05)",
                  "rgba(255, 255, 255, 0.02)",
                ]}
                start={[0, 0]}
                end={[1, 0]}
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center flex-1">
                  {/* Icon */}
                  <View
                    className="items-center justify-center w-10 h-10 mr-4 rounded-full"
                    style={{
                      backgroundColor: Colors.PRIMARY + "20",
                    }}
                  >
                    <Ionicons
                      name={"add-outline"}
                      size={20}
                      color={Colors.PRIMARY}
                    />
                  </View>

                  {/* Text */}
                  <View className="flex-1">
                    <Text
                      className="text-base font-outfit-bold"
                      style={{
                        color: "#fff",
                      }}
                    >
                      Create Course
                    </Text>
                    <Text className="mt-0.5 text-xs text-gray-400 font-outfit">
                      {"Create a new course"}
                    </Text>
                  </View>

                  {/* Arrow */}
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={"#9ca3af"}
                  />
                </View>
              </LinearGradient>
            </AView>
          </CreateCourseModal>

          {/* Menu Items */}
          {ProfileMenu.map((menu, index) => (
            <APressable
              key={menu.name}
              entering={FadeInDown.delay((index + 1) * 60).duration(300)}
              onPress={() => handleMenuPress(menu.path, menu.type || "")}
              className="mb-3 overflow-hidden border rounded-xl border-white/10"
            >
              <LinearGradient
                colors={
                  menu.name === "Logout"
                    ? ["rgba(239, 68, 68, 0.1)", "rgba(220, 38, 38, 0.05)"]
                    : ["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]
                }
                start={[0, 0]}
                end={[1, 0]}
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center flex-1">
                  {/* Icon */}
                  <View
                    className="items-center justify-center w-10 h-10 mr-4 rounded-full"
                    style={{
                      backgroundColor:
                        menu.name === "Logout"
                          ? "rgba(239, 68, 68, 0.2)"
                          : Colors.PRIMARY + "20",
                    }}
                  >
                    <Ionicons
                      name={menu.icon as any}
                      size={20}
                      color={
                        menu.name === "Logout" ? "#ef4444" : Colors.PRIMARY
                      }
                    />
                  </View>

                  {/* Text */}
                  <View className="flex-1">
                    <Text
                      className="text-base font-outfit-bold"
                      style={{
                        color: menu.name === "Logout" ? "#ef4444" : "#fff",
                      }}
                    >
                      {menu.name}
                    </Text>
                    {menu.name !== "Logout" && (
                      <Text className="mt-0.5 text-xs text-gray-400 font-outfit">
                        {menu.desc}
                      </Text>
                    )}
                  </View>

                  {/* Arrow */}
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={menu.name === "Logout" ? "#ef4444" : "#9ca3af"}
                  />
                </View>
              </LinearGradient>
            </APressable>
          ))}
          {/* logout button */}
          <APressable
            entering={FadeInDown.delay(7 * 60).duration(300)}
            onPress={logoutHook}
            className="mb-3 overflow-hidden border rounded-xl border-white/10"
          >
            <LinearGradient
              colors={["rgba(239, 68, 68, 0.1)", "rgba(220, 38, 38, 0.05)"]}
              start={[0, 0]}
              end={[1, 0]}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center flex-1">
                {/* Icon */}
                <View
                  className="items-center justify-center w-10 h-10 mr-4 rounded-full"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <Ionicons
                    name={"log-out-outline"}
                    size={20}
                    color={"#ef4444"}
                  />
                </View>

                {/* Text */}
                <View className="flex-1">
                  <Text
                    className="text-base font-outfit-bold"
                    style={{
                      color: "#ef4444",
                    }}
                  >
                    {"Logout"}
                  </Text>
                </View>

                {/* Arrow */}
                <Ionicons name="chevron-forward" size={20} color={"#ef4444"} />
              </View>
            </LinearGradient>
          </APressable>
        </View>

        {/* App Version */}
        <AView
          entering={FadeInDown.delay(600).duration(300)}
          className="items-center px-5 mt-8"
        >
          <Text className="text-xs text-gray-500 font-outfit">
            Smart Education v1.0.0
          </Text>
          <Text className="mt-1 text-xs text-gray-600 font-outfit">
            © 2025 All rights reserved
          </Text>
        </AView>
      </ScrollView>
    </LinearGradient>
  );
};

export default ProfileScreen;
