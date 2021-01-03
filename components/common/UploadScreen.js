import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import * as Progress from "react-native-progress";

import colors from "../../config/colors";

function UploadScreen({ progress = 0, visible = false }) {
  return (
    <Modal visible={visible} transparent>
      <View style={styles.container}>
          <Progress.Bar
            color={colors.secondary}
            progress={progress}
            width={200}
          />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  animation: {
    width: 150,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default UploadScreen;
