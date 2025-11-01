import { Colors } from "@/assets/constants";
import type { VideoType } from "@/types";
import { showAlert } from "@/utils/AlertService";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
  Platform,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const CARD_WIDTH = Math.min(420, width * 0.82);
const APressable = Animated.createAnimatedComponent(Pressable);

const VideoCard = memo(
  ({
    video,
    onPress,
    index,
    enroll,
  }: {
    video: VideoType;
    onPress: (v: VideoType) => void;
    index: number;
    enroll: boolean;
  }) => {
    const thumbnail = video.thumbnail;

    // platform-consistent shadow (kept inline for best cross-platform fidelity)
    const shadowStyle =
      Platform.OS === "ios"
        ? {
            shadowColor: "#0b1220",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.12,
            shadowRadius: 12,
          }
        : { elevation: 6, shadowColor: "#0b1220" };

    return (
      <APressable
        entering={FadeInRight.delay(index * 60).duration(300)}
        onPress={() => onPress(video)}
        style={[{ width: CARD_WIDTH }, shadowStyle]}
        className="relative mr-4"
      >
        <Animated.View
          className="overflow-hidden border rounded-2xl bg-white/5 border-white/6"
          style={{ zIndex: 1 }}
        >
          {/* Thumbnail */}
          <View className="relative w-full h-48 bg-zinc-900">
            <Image
              source={{ uri: thumbnail }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 56,
              }}
            />
            {!enroll && (
              <View className="absolute right-3 bottom-3">
                <LinearGradient
                  colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
                  className="items-center justify-center rounded-full size-10"
                  style={{
                    borderRadius: 20,
                  }}
                >
                  <Ionicons name="play" size={20} color="#fff" />
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Body */}
          <View className="p-3 bg-transparent">
            <Text
              numberOfLines={1}
              className="mb-2 text-base text-white font-outfit-bold"
            >
              {video.title}
            </Text>
          </View>
        </Animated.View>
      </APressable>
    );
  }
);

const VideoList = ({
  videos,
  tilte,
  enroll,
}: {
  videos: VideoType[];
  tilte: string;
  enroll?: boolean;
}) => {
  const router = useRouter();

  const handlePress = (video: VideoType) => {
    if (enroll) {
      showAlert("Notice", "Enroll to the course first.");
      return;
    }
    router.push({
      pathname: "/videoView",
      params: { videoParams: JSON.stringify(video) },
    });
  };

  if (!videos || videos.length === 0) return null;

  return (
    <View className="mt-6">
      <Text className="px-6 mb-3 text-lg text-white font-outfit-bold">
        {tilte}
      </Text>

      <FlatList
        horizontal
        data={videos}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}
        keyExtractor={(v, i) => String((v as any)._id ?? (v as any).id ?? i)}
        renderItem={({ item, index }) => (
          <VideoCard
            video={item}
            index={index}
            onPress={handlePress}
            enroll={enroll ?? false}
          />
        )}
      />
    </View>
  );
};

export default VideoList;
