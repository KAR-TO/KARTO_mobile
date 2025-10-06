import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function GiftAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [slideIndex, setSlideIndex] = useState(0); 

  const { brand, category, price, recipient } = params;

  const predefinedAmounts = useMemo(() => ([
    { value: '50', label: '50₼' },
    { value: '100', label: '100₼' },
    { value: '200', label: '200₼' },
  ]), []);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text) => {
    setCustomAmount(text);
    setSelectedAmount('');
  };

  const handleContinue = () => {
    const finalAmount = selectedAmount || customAmount;
    if (!finalAmount || isNaN(parseFloat(finalAmount))) {
      return;
    }

    router.push({
      pathname: '/gift-purchase/payment',
      params: { 
        brand, 
        category, 
        price,
        recipient,
        amount: finalAmount
      }
    });
  };

  const toPrevSlide = () => setSlideIndex((prev) => (prev === 0 ? 0 : prev - 1));
  const toNextSlide = () => setSlideIndex((prev) => (prev === 1 ? 1 : prev + 1));

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hədiyyə məbləği</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.carouselWrapper}>
          <View style={styles.carouselCard}>
            {slideIndex === 0 ? (
              <Image source={require('../../../assets/images/karto.png')} style={styles.kartoImage} resizeMode="contain" />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="add-circle-outline" size={36} color={Colors.primary} />
                <Text style={styles.uploadText}>Öz şəklinizi/videonuzu əlavə edin</Text>
              </View>
            )}
          </View>
          <View style={styles.carouselControls}>
            <TouchableOpacity style={styles.circleBtn} onPress={toPrevSlide}>
              <Ionicons name="chevron-back" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <View style={styles.dots}>
              <View style={[styles.dot, slideIndex === 0 ? styles.dotActive : null]} />
              <View style={[styles.dot, slideIndex === 1 ? styles.dotActive : null]} />
            </View>
            <TouchableOpacity style={styles.circleBtn} onPress={toNextSlide}>
              <Ionicons name="chevron-forward" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Məbləği seçin</Text>
          <View style={styles.predefinedAmounts}>
            {predefinedAmounts.map((amount) => (
              <TouchableOpacity
                key={amount.value}
                style={[
                  styles.amountPill,
                  selectedAmount === amount.value && styles.amountPillActive
                ]}
                onPress={() => handleAmountSelect(amount.value)}
              >
                <Text style={[
                  styles.amountPillText,
                  selectedAmount === amount.value && styles.amountPillTextActive
                ]}>{amount.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customAmountContainer}>
            <TextInput
              style={styles.amountTextInput}
              placeholder="Məbləği daxil edin"
              placeholderTextColor={Colors.placeholder}
              keyboardType="numeric"
              value={customAmount}
              onChangeText={handleCustomAmountChange}
            />
          </View>
        </View>

        <View style={styles.messageContainer}>
          <TextInput
            style={styles.messageInput}
            placeholder="Mesajınız"
            placeholderTextColor={Colors.placeholder}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            (!selectedAmount && !customAmount) && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedAmount && !customAmount}
        >
          <Text style={styles.continueButtonText}>Davam et</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  carouselWrapper: {
    paddingHorizontal: 20,
  },
  carouselCard: {
    backgroundColor: '#e9f3ea',
    borderRadius: 12,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kartoImage: {
    width: '90%',
    height: 150,
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: Colors.primary,
    fontFamily: Fonts.Poppins_Regular,
  },
  carouselControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  amountSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  predefinedAmounts: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  amountPill: {
    minWidth: 74,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountPillActive: {
    borderColor: Colors.primary,
  },
  amountPillText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Fonts.Poppins_Regular,
  },
  amountPillTextActive: {
    color: Colors.textPrimary,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  customAmountContainer: {
    marginTop: 6,
  },
  amountTextInput: {
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: Fonts.Poppins_Regular,
  },
  messageContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  messageInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minHeight: 90,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  continueButtonText: {
    fontSize: 15,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
});