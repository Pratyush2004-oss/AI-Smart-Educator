import InitialQuizScreen from "@/components/shared/InitialQuizScreen";
import TabHeader from "@/components/shared/TabHeader";
import React from "react";
import { View } from "react-native";

const InitialQuiz = () => {
  return (
    <View className="flex-1">
      <TabHeader />
      <InitialQuizScreen />
    </View>
  );
};

export default InitialQuiz;
