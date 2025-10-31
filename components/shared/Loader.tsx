import { Colors } from "@/assets/constants";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface LoaderProps {
  size?: number; // diameter in px
  thickness?: number; // border thickness
  color?: string; // spinner color
  centered?: boolean; // absolute center of parent
  style?: any; // extra container style
}

/**
 * Circular spinner implemented with a rotating bordered circle.
 * Positioned absolutely by default when `centered` is true.
 */
const Loader: React.FC<LoaderProps> = ({
  size = 20,
  thickness = 4,
  color = Colors.PRIMARY, // default primary-ish blue
  centered = true,
  style,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    // continuous rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false
    );
    // no cleanup needed for withRepeat, will stop on unmount
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const containerStyle = centered
    ? {
        position: "absolute" as const,
        top: "50%",
        left: "50%",
        marginLeft: -size / 2,
        marginTop: -size / 2,
      }
    : { position: "absolute" as const };

  return (
    <View
      style={[containerStyle, style]}
      className="flex-row items-center gap-2 p-2 bg-gray-200 rounded-full"
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: `${color}33`, // faded track
            borderTopColor: color, // visible segment
          },
          animatedStyle,
        ]}
      />
      <Text className="font-outfit-semibold" style={{ color: color }}>
        Loading
      </Text>
    </View>
  );
};

export default Loader;
