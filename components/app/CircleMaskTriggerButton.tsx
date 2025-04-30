import { View, Text, StatusBar } from "react-native";
import React from "react";
import { useColorScheme } from "nativewind";
import { useThemeProvider } from "@/contexts/NativewindThemeProvider";
import tailwindColors from "@/utils/tailwindColors";
import { useMaskAnimationStore } from "@/contexts/maskAnimationZustand";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { wait } from "@/utils/timeFunctions";
import { takeSnapshot } from "@/utils/takeSnapshot";
import { SCRN_WIDTH } from "@/contexts/MaskAnimationProvider";
import { withTiming } from "react-native-reanimated";
import {
  MASK_ANIMATE_DURATION,
  THEME_TOGGLER_BUTTON_SIZE,
} from "@/constants/constants";
import { Feather } from "@expo/vector-icons";
import { calculateMaxRadius } from "@/utils/calculateMaxRadius";
import {
  StatusBar as ExpoStatusBar,
  setStatusBarHidden,
} from "expo-status-bar";

export const CircleMaskTriggerButton = () => {
  const { colorScheme } = useColorScheme();
  const { nativewindColorScheme, nativeWindSetTheme } = useThemeProvider();
  const {
    active,
    ref,
    setCircleOverlay,
    setActive,
    circleRadius,
    circleCoordX,
    circleCoordY,
  } = useMaskAnimationStore();

  const isDark = colorScheme === "dark";
  const foregroundTheme =
    tailwindColors.foreground[isDark ? "dark" : "DEFAULT"];
  const backgroundTheme =
    tailwindColors.background[isDark ? "secondaryDark" : "secondary"];

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart(async (e) => {
      if (circleCoordX) {
        circleCoordX.value = e.absoluteX;
      }
      if (circleCoordY) {
        circleCoordY.value = e.absoluteY;
      }

      if (!active) {
        setActive(true);
        // setStatusBarHidden(true, "none");
        await wait(18);
        const snapshot2 = await takeSnapshot(ref);
        if (snapshot2) {
          setCircleOverlay(snapshot2);
        }
        if (circleRadius) {
          const maxRadius = calculateMaxRadius(e.absoluteX, e.absoluteY);
          circleRadius.value = withTiming(maxRadius, {
            duration: MASK_ANIMATE_DURATION,
          });
        }
        // Wait for just 1 frame
        await wait(16);
        nativeWindSetTheme(nativewindColorScheme === "dark" ? "light" : "dark");

        await wait(MASK_ANIMATE_DURATION);
        // StatusBar.setBackgroundColor(backgroundTheme);

        setCircleOverlay(null);
        if (circleRadius) circleRadius.value = 0;
        if (circleCoordX) circleCoordX.value = 0;
        if (circleCoordY) circleCoordY.value = 0;
        // setStatusBarHidden(false);
        setActive(false);
      }
    });
  return (
    <GestureDetector gesture={tap}>
      <View collapsable={false}>
        <Feather
          name={colorScheme === "dark" ? "moon" : "sun"}
          color={foregroundTheme}
          size={THEME_TOGGLER_BUTTON_SIZE}
        />
      </View>
    </GestureDetector>
  );
};
