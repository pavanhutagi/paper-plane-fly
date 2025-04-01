import React from "react";
import { View, StyleSheet } from "react-native";

export default function Obstacle({ top, height, left }) {
  return (
    <View
      style={[
        styles.obstacle,
        {
          height,
          top,
          left,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  obstacle: {
    position: "absolute",
    width: 60,
    backgroundColor: "#2E8B57", // Sea green
    borderRadius: 10,
    zIndex: 5,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#1C6840",
  },
});
