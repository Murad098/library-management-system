import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  BackHandler,
} from "react-native";
import { DrawerContent } from "./DrawerContent";
import { useDrawer } from "../context/DrawerContext";
import { useThemeColors } from "../context/ThemeContext";

const DRAWER_WIDTH = 300;

export const DrawerLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen, closeDrawer } = useDrawer();
  const colors = useThemeColors();
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const onBackPress = () => {
      if (isOpen) {
        closeDrawer();
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress,
    );

    return () => {
      if (typeof subscription?.remove === "function") {
        subscription.remove();
      }
    };
  }, [isOpen, closeDrawer]);

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -DRAWER_WIDTH,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();

    Animated.timing(overlayOpacity, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start();
  }, [isOpen, translateX, overlayOpacity]);

  const handleBackdropPress = () => {
    closeDrawer();
  };

  return (
    <View style={styles.main}>
      {children}

      {/* Backdrop — captures taps to dismiss the drawer */}
      <Animated.View
        style={[
          styles.backdrop,
          { opacity: overlayOpacity, backgroundColor: "#000" },
        ]}
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <TouchableOpacity
          style={styles.backdropTouchable}
          onPress={handleBackdropPress}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Drawer — always mounted so ScreenContainer views in the children
          are never re-parented between native roots */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
            backgroundColor: colors.base,
            shadowColor: "#000",
          },
        ]}
        accessibilityLabel="Navigation menu"
        pointerEvents={isOpen ? "auto" : "none"}
      >
        <DrawerContent />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 5,
  },
  backdropTouchable: {
    flex: 1,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    elevation: 16,
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 10,
  },
});
