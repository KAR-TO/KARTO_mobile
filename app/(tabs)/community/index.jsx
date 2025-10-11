import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';
import OliviaIcon from '../../../assets/images/oliviaLogo.png';
import KontaktLogo from '../../../assets/images/kontaktLogo.png';
import AdidasLogo from '../../../assets/images/adidas.png';
import AlininoLogo from '../../../assets/images/alinino.png';
import PumaLogo from '../../../assets/images/puma.png';
import HeadsetIcon from 'react-native-vector-icons/FontAwesome5';

export default function CommunityScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={OliviaIcon} style={styles.logo} />
        <Image source={KontaktLogo} style={styles.logo} />
      </View>

      <View style={styles.contactContainer}>
        <Text style={styles.contactHeader}>Bizlə biznes qurmaq istəyirsən?</Text>
        <Text style={styles.contactSubtitle}>Onda əməkdaş olaq!</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: Colors.primary, width: 185 }]}
          onPress={() => {
            // Handle  button press
          }}
        >
          <Text style={[styles.buttonText, { color: 'white' }]}>Partnyor ol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.button, { backgroundColor: 'white', width: 185 }]}
          onPress={() => {
            // Handle  button press
          }}
        >
          <Text style={[styles.buttonText, { color: Colors.primary }]}>Daha ətraflı</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.addContainer}>
        <Image source={AdidasLogo} style={[styles.logo, { width: 100, height: 80 }]} />
        <Image source={AlininoLogo} style={[styles.logo, { width: 100, height: 80 }]} />
        <Image source={PumaLogo} style={[styles.logo, { width: 100, height: 80 }]} />
      </View>

      {/* <View style={styles.chatbotContainer}> */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.chatbotContainer}
        >
          <HeadsetIcon name="headset" size={28} color={Colors.primary} />
          <Text style={styles.chatbotText}>Qaynar xəttimiz</Text>
        </TouchableOpacity>
      {/* </View> */}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
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
    marginTop: 50,
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
    fontFamily: Fonts.regular,
    color: "#212121",
    textAlign: 'center',
  },
  buttonsContainer: {
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_SemiBold,
  },
  addContainer: {
    marginTop: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  chatbotContainer: {
    alignSelf: 'center',
    marginTop: 80,
    flexDirection: 'row',
  },
  chatbotText: {
    fontSize: 18,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.primary,
    marginLeft: 10,
  },

})