import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

export default function SelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState('self');

  const { brand, category, price } = params;

  const handleSelection = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption === 'self') {
      router.push({
        pathname: '/gift-amount',
        params: { 
          brand, 
          category, 
          price,
          recipient: 'self'
        }
      });
    } else {
      router.push({
        pathname: '/recipient-info',
        params: { 
          brand, 
          category, 
          price,
          recipient: 'other'
        }
      });
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.brandCard}>
          <View style={styles.brandLogo}>
            <Image 
              source={require('../assets/images/alinino.png')} 
              style={styles.brandImage}
              resizeMode="contain"
            />
          </View>
          
          <Text style={styles.brandTitle}>{brand}</Text>
          <Text style={styles.brandCategory}>Kateqoriya: {category}</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>Əla seçim! Şanslı sahib kim olacaq?</Text>
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'self' && styles.optionButtonActive
            ]}
            onPress={() => handleSelection('self')}
          >
            <Text style={[
              styles.optionText,
              selectedOption === 'self' && styles.optionTextActive
            ]}>
              Özüm üçün seçirəm
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionButton,
              selectedOption === 'other' && styles.optionButtonActive
            ]}
            onPress={() => handleSelection('other')}
          >
            <Text style={[
              styles.optionText,
              selectedOption === 'other' && styles.optionTextActive
            ]}>
              Başqası üçün seçirəm
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Davam et</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.primary} />
            <Text style={styles.backButtonText}>Geri qayıt</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  brandCard: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 40,
  },
  brandLogo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  brandImage: {
    width: 120,
    height: 120,
  },
  brandTitle: {
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
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionText: {
    fontSize: 20,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: '#fff',
  },
  actionContainer: {
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary,
  },
});
