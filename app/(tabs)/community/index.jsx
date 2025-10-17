import { useCallback, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeadsetIcon from 'react-native-vector-icons/FontAwesome5';
import BlurGradientBottomSheet from '../../../components/BlurGradientBottomSheet';
import CustomButton from '../../../components/CustomButton';
import { Colors, Fonts } from '../../../constants/theme';

import AdidasLogo from '../../../assets/images/adidas.png';
import AlininoLogo from '../../../assets/images/alinino.png';
import BanknoteIcon from '../../../assets/images/banknoteIcon3.png';
import DollarIcon from '../../../assets/images/dollarIcon3.png';
import KontaktLogo from '../../../assets/images/kontaktLogo.png';
import OliviaIcon from '../../../assets/images/oliviaLogo.png';
import PumaLogo from '../../../assets/images/puma.png';
import ThunderIcon from '../../../assets/images/thunderIcon3.png';

export default function CommunityScreen() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const openSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={OliviaIcon} style={styles.logo} />
        <Image source={KontaktLogo} style={styles.logo} />
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactHeader}>Bizlə biznes qurmaq istəyirsən?</Text>
        <Text style={styles.contactSubtitle}>Onda əməkdaş olaq!</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <CustomButton
          title="Partnyor ol"
          backgroundColor={Colors.primary}
          color="#fff"
          style={styles.ctaButton}
        />
        <CustomButton
          title="Daha ətraflı"
          onPress={openSheet}
          backgroundColor="#fff"
          borderColor={Colors.primary}
          color={Colors.primary}
          style={styles.ctaButton}
        />
      </View>

      <View style={styles.partnersContainer}>
        <Image source={AdidasLogo} style={styles.partnerLogo} />
        <Image source={AlininoLogo} style={styles.partnerLogo} />
        <Image source={PumaLogo} style={styles.partnerLogo} />
      </View>

      <TouchableOpacity activeOpacity={0.8} style={styles.chatbotContainer}>
        <HeadsetIcon name="headset" size={28} color={Colors.primary} />
        <Text style={styles.chatbotText}>Qaynar xəttimiz</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <BlurGradientBottomSheet
        visible={isSheetOpen}
        onClose={closeSheet}
        fullScreen
        colors={["#8DD9A3", "#6FBF87", "#55A46F"]}
      >
        <ScrollView contentContainerStyle={styles.sheetScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.sheetTitle}>Bəs nə üçün “Karto”?</Text>
          <Image source={DollarIcon} style={styles.sheetIcon} />
          <Text style={styles.sheetTitle}>Yeni satış kanalı</Text>
          <Text style={styles.sheetParagraph}>
            Müştəriləriniz üçün əlavə seçim, biznesiniz üçün əlavə gəlir. Karto ilə partnyor olaraq, brendinizə
            heç bir əlavə xərc olmadan hədiyyə kartları satmağa başlaya bilərsiniz.
          </Text>

          <Image source={ThunderIcon} style={styles.sheetIcon} />
          <Text style={styles.sheetTitle}>Ödənişsiz qoşulma</Text>
          <Text style={styles.sheetParagraph}>
            Heç bir komissiya, heç bir ilkin ödəniş yoxdur. Platformamıza qoşulmaq tamamilə pulsuzdur.
          </Text>

          <Image source={BanknoteIcon} style={styles.sheetIcon} />
          <Text style={styles.sheetTitle}>Sürətli və asan</Text>
          <Text style={styles.sheetParagraph}>
            Sadə interfeys və rahat idarəetmə paneli ilə prosesi bir neçə dəqiqəyə aktivləşdirə bilərsiniz.
          </Text>

          <Text style={[styles.sheetTitle, { marginTop: 30 }]}>Bizim partnyorlarımız</Text>
          <View style={styles.partnersContainer}>
            <Image source={AdidasLogo} style={styles.partnerLogo} />
            <Image source={PumaLogo} style={styles.partnerLogo} />
            <Image source={AlininoLogo} style={styles.partnerLogo} />
          </View>

          <Text style={styles.sheetParagraph}>
            Hal-hazırda 30-dan çox partnyorumuz mövcuddur. “Kontakt”-dan “Adidas”-a qədər brendlər arasında sən də
            ola bilərsən!
          </Text>

          <CustomButton
            title="Partnyor ol"
            onPress={closeSheet}
            style={{ marginTop: 24 }}
            backgroundColor="#55a064ff"
            color="#fff"
          />
        </ScrollView>
      </BlurGradientBottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
  },
  logo: { width: 130, height: 130, resizeMode: 'contain' },
  contactContainer: { marginTop: 30 },
  contactHeader: {
    fontSize: 21,
    fontFamily: Fonts.Poppins_SemiBold,
    textAlign: 'center',
  },
  contactSubtitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_Regular,
    color: '#212121',
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  ctaButton: { flex: 1 },
  partnersContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  partnerLogo: { width: 90, height: 70, resizeMode: 'contain' },
  chatbotContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#F8F8F8',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 30,
  },
  chatbotText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary,
    marginLeft: 10,
  },
  sheetScroll: { paddingBottom: 90, paddingHorizontal: 4 },
  sheetTitle: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: 20,
    color: '#ffffffff',
    textAlign: 'center',
    marginTop: 16,
  },
  sheetIcon: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginTop: 25,
    alignSelf: 'center',
  },
  sheetParagraph: {
    fontSize: 16,
    marginTop: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#ffffffff',
  },
});
