import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, Image, Modal, Pressable, Alert, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';  // Yeni: API için axios
import LottieView from 'lottie-react-native';


const HomeScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);  // Yeni: Yükleme göstergesi

  // Galeri izinlerini al
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Galeriyi kullanmak için izin vermelisiniz.');
      }
    })();
  }, []);

  // Galeriden fotoğraf seç ve API'ye gönder
  const pickImageFromGallery = async () => {
    try {
      setModalVisible(false);
      setTimeout(async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });

        if (!result.canceled) {
          const selectedImage = result.assets[0].uri;
          console.log('Seçilen fotoğraf:', selectedImage);

          // API çağrısı yap
          setLoading(true);
          const formData = new FormData();
          formData.append('image', {
            uri: selectedImage,
            type: 'image/jpeg',
            name: 'image.jpg',
          });

          try {
            const response = await axios.post(
              'https://69c8-78-168-150-240.ngrok-free.app/predict', 
              formData,
              { headers: { 'Content-Type': 'multipart/form-data' } },
            );


            console.log('Tahmin yanıtı:', response.data);

            navigation.navigate('ResultScreen', {
              photoUri: selectedImage,
              predictions: response.data.predictions || [],
            });
          } catch (apiError) {
            console.error('API hatası:', apiError);
            Alert.alert('Hata', 'API çağrısı sırasında bir hata oluştu.');
          } finally {
            setLoading(false);
          }
        }
      }, 300);
    } catch (error) {
      console.log('Hata:', error);
      Alert.alert('Hata', 'Görsel seçimi sırasında bir hata oluştu.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Üst mavi alan */}
      <View style={styles.topSection1}>
        <View style={styles.logoCircle}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logoImage}
          />
        </View>
      </View>

      <View style={styles.topSection2}>
        <Text style={styles.title}>Tırnak Anomalisi</Text>
        <Text style={styles.subtitle}>Klinik Karar Destek Sistemi V.2025</Text>

      </View>

      <View style={styles.topSection3}>

      </View>




      {/* Alt içerik */}
      <View style={styles.bottomContent}>


        <TouchableOpacity
          style={styles.anomalyBox}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={require('../assets/tirnak-logo.png')}
            style={styles.anomalyImage}
          />
          <Text style={styles.anomalyText}>Anomali Tespiti</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.detectButton}
          onPress={() => navigation.navigate('AnomalyTypes')}
        >
          <Text style={styles.buttonText}>Anomali Tipleri</Text>
        </TouchableOpacity>



      </View>
      <View style={styles.navbarsection}>

        {/* Alt navbar */}
        <View style={styles.navbar}>
          <Image source={require('../assets/hitit-logo.png')} style={styles.navLogo} />
          <View style={styles.cameraCircle}>
            <TouchableOpacity onPress={() => navigation.navigate('CameraScreen')}>
              <Ionicons name="camera" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.info}>
            <TouchableOpacity onPress={() => navigation.navigate('Info')}>
              <Ionicons name="information-circle-outline" size={40} color="#000" />

            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.bottomText}>Bilgisayar Mühendisliği - 2025</Text>
      </View>

      {/* MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Görsel Seç</Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('CameraScreen');
              }}
            >
              <Text style={styles.modalButtonText}>Fotoğraf Çek</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.modalButtonText}>Galeriden Seç</Text>
            </TouchableOpacity>

            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancel}>İptal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

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
};

export default HomeScreen;

const styles = StyleSheet.create({
  topSection1: {
    backgroundColor: '#B2EBF2',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: '#0ea5e9',
  },

  topSection2: {
    backgroundColor: '#fff',
    height: '15%',
    alignItems: 'center',
    justifyContent: 'center',

  },

  topSection3: {
    height: 2,
    backgroundColor: '#0ea5e9',
    marginVertical: 6,
    width: '100%',
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0D47A1',
  },

  subtitle: {
    fontSize: 20,
    color: '#707070',

    textAlign: 'center',
    paddingHorizontal: 20,
    fontWeight: 'bold',
  },

  logoCircle: {
    marginTop: 50,
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 170,
    height: 170,

  },
  logoText: {
    fontSize: 18,
    color: '#555',
  },
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 30,
  },


  detectButton: {
    backgroundColor: '#fff',
    height: 50,
    width: 150,
    borderRadius: 30,
    marginBottom: 40,
    marginTop: 40,
    borderColor: '#555',
    borderWidth: 2,
    flexDirection: 'row',  // Icon ve text yan yana
    alignItems: 'center',  // Dikey hizalama
    justifyContent: 'center',
  },


  buttonText: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  anomalyBox: {
    backgroundColor: '#fff',
    width: 250,
    height: 130,
    borderRadius: 30,
    borderWidth: 2,
    alignItems: 'center',
    borderColor: '#555',
    justifyContent: 'center',
    marginTop: 20,
    border: 1,
    backgroundColor: '#B2EBF2',
    shadowColor: '#029dbb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15, // Android için
    alignSelf: 'center',
  },

  anomalyText: {
    marginTop: 6,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  navbarsection: {
    marginBottom: 50,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navLogo: {
    width: 90,
    height: 30,
    resizeMode: 'contain',
    marginLeft: -30,
  },
  cameraCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#B2EBF2',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -25,
  },

  info: {
    marginRight: -20,
  },

  bottomText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    paddingBottom: 5,
  },
  anomalyImage: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalCancel: {
    marginTop: 15,
    color: '#999',
    fontSize: 14,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF', // Beyaz zemin, tamamen opak
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
