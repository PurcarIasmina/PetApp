import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import Draggable from "react-native-draggable";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

function FloatingIcon(props) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleDragRelease = (event, gestureState) => {
    setPosition({ x: gestureState.x0, y: gestureState.y0 });
  };

  return (
    <View>
      <Draggable
        x={position.x}
        y={position.y}
        onDragRelease={handleDragRelease}
      >
        <MaterialCommunityIcon name="facebook-messenger" />
      </Draggable>
    </View>
  );
}

export default FloatingIcon;
