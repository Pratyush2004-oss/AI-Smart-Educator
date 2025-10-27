import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const GradientBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient
      colors={["#005ff9", "#005ff9", "#005ff9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground;
