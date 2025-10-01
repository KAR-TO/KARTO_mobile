import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomAlertManager } from '../../../components/CustomAlert';
import { Colors, Fonts } from '../../../constants/theme';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const { brand, category, amount, recipientInfo } = params; // removed price, recipient

  const paymentMethods = [
    {
      id: 'card',
      name: 'Bank kartı',
      icon: 'card-outline',
      description: 'Visa, Mastercard, Maestro'
    },
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: 'logo-apple',
      description: 'Apple Pay ilə ödəniş'
    },
    {
      id: 'google',
      name: 'Google Pay',
      icon: 'logo-google',
      description: 'Google Pay ilə ödəniş'
    }
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      CustomAlertManager.show({
        title: 'Uğurlu ödəniş!',
        message: 'Hədiyyə kartınız uğurla yaradıldı və qəbul edənə göndərildi.',
        type: 'success',
        buttons: [
          {
            text: 'Tamam',
            onPress: () => {
              router.replace('/(tabs)/home');
            }
          }
        ]
      });
    }, 2000);
  };

  const handleGoBack = () => {
    router.back();
  };

  const recipientData = recipientInfo ? JSON.parse(recipientInfo) : null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ödəniş</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Sifariş məlumatları</Text>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Mağaza:</Text>
            <Text style={styles.summaryValue}>{brand}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Kateqoriya:</Text>
            <Text style={styles.summaryValue}>{category}</Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Məbləğ:</Text>
            <Text style={styles.summaryValue}>{amount} ₼</Text>
          </View>
          
          {recipientData && (
            <>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Qəbul edən:</Text>
                <Text style={styles.summaryValue}>{recipientData.name}</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Telefon:</Text>
                <Text style={styles.summaryValue}>+994{recipientData.phone}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Ödəniş üsulu</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedPaymentMethod === method.id && styles.paymentMethodActive
              ]}
              onPress={() => handlePaymentMethodSelect(method.id)}
            >
              <View style={styles.paymentMethodInfo}>
                <Ionicons 
                  name={method.icon} 
                  size={24} 
                  color={selectedPaymentMethod === method.id ? Colors.primary : Colors.textSecondary} 
                />
                <View style={styles.paymentMethodText}>
                  <Text style={[
                    styles.paymentMethodName,
                    selectedPaymentMethod === method.id && styles.paymentMethodNameActive
                  ]}>
                    {method.name}
                  </Text>
                  <Text style={styles.paymentMethodDescription}>
                    {method.description}
                  </Text>
                </View>
              </View>
              
              {selectedPaymentMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Ümumi məbləğ:</Text>
            <Text style={styles.totalAmount}>{amount} ₼</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.paymentButton, isProcessing && styles.paymentButtonDisabled]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.paymentButtonText}>Ödəniş işlənir...</Text>
            </View>
          ) : (
            <View style={styles.paymentButtonContainer}>
              <Ionicons name="card" size={20} color="#fff" />
              <Text style={styles.paymentButtonText}>Ödəniş et</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.securityInfo}>
          <View style={styles.securityItem}>
            <Ionicons name="shield-checkmark" size={16} color={Colors.success} />
            <Text style={styles.securityText}>SSL şifrələmə</Text>
          </View>
          <View style={styles.securityItem}>
            <Ionicons name="lock-closed" size={16} color={Colors.success} />
            <Text style={styles.securityText}>Təhlükəsiz ödəniş</Text>
          </View>
          <View style={styles.securityItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.securityText}>PCI DSS uyğunluq</Text>
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
  orderSummary: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  paymentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  paymentMethodActive: {
    borderColor: Colors.primary,
    backgroundColor: '#f0f9ff',
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    marginLeft: 12,
    flex: 1,
  },
  paymentMethodName: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  paymentMethodNameActive: {
    color: Colors.primary,
  },
  paymentMethodDescription: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  totalContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  totalAmount: {
    fontSize: 24,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary,
  },
  paymentButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 18,
    marginBottom: 30,
  },
  paymentButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  paymentButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  processingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paymentButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
  securityInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  securityItem: {
    alignItems: 'center',
    flex: 1,
  },
  securityText: {
    fontSize: 10,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});