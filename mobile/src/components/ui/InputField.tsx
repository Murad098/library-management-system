import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useThemeColors } from "../../context/ThemeContext";

interface InputFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  showPasswordToggle?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
  showPasswordToggle,
  ...props
}) => {
  const colors = useThemeColors();
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = secureTextEntry ?? false;
  const passwordVisible = showPasswordToggle ? !showPassword : isSecure;

  const togglePassword = () => setShowPassword((prev) => !prev);

  const renderRightIcon = () => {
    if (showPasswordToggle) {
      return (
        <TouchableOpacity
          onPress={togglePassword}
          activeOpacity={0.7}
          style={styles.iconButton}
        >
          <Text style={[styles.eyeText, { color: colors.brand }]}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      );
    }

    if (rightIcon) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          activeOpacity={0.7}
          style={styles.iconButton}
        >
          <Ionicons name={rightIcon} size={18} color={colors.textMuted} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.field, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.textMuted }, labelStyle]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.red : colors.line,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={18}
            color={colors.textMuted}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              paddingLeft: leftIcon ? 8 : 16,
              paddingRight:
                renderRightIcon() ? 50 : rightIcon ? 40 : 16,
            },
            inputStyle,
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={passwordVisible}

          autoCapitalize="none"
          {...props}
        />

        {renderRightIcon()}
      </View>

      {error && <Text style={[styles.errorText, { color: colors.red }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  field: { marginBottom: 18 },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 15,
  },
  leftIcon: {
    marginLeft: 14,
  },
  iconButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  eyeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});

export default InputField;
