import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput,
  TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Linking } from 'react-native';

const ResultScreen = ({ route }) => {
  const navigation = useNavigation();
  const { photoUri, predictions = [] } = route.params || {};

  const firstPrediction = predictions.length > 0 ? predictions[0] : null;
  const normalize = (text) =>
    text
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/\s+/g, '_');

  const anomalyKey = firstPrediction ? normalize(firstPrediction.class_name) : null;
  const confidence = firstPrediction ? (firstPrediction.confidence * 100).toFixed(1) + '%' : 'Yok';

  const [anomalyData, setAnomalyData] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalyData = async () => {
      if (!anomalyKey) {
        console.warn("Anomaly key boş geldi!");
        setLoading(false);
        return;
      }

      try {
        console.log("AnomalyKey:", anomalyKey);

        // 1. Anomalies koleksiyonundan eşleşen veriyi al
        const anomalySnapshot = await getDocs(
          query(collection(db, 'Anomalies'), where('Key', '==', anomalyKey))
        );

        if (anomalySnapshot.empty) {
          console.warn("Anomali verisi bulunamadı. Key:", anomalyKey);
        } else {
          const anomalyDoc = anomalySnapshot.docs[0];
          const anomaly = { id: anomalyDoc.id, ...anomalyDoc.data() };
          setAnomalyData(anomaly);

          // 2. İlişkili hastalık ID'lerini al
          const relationSnapshot = await getDocs(
            query(collection(db, 'anomalyDiseases'), where('AnomalyId', '==', anomaly.id))
          );
          const diseaseIds = relationSnapshot.docs.map(doc => doc.data().DiseaseId);

          // 3. Hastalık isimlerini al
          const allDiseasesSnapshot = await getDocs(collection(db, 'Diseases'));
          const diseaseList = allDiseasesSnapshot.docs
            .filter(doc => diseaseIds.includes(doc.id))
            .map(doc => doc.data().Name);

          setDiseases(diseaseList);
        }
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalyData();
  }, [anomalyKey]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.logo}>
            <View style={styles.logoCircle}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logoImage}
              />
            </View>
          </View>
        </View>


        <View style={styles.highlightedImageContainer}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.highlightedImage} />
          ) : (
            <Text style={styles.imageText}>TIRNAK GÖRSELİ</Text>
          )}
        </View>
        <TextInput style={styles.input} value={anomalyData?.Name || 'Yükleniyor...'} editable={false} />
        <TextInput style={styles.input2} value={anomalyData?.engName || 'Yükleniyor...'} editable={false} />
        <Text style={styles.label}>Açıklama</Text>
        <Text style={styles.description}>{anomalyData?.Description || 'Bilgi bulunamadı.'}</Text>
        <Text style={styles.line}></Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00bcd4" style={{ marginVertical: 20 }} />
        ) : (
          diseases.length > 0 && (
            <>
              <Text style={styles.label}>İlişkili Hastalıklar</Text>
              {diseases.map((disease, index) => (
                <Text key={index} style={styles.listItem}>• {disease}</Text>
              ))}
            </>
          )
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (anomalyData?.Link) {
              Linking.openURL(anomalyData.Link).catch(err => {
                console.error("Link açılamadı: ", err);
              });
            }
          }}
        >
          <Text style={styles.buttonText}>Daha Fazla Bilgi</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.customNavbar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Image source={require('../assets/hitit-logo.png')} style={styles.navIconImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navCircleButton} onPress={() => navigation.navigate('CameraScreen')}>
          <Ionicons name="camera" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Info')}>
          <Ionicons name="information-circle-outline" size={28} color="#000" />
          <Text style={styles.infoText}>Bilgi</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Bilgisayar Mühendisliği - 2025</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#e6f7fa' },
  container: { alignItems: 'center', padding: 20, paddingBottom: 140 },
  logoContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 10 },
  backIcon: { position: 'absolute', left: 20, top: 30, zIndex: 10, marginLeft: -160 },
  logoPlaceholder: { width: 50, height: 50, marginTop: 20, borderRadius: 25, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 12, fontWeight: 'bold' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1b3a63', marginBottom: 10 },
  imagePlaceholder: { width: 270, height: 200, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginVertical: 10, borderRadius: 12, marginTop: 50 },
  imageText: { fontSize: 18, fontWeight: 'bold', },
  label: { alignSelf: 'flex-start', fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  input: { borderColor: '#029dbb', paddingVertical: 5, textAlign: 'center', fontSize: 30, color: "#0393AA", fontWeight: "bold" },
  input2: {
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#029dbb',
    marginTop: -10,
    marginBottom: 10,
    paddingVertical: 5,
    textAlign: 'center',
    fontSize: 20,
    color: "#029dbb"
  },
  description: { textAlign: 'left', color: '#333', fontSize: 14, marginTop: 5, marginBottom: 0, paddingVertical: 5 },
  line: {
    width: '100%', borderBottomWidth: 2, borderColor: '#029dbb', marginBottom: 10
  },
  listItem: { fontSize: 14, color: '#333', alignSelf: 'flex-start', marginLeft: 10 },
  button: { backgroundColor: '#00bcd4', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8, marginTop: 25, marginVertical: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  customNavbar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 40, paddingVertical: 10, borderTopWidth: 1, borderColor: '#ccc', backgroundColor: '#fff' },
  navIconImage: { width: 100, height: 50, resizeMode: 'contain', marginLeft: -30 },
  navCircleButton: { backgroundColor: '#B2EBF2', width: 50, height: 50, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginLeft: -30, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 3, elevation: 5 },
  infoText: { fontSize: 12 },
  bottomTextContainer: { alignItems: 'center', paddingBottom: 10, backgroundColor: 'white' },
  bottomText: { fontSize: 12, color: '#555' },
  logoCircle: {
    marginTop: 60,
    width: 0,
    height: 0,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  logoImage: {
    width: 40,
    height: 40,

  },
  highlightedImageContainer: {
    width: 240,
    height: 240,
    borderRadius: 135,
    backgroundColor: '#e0f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
     shadowColor: '#029dbb',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 15, // Android için
    alignSelf: 'center',
  },
  highlightedImage: {
    width: 220,
    height: 220,
    borderRadius: 110,
    resizeMode: 'cover'
  },

});

export default ResultScreen;
