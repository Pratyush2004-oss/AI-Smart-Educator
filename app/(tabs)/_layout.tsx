import { Colors } from "@/assets/constants";
import TabHeader from "@/components/shared/TabHeader";
import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useCourseStore } from "@/store/course.store";
import Loader from "@/components/shared/Loader";

const TabLayout = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isLoading } = useCourseStore();
  return (
    <View className="relative flex-1">
      <TabHeader />
      {isLoading && (
        <Loader
          centered={false}
          // place above tab bar and a bit inset from edges
          style={{
            right: 16,
            bottom: insets.bottom + 55,
            zIndex: 50,
          }}
        />
      )}
      {/* Icon with absolute positioning */}
      <TouchableOpacity
        style={styles.floatingIcon}
        onPress={() => router.push("/chatbot")}
      >
        <Image
          source={require("@/assets/images/robot.jpg")} // Update the path to your image
          style={styles.iconImage}
        />
      </TouchableOpacity>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.PRIMARY,
          tabBarInactiveTintColor: Colors.PRIMARY_LIGHT,
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0,
            height: insets.bottom + 50,
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

const styles = StyleSheet.create({
  floatingIcon: {
    position: "absolute",
    bottom: 100,
    right: 20,
    zIndex: 10,
  },
  iconImage: {
    width: 60, // Set the width of the image
    height: 60, // Set the height of the image
    borderRadius: 30, // Optional: Make the image circular
  },
});
export default TabLayout;
