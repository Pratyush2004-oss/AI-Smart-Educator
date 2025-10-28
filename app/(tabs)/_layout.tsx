import { Colors } from "@/assets/constants";
import TabHeader from "@/components/shared/TabHeader";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const TabLayout = () => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      <TabHeader />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: Colors.PRIMARY_LIGHT,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            height: insets.bottom + 40,
            elevation: 0,
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={["#fff", "#fff", "#fff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarLabelStyle: { fontFamily: "Outfit-Bold" },
          sceneStyle: { backgroundColor: "transparent" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color, size }) => (
              <Feather name="search" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            tabBarIcon: ({ color, size }) => (
              <Feather name="bar-chart" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
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
