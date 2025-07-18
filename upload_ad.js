const admin = require("firebase-admin");
const fs = require("fs");

// Firebase Admin SDK'yı başlat
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// JSON verisini oku
const data = JSON.parse(fs.readFileSync("anomalyDiseases.json", "utf8"));

// Hedef koleksiyon adı
const collectionName = "anomalyDiseases";

// Verileri Firestore'a yükle
data.forEach(async (item) => {
  try {
    await db.collection(collectionName).doc(item.ID).set(item);
    console.log(`✔️ ${item.ID} yüklendi.`);
  } catch (error) {
    console.error(`❌ ${item.ID} yüklenirken hata:`, error);
  }
});