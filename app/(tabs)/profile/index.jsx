import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomAlertManager } from '../../../components/CustomAlert';
import { Colors, Fonts } from '../../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasGifts, setHasGifts] = useState(false);
  const [lastGift, setLastGift] = useState(null);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const loggedIn = await AsyncStorage.getItem('loggedIn');
      if (loggedIn !== 'true') {
        router.replace('/(auth)/login');
        return;
      }
      
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const giftsFlag = await AsyncStorage.getItem('hasGifts');
      setHasGifts(giftsFlag === 'true');
      const lastGiftStr = await AsyncStorage.getItem('lastGift');
      if (lastGiftStr) setLastGift(JSON.parse(lastGiftStr));
    } catch (error) {
      console.log('Auth check error:', error);
      router.replace('/(auth)/login');
    }
  }, [router]);

  const handleLogout = async () => {
    CustomAlertManager.show({
      title: 'Çıxış',
      message: 'Hesabınızdan çıxmaq istədiyinizə əminsiniz?',
      type: 'warning',
      buttons: [
        { text: 'Ləğv et', style: 'cancel' },
        {
          text: 'Çıx',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('loggedIn');
              await AsyncStorage.removeItem('user');
              router.replace('/(auth)/login');
            } catch (error) {
              console.log('Logout error:', error);
            }
          }
        }
      ]
    });
  };

  const recommendedCards = useMemo(() => ([
    {
      id: 1,
      title: 'Adidas',
      price: '50-100 ₼',
      image: require('../../../assets/images/adidas.png'),
      backgroundColor: '#F5F5F5',
    },
    {
      id: 2,
      title: 'Puma',
      price: '50-100 ₼',
      image: require('../../../assets/images/puma.png'),
      backgroundColor: '#F5F5F5',
    },
    {
      id: 3,
      title: 'Alinino',
      price: '25-50 ₼',
      image: require('../../../assets/images/alinino.png'),
      backgroundColor: '#E8F5E8',
    },
  ]), []);

  const handleBuyRecommend = (card) => {
    router.push({
      pathname: '/gift-purchase/selection',
      params: {
        brand: card.title,
        category: 'Tövsiyə',
        price: card.price,
      }
    });
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {!hasGifts ? (
          <>
            <View style={styles.emptyCardWrapper}>
              <View style={styles.emptyCard}>
                <Ionicons name="card" size={36} color={Colors.primary} />
                <Text style={styles.emptyText}>Hələ heçnə hədiyyə etməmisiniz</Text>
                <TouchableOpacity style={styles.emptyFixButton} onPress={() => router.push('/(tabs)/wallets')}>
                  <Text style={styles.emptyFixText}>Düzəltmək</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.segmentRow}>
                <View style={[styles.segmentBtn, styles.segmentActive]}>
                  <Text style={styles.segmentActiveText}>Göndərilib</Text>
                </View>
                <View style={[styles.segmentBtn, styles.segmentPassive]}>
                  <Text style={styles.segmentPassiveText}>Alınıb</Text>
                </View>
              </View>
            </View>

            <View style={styles.recommendHeader}>
              <Text style={styles.recommendTitle}>Tövsiyə edirik</Text>
            </View>
            <View style={styles.recommendList}>
              {recommendedCards.slice(0,3).map((card) => (
                <View key={card.id} style={{ marginBottom: 18 }}>
                  <View style={[styles.recommendCard, { backgroundColor: card.backgroundColor }]}>
                    <View style={styles.recommendCardTop}>
                      <Image source={card.image} style={styles.recommendImage} resizeMode="contain" />
                      <Ionicons name="flame" size={16} color={Colors.warning} />
                    </View>
                    <View style={styles.recommendBottom}>
                      <Text style={styles.recommendBrand}>{card.title}</Text>
                      <Text style={styles.recommendPrice}>{card.price}</Text>
                    </View>
                    <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyRecommend(card)}>
                      <Text style={styles.buyButtonText}>Satın al</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.recommendCaption}>“{card.title}”</Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <>
            <View style={styles.welcomeWrapper}>
              <Text style={styles.welcomeTitle}>Xoş gəldiniz, {user?.username || 'Username'}!</Text>
              <Text style={styles.balanceText}>Balansınız: <Text style={{ color: Colors.primary, fontFamily: Fonts.Poppins_SemiBold }}>500₼</Text></Text>
            </View>

            <View style={styles.tableCard}>
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Nömrə</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Alış tarixi</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Məbləğ</Text>
              </View>
              {([
                lastGift ? {id:'0001', date:new Date(lastGift.time).toLocaleDateString('az-AZ')+'\n'+new Date(lastGift.time).toLocaleTimeString('az-AZ', {hour:'2-digit', minute:'2-digit'}), amount:`${lastGift.amount}₼`, product:`${lastGift.brand}`, buyer:user?.username || '—'} : null,
                {id:'1821', date:'21.03.2025\n15:55', amount:'500₼', product:'Karto x Puma', buyer:'B.Əlişən'},
                {id:'1950', date:'27.03.2025\n14:55', amount:'50₼', product:'Karto x Alinino', buyer:'Y. Yaqub'},
              ].filter(Boolean)).map((row) => (
                <View key={row.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{row.id}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{row.date}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{row.amount}</Text>
                </View>
              ))}

              <View style={styles.subHeaderRow}>
                <Text style={[styles.subHeaderCell, { flex: 2 }]}>Məhsulun adı</Text>
                <Text style={[styles.subHeaderCell, { flex: 1 }]}>Alıcının adı</Text>
              </View>

              {([
                lastGift ? {product: lastGift.brand, buyer: user?.username || '—'} : null,
                {product: 'Karto x Puma', buyer: 'B.Əlişən'},
                {product: 'Karto x Alinino', buyer: 'Y. Yaqub'},
              ].filter(Boolean)).map((row, idx) => (
                <View key={idx} style={styles.subRow}>
                  <Text style={[styles.subCell, { flex: 2 }]}>{row.product}</Text>
                  <Text style={[styles.subCell, { flex: 1 }]}>{row.buyer}</Text>
                </View>
              ))}
            </View>

            <View style={styles.segmentRow}>
              <View style={[styles.segmentBtn, styles.segmentActive]}>
                <Text style={styles.segmentActiveText}>Göndərilib</Text>
              </View>
              <View style={[styles.segmentBtn, styles.segmentPassive]}>
                <Text style={styles.segmentPassiveText}>Alınıb</Text>
              </View>
            </View>

            <View style={styles.ctaRow}>
              <TouchableOpacity style={styles.addKartoBtn} onPress={() => router.push('/(tabs)/wallets')}>
                <Text style={styles.addKartoText}>“Karto” əlavə et</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutOutlined} onPress={handleLogout}>
                <Text style={styles.logoutOutlinedText}>Profildən çıxış</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.versionText}>KARTO v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 100,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  emptyCardWrapper: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  emptyCard: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    marginTop: 10,
    marginBottom: 12,
    color: Colors.primary,
    fontFamily: Fonts.Poppins_Regular,
  },
  emptyFixButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  emptyFixText: {
    color: Colors.primary,
    fontFamily: Fonts.Poppins_Regular,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: 10,
  },
  segmentBtn: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  segmentPassive: {
    backgroundColor: '#e8f3ec',
  },
  segmentActiveText: {
    color: '#fff',
    fontFamily: Fonts.Poppins_SemiBold,
  },
  segmentPassiveText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.Poppins_SemiBold,
  },

  recommendHeader: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  recommendTitle: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  recommendList: {
    paddingHorizontal: 20,
  },
  recommendCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recommendCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  recommendImage: {
    width: 40,
    height: 40,
  },
  recommendBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendBrand: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  recommendPrice: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  recommendCaption: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: Fonts.Poppins_Regular,
  },
  buyButton: {
    backgroundColor: Colors.primary,
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  buyButtonText: {
    color: '#fff',
    fontFamily: Fonts.Poppins_SemiBold,
  },

  welcomeWrapper: {
    paddingTop: 40,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary,
    marginBottom: 6,
  },
  balanceText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  tableCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e9e9e9',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableHeaderCell: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tableCell: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
  },
  subHeaderRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e9e9e9',
    marginTop: 8,
    paddingTop: 8,
  },
  subHeaderCell: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  subRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  subCell: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
  },

  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  addKartoBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderColor: Colors.textSecondary,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addKartoText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.Poppins_Regular,
  },
  logoutOutlined: {
    flex: 1,
    borderColor: Colors.error,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutOutlinedText: {
    color: Colors.error,
    fontFamily: Fonts.Poppins_Regular,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
