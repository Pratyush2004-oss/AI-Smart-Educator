// ...existing code...
import BackHeader from "@/components/shared/BackHeader";
import { VideoType } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import { Colors } from "@/assets/constants";
import { useCourseStore } from "@/store/course.store";
import VideoList from "@/components/shared/VideoList";

const { width, height } = Dimensions.get("window");

const VideoPlayerScreen = () => {
  const { videoParams } = useLocalSearchParams();
  const rawVideoParams = Array.isArray(videoParams)
    ? videoParams[0]
    : videoParams;
  let video: VideoType | null = null;
  try {
    video = rawVideoParams ? JSON.parse(String(rawVideoParams)) : null;
  } catch {
    video = null;
  }

  const playerRef = useRef<React.ElementRef<typeof YoutubeIframe> | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [playerHeight, setPlayerHeight] = useState(
    Math.round((width * 9) / 16)
  );
  const { selectedCourse } = useCourseStore();

  // Lock orientation when entering fullscreen (best-effort)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      if (fullscreen) {
        try {
          StatusBar.setHidden(true, "fade");
          await ScreenOrientation.lockAsync(
            Platform.OS === "android"
              ? ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
              : ScreenOrientation.OrientationLock.LANDSCAPE
          );
        } catch {
          /* ignore if not available */
        }
      } else {
        try {
          StatusBar.setHidden(false, "fade");
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.DEFAULT
          );
        } catch {
          /* ignore */
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, [fullscreen]);

  // compute player size depending on fullscreen
  useEffect(() => {
    if (fullscreen) {
      setPlayerHeight(height);
    } else {
      setPlayerHeight(Math.round((width * 9) / 16));
    }
  }, [fullscreen]);

  const onStateChange = useCallback((state: string) => {
    // kept for future state handling if needed
  }, []);

  const filteredVideos = selectedCourse
    ? selectedCourse.videos.filter((vid) => vid.url !== video?.url)
    : [];

  const toggleFullscreen = useCallback(() => setFullscreen((f) => !f), []);

  // fallback close fullscreen on Android back or unmount
  useEffect(() => {
    return () => {
      (async () => {
        try {
          await ScreenOrientation.lockAsync(
            ScreenOrientation.OrientationLock.DEFAULT
          );
          StatusBar.setHidden(false, "fade");
        } catch {}
      })();
    };
  }, []);

  if (!video) {
    return (
      <View className="items-center justify-center flex-1 bg-black">
        <Text className="text-white">Invalid video</Text>
      </View>
    );
  }

  return (
    <View style={fullscreen ? styles.fullscreenContainer : styles.container}>
      {!fullscreen && (
        <BackHeader title={video.title} backgroundColor="gradient" />
      )}

      <View
        style={
          fullscreen
            ? styles.playerFullscreenWrapper
            : { width: "100%", height: playerHeight, backgroundColor: "#000" }
        }
      >
        <YoutubeIframe
          ref={playerRef}
          height={fullscreen ? height : playerHeight}
          videoId={video.url}
          onChangeState={onStateChange}
          webViewStyle={{ opacity: 1 }}
        />

        {/* Top-right controls (fullscreen toggle) */}
        <Animated.View
          entering={FadeInUp.duration(200)}
          className="absolute right-3 top-3"
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={toggleFullscreen}
            className="items-center justify-center w-10 h-10 rounded-lg bg-black/40"
          >
            <Ionicons
              name={fullscreen ? "contract" : "expand"}
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Title overlay (bottom-left) */}
        <View className="absolute left-3 bottom-3">
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.6)"]}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
            }}
          >
            <Text
              numberOfLines={2}
              className="text-sm text-white font-outfit-bold"
              style={{ maxWidth: fullscreen ? width * 0.8 : width * 0.7 }}
            >
              {video.title}
            </Text>
          </LinearGradient>
        </View>
      </View>

      {!fullscreen && (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
          <View className="mb-4">
            <Text className="mb-2 text-lg text-white font-outfit-bold">
              {video.title}
            </Text>
            <Text className="text-sm text-gray-300 font-outfit">
              {(video as any).author ?? "Instructor"} •{" "}
              {(video as any).views ?? 0} views
            </Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm text-gray-300">Description</Text>
            <Text className="text-sm text-gray-400">
              {(video as any).description ??
                "This video covers the topic in detail. Use fullscreen for best experience."}
            </Text>
          </View>

          <VideoList videos={filteredVideos} tilte="More Videos" />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071026",
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "#000",
    zIndex: 999,
  },
  playerFullscreenWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Math.max(width, height),
    height: Math.max(width, height),
    backgroundColor: "#000",
    zIndex: 999,
  },
  controlCircle: {
    width: 72,
    height: 72,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default VideoPlayerScreen;
// ...existing code...
