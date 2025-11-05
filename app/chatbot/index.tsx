import React, {
  FC,
  JSX,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "expo-router";
import { chatbot } from "@/config/AIModel";
import { Colors } from "@/assets/constants";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInRight,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";

/**
 * Chatbot screen (TypeScript + nativewind + reanimated)
 *
 * - Uses the same visual layout as your JS version but converted to TS
 * - NativeWind classes used for styling (className)
 * - Reanimated entering animations for messages / animated text
 * - Keeps logic simple: sends user input to `chatbot.sendMessage()` and renders response
 *
 * Note: ensure `chatbot.sendMessage` exists and returns an object with `.response.text()` or adapt accordingly.
 */

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
};

const AnimatedTextWord: FC<{ word: string; idx: number }> = ({ word, idx }) => {
  return (
    <Animated.Text
      entering={FadeInRight.delay(idx * 30).duration(300)}
      className="text-sm text-black font-outfit"
    >
      {word + " "}
    </Animated.Text>
  );
};

const AnimatedBotParagraph: FC<{ text: string }> = ({ text }) => {
  const words = String(text).split(" ").filter(Boolean);
  return (
    <View className="flex-row flex-wrap">
      {words.map((w, i) => (
        <AnimatedTextWord key={i} word={w} idx={i} />
      ))}
    </View>
  );
};

export default function Chatbot(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAnimatingBot, setIsAnimatingBot] = useState(false);

  const flatListRef = useRef<FlatList<Message> | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    // stop speech when leaving screen
    if (path !== "/chatbot") Speech.stop();
  }, [path]);

  useEffect(() => {
    // auto-scroll when messages change
    if (flatListRef.current) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        80
      );
    }
  }, [messages]);

  const speakText = useCallback(async (text: string) => {
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (!input.trim() || loading) return;

    // push user message
    const userMsg: Message = {
      id: String(Date.now()),
      text: input.trim(),
      sender: "user",
    };
    setMessages((s) => [...s, userMsg]);
    setInput("");
    Keyboard.dismiss();

    setLoading(true);
    try {
      // send prompt to your configured AI model
      const prompt = `Act as a tutor and explain the topic related to the topic "${userMsg.text}" without headings, 5-8 lines, simple language.`;
      const res = await chatbot.sendMessage(prompt);

      // depending on your AI client shape adapt extraction:
      // earlier code used res.response.text()
      // Try to extract text from various shapes: string, { text: string }, { text: () => string }, or response.text()
      const botText = (() => {
        const r: any = (res as any)?.response ?? (res as any);
        // direct string
        if (typeof r === "string") return r;
        // object with text() method
        if (r && typeof r.text === "function") {
          try {
            return String(r.text());
          } catch {
            return "";
          }
        }
        // object with text string property
        if (r && typeof r.text === "string") return r.text;
        // response itself is a function returning a value
        if (typeof r === "function") {
          try {
            const v = r();
            if (typeof v === "string") return v;
            if (v && typeof v.text === "function") return String(v.text());
            if (v && typeof v.text === "string") return v.text;
          } catch {}
        }
        return String(res ?? "");
      })();
      // rest of the code
      const botMsg: Message = {
        id: String(Date.now() + 1),
        text: botText || "Sorry, I couldn't process that.",
        sender: "bot",
      };

      // show animated bot text first (keeps input responsive)
      setIsAnimatingBot(true);
      setMessages((s) => [...s, botMsg]);

      // optionally speak the text
      // speakText(botMsg.text); // enable if you want speech

      // stop animated flag after a short time (animation length depends on text)
      setTimeout(
        () => setIsAnimatingBot(false),
        Math.min(4000, botMsg.text.length * 40)
      );
    } catch (err) {
      setMessages((s) => [
        ...s,
        {
          id: String(Date.now() + 2),
          text: "Something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, speakText]);

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    if (item.sender === "user") {
      return (
        <Animated.View
          entering={FadeInRight.delay(index * 20)}
          className="self-end max-w-[90%] mb-3"
        >
          <View className="px-4 py-3 rounded-br-sm bg-primary rounded-2xl">
            <Text className="text-sm text-white font-outfit">{item.text}</Text>
          </View>
        </Animated.View>
      );
    }

    // bot message
    return (
      <Animated.View
        entering={FadeIn.delay(index * 20)}
        className="self-start max-w-[90%] mb-3"
      >
        <View className="flex-row items-start space-x-3">
          <Image source={require("@/assets/images/robot.jpg")} className="w-10 h-10 rounded-full" />
          <View className="px-4 py-3 rounded-bl-sm bg-white/90 rounded-2xl">
            {isAnimatingBot && index === messages.length - 1 ? (
              // animated word-by-word rendering using reanimated entering on each word
              <AnimatedBotParagraph text={item.text} />
            ) : (
              <Text className="text-sm text-black font-outfit">
                {item.text}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-slate-50"
    >
      {/* header */}
      <View className="relative flex-row items-center justify-center h-16 border-b border-gray-200 bg-white/90">
        <TouchableOpacity
          onPress={() => {
            router.back();
            Speech.stop();
          }}
          className="absolute left-4"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>

        <View className="flex-row items-center space-x-3">
          <Image source={require("@/assets/images/robot.jpg")} className="w-10 h-10 rounded-full" />
          <Text className="text-lg text-black font-outfit-bold">Ela-AI</Text>
        </View>
      </View>

      {/* messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 50, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center flex-1 mt-12">
            <Image source={require("@/assets/images/robot.jpg")} className="w-48 h-48 rounded-full opacity-90" />
            <Text className="mt-6 text-3xl text-center text-black font-outfit-bold">
              Hello, how can I help you?
            </Text>
          </View>
        }
      />

      {/* input */}
      <View className="absolute left-0 right-0 flex-row items-center px-4 py-3 bg-white border-t border-gray-200 bottom-10">
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          className="flex-1 px-4 py-5 bg-gray-200 border border-gray-200 rounded-full font-outfit"
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!loading}
        />
        <TouchableOpacity
          onPress={handleSend}
          className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${loading ? "bg-gray-300" : "bg-primary"}`}
          disabled={loading}
        >
          <Ionicons name="send" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
