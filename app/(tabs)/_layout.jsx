import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';

const HomeIcon = ({ color, size, focused }) => {
    const scale = useSharedValue(focused ? 1.2 : 1);
    const opacity = useSharedValue(focused ? 1 : 0);

    const animatedStyle = useAnimatedStyle(() => {
        scale.value = withSpring(focused ? 1.2 : 1, { damping: 15 });
        opacity.value = withSpring(focused ? 1 : 0, { damping: 20 });

        return {
            transform: [{ scale: scale.value }],
        };
    });

    const backgroundStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.regularTabIcon, animatedStyle]}>
            <Animated.View style={[styles.activeTabBackground, backgroundStyle]} />
            <Ionicons name="home" size={size} color={color} />
        </Animated.View>
    );
};

const WalletIcon = ({ color, size, focused }) => {
    const scale = useSharedValue(focused ? 1.2 : 1);
    const opacity = useSharedValue(focused ? 1 : 0);

    const animatedStyle = useAnimatedStyle(() => {
        scale.value = withSpring(focused ? 1.2 : 1, { damping: 15 });
        opacity.value = withSpring(focused ? 1 : 0, { damping: 20 });

        return {
            transform: [{ scale: scale.value }],
        };
    });

    const backgroundStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.regularTabIcon, animatedStyle]}>
            <Animated.View style={[styles.activeTabBackground, backgroundStyle]} />
            <Ionicons name="wallet" size={size} color={color} />
        </Animated.View>
    );
};

const QRIcon = ({ focused }) => {
    const scale = useSharedValue(focused ? 1.1 : 1);
    const rotation = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        scale.value = withSpring(focused ? 1.1 : 1, { damping: 12 });
        rotation.value = focused ? withSpring(360, { damping: 15 }) : withSpring(0, { damping: 15 });

        return {
            transform: [
                { scale: scale.value },
                { rotate: `${rotation.value}deg` }
            ],
        };
    });

    return (
        <View style={[styles.fabContainer]}>
            <Animated.View style={animatedStyle}>
                <LinearGradient
                    colors={focused ? [Colors.primary, '#5A9B7E'] : ['#FFFFFF', '#F8F9FA']}
                    style={[styles.qrButton]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons
                        name="qr-code"
                        size={30}
                        color={focused ? '#FFFFFF' : Colors.primary}
                    />
                </LinearGradient>
            </Animated.View>
        </View>
    );
};

const ProfileIcon = ({ color, size, focused }) => {
    const scale = useSharedValue(focused ? 1.2 : 1);
    const opacity = useSharedValue(focused ? 1 : 0);

    const animatedStyle = useAnimatedStyle(() => {
        scale.value = withSpring(focused ? 1.2 : 1, { damping: 15 });
        opacity.value = withSpring(focused ? 1 : 0, { damping: 20 });

        return {
            transform: [{ scale: scale.value }],
        };
    });

    const backgroundStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.regularTabIcon, animatedStyle]}>
            <Animated.View style={[styles.activeTabBackground, backgroundStyle]} />
            <Ionicons name="person" size={size} color={color} />
        </Animated.View>
    );
};

const CommunityIcon = ({ color, size, focused }) => {
    const scale = useSharedValue(focused ? 1.2 : 1);
    const opacity = useSharedValue(focused ? 1 : 0);

    const animatedStyle = useAnimatedStyle(() => {
        scale.value = withSpring(focused ? 1.2 : 1, { damping: 15 });
        opacity.value = withSpring(focused ? 1 : 0, { damping: 20 });

        return {
            transform: [{ scale: scale.value }],
        };
    });

    const backgroundStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[styles.regularTabIcon, animatedStyle]}>
            <Animated.View style={[styles.activeTabBackground, backgroundStyle]} />
            <Ionicons name="people" size={size} color={color} />
        </Animated.View>
    );
};

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: '#8E8E93',
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.9)' : '#FFFFFF',
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? 70 : 65,   
                    paddingBottom: Platform.OS === 'ios' ? 12 : 10, 
                    paddingTop: 8,
                    borderRadius: 18, 
                    marginHorizontal: 6, 
                    marginBottom: Platform.OS === 'ios' ? 15 : 12, 
                    position: 'absolute',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -4 },
                    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0.15,
                    shadowRadius: 12,
                    elevation: 10,
                    borderWidth: Platform.OS === 'ios' ? 1 : 0,
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    ...(Platform.OS === 'ios' && {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(20px)',
                    }),
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '700',
                    marginTop: 6,
                    letterSpacing: 0.3,
                },
                tabBarBackground: () => (
                    Platform.OS === 'ios' ? (
                        <BlurView
                            intensity={95}
                            tint="extraLight"
                            style={StyleSheet.absoluteFillObject}
                        />
                    ) : null
                ),
            }}>
            <Tabs.Screen
                name="home/index"
                options={{
                    title: 'Ana',
                    tabBarIcon: ({ color, size, focused }) => (
                        <HomeIcon color={color} size={size} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallets/index"
                options={{
                    title: 'Balans',
                    tabBarIcon: ({ color, size, focused }) => (
                        <WalletIcon color={color} size={size} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="qr/index"
                options={{
                    title: '',
                    tabBarIcon: ({ focused }) => (
                        <QRIcon focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile/index"
                options={{
                    title: 'Profil',
                    tabBarIcon: ({ color, size, focused }) => (
                        <ProfileIcon color={color} size={size} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="community/index"
                options={{
                    title: 'Cəmiyyət',
                    tabBarIcon: ({ color, size, focused }) => (
                        <CommunityIcon color={color} size={size} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    // Regular tab icons with subtle active background
    regularTabIcon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: 'transparent',
        position: 'relative',
    },
    activeTabBackground: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: `${Colors.primary}15`, // 15% opacity
        borderRadius: 12,
    },

    // FAB container for proper positioning
    fabContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 70,
        height: 60,
        marginTop: -35, // Lift above tab bar
    },

    // Main QR FAB button
    qrButton: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowOpacity: Platform.OS === 'ios' ? 0.25 : 0.3,
        shadowRadius: 12,
        elevation: 15,
        borderWidth: Platform.OS === 'ios' ? 3 : 2,
        borderColor: `${Colors.primary}20`,
        // Add gradient-like effect with multiple shadows
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 18,
            },
        }),
    },

    // Active state for QR button
    qrButtonActive: {
        backgroundColor: Colors.primary,
        transform: [{ scale: 1.1 }],
        shadowOpacity: Platform.OS === 'ios' ? 0.35 : 0.4,
        shadowRadius: 16,
        elevation: 20,
        borderColor: '#FFFFFF',
        borderWidth: 3,
        // Enhanced glow effect when active
        ...Platform.select({
            ios: {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
            },
            android: {
                elevation: 25,
            },
        }),
    },
});
