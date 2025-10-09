import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function QRScreen() {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`QR/BarCode oxundu: ${data}`);
    // TODO: Backend çağırışı buraya əlavə edin
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Kamera icazəsi yoxlanılır...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.center}>
        <Text style={styles.infoText}>Kameraya giriş icazəsi rədd edildi</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        enableTorch={flash}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'ean13'],
        }}
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.flashButton} onPress={() => setFlash(!flash)}>
          <Ionicons name={flash ? 'flash' : 'flash-outline'} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close-circle" size={28} color="#FF5A5F" />
        </TouchableOpacity>

        <Text style={styles.instructionText}>QR kodu göstərilmiş əraziyə yerləşdirin</Text>

        <View style={styles.qrFrame} />

        {scanned && (
          <TouchableOpacity style={styles.rescanButton} onPress={() => setScanned(false)}>
            <Text style={styles.rescanText}>Yenidən oxu</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    position: 'absolute',
    top: '20%',
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  qrFrame: {
    width: 230,
    height: 230,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 16,
    marginTop: 80,
  },
  flashButton: {
    position: 'absolute',
    top: 60,
    right: 80,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 30,
  },
  rescanButton: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  rescanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
  },
});

