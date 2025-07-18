const admin = require("firebase-admin");
const fs = require("fs");

// Firebase Admin SDK'yı başlat
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

fs.readFile("diseases.json", "utf8", async (err, data) => {
  if (err) {
    console.error("Dosya okuma hatası:", err);
    return;
  }

  try {
    const diseases = JSON.parse(data);

    for (const disease of diseases) {
      const diseaseRef = db.collection("Diseases").doc(disease.ID);
      const doc = await diseaseRef.get();

      if (doc.exists) {
        await diseaseRef.update(disease);
        console.log("Güncellendi: " + disease.Name);
      } else {
        await diseaseRef.set(disease);
        console.log("Eklendi: " + disease.Name);
      }
    }

    console.log("Tüm hastalıklar başarıyla işlendi.");
  } catch (parseError) {
    console.error("JSON çözümleme hatası:", parseError);
  }
});
