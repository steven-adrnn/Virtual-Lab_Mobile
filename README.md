# Virtual Lab Mobile

Aplikasi pembelajaran interaktif untuk simulasi algoritma dan struktur data.

## Fitur Utama

- Simulasi algoritma sorting
- Kuis interaktif
- Mode offline
- Autentikasi biometrik
- Notifikasi pembelajaran
- Sharing progress

## Persyaratan Sistem

- Node.js 14 atau lebih baru
- Java Development Kit (JDK) 11
- Android Studio dan Android SDK
- Xcode (untuk iOS)
- CocoaPods (untuk iOS)

## Instalasi

1. Clone repository:
```bash
git clone https://github.com/username/virtuallab.git
cd virtuallab
```

2. Install dependencies:
```bash
npm install
```

3. Install iOS dependencies:
```bash
cd ios && pod install && cd ..
```

4. Setup environment:
- Copy `.env.example` ke `.env`
- Sesuaikan konfigurasi environment

## Menjalankan Aplikasi

### Development

Android:
```bash
npm run android
```

iOS:
```bash
npm run ios
```

### Production Build

Android:
```bash
npm run build-android
```

iOS:
Build melalui Xcode

## Struktur Project

[Struktur direktori yang sudah ada]

## Testing

```bash
npm test
```

## Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distributed under the MIT License. See `LICENSE` for more information.