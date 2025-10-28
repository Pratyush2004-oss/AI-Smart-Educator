import ProgressScreen from "@/components/tabs/ProgressScreen";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const Progress = () => {
  return (
    <LinearGradient
      colors={["#f9f8f8", "#f9f8f8", "#f9f8f8"]}
      start={[0, 0]}
      end={[1, 1]}
      className="flex-1"
    >
      <ProgressScreen />
    </LinearGradient>
  );
};

export default Progress;
