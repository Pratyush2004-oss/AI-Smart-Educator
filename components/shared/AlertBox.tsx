// ...new file...
import React, { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { subscribeAlert, hideAlert } from "@/utils/AlertService";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/assets/constants";

const CustomAlert: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<any>({ title: "", message: "", buttons: [] });

  useEffect(() => {
    const unsub = subscribeAlert((p) => {
      // close when empty payload
      if ((!p.title && !p.message) || (p.buttons && p.buttons.length === 0)) {
        setVisible(false);
        setPayload({ title: "", message: "", buttons: [] });
        return;
      }
      setPayload(p);
      setVisible(true);
    });
    return unsub;
  }, []);

  const onClose = () => {
    setVisible(false);
    setPayload({ title: "", message: "", buttons: [] });
  };

  const onPressButton = (btn: any) => {
    try {
      btn?.onPress?.();
    } finally {
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View entering={FadeIn} exiting={FadeOut} className="items-center justify-center flex-1 p-6 bg-black/50">
        <View className="w-full max-w-md overflow-hidden rounded-2xl">
          <LinearGradient colors={[Colors.PRIMARY, "#1f6fd6"]} start={[0, 0]} end={[1, 1]} className="p-4">
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 rounded-full bg-white/20">
                <Ionicons name="alert-circle" size={20} color="#fff" />
              </View>
              <Text className="text-lg text-white font-outfit-bold">{payload.title}</Text>
            </View>
          </LinearGradient>

          <View className="p-4 bg-gray-300">
            <Text className="pl-5 mb-4 text-base text-gray-500 font-outfit-semibold">{payload.message}</Text>

            <View className="flex-row justify-end gap-3">
              {payload.buttons &&
                payload.buttons.map((b: any, i: number) => (
                  <Pressable
                    key={i}
                    onPress={() => onPressButton(b)}
                    className={`px-4 py-2 rounded-lg  ${
                      b.style === "destructive" ? "bg-red-600" : "bg-black/20"
                    }`}
                  >
                    <Text className={`text-sm font-outfit-bold ${b.style === "destructive" ? "text-white" : "text-white"}`}>
                      {b.text || "OK"}
                    </Text>
                  </Pressable>
                ))}
            </View>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default CustomAlert;