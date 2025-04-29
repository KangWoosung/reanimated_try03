import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Feather from "@expo/vector-icons/Feather";

import tailwindColors from "@/utils/tailwindColors";
// import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useThemeProvider } from "@/contexts/NativewindThemeProvider";
import { useMaskAnimationStore } from "@/contexts/maskAnimationZustand";
import { wait } from "@/utils/timeFunctions";
import { withTiming } from "react-native-reanimated";
import { SCRN_HEIGHT, SCRN_WIDTH } from "@/contexts/MaskAnimationProvider";
import {
  MASK_ANIMATE_DURATION,
  THEME_TOGGLER_BUTTON_SIZE,
} from "@/constants/constants";
import { takeSnapshot } from "@/utils/takeSnapshot";
import { View } from "react-native";
// import { SystemBars } from "react-native-edge-to-edge";
// import { useStatusBarController } from "@/hooks/useStatusBarController";

export const CurtainMaskTriggerButton = () => {
  const { colorScheme } = useColorScheme();
  const { nativewindColorScheme, nativeWindSetTheme } = useThemeProvider();
  // const { hideStatusBar, showStatusBar } = useStatusBarController();
  const { active, ref, setCurtainOverlay, setActive, curtainWidth } =
    useMaskAnimationStore();

  const isDark = colorScheme === "dark";
  const foregroundTheme =
    tailwindColors.foreground[isDark ? "dark" : "DEFAULT"];

  const tap = Gesture.Tap()
    .runOnJS(true)
    .onStart(async (e) => {
      if (!active) {
        setActive(true);
        // hideStatusBar();
        // await wait(16);
        const snapshot1 = await takeSnapshot(ref);
        if (snapshot1) {
          setCurtainOverlay(snapshot1);
        }
        // await wait(80);
        nativeWindSetTheme(nativewindColorScheme === "dark" ? "light" : "dark");

        if (curtainWidth) {
          curtainWidth.value = withTiming(SCRN_WIDTH, {
            duration: MASK_ANIMATE_DURATION,
          });
        }
        await wait(MASK_ANIMATE_DURATION);
        setCurtainOverlay(null);
        if (curtainWidth) curtainWidth.value = 0;
        // showStatusBar();
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
