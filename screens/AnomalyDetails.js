import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TextInput,
  TouchableOpacity, SafeAreaView, ScrollView
} from 'react-native';
import { db as firestore } from '../firebaseConfig';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Linking } from 'react-native';

const AnomalyDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { anomaly } = route.params;

  const [diseases, setDiseases] = useState([]);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        // anomalyDiseases koleksiyonundan anomaly.ID'ye bağlı hastalıkları getir
        const q = query(
          collection(firestore, 'anomalyDiseases'),
          where('AnomalyId', '==', anomaly.ID)
        );
        const querySnapshot = await getDocs(q);

        // Her bir ilişki kaydındaki DiseaseId kullanarak Hastalık isimlerini çek
        const diseasePromises = querySnapshot.docs.map(async (docSnap) => {
          const diseaseId = docSnap.data().DiseaseId;
          const diseaseRef = doc(firestore, 'Diseases', diseaseId);
          const diseaseDoc = await getDoc(diseaseRef);
          if (diseaseDoc.exists()) {
            return diseaseDoc.data().Name;
          }
          return null;
        });

        // Tüm hastalık isimlerini bekle
        const diseaseNames = (await Promise.all(diseasePromises)).filter(Boolean);

        setDiseases(diseaseNames);
      } catch (error) {
        console.error('Hastalık verisi alınamadı:', error);
      }
    };

    fetchDiseases();
  }, [anomaly.ID]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {/* HEADER */}
          <View style={styles.header}>
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
          </View>

          {/* Görsel */}
          <View style={styles.imageContainer}>
            {anomaly.Image && (
              <Image source={{ uri: anomaly.Image }} style={styles.image} />
            )}
          </View>


          {/* Anomali İsmi */}
          <TextInput style={styles.title2} value={anomaly.Name} editable={false} />
          <TextInput style={styles.title3} value={anomaly.engName} editable={false} />

          {/* Açıklama */}
          <Text style={styles.label}>Açıklama</Text>
          <TextInput
            style={[styles.description]}
            value={anomaly.Description}
            editable={false}
            multiline
          />
          <Text style={styles.line}></Text>

          {/* Hastalık listesi */}
          {diseases.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>İlişkili Hastalıklar:</Text>
              {diseases.map((diseaseName, index) => (
                <Text key={index} style={styles.listItem}>• {diseaseName}</Text>
              ))}
            </>
          )}

          {/* Daha Fazla Bilgi Butonu */}
          {anomaly.Link && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Linking.openURL(anomaly.Link).catch(err => {
                  console.error("Link açılamadı: ", err);
                });
              }}
            >
              <Text style={styles.buttonText}>Daha Fazla Bilgi</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* ALT NAVBAR */}
      <View style={styles.customNavbar}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Image
            source={require('../assets/hitit-logo.png')}
            style={styles.navIconImage}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCircleButton}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <Ionicons name="camera" size={30} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Info')}>
          <Ionicons name="information-circle-outline" size={28} color="#000" />
          <Text style={styles.infoText}>Bilgi</Text>
        </TouchableOpacity>
      </View>

      {/* Alt metin */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.bottomText}>Bilgisayar Mühendisliği - 2025</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6f7fa'
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  container: {
    alignItems: 'center',
    padding: 20
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10
  },
  logoCircle: {
    marginTop: 40,
    width: 60,
    height: 60,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  backIcon: {
    position: 'absolute',
    right: 200,
    top: 30,
    zIndex: 10,
  },
  title: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 15,
    marginLeft: 20,
    color: '#120a8f',
  },
  imageContainer: {
    width: 300,
    height: 280,
    borderRadius: 30,
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
  image: {
   width: 280,
    height: 260,
    borderRadius: 30,
    resizeMode: 'cover'
  },


  title2: {
    borderColor: '#029dbb',
    paddingVertical: 5,
    textAlign: 'center',
    fontSize: 30,
    color: "#0393AA",
    fontWeight: "bold"
  },
  title3: {
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
  label: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5
  },
  description: {
    textAlign: 'left',
    color: '#333',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 0,
    paddingVertical: 5
  },
  line: {
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#029dbb',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    alignSelf: 'flex-start',
    marginLeft: 10
  },
  button: {
    backgroundColor: '#00b3b3',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 50,
    width: 250,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  customNavbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navIconImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    marginLeft: -30,
  },
  navCircleButton: {
    backgroundColor: '#B2EBF2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  infoText: {
    fontSize: 12,
    marginTop: 2,
  },
  bottomTextContainer: {
    alignItems: 'center',
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  bottomText: {
    fontSize: 12,
    color: '#555',
  },
});

export default AnomalyDetails;
