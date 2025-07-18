import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import * as ImageManipulator from 'expo-image-manipulator';
import LottieView from 'lottie-react-native';
import axios from 'axios';

export default function CameraScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      if (cameraPermission?.status !== 'granted') {
        requestCameraPermission();
      }
      if (mediaPermission?.status !== 'granted') {
        requestMediaPermission();
      }
    }
  }, [isFocused]);

  const uploadImageToAPI = async (imageUri) => {
    let formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "image.jpg"
    });

    try {
      const response = await axios.post(
        'https://69c8-78-168-150-240.ngrok-free.app/predict',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      const result = response.data;
      console.log("Tahmin sonucu:", result);
      return result;
    } catch (error) {
      console.error("Hata:", error);
      return null;
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync();

      const screen = Dimensions.get('window');
      const frameWidth = 300;
      const frameHeight = 300;
      const frameX = (screen.width - frameWidth) / 2;
      const frameY = (screen.height - frameHeight) / 2;

      const ratioX = photo.width / screen.width;
      const ratioY = photo.height / screen.height;

      const cropped = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: frameX * ratioX,
              originY: frameY * ratioY,
              width: frameWidth * ratioX,
              height: frameHeight * ratioY,
            },
          },
        ],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      setPhotoUri(cropped.uri);

      const result = await uploadImageToAPI(cropped.uri);
      setLoading(false);

      navigation.navigate('ResultScreen', {
        photoUri: cropped.uri,
        predictions: result ? result.predictions : [],
      });
    }
  };

  return (
    <View style={styles.container}>
      {isFocused && (

        <CameraView
          key={isFocused ? 'camera-on' : 'camera-off'} // bu satır önemli!
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >

          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>

          <View style={styles.centered}>
            <View style={styles.focusFrame} />
          </View>

          <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
            <Ionicons name="camera" size={32} color="#fff" />
          </TouchableOpacity>
        </CameraView>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require('../assets/nail_animation.json')}
            autoPlay
            loop
            style={{ width: 350, height: 350 }}
          />
          <Text style={{ marginTop: 10 }}>Yükleniyor...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusFrame: {
    width: 350,
    height: 400,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 12,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#0abde3',
    padding: 20,
    borderRadius: 40,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
