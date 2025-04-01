import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import PaperPlane from "./components/PaperPlane";
import Obstacle from "./components/Obstacle";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function App() {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [obstacles, setObstacles] = useState([]);

  // Plane position
  const planePositionY = useRef(new Animated.Value(windowHeight / 2)).current;
  const obstaclesPosition = useRef(new Animated.Value(windowWidth)).current;

  // Generate random obstacles
  const generateObstacles = () => {
    const gapHeight = 200; // Gap between obstacles
    const minHeight = 50; // Minimum obstacle height
    const maxHeight = windowHeight - gapHeight - minHeight; // Maximum obstacle height
    const topHeight = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    const bottomHeight = windowHeight - topHeight - gapHeight;

    return [
      {
        top: 0,
        height: topHeight,
      },
      {
        top: topHeight + gapHeight,
        height: bottomHeight,
      },
    ];
  };

  // Check collision
  const checkCollision = (planeY, obstacles, obstacleX) => {
    const planeSize = { width: 60, height: 40 };
    const planeX = 50; // Fixed X position of the plane

    // Check if plane is within obstacle X range
    if (obstacleX <= planeX + planeSize.width && obstacleX + 60 >= planeX) {
      // Check if plane hits top obstacle
      if (planeY <= obstacles[0].height) {
        return true;
      }

      // Check if plane hits bottom obstacle
      if (planeY + planeSize.height >= obstacles[1].top) {
        return true;
      }
    }

    // Check if plane hits the ground or ceiling
    if (planeY <= 0 || planeY + planeSize.height >= windowHeight) {
      return true;
    }

    return false;
  };

  // Game loop
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Generate initial obstacles
      if (obstacles.length === 0) {
        setObstacles(generateObstacles());
        obstaclesPosition.setValue(windowWidth);
      }

      // Animate obstacles
      const obstacleAnimation = Animated.timing(obstaclesPosition, {
        toValue: -100,
        duration: 3000,
        useNativeDriver: true,
      });

      obstacleAnimation.start(({ finished }) => {
        if (finished && gameStarted && !gameOver) {
          // Reset obstacles position and generate new ones
          obstaclesPosition.setValue(windowWidth);
          setObstacles(generateObstacles());
          setScore((prevScore) => prevScore + 1); // Use functional update
        }
      });

      // Set up the game loop
      const gameLoop = setInterval(() => {
        // Apply gravity when not pressed (plane goes down)
        if (!isPressed) {
          planePositionY.setValue(planePositionY._value + 5);
        } else {
          // Go up when pressed
          planePositionY.setValue(planePositionY._value - 5);
        }

        // Check collision
        if (
          checkCollision(
            planePositionY._value,
            obstacles,
            obstaclesPosition._value
          )
        ) {
          clearInterval(gameLoop);
          setGameOver(true);
        }
      }, 16); // ~60fps

      return () => {
        clearInterval(gameLoop);
        obstacleAnimation.stop();
      };
    }
  }, [gameStarted, gameOver, isPressed, obstacles.length]); // Changed dependencies

  // Reset game function
  const resetGame = () => {
    planePositionY.setValue(windowHeight / 2);
    obstaclesPosition.setValue(windowWidth);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  };

  // Start game function
  const startGame = () => {
    resetGame();
    setGameStarted(true);
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
    >
      <View style={styles.container}>
        <StatusBar hidden />

        {!gameStarted || gameOver ? (
          <View style={styles.startScreen}>
            <Text style={styles.title}>Paper Plane Fly</Text>

            {gameOver && <Text style={styles.gameOverText}>Game Over!</Text>}

            <Text style={styles.scoreText}>Score: {score}</Text>

            <Text style={styles.instructions}>
              Tap and hold to make the plane go up. Release to let it glide
              down.
            </Text>

            <TouchableWithoutFeedback onPress={startGame}>
              <View style={styles.startButton}>
                <Text style={styles.startButtonText}>
                  {gameOver ? "Play Again" : "Start Game"}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : (
          <View style={styles.gameContainer}>
            <Text style={styles.score}>Score: {score}</Text>

            <Animated.View
              style={[
                styles.planeContainer,
                {
                  transform: [{ translateY: planePositionY }],
                },
              ]}
            >
              <PaperPlane isFlying={isPressed} />
            </Animated.View>

            {obstacles.map((obstacle, index) => (
              <Animated.View
                key={index}
                style={{
                  transform: [{ translateX: obstaclesPosition }],
                  position: "absolute",
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 4,
                }}
              >
                <Obstacle
                  top={obstacle.top}
                  height={obstacle.height}
                  left={0}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#87CEEB", // Sky blue background
  },
  gameContainer: {
    flex: 1,
  },
  startScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "red",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    marginBottom: 20,
    color: "#333",
  },
  instructions: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  startButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  score: {
    position: "absolute",
    top: 20,
    right: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    zIndex: 10,
  },
  planeContainer: {
    position: "absolute",
    left: 50,
  },
});
