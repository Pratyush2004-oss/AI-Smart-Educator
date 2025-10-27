import { useCourseStore } from "@/store/course.store";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import EnrolledCourseList from "../homeScreen/EnrolledCourseList";
import PracticeNavigationMenu from "../homeScreen/PracticeNavigationMenu";
import CourseProgressList from "../homeScreen/CourseProgressList";
import LoadingSection from "../shared/LoadingSection";
import EmptyState from "../homeScreen/EmptyState";
import { useUserStore } from "@/store/auth.store";

const HomeScreen = () => {
  const { getCourseList, enrolledCourseList } = useCourseStore();
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const { token, user } = useUserStore();
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getCourseList();
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    isLoading &&
      getCourseList().finally(() => {
        setisLoading(false);
      });
  }, [token, user]);

  return (
    <View className="flex-1">
      {/* Fullscreen gradient background */}
      <LinearGradient
        colors={["#f9f8f8", "#f9f8f8", "#f9f8f8"]}
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
        ListHeaderComponent={() =>
          isLoading ? (
            <LoadingSection isHome />
          ) : enrolledCourseList.length > 0 ? (
            <>
              <EnrolledCourseList />
              <PracticeNavigationMenu />
              <CourseProgressList />
            </>
          ) : (
            <EmptyState />
          )
        }
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
