import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/theme';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: '#8E8E93',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#F2F2F7',
                    borderTopWidth: 0,
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                    borderRadius: 20,
                    marginHorizontal: 20,
                    marginBottom: 20,
                    position: 'absolute',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: -2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 8,
                },
            }}>
            <Tabs.Screen
                name="home/index"
                options={{
                    title: 'Ana',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallets/index"
                options={{
                    title: 'Balans',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="wallet" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="qr/index"
                options={{
                    title: 'QR',
                    tabBarIcon: ({ color, size, focused }) => (
                        <View style={[
                            styles.qrIconContainer,
                            focused && styles.qrIconContainerActive
                        ]}>
                            <Ionicons 
                                name="qr-code" 
                                size={focused ? 24 : size} 
                                color={focused ? '#fff' : color} 
                            />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="community/index"
                options={{
                    title: 'Cəmiyyət',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    qrIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qrIconContainerActive: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
});
