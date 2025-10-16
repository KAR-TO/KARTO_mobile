import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeadsetIcon from 'react-native-vector-icons/FontAwesome5';
import AdidasLogo from '../../../assets/images/adidas.png';
import AlininoLogo from '../../../assets/images/alinino.png';
import BanknoteIcon from '../../../assets/images/banknoteIcon.png';
import DollarIcon from '../../../assets/images/dollarIcon.png';
import KontaktLogo from '../../../assets/images/kontaktLogo.png';
import OliviaIcon from '../../../assets/images/oliviaLogo.png';
import PumaLogo from '../../../assets/images/puma.png';
import ThunderIcon from '../../../assets/images/thunderIcon.png';
import CustomButton from '../../../components/CustomButton';
import { Colors, Fonts } from '../../../constants/theme';

export default function CommunityScreen() {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const scrollViewRef = useRef(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardTranslateY = useRef(new Animated.Value(24)).current; // subtle internal rise
  const handleScale = useRef(new Animated.Value(0.8)).current;
  const dragY = useRef(new Animated.Value(0)).current;
  const onGestureEvent = useRef(
    Animated.event([{ nativeEvent: { translationY: dragY } }], { useNativeDriver: true })
  ).current;

  const handleMoreDetails = useCallback(() => {
    setIsMoreOpen(true);
  }, []);

  const handleCloseMore = useCallback(() => {
    setIsMoreOpen(false);
  }, []);

  // Animate modal content on open for an extra polished feel
  useEffect(() => {
    if (isMoreOpen) {
      dragY.setValue(0);
      Animated.parallel([
        Animated.timing(cardOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(cardTranslateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(handleScale, {
            toValue: 1,
            duration: 220,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(handleScale, {
            toValue: 0.96,
            duration: 120,
            useNativeDriver: true,
          }),
          Animated.timing(handleScale, {
            toValue: 1,
            duration: 120,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      // reset for next open
      cardOpacity.setValue(0);
      cardTranslateY.setValue(24);
      handleScale.setValue(0.8);
      dragY.setValue(0);
    }
  }, [isMoreOpen, cardOpacity, cardTranslateY, handleScale, dragY]);

  const handlePanStateChange = useCallback(
    (event) => {
      const { state, translationY, velocityY } = event.nativeEvent;
      if (state === State.END || state === State.CANCELLED || state === State.FAILED) {
        if (translationY > 120 || velocityY > 800) {
          // close on sufficient pull/down velocity
          handleCloseMore();
        } else {
          // spring back
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            speed: 14,
            bounciness: 6,
          }).start();
        }
      }
    },
    [dragY, handleCloseMore]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={OliviaIcon}
          style={styles.logo}
          accessible
          accessibilityLabel="Olivia partnyor loqosu"
        />
        <Image
          source={KontaktLogo}
          style={styles.logo}
          accessible
          accessibilityLabel="Kontakt partnyor loqosu"
        />
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactHeader}>Bizlə biznes qurmaq istəyirsən?</Text>
        <Text style={styles.contactSubtitle}>Onda əməkdaş olaq!</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <CustomButton
          title="Partnyor ol"
          // onPress={}
          backgroundColor={Colors.primary}
          color="#fff"
          style={styles.ctaButton}
        />
        <CustomButton
          title="Daha ətraflı"
          onPress={handleMoreDetails}
          backgroundColor="#fff"
          borderColor={Colors.primary}
          color={Colors.primary}
          style={styles.ctaButton}
        />
      </View>

      <View style={styles.partnersContainer}>
        <Image
          source={AdidasLogo}
          style={styles.partnerLogo}
          accessible
          accessibilityLabel="Adidas loqosu"
        />
        <Image
          source={AlininoLogo}
          style={styles.partnerLogo}
          accessible
          accessibilityLabel="Alinino loqosu"
        />
        <Image
          source={PumaLogo}
          style={styles.partnerLogo}
          accessible
          accessibilityLabel="Puma loqosu"
        />
      </View>

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.chatbotContainer}
      >
        <HeadsetIcon name="headset" size={28} color={Colors.primary} />
        <Text style={styles.chatbotText}>Qaynar xəttimiz</Text>
      </TouchableOpacity>

      {/* Slide-up Modal for "Daha ətraflı" */}
      <Modal
        isVisible={isMoreOpen}
        onBackdropPress={handleCloseMore}
        onBackButtonPress={handleCloseMore}
        onSwipeComplete={handleCloseMore}
        swipeDirection={['down']}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={320}
        animationOutTiming={250}
        backdropTransitionInTiming={200}
        backdropTransitionOutTiming={150}
        backdropOpacity={0.4}
        useNativeDriver
        useNativeDriverForBackdrop
        hideModalContentWhileAnimating={false}
        propagateSwipe
        scrollOffset={scrollOffset}
        scrollOffsetMax={Math.max(contentHeight - containerHeight, 0)}
        scrollTo={(p) => scrollViewRef.current?.scrollTo(p)}
        statusBarTranslucent
        style={styles.bottomModal}
        accessibilityLabel="Daha ətraflı məlumat pəncərəsi"
      >
        <Animated.View
          style={[
            styles.modalCard,
            {
              opacity: cardOpacity,
              transform: [
                {
                  translateY: Animated.add(
                    cardTranslateY,
                    dragY.interpolate({
                      inputRange: [-100, 0, 500],
                      outputRange: [-10, 0, 500],
                      extrapolate: 'clamp',
                    })
                  ),
                },
              ],
            },
          ]}
        >
          <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={handlePanStateChange}>
            <Animated.View
              style={[styles.modalHandleZone]}
              collapsable={false}
            >
              <Animated.View
                style={[styles.modalHandle, { transform: [{ scale: handleScale }] }]}
                accessibilityRole="adjustable"
                accessible
              />
            </Animated.View>
          </PanGestureHandler>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.modalScroll}
            showsVerticalScrollIndicator={false}
            onScroll={(e) => setScrollOffset(e.nativeEvent.contentOffset.y)}
            scrollEventThrottle={16}
            onContentSizeChange={(w, h) => setContentHeight(h)}
            onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Bəs nə üçün   “Karto” ?</Text>
              <Image
                source={DollarIcon}
                style={styles.modalLogo}
                accessible
                accessibilityLabel="Dollar loqosu"
              />
              <Text style={styles.modalTitle}>Yeni satış kanalı</Text>
              <Text style={styles.modalParagraph}>
                Müştəriləriniz üçün əlavə seçim, biznesiniz üçün əlavə gəlir. Karto ilə partnyor olaraq, brendinizə heç bir əlavə xərc olmadan hədiyyə kartları satmağa başlaya bilərsiniz. Bu, mövcud müştəri axınından maksimum fayda əldə etməyin sadə və effektiv yoludur.
              </Text>
              <Image
                source={ThunderIcon}
                style={styles.modalLogo}
                accessible
                accessibilityLabel="Thunder loqosu"
              />
              <Text style={styles.modalTitle}>Ödənişsiz qoşulma</Text>
              <Text style={styles.modalParagraph}>
                Heç bir komissiya, heç bir ilkin ödəniş yoxdur. Platformamıza qoşulmaq tamamilə pulsuzdur. Siz yalnız satış etdikdə qazanırsınız — heç bir gizli şərt və ya əlavə öhdəlik olmadan.
              </Text>

              <Image
                source={BanknoteIcon}
                style={styles.modalLogo}
                accessible
                accessibilityLabel="Banknote loqosu"
              />
              <Text style={styles.modalTitle}>Sürətli və asan</Text>
              <Text style={styles.modalParagraph}>
                Texniki çətinliklərə son.Biz hər şeyi sizin üçün sadələşdirmişik.Sadə interfeys, rahat idarəetmə paneli və dəqiq izləmə sistemi ilə prosesi bir neçə dəqiqəyə aktivləşdirə bilərsiniz. İstəyinizə uyğun dəstək və yönləndirmə ilə yanınızdayıq.
              </Text>
              <Text style={[styles.modalTitle, { marginTop: 30 }]}>Bizim partnyorlarımız</Text>
              <View style={styles.partnersContainer}>
                <Image
                  source={AdidasLogo}
                  style={styles.partnerLogo}
                />
                <Image
                  source={PumaLogo}
                  style={styles.partnerLogo}
                />
                <Image
                  source={AlininoLogo}
                  style={styles.partnerLogo}
                />

              </View>
              <Text style={styles.modalParagraph}>
                Hal-hazırda 30-dan çox partnyorumuz mövcuddur. “Kontakt”-dan “Adidas”-a qədər brend sırasına sən də qoşula bilərsən!</Text>
            </View>
            <CustomButton
              title="Partnyor ol"
              onPress={handleCloseMore}
              style={{ marginTop: 16 }}
            />
          </ScrollView>
        </Animated.View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  contactContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  contactHeader: {
    fontSize: 21,
    fontFamily: Fonts.Poppins_SemiBold,
    color: "black",
    textAlign: 'center',
    marginBottom: 10,
  },
  contactSubtitle: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_Regular,
    color: "#212121",
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 12,
  },
  ctaButton: {
    flex: 1,
  },
  partnersContainer: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  partnerLogo: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
  },
  hotlineContainer: {
    alignSelf: 'center',
    marginTop: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hotlineText: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary,
    marginLeft: 10,
  },
  chatbotContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#F0F0F0',
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 30,
  },
  chatbotText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary,
    marginLeft: 10,
  },

  // Modal styles
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    maxHeight: '100%',
  },
  modalHandle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  modalHandleZone: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  modalHeaderRow: {
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: 18,
    color: '#000',
  },
  modalLogo: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    marginTop: 30,
  },
  modalParagraph: {
    // fontFamily: Fonts.Poppins_Regular,
    fontSize: 18,
    marginTop: 20,
    lineHeight: 21,
    fontWeight: '200'
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: Colors.text,
  },
  modalScroll: {
    paddingBottom: 12,
  },
  bulletList: {
    marginTop: 12,
    rowGap: 6,
  },
  bulletItem: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: 15,
    color: Colors.text,
  },

})