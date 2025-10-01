import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function PartnersScreen() {
  const router = useRouter();
  
  const partners = [
    { id: 1, name: 'Azərbaycan Dövlət Neft Şirkəti', category: 'Neft və Qaz', rating: 4.8, discount: '5%' },
    { id: 2, name: 'Kapital Bank', category: 'Bank', rating: 4.6, discount: '3%' },
    { id: 3, name: 'Azercell', category: 'Telekommunikasiya', rating: 4.7, discount: '10%' },
    { id: 4, name: 'Nar Mobile', category: 'Telekommunikasiya', rating: 4.5, discount: '8%' },
    { id: 5, name: 'Bakcell', category: 'Telekommunikasiya', rating: 4.4, discount: '7%' },
    { id: 6, name: 'Azərbaycan Hava Yolları', category: 'Aviasiya', rating: 4.9, discount: '15%' },
  ];

  const handlePartnerPress = (partner) => {
    console.log('Partner selected:', partner.name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tərəfdaşlar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Tərəfdaş Şirkətlər</Text>
        <Text style={styles.sectionSubtitle}>KARTO ilə əməkdaşlıq edən şirkətlər</Text>
        
        {partners.map((partner) => (
          <TouchableOpacity
            key={partner.id}
            style={styles.partnerCard}
            onPress={() => handlePartnerPress(partner)}
          >
            <View style={styles.partnerInfo}>
              <View style={styles.partnerIcon}>
                <Ionicons name="business" size={24} color={Colors.primary} />
              </View>
              <View style={styles.partnerDetails}>
                <Text style={styles.partnerName}>{partner.name}</Text>
                <Text style={styles.partnerCategory}>{partner.category}</Text>
                <View style={styles.partnerRating}>
                  <Ionicons name="star" size={16} color={Colors.warning} />
                  <Text style={styles.ratingText}>{partner.rating}</Text>
                </View>
              </View>
            </View>
            <View style={styles.discountContainer}>
              <Text style={styles.discountText}>{partner.discount}</Text>
              <Text style={styles.discountLabel}>Endirim</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  partnerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  partnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  partnerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  partnerDetails: {
    flex: 1,
  },
  partnerName: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  partnerCategory: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  partnerRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  discountContainer: {
    alignItems: 'center',
  },
  discountText: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary,
  },
  discountLabel: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
});