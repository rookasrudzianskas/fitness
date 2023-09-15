//@ts-nocheck
import React, { useEffect, useState } from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Camera, CameraPermissionStatus } from 'react-native-vision-camera';

const TabOneScreen = () => {
  const [cameraPermission, setCameraPermission] = useState<CameraPermissionStatus>();
  const [microphonePermission, setMicrophonePermission] = useState<CameraPermissionStatus>();

  useEffect(() => {
    Camera.getCameraPermissionStatus().then(setCameraPermission);
    Camera.getMicrophonePermissionStatus().then(setMicrophonePermission);
  }, []);

  console.log(`Re-rendering Navigator. Camera: ${cameraPermission} | Microphone: ${microphonePermission}`);

  if (cameraPermission == null || microphonePermission == null) {
    // still loading
    return null;
  }
  return (
    <View>
      <Text>
        byrookas 🚀
      </Text>
    </View>
  );
};

export default TabOneScreen;
