import React, { JSX, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "expo-router";
import { chatbot } from "@/config/AIModel";
import { Colors } from "@/assets/constants";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import * as Clipboard from "expo-clipboard";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  Pressable,
  View,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  time?: string;
};

const BOT_AVATAR = require("@/assets/images/robot.jpg");

const Avatar: React.FC<{ size?: number; uri?: string }> = ({
  size = 40,
  uri,
}) => (
  <Image
    source={uri ? { uri } : BOT_AVATAR}
    style={{ width: size, height: size, borderRadius: size / 2 }}
  />
);

export default function Chatbot(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<Message> | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (path !== "/chatbot") Speech.stop();
  }, [path]);

  useEffect(() => {
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages]);

  const nowTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const sendBotResponse = async (promptText: string) => {
    setIsTyping(true);
    try {
      const res = await chatbot.sendMessage(
        `Explain: ${promptText} — simple paragraph, 5-8 lines.`
      );
      const raw = (res as any)?.response ?? res;
      let botText = "";
      if (typeof raw === "string") botText = raw;
      else if (raw && typeof raw.text === "string") botText = raw.text;
      else if (raw && typeof raw.text === "function")
        botText = String(raw.text());
      else botText = String(res ?? "Sorry, no response");
      await new Promise((r) => setTimeout(r, 400));
      const botMsg: Message = {
        id: String(Date.now() + 2),
        text: botText,
        sender: "bot",
        time: nowTime(),
      };
      setMessages((s) => [...s, botMsg]);
    } catch {
      setMessages((s) => [
        ...s,
        {
          id: String(Date.now() + 3),
          text: "Something went wrong. Try again.",
          sender: "bot",
          time: nowTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setLoading(false);
    }
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    Keyboard.dismiss();
    setInput("");
    const userMsg: Message = {
      id: String(Date.now()),
      text,
      sender: "user",
      time: nowTime(),
    };
    setMessages((s) => [...s, userMsg]);
    setLoading(true);
    setTimeout(() => sendBotResponse(text), 250);
  }, [input, loading]);

  const onCopy = async (msg: Message) => {
    await Clipboard.setStringAsync(msg.text);
    setCopiedId(msg.id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const onSpeak = (msg: Message) => {
    Speech.stop();
    Speech.speak(msg.text);
  };

  const Bubble: React.FC<{ msg: Message; index: number }> = ({
    msg,
    index,
  }) => {
    const isUser = msg.sender === "user";
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));
    const bgColor = isUser ? Colors.PRIMARY : "#F3F4F6";
    const textColor = isUser ? "#fff" : "#0b1220";

    return (
      <Animated.View
        entering={
          isUser ? FadeInRight.delay(index * 8) : FadeIn.delay(index * 8)
        }
        layout={Layout}
        style={animatedStyle}
        className={`mb-3 w-full ${isUser ? "items-end" : "items-start"}`}
      >
        <View
          className={`flex-row ${isUser ? "justify-end" : "justify-start"} items-end`}
        >
          <Pressable
            onPressIn={() => (scale.value = withTiming(0.98, { duration: 80 }))}
            onPressOut={() => (scale.value = withSpring(1))}
            onPress={() => {
              // toggle expand for long messages, or speak bot text
              if (expandedId === msg.id) setExpandedId(null);
              else setExpandedId(msg.id);
              if (msg.sender === "bot") onSpeak(msg);
            }}
            onLongPress={() => onCopy(msg)}
            delayLongPress={400}
            android_ripple={{ color: "rgba(0,0,0,0.06)" }}
            style={{
              maxWidth: "82%",
            }}
          >
            <View
              style={{
                backgroundColor: bgColor,
                paddingVertical: 10,
                paddingHorizontal: 14,
                borderRadius: 14,
                borderTopLeftRadius: isUser ? 14 : 4,
                borderTopRightRadius: isUser ? 4 : 14,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Text
                style={{ color: textColor, fontSize: 15, lineHeight: 20 }}
                className="font-outfit-medium"
              >
                {expandedId === msg.id
                  ? msg.text
                  : msg.text.length > 160
                    ? msg.text.slice(0, 160) + "…"
                    : msg.text}
              </Text>
            </View>

            <View className={`${isUser ? "items-end" : "items-start"} mt-1`}>
              <Text style={{ color: "#6b7280", fontSize: 11 }}>
                {msg.time ?? ""}
              </Text>
            </View>
          </Pressable>
        </View>

        {copiedId === msg.id && (
          <View className="self-start px-3 py-1 mt-2 rounded-md bg-black/5">
            <Text className="text-xs text-gray-600">Copied</Text>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <Pressable
            onPress={() => {
              router.back();
              Speech.stop();
            }}
            className="p-2"
          >
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>

          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 overflow-hidden border border-gray-200 rounded-full">
              <Image source={BOT_AVATAR} style={{ width: 48, height: 48 }} />
            </View>
            <View>
              <Text className="text-base text-gray-900 font-outfit-extrabold">
                Ela-AI
              </Text>
              <Text className="text-xs text-gray-500">
                Your friendly learning assistant
              </Text>
            </View>
          </View>

          <Pressable
            onPress={() =>
              Alert.alert(
                "Info",
                "Shortcuts: tap bubble to expand & speak, long-press to copy"
              )
            }
            className="p-2"
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#111827" />
          </Pressable>
        </View>

        {/* Messages */}
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item, index }) => (
              <Bubble msg={item} index={index} />
            )}
            keyExtractor={(it) => it.id}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 140,
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="items-center justify-center px-6 mt-20">
                <View className="mb-6 overflow-hidden border-2 border-gray-200 rounded-full w-36 h-36">
                  <Image
                    source={BOT_AVATAR}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
                <Text className="text-2xl text-center text-gray-900 font-outfit-extrabold">
                  Hi — ask me anything
                </Text>
                <Text className="mt-2 text-sm text-center text-gray-500">
                  Tap a bubble to hear it. Long-press to copy text.
                </Text>
              </View>
            }
            ListFooterComponent={() =>
              isTyping ? (
                <Animated.View
                  entering={FadeInDown}
                  className="flex-row items-center px-4 py-3"
                >
                  <View className="mr-3">
                    <Avatar size={36} />
                  </View>
                  <View className="px-3 py-2 bg-gray-100 rounded-full">
                    <View className="flex-row space-x-2">
                      <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                      <View className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    </View>
                  </View>
                </Animated.View>
              ) : null
            }
          />
        </TouchableWithoutFeedback>

        {/* Input */}
        <View className="absolute left-4 right-4 bottom-14">
          <View
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 8,
              elevation: 4,
            }}
            className="flex-row items-center px-3 py-2 bg-white border border-gray-200 rounded-full"
          >
            <Pressable
              className="p-2 mr-2"
              onPress={() =>
                Alert.alert("Attachment", "Add attachments (future)")
              }
            >
              <Ionicons name="add" size={20} color={Colors.PRIMARY} />
            </Pressable>

            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything...."
              placeholderTextColor="#9ca3af"
              className="flex-1 px-2 py-1 text-gray-900 font-outfit-medium"
              returnKeyType="send"
              onSubmitEditing={handleSend}
              editable={!loading}
            />

            <Pressable
              onPress={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 ml-2 rounded-full"
              style={{
                backgroundColor: input.trim() ? Colors.PRIMARY : "#E5E7EB",
              }}
            >
              <Ionicons
                name="send"
                size={18}
                color={input.trim() ? "#fff" : "#9ca3af"}
              />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
