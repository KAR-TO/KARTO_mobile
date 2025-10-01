import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CustomAlertManager } from '../../../components/CustomAlert';
import { Colors, Fonts } from '../../../constants/theme';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);

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

  const menuItems = [
    {
      id: 'gift-cards',
      title: 'Hədiyyə kartlarım',
      icon: 'gift-outline',
      color: Colors.primary,
      onPress: () => console.log('Gift cards')
    },
    {
      id: 'transactions',
      title: 'Əməliyyatlar',
      icon: 'receipt-outline',
      color: Colors.warning,
      onPress: () => console.log('Transactions')
    },
    {
      id: 'notifications',
      title: 'Bildirişlər',
      icon: 'notifications-outline',
      color: Colors.error,
      onPress: () => console.log('Notifications')
    },
    {
      id: 'settings',
      title: 'Tənzimləmələr',
      icon: 'settings-outline',
      color: Colors.textSecondary,
      onPress: () => console.log('Settings')
    },
    {
      id: 'help',
      title: 'Yardım və Dəstək',
      icon: 'help-circle-outline',
      color: Colors.success,
      onPress: () => console.log('Help')
    },
    {
      id: 'about',
      title: 'Haqqımızda',
      icon: 'information-circle-outline',
      color: Colors.textSecondary,
      onPress: () => console.log('About')
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profil</Text>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.username || 'İstifadəçi'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          <Text style={styles.userPhone}>{user?.phone || '+994 50 123 45 67'}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Hədiyyə kartı</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Əməliyyat</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>250</Text>
            <Text style={styles.statLabel}>Xal</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Çıxış</Text>
        </TouchableOpacity>

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
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
  },
  userInfo: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: Fonts.Poppins_SemiBold,
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textPrimary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.error,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_SemiBold,
    color: '#fff',
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.Poppins_Regular,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
