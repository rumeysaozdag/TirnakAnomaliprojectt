# 🩺 Tırnak Anomali Tespiti
### Derin Öğrenme Tabanlı Mobil Karar Destek Sistemi | 2024–2025

ICBESS 2025 Uluslararası Konferansı'nda sunulan bu mezuniyet projesi, tırnaklardaki renk, şekil ve doku değişikliklerini analiz ederek 11 tırnak anomalisi için ön değerlendirme sunmayı amaçlayan yapay zekâ destekli bir mobil karar destek sistemidir. Uygulama bilgilendirme amacı taşır; sağlık uzmanı değerlendirmesi ve tanısının yerine geçmez.

## 🎯 Proje Hedefleri

- Tırnak anomalilerinin görüntülerden otomatik olarak tespit edilmesi ve sınıflandırılması
- Mobil uygulama üzerinden analiz sonuçlarının kullanıcıya sunulması
- Tırnak sağlığı konusunda farkındalığın artırılması ve gerektiğinde sağlık uzmanına başvurunun desteklenmesi

## ⚙️ Sistem Mimarisi

1. **Veri kümesi ve etiketleme:** Özel veri kümesi CVAT aracıyla etiketlendi.
2. **Model eğitimi:** YOLOv8s ve CNN mimarileri PyTorch ile eğitildi.
3. **Backend ve API:** Python ve Flask tabanlı API ile model çıkarımı sağlandı.
4. **Mobil uygulama:** React Native ve Expo ile geliştirildi; Firebase entegrasyonu kullanıldı.

## 🧰 Kullanılan Teknolojiler

| Katman | Teknolojiler |
| --- | --- |
| Derin öğrenme ve görüntü işleme | YOLOv8s, CNN, PyTorch, OpenCV |
| Mobil uygulama | React Native, Expo |
| Bulut ve veritabanı | Firebase |
| Backend ve API | Python, Flask |
| Veri etiketleme | CVAT |

## 📊 Model Performansı

- **Genel doğruluk:** %92–93
- **Ortalama F1 skoru:** 0,87
- **Sınıf sayısı:** 11
- Örnek sınıflar: Clubbing (çomak tırnak), Melanonychia (melanonişi), Leukonychia (lökonişi) ve Yellow Nail Syndrome (sarı tırnak sendromu)

## 📱 Uygulama Görselleri

| Ana sayfa | Tırnak anomalileri | Analiz sonucu |
| --- | --- | --- |
| ![Uygulamanın ana sayfası](images/ana_sayfa.jpg) | ![Tırnak anomalileri ekranı](images/t%C4%B1rnak_anomalileri.jpg) | ![Analiz sonucu ekranı](images/analiz_sonucu.jpg) |

## 🔒 Akademik Erişim Notu

Kaynak kodu ve veri kümesine erişim, devam eden akademik yayın ve hakem değerlendirme süreçleri nedeniyle kısıtlıdır.

## 📜 Lisans ve Telif

© 2024–2025 Proje Ekibi. Tüm hakları saklıdır.
