import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  Easing,
  BackHandler,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DrawerContent } from "./DrawerContent";
import { useDrawer } from "../context/DrawerContext";
import { useThemeColors } from "../context/ThemeContext";

const DRAWER_WIDTH = 320;

export const DrawerLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isOpen, closeDrawer } = useDrawer();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
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

  if (!isOpen) {
    return <View style={styles.main}>{children}</View>;
  }

  return (
    <Modal transparent animationType="none" statusBarTranslucent>
      {/* Main content (dimmed) */}
      <View style={styles.modalContainer}>
        {children}

        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            { opacity: overlayOpacity, backgroundColor: "#000" },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            onPress={handleBackdropPress}
          />
        </Animated.View>

        {/* Drawer */}
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
        >
          <DrawerContent />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
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
