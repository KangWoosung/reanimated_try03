import { StatusBar, StatusBarStyle } from "react-native";
import { useEffect } from "react";
import { useColorScheme } from "nativewind";

export const useStatusBarController = () => {
  const { colorScheme } = useColorScheme();

  // 테마에 따라 스타일 세팅
  useEffect(() => {
    const barStyle: StatusBarStyle =
      colorScheme === "dark" ? "light-content" : "dark-content";
    StatusBar.setBarStyle(barStyle, true);
  }, [colorScheme]);

  // 필요할 때 호출할 수 있도록 함수로도 제공
  const hideStatusBar = () => {
    StatusBar.setHidden(true, "fade"); // "fade" or "slide"
  };

  const showStatusBar = () => {
    StatusBar.setHidden(false, "fade");
  };

  return {
    hideStatusBar,
    showStatusBar,
  };
};
