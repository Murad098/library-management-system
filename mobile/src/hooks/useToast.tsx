import { useCallback, useState, ReactNode } from "react";
import {
  Snackbar,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";

import { useThemeColors } from "../context/ThemeContext";

type Severity = "success" | "error" | "info";

interface ToastState {
  visible: boolean;
  message: string;
  severity: Severity;
}

interface UseToastReturn {
  Toast: () => ReactNode;
  show: (message: string, severity?: Severity) => void;
}

export const useToast = (): UseToastReturn => {
  const [state, setState] = useState<ToastState>({
    visible: false,
    message: "",
    severity: "success",
  });

  const colors = useThemeColors();

  const getBackgroundColor = (): string => {
    switch (state.severity) {
      case "error":
        return `${colors.red}1A`;
      case "info":
        return `${colors.sky}1A`;
      default:
        return `${colors.green}1A`;
    }
  };

  const getBorderColor = (): string => {
    switch (state.severity) {
      case "error":
        return `${colors.red}4D`;
      case "info":
        return `${colors.sky}4D`;
      default:
        return `${colors.green}4D`;
    }
  };

  const getTextColor = (): string => {
    switch (state.severity) {
      case "error":
        return colors.red;
      case "info":
        return colors.sky;
      default:
        return colors.green;
    }
  };

  const show = useCallback((message: string, severity: Severity = "success") => {
    setState({ visible: true, message, severity });
  }, []);

  const Toast = useCallback(() => {
    return (
      <Snackbar
        visible={state.visible}
        onDismiss={() => setState((s) => ({ ...s, visible: false }))}
        duration={state.severity === "error" ? 6000 : 4000}
        action={{
          label: "×",
          onPress: () => {},
          color: getTextColor(),
        }}
        style={{
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: 1,
          borderRadius: 12,
          marginBottom: 16,
          alignSelf: "center",
          maxWidth: "90%",
        }}
        elevation={4}
        theme={{
          ...PaperDefaultTheme,
          colors: {
            ...PaperDefaultTheme.colors,
            onSurface: getTextColor(),
          },
        }}
      >
        {state.message}
      </Snackbar>
    );
  }, [state, colors]);

  return { Toast, show };
};
