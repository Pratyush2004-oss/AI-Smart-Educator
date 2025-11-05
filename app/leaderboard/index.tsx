// ...existing code...
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Dimensions,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/auth.store";
import { Colors } from "@/assets/constants";
import { LinearGradient } from "expo-linear-gradient";

export type LeaderboardType = {
  name: string;
  email: string;
  _id: string;
  tokens: number;
};

const { width } = Dimensions.get("window");
const podiumWidth = Math.min(600, width - 32);

const AView = Animated.View;

const MedalIcon = ({ rank }: { rank: number }) => {
  if (rank === 1) return <Ionicons name="trophy" size={18} color="#FFD54A" />;
  if (rank === 2) return <Ionicons name="medal" size={16} color="#C0C0C0" />;
  if (rank === 3) return <Ionicons name="medal" size={16} color="#B87333" />;
  return <Text className="text-sm text-gray-400">#{rank}</Text>;
};

const PodiumTop = ({ top }: { top: (LeaderboardType | undefined)[] }) => {
  const first = top[0];
  const second = top[1];
  const third = top[2];

  return (
    <View className="items-center px-4 mt-6">
      {/* semicircular background */}
      <View
        style={{
          width: podiumWidth,
          height: podiumWidth * 0.65,
          borderBottomLeftRadius: podiumWidth / 4,
          borderBottomRightRadius: podiumWidth / 4,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "flex-end",
          backgroundColor: "rgba(255,255,255,0.02)",
        }}
      >
        <View className="absolute inset-0" />
        <View className="items-center w-full" style={{ paddingBottom: 18 }}>
          <View className="flex-row items-end justify-center w-full px-6">
            {/* second */}
            <AView
              entering={FadeInDown.delay(80)}
              className="items-center mr-4"
            >
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 86,
                  height: 86,
                  borderRadius: 86,
                  backgroundColor: "rgba(255,255,255,0.04)",
                }}
              >
                <Image
                  source={{
                    uri: second
                      ? `https://i.pravatar.cc/150?u=${second._id}`
                      : undefined,
                  }}
                  className="w-20 h-20 rounded-full"
                />
              </View>
              <Text
                className="mt-2 text-lg text-gray-300 font-outfit-bold"
                numberOfLines={1}
              >
                {second ? second.name : "—"}
              </Text>
              <View
                className="px-3 py-1 mt-1 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <Text className="text-base text-white font-outfit">
                  {second?.tokens ?? 0} pts
                </Text>
              </View>
              <View className="flex-row items-center mt-2 space-x-1">
                <MedalIcon rank={2} />
                <Text className="text-sm text-gray-400 ">2</Text>
              </View>
            </AView>

            {/* first (center elevated) */}
            <AView
              entering={FadeInDown.delay(40)}
              className="items-center mx-4"
            >
              <View
                style={{
                  width: 112,
                  height: 112,
                  borderRadius: 112,
                  backgroundColor: Colors.PRIMARY + "0D",
                  alignItems: "center",
                  justifyContent: "center",
                  shadowColor: "#000",
                  shadowOpacity: 0.18,
                  shadowOffset: { width: 0, height: 6 },
                  shadowRadius: 12,
                  elevation: 8,
                }}
              >
                <Image
                  source={{
                    uri: first
                      ? `https://i.pravatar.cc/150?u=${first._id}`
                      : undefined,
                  }}
                  className="w-24 h-24 rounded-full"
                />
                <View style={{ position: "absolute", top: -12 }}>
                  <View
                    className="items-center justify-center"
                    style={{
                      width: 36,
                      height: 28,
                      borderRadius: 8,
                      backgroundColor: "#fff",
                    }}
                  >
                    <Ionicons name="star" size={16} color="#FFD54A" />
                  </View>
                </View>
              </View>
              <Text
                className="mt-3 text-base text-white font-outfit-extrabold"
                numberOfLines={1}
              >
                {first ? first.name : "—"}
              </Text>
              <Text className="mt-1 text-green-400 font-outfit-semibold">
                {first?.tokens ?? 0} pts
              </Text>
              <View className="flex-row items-center gap-1 mt-2">
                <MedalIcon rank={1} />
                <Text className="text-lg text-gray-400">1</Text>
              </View>
            </AView>

            {/* third */}
            <AView
              entering={FadeInDown.delay(120)}
              className="items-center ml-4"
            >
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 74,
                  backgroundColor: "rgba(255,255,255,0.03)",
                }}
              >
                <Image
                  source={{
                    uri: third
                      ? `https://i.pravatar.cc/150?u=${third._id}`
                      : undefined,
                  }}
                  className="rounded-full w-18 h-18"
                />
              </View>
              <Text
                className="mt-2 text-lg text-gray-300 font-outfit-bold"
                numberOfLines={1}
              >
                {third ? third.name : "—"}
              </Text>
              <View
                className="px-3 py-1 mt-1 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <Text className="text-white font-outfit-semibold">
                  {third?.tokens ?? 0} pts
                </Text>
              </View>
              <View className="flex-row items-center gap-1 mt-2">
                <MedalIcon rank={3} />
                <Text className="text-gray-400 font-outfit-semibold">3</Text>
              </View>
            </AView>
          </View>
        </View>
      </View>
    </View>
  );
};

const LeaderBoardScreen = () => {
  const { leaderBoard, getLeaderBoard, token, user, tokens } = useUserStore();
  const [isRefreshing, setisRefreshing] = useState(false);

  useEffect(() => {
    getLeaderBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleRefreshData = () => {
    setisRefreshing(true);
    getLeaderBoard().finally(() => setisRefreshing(false));
  };

  const sorted = useMemo(() => {
    return [...(leaderBoard ?? [])].sort(
      (a, b) => (b.tokens || 0) - (a.tokens || 0)
    );
  }, [leaderBoard]);

  const currentUserRank = useMemo(() => {
    if (!user) return null;
    const idx = sorted.findIndex((u) => u._id === user._id);
    return idx === -1 ? null : idx + 1;
  }, [sorted, user]);

  return (
    <LinearGradient
      colors={["#1a1a2e", "#16213e", "#0f3460"]}
      className="flex-1"
    >
      {/* Top semicircular podium */}
      <PodiumTop top={[sorted[0], sorted[1], sorted[2]]} />

      {/* list of remaining users */}
      <FlatList
        data={sorted.slice(3)}
        renderItem={({ item, index }) => {
          const rank = index + 4;
          return (
            <AView entering={FadeInUp.delay(index * 20)} className="px-4">
              <View className="flex-row items-center justify-between p-3 mb-3 rounded-xl bg-white/6">
                <View className="flex-row items-center">
                  <View className="items-center justify-center w-12 h-12 mr-3 rounded-full bg-white/5">
                    <Image
                      source={{
                        uri: `https://i.pravatar.cc/150?u=${item._id}`,
                      }}
                      className="w-10 h-10 rounded-full"
                    />
                  </View>
                  <View style={{ maxWidth: "70%" }}>
                    <Text
                      className="text-lg text-white font-outfit-bold"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className="text-sm text-gray-300 font-outfit-medium"
                      numberOfLines={1}
                    >
                      {item.email}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <View className="items-end mr-4">
                    <Text className="text-gray-300 font-outfit-semibold">
                      Tokens
                    </Text>
                    <Text className="text-base text-white font-outfit-extrabold">
                      {item.tokens ?? 0}
                    </Text>
                  </View>

                  <Text className="text-base text-gray-400 font-outfit-semibold">
                    #{rank}
                  </Text>
                </View>
              </View>
            </AView>
          );
        }}
        keyExtractor={(item) => item._id}
        ListFooterComponent={() =>
          user ? (
            <View className="px-4 pt-4 pb-12">
              <Text className="mb-3 text-sm text-gray-300">Your position</Text>
              <View
                className="flex-row items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
              >
                <View className="flex-row items-center">
                  <View
                    className="items-center justify-center w-12 h-12 mr-3 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                  >
                    <Image
                      source={{
                        uri: `https://i.pravatar.cc/150?u=${user._id}`,
                      }}
                      className="w-10 h-10 rounded-full"
                    />
                  </View>
                  <View>
                    <Text className="text-sm text-white font-outfit-bold">
                      {user.name ?? user.email}
                    </Text>
                    <Text className="text-base text-gray-300 font-outfit">
                      Tokens:{" "}
                      <Text className="text-white font-outfit-extrabold">
                        {String(tokens) ?? 0}
                      </Text>
                    </Text>
                  </View>
                </View>

                <View className="items-end">
                  <Text className="text-sm text-gray-300 font-outfit">
                    Rank
                  </Text>
                  <Text className="text-lg text-white font-outfit-extrabold">
                    {currentUserRank ?? "-"}
                  </Text>
                </View>
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshData}
            tintColor="#fff"
          />
        }
      />
    </LinearGradient>
  );
};

export default LeaderBoardScreen;
