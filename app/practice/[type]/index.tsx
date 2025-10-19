import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, PraticeOption } from "@/assets/constants";
import { LinearGradient } from "expo-linear-gradient";
import BackHeader from "@/components/shared/BackHeader";
import { useCourseStore } from "@/store/course.store";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { FlashcardType, QnaType, QuizType } from "@/types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const PracticeScreen = () => {
  const { type } = useLocalSearchParams();
  const option = PraticeOption.find((item) => item.name === type);
  const router = useRouter();
  const {
    fetchFlashcardList,
    fetchQaList,
    fetchQuizList,
    Quizlist,
    QaList,
    FlashcardList,
    fetchFlashcardDetails,
    fetchQuizDetails,
    fetchQaDetails,
  } = useCourseStore();

  const [isLoading, setIsLoading] = useState(true);

  const ChoiceArray = [
    {
      id: 1,
      type: "Flashcards",
      getList: fetchFlashcardList,
      list: FlashcardList,
      fetchSingle: fetchFlashcardDetails,
      path: "/flashcard",
    },
    {
      id: 2,
      type: "Question & Ans",
      getList: fetchQaList,
      list: QaList,
      fetchSingle: fetchQaDetails,
      path: "/qa",
    },
    {
      id: 3,
      type: "Quiz",
      getList: fetchQuizList,
      list: Quizlist,
      fetchSingle: fetchQuizDetails,
      path: "/quiz",
    },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await ChoiceArray.find((item) => item.type === type)?.getList();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  // Get the appropriate list based on type
  const getDataList = () => {
    return ChoiceArray.find((item) => item.type === type)?.list || [];
  };

  const dataList = getDataList();

  const handleItemPress = async (item: any) => {
    // fetch first
    await ChoiceArray.find((item) => item.type === type)
      ?.fetchSingle(item)
      .then(() => {
        // Navigate to specific practice item
        router.push({
          pathname: ChoiceArray.find((item) => item.type === type)?.path as
            | "/flashcard"
            | "/qa"
            | "/quiz",
        });
      });
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    if (type === "Quiz") return renderQuizItem({ item, index });
    if (type === "Flashcards")
      return renderFlashcardItem({ item, index } as any);
    if (type === "Question & Ans") return renderQaItem({ item, index } as any);
    return null;
  };

  // render quiz
  const renderQuizItem = ({
    item,
    index,
  }: {
    item: QuizType;
    index: number;
  }) => {
    const percentage = (item.quizesResult / item.quizesCount) * 100;
    const percColor =
      percentage >= 75
        ? Colors.GREEN
        : percentage >= 50
          ? Colors.PRIMARY
          : Colors.RED;
    return (
      <APressable
        entering={FadeInDown.delay(index * 80).duration(300)}
        onPress={() => handleItemPress(item)}
        className="mb-4"
        style={{ width: CARD_WIDTH }}
      >
        <View className="overflow-hidden border bg-white/5 rounded-2xl border-white/10">
          {/* Header Icon */}
          <View className="items-center p-4 border-b border-white/10">
            <View
              className="items-center justify-center w-16 h-16 rounded-full"
              style={{ backgroundColor: Colors.PRIMARY + "20" }}
            >
              {option?.icon ? (
                <Image
                  source={option.icon}
                  className="w-full h-full rounded-lg opacity-70"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="book-outline"
                  size={32}
                  color={Colors.PRIMARY}
                />
              )}
            </View>
          </View>

          {/* Content */}
          <View className="p-4">
            <Text
              className="mb-2 text-sm text-center text-white font-outfit-bold"
              numberOfLines={2}
            >
              {item.courseTitle}
            </Text>

            {/* Meta Info */}
            <View className="flex-row items-center justify-center pt-2 mb-2 border-t border-white/10">
              <Ionicons name="checkmark" size={12} color="#9ca3af" />
              <Text className="ml-1 text-xs text-gray-400 font-outfit">
                Last Score:
                <Text
                  className="text-sm font-outfit-extrabold"
                  style={{ color: percColor }}
                >
                  {percentage}%
                </Text>
              </Text>
            </View>
            <View className="flex-row items-center justify-center pt-2 border-t border-white/10">
              <Ionicons name="list" size={12} color="#9ca3af" />
              <Text className="ml-1 text-xs text-gray-400 font-outfit">
                {item.quizesCount} Quizes
              </Text>
            </View>
          </View>
        </View>
      </APressable>
    );
  };

  // render flashcardList
  const renderFlashcardItem = ({
    item,
    index,
  }: {
    item: FlashcardType;
    index: number;
  }) => {
    return (
      <APressable
        entering={FadeInDown.delay(index * 80).duration(300)}
        onPress={() => handleItemPress(item)}
        className="mb-4"
        style={{ width: CARD_WIDTH }}
      >
        <View className="overflow-hidden border bg-white/5 rounded-2xl border-white/10">
          {/* Header Icon */}
          <View className="items-center p-4 border-b border-white/10">
            <View className="items-center justify-center w-32 h-24 rounded-lg">
              {option?.icon ? (
                <Image
                  source={option.icon}
                  className="w-full h-full rounded-lg opacity-70"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="book-outline"
                  size={32}
                  color={Colors.PRIMARY}
                />
              )}
            </View>
          </View>

          {/* Content */}
          <View className="p-4">
            <Text
              className="mb-2 text-sm text-center text-white font-outfit-bold"
              numberOfLines={2}
            >
              {item.courseTitle}
            </Text>
            {/* Meta Info */}
            <View className="flex-row items-center justify-center pt-2 border-t border-white/10">
              <Ionicons name="list" size={12} color="#9ca3af" />
              <Text className="ml-1 text-xs text-gray-400 font-outfit">
                {item.flashcardsCount} Flashcards
              </Text>
            </View>
          </View>
        </View>
      </APressable>
    );
  };

  // render QaList
  const renderQaItem = ({ item, index }: { item: QnaType; index: number }) => {
    return (
      <APressable
        entering={FadeInDown.delay(index * 80).duration(300)}
        onPress={() => handleItemPress(item)}
        className="mb-4"
        style={{ width: CARD_WIDTH }}
      >
        <View className="overflow-hidden border bg-white/5 rounded-2xl border-white/10">
          {/* Header Icon */}
          <View className="items-center p-4 border-b border-white/10">
            <View className="items-center justify-center w-32 h-24 rounded-lg">
              {option?.icon ? (
                <Image
                  source={option.icon}
                  className="w-full h-full rounded-lg opacity-70"
                  resizeMode="cover"
                />
              ) : (
                <Ionicons
                  name="book-outline"
                  size={32}
                  color={Colors.PRIMARY}
                />
              )}
            </View>
          </View>

          {/* Content */}
          <View className="p-4">
            <Text
              className="mb-2 text-sm text-center text-white font-outfit-bold"
              numberOfLines={2}
            >
              {item.courseTitle}
            </Text>

            {/* Meta Info */}
            <View className="flex-row items-center justify-center pt-2 border-t border-white/10">
              <Ionicons name="list" size={12} color="#9ca3af" />
              <Text className="ml-1 text-xs text-gray-400 font-outfit">
                {item.qaCount} Questions
              </Text>
            </View>
          </View>
        </View>
      </APressable>
    );
  };

  const ListEmpty = () => (
    <View
      className="items-center justify-center flex-1 px-5"
      style={{ minHeight: 400 }}
    >
      <Ionicons name="folder-open-outline" size={64} color="#6b7280" />
      <Text className="mt-4 text-lg text-center text-gray-300 font-outfit">
        No {option?.name} available
      </Text>
      <Text className="mt-2 text-sm text-center text-gray-400 font-outfit">
        Check back later for new content
      </Text>
    </View>
  );

  const ListHeader = () => (
    <AView entering={FadeInDown.duration(300)} className="px-5 mb-4">
      {option?.image && (
        <View className="items-center mb-4">
          <Image
            source={option.image}
            className="w-full h-56 rounded-2xl"
            resizeMode="cover"
          />
        </View>
      )}
      <Text className="text-2xl text-center text-white font-outfit-extrabold">
        {option?.name}
      </Text>
      <Text className="mt-2 text-sm text-center text-gray-400 font-outfit">
        {dataList?.length || 0} items available
      </Text>
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
        title={option?.name || "Practice"}
        backgroundColor="gradient"
      />

      {isLoading ? (
        <View className="items-center justify-center flex-1">
          <Ionicons name="hourglass-outline" size={48} color={Colors.PRIMARY} />
          <Text className="mt-4 text-base text-gray-300 font-outfit">
            Loading...
          </Text>
        </View>
      ) : (
        <FlatList<any>
          data={dataList as any[]}
          renderItem={renderItem}
          keyExtractor={(item: any, index) => item?._id ?? index.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
          contentContainerStyle={{
            paddingTop: 20,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<ListHeader />}
          ListEmptyComponent={<ListEmpty />}
        />
      )}
    </LinearGradient>
  );
};

export default PracticeScreen;
