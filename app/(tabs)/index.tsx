//@ts-nocheck
import 'react-native-reanimated';
import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, Platform, Text, View, StyleSheet, useWindowDimensions} from 'react-native';
import {Camera, CameraPermissionStatus, useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';
import {useSharedValue, useAnimatedStyle} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Svg, {Line} from 'react-native-svg';

const AnimatedLine = Animated.createAnimatedComponent(Line);

const usePosition = (pose, valueName1, valueName2) => {
  return useAnimatedStyle(
    () => ({
      x1: pose.value[valueName1].x,
      y1: pose.value[valueName1].y,
      x2: pose.value[valueName2].x,
      y2: pose.value[valueName2].y,
    }),
    [pose],
  );
};

export function objectDetect(frame) {
  'worklet';
  return __poseDetection(frame);
}

const defaultPose = {
  leftShoulder: {x: 0, y: 0},
  rightShoulder: {x: 0, y: 0},
  leftElbow: {x: 0, y: 0},
  rightElbow: {x: 0, y: 0},
  leftWrist: {x: 0, y: 0},
  rightWrist: {x: 0, y: 0},
  leftHip: {x: 0, y: 0},
  rightHip: {x: 0, y: 0},
  leftKnee: {x: 0, y: 0},
  rightKnee: {x: 0, y: 0},
  leftAnkle: {x: 0, y: 0},
  rightAnkle: {x: 0, y: 0},
};

const TabOneScreen = () => {
  const pose = useSharedValue(defaultPose);

  const leftWristToElbowPosition = usePosition(pose, 'leftWrist', 'leftElbow');
  const leftElbowToShoulderPosition = usePosition(pose, 'leftElbow', 'leftShoulder');
  const leftShoulderToHipPosition = usePosition(pose, 'leftShoulder', 'leftHip');
  const leftHipToKneePosition = usePosition(pose, 'leftHip', 'leftKnee');
  const leftKneeToAnklePosition = usePosition(pose, 'leftKnee', 'leftAnkle');

  const rightWristToElbowPosition = usePosition(pose, 'rightWrist', 'rightElbow');
  const rightElbowToShoulderPosition = usePosition(pose, 'rightElbow', 'rightShoulder');
  const rightShoulderToHipPosition = usePosition(pose, 'rightShoulder', 'rightHip');
  const rightHipToKneePosition = usePosition(pose, 'rightHip', 'rightKnee');
  const rightKneeToAnklePosition = usePosition(pose, 'rightKnee', 'rightAnkle');

  const shoulderToShoulderPosition = usePosition(pose, 'leftShoulder', 'rightShoulder');
  const hipToHipPosition = usePosition(pose, 'leftHip', 'rightHip');

  const dimensions = useWindowDimensions();

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const poseObject = objectDetect(frame);

    const xFactor = dimensions.width / frame.width;
    const yFactor = dimensions.height / frame.height;

    const poseCopy = {
      leftShoulder: {x: 0, y: 0},
      rightShoulder: {x: 0, y: 0},
      leftElbow: {x: 0, y: 0},
      rightElbow: {x: 0, y: 0},
      leftWrist: {x: 0, y: 0},
      rightWrist: {x: 0, y: 0},
      leftHip: {x: 0, y: 0},
      rightHip: {x: 0, y: 0},
      leftKnee: {x: 0, y: 0},
      rightKnee: {x: 0, y: 0},
      leftAnkle: {x: 0, y: 0},
      rightAnkle: {x: 0, y: 0},
    };

    Object.keys(poseObject).forEach(v => {
      poseCopy[v] = {
        x: poseObject[v].x * xFactor,
        y: poseObject[v].y * yFactor,
      };
    });

    pose.value = poseCopy;
  }, []);

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

  useEffect(() => {
    const checkPermissions = async () => {
      await Camera.requestCameraPermission();
    };
    checkPermissions();
  }, []);

  if (device == null) return <></>

  return (
    <View style={{
      flex: 1,
    }}>
      <Text style={{color: 'white'}} onPress={requestCameraPermission}>
        Video Grant
      </Text>

      <Text onPress={requestMicrophonePermission}>
        Microphone Grant
      </Text>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        orientation="portrait"
        frameProcessorFps={15}
        zoom={20.0}
      />
    </View>
  );
};

export default TabOneScreen;
