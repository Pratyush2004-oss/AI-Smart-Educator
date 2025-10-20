import BackHeader from "@/components/shared/BackHeader";
import CourseQuizScreen from "@/components/tabs/CourseQuizScreen";
import { useCourseStore } from "@/store/course.store";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const QuizScreen = () => {
  const { selectedQuiz } = useCourseStore();
  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="flex-1"
    >
      <BackHeader
        title={selectedQuiz?.courseTitle || ""}
        subtitle={`Quiz • ${selectedQuiz?.quizesCount} questions`}
        backgroundColor="gradient"
      />
      <CourseQuizScreen />
    </LinearGradient>
  );
};

export default QuizScreen;
