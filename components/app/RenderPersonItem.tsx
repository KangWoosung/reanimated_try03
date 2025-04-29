/*
2025-04-18 05:18:14

Reanimated Animated. components occur Tailwind class render error.
Github thread:
https://github.com/software-mansion/react-native-reanimated/issues/6665

Some Nativewind classes are not working with Reanimated Animated. components.
So, I had to use StyleSheet theming the component.


*/

import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Animated, {
  runOnJS,
  SharedTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import shadowStyle from "@/components/shadowStyle";

// import { Image } from "expo-image";
import { Link, router } from "expo-router";
import { useColorScheme } from "nativewind";
import tailwindColors, { tailwindSpacing } from "@/utils/tailwindColors";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = -SCREEN_WIDTH * 0.3;
export type PersonDataType = {
  key: string;
  image: string;
  name: string;
  jobTitle: string;
  email: string;
};
export const AVATAR_SIZE = 70;

type RenderItemProps = {
  item: PersonDataType;
  removeItem: (id: string) => void;
  className?: string;
};

const RenderPersonItem = ({ item, removeItem, className }: RenderItemProps) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  // SharedValue...
  const positionX = useSharedValue(0);

  // Animated Style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: positionX.value }],
    };
  });

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // Activate X axis when swiping more than 10px
    .failOffsetY([-5, 5]) // Fail Y axis when swiping more than 5px -> This Makes parent scrollable active
    .onStart(() => {
      console.log("onStart");
    })
    .onUpdate((event) => {
      positionX.value = event.translationX;
    })
    .onEnd((event) => {
      // If the swipe is greater than the threshold, send the item to left for good
      if (event.translationX < SWIPE_THRESHOLD) {
        positionX.value = withTiming(-SCREEN_WIDTH);
        runOnJS(removeItem)(item.key);
      } else {
        positionX.value = withTiming(0);
      }
    })
    .onFinalize(() => {
      console.log("onFinalize");
    });

  const trashBinAnimatedStyle = useAnimatedStyle(() => {
    const opacity = withTiming(positionX.value < SWIPE_THRESHOLD ? 1 : 0, {
      duration: 200,
    });
    return {
      opacity,
    };
  });

  const customTransition = SharedTransition.custom((values) => {
    "worklet";
    return {
      width: withTiming(values.targetWidth, { duration: 800 }), // 800ms로 변경
      height: withTiming(values.targetHeight, { duration: 800 }),
      originX: withTiming(values.targetOriginX, { duration: 800 }),
      originY: withTiming(values.targetOriginY, { duration: 800 }),
    };
  });

  // console.log("=============");
  // console.log(item.name);

  return (
    <>
      <Animated.View
        className="absolute top-0 bottom-0 right-0 left-0 w-full h-full
          items-start justify-center px-10 bg-red-500"
        style={[trashBinAnimatedStyle]}
      >
        <Pressable
          className="bg-error/10 px-sm py-xs rounded-full"
          onPress={() => removeItem(item.key)}
        >
          <Ionicons name="trash" size={24} color="crimson" />
        </Pressable>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Pressable
          onPress={() => {
            router.push({
              pathname: "/(drawer)/(tabs)/people/[id]",
              params: {
                id: item.key,
                name: item.name,
                image: item.image,
                jobTitle: item.jobTitle,
                email: item.email,
              },
            });
          }}
        >
          <Animated.View style={[animatedStyle]}>
            <View
              className="flex-row items-center p-md my-md rounded-lg "
              style={isDark ? styles.cardStyleDark : styles.cardStyleLight}
            >
              <Animated.Image
                source={{ uri: item.image }}
                style={{
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE,
                  borderRadius: AVATAR_SIZE / 2,
                }}
                sharedTransitionTag={`${item.key}-image`}
                sharedTransitionStyle={customTransition}
              />
              <View className="flex-1 gap-1 ">
                <Text className="text-lg font-bold text-foreground dark:text-foreground-dark ">
                  {item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-sm 
                  text-foreground-tertiary dark:text-foreground-dark "
                >
                  {item.jobTitle}
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-sm text-foreground-tertiary dark:text-foreground-secondaryDark"
                >
                  {item.email}
                </Text>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  cardStyleLight: {
    marginVertical: 8,
    backgroundColor: tailwindColors.background.blank,
  },
  cardStyleDark: {
    marginVertical: 8,
    backgroundColor: tailwindColors.background.tertiaryDark,
  },
});

export default RenderPersonItem;
