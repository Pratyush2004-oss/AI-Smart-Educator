import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import Animated, { FadeIn, FadeInRight } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Colors, domains as AVAILABLE_DOMAINS } from "@/assets/constants/index";
const AView = Animated.View;
const APressable = Animated.createAnimatedComponent(Pressable);

const ChooseDomain = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const router = useRouter();

  const toggle = (domain: string) =>
    setSelected((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );

  const handleDone = () => {
    // pass selected domains back to signup (signup should read params if implemented)
    router.push({
      pathname: "/(auth)/signup",
      params: { domains: JSON.stringify(selected) },
    });
  };

  return (
    <AView
      entering={FadeIn.duration(300)}
      className="flex-1 bg-gradient-to-b from-[#071026] to-[#0f1724]"
    >
      <View className="px-6 pt-6">
        <Text className="mb-1 text-2xl text-white font-outfit-extrabold">
          Choose your domains
        </Text>
        <Text className="mb-4 text-sm text-gray-300">
          Select the areas you're interested in — this helps personalize your
          feed and course recommendations.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap -m-2">
          {AVAILABLE_DOMAINS.map((domain, idx) => {
            const active = selected.includes(domain);
            return (
              <APressable
                key={domain}
                onPress={() => toggle(domain)}
                entering={FadeInRight.delay(idx * 30).duration(300)}
                className={`m-2 w-1/2`}
              >
                <View
                  className={`p-4 rounded-xl flex-row items-center justify-between ${
                    active
                      ? "bg-white/15 border-white/20"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <View className="flex-1 pr-3">
                    <Text
                      className={`text-sm font-outfit ${active ? "text-white" : "text-gray-200"}`}
                    >
                      {domain}
                    </Text>
                  </View>

                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center ${
                      active
                        ? "bg-green-500"
                        : "bg-transparent border border-white/10"
                    }`}
                  >
                    {active ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : (
                      <Ionicons name="add" size={16} color="#cbd5e1" />
                    )}
                  </View>
                </View>
              </APressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="px-6 pb-8">
        <APressable onPress={handleDone} className="overflow-hidden rounded-lg">
          <LinearGradient
            colors={
              selected.length
                ? [Colors.PRIMARY, Colors.PRIMARY_LIGHT]
                : ["#475569", "#475569"]
            }
            start={[0, 0]}
            end={[1, 0]}
            className="items-center py-3 rounded-lg"
          >
            <Text className="text-base text-white font-outfit-extrabold">
              {selected.length ? `Done (${selected.length})` : "Skip for now"}
            </Text>
          </LinearGradient>
        </APressable>
      </View>
    </AView>
  );
};

export default ChooseDomain;
