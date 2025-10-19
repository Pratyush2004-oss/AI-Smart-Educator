import { useCourseStore } from "@/store/course.store";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import EnrolledCourseList from "../homeScreen/EnrolledCourseList";
import PracticeNavigationMenu from "../homeScreen/PracticeNavigationMenu";
import CourseProgressList from "../homeScreen/CourseProgressList";

const HomeScreen = () => {
  const { getCourseList } = useCourseStore();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCourseList();
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    getCourseList();
  }, []);

  return (
    <View className="flex-1">
      {/* Fullscreen gradient background */}
      <LinearGradient
        colors={["#1a1a2e", "#16213e", "#0f3460"]}
        start={[0, 0]}
        end={[1, 1]}
        className="absolute inset-0"
        pointerEvents="none"
      />

      {/* Content on top of gradient */}
      <FlatList
        data={[]}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <>
            <EnrolledCourseList />
            <PracticeNavigationMenu />
            <CourseProgressList />
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      />
    </View>
  );
};

export default HomeScreen;
