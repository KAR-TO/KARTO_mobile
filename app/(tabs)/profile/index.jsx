import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddKartoIcon from '../../../assets/images/addKartoIcon.png';
import BackIcon from '../../../assets/images/backIcon.png';
import { CustomAlertManager } from '../../../components/CustomAlert';
import { Colors, Fonts } from '../../../constants/theme';
import BankNoteIcon from '../../../assets/images/banknoteIcon.png';
import GiftIcon from '../../../assets/images/giftIcon.png';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [hasGifts, setHasGifts] = useState(false);
  const [lastGift, setLastGift] = useState(null);
  const [activeSegment, setActiveSegment] = useState('sent');

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
              // Clear auth flags so app doesn't treat the user as logged in after reload
              await AsyncStorage.setItem('loggedIn', 'false');
              // Optionally clear session-specific data
              // await AsyncStorage.removeItem('user'); // Uncomment if you want full sign-out (no remembered user)

              // Reset local state
              setUser(null);

              router.replace('/(auth)/login');
            } catch (error) {
              console.log('Logout error:', error);
            }
          }
        }
      ]
    });
  };

  const handleClearGifts = async () => {
    CustomAlertManager.show({
      title: 'Hədiyyələri sil',
      message: 'Bütün hədiyyə məlumatlarını silmək istədiyinizə əminsiniz?',
      type: 'warning',
      buttons: [
        { text: 'Ləğv et', style: 'cancel' },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('hasGifts');
              await AsyncStorage.removeItem('lastGift');
              setHasGifts(false);
              setLastGift(null);
              CustomAlertManager.show({
                title: 'Uğurlu',
                message: 'Hədiyyə məlumatları silindi.',
                type: 'success'
              });
            } catch (error) {
              console.log('Clear gifts error:', error);
              CustomAlertManager.show({
                title: 'Xəta',
                message: 'Hədiyyə məlumatları silinərkən xəta baş verdi.',
                type: 'error'
              });
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!hasGifts ? (
          <>
            <View style={styles.emptyCardWrapper}>
              <View style={styles.emptyCard}>
                {activeSegment === 'sent' ? (
                  <Image source={BankNoteIcon} style={{ width: 100, height: 100 }} />
                ) : (
                  <Image source={GiftIcon} style={{ width: 100, height: 100 }} />
                )}

                <Text style={styles.emptyText}>
                  {activeSegment === 'sent' ? 'Hələ heçnə hədiyyə etməmisiniz' : 'Heç bir hədiyyə almamısınız'}
                </Text>

                <TouchableOpacity style={styles.emptyFixButton} onPress={() => router.push('/(tabs)/wallets')}>
                  <Text style={styles.emptyFixText}>Düzəltmək</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.segmentRow}>
                <TouchableOpacity onPress={() => setActiveSegment('sent')} style={[styles.segmentBtn, activeSegment === 'sent' && styles.segmentActive]}>
                  <Text style={styles.segmentActiveText}>Göndərilib</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveSegment('received')} style={[styles.segmentBtn, activeSegment === 'received' && styles.segmentActive]}>
                  <Text style={styles.segmentPassiveText}>Alınıb</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.recommendHeader}>
              <Text style={styles.recommendTitle}>Tövsiyə edirik</Text>
            </View>
            <View style={styles.recommendList}>
              {recommendedCards.slice(0, 3).map((card) => (
                <View key={card.id} style={{ marginBottom: 18 }}>
                  <View style={[styles.recommendCard, { backgroundColor: card.backgroundColor }]}>
                    <Text style={styles.recommendBrand}>{card.title}</Text>
                    <View style={styles.recommendCardTop}>
                      <Image source={card.image} style={styles.recommendImage} resizeMode="contain" />
                    </View>
                    <View style={styles.recommendPriceButton}>
                      <Text style={styles.recommendPrice}>{card.price}</Text>
                    </View>
                    <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyRecommend(card)}>
                      <Text style={styles.buyButtonText}>Satın al</Text>
                    </TouchableOpacity>
                  </View>
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
                lastGift ? { id: '0001', date: new Date(lastGift.time).toLocaleDateString('az-AZ') + '\n' + new Date(lastGift.time).toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }), amount: `${lastGift.amount}₼`, product: `${lastGift.brand}`, buyer: user?.username || '—' } : null,
                { id: '1821', date: '21.03.2025\n15:55', amount: '500₼', product: 'Karto x Puma', buyer: 'B.Əlişən' },
                { id: '1950', date: '27.03.2025\n14:55', amount: '50₼', product: 'Karto x Alinino', buyer: 'Y. Yaqub' },
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
                lastGift ? { product: lastGift.brand, buyer: user?.username || '—' } : null,
                { product: 'Karto x Puma', buyer: 'B.Əlişən' },
                { product: 'Karto x Alinino', buyer: 'Y. Yaqub' },
              ].filter(Boolean)).map((row, idx) => (
                <View key={idx} style={styles.subRow}>
                  <Text style={[styles.subCell, { flex: 2 }]}>{row.product}</Text>
                  <Text style={[styles.subCell, { flex: 1 }]}>{row.buyer}</Text>
                </View>
              ))}
            </View>

            <View style={styles.segmentRow}>
              <TouchableOpacity style={[styles.segmentBtn, styles.segmentActive]}>
                <Text style={styles.segmentActiveText}>Göndərilib</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.segmentBtn, styles.segmentPassive]}>
                <Text style={styles.segmentPassiveText}>Alınıb</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={styles.addKartoBtn}
                onPress={() => router.push('/(tabs)/wallets')}
              >
                <Image source={AddKartoIcon} style={styles.addKartoIcon} />
                <Text style={styles.addKartoText}>Karto əlavə et</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutOutlined} onPress={handleLogout}>
                <Image source={BackIcon} style={styles.backIcon} />
                {/* <Backicon name="log-out-outline" size={24} color={Colors.error} style={{ marginRight: 8 }} /> */}
                <Text style={styles.logoutOutlinedText}>Profildən çıxış</Text>
              </TouchableOpacity>
            </View>


            <View style={[{ alignItems: 'center', marginBottom: 20 }]}>
              <TouchableOpacity style={styles.clearGiftsBtn} onPress={handleClearGifts}>
                <Text style={styles.clearGiftsText}>Hədiyyələri sil (Test üçün)</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.versionText}>KARTO v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
    // paddingHorizontal: 16,
  },
  emptyCardWrapper: {
    marginHorizontal: 20,
    marginTop: Platform.OS === 'ios' ? 20 : 50,
  },
  emptyCard: {
    backgroundColor: '#F0F0F0',
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
    gap: 12,
  },
  segmentBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderColor: Colors.primary,
    borderWidth: 1,
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
    paddingHorizontal: 12,
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
    paddingHorizontal: 12,
  },
  recommendCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  recommendCardTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  recommendImage: {
    width: 150,
    height: 90,
  },
  recommendPriceButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  recommendBrand: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  recommendPrice: {
    fontSize: 20,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary,
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
    paddingTop: Platform.OS === 'ios' ? 30 : 50,
    alignItems: 'center',
    marginBottom: 10,
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
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
  gap: 12,                  // düymələr arası məsafə
  alignItems: 'center',
  marginTop: 32,
  marginBottom: 28,
  // paddingHorizontal: 16,
},

addKartoBtn: {
  flex: 1,                 // hər düymə eyni genişlikdə
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.primary,
  borderRadius: 14,
  paddingVertical: 14,
  // marginRight: 6,
},

  addKartoIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  addKartoText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  logoutOutlined: {
  flex: 1,                 // eyni genişlik
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1.3,
  borderColor: Colors.error,
  borderRadius: 14,
  paddingVertical: 14,
  // marginLeft: 6,
},
  backIcon: {
    width: 22,
    height: 22,
    marginRight: 6,
  },
  logoutOutlinedText: {
    color: Colors.error,
    fontSize: 15,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
