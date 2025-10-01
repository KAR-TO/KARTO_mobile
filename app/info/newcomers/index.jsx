import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Fonts } from '../../../constants/theme';

export default function NewcomersScreen() {
  const router = useRouter();

  const newcomers = [
    { id: 1, name: 'Leyla Məmmədova', joinDate: '2 gün əvvəl', avatar: '👩', points: 150 },
    { id: 2, name: 'Rəşad Əliyev', joinDate: '3 gün əvvəl', avatar: '👨', points: 200 },
    { id: 3, name: 'Aysel Həsənova', joinDate: '5 gün əvvəl', avatar: '👩', points: 300 },
    { id: 4, name: 'Elçin Rəhimov', joinDate: '1 həftə əvvəl', avatar: '👨', points: 450 },
    { id: 5, name: 'Günay Məmmədli', joinDate: '1 həftə əvvəl', avatar: '👩', points: 380 },
    { id: 6, name: 'Tural Qasımov', joinDate: '2 həftə əvvəl', avatar: '👨', points: 520 },
  ];

  const handleNewcomerPress = (newcomer) => {
    console.log('Newcomer selected:', newcomer.name);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yeni İstifadəçilər</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Yeni Qoşulanlar</Text>
        <Text style={styles.sectionSubtitle}>Platformaya yeni qoşulan istifadəçilər</Text>

        {newcomers.map((newcomer) => (
          <TouchableOpacity
            key={newcomer.id}
            style={styles.newcomerCard}
            onPress={() => handleNewcomerPress(newcomer)}
          >
            <View style={styles.newcomerInfo}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatar}>{newcomer.avatar}</Text>
              </View>
              <View style={styles.newcomerDetails}>
                <Text style={styles.newcomerName}>{newcomer.name}</Text>
                <Text style={styles.joinDate}>{newcomer.joinDate}</Text>
              </View>
            </View>
            <View style={styles.pointsContainer}>
              <Ionicons name="trophy" size={20} color={Colors.warning} />
              <Text style={styles.pointsText}>{newcomer.points}</Text>
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
  newcomerCard: {
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
  newcomerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatar: {
    fontSize: 24,
  },
  newcomerDetails: {
    flex: 1,
  },
  newcomerName: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.warning,
    marginLeft: 4,
  },
});