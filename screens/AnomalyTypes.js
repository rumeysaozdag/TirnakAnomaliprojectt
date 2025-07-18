import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig.js'; 

const AnomalyTypes = () => {
  const navigation = useNavigation();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Anomalies'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(data); // Veriyi burada kontrol et
        setAnomalies(data);
      } catch (error) {
        console.error('Veriler alınırken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(anomalies); // Burada da state'i kontrol et

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Anomali Tipleri</Text>
      <View style={styles.line} />

      {loading ? (
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {anomalies.length === 0 ? (
            <Text>No data available</Text>
          ) : (
      anomalies.map((item) => (
  <TouchableOpacity
    key={item.id}
    style={styles.card}
    onPress={() => navigation.navigate('AnomalyDetails', { anomaly: item })}
  >
    {item.Image ? (
      <Image
        source={{ uri: item.Image }}
        style={styles.image}
      />
    ) : (
      <View style={styles.imagePlaceholder}>
        <Text style={{ textAlign: 'center' }}>Görsel yok</Text>
      </View>
    )}

    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{item.Name}</Text>
      <Text style={styles.cardText}>{item.Description}</Text>
    </View>
  </TouchableOpacity>
))

          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AnomalyTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7f7',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#00264d',
    marginBottom: 5,
  },
  line: {
    height: 2,
    backgroundColor: '#00bcd4',
    marginBottom: 10,
  },
  scroll: {
    paddingBottom: 100,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
    height: 200,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#ccc',
    marginRight: 12,
    borderRadius: 6,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  cardText: {
    color: '#555',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
    marginTop: 20,
  },

  image: {
  width: 150,
  height: 150,
  borderRadius: 6,
  marginRight: 12,
  resizeMode: 'cover',
},

});
