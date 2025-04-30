import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import DrawerIcon from "@/components/navigator/DrawerIcon";
import tailwindColors from "@/utils/tailwindColors";
import { useColorScheme } from "nativewind";
import { HEADER_ICON_SIZE } from "@/constants/constants";
const ProfileLayout = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const backgroundTheme =
    tailwindColors.background[isDark ? "secondaryDark" : "secondary"];
  const foregroundTheme =
    tailwindColors.foreground[isDark ? "secondaryDark" : "secondary"];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: backgroundTheme,
        },
        headerTitleStyle: {
          color: foregroundTheme,
        },
        headerTintColor: foregroundTheme,
        // detachInactiveScreens: true,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Home",
          headerLeft: () => (
            <DrawerIcon color={foregroundTheme} size={HEADER_ICON_SIZE} />
          ),
        }}
        name="index"
      />
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default ProfileLayout;
