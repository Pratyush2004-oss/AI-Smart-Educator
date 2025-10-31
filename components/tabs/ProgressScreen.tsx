import { Colors, imageAssets } from "@/assets/constants/index";
import { useCourseStore } from "@/store/course.store";
import { CourseType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, {
  memo,
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.95;

const APressable = Animated.createAnimatedComponent(Pressable);

const ProgressScreen = () => {
  const searchRef = useRef<TextInput>(null);
  const { enrolledCourseList, getCourseInfo } = useCourseStore();
  const [loading, setloading] = useState<string | null>(null);
  const [search, setsearch] = useState("");
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [sortMode, setSortMode] = useState<
    "none" | "progressDesc" | "title" | "difficulty"
  >("none");
  const router = useRouter();

  // Focus the input only when it becomes visible
  useEffect(() => {
    if (isSearchVisible) {
      const t = setTimeout(() => searchRef.current?.focus(), 80);
      return () => clearTimeout(t);
    } else {
      Keyboard.dismiss();
    }
  }, [isSearchVisible]);

  // Defer search to prevent aggressive re-renders while typing
  const deferredSearch = useDeferredValue(search);

  // Filter + sort using deferred query (prevents focus flicker)
  const sortedData = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();
    const base = query
      ? enrolledCourseList.filter(
          (course) =>
            course.courseTitle.toLowerCase().includes(query) ||
            course.category.toLowerCase().includes(query) ||
            course.difficulty.toLowerCase().includes(query)
        )
      : enrolledCourseList;

    const list = [...base];
    if (sortMode === "progressDesc") {
      list.sort((a, b) => {
        const pa = a.chaptersCount
          ? a.completedChaptersCount / a.chaptersCount
          : 0;
        const pb = b.chaptersCount
          ? b.completedChaptersCount / b.chaptersCount
          : 0;
        return pb - pa;
      });
    } else if (sortMode === "title") {
      list.sort((a, b) =>
        a.courseTitle.localeCompare(b.courseTitle, undefined, {
          sensitivity: "base",
        })
      );
    } else if (sortMode === "difficulty") {
      list.sort((a, b) =>
        a.difficulty.localeCompare(b.difficulty, undefined, {
          sensitivity: "base",
        })
      );
    }
    return list;
  }, [enrolledCourseList, deferredSearch, sortMode]);

  // Cycle sort modes
  const toggleSort = useCallback(() => {
    setSortMode((prev) =>
      prev === "none"
        ? "progressDesc"
        : prev === "progressDesc"
          ? "title"
          : prev === "title"
            ? "difficulty"
            : "none"
    );
  }, []);

  // Open course
  const handleCoursePress = useCallback(
    async (course: CourseType) => {
      setloading(course._id);
      await getCourseInfo(course)
        .then(() => {
          router.push({
            pathname: "/courseView",
            params: { enroll: "false" },
          });
        })
        .finally(() => setloading(null));
    },
    [getCourseInfo, router]
  );

  // Header
  const ListHeader = useMemo(
    () => (
      <View className="px-5 py-3 mb-4 border-b border-white/10">
        {!isSearchVisible ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-2xl font-outfit-extrabold">
                Your Progress
              </Text>
              <Text className="mt-1 text-base text-gray-500 font-outfit-medium">
                Continue learning where you left off ...
              </Text>
            </View>

            <View className="flex-row items-center">
              <Pressable
                onPress={toggleSort}
                className="p-2 mr-2 border border-black rounded-full bg-black/10"
              >
                <Ionicons
                  name={
                    sortMode === "progressDesc"
                      ? "trending-up-outline"
                      : sortMode === "difficulty"
                        ? "flame-outline"
                        : sortMode === "title"
                          ? "text-outline"
                          : "funnel-outline"
                  }
                  size={18}
                  color="#000"
                />
              </Pressable>

              <Pressable
                onPress={() => setIsSearchVisible(true)}
                className="p-2 border border-black rounded-full bg-black/10"
              >
                <Ionicons name="search-outline" size={18} color="#000" />
              </Pressable>
            </View>
          </View>
        ) : (
          <View pointerEvents="auto">
            <View className="flex-row items-center px-3 border h-11 rounded-xl bg-white/10 border-white/20">
              <Ionicons name="search" size={16} color="#9ca3af" />
              <TextInput
                ref={searchRef}
                value={search}
                onChangeText={setsearch}
                placeholder="Search courses..."
                placeholderTextColor="#9ca3af"
                className="flex-1 ml-2 font-outfit-medium"
                returnKeyType="search"
                blurOnSubmit={false}
                autoCorrect={false}
                autoCapitalize="none"
                // keep focus stable on Android
                underlineColorAndroid="transparent"
              />
              <Pressable
                onPress={() => {
                  setsearch("");
                  setIsSearchVisible(false);
                }}
                className="p-1 rounded-full"
              >
                <Ionicons name="close-circle" size={18} color="#e5e7eb" />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    ),
    [isSearchVisible, search, sortMode, toggleSort]
  );

  // Memo CourseCard to avoid remounts while typing
  const CourseCard = memo(
    ({
      item,
      index,
      animate,
    }: {
      item: CourseType;
      index: number;
      animate: boolean;
    }) => {
      const progress =
        item.chaptersCount > 0
          ? (item.completedChaptersCount / item.chaptersCount) * 100
          : 0;

      const getProgressColor = () => {
        return Colors.GREEN;
      };

      const Content = (
        <View className="overflow-hidden rounded-2xl">
          <View className="relative">
            <Image
              source={
                imageAssets[item.banner_image as keyof typeof imageAssets]
              }
              className="w-full h-48"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              className="absolute bottom-0 left-0 right-0 h-20"
            />
            <View className="absolute px-3 py-1 rounded-full top-3 right-3 bg-white/90">
              <Text
                className="text-xs font-outfit-bold"
                style={{ color: Colors.PRIMARY }}
              >
                {item.difficulty}
              </Text>
            </View>
          </View>

          <View className="p-4">
            <Text className="text-lg font-outfit-bold" numberOfLines={2}>
              {item.courseTitle}
            </Text>

            <View className="flex-row items-center mt-3 mb-2">
              <View className="flex-row items-center mr-4">
                <Ionicons name="book-outline" size={16} color="#9ca3af" />
                <Text className="ml-1 text-base text-gray-500 font-outfit">
                  {item.chaptersCount} chapters
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color={getProgressColor()}
                />
                <Text
                  className="ml-1 text-base font-outfit-semibold"
                  style={{ color: getProgressColor() }}
                >
                  {item.completedChaptersCount} completed
                </Text>
                {loading === item._id && (
                  <ActivityIndicator
                    color={Colors.PRIMARY}
                    className="flex-1"
                  />
                )}
              </View>
            </View>

            <View className="mt-2">
              <View className="w-full h-1.5 overflow-hidden rounded-full bg-gray-400/10">
                <View
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: getProgressColor(),
                  }}
                />
              </View>
              <Text className="mt-1 text-sm text-right text-gray-400 font-outfit">
                {Math.round(progress)}% complete
              </Text>
            </View>
          </View>
        </View>
      );

      if (animate) {
        return (
          <APressable
            entering={FadeInRight.delay(index * 60).duration(240)}
            onPress={() => handleCoursePress(item)}
            // "overflow-hidden" is REMOVED
            // Background, border, and NEW shadow styles are ADDED
            className="mb-3 mr-4 border rounded-2xl bg-white/5 border-white/10"
            disabled={loading !== null}
            style={{
              width: CARD_WIDTH,
              shadowColor: "#0b1220",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.12,
              shadowRadius: 12,
            }}
          >
            {Content}
          </APressable>
        );
      }
      return (
        <Pressable
          onPress={() => handleCoursePress(item)}
          className="mb-3 mr-4 overflow-hidden rounded-2xl"
          disabled={loading !== null}
          style={{
            width: CARD_WIDTH,
            shadowColor: "#0b1220",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
          }}
        >
          {Content}
        </Pressable>
      );
    }
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.select({ ios: 0, android: 0 })}
      className="flex-1"
    >
      <View className="flex-1">
        {ListHeader}

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingTop: 8,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag" // only dismiss if user drags
        >
          {sortedData.length > 0 ? (
            sortedData.map((item, index) => (
              <CourseCard
                key={item._id}
                item={item}
                index={index}
                // Disable animations while searching to prevent layout thrash that can blur input
                animate={!isSearchVisible && deferredSearch.length === 0}
              />
            ))
          ) : (
            <View className="items-center justify-center flex-1 px-5 py-16">
              <Ionicons name="school-outline" size={56} color="#6b7280" />
              <Text className="mt-3 text-lg text-center text-gray-500 font-outfit-bold">
                No enrolled courses yet
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ProgressScreen;
