import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const AboutScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff'}}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          <View style={{ width: 24 }} />
        </View>

        <View style={styles.logo}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
            />
          </View>
        </View>

        <Text style={styles.subtitle}>Uygulama Hakkında</Text>
        <View style={styles.line} />


        <Text style={styles.text}>
          Bu mobil uygulama, tırnak anomalisine bağlı hastalıkların erken teşhisini kolaylaştırmak ve sağlık
          profesyonellerine ya da bireysel kullanıcılara yardımcı olmak amacıyla geliştirilmiştir.
        </Text>

        <Text style={styles.text}>
          Uygulama, kullanıcıdan tırnak fotoğraflarını alır ve bu fotoğrafları yapay zeka destekli
          analiz süreçlerinden geçirerek olası anomalileri belirler. Anomali türüne göre kullanıcı
          bilgilendirilir ve gerekli durumlarda bir sağlık uzmanına danışması önerilir.
        </Text>

        <Text style={styles.sectionTitle}>Proje Bilgileri</Text>
        <View style={styles.line} />

        <Text style={styles.sectionTitle2}>Proje Adı</Text>
        <Text style={styles.text}>Tırnak Anomalisine Dayalı Hastalık Teşhis Sistemi</Text>
        <Text style={styles.text}>(Bilgisayar Mühendisliği Bitirme Çalışması 2025)</Text>

        <Text style={styles.sectionTitle2}>Proje Ekibi</Text>
        <View style={styles.listContainer}>
          {[
            '214210069 - Senanur OKUDUCU',
            '214210071 - Rumeysa Gül ÖZDAĞ',
            '214210083 - Sena Elif TELLİ',
          ].map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle2}>Danışman</Text>
        <Text style={styles.text}>Dr. Öğr. Üyesi Serkan DİŞLİTAŞ</Text>

      </View>

      <View style={styles.navbarsection}>


        {/* Alt navbar */}
        <View style={styles.navbar}>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
            <Image
              source={require('../assets/hitit-logo.png')}
              style={styles.navIconImage}
            />
          </TouchableOpacity>
          <View style={styles.cameraCircle}>
            <TouchableOpacity onPress={() => navigation.navigate('CameraScreen')}>
              <Ionicons name="camera" size={30} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Info')}>
            <Ionicons name="information-circle-outline" size={30} color="#000" />
            <Text style={styles.infoText}>Bilgi</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.bottomText}>Bilgisayar Mühendisliği - 2025</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f7fa',
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E3A8A',
  },
  logo: {
    marginVertical: 12,
    alignSelf: 'center',
    backgroundColor: '#eee',
    borderRadius: 50,
    padding: 20,
  },
  logoText: {
    fontSize: 16,
    color: '#777',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  line: {
    height: 2,
    backgroundColor: '#0ea5e9',
    marginVertical: 6,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: 'bold',
  },
  sectionTitle2: {
    fontSize: 14,
    marginTop: 10,
  },
  text: {
    fontSize: 13,
    marginVertical: 4,
    textAlign: 'justify',
  },
  listContainer: {
    marginLeft: 10,
    marginTop: 5,
  },

  listItem: {
    fontSize: 13,
    marginVertical: 2,
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
  navIconImage: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
    marginLeft: -30
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
  bottomText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#555',
    backgroundColor: '#fff',
    paddingBottom: 5,
  },
  logoCircle: {
    marginTop: 10,
    width: 0,
    height: 0,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  logoImage: {
    width: 90,
    height: 90,

  },
});

export default AboutScreen;
