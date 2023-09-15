//@ts-nocheck
import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Camera, CameraPermissionStatus, useCameraDevices} from 'react-native-vision-camera';

const TabOneScreen = () => {
  const [cameraPermissionStatus, setCameraPermissionStatus] = useState<CameraPermissionStatus>('not-determined');
  const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState<CameraPermissionStatus>('not-determined');

  const requestMicrophonePermission = useCallback(async () => {
    console.log('Requesting microphone permission...');
    const permission = await Camera.requestMicrophonePermission();
    console.log(`Microphone permission status: ${permission}`);

    if (permission === 'denied') console.warn('Microphone permissions denied');
    setMicrophonePermissionStatus(permission);
  }, []);

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission === 'denied') console.warn('Camera permissions denied');
    setCameraPermissionStatus(permission);
  }, []);

  useEffect(() => {
    if (cameraPermissionStatus === 'granted' && microphonePermissionStatus === 'granted') console.log('Ready to go!');
  }, [cameraPermissionStatus, microphonePermissionStatus]);

  const devices = useCameraDevices()
  const device = devices.front

  if (device == null) return <></>

  return (
    <View>
      <Text style={{color: 'white', text: 40}} onPress={requestCameraPermission}>
        Video Grant
      </Text>

      <Text onPress={requestMicrophonePermission}>
        Microphone Grant
      </Text>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
      />
    </View>
  );
};

export default TabOneScreen;
