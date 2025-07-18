const admin = require("firebase-admin");
const fs = require("fs");

// Firebase Admin SDK'yı başlat
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// anomalies.json dosyasını oku
fs.readFile("anomalies.json", "utf8", async (err, data) => {
  if (err) {
    console.error("Dosya okuma hatası:", err);
    return;
  }

  try {
    const anomalies = JSON.parse(data);

    // her bir anomaliyi Firestore’a ekle veya güncelle
    for (const anomaly of anomalies) {
      const anomalyRef = db.collection("Anomalies").doc(anomaly.ID); // ID'yi kullanarak belgeyi seçiyoruz
      const doc = await anomalyRef.get();

      if (doc.exists) {
        // Eğer belge zaten varsa, güncelle
        await anomalyRef.update(anomaly);
        console.log("Güncellendi: " + anomaly.Name);
      } else {
        // Eğer belge yoksa, yeni bir belge ekle
        await anomalyRef.set(anomaly);
        console.log("Eklendi: " + anomaly.Name);
      }
    }

    console.log("Tüm anomaliler başarıyla işlendi.");
  } catch (parseError) {
    console.error("JSON çözümleme hatası:", parseError);
  }
});
