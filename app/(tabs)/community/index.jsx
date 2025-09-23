import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function CommunityScreen() {
  const categories = [
    { id: 'clothing', name: 'Geyim mağazaları', icon: 'shirt-outline', active: false },
    { id: 'books', name: 'Kitab mağazaları', icon: 'book-outline', active: true },
    { id: 'markets', name: 'Marketlər', icon: 'basket-outline', active: false },
  ];

  const bestOffers = [
    {
      id: 1,
      brand: 'Adidas',
      category: 'Geyim',
      price: '50-100 ₼',
      image: require('../../../assets/images/adidas.png'),
      description: 'İdman geyimləri',
      color: '#F5F5F5',
      accentColor: '#000000'
    },
    {
      id: 2,
      brand: 'Puma',
      category: 'Geyim',
      price: '50-100 ₼',
      image: require('../../../assets/images/puma.png'),
      description: 'İdman geyimləri',
      color: '#F5F5F5',
      accentColor: '#000000'
    },
    {
      id: 3,
      brand: 'Olivia',
      category: 'Gözəllik',
      price: '50-100 ₼',
      logo: '💄',
      description: 'Gözəllik və qulluq',
      color: '#F5F5F5',
      accentColor: '#9C27B0'
    }
  ];

  const handleCategoryPress = (category) => {
    console.log('Category selected:', category.name);
  };

  const handleOfferPress = (offer) => {
    console.log('Offer selected:', offer.brand);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cəmiyyət</Text>
        <Text style={styles.headerSubtitle}>Ən sərfəli təkliflər</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Burada axtar</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              category.active && styles.categoryButtonActive
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Ionicons 
              name={category.icon} 
              size={20} 
              color={category.active ? '#fff' : Colors.textSecondary} 
            />
            <Text style={[
              styles.categoryText,
              category.active && styles.categoryTextActive
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.offersSection}>
        <View style={styles.offersHeader}>
          <Ionicons name="star" size={20} color={Colors.warning} />
          <Text style={styles.offersTitle}>Ən sərfəli təkliflər</Text>
        </View>
        <Text style={styles.offersSubtitle}>Karto istifadəçilərinin 99%-i bu kartları seçir</Text>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.offersContainer}
        >
          {bestOffers.map((offer) => (
             <TouchableOpacity
               key={offer.id}
               style={[styles.offerCard, { backgroundColor: offer.color }]}
               onPress={() => handleOfferPress(offer)}
             >
               <View style={styles.offerCardHeader}>
                 {offer.image ? (
                   <Image 
                     source={offer.image} 
                     style={styles.offerImage}
                     resizeMode="contain"
                   />
                 ) : (
                   <Text style={styles.offerLogo}>{offer.logo}</Text>
                 )}
                 <Ionicons name="flame" size={16} color={Colors.warning} />
               </View>
               
               <View style={styles.offerCardContent}>
                 <Text style={[styles.offerBrand, { color: offer.accentColor }]}>
                   {offer.brand}
                 </Text>
                 <Text style={styles.offerPrice}>{offer.price}</Text>
               </View>
             </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.statsTitle}>Cəmiyyət statistikaları</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color={Colors.primary} />
            <Text style={styles.statNumber}>1,250</Text>
            <Text style={styles.statLabel}>Aktiv istifadəçi</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="gift" size={32} color={Colors.success} />
            <Text style={styles.statNumber}>5,680</Text>
            <Text style={styles.statLabel}>Hədiyyə kartı</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="storefront" size={32} color={Colors.warning} />
            <Text style={styles.statNumber}>150+</Text>
            <Text style={styles.statLabel}>Tərəfdaş mağaza</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={32} color={Colors.error} />
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Məmnuniyyət</Text>
          </View>
        </View>
      </View>

      <View style={styles.activitySection}>
        <Text style={styles.activityTitle}>Son fəaliyyət</Text>
        
        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="gift" size={20} color={Colors.primary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Yeni hədiyyə kartı yaradıldı</Text>
              <Text style={styles.activityTime}>2 saat əvvəl</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="star" size={20} color={Colors.warning} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Yeni təklif əlavə edildi</Text>
              <Text style={styles.activityTime}>4 saat əvvəl</Text>
            </View>
          </View>
          
          <View style={styles.activityItem}>
            <View style={styles.activityIcon}>
              <Ionicons name="people" size={20} color={Colors.success} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>Yeni istifadəçi qoşuldu</Text>
              <Text style={styles.activityTime}>6 saat əvvəl</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: '#fff',
  },
  offersSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  offersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  offersTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  offersSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  offersContainer: {
    gap: 16,
  },
  offerCard: {
    width: 160,
    height: 120,
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
  },
  offerCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  offerLogo: {
    fontSize: 32,
  },
  offerImage: {
    width: 40,
    height: 40,
  },
  offerCardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  offerBrand: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    marginBottom: 4,
  },
  offerPrice: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  activityList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
});
