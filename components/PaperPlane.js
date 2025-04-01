import React from "react";
import { View, StyleSheet } from "react-native";

export default function PaperPlane({ isFlying }) {
  return (
    <View
      style={[styles.plane, isFlying ? styles.flyingUp : styles.flyingDown]}
    >
      <View style={styles.planeBody} />
      <View style={styles.planeFold} />
    </View>
  );
}

const styles = StyleSheet.create({
  plane: {
    width: 60,
    height: 40,
    position: "relative",
  },
  flyingUp: {
    transform: [{ rotate: "-15deg" }],
  },
  flyingDown: {
    transform: [{ rotate: "15deg" }],
  },
  planeBody: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 60,
    borderTopWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: "white",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  planeFold: {
    position: "absolute",
    width: 30,
    height: 1,
    backgroundColor: "#ddd",
    top: 20,
    left: 10,
    transform: [{ rotate: "-25deg" }],
    zIndex: 2,
  },
});
