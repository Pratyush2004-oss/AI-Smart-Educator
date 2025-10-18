import { Colors } from "@/assets/constants";
import TabHeader from "@/components/shared/TabHeader";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      <TabHeader />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: Colors.PRIMARY_LIGHT,
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Colors.WHITE,
            borderTopWidth: 1,
            borderTopColor: "#E1E8ED",
            height: insets.bottom + 45,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="bar-chart" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
            tabBarIcon: ({ color, size }) => (
              <Feather name="user" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
};

export default TabLayout;
