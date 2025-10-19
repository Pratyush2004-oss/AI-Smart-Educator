import { Colors } from "@/assets/constants/index";
import { useCourseStore } from "@/store/course.store";
import { QuizResultType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const CourseQuizScreen = () => {
  const { selectedQuiz, submitQuiz } = useCourseStore();
  // sort the quiz at random order
  const quiz = selectedQuiz?.quizDetail.sort(() => Math.random() - 0.5);
  const [currentPage, setcurrentPage] = useState(0);
  const [selectedOption, setselectedOption] = useState("");
  const [result, setresult] = useState<QuizResultType[]>([]);

  const progress = useSharedValue(0);
  const router = useRouter();

  // Update progress when currentPage changes
  useEffect(() => {
    if (quiz && quiz.length > 0) {
      const newProgress = (result.length / quiz.length) * 100;
      progress.value = withTiming(newProgress, { duration: 400 });
    }
  }, [currentPage, quiz]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  // select option handler
  const handleOptionSelect = (option: string) => {
    const current = quiz?.[currentPage];
    if (!current) return;
    setselectedOption(option);

    const isCorrect = option === current.correctAns;
    setresult((prev) => {
      const filtered = prev.filter((_, idx) => idx !== currentPage);
      return [
        ...filtered,
        {
          correctAnswer: current.correctAns,
          question: current.question,
          isCorrect,
          userAnswer: option,
        },
      ];
    });
  };

  // next page handler
  const nextPage = () => {
    const current = quiz?.[currentPage];
    if (!current) return;
    setcurrentPage((prev) => prev + 1);
    setselectedOption("");
  };

  // handle Submit handler
  const handleQuizSubmit = async () => {
    // save quiz result
    await submitQuiz(result).then((res) => {
      if (res) {
        router.replace({
          pathname: "/quiz/summary",
          params: {
            quizResultParams: JSON.stringify(result),
          },
        });
      }
    });
  };

  if (!quiz || quiz.length === 0) {
    return (
      <View className="items-center justify-center flex-1 bg-gray-900">
        <Text className="text-lg text-white font-outfit">
          No quiz available
        </Text>
      </View>
    );
  }

  const currentQuiz = quiz[currentPage];
  const isLastQuestion = currentPage === quiz.length - 1;
  const progressPercent = Math.round((result.length / quiz.length) * 100);

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingVertical: 60, paddingHorizontal: 20 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Progress Bar */}
      <AView entering={FadeInDown.delay(100)} className="mb-8">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm font-outfit text-white/70">
            Question {currentPage + 1} of {quiz.length}
          </Text>
          <Text
            className="text-sm font-outfit-bold"
            style={{ color: Colors.PRIMARY }}
          >
            {progressPercent}%
          </Text>
        </View>
        <View className="w-full h-2 overflow-hidden rounded-full bg-white/10">
          <AView style={progressStyle} className="h-full rounded-full">
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
              start={[0, 0]}
              end={[1, 0]}
              className="h-full"
            />
          </AView>
        </View>
      </AView>

      {/* Question Card */}
      <AView
        key={currentPage}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(200)}
        className="p-6 mb-6 border bg-white/10 rounded-2xl border-white/20"
      >
        <View className="flex-row items-start">
          <View
            className="items-center justify-center w-10 h-10 mr-3 rounded-full"
            style={{ backgroundColor: Colors.PRIMARY + "40" }}
          >
            <Ionicons name="help-circle" size={24} color={Colors.PRIMARY} />
          </View>
          <Text className="flex-1 text-lg leading-7 text-white font-outfit">
            {currentQuiz.question}
          </Text>
        </View>
      </AView>

      {/* Options */}
      <View className="mb-6">
        {currentQuiz.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          const delay = idx * 100;

          return (
            <APressable
              key={idx}
              entering={FadeInRight.delay(delay).duration(300)}
              onPress={() => handleOptionSelect(option)}
              className={`mb-3 p-4 rounded-xl border-2 ${
                isSelected
                  ? "bg-white/20 border-white/40"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3`}
                  style={{
                    borderColor: isSelected ? Colors.PRIMARY : "#6b7280",
                    backgroundColor: isSelected
                      ? Colors.PRIMARY
                      : "transparent",
                  }}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text
                  className={`flex-1 text-base font-outfit ${
                    isSelected ? "text-white" : "text-gray-300"
                  }`}
                >
                  {option}
                </Text>
              </View>
            </APressable>
          );
        })}
      </View>

      {/* Next/Submit Button */}
      {selectedOption && (
        <AView
          entering={FadeInDown.delay(200)}
          exiting={FadeOut}
          className={"mt-auto"}
        >
          <Pressable
            onPress={isLastQuestion ? handleQuizSubmit : nextPage}
            className="mt-auto overflow-hidden shadow-lg rounded-xl"
          >
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
              start={[0, 0]}
              end={[1, 0]}
              className="flex-row items-center justify-center py-4"
            >
              <Text className="mr-2 text-base text-white font-outfit-bold">
                {isLastQuestion ? "Submit Quiz" : "Next Question"}
              </Text>
              <Ionicons
                name={isLastQuestion ? "checkmark-circle" : "arrow-forward"}
                size={20}
                color="#fff"
              />
            </LinearGradient>
          </Pressable>
        </AView>
      )}
    </ScrollView>
  );
};

export default CourseQuizScreen;
