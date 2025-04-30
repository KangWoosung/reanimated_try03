/*
2025-04-29 16:43:46
Ref:
https://github.com/WadhahEssam/react-native-theme-switch-animation?tab=readme-ov-file


Usage:
    <Button
      title="Switch Theme"
      onPress={() => {

        switchTheme({
          switchThemeFunction: () => {
            setTheme(theme === 'light' ? 'dark' : 'light'); // your switch theme function
          },
          animationConfig: {
            type: 'fade',
            duration: 900,
          },
        });

      }}
    />


*/

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useColorScheme } from "nativewind";
import tailwindColors from "@/utils/tailwindColors";
import { useThemeProvider } from "@/contexts/NativewindThemeProvider";
import switchTheme from "react-native-theme-switch-animation";
import { THEME_TOGGLER_BUTTON_SIZE } from "@/constants/constants";
import { Feather } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const ThemeSwitchAnimationButton = () => {
  const { nativewindColorScheme, nativeWindSetTheme } = useThemeProvider();

  const isDark = nativewindColorScheme === "dark";
  const foregroundTheme =
    tailwindColors.foreground[isDark ? "dark" : "DEFAULT"];

  return (
    <TouchableOpacity
      onPress={(e) => {
        e.currentTarget.measure((x1, y1, width, height, px, py) => {
          switchTheme({
            switchThemeFunction: () => {
              nativeWindSetTheme(
                nativewindColorScheme === "light" ? "dark" : "light"
              );
            },
            animationConfig: {
              type: "circular",
              duration: 900,
              startingPoint: {
                cy: py + height / 2,
                cx: px + width / 2,
              },
            },
          });
        });
      }}
    >
      <Feather
        name={nativewindColorScheme === "dark" ? "moon" : "sun"}
        color={foregroundTheme}
        size={THEME_TOGGLER_BUTTON_SIZE}
      />
    </TouchableOpacity>
  );
};

export default ThemeSwitchAnimationButton;
