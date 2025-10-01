import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function GiftAmountScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  const { brand, category, price, recipient } = params;

  const predefinedAmounts = [
    { value: '25', label: '25 ₼' },
    { value: '50', label: '50 ₼' },
    { value: '100', label: '100 ₼' },
    { value: '150', label: '150 ₼' },
    { value: '200', label: '200 ₼' },
    { value: '500', label: '500 ₼' },
  ];

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

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hədiyyə məbləği</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.brandInfo}>
          <Text style={styles.brandName}>{brand}</Text>
          <Text style={styles.brandCategory}>{category}</Text>
        </View>

        <View style={styles.amountSection}>
          <Text style={styles.sectionTitle}>Məbləği seçin</Text>
          
          <View style={styles.predefinedAmounts}>
            {predefinedAmounts.map((amount) => (
              <TouchableOpacity
                key={amount.value}
                style={[
                  styles.amountButton,
                  selectedAmount === amount.value && styles.amountButtonActive
                ]}
                onPress={() => handleAmountSelect(amount.value)}
              >
                <Text style={[
                  styles.amountButtonText,
                  selectedAmount === amount.value && styles.amountButtonTextActive
                ]}>
                  {amount.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.customAmountContainer}>
            <Text style={styles.customAmountLabel}>Və ya öz məbləğinizi daxil edin</Text>
            <View style={styles.customAmountInput}>
              <TextInput
                style={styles.amountInput}
                placeholder="0"
                placeholderTextColor={Colors.placeholder}
                keyboardType="numeric"
                value={customAmount}
                onChangeText={handleCustomAmountChange}
              />
              <Text style={styles.currencySymbol}>₼</Text>
            </View>
          </View>
        </View>

        {(selectedAmount || customAmount) && (
          <View style={styles.selectedAmountContainer}>
            <Text style={styles.selectedAmountLabel}>Seçilmiş məbləğ:</Text>
            <Text style={styles.selectedAmountValue}>
              {selectedAmount || customAmount} ₼
            </Text>
          </View>
        )}

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

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
            <Text style={styles.infoText}>Təhlükəsiz ödəniş</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="flash" size={20} color={Colors.warning} />
            <Text style={styles.infoText}>Anında aktivləşmə</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="gift" size={20} color={Colors.primary} />
            <Text style={styles.infoText}>Hədiyyə kartı</Text>
          </View>
        </View>
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
  brandInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  brandName: {
    fontSize: 24,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  brandCategory: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
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
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  amountButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    minWidth: 100,
    alignItems: 'center',
  },
  amountButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  amountButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  amountButtonTextActive: {
    color: '#fff',
  },
  customAmountContainer: {
    marginTop: 10,
  },
  customAmountLabel: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  customAmountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
    paddingVertical: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  selectedAmountContainer: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  selectedAmountLabel: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: '#fff',
    marginBottom: 4,
  },
  selectedAmountValue: {
    fontSize: 24,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
});