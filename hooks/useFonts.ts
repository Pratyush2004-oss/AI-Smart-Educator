import { useFonts as useExpoFonts } from "expo-font";

export const useFonts = () => {
  const [fontsLoaded] = useExpoFonts({
    "Outfit-Regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "Outfit-Medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "Outfit-SemiBold": require("../assets/fonts/Outfit-SemiBold.ttf"),
    "Outfit-Bold": require("../assets/fonts/Outfit-Bold.ttf"),
    // Add more weights as needed
    "Outfit-Light": require("../assets/fonts/Outfit-Light.ttf"),
    "Outfit-ExtraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
    "Times New Roman": require("../assets/fonts/times.ttf"),
    "Times New Roman Bold": require("../assets/fonts/Times-New-Roman-Bold.ttf"),
  });

  return fontsLoaded;
};

export const FontFamily = {
  regular: "Outfit-Regular",
  medium: "Outfit-Medium",
  semibold: "Outfit-SemiBold",
  bold: "Outfit-Bold",
  light: "Outfit-Light",
  extrabold: "Outfit-ExtraBold",
  times: "Times New Roman",
  timesbold: "Times New Roman Bold",
} as const;
