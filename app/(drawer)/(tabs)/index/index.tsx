import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { CurtainMaskTriggerButton } from "@/components/app/CurtainMaskTriggerButton";
import { useColorScheme } from "nativewind";
import DrawerIcon from "@/components/navigator/DrawerIcon";
import tailwindColors from "@/utils/tailwindColors";
import { setStatusBarHidden } from "expo-status-bar";

const Index = () => {
  const [statusHidden, setStatusHidden] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundTheme =
    tailwindColors.background[isDark ? "secondaryDark" : "secondary"];
  const foregroundTheme =
    tailwindColors.foreground[isDark ? "secondaryDark" : "secondary"];

  return (
    <>
      <View
        collapsable={false}
        className="flex-1 items-center justify-center gap-md bg-background dark:bg-background-dark"
      >
        <Text className="text-2xl font-bold text-foreground dark:text-foreground-dark">
          index
        </Text>

        <CurtainMaskTriggerButton />
        <Text className="text-xl text-foreground dark:text-foreground-dark">
          {colorScheme}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setStatusHidden(!statusHidden);
            setStatusBarHidden(statusHidden, "none");
          }}
        >
          <Text>Hide Status Bar</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Index;
