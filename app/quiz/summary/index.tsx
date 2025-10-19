// ...existing code...
import { Colors } from "@/assets/constants/index";
import { QuizResultType } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const AView = Animated.View;

const QuizSummary = () => {
  const { quizResultParams } = useLocalSearchParams();

  const quizResult: QuizResultType[] = useMemo(() => {
    try {
      const raw = Array.isArray(quizResultParams)
        ? quizResultParams[0]
        : quizResultParams;
      return raw ? JSON.parse(String(raw)) : [];
    } catch {
      return [];
    }
  }, [quizResultParams]);
  const router = useRouter();

  const correctAns = quizResult.filter((item) => item.isCorrect).length;
  const totalQuestions = quizResult.length;
  const wrongAns = Math.max(totalQuestions - correctAns, 0);
  const scorePercent = totalQuestions
    ? Math.round((correctAns / totalQuestions) * 100)
    : 0;

  const handleNavigate = () => {
    router.replace("/");
  };

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 40,
        }}
      >
        {/* Header */}
        <AView entering={FadeInDown.duration(300)} className="mb-6">
          <Text className="text-3xl text-center text-white font-outfit-extrabold">
            Quiz Summary
          </Text>
          <Text className="mt-2 text-base text-center text-gray-300 font-outfit">
            You scored {scorePercent}%
          </Text>
        </AView>

        {/* Stats */}
        <AView
          entering={FadeInDown.delay(100)}
          className="flex-row items-center justify-center gap-3 mb-6"
        >
          <View className="items-center flex-1 p-4 border rounded-2xl bg-green-500/15 border-green-400/30">
            <View className="flex-row items-center mb-1">
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
              <Text className="ml-2 text-sm text-green-300 font-outfit">
                Correct
              </Text>
            </View>
            <Text className="text-2xl text-green-400 font-outfit-bold">
              {correctAns}
            </Text>
          </View>
          <View className="items-center flex-1 p-4 border rounded-2xl bg-red-500/15 border-red-400/30">
            <View className="flex-row items-center mb-1">
              <Ionicons name="close-circle" size={18} color="#ef4444" />
              <Text className="ml-2 text-sm text-red-300 font-outfit">
                Wrong
              </Text>
            </View>
            <Text className="text-2xl text-red-400 font-outfit-bold">
              {wrongAns}
            </Text>
          </View>
        </AView>

        {/* Answers List */}
        <View className="mb-6">
          {quizResult.map((item, idx) => {
            const isCorrect = item.isCorrect;
            return (
              <AView
                key={`${idx}-${item.question}`}
                entering={FadeInDown.delay(120 + idx * 60).duration(250)}
                className={`p-4 mb-3 rounded-2xl border ${
                  isCorrect
                    ? "bg-green-500/10 border-green-400/25"
                    : "bg-red-500/10 border-red-400/25"
                }`}
              >
                <View className="flex-row items-start">
                  <View
                    className={`w-8 h-8 mr-3 rounded-full items-center justify-center flex-shrink-0 ${
                      isCorrect ? "bg-green-500/20" : "bg-red-500/20"
                    }`}
                  >
                    <Ionicons
                      name={isCorrect ? "checkmark" : "close"}
                      size={16}
                      color={isCorrect ? "#22c55e" : "#ef4444"}
                    />
                  </View>
                  <View className="flex-1 flex-shrink">
                    <Text className="text-sm leading-5 text-white font-outfit">
                      {item.question}
                    </Text>

                    {/* User Answer */}
                    <View className="flex-row flex-wrap items-start mt-2">
                      <Text
                        className={`text-xs mr-2 font-outfit-bold ${
                          isCorrect ? "text-green-300" : "text-red-300"
                        }`}
                      >
                        Your:
                      </Text>
                      <Text
                        className={`text-xs flex-1 font-outfit ${
                          isCorrect ? "text-green-200" : "text-red-200"
                        }`}
                        numberOfLines={2}
                      >
                        {item.userAnswer}
                      </Text>
                    </View>

                    {/* Correct Answer when wrong */}
                    {!isCorrect && (
                      <View className="flex-row flex-wrap items-start mt-1">
                        <Text className="mr-2 text-xs text-green-300 font-outfit-bold">
                          Correct:
                        </Text>
                        <Text
                          className="flex-1 text-xs text-green-200 font-outfit"
                          numberOfLines={2}
                        >
                          {item.correctAnswer}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </AView>
            );
          })}
        </View>

        {/* CTA Button */}
        <AView entering={FadeInDown.delay(100).duration(300)}>
          <Pressable
            onPress={handleNavigate}
            className="overflow-hidden rounded-xl"
          >
            <LinearGradient
              colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT, Colors.PRIMARY]}
              start={[0, 0]}
              end={[1, 0]}
              className="items-center justify-center py-4 rounded-xl"
            >
              <Text className="text-base text-white font-outfit-bold">
                Navigate to Home Screen
              </Text>
            </LinearGradient>
          </Pressable>
        </AView>
      </ScrollView>
    </LinearGradient>
  );
};

export default QuizSummary;
// ...existing code...
