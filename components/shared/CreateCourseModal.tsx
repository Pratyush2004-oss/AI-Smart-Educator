import { Colors } from "@/assets/constants";
import { useCourseStore } from "@/store/course.store";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

interface CreateCourseModalProps {
  children: React.ReactNode;
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [topic, setTopic] = useState("");
  const { isLoading, createCourse } = useCourseStore();
  const scale = useSharedValue(1);
  const router = useRouter();

  const handleOpen = () => {
    setIsVisible(true);
    setTopic("");
  };

  const handleClose = () => {
    if (!isLoading) {
      setIsVisible(false);
      setTopic("");
    }
  };

  const handleSubmit = async () => {
    await createCourse(topic).then((res) => {
      if (res) {
        router.push({ pathname: "/courseView", params: { enroll: "false" } });
      }
    });
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <>
      {/* Trigger Button */}
      <Pressable onPress={handleOpen}>{children}</Pressable>

      {/* Modal */}
      <Modal
        visible={isVisible}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <View className="flex-1">
          {/* Backdrop */}
          <APressable
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            onPress={handleClose}
            className="absolute inset-0 bg-black/70"
          />

          {/* Modal Content */}
          <View className="items-center justify-center flex-1 px-5">
            <AView
              entering={SlideInDown.duration(300).springify()}
              exiting={SlideOutDown.duration(250)}
              className="w-full max-w-md overflow-hidden border rounded-2xl border-white/20"
            >
              <LinearGradient
                colors={["#1a1a2e", "#16213e", "#0f3460"]}
                start={[0, 0]}
                end={[1, 1]}
                className="p-6"
              >
                {/* Header */}
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center">
                    <View
                      className="items-center justify-center w-10 h-10 mr-3 rounded-full"
                      style={{ backgroundColor: Colors.PRIMARY + "20" }}
                    >
                      <Ionicons
                        name="add-circle"
                        size={24}
                        color={Colors.PRIMARY}
                      />
                    </View>
                    <Text className="text-xl text-white font-outfit-extrabold">
                      Create New Course
                    </Text>
                  </View>

                  <Pressable
                    onPress={handleClose}
                    disabled={isLoading}
                    className="p-2 rounded-full bg-white/10"
                  >
                    <Ionicons name="close" size={20} color="#fff" />
                  </Pressable>
                </View>

                {/* Description */}
                <Text className="mb-4 text-sm text-gray-400 font-outfit">
                  Enter a topic to generate a personalized course with
                  AI-powered content
                </Text>

                {/* Input Field */}
                <View className="mb-6">
                  <Text className="mb-2 text-sm text-white font-outfit-bold">
                    Course Topic
                  </Text>
                  <View className="flex-row items-center px-4 py-3 border rounded-xl bg-white/5 border-white/20">
                    <Ionicons name="school-outline" size={18} color="#9ca3af" />
                    <TextInput
                      value={topic}
                      onChangeText={setTopic}
                      placeholder="e.g., Python Programming, Web Development..."
                      placeholderTextColor="#6b7280"
                      className="flex-1 ml-3 text-white font-outfit"
                      editable={!isLoading}
                      autoFocus
                      returnKeyType="done"
                      onSubmitEditing={handleSubmit}
                    />
                  </View>

                  {/* Character count */}
                  <Text className="mt-1 text-xs text-right text-gray-500 font-outfit">
                    {topic.length}/100
                  </Text>
                </View>

                {/* Info Cards */}
                <View className="p-3 mb-6 border rounded-xl bg-blue-500/10 border-blue-400/20">
                  <View className="flex-row items-start">
                    <Ionicons
                      name="information-circle"
                      size={18}
                      color="#60a5fa"
                    />
                    <Text className="flex-1 ml-2 text-xs leading-5 text-blue-200 font-outfit">
                      AI will generate chapters, content, quizzes, and practice
                      materials based on your topic
                    </Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                  {/* Cancel Button */}
                  <Pressable
                    onPress={handleClose}
                    disabled={isLoading}
                    className="flex-1 p-4 border rounded-xl bg-white/5 border-white/10"
                  >
                    <Text className="text-base text-center text-white font-outfit-bold">
                      Cancel
                    </Text>
                  </Pressable>

                  {/* Submit Button */}
                  <APressable
                    style={buttonStyle}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={handleSubmit}
                    disabled={!topic.trim() || isLoading}
                    className={`flex-1 overflow-hidden rounded-xl ${
                      !topic.trim() || isLoading ? "opacity-50" : ""
                    }`}
                  >
                    <LinearGradient
                      colors={[Colors.PRIMARY, Colors.PRIMARY_LIGHT]}
                      start={[0, 0]}
                      end={[1, 0]}
                      className="flex-row items-center justify-center p-4"
                    >
                      {isLoading ? (
                        <>
                          <ActivityIndicator color="#fff" size="small" />
                          <Text className="ml-2 text-base text-white font-outfit-bold">
                            Creating...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color="#fff"
                          />
                          <Text className="ml-2 text-base text-white font-outfit-bold">
                            Create Course
                          </Text>
                        </>
                      )}
                    </LinearGradient>
                  </APressable>
                </View>
              </LinearGradient>
            </AView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CreateCourseModal;
